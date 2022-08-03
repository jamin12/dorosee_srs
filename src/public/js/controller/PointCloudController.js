class PointCloudController {
  constructor(mainController) {
    this.mainController = mainController;
    this.sceneModel = mainController.sceneModel;
    this.greenMesh;
  }

  async load_PCD_file(file) {
    console.log("this.sceneModel.pointcloud", this.sceneModel.pointcloud);
    if (this.sceneModel.pointcloud !== null) {
      this.sceneModel.scene.remove(this.sceneModel.pointcloud);
      this.sceneModel.pointcloud.geometry.dispose();
      this.sceneModel.pointcloud.material.dispose();
      this.sceneModel.pointcloud = null;
    }
    const loader = new THREE.PCDLoader();
    // load a resource
    loader.load(
      // resource URL
      file,
      // called when the resource is loaded
      async (mesh) => {
        // await reset();

        let pointColors = await this.setPointcloudColor(mesh);

        this.sceneModel.pointcloud = await this.setMesh(mesh, pointColors);
        // await importBoxInfoFromXML();
        // await importBoxFromJSON();
        // await sleep(100);
        // await checkPointsInAllBox("NS");
        // await checkPointsInSelectedBox();

        console.log("됫음", mesh, mesh.material);

        document.getElementById("cut").style.display = "none";

        // isMoveFrameReady = true;
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
  }

  async load_PCD_file_Lidar(file) {
    console.log("this.sceneModel.pointcloud", this.sceneModel.pointcloudLidar);
    if (this.sceneModel.pointcloudLidar !== null) {
      this.sceneModel.scene.remove(this.sceneModel.pointcloudLidar);
      this.sceneModel.pointcloudLidar.geometry.dispose();
      this.sceneModel.pointcloudLidar.material.dispose();
      this.sceneModel.pointcloudLidar = null;
    }
    const loader = new THREE.PCDLoader();
    // load a resource
    loader.load(
      // resource URL
      file,
      // called when the resource is loaded
      async (mesh) => {
        // await reset();

        let pointColors = await this.setPointcloudColor(mesh);

        this.sceneModel.pointcloudLidar = await this.setMeshLidar(
          mesh,
          pointColors
        );
        // await importBoxInfoFromXML();
        // await importBoxFromJSON();
        // await sleep(100);
        // await checkPointsInAllBox("NS");
        // await checkPointsInSelectedBox();

        // console.log("됫음", mesh, mesh.material);

        document.getElementById("cut").style.display = "none";

        // isMoveFrameReady = true;
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
  }
  async setPointcloudColor(mesh) {
    let returnArray = [];
    for (
      let i = 0;
      i < mesh.geometry.attributes.position.array.length;
      i += 3
    ) {
      let x = mesh.geometry.attributes.position.array[i];
      let y = mesh.geometry.attributes.position.array[i + 1];
      let z = mesh.geometry.attributes.position.array[i + 2];
      let v = new THREE.Vector3(x, y, z);

      let t = await this.over150redcolor(v.clone(), "red");
      returnArray.push(t[0], t[1], t[2]);
    }
    return returnArray;
  }

  async setMesh(mesh, colorArray) {
    mesh.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorArray, 3)
    );
    mesh.material.size = 2 - 0.3;
    mesh.material.vertexColors = THREE.VertexColors;
    mesh.material.sizeAttenuation = false;

    this.sceneModel.scene.add(mesh);
    mesh.rotateX((-90 * Math.PI) / 180); // X축으로 돌림
    return mesh;
  }

  async setMeshLidar(mesh, colorArray) {
    mesh.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorArray, 3)
    );
    mesh.material.size = 2 - 0.3;
    mesh.material.vertexColors = THREE.VertexColors;
    mesh.material.sizeAttenuation = false;

    this.sceneModel.scene.add(mesh);
    mesh.layers.set(1);
    mesh.rotateX((-90 * Math.PI) / 180); // X축으로 돌림
    return mesh;
  }

  async over150redcolor(v, color) {
    //150m이상의 pointcloud는 빨간색 처리
    var origin_point = new THREE.Vector3(0, 0, 0);
    var target_point_for_distance_measurement = v.clone();
    var returncolor = [255, 255, 255];
    if (color == "white") {
      returncolor = [255, 255, 255];
    } else if (color == "black") {
      returncolor = [0, 0, 0];
    }
    target_point_for_distance_measurement.y = 0;

    var distance = origin_point.distanceTo(
      target_point_for_distance_measurement
    );

    if (distance >= 150) {
      // // console.log("붉");

      // return new THREE.Color('red');
      returncolor = [255, 0, 0];
      return returncolor;
    } else {
      return returncolor;
    }
  }

  async checkPointsInSelectedBox() {
    console.log("checkPointsInSelectedBox");
    //selectedBox와 pointcloud를 읽어서 selectedBox내의 pointcloud를 초록색으로 바꾸는 함수.

    if (this.mainController.sceneModel.scene.getObjectByName("greenMesh")) {
      this.mainController.sceneModel.scene.remove(this.greenMesh);
      this.greenMesh.geometry.dispose();
      this.greenMesh.material.dispose();
    }

    // 생성된 박스가 없을때
    if (this.mainController.frameModel.boxes.length == 0) {
      return;
    }

    // // 선택된 박스가 없을때
    // if (selectedBox == null) {
    //   return;
    // }

    const selectedBox = this.mainController.frameModel.getSelectedBox();

    var geometry = new THREE.BoxGeometry(
      selectedBox.boxModel.dimension.width,
      selectedBox.boxModel.dimension.height,
      selectedBox.boxModel.dimension.length
    );
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    const center = new THREE.Vector3(
      (selectedBox.boxModel.minVector.x + selectedBox.boxModel.maxVector.x) / 2,
      (selectedBox.boxModel.minVector.y + selectedBox.boxModel.maxVector.y) / 2,
      (selectedBox.boxModel.minVector.z + selectedBox.boxModel.maxVector.z) / 2
    );
    cube.position.set(center.x, center.y, center.z);
    cube.rotation.y = selectedBox.boxModel.angle;
    cube.name = "cube";

    cube.updateMatrixWorld();

    var boxMatrixInverse = new THREE.Matrix4().getInverse(
      cube.clone().matrixWorld
    );
    var inverseBox = cube.clone();

    inverseBox.applyMatrix4(boxMatrixInverse);

    var boxTemp = new THREE.Box3().setFromObject(inverseBox);

    // // console.log("point cloud", pointcloud);

    // for(let i =0; i< prev_points.length; i += 3){

    //     if(flag == 0 ){
    //         pointcloud.geometry.attributes.color.array[prev_points[i]] = 255;
    //         pointcloud.geometry.attributes.color.array[prev_points[i+1]] = 255;
    //         pointcloud.geometry.attributes.color.array[prev_points[i+2]] = 255;
    //     }
    // }
    var green_geometry_vertices = [];
    var green_geometry_colors = [];
    // prev_points = [];
    let positions =
      this.mainController.sceneModel.pointcloud.geometry.attributes.position
        .array;
    for (let i = 0; i < positions.length; i += 3) {
      // let Point = pointcloud.geometry.vertices[i].clone();
      let Point = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      );
      let axis = new THREE.Vector3(1, 0, 0);

      Point.applyAxisAngle(axis, (-90 * Math.PI) / 180);
      Point.applyMatrix4(boxMatrixInverse);

      if (boxTemp.containsPoint(Point)) {
        // console.log("isInsideisInside!!", i);
        // pointcloud.geometry.attributes.color.array[i] = 0;
        // pointcloud.geometry.attributes.color.array[i+1] = 128;
        // pointcloud.geometry.attributes.color.array[i+2] = 0;
        green_geometry_vertices.push(Point);

        // prev_points.push(i,i+1,i+2);
        green_geometry_colors.push(0, 0.5, 0);
      }
    }

    let bufferGeometry = new THREE.BufferGeometry().setFromPoints(
      green_geometry_vertices
    );
    bufferGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(green_geometry_colors, 3)
    );

    var material = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: false,
      vertexColors: THREE.VertexColors,
    });
    this.greenMesh = new THREE.Points(bufferGeometry, material);
    this.greenMesh.position.set(center.x, center.y, center.z);
    this.greenMesh.rotation.y = selectedBox.boxModel.angle;
    this.greenMesh.geometry.attributes.position.needsUpdate = true;
    this.greenMesh.name = "greenMesh";
    this.mainController.sceneModel.scene.add(this.greenMesh);
    this.mainController.sceneModel.pointcloud.geometry.attributes.color.needsUpdate = true;

    cube.geometry.dispose();
    cube.material.dispose();
  }

  async checkPointsInAllBox() {
    console.log("checkPointsInAllBox");
    //selectedBox와 pointcloud를 읽어서 selectedBox내의 pointcloud를 초록색으로 바꾸는 함수.
    for (
      let i = 0;
      i < this.mainController.sceneModel.scene.children.length;
      i++
    ) {
      let object = this.mainController.sceneModel.scene.children[i];
      if (object.name == `greenMesh_Not_Selected`) {
        this.mainController.sceneModel.scene.remove(object);
        object.geometry.dispose();
        object.material.dispose();
      }
    }
    // 생성된 박스가 없을때
    if (this.mainController.frameModel.boxes.length == 0) {
      return;
    }

    // // 선택된 박스가 없을때
    // if (selectedBox == null) {
    //   return;
    // }

    // console.log(
    //   "gMNS",
    //   this.mainController.sceneModel.scene.getObjectByName(
    //     `greenMesh_Not_Selected`
    //   ),
    //   this.mainController.sceneModel.scene
    // );
    const selectedBox = this.mainController.frameModel.getSelectedBox();
    for (let k = 0; k < this.mainController.frameModel.boxes.length; k++) {
      if (this.mainController.frameModel.boxes[k] == selectedBox) {
        continue;
      } else {
        let green_geometry_vertices = [];
        let green_geometry_colors = [];
        let box = this.mainController.frameModel.boxes[k];
        const geometry = new THREE.BoxGeometry(
          box.boxModel.dimension.width,
          box.boxModel.dimension.height,
          box.boxModel.dimension.length
        );
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        const center = new THREE.Vector3(
          (box.boxModel.minVector.x + box.boxModel.maxVector.x) / 2,
          (box.boxModel.minVector.y + box.boxModel.maxVector.y) / 2,
          (box.boxModel.minVector.z + box.boxModel.maxVector.z) / 2
        );
        cube.position.set(center.x, center.y, center.z);
        cube.rotation.y = box.boxModel.angle;
        cube.name = "cube";

        cube.updateMatrixWorld();

        var boxMatrixInverse = new THREE.Matrix4().getInverse(
          cube.clone().matrixWorld
        );
        var inverseBox = cube.clone();

        inverseBox.applyMatrix4(boxMatrixInverse);

        var boxTemp = new THREE.Box3().setFromObject(inverseBox);

        // // console.log("point cloud", pointcloud);

        // for(let i =0; i< prev_points.length; i += 3){

        //     if(flag == 0 ){
        //         pointcloud.geometry.attributes.color.array[prev_points[i]] = 255;
        //         pointcloud.geometry.attributes.color.array[prev_points[i+1]] = 255;
        //         pointcloud.geometry.attributes.color.array[prev_points[i+2]] = 255;
        //     }
        // }

        // prev_points = [];
        let positions =
          this.mainController.sceneModel.pointcloud.geometry.attributes.position
            .array;
        for (let i = 0; i < positions.length; i += 3) {
          // let Point = pointcloud.geometry.vertices[i].clone();
          let Point = new THREE.Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          );
          let axis = new THREE.Vector3(1, 0, 0);

          Point.applyAxisAngle(axis, (-90 * Math.PI) / 180);
          Point.applyMatrix4(boxMatrixInverse);

          if (boxTemp.containsPoint(Point)) {
            // console.log("isInsideisInside!!", i);
            // pointcloud.geometry.attributes.color.array[i] = 0;
            // pointcloud.geometry.attributes.color.array[i+1] = 128;
            // pointcloud.geometry.attributes.color.array[i+2] = 0;
            green_geometry_vertices.push(Point);

            // prev_points.push(i,i+1,i+2);
            green_geometry_colors.push(0, 0.5, 0);
          }
        }

        let bufferGeometry = new THREE.BufferGeometry().setFromPoints(
          green_geometry_vertices
        );
        bufferGeometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(green_geometry_colors, 3)
        );

        var greenMeshMaterial = new THREE.PointsMaterial({
          size: 2,
          sizeAttenuation: false,
          vertexColors: THREE.VertexColors,
        });

        let greenMeshNotSelected = new THREE.Points(
          bufferGeometry,
          greenMeshMaterial
        );
        greenMeshNotSelected.position.set(center.x, center.y, center.z);
        greenMeshNotSelected.rotation.y = box.boxModel.angle;
        greenMeshNotSelected.geometry.attributes.position.needsUpdate = true;
        greenMeshNotSelected.name = `greenMesh_Not_Selected`;
        this.mainController.sceneModel.scene.add(greenMeshNotSelected);
        // this.mainController.sceneModel.pointcloud.geometry.attributes.color.needsUpdate = true;

        cube.geometry.dispose();
        cube.material.dispose();
      }
    }
  }

  async checkPointsInAllBox_Lidar() {
    console.log("checkPointsInAllBox_Lidar");
    //selectedBox와 pointcloud를 읽어서 selectedBox내의 pointcloud를 초록색으로 바꾸는 함수.

    for (
      let i = 0;
      i < this.mainController.sceneModel.scene.children.length;
      i++
    ) {
      let object = this.mainController.sceneModel.scene.children[i];
      if (object.name == `greenMesh_Lidar_Not_Selected`) {
        this.mainController.sceneModel.scene.remove(object);
        object.geometry.dispose();
        object.material.dispose();
      }
    }

    // 생성된 박스가 없을때
    if (this.mainController.frameModel.boxes.length == 0) {
      return;
    }

    // // 선택된 박스가 없을때
    // if (selectedBox == null) {
    //   return;
    // }

    // console.log(
    //   "gMNS",
    //   this.mainController.sceneModel.scene.getObjectByName(
    //     `greenMesh_Not_Selected`
    //   ),
    //   this.mainController.sceneModel.scene
    // );
    const selectedBox = this.mainController.frameModel.getSelectedBox();
    for (let k = 0; k < this.mainController.frameModel.boxes.length; k++) {
      if (this.mainController.frameModel.boxes[k] == selectedBox) {
        continue;
      } else {
        let green_geometry_vertices = [];
        let green_geometry_colors = [];
        let box = this.mainController.frameModel.boxes[k];
        const geometry = new THREE.BoxGeometry(
          box.boxModel.lidarMaxVector.x - box.boxModel.lidarMinVector.x,
          box.boxModel.lidarMaxVector.y - box.boxModel.lidarMinVector.y,
          box.boxModel.lidarMaxVector.z - box.boxModel.lidarMinVector.z
        );
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        const center = new THREE.Vector3(
          (box.boxModel.lidarMinVector.x + box.boxModel.lidarMaxVector.x) / 2,
          (box.boxModel.lidarMinVector.y + box.boxModel.lidarMaxVector.y) / 2,
          (box.boxModel.lidarMinVector.z + box.boxModel.lidarMaxVector.z) / 2
        );
        cube.position.set(center.x, center.y, center.z);
        cube.rotation.y = box.boxModel.angle;
        cube.name = "cube";

        cube.updateMatrixWorld();

        var boxMatrixInverse = new THREE.Matrix4().getInverse(
          cube.clone().matrixWorld
        );
        var inverseBox = cube.clone();

        inverseBox.applyMatrix4(boxMatrixInverse);

        var boxTemp = new THREE.Box3().setFromObject(inverseBox);

        // // console.log("point cloud", pointcloud);

        // for(let i =0; i< prev_points.length; i += 3){

        //     if(flag == 0 ){
        //         pointcloud.geometry.attributes.color.array[prev_points[i]] = 255;
        //         pointcloud.geometry.attributes.color.array[prev_points[i+1]] = 255;
        //         pointcloud.geometry.attributes.color.array[prev_points[i+2]] = 255;
        //     }
        // }

        // prev_points = [];
        let positions =
          this.mainController.sceneModel.pointcloudLidar.geometry.attributes
            .position.array;
        for (let i = 0; i < positions.length; i += 3) {
          // let Point = pointcloud.geometry.vertices[i].clone();
          let Point = new THREE.Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          );
          let axis = new THREE.Vector3(1, 0, 0);

          Point.applyAxisAngle(axis, (-90 * Math.PI) / 180);
          Point.applyMatrix4(boxMatrixInverse);

          if (boxTemp.containsPoint(Point)) {
            // console.log("isInsideisInside!!", i);
            // pointcloud.geometry.attributes.color.array[i] = 0;
            // pointcloud.geometry.attributes.color.array[i+1] = 128;
            // pointcloud.geometry.attributes.color.array[i+2] = 0;
            green_geometry_vertices.push(Point);

            // prev_points.push(i,i+1,i+2);
            green_geometry_colors.push(0, 0.5, 0);
          }
        }

        let bufferGeometry = new THREE.BufferGeometry().setFromPoints(
          green_geometry_vertices
        );
        bufferGeometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(green_geometry_colors, 3)
        );

        var greenMeshMaterial = new THREE.PointsMaterial({
          size: 2,
          sizeAttenuation: false,
          vertexColors: THREE.VertexColors,
        });

        let greenMeshNotSelected = new THREE.Points(
          bufferGeometry,
          greenMeshMaterial
        );
        greenMeshNotSelected.position.set(center.x, center.y, center.z);
        greenMeshNotSelected.rotation.y = box.boxModel.angle;
        greenMeshNotSelected.geometry.attributes.position.needsUpdate = true;
        greenMeshNotSelected.name = `greenMesh_Lidar_Not_Selected`;
        greenMeshNotSelected.layers.set(1);
        this.mainController.sceneModel.scene.add(greenMeshNotSelected);
        // this.mainController.sceneModel.pointcloud.geometry.attributes.color.needsUpdate = true;

        cube.geometry.dispose();
        cube.material.dispose();
      }
    }
  }

  async checkPointsInSelectedBox_Lidar() {
    console.log("checkPointsInSelectedBox_Lidar");
    //selectedBox와 pointcloud를 읽어서 selectedBox내의 pointcloud를 초록색으로 바꾸는 함수.
    for (
      let i = 0;
      i < this.mainController.sceneModel.scene.children.length;
      i++
    ) {
      let object = this.mainController.sceneModel.scene.children[i];
      if (object.name == `greenMesh_Lidar`) {
        this.mainController.sceneModel.scene.remove(object);
        object.geometry.dispose();
        object.material.dispose();
      }
    }

    // 생성된 박스가 없을때
    if (this.mainController.frameModel.boxes.length == 0) {
      return;
    }
    const selectedBox = this.mainController.frameModel.getSelectedBox();

    var geometry = new THREE.BoxGeometry(
      selectedBox.boxModel.lidarMaxVector.x -
        selectedBox.boxModel.lidarMinVector.x,
      selectedBox.boxModel.lidarMaxVector.y -
        selectedBox.boxModel.lidarMinVector.y,
      selectedBox.boxModel.lidarMaxVector.z -
        selectedBox.boxModel.lidarMinVector.z
    );
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    const center = new THREE.Vector3(
      (selectedBox.boxModel.lidarMinVector.x +
        selectedBox.boxModel.lidarMaxVector.x) /
        2,
      (selectedBox.boxModel.lidarMinVector.y +
        selectedBox.boxModel.lidarMaxVector.y) /
        2,
      (selectedBox.boxModel.lidarMinVector.z +
        selectedBox.boxModel.lidarMaxVector.z) /
        2
    );
    cube.position.set(center.x, center.y, center.z);
    cube.rotation.y = selectedBox.boxModel.angle;
    cube.name = "cube";

    cube.updateMatrixWorld();

    var boxMatrixInverse = new THREE.Matrix4().getInverse(
      cube.clone().matrixWorld
    );
    var inverseBox = cube.clone();

    inverseBox.applyMatrix4(boxMatrixInverse);

    var boxTemp = new THREE.Box3().setFromObject(inverseBox);

    // // console.log("point cloud", pointcloud);

    // for(let i =0; i< prev_points.length; i += 3){

    //     if(flag == 0 ){
    //         pointcloud.geometry.attributes.color.array[prev_points[i]] = 255;
    //         pointcloud.geometry.attributes.color.array[prev_points[i+1]] = 255;
    //         pointcloud.geometry.attributes.color.array[prev_points[i+2]] = 255;
    //     }
    // }
    var green_geometry_vertices = [];
    var green_geometry_colors = [];
    // prev_points = [];
    let positions =
      this.mainController.sceneModel.pointcloudLidar.geometry.attributes
        .position.array;
    for (let i = 0; i < positions.length; i += 3) {
      // let Point = pointcloud.geometry.vertices[i].clone();
      let Point = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      );
      let axis = new THREE.Vector3(1, 0, 0);

      Point.applyAxisAngle(axis, (-90 * Math.PI) / 180);
      Point.applyMatrix4(boxMatrixInverse);

      if (boxTemp.containsPoint(Point)) {
        // console.log("isInsideisInside!!", i);
        // pointcloud.geometry.attributes.color.array[i] = 0;
        // pointcloud.geometry.attributes.color.array[i+1] = 128;
        // pointcloud.geometry.attributes.color.array[i+2] = 0;
        green_geometry_vertices.push(Point);

        // prev_points.push(i,i+1,i+2);
        green_geometry_colors.push(0, 0.5, 0);
      }
    }

    let bufferGeometry = new THREE.BufferGeometry().setFromPoints(
      green_geometry_vertices
    );
    bufferGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(green_geometry_colors, 3)
    );

    var material = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: false,
      vertexColors: THREE.VertexColors,
    });
    let greenMesh = new THREE.Points(bufferGeometry, material);
    greenMesh.position.set(center.x, center.y, center.z);
    greenMesh.rotation.y = selectedBox.boxModel.angle;
    greenMesh.geometry.attributes.position.needsUpdate = true;
    greenMesh.name = "greenMesh_Lidar";
    greenMesh.layers.set(1);
    this.mainController.sceneModel.scene.add(greenMesh);
    // mainController.sceneModel.pointcloud.geometry.attributes.color.needsUpdate = true;

    cube.geometry.dispose();
    cube.material.dispose();
  }
}
