class ImageController {
  constructor(mainController) {
    this.mainController = mainController;
    this.frameModel = mainController.frameModel;
    this.mouseDown = false;
    this.count = 0;
    this.Labeling2DObject;
    this.canvasRectArray = [];
    this.image2DCanvas = mainController.mainView.image2DCanvasHTML;
    this.imageContext = this.image2DCanvas.getContext("2d");
    this.image2DCanvasOnly2D = mainController.mainView.image2DCanvasOnly2D;
    this.imageContextOnly2D = this.image2DCanvasOnly2D.getContext("2d");
    this.image2DCanvasBlurRects =
      mainController.mainView.image2DCanvasBlurRects;
    this.imageContextBlurRects = this.image2DCanvasBlurRects.getContext("2d");

    // this.image2DCanvasOnly2D = this.mainController.mainView.image2DCanvasOnly2D;
    // this.imageContextOnly2D = this.image2DCanvasOnly2D.getContext("2d");
    this.image2DCanvasForBlur = mainController.mainView.image2DCanvasForBlur;
    this.image2DCanvasForBlurContext =
      this.image2DCanvasForBlur.getContext("2d");
    this.isDraw2D = false;
    this.isCustomMode = false;
    this.isBlurMode = false;
    this.blurObject;
    this.blurArray = [];
    this.customPointIndex = null;
    this.blurRectsIndex = null;
    this.canvasRectsIndex = null;
    this.addEvents();
  }

