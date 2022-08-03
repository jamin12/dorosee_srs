class MainModel {
  constructor(mainView) {
    this.imageWidth = 1920;
    this.imageHeight = 1080;
    this.mainView = mainView;

    this.oldCanvasSize = { width: 0, height: 0 };
  }

  static isCuboid = false;
  static isBox2D = false;
  static canMove = true;
  static isGroupMode = false;
}
