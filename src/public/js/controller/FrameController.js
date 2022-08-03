class FrameController {
  constructor(mainController, frameModel) {
    this.mainController = mainController;
    this.frameModel = frameModel;
    this.fileModel = mainController.fileModel;
    this.fileController = mainController.fileController;
    this.mainView = mainController.mainView;
    this.anchorTrackingId = null;
    this.addEvent();
  }

  addEvent() {
    try {
      // this.mainView
      //   .findById("prev_btn")
      //   .addEventListener("click", () => this.prevFrame());

      // this.mainView
      //   .findById("next_btn")
      //   .addEventListener("click", () => this.nextFrame());

      this.mainView.frameIndexInput.addEventListener(
        "focus",
        (event) => {
          this.mainController.eventController.keyEventController.removeKeyEvent();
        },
        true
      );

      this.mainView.frameIndexInput.addEventListener(
        "blur",
        (event) => {
          this.mainController.eventController.keyEventController.addKeyEvent();
        },
        true
      );

      // this.mainView.trackingIDInput.addEventListener(
      //   "focus",
      //   (event) => {
      //     this.mainController.eventController.keyEventController.removeKeyEvent();
      //   },
      //   true
      // );

      // this.mainView.trackingIDInput.addEventListener(
      //   "blur",
      //   (event) => {
      //     this.mainController.eventController.keyEventController.addKeyEvent();
      //   },
      //   true
      // );

      // this.mainView.subTrackingIDInput.addEventListener(
      //   "focus",
      //   (event) => {
      //     this.mainController.eventController.keyEventController.removeKeyEvent();
      //   },
      //   true
      // );

      // this.mainView.subTrackingIDInput.addEventListener(
      //   "blur",
      //   (event) => {
      //     this.mainController.eventController.keyEventController.addKeyEvent();
      //   },
      //   true
      // );

      this.mainView.frameIndexInput.addEventListener(
        "keydown",
        (event) => {
          const KeyID = event.keyCode;
          console.log("KeyID", KeyID);

          switch (KeyID) {
            case 13: //enter
              this.certainFrame(this.mainView.frameIndexInput.value);
              break;
          }
          // if(event.)
        },
        true
      );

      document.getElementById("frameLeftButton").addEventListener(
        "click",
        (event) => {
          this.prevFrame();
        },
        true
      );

      document.getElementById("frameRightButton").addEventListener(
        "click",
        (event) => {
          this.nextFrame();
        },
        true
      );
    } catch (e) {
      console.error(e);
    }

    document.getElementById("frameCompare").addEventListener(
      "click",
      (event) => {
        let popupOpenBtn = document.querySelector("#frameCompare");
        let popupLayle = document.querySelector(".popup_layer");
        let popupCloseBtn = document.querySelector(".popup_layer .close_btn");
        popupOpenBtn.addEventListener("click", () => {
          popupLayle.classList.add("active");
        });

        popupCloseBtn.addEventListener("click", () => {
          popupLayle.classList.remove("active");
        });
      },
      false
    );
    // this.mainController.layout.popupOnOff();
    document.getElementById("saveJson").addEventListener(
      "click",
      (event) => {
        this.mainController.fileController.saveJson();
      },
      true
    );
  }

  async deleteSelectedBox() {
    let selectedBox = this.frameModel.getSelectedBox();
    if (!selectedBox) return;
    let image2DCanvas = this.mainController.mainView.image2DCanvasHTML;
    let image2DCanvasSelect =
      this.mainController.mainView.image2DCanvasSelectHTML;
    const imageContext = image2DCanvas.getContext("2d");
    const imageSelectContext = image2DCanvasSelect.getContext("2d");
    if (selectedBox) {
      // if (scene.getObjectByName("greenmesh")) {
      //   scene.remove(scene.getObjectByName("greenmesh"));
      //   greenmesh.geometry.dispose();
      //   greenmesh.material.dispose();
      // }
      // selectedBox.removeAll();

      // removes selected box from array of bounding boxes
      for (var i = 0; i < this.frameModel.boxes.length; i++) {
        if (this.frameModel.boxes[i] == selectedBox) {
          this.mainController.sceneModel.scene.remove(
            this.frameModel.boxes[i].boxModel.box3
          );

          this.mainController.sceneModel.scene.remove(
            this.frameModel.boxes[i].boxModel.box3Helper
          );

          this.mainController.sceneModel.scene.remove(
            this.frameModel.boxes[i].boxModel.box3Lidar
          );

          this.mainController.sceneModel.scene.remove(
            this.frameModel.boxes[i].boxModel.box3HelperLidar
          );
          this.frameModel.boxes.splice(i, 1);
          break;
        }
      }

      if (this.frameModel.boxes.length > 0) {
        this.frameModel.setSelectBox(this.frameModel.boxes.length - 1);
        selectedBox = this.frameModel.getSelectedBox();
        console.log(
          "this.frameModel.boxes.length - 1",
          this.frameModel.boxes.length - 1,
          selectedBox
        );
        selectedBox.select();
      }

      this.mainController.mainView.boxListsHTML.innerHTML = "";
      for (let i = 0; i < this.frameModel.boxes.length; i++) {
        let box = this.frameModel.boxes[i];
        box.boxListController.addList();
      }
    }

    if (this.frameModel.boxes.length == 0) {
      imageSelectContext.clearRect(
        0,
        0,
        image2DCanvasSelect.width,
        image2DCanvasSelect.height
      );
      // imageSelectContext.beginPath();
      imageContext.clearRect(0, 0, image2DCanvas.width, image2DCanvas.height);
      this.mainController.pointCloudController.checkPointsInSelectedBox();
      this.mainController.pointCloudController.checkPointsInSelectedBox_Lidar();
    } else {
      imageSelectContext.clearRect(
        0,
        0,
        image2DCanvasSelect.width,
        image2DCanvasSelect.height
      );
      imageContext.clearRect(0, 0, image2DCanvas.width, image2DCanvas.height);
      await this.mainController.imageController.drawCubicOnImage();
      await this.mainController.imageController.drawCubicOnImage("NS");
    }

    this.mainController.pointCloudController.checkPointsInSelectedBox();
    this.mainController.pointCloudController.checkPointsInSelectedBox_Lidar();
    this.mainController.pointCloudController.checkPointsInAllBox();
    this.mainController.pointCloudController.checkPointsInAllBox_Lidar();

    // let positions = pointcloud.geometry.attributes.position.array;
    // console.log("positions", positions);
    // for (let i = 0; i < positions.length; i += 3) {
    //   pointcloud.geometry.attributes.color.array[i] = 255;
    //   pointcloud.geometry.attributes.color.array[i + 1] = 255;
    //   pointcloud.geometry.attributes.color.array[i + 2] = 255;
    // }
    // pointcloud.geometry.attributes.color.needsUpdate = true;

    // 색칠된 포인트클라우드 색 되돌리기
    // let positions = pointcloud.geometry.attributes.position.array;
    // let colorpositions = pointcloud.geometry.attributes.color.array;

    // for(let i =0; i<positions.length; i += 3){
    //     if(colorpositions[i] == 0 && colorpositions[i+1] == 0.5 && colorpositions[i+2] == 0){
    //     colorpositions[i] = 255;
    //     colorpositions[i+1] = 255;
    //     colorpositions[i+2] = 255;
    //     }
    // }
  }

  async prevFrame() {
    if (this.frameModel.currentFrameIndex - 1 < 0) {
      alert("no frame");
      return;
    }

    document.getElementById("cut").style.display = "block";
    // await this.mainController.fileController.saveJson();
    this.mainController.sceneController.sceneInit();

    this.frameModel.currentFrameIndex--;

    await this.afterFrameMove();
  }

  async nextFrame() {
    console.log("nextFrame!");
    if (
      this.frameModel.currentFrameIndex + 1 >
      this.fileModel.imageFiles.length - 1
    ) {
      alert("no frame");
      return;
    }

    document.getElementById("cut").style.display = "block";
    // await this.mainController.fileController.saveJson();
    this.mainController.sceneController.sceneInit();
    this.frameModel.currentFrameIndex++;

    await this.afterFrameMove();
  }

  async certainFrame(index) {
    if (index > this.fileModel.imageFiles.length || index < 0) {
      return;
    }
    // if (isMoveFrameReady == false) {
    //   return;
    // }
    // isMoveFrameReady = false;

    // zoom.style.transform = "scale(" + 1 + ")";
    // scale = 1;
    // pointX = 0;
    // pointY = 0;

    // isFrameMoveMainCameraMove = false;

    document.getElementById("cut").style.display = "block";
    // await this.mainController.fileController.saveJson();
    this.mainController.sceneController.sceneInit();

    this.frameModel.currentFrameIndex = index;
    // if (
    //   (this.frameModel.currentFrameIndex +=
    //     1 >= this.fileModel.imageFiles.length - 1)
    // ) {
    //   return;
    // }
    await this.afterFrameMove();
  }

  async afterFrameMove() {
    this.mainController.imageController.initCanvasOnly2D();
    this.mainController.imageController.initCanvasBlurRects();
    this.mainController.imageController.initCanvas2D();
    this.mainController.mainView.boxListsHTML.innerHTML = "";
    this.mainController.frameModel.boxIdIndex = 1;

    const ImageReader = new FileReader();
    ImageReader.onload = (event) => {
      this.mainView.imageHTML.src = event.target.result;
    };

    ImageReader.readAsDataURL(
      this.fileModel.imageFiles[this.frameModel.currentFrameIndex]
    );

    this.mainView.frameIndex.innerText = `${
      this.frameModel.currentFrameIndex
    } / ${this.fileModel.imageFiles.length - 1}`;

    const raderReader = new FileReader();
    raderReader.onload = (event) => {
      this.mainController.pointCloudController.load_PCD_file(
        event.target.result
      );
    };
    raderReader.readAsDataURL(
      this.mainController.fileModel.radarFiles[
        this.frameModel.currentFrameIndex
      ]
    );

    const lidarReader = new FileReader();
    lidarReader.onload = (event) => {
      this.mainController.pointCloudController.load_PCD_file_Lidar(
        event.target.result
      );
    };
    lidarReader.readAsDataURL(
      this.mainController.fileModel.lidarFiles[
        this.frameModel.currentFrameIndex
      ]
    );

    this.frameModel.boxes = [];
    this.frameModel.blurRects = [];

    await this.loadDataFromFile();

    document.getElementById("cut").style.display = "none";
  }

  async loadDataFromFile() {
    const jsonPath = `${this.fileModel.resultPath}/${
      this.fileModel.imageFiles[this.frameModel.currentFrameIndex].name.split(
        ".png"
      )[0]
    }.json`;

    const blurPath = `${this.fileModel.blurPath}/${
      this.fileModel.imageFiles[this.frameModel.currentFrameIndex].name.split(
        ".png"
      )[0]
    }.json`;

    await this.fileController.parseResultJson(jsonPath);
    await this.fileController.parseBlurJson(blurPath);
  }

  async getSelectedBoxUsingKey(keyName) {
    var tablength = this.frameModel.boxes.length;
    if (tablength == 0 || tablength == 1) {
      return;
    }
    switch (keyName) {
      case "tab": //tab
        this.frameModel.selectedBoxIndex++;
        if (this.frameModel.selectedBoxIndex >= tablength) {
          this.frameModel.selectedBoxIndex = 0;
        }
        break;

      case "~":
        this.frameModel.selectedBoxIndex--;
        if (this.frameModel.selectedBoxIndex <= -1) {
          this.frameModel.selectedBoxIndex = tablength - 1;
        }
        break;
    }

    this.frameModel.setSelectBox(this.frameModel.selectedBoxIndex);
    let box = this.frameModel.getSelectedBox();
    box.select();
    console.log("selbox", box, this.frameModel.selectedBoxIndex);
    this.mainController.pointCloudController.checkPointsInSelectedBox();
    this.mainController.pointCloudController.checkPointsInAllBox();
    this.mainController.pointCloudController.checkPointsInSelectedBox_Lidar();
    this.mainController.pointCloudController.checkPointsInAllBox_Lidar();
  }

  async saveBoxValue() {
    // for(let i=0; i<evaluation.get_evaluator().bounding_boxes.length; i++){
    //     let sel_tracking_id = selectedBox.tracking_id;
    //     if(sel_tracking_id == document.getElementById("td_tracking_id").value){
    //         break;
    //     }
    //     if(document.getElementById("td_tracking_id").value == evaluation.get_evaluator().bounding_boxes[i].tracking_id){
    //         let text = `Can't save. duplicate values : ${evaluation.get_evaluator().bounding_boxes[i].tracking_id}`
    //         viewMessageBox(text,0);
    //         return;
    //     }
    // }

    const box = this.frameModel.getSelectedBox();
    let boxModel = box.boxModel;
    console.log("saveBoxValue", box, this.frameModel.selectedBoxIndex);

    boxModel.class = document.getElementById("select_classes").value;
    boxModel.subClass = document.getElementById("select_subclasses").value;
    // boxModel.truncation = document.getElementById("select_truncation").value;
    // boxModel.occlusion = $("input[name=occlusion_value]:checked").val();
    // if (document.getElementById("trackingIDInput").value) {
    //   boxModel.trackingId = document.getElementById("trackingIDInput").value;
    // }
    // if (document.getElementById("subTrackingIDInput").value) {
    //   boxModel.subId = document.getElementById("subTrackingIDInput").value;
    // }

    this.anchorTrackingId = boxModel.trackingId;

    if (document.getElementById("object_property_save").innerText == "* save") {
      document.getElementById("object_property_save").innerText = "save";
    }
  }

  async setPopupValue() {}
}
