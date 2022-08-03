class MainView {
  constructor() {
    this.canvas3D = this.findById("main_canvas");
    // this.subCanvas3D = this.findById("sub_canvas");
    this.selectedFolderBtn = this.findById("folderUploadSelect");
    // this.imageNameHTML = this.findById("img_name");
    this.imageHTML = this.findById("img");
    // this.frameIndexHTML = this.findById("frame_index");
    this.image2DCanvasHTML = this.findById("image_2D_canvas");
    this.image2DCanvasSelectHTML = this.findById("image_2D_canvas_select");
    this.image2DCanvasOnly2D = this.findById("image2DCanvasOnly2D");
    this.image2DCanvasBlurRects = this.findById("image2DCanvasBlurRects");
    this.image2DCanvasForBlur = this.findById("image2DCanvasForBlur");
    this.frameIndexInput = this.findById("frameIndexInput");
    this.canvasRadar = this.findById("canvasRadar");
    // this.trackingIDInput = this.findById("trackingIDInput");
    // this.subTrackingIDInput = this.findById("subTrackingIDInput");
    this.frameIndex = this.findById("frameIndex");
    this.saveJson = this.findById("saveJson");
    this.boxListsHTML = this.findById("boxLists");
    this.canvas3D.width = 700;
    this.canvas3D.height = 600;

    // this.subCanvas3D.width = 700;
    // this.subCanvas3D.height = 600;
  }

  findById(id) {
    return document.getElementById(id);
  }

  findByClassName(className) {
    return document.getElementsByName(className);
  }

  findByTagName(tagName) {
    return document.getElementsByTagName(tagName);
  }
}
