let pointMaterial = new THREE.PointsMaterial({
  size: 2 * 5,
  sizeAttenuation: false,
  vertexColors: THREE.VertexColors,
  opacity: 0,
  transparent: true,
});

class BoxController {
  constructor(mainController, boxModel) {
    this.mainController = mainController;
    this.boxModel = boxModel;
    this.boxListController = new BoxListController(mainController, this);
    this.boxEventController = new BoxEventController(mainController, this);
  }

  createBox() {
    let maxV = this.boxModel.maxVector.clone();
    let minV = this.boxModel.minVector.clone();
    maxV.y = 0;
    minV.y = 0;

    // this.rotate(maxV, minV, this.angle);

    // max Vector set Hegiht
    this.boxModel.maxVector.add(
      new THREE.Vector3(
        0,
        this.boxModel.centerZ + this.boxModel.heightCar / 2,
        0
      )
    );
    // min Vector set Hegiht
    this.boxModel.minVector.add(
      new THREE.Vector3(
        0,
        this.boxModel.centerZ - this.boxModel.heightCar / 2,
        0
      )
    );

    this.boxModel.box3.set(this.boxModel.minVector, this.boxModel.maxVector);

    this.mainController.sceneModel.scene.add(this.boxModel.box3Helper);
    this.setBoxPoints(this.boxModel.minVector, this.boxModel.maxVector);

    this.boxModel.boxOrder = this.mainController.frameModel.boxIdIndex;
    this.boxModel.id = this.mainController.frameModel.boxIdIndex;
    // this.boxModel.subId = this.mainController.frameModel.boxIdIndex;
    this.mainController.frameModel.boxIdIndex++;

    this.boxListController.addList();
    this.select();
  }

  loadBox() {
    console.log("loadBox!");
    let maxV = this.boxModel.maxVector.clone();
    let minV = this.boxModel.minVector.clone();
    maxV.y = 0;
    minV.y = 0;

    // this.rotate(maxV, minV, this..angle);

    this.boxModel.box3.set(this.boxModel.minVector, this.boxModel.maxVector);

    this.mainController.sceneModel.scene.add(this.boxModel.box3Helper);
    this.setBoxPoints(this.boxModel.minVector, this.boxModel.maxVector);

    this.boxModel.boxOrder = this.mainController.frameModel.boxIdIndex;
    this.mainController.frameModel.boxIdIndex = this.boxModel.id;
    // this.boxModel.subId = this.mainController.frameModel.boxIdIndex;
    this.mainController.frameModel.boxIdIndex++;
    this.boxModel.box3Helper.rotation.y = this.boxModel.angle;
    this.boxListController.addList();
    this.select();
  }

  setBoxPoints(minV, maxV) {
    let miV = minV.clone();
    let maV = maxV.clone();
    this.boxModel.boxPoints = {
      top: {
        leftFront: new THREE.Vector3(maV.x, maV.y, miV.z),
        leftRear: new THREE.Vector3(miV.x, maV.y, miV.z),
        rightFront: maV,
        rightRear: new THREE.Vector3(miV.x, maV.y, maV.z),
      },
      bottom: {
        leftFront: new THREE.Vector3(maV.x, miV.y, miV.z),
        leftRear: miV,
        rightFront: new THREE.Vector3(maV.x, miV.y, maV.z),
        rightRear: new THREE.Vector3(miV.x, miV.y, maV.z),
      },
    };
    this.setGeometry(this.boxModel.boxPoints);
  }

