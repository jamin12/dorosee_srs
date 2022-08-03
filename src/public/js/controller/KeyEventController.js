class KeyEventController {
  constructor(mainController, keyEventModel) {
    this.mainController = mainController;
    this.keyEventModel = keyEventModel;

    this.addKeyEvent();
  }

  addKeyEvent() {
    console.log("addKeyEvent");
    document.addEventListener("keydown", this.onKeyDownHandler, true); //or however you are calling your method
    document.addEventListener("keyup", this.onKeyUpHandler, true);
  }

  removeKeyEvent() {
    console.log("removeKeyEvent");

    document.removeEventListener("keydown", this.onKeyDownHandler, true); //or however you are calling your method
    document.removeEventListener("keyup", this.onKeyUpHandler, true);
  }
  onKeyDownHandler = (event) => {
    this.onKeyDown(event);
  };
  onKeyUpHandler = (event) => {
    this.onKeyUp(event);
  };

  async onKeyDown(event) {
    event.preventDefault();
    if (!MainModel.canMove) return;
    MainModel.canMove = false;
    setTimeout(function () {
      MainModel.canMove = true;
    }, 10);
    const KeyID = event.keyCode;

    switch (KeyID) {
      case 16: // shift
        KeyEventModel.SHIFT_KEY_PRESSED = true;
        break;

      case 17: // ctrl
        KeyEventModel.CTRL_KEY_PRESSED = true;
        break;

      case 49: //digit1 이전 프레임 이동
        // moveFrame("prev");
        this.mainController.frameController.prevFrame();
        break;

      case 55: //digit7
        MainModel.isGroupMode = true;

        break;

      case 56: //digit8
        MainModel.isGroupMode = false;
        this.mainController.frameModel.subIdIndex = 0;
        break;

      case 50: //digit2
        // moveFrame("next");
        this.mainController.frameController.nextFrame();
        break;

      case 46: // delete
        await this.mainController.frameController.deleteSelectedBox();
        break;

      case 9: // tab 큐브 선택 및 뷰 전환
        this.mainController.frameController.getSelectedBoxUsingKey("tab");
        break;

      case 192: // "~" 큐브 선택 및 뷰 전환
        this.mainController.frameController.getSelectedBoxUsingKey("~");
        break;

      case 67: // c 속성값 수정 내용 저장
        this.mainController.frameController.saveBoxValue();
        break;
    }

    // 생성된 모든 박스 가져오기
    const allBox = this.mainController.frameModel.boxes;
    // Ctrl key pressed and box size > 0 -> box resize

    // selectedBoxIndex test
    if (
      allBox.length > 0 &&
      this.mainController.frameModel.selectedBoxIndex <
        FrameModel.SELECTED_BOX_DEFAULT_INDEX
    ) {
      const box = allBox[this.mainController.frameModel.selectedBoxIndex];
      box.boxEventController.keyEvent(KeyID);
    }
  }

  // controller for releasing hotkeys
  async onKeyUp(event) {
    const KeyID = event.keyCode;

    switch (KeyID) {
      case 16: // shift
        KeyEventModel.SHIFT_KEY_PRESSED = false;
        break;
      case 17: // ctrl
        KeyEventModel.CTRL_KEY_PRESSED = false;
        break;
    }
  }
}
