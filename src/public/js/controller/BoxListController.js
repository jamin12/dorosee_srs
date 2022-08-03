class BoxListController {
  constructor(mainController, boxController) {
    this.mainController = mainController;
    this.boxController = boxController;
    this.boxModel = boxController.boxModel;
    this.ClassArrayManager = new ClassArrayManager(mainController, this);
  }

  addList() {
    let infoBox = document.createElement("div");
    infoBox.setAttribute("class", "info_box");
    infoBox.innerHTML = `
    <div class="obj_name" id="obj_name_${this.boxModel.boxOrder}">
      <input
        type="checkbox"
        class="obj_check"
        id="obj_check_${this.boxModel.boxOrder}"
        disabled
      /><label for="obj_check_${this.boxModel.boxOrder}"><span></span>Object_${
      this.boxModel.boxOrder
    }</label>
      <button class="fold_btn">
        <img src="../public/images/fold_arrow.svg" alt="" />
      </button>
    </div>
    <div class="car_cont">
      <div class="text" style="display:none;">
        <div class="subject">Frame_no</div>
        <div class="cont">
          <input type="text" id="frameNo_${
            this.boxModel.boxOrder
          }" tabindex = "-1" value="${this.boxModel.frameNo}"
          disabled
          />
        </div>
      </div>
      <div class="text">
        <div class="subject">Id</div>
        <div class="cont">
          <input type="text" id="id_${
            this.boxModel.boxOrder
          }" tabindex = "-1" value="${this.boxModel.id}"
          disabled
          />
        </div>
      </div>
      <div class="text">
        <div class="subject">Sub_id</div>
        <div class="cont">
          <input type="text" id="subId_${
            this.boxModel.boxOrder
          }" tabindex = "-1" value="${this.boxModel.subId}" 
          disabled
          />
        </div>
      </div>
      <div class="text">
      <div class="subject">Obj_type</div>
      <div class="cont">
        <select id="objType_${this.boxModel.boxOrder}">
          ${this.ClassArrayManager.makeSelectClass()}
        </select>
      </div>
    </div>
      <div class="text">
        <div class="subject">Category</div>
        <div class="cont">
        <select id="category_${this.boxModel.boxOrder}">
        ${this.ClassArrayManager.makeSelectSubClass(
          Object.keys(this.ClassArrayManager.ClassArray)[0]
        )}
        </select>

        </div>
      </div>
      <div class="text">
        <div class="subject">Atypical_yn</div>
        <div class="cont">
          <select id="AtypicalYn_${this.boxModel.boxOrder}">
            <option value="y">비정형 객체</option>
            <option value="n">정형 객체</option>
          </select>
        </div>
      </div>
      <div class="text">
        <div class="subject">camera_visibility</div>
        <div class="cont">
          <select id="cameraVisibility_${this.boxModel.boxOrder}">
            <option value="y">식별 가능</option>
            <option value="n">식별 불가능</option>
          </select>
        </div>
      </div>
      <div class="text">
        <div class="subject">Location</div>
        <div class="cont">
          <table>
            <tr>
              <th>x3d</th>
              <th>y3d</th>
              <th>z3d</th>
            </tr>
            <tr>
              <td id="x3d_${this.boxModel.boxOrder}">${
      Math.floor(this.boxModel.location.x * 100) / 100
    }</td>
              <td id="y3d_${this.boxModel.boxOrder}">${
      Math.floor(this.boxModel.location.y * 100) / 100
    }</td>
              <td id="z3d_${this.boxModel.boxOrder}">${
      Math.floor(this.boxModel.location.z * 100) / 100
    }</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="text">
        <div class="subject">Dimension</div>
        <div class="cont">
          <table>
            <tr>
              <th>width</th>
              <th>height</th>
              <th>length</th>
            </tr>
            <tr>
              <td id="width_${this.boxModel.boxOrder}">${
      Math.floor(this.boxModel.dimension.width * 100) / 100
    }</td>
              <td id="height_${this.boxModel.boxOrder}">${
      Math.floor(this.boxModel.dimension.height * 100) / 100
    }</td>
              <td id="length_${this.boxModel.boxOrder}">${
      Math.floor(this.boxModel.dimension.length * 100) / 100
    }</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="text" style="display:none;">
        <div class="subject">Box</div>
        <div class="cont">
          <table>
            <tr>
              <th>xmin</th>
              <th>ymin</th>
              <th>xmax</th>
              <th>ymax</th>
            </tr>
            <tr>
              <td id="xmin_${this.boxModel.boxOrder}">${
      this.boxModel.box2D.xmin
    }</td>
              <td id="xmax_${this.boxModel.boxOrder}">${
      this.boxModel.box2D.xmax
    }</td>
              <td id="ymin_${this.boxModel.boxOrder}">${
      this.boxModel.box2D.ymin
    }</td>
              <td id="ymax_${this.boxModel.boxOrder}">${
      this.boxModel.box2D.ymax
    }</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="text">
        <div class="subject">Rotation_y</div>
        <div class="cont">
          <p id="rotationY_${this.boxModel.boxOrder}">${this.boxModel.angle}</p>
        </div>
      </div>
      <div class="text">
        <div class="subject">Distance</div>
        <div class="cont">
          <p id="distance_${this.boxModel.boxOrder}">${
      Math.floor(this.boxModel.distance * 100) / 100
    }</p>
        </div>
      </div>
    </div>
    `;

    this.addBoxListEvents(infoBox);
    this.insertBoxDataToTable();
  }

  async addBoxListEvents(object) {
    document.getElementById("boxLists").appendChild(object);
    let objInfoFold = document.querySelectorAll(
      ".main .text_frame .info_box .fold_btn"
    )[
      document.querySelectorAll(".main .text_frame .info_box .fold_btn")
        .length - 1
    ];
    let objInfoBox = document.querySelectorAll(".main .text_frame .info_box")[
      document.querySelectorAll(".main .text_frame .info_box").length - 1
    ];
    // this.mainController.layout.init();
    objInfoFold.addEventListener("click", () => {
      objInfoBox.classList.toggle("active");

      if (objInfoFold.classList.contains("active")) {
        objInfoFold.classList.remove("active");
      } else {
        objInfoFold.classList.add("active");
      }
    });

    // let objChackbox =
    //   document.querySelectorAll(".obj_check")[
    //     document.querySelectorAll(".obj_check").length - 1
    //   ];

    // objChackbox.addEventListener("click", () => {
    //   if (objChackbox.checked) {
    //     objChackbox.forEach((ck) => {
    //       ck.checked = false;
    //     });
    //     objChackbox.checked = true;
    //   } else {
    //     objChackbox.checked = false;
    //   }
    // });

    document
      .getElementById(`objType_${this.boxModel.boxOrder}`)
      .addEventListener(
        "change",
        (event) => {
          var value = $(event.target).val();
          console.log("objType_value", value, this);

          document.getElementById(
            `category_${this.boxModel.boxOrder}`
          ).innerHTML = this.ClassArrayManager.makeSelectSubClass(value);
          this.boxModel.objType = value;
          // document.getElementById("object_property_save").innerText = "* save";
        },
        true
      );

    document
      .getElementById(`category_${this.boxModel.boxOrder}`)
      .addEventListener(
        "change",
        (event) => {
          var value = $(event.target).val();
          this.boxModel.category = value;
          console.log("category_value", value, this.boxModel);
          // document.getElementById("object_property_save").innerText = "* save";
        },
        true
      );

    document
      .getElementById(`AtypicalYn_${this.boxModel.boxOrder}`)
      .addEventListener(
        "change",
        (event) => {
          var value = $(event.target).val();
          this.boxModel.AtypicalYn = value;
          console.log("AtypicalYn_value", value, this.boxModel);
          // document.getElementById("object_property_save").innerText = "* save";
        },
        true
      );

    document
      .getElementById(`cameraVisibility_${this.boxModel.boxOrder}`)
      .addEventListener(
        "change",
        (event) => {
          var value = $(event.target).val();
          this.boxModel.cameraVisibility = value;
          console.log("AtypicalYn_value", value, this.boxModel);
          // document.getElementById("object_property_save").innerText = "* save";
        },
        true
      );

    document
      .getElementById(`frameNo_${this.boxModel.boxOrder}`)
      .addEventListener(
        "focus",
        (event) => {
          this.mainController.eventController.keyEventController.removeKeyEvent();
        },
        true
      );

    document
      .getElementById(`frameNo_${this.boxModel.boxOrder}`)
      .addEventListener(
        "blur",
        (event) => {
          this.mainController.eventController.keyEventController.addKeyEvent();
          this.boxModel.frameNo = event.target.value;
        },
        true
      );

    document.getElementById(`id_${this.boxModel.boxOrder}`).addEventListener(
      "focus",
      (event) => {
        this.mainController.eventController.keyEventController.removeKeyEvent();
      },
      true
    );

    document.getElementById(`id_${this.boxModel.boxOrder}`).addEventListener(
      "blur",
      (event) => {
        this.mainController.eventController.keyEventController.addKeyEvent();
        this.boxModel.id = event.target.value;
      },
      true
    );

    document.getElementById(`subId_${this.boxModel.boxOrder}`).addEventListener(
      "focus",
      (event) => {
        this.mainController.eventController.keyEventController.removeKeyEvent();
      },
      true
    );

    document.getElementById(`subId_${this.boxModel.boxOrder}`).addEventListener(
      "blur",
      (event) => {
        this.mainController.eventController.keyEventController.addKeyEvent();
        this.boxModel.subId = event.target.value;
        console.log("event.target.value", event.target.value);
        if (event.target.value >= 0) {
          this.boxModel.box3Helper.material.color.setHex(0xffff00);
          this.boxModel.box3HelperLidar.material.color.setHex(0xffff00);
        } else {
          this.boxModel.box3Helper.material.color.setHex(0xff0000);
          this.boxModel.box3HelperLidar.material.color.setHex(0xff0000);
        }
      },
      true
    );
  }

  async insertBoxDataToTable() {
    if (!document.getElementById(`obj_name_${this.boxModel.boxOrder}`)) {
      return;
    }
    //박스의 데이터를 표에 출력하는 함수
    $(`#objType_${this.boxModel.boxOrder}`)
      .val(this.boxModel.objType)
      .attr("selected", "selected");

    $(`#category_${this.boxModel.boxOrder}`)
      .val(this.boxModel.category)
      .attr("selected", "selected");

    document.getElementById(`frameNo_${this.boxModel.boxOrder}`).value =
      this.boxModel.frameNo;
    document.getElementById(`id_${this.boxModel.boxOrder}`).value =
      this.boxModel.id;
    document.getElementById(`subId_${this.boxModel.boxOrder}`).value =
      this.boxModel.subId;

    let outputRotationY = (this.boxModel.angle * 180) / 3.14;
    document.getElementById(`rotationY_${this.boxModel.boxOrder}`).innerText =
      outputRotationY;

    $(`#distance_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.distance * 100) / 100
    );

    $(`#xmin_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.box2D.xmin)
    );
    $(`#xmax_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.box2D.xmax)
    );
    $(`#ymin_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.box2D.ymin)
    );
    $(`#ymax_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.box2D.ymax)
    );

    $(`#width_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.dimension.width * 100) / 100
    );
    $(`#height_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.dimension.height * 100) / 100
    );
    $(`#length_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.dimension.length * 100) / 100
    );

    $(`#x3d_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.location.x * 100) / 100
    );
    $(`#y3d_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.location.y * 100) / 100
    );
    $(`#z3d_${this.boxModel.boxOrder}`).text(
      Math.floor(this.boxModel.location.z * 100) / 100
    );

    // let value = 0;
    // let Yaw = outputbox.yaw;
    // if (Yaw > 0) {
    //   value = 3.14 - Yaw;
    //   value *= -1;
    // } else {
    //   value = 3.14 + Yaw;
    // }

    // console.log("outputboxyaw, value, ",outputbox.yaw, value)
    // $("#td_yaw").text(Math.floor(value * 100) / 100);

    // $("#td_object_index").text(outputbox.object_index);
    // $("#td_tracking_id").text(this.boxModel.trackingId);
  }
}