  setGeometry(boxPoints) {
    this.boxModel.geometry = [];
    this.boxModel.geometry.push(boxPoints.top.leftFront);
    this.boxModel.geometry.push(boxPoints.top.leftRear);
    this.boxModel.geometry.push(boxPoints.top.rightFront);
    this.boxModel.geometry.push(boxPoints.top.rightRear);
    this.boxModel.geometry.push(boxPoints.bottom.leftFront);
    this.boxModel.geometry.push(boxPoints.bottom.leftRear);
    this.boxModel.geometry.push(boxPoints.bottom.rightFront);
    this.boxModel.geometry.push(boxPoints.bottom.rightRear);
    // this.boxModel.bufferGeometry = new THREE.BufferGeometry().setFromPoints(
    //     this.boxModel.geometry
    // );
    console.log("this.geometry", this.boxModel.geometry);

    this.getBox2D();
    this.getDimension();
    this.getLocation();
    this.getDistance();
    this.getTrackingID();
    this.getYawOutput();

    let fileModel = this.mainController.fileController.fileModel;

    console.log("calibFiles", fileModel.lidarCalibFiles);

    let lMiV = Lidar2ImageManager.radar2Lidar(
      this.boxModel.minVector.x,
      this.boxModel.minVector.y,
      this.boxModel.minVector.z
    );

    this.boxModel.lidarMinVector = new THREE.Vector3(
      lMiV["x"],
      lMiV["y"],
      lMiV["z"]
    );

    let lMaV = Lidar2ImageManager.radar2Lidar(
      this.boxModel.maxVector.x,
      this.boxModel.maxVector.y,
      this.boxModel.maxVector.z
    );

    this.boxModel.lidarMaxVector = new THREE.Vector3(
      lMaV["x"],
      lMaV["y"],
      lMaV["z"]
    );

    this.boxModel.lidarMinVector = new THREE.Vector3(
      math.min(lMiV["x"], lMaV["x"]),
      math.min(lMiV["y"], lMaV["y"]),
      math.min(lMiV["z"], lMaV["z"])
    );

    this.boxModel.lidarMaxVector = new THREE.Vector3(
      math.max(lMiV["x"], lMaV["x"]),
      math.max(lMiV["y"], lMaV["y"]),
      math.max(lMiV["z"], lMaV["z"])
    );

    console.log(
      "lidarVector3 minV maxV",
      this.boxModel.lidarMinVector,
      this.boxModel.lidarMaxVector
    );
    if (this.boxModel.box3Lidar == null) {
      this.boxModel.box3Lidar = new THREE.Box3(
        this.boxModel.lidarMinVector,
        this.boxModel.lidarMaxVector
      );
    } else {
      this.boxModel.box3Lidar.set(
        this.boxModel.lidarMinVector,
        this.boxModel.lidarMaxVector
      );
    }
    if (this.boxModel.box3HelperLidar == null) {
      this.boxModel.box3HelperLidar = new THREE.Box3Helper(
        this.boxModel.box3Lidar,
        0xff0000
      );
      this.boxModel.box3HelperLidar.rotation.y = this.boxModel.angle;
      this.boxModel.box3HelperLidar.layers.set(1);
      this.mainController.sceneModel.scene.add(this.boxModel.box3HelperLidar);
    } else {
      this.boxModel.box3HelperLidar.rotation.y = this.boxModel.angle;
    }

    this.mainController.imageController.drawCubicOnImage("NS");
    this.mainController.imageController.drawCubicOnImage();
    this.boxListController.insertBoxDataToTable();
  }

