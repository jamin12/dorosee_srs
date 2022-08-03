class Layout {
  constructor() {
    console.log("Layout");
    this.objInfoBox = document.querySelectorAll(".main .text_frame .info_box");
    this.objInfoFold = document.querySelectorAll(
      ".main .text_frame .info_box .fold_btn"
    );
    this.popupOpenBtn = document.querySelector(".main .threeD_popup_btn");
    this.popupLayle = document.querySelector(".popup_layer");
    this.popupCloseBtn = document.querySelector(".popup_layer .close_btn");
    this.objChackbox = document.querySelectorAll(".obj_check");
  }
  init() {
    console.log("Layout Init");
    this.textInfoBoxFolding();
    this.popupOnOff();
    this.objCheckOne();
  }

  // 텍스트 박스 폴딩 효과
  textInfoBoxFolding() {
    this.objInfoFold = document.querySelectorAll(
      ".main .text_frame .info_box .fold_btn"
    );
    this.objInfoBox = document.querySelectorAll(".main .text_frame .info_box");
    console.log("this.objInfoFold", this.objInfoFold);
    for (let i = 0; i < this.objInfoFold.length; i++) {
      this.objInfoFold[i].addEventListener("click", () => {
        this.objInfoBox[i].classList.toggle("active");

        if (this.objInfoFold[i].classList.contains("active")) {
          this.objInfoFold[i].classList.remove("active");
        } else {
          this.objInfoFold[i].classList.add("active");
        }
      });
    }
  }

  // 헤더  3d 박스 팝업 온오프
  popupOnOff() {
    this.popupOpenBtn = document.querySelector(".main .threeD_popup_btn");
    this.popupLayle = document.querySelector(".popup_layer");
    this.popupCloseBtn = document.querySelector(".popup_layer .close_btn");
    this.popupOpenBtn.addEventListener("click", () => {
      this.popupLayle.classList.add("active");
    });

    this.popupCloseBtn.addEventListener("click", () => {
      this.popupLayle.classList.remove("active");
    });
  }

  // 오브젝트 체크박스 한개만 선택
  objCheckOne() {
    this.objChackbox = document.querySelectorAll(".obj_check");
    for (let i = 0; i < this.objChackbox.length; i++) {
      this.objChackbox[i].addEventListener("click", () => {
        if (this.objChackbox[i].checked) {
          this.objChackbox.forEach((ck) => {
            ck.checked = false;
          });
          this.objChackbox[i].checked = true;
        } else {
          this.objChackbox[i].checked = false;
        }
      });
    }
  }
}