  addEvents() {
    console.log("ImageController addEvents");

    document.getElementById("blurCreateBtn").addEventListener(
      "click",
      () => {
        this.reDrawObject();
        this.reDrawPoints();
        this.drawLabel2DAllNotSelect();
        this.isBlurMode = true;
        this.image2DCanvasOnly2D.style.zIndex = "2";
        this.image2DCanvasBlurRects.style.display = "block";
        this.image2DCanvasBlurRects.style.zIndex = "999";
        this.blurArray = [];
      },
      true
    );

    document.getElementById("polygonCreateBtn").addEventListener(
      "click",
      () => {
        console.log("polygonCreateBtn click!");
        console.log("isDraw2D true!");
        this.isDraw2D = true;
        this.image2DCanvasOnly2D.style.display = "block";
        this.image2DCanvasOnly2D.style.zIndex = "999";
        this.image2DCanvasBlurRects.style.zIndex = "2";
        this.canvasRectArray = [];
        this.imageContextOnly2D.lineWidth = 3;
        this.imageContextOnly2D.strokeStyle = "rgb(255,0,0)";
      },
      true
    );

    document.getElementById("blurSaveBtn").addEventListener(
      "click",
      () => {
        if (!this.mainController.frameModel.blurRects) {
          return;
        }
        this.saveImage();
      },
      true
    );

    document.addEventListener("keydown", (event) => {
      const KeyID = event.keyCode;
      switch (KeyID) {
        case 51: //digit3
          console.log("isDraw2D true!");
          this.isDraw2D = true;
          this.image2DCanvasOnly2D.style.display = "block";
          this.image2DCanvasOnly2D.style.zIndex = "999";
          this.image2DCanvasBlurRects.style.zIndex = "2";
          this.canvasRectArray = [];
          this.imageContextOnly2D.lineWidth = 3;
          this.imageContextOnly2D.strokeStyle = "rgb(255,0,0)";

          break;
        case 52: //digit4
          this.isDraw2D = false;
          this.image2DCanvasOnly2D.style.display = "block";
          this.image2DCanvasOnly2D.style.zIndex = "2";
          this.image2DCanvasBlurRects.style.zIndex = "2";
          let selectBox = this.mainController.frameModel.getSelectedBox();
          if (this.canvasRectArray.length >= 3) {
            this.Labeling2DObject = {
              name: "2DLabel",
              order: this.frameModel.canvasObjectIndex,
              geometry: this.canvasRectArray,
            };
            selectBox.boxModel.canvasRects.push(this.Labeling2DObject);
            this.frameModel.canvasObjectIndex++;
          }

          this.canvasRectArray = [];
          this.reDrawObject(selectBox.boxModel.canvasRects.length - 1);
          this.reDrawPoints();
          this.drawLabel2DAllNotSelect();

          break;

        case 53: //digit5
          this.reDrawObject();
          this.reDrawPoints();
          this.drawLabel2DAllNotSelect();
          this.isBlurMode = true;
          this.image2DCanvasOnly2D.style.zIndex = "2";
          this.image2DCanvasBlurRects.style.display = "block";
          this.image2DCanvasBlurRects.style.zIndex = "999";
          this.blurArray = [];
          break;

        case 54: //digit6 그리기모드 취소
          this.isBlurMode = false;
          this.image2DCanvasOnly2D.style.zIndex = "2";
          this.image2DCanvasBlurRects.style.zIndex = "999";
          this.blurArray = [];
          break;

        // case 55: //digit7 저장
        //   if (!this.mainController.frameModel.blurRects) {
        //     return;
        //   }
        //   this.saveImage();
        //   break;
      }
    });

    this.mainController.mainView.image2DCanvasOnly2D.addEventListener(
      "mousemove",
      (event) => {
        console.log("move!");
        this.onMouseMove(event);
      }
    );

    this.mainController.mainView.image2DCanvasOnly2D.addEventListener(
      "mousedown",
      (event) => {
        console.log("down!");
        this.onMouseDown(event);
      }
    );

    this.mainController.mainView.image2DCanvasOnly2D.addEventListener(
      "mouseup",
      (event) => {
        console.log("up!");
        this.onMouseUp(event);
      }
    );

    let onKeyDown2DLabelingHandler = (event) => {
      const KeyID = event.keyCode;
      console.log("KeyID", KeyID, event.target);
      switch (KeyID) {
        case 46: //delete
          this.deleteSelected2DPolygon();
          break;
      }
    };
    this.mainController.mainView.image2DCanvasOnly2D.addEventListener(
      "mouseenter",
      (event) => {
        this.mainController.eventController.keyEventController.removeKeyEvent();
        document.addEventListener("keydown", onKeyDown2DLabelingHandler, true);
      },
      true
    );

    this.mainController.mainView.image2DCanvasOnly2D.addEventListener(
      "mouseout",
      (event) => {
        this.mainController.eventController.keyEventController.addKeyEvent();
        document.removeEventListener(
          "keydown",
          onKeyDown2DLabelingHandler,
          true
        );
      },
      true
    );

    let onKeyDownBlurHandler = (event) => {
      const KeyID = event.keyCode;
      console.log("KeyID", KeyID, event.target);
      switch (KeyID) {
        case 46: //delete
          this.deleteSelectedBlurRect();
          break;
      }
    };

    this.mainController.mainView.image2DCanvasBlurRects.addEventListener(
      "mouseenter",
      (event) => {
        this.mainController.eventController.keyEventController.removeKeyEvent();
        document.addEventListener("keydown", onKeyDownBlurHandler, true);
      },
      true
    );

    this.mainController.mainView.image2DCanvasBlurRects.addEventListener(
      "mouseout",
      (event) => {
        this.mainController.eventController.keyEventController.addKeyEvent();
        document.removeEventListener("keydown", onKeyDownBlurHandler, true);
      },
      true
    );

    this.mainController.mainView.image2DCanvasBlurRects.addEventListener(
      "mousemove",
      (event) => {
        console.log("move!");
        let x = event.offsetX;
        let y = event.offsetY;
        x *=
          this.image2DCanvasBlurRects.width /
          this.image2DCanvasBlurRects.clientWidth;
        y *=
          this.image2DCanvasBlurRects.height /
          this.image2DCanvasBlurRects.clientHeight;

        if (this.isBlurMode && this.blurArray.length == 1) {
          console.log("this.blurArray", this.blurArray);
          this.imageContextBlurRects.clearRect(0, 0, 1920, 1200);
          this.drawAllBlurRects();
          if (this.blurArray.length < 2) {
            this.imageContextBlurRects.lineWidth = 3;
            this.imageContextBlurRects.strokeStyle = "#0000ff";
            this.imageContextBlurRects.beginPath();
            this.imageContextBlurRects.rect(
              this.blurArray[0].x,
              this.blurArray[0].y,
              x - this.blurArray[0].x,
              y - this.blurArray[0].y
            );
            this.imageContextBlurRects.stroke();
            this.imageContextBlurRects.closePath();
            this.getImageBlur();
          }
        }
      }
    );

    this.mainController.mainView.image2DCanvasBlurRects.addEventListener(
      "mousedown",
      async (event) => {
        console.log("down!");
        let x = event.offsetX;
        let y = event.offsetY;
        x *=
          this.image2DCanvasBlurRects.width /
          this.image2DCanvasBlurRects.clientWidth;
        y *=
          this.image2DCanvasBlurRects.height /
          this.image2DCanvasBlurRects.clientHeight;

        if (this.isBlurMode) {
          if (this.blurArray.length >= 2) {
            this.isBlurMode = false;
            return;
          }
          this.blurArray.push({ x: x, y: y });
          if (this.blurArray.length == 2) {
            this.blurObject = {
              name: "BlurRect",
              order: this.frameModel.canvasObjectIndex,
              geometry: this.blurArray,
            };
            this.mainController.frameModel.blurRects.push(this.blurObject);
            this.frameModel.canvasObjectIndex++;
            this.imageContextBlurRects.clearRect(0, 0, 1920, 1200);
            this.blurArray = [];
            this.drawAllBlurRects();
            this.getImageBlur();
          }
        } else {
          for (let j = 0; j < this.frameModel.blurRects.length; j++) {
            const blurRectArray = this.frameModel.blurRects[j].geometry;
            if (blurRectArray.length > 0) {
              const XYMinMax = await this.getXYMinMax(blurRectArray);
              console.log("XYMinMax", XYMinMax, blurRectArray, x, y);
              if (
                x > XYMinMax.xMin &&
                x < XYMinMax.xMax &&
                y > XYMinMax.yMin &&
                y < XYMinMax.yMax
              ) {
                console.log("조건 통과", j);
                this.blurRectsIndex = j;
                this.drawAllBlurRects(j);

                // for (let i = 0; i < this.canvasRectArray.length; i++) {
                //   if (
                //     x > this.canvasRectArray[i].x - 10 &&
                //     x < this.canvasRectArray[i].x + 10 &&
                //     y > this.canvasRectArray[i].y - 10 &&
                //     y > this.canvasRectArray[i].y + 10
                //   ) {
                //     // this.imageContext.fillStyle = "blue";
                //     this.image2DCanvasForBlurContext.fillRect(
                //       x - 20,
                //       y - 20,
                //       40,
                //       40
                //     );
                //     // this.isCustomMode = true;
                //     this.customPointIndex = i;
                //     console.log("i!!!", i);
                //   }
                // }
              }
            } else {
              this.blurRectsIndex = null;
              this.drawAllBlurRects();
            }
            this.getImageBlur();
          }
        }
      }
    );
  }

