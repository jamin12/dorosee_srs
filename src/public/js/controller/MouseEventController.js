class MouseEventController {
  constructor(mainController, mouseEventModel) {
    this.mainController = mainController;
    this.mainView = mainController.mainView;
    this.sceneModel = mainController.sceneModel;
    this.mouseEventModel = mouseEventModel;

    this.initData();

    this.addMouseEvent();

    this.mouse = this.mouseEventModel.mouse;
    this.anchor = this.mouseEventModel.anchor;
    this.mouseEvent = this.mouseEventModel.mouseEvent;
    this.anchorId;
  }

  initData() {
    this.mouseEventModel.mouse = new THREE.Vector3(0, 0, 0);
    this.mouseEventModel.anchor = new THREE.Vector3();
  }

  addMouseEvent() {
    // document.getElementById('main_view_container').addEventListener('mousemove', () => this.onDocumentMouseMove, false );
    this.mainView.canvasRadar.addEventListener(
      "mousedown",
      (event) => {
        this.onDocumentMouseDown(event, this.mainView);
      },
      false
    );
    // document.getElementById('main_view_container').addEventListener('mouseup', () => this.onDocumentMouseUp, false );
    this.mainView.canvasRadar.addEventListener(
      "mousemove",
      (event) => {
        this.updateMouse(event, this.mainView);
      },
      false
    );
  }

  updateMouse(event, mainView) {
    event.preventDefault();
    this.mouse.x = (event.offsetX / mainView.canvasRadar.clientWidth) * 2 - 1;
    this.mouse.y = -(event.offsetY / mainView.canvasRadar.clientHeight) * 2 + 1;
    // console.log(
    //   "this.mouse",
    //   this.mouse.x,
    //   this.mouse.y,
    //   mainView.canvas3D.clientWidth,
    //   mainView.canvas3D.clientHeight,
    //   mainView.canvas3D.width,
    //   mainView.canvas3D.height
    // );
  }

  // async onDocumentMouseUp( event ) {
  //     event.preventDefault();
  //     drag = false;
  //     rightDrag = false;
  //     mouse2D.x = ( event.clientX / (canvaswidth)  ) * 2 - 1;
  //     mouse2D.y = - ( event.clientY / (canvasheight) ) * 2 + 1;

  //     var current_position = {} ;

  //     current_position.x = 0 ;
  //     current_position.y = 0 ;

  //     position_movement.x = 0
  //     position_movement.y = 0

  //     first_position.x = 0;
  //     first_position.y = 0;

  //     mouseDown = false;

  //     controls.enableRotate = true;
  //     controls.enablePan = true;

  //     // controls.enabled = true;
  //     if(event.shiftKey){
  //         if(BooleanManager.isMainView)
  //         {
  //             // selectedBox.geometry.vertices.rotation.y = selectedBox.angle;
  //             selectedBox.boxHelper.rotation.y = selectedBox.angle;
  //             selectedBox.geometry.verticesNeedUpdate = true;
  //         }
  //     }
  //     controls.update();
  //     // try{
  //     //     await checkPointsInAllBox("NS");
  //     // }
  //     // catch(e){
  //     //     console.error(e);
  //     // }
  // }

  // controller for resizing, rotating, translating, or hovering boxes and points
  // async onDocumentMouseMove( event ) {

  //     if(!canMove || !Main.canMouse) return;
  //     canMove = false;
  //     setTimeout(function() { canMove = true;},10)
  //     event.preventDefault();
  //     var cursor = getCurrentPosition();

  //     mouse2D.x = ( event.clientX / (canvaswidth)  ) * 2 - 1;
  //     mouse2D.y = -( event.clientY / (canvasheight) ) * 2 + 1;

  //     var current_position = {};

  //     position_movement.x = (mouse2D.x - past_position.x) * 1000 ;
  //     position_movement.y = (mouse2D.y - past_position.y) * 1000 ;

  //     current_position.x = past_position.x ;
  //     current_position.y = past_position.y ;

  //     // let DS = document.getElementById("DragSlider").value;

  //     if (!controls.enabled && BooleanManager.isMainView) {

  //         // highlights all hover boxes that intersect with cursor
  //         updateHoverBoxes(cursor);

  //         // highlights closest corner point that intersects with cursor
  //         highlightCorners();
  //     }

  //     // if(BooleanManager.isMainView ){
  //     //     if(selectedBox){
  //     //         selectedBox.translate(cursor);
  //     //     }

  //     // }

  //     // if(event.shiftKey && drag){
  //     // if (!controls.enabled && mouseDown == true) {
  //     if (drag) {

  //         // 원래 move2D 임 , 수정해주세요

  //             var cursor = get3DCoord();

  //             if(event.shiftKey && BooleanManager.isMainView)
  //             {
  //                 moveTest(cursor);
  //             }

  //             else if(!event.shiftKey && BooleanManager.isTopView)
  //             {

  //                 if(position_movement.x < 0) {
  //                     box_a_event(Math.abs(position_movement.x));
  //                 }
  //                 else if(position_movement.x > 0) {
  //                     box_d_event(Math.abs(position_movement.x));
  //                 }
  //             }

  //             else if(!event.shiftKey && BooleanManager.isFrontView)
  //             {

  //                 if(position_movement.y > 0) {
  //                     box_r_event(Math.abs(position_movement.y));
  //                 }
  //                 else if(position_movement.y < 0) {

  //                     box_f_event(Math.abs(position_movement.y));
  //                 }
  //             }

  //             else if(!event.shiftKey && BooleanManager.isSideView)
  //             {
  //                 if(position_movement.x > 0) {
  //                     box_w_event(Math.abs(position_movement.x));
  //                 }
  //                 else if(position_movement.x <0) {

  //                     box_s_event(Math.abs(position_movement.x));
  //                 }

  //             }

  //             selectedBox.geometry.verticesNeedUpdate = true;

  //             await drawCubicOnImage();
  //             await checkPointsInSelectedBox();
  //             await insertBoxDataToTable(selectedBox);
  //             await selectedBox.OM.revise_arrowHelper();
  //             await CameraManager.set_camera234(selectedBox);
  //             await selectedBox.OM.updateTextUsingTrackingId();
  //     }
  //     else if(rightDrag){
  //         var cursor = get3DCoord();
  //         // let moveSpeed = Number(mS.value)-3;
  //         let moveSpeed = 4;
  //         // moveTest(cursor);

  //         if(event.shiftKey && BooleanManager.isMainView)
  //         {
  //             moveTest(cursor);
  //         }

  //         else if(BooleanManager.isTopView)
  //         {

  //             var movement_weight = moveSpeed

  //             if(Math.abs(position_movement.x) > Math.abs(position_movement.y)){

  //                 if(position_movement.x > 0 )
  //                     moveBoxForZPlus( movement_weight );
  //                 if (position_movement.x < 0)
  //                     moveBoxForZMinus( movement_weight );

  //             }

  //             else {

  //                 if(position_movement.y > 0 )
  //                     moveBoxForXPlus( movement_weight );
  //                 if(position_movement.y < 0 )
  //                     moveBoxForXMinus( movement_weight );

  //             }

  //         }

  //         else if(BooleanManager.isFrontView)
  //         {

  //             var movement_weight = moveSpeed

  //             if(Math.abs(position_movement.x) > Math.abs(position_movement.y)){
  //                 if(position_movement.x > 0 )
  //                     moveBoxForZPlus( movement_weight );
  //                 if (position_movement.x < 0)
  //                     moveBoxForZMinus( movement_weight );
  //             }

  //             else {
  //                 if(position_movement.y >= 0 ) {
  //                     moveBoxForYPlus( movement_weight );
  //                 }
  //                 else {
  //                     moveBoxForYMinus( movement_weight );
  //                 }
  //             }
  //         }

  //         else if(BooleanManager.isSideView)
  //         {
  //             var movement_weight = moveSpeed

  //             if(Math.abs(position_movement.x) > Math.abs(position_movement.y)){

  //                 if(position_movement.x > 0 )
  //                     moveBoxForXPlus( movement_weight);

  //                 if (position_movement.x < 0)
  //                     moveBoxForXMinus( movement_weight );

  //             }

  //             else {

  //                 if(position_movement.y >= 0 ) {
  //                     moveBoxForYPlus( movement_weight );
  //                 }

  //                 else {
  //                     moveBoxForYMinus( movement_weight );
  //                 }
  //             }

  //         }

  //         selectedBox.geometry.verticesNeedUpdate = true;

  //         await drawCubicOnImage();
  //         await checkPointsInSelectedBox();
  //         await insertBoxDataToTable(selectedBox);
  //         await selectedBox.OM.revise_arrowHelper();
  //         await CameraManager.set_camera234(selectedBox);
  //         await selectedBox.OM.updateTextUsingTrackingId();

  //     }

  //     past_position.x = mouse2D.x;
  //     past_position.y = mouse2D.y;
  // }

  // var drag;
  // var rightDrag;
  // var anchor_cursor;

  async onDocumentMouseDown(event, mainView) {
    event.preventDefault();
    console.log("onDocumentMouseDown");

    switch (event.button) {
      case 0:
        this.mouseEvent = MouseEventModel.MOUSE_EVENT.DRAG;
        break;

      case 2:
        this.mouseEvent = MouseEventModel.MOUSE_EVENT.RIGHT_DRAG;
        break;
    }

    this.mouseEventModel.firstPosition.x = this.mouse.x;
    this.mouseEventModel.firstPosition.y = this.mouse.y;

    const intersect = this.get3DIntersect();
    if (MainModel.isGroupMode) {
      for (let i = 0; i < this.mainController.frameModel.boxes.length; i++) {
        for (const ele of intersect) {
          let box = this.mainController.frameModel.boxes[i];
          if (box.boxModel.box3Helper == ele.object) {
            if (this.mainController.frameModel.subIdIndex == 0) {
              this.anchorId = box.boxModel.id;
            }
            this.mainController.frameModel.subIdIndex++;
            box.boxModel.subId = this.mainController.frameModel.subIdIndex;
            box.boxModel.id = this.anchorId;
            box.boxModel.box3Helper.material.color.setHex(0xffff00);
            box.boxListController.insertBoxDataToTable();
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < this.mainController.frameModel.boxes.length; i++) {
        for (const ele of intersect) {
          let box = this.mainController.frameModel.boxes[i];
          // console.log("box.boxModel.box3Helper", box.boxModel.box3Helper, ele);
          if (box.boxModel.box3Helper == ele.object) {
            box.select();
            return;
          }
          // console.log({ ele });
          // console.log(ele.object.parent);
          // ele.object.parent.visible = false;
        }
      }
    }

    if (KeyEventModel.CTRL_KEY_PRESSED) {
      //ctrl키가 눌렸을 시

      this.mouseEvent = MouseEventModel.MOUSE_EVENT.MOUSE_DOWN;
      // angle = camera.rotation.z;
      const mousePosition = this.get3DCoord().clone();

      //   var geometry = new THREE.BoxGeometry(10, 10, 10);
      //   var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      //   var cube = new THREE.Mesh(geometry, material);
      //   cube.name = "test!!";
      //   cube.position.set(mousePosition.x, mousePosition.y, mousePosition.z);
      //   cube.geometry.computeBoundingBox();
      //   this.sceneModel.scene.add(cube);
      //   return;

      //박스 생성 로직
      let minV = new THREE.Vector3(
        mousePosition.x - 2,
        mousePosition.y - 1,
        mousePosition.z - 1
      );
      let maxV = new THREE.Vector3(
        mousePosition.x + 2,
        mousePosition.y + 1,
        mousePosition.z + 1
      );

      let newBox3 = new THREE.Box3(minV, maxV);
      let newBoxHelper = new THREE.Box3Helper(newBox3, 0xff0000);

      console.log("newBoxHelper", newBoxHelper);
      // this.mainController.frameController.boxList.push()
      let boxModel = new BoxModel(minV, maxV, 0, newBox3, newBoxHelper);
      let boxController = new BoxController(this.mainController, boxModel);

      this.mainController.frameModel.boxes.push(boxController);
      boxController.createBox();
      this.mainController.frameModel.selectedBoxIndex =
        this.mainController.frameModel.boxes.length - 1;

      //   if (document.getElementById("choose_tracking_id").value != "") {
      //     newBox.tracking_id =
      //       document.getElementById("choose_tracking_id").value;
      //   }
    }

    // }
  }

  get3DCoord() {
    this.mouse.z = 0.5;
    let dir, distance, pos;
    this.mouse.unproject(this.sceneModel.camera);
    dir = this.mouse.sub(this.sceneModel.camera.position).normalize();
    distance = -this.sceneModel.camera.position.y / dir.y;
    pos = this.sceneModel.camera.position
      .clone()
      .add(dir.multiplyScalar(distance)); //multiplyScalar 곱하는거

    console.log("GET 3D COORD -> ", pos);
    return pos;
  }

  get3DIntersect() {
    if (this.mainController.frameModel.boxes.length == 0) {
      return;
    }
    // 원래는 vector2 였음 -> 되돌려 놓으셈
    this.sceneModel.raycaster = new THREE.Raycaster();
    // if (BooleanManager.isMainView) {
    this.sceneModel.raycaster.setFromCamera(this.mouse, this.sceneModel.camera);
    let intersects = this.sceneModel.raycaster.intersectObject(
      this.sceneModel.scene
    );

    return intersects;
  }
}