  select() {
    this.mainController.imageController.initCanvasOnly2D();
    // console.log(
    //   "this.mainController.frameModel.boxes.length",
    //   this.mainController.frameModel.boxes
    // );
    for (let i = 0; i < this.mainController.frameModel.boxes.length; i++) {
      if (this.mainController.frameModel.boxes[i].boxModel.subId >= 0) {
        this.mainController.frameModel.boxes[
          i
        ].boxModel.box3Helper.material.color.setHex(0xffff00);
        this.mainController.frameModel.boxes[
          i
        ].boxModel.box3HelperLidar.material.color.setHex(0xffff00);
      } else {
        this.mainController.frameModel.boxes[
          i
        ].boxModel.box3Helper.material.color.setHex(0xff0000);
        this.mainController.frameModel.boxes[
          i
        ].boxModel.box3HelperLidar.material.color.setHex(0xff0000);
      }
    }
    this.boxModel.box3Helper.material.color.setHex(0x0000ff);
    this.boxModel.box3HelperLidar.material.color.setHex(0x0000ff);
    for (let i = 0; i < this.mainController.frameModel.boxes.length; i++) {
      const box = this.mainController.frameModel.boxes[i];
      if (box == this) {
        this.mainController.sceneModel.transformControls.attach(
          this.mainController.frameModel.boxes[i].boxModel.box3Helper
        );
        this.mainController.frameModel.setSelectBox(i);
        let selectBox = this.mainController.frameModel.getSelectedBox();
        this.mainController.imageController.reDrawObject();
        this.mainController.imageController.drawLabel2DAllNotSelect();
        this.mainController.imageController.reDrawPoints();
        return;
      }
    }

    // this.mainController.frameController.frameModel.selectedBoxIndex = i;
  }

  getBox2D() {
    let box = this;
    this.boxModel.lineArray = [];
    this.boxModel.lineXArray = [];
    this.boxModel.lineYArray = [];
    for (var k = 0; k < box.boxModel.geometry.length; k++) {
      var point = Lidar2ImageManager.lidar2Image(
        box.boxModel.geometry[k].z,
        box.boxModel.geometry[k].x,
        box.boxModel.geometry[k].y
      );
      this.boxModel.lineArray.push(point);
      this.boxModel.lineXArray.push(point.x);
      this.boxModel.lineYArray.push(point.y);
    }

    let maxLineXArray = Math.max.apply(Math, this.boxModel.lineXArray);

    let minLineXArray = Math.min.apply(Math, this.boxModel.lineXArray);

    let maxLineYArray = Math.max.apply(Math, this.boxModel.lineYArray);

    let minLineYArray = Math.min.apply(Math, this.boxModel.lineYArray);

    if (maxLineXArray >= 1920) {
      maxLineXArray = 1920;
    }

    if (minLineXArray < 0) {
      minLineXArray = 0;
    }

    if (maxLineYArray >= 1080) {
      maxLineYArray = 1080;
    }

    if (minLineYArray < 0) {
      minLineYArray = 0;
    }

    if (
      minLineXArray >= 1920 ||
      minLineYArray >= 1080 ||
      maxLineXArray < 0 ||
      maxLineYArray < 0
    ) {
      minLineXArray = 0;
      maxLineXArray = 0;
      minLineYArray = 0;
      maxLineYArray = 0;
    }

    this.boxModel.box2D = {
      xmin: minLineXArray,
      xmax: maxLineXArray,
      ymin: minLineYArray,
      ymax: maxLineYArray,
    };

    return;
  }

  getDimension() {
    var v1 = this.boxModel.geometry[2].clone(); // max
    var v2 = this.boxModel.geometry[5].clone(); // min
    var v3 = this.boxModel.geometry[0].clone(); // topleft

    this.boxModel.dimension = {
      width: this.distance2D(v2, v3),
      height: v1.y - v2.y,
      length: this.distance2D(v1, v3),
    };

    return;
  }

  getLocation() {
    var v1 = this.boxModel.geometry[2].clone(); // max
    var v2 = this.boxModel.geometry[5].clone(); // min
    const center = this.getCenter(v1, v2);
    const locationPoint = Lidar2ImageManager.getXcYcZc(
      center.x,
      -center.z,
      (v1.y + v2.y) / 2
    );

    const locationX = center.x;
    const locationY = center.y;
    const locationZ = center.z;

    // const locationX = locationPoint[0][0];
    // const locationY = locationPoint[1][0];
    // const locationZ = locationPoint[2][0];
    this.boxModel.location = new THREE.Vector3(locationX, locationY, locationZ);
    console.log("this.boxModel.location", this.boxModel.location);
    // this.boxModel.location = {
    //   x : locationX,
    //   y : locationY,
    //   z : locationZ
    // }

    return;
  }