  onMouseMove(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    x *= this.image2DCanvasOnly2D.width / this.image2DCanvasOnly2D.clientWidth;
    y *=
      this.image2DCanvasOnly2D.height / this.image2DCanvasOnly2D.clientHeight;

    if (this.isDraw2D) {
      if (this.canvasRectArray.length > 0) {
        // this.initCanvas2D();
        this.imageContextOnly2D.clearRect(
          0,
          0,
          this.image2DCanvasOnly2D.width,
          this.image2DCanvasOnly2D.height
        );
        this.reDrawObject();

        this.drawIng(); //그리고 있는 도형의 미완성부분 및 점 그리기
        let prevPA = this.canvasRectArray[this.canvasRectArray.length - 1];
        this.imageContextOnly2D.beginPath();
        this.imageContextOnly2D.moveTo(prevPA.x, prevPA.y);
        this.imageContextOnly2D.lineTo(x, y);
        this.imageContextOnly2D.stroke();
        this.reDrawPoints();
        this.drawLabel2DAllNotSelect();
      }
    } else if (
      this.isCustomMode &&
      this.canvasRectsIndex != null &&
      this.customPointIndex != null
    ) {
      let selectBox = this.mainController.frameModel.getSelectedBox();
      selectBox.boxModel.canvasRects[this.canvasRectsIndex].geometry[
        this.customPointIndex
      ].x = x;
      selectBox.boxModel.canvasRects[this.canvasRectsIndex].geometry[
        this.customPointIndex
      ].y = y;
      this.reDrawObject(this.canvasRectsIndex);
      this.reDrawPoints();
      this.drawLabel2DAllNotSelect();
    }
  }

