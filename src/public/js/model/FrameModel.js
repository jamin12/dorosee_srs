class FrameModel {
  static SELECTED_BOX_DEFAULT_INDEX = 9999;

  constructor() {
    this.boxes = [];
    this.canvasRects = [];
    this.blurRects = [];
    // tw : test code {default 9999}
    this.currentFrameIndex = 0;
    this.selectedBoxIndex = 0;
    this.subIdIndex = 0;
    this.boxIdIndex = 1;
    this.canvasObjectIndex = 0;
  }

  getSelectedBox() {
    if (
      this.selectedBoxIndex == this.SELECTED_BOX_DEFAULT_INDEX ||
      this.selectedBoxIndex >= this.boxes.length
    )
      return false;

    return this.boxes[this.selectedBoxIndex];
  }

  setSelectBox(index) {
    this.selectedBoxIndex = index;
  }
}