  getTrackingID() {
    // this.boxModel.trackingId = box.tracking_id;
    // if (box.tracking_id == "") {
    //   this.tracking_id = '""';
    // }
    // this.subclass = box.subclass;
    // if (box.subclass == "none") {
    //   this.subclass = '""';
    // }
  }

  getDistance() {
    const v1 = this.boxModel.geometry[2].clone(); // max
    const v2 = this.boxModel.geometry[5].clone(); // min
    const center = this.getCenter(v1, v2);
    this.boxModel.distance = Math.sqrt(
      Math.pow(center.x, 2) + Math.pow(center.z, 2)
    );
  }

  getYawOutput() {
    let box = this;
    var point_1_for_yaw = Lidar2ImageManager.getXcYcZc(
      box.boxModel.geometry[2].z,
      box.boxModel.geometry[2].x,
      box.boxModel.geometry[2].y
    );
    var point_2_for_yaw = Lidar2ImageManager.getXcYcZc(
      box.boxModel.geometry[0].z,
      box.boxModel.geometry[0].x,
      box.boxModel.geometry[0].y
    );
    // var point_1_for_yaw = Lidar2ImageManager.getXcYcZc(box.geometry.vertices[0].x, -box.geometry.vertices[0].z, box.geometry.vertices[0].y);
    // var point_2_for_yaw = Lidar2ImageManager.getXcYcZc(box.geometry.vertices[2].x, -box.geometry.vertices[2].z, box.geometry.vertices[2].y);
    var target_vector_for_yaw = new THREE.Vector3(
      point_2_for_yaw[0][0] - point_1_for_yaw[0][0],
      point_2_for_yaw[1][0] - point_1_for_yaw[1][0],
      point_2_for_yaw[2][0] - point_1_for_yaw[2][0]
    );

    target_vector_for_yaw.y = 0;
    this.boxModel.yaw = this.getYaw(target_vector_for_yaw) * -1;
    return;
  }

  getYaw(target_vector_for_get_yaw) {
    var origin_vector_for_get_yaw = new THREE.Vector3(1, 0, 0);

    target_vector_for_get_yaw.y = 0;

    var yaw = target_vector_for_get_yaw.angleTo(origin_vector_for_get_yaw);

    if (target_vector_for_get_yaw.z < 0) {
      yaw = yaw * -1;
    }
    return yaw;
  }

  /**
   * get Center In BOX
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns
   */

  distance2D(v1, v2) {
    return Math.pow(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.z - v2.z, 2), 0.5);
  }

  getCenter(v1, v2) {
    return new THREE.Vector3((v1.x + v2.x) / 2.0, 0.0, (v1.z + v2.z) / 2.0);
  }

  getMin(v1, v2) {
    return new THREE.Vector3(
      Math.min(v1.x, v2.x),
      Math.min(v1.y, v2.y),
      Math.min(v1.z, v2.z)
    );
  }

  getMax(v1, v2) {
    return new THREE.Vector3(
      Math.max(v1.x, v2.x),
      Math.max(v1.y, v2.y),
      Math.max(v1.z, v2.z)
    );
  }

  /**
   * Box Rotate
   * @param {Vector} v1
   * @param {Vector} v2
   * @param {number} angle
   */
  rotate(v1, v2, angle) {
    const center = this.getCenter(v1, v2);
    v1.sub(center);
    v2.sub(center);
    let temp1 = v1.clone();
    let temp2 = v2.clone();

    v1.x = Math.cos(angle) * temp1.x - Math.sin(angle) * temp1.z;
    v2.x = Math.cos(angle) * temp2.x - Math.sin(angle) * temp2.z;

    v1.z = Math.sin(angle) * temp1.x + Math.cos(angle) * temp1.z;
    v2.z = Math.sin(angle) * temp2.x + Math.cos(angle) * temp2.z;

    v1.add(center);
    v2.add(center);
  }
}