  async onMouseDown(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    x *= this.image2DCanvasOnly2D.width / this.image2DCanvasOnly2D.clientWidth;
    y *=
      this.image2DCanvasOnly2D.height / this.image2DCanvasOnly2D.clientHeight;

    if (this.isDraw2D) {
      this.canvasRectArray.push({ x: x, y: y });
      console.log("this.canvasRectArray", this.canvasRectArray);
    } else {
      let selectBox = this.mainController.frameModel.getSelectedBox();
      for (let j = 0; j < selectBox.boxModel.canvasRects.length; j++) {
        const canvasRectArray = selectBox.boxModel.canvasRects[j].geometry;
        if (canvasRectArray.length > 0) {
          const XYMinMax = await this.getXYMinMax(canvasRectArray);
          console.log("XYMinMax", XYMinMax, canvasRectArray, x, y);
          if (
            x > XYMinMax.xMin &&
            x < XYMinMax.xMax &&
            y > XYMinMax.yMin &&
            y < XYMinMax.yMax
          ) {
            console.log("조건 통과", j);
            this.canvasRectsIndex = j;
            this.reDrawObject(j);
            this.reDrawPoints();
            this.drawLabel2DAllNotSelect();
          } else {
            // this.reDrawObject();
          }

          for (let i = 0; i < canvasRectArray.length; i++) {
            if (
              x > canvasRectArray[i].x - 10 &&
              x < canvasRectArray[i].x + 10 &&
              y > canvasRectArray[i].y - 10 &&
              y < canvasRectArray[i].y + 10
            ) {
              // this.imageContext.fillStyle = "blue";
              this.customPointIndex = i;
              this.canvasRectsIndex = j;
              this.reDrawObject(j);
              this.reDrawPoints();
              this.drawLabel2DAllNotSelect();
              this.imageContextOnly2D.fillRect(
                canvasRectArray[i].x - 20,
                canvasRectArray[i].y - 20,
                40,
                40
              );
              this.isCustomMode = true;

              return;
            }
          }
        }
      }
    }

    // this.mouseDown = true;
  }

  onMouseUp(event) {
    if (this.isCustomMode) {
      this.isCustomMode = false;
      this.canvasRectsIndex = null;
      this.customPointIndex = null;
      // this.reDrawObject();
      // this.reDrawPoints();
    }
  }

  initCanvasOnly2D() {
    this.imageContextOnly2D.clearRect(
      0,
      0,
      this.image2DCanvasOnly2D.width,
      this.image2DCanvasOnly2D.height
    );
  }

  reDrawObject(selectedIndex) {
    this.initCanvasOnly2D();
    let selectBox = this.mainController.frameModel.getSelectedBox();
    if (selectBox.boxModel.canvasRects.length <= 0) {
      return;
    }

    for (let j = 0; j < selectBox.boxModel.canvasRects.length; j++) {
      const canvasRectArray = selectBox.boxModel.canvasRects[j].geometry;
      // if (canvasRectArray.length > 2) {
      this.imageContextOnly2D.beginPath();
      if (selectedIndex == j) {
        this.imageContextOnly2D.lineWidth = 7;
        this.imageContextOnly2D.strokeStyle = "#00ff00";
      } else {
        this.imageContextOnly2D.strokeStyle = "#0000ff";
      }

      for (let i = 0; i < canvasRectArray.length; i++) {
        this.imageContextOnly2D.moveTo(
          canvasRectArray[i].x,
          canvasRectArray[i].y
        );
        if (i != canvasRectArray.length - 1) {
          this.imageContextOnly2D.lineTo(
            canvasRectArray[i + 1].x,
            canvasRectArray[i + 1].y
          );
        } else {
          this.imageContextOnly2D.lineTo(
            canvasRectArray[0].x,
            canvasRectArray[0].y
          );
        }
        this.imageContextOnly2D.stroke();
      }
      this.imageContextOnly2D.closePath();
      // }
    }
  }

  reDrawPoints(color) {
    let selectBox = this.mainController.frameModel.getSelectedBox();
    for (let j = 0; j < selectBox.boxModel.canvasRects.length; j++) {
      const canvasRectArray = selectBox.boxModel.canvasRects[j].geometry;
      for (let i = 0; i < canvasRectArray.length; i++) {
        this.imageContextOnly2D.fillRect(
          canvasRectArray[i].x - 10,
          canvasRectArray[i].y - 10,
          20,
          20
        );
      }
    }
  }

  drawLabel2DAllNotSelect() {
    let selectBox = this.mainController.frameModel.getSelectedBox();
    for (let k = 0; k < this.mainController.frameModel.boxes.length; k++) {
      let box = this.mainController.frameModel.boxes[k];
      if (box == selectBox) {
        continue;
      }
      for (let j = 0; j < box.boxModel.canvasRects.length; j++) {
        const canvasRectArray = box.boxModel.canvasRects[j].geometry;
        // if (canvasRectArray.length > 2) {
        this.imageContextOnly2D.beginPath();
        this.imageContextOnly2D.strokeStyle = "#ff0000";

        for (let i = 0; i < canvasRectArray.length; i++) {
          this.imageContextOnly2D.moveTo(
            canvasRectArray[i].x,
            canvasRectArray[i].y
          );
          if (i != canvasRectArray.length - 1) {
            this.imageContextOnly2D.lineTo(
              canvasRectArray[i + 1].x,
              canvasRectArray[i + 1].y
            );
          } else {
            this.imageContextOnly2D.lineTo(
              canvasRectArray[0].x,
              canvasRectArray[0].y
            );
          }
          this.imageContextOnly2D.stroke();
        }
        this.imageContextOnly2D.closePath();
        // }
      }
    }
  }

