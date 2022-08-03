class BoxEventController {
  constructor(mainController, boxController) {
    this.mainController = mainController;
    this.boxController = boxController;
    this.boxModel = boxController.boxModel;
  }

  keyEvent(keyCode) {
    // box resize
    if (KeyEventModel.CTRL_KEY_PRESSED) {
      this.boxResizeEvent(keyCode);
    } else {
      this.boxTranslateEvent(keyCode);
    }
    this.boxRotateEvent(keyCode);
    this.mainController.pointCloudController.checkPointsInSelectedBox();
    this.mainController.pointCloudController.checkPointsInSelectedBox_Lidar();
    // this.mainController.pointCloudController.checkPointsInAllBox();
    // this.mainController.pointCloudController.checkPointsInAllBox_Lidar();
  }

  boxResizeEvent(keyCode) {
    if (
      !(
        keyCode == 87 ||
        keyCode == 65 ||
        keyCode == 83 ||
        keyCode == 68 ||
        keyCode == 82 ||
        keyCode == 70
      )
    )
      return;

    let speed = 2 * 0.01;

    if (KeyEventModel.SHIFT_KEY_PRESSED) {
      speed *= 4;
    }

    // if (this.boxModel.angle != 0) {
    //   this.boxModel.box3Helper.rotation.y = 0;
    //   console.log("0아님", this.boxModel.box3Helper.rotation.y);
    // }

    switch (keyCode) {
      case 87: // w
        var angle = this.boxModel.box3Helper.rotation.y;
        var xSpeed = Math.cos(angle) * speed;
        var zSpeed = -Math.sin(angle) * speed;
        this.boxModel.maxVector.x += speed;
        this.boxModel.minVector.x -= speed;
        // ======================= //
        this.boxModel.maxVector.z += zSpeed;
        this.boxModel.minVector.z += zSpeed;
        this.boxModel.minVector.x += xSpeed;
        this.boxModel.maxVector.x += xSpeed;
        // ======================= //
        // this.boxModel.maxVector.x += speed;
        break;

      case 65: // a
        if (this.boxModel.maxVector.z - speed <= this.boxModel.minVector.z)
          return;
        var angle = this.boxModel.box3Helper.rotation.y;
        var zSpeed = Math.cos(angle) * speed;
        var xSpeed = Math.sin(angle) * speed;
        this.boxModel.maxVector.z -= speed;
        this.boxModel.minVector.z += speed;
        // ======================= //
        this.boxModel.maxVector.z -= zSpeed;
        this.boxModel.minVector.z -= zSpeed;
        this.boxModel.minVector.x -= xSpeed;
        this.boxModel.maxVector.x -= xSpeed;
        // ======================= //
        // this.boxModel.maxVector.z -= speed;
        break;

      case 83: // s
        if (this.boxModel.maxVector.x - speed <= this.boxModel.minVector.x)
          return;
        var angle = this.boxModel.box3Helper.rotation.y;
        var xSpeed = Math.cos(angle) * speed;
        var zSpeed = -Math.sin(angle) * speed;
        this.boxModel.maxVector.x -= speed;
        this.boxModel.minVector.x += speed;
        // ======================= //
        this.boxModel.maxVector.z -= zSpeed;
        this.boxModel.minVector.z -= zSpeed;
        this.boxModel.minVector.x -= xSpeed;
        this.boxModel.maxVector.x -= xSpeed;
        // this.boxModel.maxVector.x -= speed;
        break;

      case 68: // d
        var angle = this.boxModel.box3Helper.rotation.y;
        var zSpeed = Math.cos(angle) * speed;
        var xSpeed = Math.sin(angle) * speed;
        this.boxModel.maxVector.z += speed;
        this.boxModel.minVector.z -= speed;
        // ======================= //
        this.boxModel.maxVector.z += zSpeed;
        this.boxModel.minVector.z += zSpeed;
        this.boxModel.minVector.x += xSpeed;
        this.boxModel.maxVector.x += xSpeed;
        // ======================= //
        // this.boxModel.maxVector.z += speed;
        break;

      case 82: // r
        this.boxModel.maxVector.y += speed;
        break;

      case 70: // f
        if (this.boxModel.maxVector.y - speed <= this.boxModel.minVector.y)
          return;
        this.boxModel.maxVector.y -= speed;
        break;
    }

    // this.boxModel.box3.set(this.boxModel.minVector, this.boxModel.maxVector);
    // rotate BoxHelper back

    // this.boxModel.box3.translate(translate);
    this.boxController.setBoxPoints(
      this.boxModel.minVector,
      this.boxModel.maxVector
    );
    // isShiftKey = false;
  }

  boxTranslateEvent(keyCode) {
    let speed = 2 * 0.01;

    if (KeyEventModel.SHIFT_KEY_PRESSED) {
      console.log("SHIFT ON");
      speed *= 8;
    }

    switch (keyCode) {
      case 87: // w
        this.boxModel.minVector.x += speed;
        this.boxModel.maxVector.x += speed;
        break;

      case 65: // a
        this.boxModel.minVector.z -= speed;
        this.boxModel.maxVector.z -= speed;
        break;

      case 83: // s
        this.boxModel.minVector.x -= speed;
        this.boxModel.maxVector.x -= speed;
        break;

      case 68: // d
        // if (this.boxModel.box3Helper.rotation.y != 0) {
        //   var angle = this.boxModel.box3Helper.rotation.y;
        //   var zSpeed = Math.cos(angle) * speed;
        //   var xSpeed = Math.sin(angle) * speed;
        //   this.boxModel.minVector.z += zSpeed;
        //   this.boxModel.maxVector.z += zSpeed;
        //   this.boxModel.minVector.x += xSpeed;
        //   this.boxModel.maxVector.x += xSpeed;
        // }
        this.boxModel.minVector.z += speed;
        this.boxModel.maxVector.z += speed;
        break;

      case 82: // r
        this.boxModel.minVector.y += speed;
        this.boxModel.maxVector.y += speed;
        break;

      case 70: // f
        this.boxModel.minVector.y -= speed;
        this.boxModel.maxVector.y -= speed;
        break;
    }

    this.boxController.setBoxPoints(
      this.boxModel.minVector,
      this.boxModel.maxVector
    );
  }

  boxRotateEvent(keyCode) {
    let speed = 2 * 0.01;
    if (KeyEventModel.SHIFT_KEY_PRESSED) {
      speed *= 2;
    }

    switch (keyCode) {
      case 81: // q
        this.boxModel.angle += speed;
        if (this.boxModel.angle >= 3.14) {
          this.boxModel.angle -= 6.28;
        }
        this.boxModel.box3Helper.rotation.y = this.boxModel.angle;
        console.log("this.boxModel.angle", this.boxModel.angle);
        break;

      case 69: // e
        this.boxModel.angle -= speed;
        if (this.boxModel.angle <= -3.14) {
          this.boxModel.angle += 6.28;
        }
        this.boxModel.box3Helper.rotation.y = this.boxModel.angle;
        console.log("this.boxModel.angle", this.boxModel.angle);

        break;
    }
  }
}
