//페이지 이동
function gotoPage(target) {
  location.href = target;
}

class LoginManager {
  constructor(dom, id, pw) {
    this.testMode = true;
    this.dom = dom;
    this.id = document.getElementById(id);
    this.pw = document.getElementById(pw);
    this.host = `http://175.197.91.20:53001`;
    this.init();
  }

  init() {
    this.addEvent();
  }

  addEvent() {
    try {
      if (this.testMode) console.log("LoginManager addEvent");
      var loginButton = document.getElementById(this.dom); //로그인 버튼
      loginButton.addEventListener(
        "click",
        function () {
          this.Login();
        }.bind(this)
      );
    } catch (e) {
      console.error(e);
    }
  }

  Login() {
    try {
      if (this.testMode) console.log("LoginManager Login");

      //아이디나 비밀번호 비었을때
      if (this.id.value.length == 0 || this.pw.value.length == 0) {
        // alert("아이디 혹은 비밀번호가 입력되지 않았습니다.");
        return;
      }
      //

      //   if ((this.id.value.toString() == "1", this.pw.value.toString() == "1")) {
      //     //테스트 진입용 계정
      //     location.href = "/index?id=" + this.id.value.toString() + "";
      //     return;
      //   }

      // console.log("id,pw ->",id.value.toString(), pw.value.toString())

      let Login_Request = {
        url: `${this.host}/login`,
        method: "POST",
        crossDomain: true,
        data: {
          username: this.id.value.toString(),
          password: this.pw.value.toString(),
          // username : `admin`,
          // password : `qwer1234`
        },
      };

      $.ajax(Login_Request)
        .done(
          function (response) {
            //성공시 메인 페이지로
            console.log("response->", response);
            if (response.status == "fail") {
              alert("id나 비밀번호를 다시확인해주세요");
            } else {
              location.href = "./index.html";
            }
          }.bind(this)
        )
        .fail(function (response) {
          //실패시
          alert("아이디 혹은 비밀번호를 확인하세요");
        });
    } catch (e) {
      console.error(e);
    }
  }

  IsLogin() {
    if (!CookieManager.getCookie("id")) {
      // alert("로그인이 필요한 항목입니다.")
      return false; //로그인 되어있지않음.
    }
    return true; //로그인 되어있음.
  }

  addLogInPopUp() {
    //online - 로그인 팝업창 열기
    let onlineCard = document.querySelectorAll(
      ".online .education .cm_edu .card"
    );
    let popupWrapper = document.querySelector(".cm_login_popup_wrapper");
    let popupClose = document.querySelector(".cm_login_popup .close_btn");

    for (let i = 0; i < onlineCard.length; i++) {
      onlineCard[i].addEventListener("click", () => {
        popupWrapper.style.display = "flex";
      });
    }

    //online - 로그인 팝업창 닫기
    if (popupClose !== null) {
      popupClose.addEventListener("click", () => {
        popupWrapper.style.display = "none";
      });
    }
  }
}

new LoginManager("loginBtn", "id", "pw");