  drawIng() {
    if (this.canvasRectArray.length > 1) {
      // this.imageContext.beginPath();
      for (let i = 0; i < this.canvasRectArray.length; i++) {
        // this.imageContext.lineWidth = 7;
        // this.imageContext.strokeStyle = color;

        this.imageContextOnly2D.moveTo(
          this.canvasRectArray[i].x,
          this.canvasRectArray[i].y
        );
        if (i != this.canvasRectArray.length - 1) {
          this.imageContextOnly2D.lineTo(
            this.canvasRectArray[i + 1].x,
            this.canvasRectArray[i + 1].y
          );
        }

        this.imageContextOnly2D.stroke();
      }

      // this.imageContext.closePath();
    }
    for (let i = 0; i < this.canvasRectArray.length; i++) {
      this.imageContextOnly2D.fillRect(
        this.canvasRectArray[i].x - 10,
        this.canvasRectArray[i].y - 10,
        20,
        20
      );
    }
  }
  async getXYMinMax(array) {
    let slaForMinMax = array.concat();
    let xMin = slaForMinMax.reduce(function (prev, curr) {
      return prev.x < curr.x ? prev : curr;
    });
    let xMax = slaForMinMax.reduce(function (prev, curr) {
      return prev.x > curr.x ? prev : curr;
    });
    let yMin = slaForMinMax.reduce(function (prev, curr) {
      return prev.y < curr.y ? prev : curr;
    });
    let yMax = slaForMinMax.reduce(function (prev, curr) {
      return prev.y > curr.y ? prev : curr;
    });

    return {
      xMin: xMin.x,
      xMax: xMax.x,
      yMin: yMin.y,
      yMax: yMax.y,
    };
  }

  initCanvasBlurRects() {
    this.image2DCanvasForBlurContext.clearRect(0, 0, 1920, 1200);
  }

  async drawAllBlurRects(selectedIndex) {
    console.log("drawAllBlurRects");
    this.initCanvasBlurRects();
    for (let i = 0; i < this.frameModel.blurRects.length; i++) {
      const blurArray = this.frameModel.blurRects[i].geometry;

      if (selectedIndex == i) {
        this.imageContextBlurRects.lineWidth = 5;
        this.imageContextBlurRects.strokeStyle = "#0000ff";
        this.imageContextBlurRects.beginPath();
        this.imageContextBlurRects.rect(
          blurArray[0].x,
          blurArray[0].y,
          blurArray[1].x - blurArray[0].x,
          blurArray[1].y - blurArray[0].y
        );
        this.imageContextBlurRects.stroke();
        this.imageContextBlurRects.closePath();
      } else {
        this.imageContextBlurRects.lineWidth = 3;
        this.imageContextBlurRects.strokeStyle = "#ff0000";
        this.imageContextBlurRects.beginPath();
        this.imageContextBlurRects.rect(
          blurArray[0].x,
          blurArray[0].y,
          blurArray[1].x - blurArray[0].x,
          blurArray[1].y - blurArray[0].y
        );
        this.imageContextBlurRects.stroke();
        this.imageContextBlurRects.closePath();
      }
    }
  }

  async getImageBlur() {
    // image2DCanvasForBlur.style.width = `${this.mainController.mainModel.imageWidth}px`;
    // image2DCanvasForBlur.style.height = `${this.mainController.mainModel.imageHeight}px`;
    this.image2DCanvasForBlurContext.clearRect(0, 0, 1920, 1200);
    for (let j = 0; j < this.frameModel.blurRects.length; j++) {
      const blurArray = this.frameModel.blurRects[j].geometry;
      const XYMinMax = await this.getXYMinMax(blurArray);
      var img = document.getElementById("img");
      this.image2DCanvasForBlurContext.filter = "blur(10px)";
      this.image2DCanvasForBlurContext.drawImage(
        img,
        XYMinMax.xMin,
        XYMinMax.yMin,
        XYMinMax.xMax - XYMinMax.xMin,
        XYMinMax.yMax - XYMinMax.yMin,
        XYMinMax.xMin,
        XYMinMax.yMin,
        XYMinMax.xMax - XYMinMax.xMin,
        XYMinMax.yMax - XYMinMax.yMin
      );
    }

    // this.image2DCanvasForBlurContext.drawImage(img, 500, 500, 1920, 1080);
    image2DCanvasForBlur.style.display = "block";
    image2DCanvasForBlur.style.width = `100%`;
    image2DCanvasForBlur.style.height = `100%`;
  }

  saveImage() {
    var img = document.getElementById("img");
    // var canvas2 = document.getElementById("image_2D_canvas_select");
    var canvasImg = document.getElementById("save_canvas");
    var ctx = canvasImg.getContext("2d");
    ctx.strokeStyle = "#ff0000";
    ctx.clearRect(0, 0, canvasImg.width, canvasImg.height);
    ctx.beginPath();
    ctx.drawImage(img, 0, 0, canvasImg.width, canvasImg.height);
    // ctx.drawImage(
    //   this.image2DCanvasBlurRects,
    //   0,
    //   0,
    //   canvasImg.width,
    //   canvasImg.height
    // );
    ctx.drawImage(
      this.image2DCanvasForBlur,
      0,
      0,
      canvasImg.width,
      canvasImg.height
    );
    // ctx.drawImage(canvas2,0,0,1792,1024);
    ctx.closePath();
    var imgDataUrl = canvasImg.toDataURL("image/png");
    // console.log("imgDataUrl",imgDataUrl);
    const data = imgDataUrl.replace(/^data:image\/\w+;base64,/, "");
    // const buf = Buffer.from(data, "base64");

    let url = imgDataUrl;
    var link = document.createElement("a");
    link.href = url;
    link.download = `${
      this.mainController.fileModel.imageFiles[
        this.mainController.frameModel.currentFrameIndex
      ].name
    }`;
    link.dispatchEvent(new MouseEvent("click"));
  }

  deleteSelectedBlurRect() {
    this.imageContextBlurRects.clearRect(0, 0, 1920, 1200);
    this.mainController.frameModel.blurRects.splice(this.blurRectsIndex, 1);
    this.drawAllBlurRects();
    this.getImageBlur();
  }

  deleteSelected2DPolygon() {
    let selectBox = this.mainController.frameModel.getSelectedBox();
    console.log("this.canvasRectsIndex", this.canvasRectsIndex);
    this.imageContextOnly2D.clearRect(0, 0, 1920, 1200);
    selectBox.boxModel.canvasRects.splice(this.canvasRectsIndex, 1);
    this.reDrawObject();
    this.reDrawPoints();
    this.drawLabel2DAllNotSelect();
  }

  /**
   * Draw Box in 2d Canvas
   * @param {isSelected String} text
   * @returns
   */
  async drawCubicOnImage(text) {
    if (this.frameModel.boxes == null || this.frameModel.boxes.length < 1) {
      return;
    }

    let image2DCanvas = this.mainController.mainView.image2DCanvasHTML;
    let image2DCanvasSelect =
      this.mainController.mainView.image2DCanvasSelectHTML;

    image2DCanvas.style.width = `${this.mainController.mainModel.imageWidth}px`;
    image2DCanvas.style.height = `${this.mainController.mainModel.imageHeight}px`;
    image2DCanvasSelect.style.width = `${this.mainController.mainModel.imageWidth}px`;
    image2DCanvasSelect.style.height = `${this.mainController.mainModel.imageHeight}px`;

    const imageContext = image2DCanvas.getContext("2d");
    const imageSelectContext = image2DCanvasSelect.getContext("2d");

    let lineArray = [];
    let selectBoxLineArray = [];

    //전체
    if (text == "NS") {
      imageContext.clearRect(0, 0, image2DCanvas.width, image2DCanvas.height);
    }
    for (let i = 0; i < this.frameModel.boxes.length; i++) {
      let box = this.frameModel.boxes[i];

      //선택된 박스
      if (i == this.frameModel.selectedBoxIndex && text == undefined) {
        imageSelectContext.clearRect(
          0,
          0,
          image2DCanvasSelect.width,
          image2DCanvasSelect.height
        );
        imageSelectContext.lineWidth = 3;
        imageSelectContext.strokeStyle = "#4AA8D8";

        var lineXArray = [];
        var lineYArray = [];

        for (var k = 0; k < box.boxModel.geometry.length; k++) {
          var point = Lidar2ImageManager.lidar2Image(
            box.boxModel.geometry[k].z,
            box.boxModel.geometry[k].x,
            box.boxModel.geometry[k].y
          );
          selectBoxLineArray.push(point);
          lineXArray.push(point.x);
          lineYArray.push(point.y);
        }

        if (MainModel.isCuboid) {
          let slaForMinMax = selectBoxLineArray.concat();
          let cuboidMinX = slaForMinMax.reduce(function (prev, curr) {
            return prev.x < curr.x ? prev : curr;
          });

          let cuboidMaxX = slaForMinMax.reduce(function (prev, curr) {
            return prev.x > curr.x ? prev : curr;
          });

          let cuboidMinY = slaForMinMax.reduce(function (prev, curr) {
            return prev.y < curr.y ? prev : curr;
          });

          let cuboidMaxY = slaForMinMax.reduce(function (prev, curr) {
            return prev.y > curr.y ? prev : curr;
          });

          if (
            cuboidMinX.x < -4000 ||
            cuboidMaxX.x >= 4000 ||
            cuboidMinY.y < -4000 ||
            cuboidMaxY.y >= 4000
          ) {
          } else {
            imageSelectContext.beginPath();

            // console.log("selectBoxLineArray",selectBoxLineArray);
            imageSelectContext.moveTo(
              selectBoxLineArray[0].x,
              selectBoxLineArray[0].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[1].x,
              selectBoxLineArray[1].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[0].x,
              selectBoxLineArray[0].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[2].x,
              selectBoxLineArray[2].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[0].x,
              selectBoxLineArray[0].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[4].x,
              selectBoxLineArray[4].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[6].x,
              selectBoxLineArray[6].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[2].x,
              selectBoxLineArray[2].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[6].x,
              selectBoxLineArray[6].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[4].x,
              selectBoxLineArray[4].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[6].x,
              selectBoxLineArray[6].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[7].x,
              selectBoxLineArray[7].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[5].x,
              selectBoxLineArray[5].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[1].x,
              selectBoxLineArray[1].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[5].x,
              selectBoxLineArray[5].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[4].x,
              selectBoxLineArray[4].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[5].x,
              selectBoxLineArray[5].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[7].x,
              selectBoxLineArray[7].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[3].x,
              selectBoxLineArray[3].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[1].x,
              selectBoxLineArray[1].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[3].x,
              selectBoxLineArray[3].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[2].x,
              selectBoxLineArray[2].y
            );
            imageSelectContext.stroke();

            imageSelectContext.moveTo(
              selectBoxLineArray[3].x,
              selectBoxLineArray[3].y
            );
            imageSelectContext.lineTo(
              selectBoxLineArray[7].x,
              selectBoxLineArray[7].y
            );
            imageSelectContext.stroke();

            imageSelectContext.closePath();
          }
          selectBoxLineArray = [];
        }

        if (MainModel.isBox2D) {
          imageSelectContext.beginPath();

          let maxLineXArray = Math.max.apply(Math, lineXArray);
          let minLineXArray = Math.min.apply(Math, lineXArray);

          let maxLineYArray = Math.max.apply(Math, lineYArray);
          let minLineYArray = Math.min.apply(Math, lineYArray);

          imageSelectContext.moveTo(minLineXArray, minLineYArray);
          imageSelectContext.lineTo(maxLineXArray, minLineYArray);
          imageSelectContext.stroke();

          imageSelectContext.moveTo(maxLineXArray, minLineYArray);
          imageSelectContext.lineTo(maxLineXArray, maxLineYArray);
          imageSelectContext.stroke();

          imageSelectContext.moveTo(maxLineXArray, maxLineYArray);
          imageSelectContext.lineTo(minLineXArray, maxLineYArray);
          imageSelectContext.stroke();

          imageSelectContext.moveTo(minLineXArray, maxLineYArray);
          imageSelectContext.lineTo(minLineXArray, minLineYArray);
          imageSelectContext.stroke();
          imageSelectContext.closePath();
        }
      } else if (i != this.frameModel.selectedBoxIndex && text == "NS") {
        imageContext.lineWidth = 3;
        imageContext.strokeStyle = "#ff0000";
        var lineXArray = [];
        var lineYArray = [];
        lineArray = [];

        for (var k = 0; k < box.boxModel.geometry.length; k++) {
          var point = Lidar2ImageManager.lidar2Image(
            box.boxModel.geometry[k].z,
            box.boxModel.geometry[k].x,
            box.boxModel.geometry[k].y
          );
          lineArray.push(point);
          lineXArray.push(point.x);
          lineYArray.push(point.y);
        }
        if (MainModel.isCuboid) {
          let slaForMinMax = lineArray.concat();
          let cuboidMinX = slaForMinMax.reduce(function (prev, curr) {
            return prev.x < curr.x ? prev : curr;
          });

          let cuboidMaxX = slaForMinMax.reduce(function (prev, curr) {
            return prev.x > curr.x ? prev : curr;
          });

          let cuboidMinY = slaForMinMax.reduce(function (prev, curr) {
            return prev.y < curr.y ? prev : curr;
          });

          let cuboidMaxY = slaForMinMax.reduce(function (prev, curr) {
            return prev.y > curr.y ? prev : curr;
          });

          if (
            cuboidMinX.x < -4000 ||
            cuboidMaxX.x >= 4000 ||
            cuboidMinY.y < -4000 ||
            cuboidMaxY.y >= 4000
          ) {
            // imageSelectContext.clearRect(0, 0, image2DCanvasSelect.width, image2DCanvasSelect.height);
            console.log("넘어감");
          } else {
            imageContext.beginPath();

            imageContext.moveTo(lineArray[0].x, lineArray[0].y);
            imageContext.lineTo(lineArray[1].x, lineArray[1].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[0].x, lineArray[0].y);
            imageContext.lineTo(lineArray[2].x, lineArray[2].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[0].x, lineArray[0].y);
            imageContext.lineTo(lineArray[4].x, lineArray[4].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[6].x, lineArray[6].y);
            imageContext.lineTo(lineArray[2].x, lineArray[2].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[6].x, lineArray[6].y);
            imageContext.lineTo(lineArray[4].x, lineArray[4].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[6].x, lineArray[6].y);
            imageContext.lineTo(lineArray[7].x, lineArray[7].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[5].x, lineArray[5].y);
            imageContext.lineTo(lineArray[7].x, lineArray[7].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[5].x, lineArray[5].y);
            imageContext.lineTo(lineArray[1].x, lineArray[1].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[5].x, lineArray[5].y);
            imageContext.lineTo(lineArray[4].x, lineArray[4].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[3].x, lineArray[3].y);
            imageContext.lineTo(lineArray[1].x, lineArray[1].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[3].x, lineArray[3].y);
            imageContext.lineTo(lineArray[2].x, lineArray[2].y);
            imageContext.stroke();

            imageContext.moveTo(lineArray[3].x, lineArray[3].y);
            imageContext.lineTo(lineArray[7].x, lineArray[7].y);

            imageContext.stroke();
            imageContext.closePath();
          }

          lineArray = [];
        }

        if (MainModel.isBox2D) {
          imageContext.beginPath();

          let maxLineXArray = Math.max.apply(Math, lineXArray);
          let minLineXArray = Math.min.apply(Math, lineXArray);

          let maxLineYArray = Math.max.apply(Math, lineYArray);
          let minLineYArray = Math.min.apply(Math, lineYArray);

          imageContext.moveTo(minLineXArray, minLineYArray);
          imageContext.lineTo(maxLineXArray, minLineYArray);
          imageContext.stroke();

          imageContext.moveTo(maxLineXArray, minLineYArray);
          imageContext.lineTo(maxLineXArray, maxLineYArray);
          imageContext.stroke();

          imageContext.moveTo(maxLineXArray, maxLineYArray);
          imageContext.lineTo(minLineXArray, maxLineYArray);
          imageContext.stroke();

          imageContext.moveTo(minLineXArray, maxLineYArray);
          imageContext.lineTo(minLineXArray, minLineYArray);
          imageContext.stroke();
          imageContext.closePath();
        }
      }
    }

    image2DCanvas.style.display = "block";
    image2DCanvas.style.width = "100%";
    image2DCanvas.style.height = "100%";
    image2DCanvasSelect.style.display = "block";
    image2DCanvasSelect.style.width = "100%";
    image2DCanvasSelect.style.height = "100%";
    return "ok";
  }

  async initCanvas2D() {
    let image2DCanvas = this.mainController.mainView.image2DCanvasHTML;
    let image2DCanvasSelect =
      this.mainController.mainView.image2DCanvasSelectHTML;
    const imageContext = image2DCanvas.getContext("2d");
    const imageSelectContext = image2DCanvasSelect.getContext("2d");
    imageContext.clearRect(0, 0, image2DCanvas.width, image2DCanvas.height);
    imageSelectContext.clearRect(
      0,
      0,
      image2DCanvasSelect.width,
      image2DCanvasSelect.height
    );
  }
}
