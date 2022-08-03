class SceneController {
  constructor(mainController, sceneModel) {
    this.mainController = mainController;
    this.sceneModel = sceneModel;
    this.oldCanvasSize = this.mainController.mainModel.oldCanvasSize;
    this.canvas3D = this.mainController.mainView.canvas3D;
    this.canvasRadar = this.mainController.mainView.canvasRadar;
  }

  async animate() {
    requestAnimationFrame(() => this.animate());
    this.render();

    this.sceneModel.stats.update();
  }

  render() {
    this.sceneModel.renderer.render(
      this.sceneModel.scene,
      this.sceneModel.camera
    );
    if (
      this.resizeRendererToDisplaySize(
        this.sceneModel.renderer,
        this.canvasRadar
      )
    ) {
      // console.log("canvas 크기 달라짐");
      this.sceneModel.camera.aspect =
        this.canvasRadar.clientWidth / this.canvasRadar.clientHeight;
      this.sceneModel.camera.updateProjectionMatrix();
    }

    this.sceneModel.rendererLidar.render(
      this.sceneModel.scene,
      this.sceneModel.cameraLidar
    );
    if (
      this.resizeRendererToDisplaySize(
        this.sceneModel.rendererLidar,
        this.canvas3D
      )
    ) {
      // console.log("canvas 크기 달라짐");
      this.sceneModel.cameraLidar.aspect =
        this.canvas3D.clientWidth / this.canvas3D.clientHeight;
      this.sceneModel.cameraLidar.updateProjectionMatrix();
    }
    // stats.update();
    // update_footer(getCurrentPosition());
  }

  addStats() {
    this.sceneModel.stats = new Stats();
    this.sceneModel.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.sceneModel.stats.dom.style.position = "absolute";
    document
      .querySelector(".threeD_frame")
      .appendChild(this.sceneModel.stats.dom);
  }

  async sceneInit() {
    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 1, 0);

    let scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));
    this.sceneModel.scene = scene;
    this.addStats();
    this.cameraInit();
  }

  async cameraInit() {
    let camera = new THREE.PerspectiveCamera(
      45,
      this.oldCanvasSize.width / this.oldCanvasSize.height,
      1,
      10000
    );
    camera.position.set(0, 100, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.sceneModel.camera = camera;
    let renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRadar,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = true;
    this.sceneModel.renderer = renderer;

    let orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.rotate((90 * Math.PI) / 180);
    orbitControls.update();
    this.sceneModel.orbitControls = orbitControls;
    this.addTransformControls();

    this.sceneModel.cameraLidar = new THREE.PerspectiveCamera(
      45,
      this.oldCanvasSize.width / this.oldCanvasSize.height,
      1,
      10000
    );

    this.sceneModel.cameraLidar.position.set(0, 100, 0);
    this.sceneModel.cameraLidar.lookAt(new THREE.Vector3(0, 0, 0));
    this.sceneModel.cameraLidar.layers.set(1);
    this.sceneModel.rendererLidar = new THREE.WebGLRenderer({
      canvas: this.canvas3D,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    this.sceneModel.rendererLidar.setPixelRatio(window.devicePixelRatio);
    this.sceneModel.rendererLidar.autoClear = true;

    this.sceneModel.orbitControlsLidar = new THREE.OrbitControls(
      this.sceneModel.cameraLidar,
      this.sceneModel.rendererLidar.domElement
    );
    this.sceneModel.orbitControlsLidar.rotate((90 * Math.PI) / 180);
    this.sceneModel.orbitControlsLidar.update();
  }

  async addTransformControls() {
    this.sceneModel.transformControls = new THREE.TransformControls(
      this.sceneModel.camera,
      this.sceneModel.renderer.domElement
    );
    this.sceneModel.scene.add(this.sceneModel.transformControls);

    this.sceneModel.transformControls.addEventListener("mouseDown", () => {
      this.sceneModel.orbitControls.enabled = false;
    });
    this.sceneModel.transformControls.addEventListener("mouseUp", () => {
      this.sceneModel.orbitControls.enabled = true;
    });
  }

  resizeRendererToDisplaySize(renderer, canvasRadar) {
    //const canvas = render.domElement;
    const width = canvasRadar.clientWidth;
    const height = canvasRadar.clientHeight;
    const needResize =
      canvasRadar.width !== width || canvasRadar.height !== height;

    if (needResize) {
      this.oldCanvasSize.width = width;
      this.oldCanvasSize.height = height;
      renderer.setSize(width, height, false);
    }

    return needResize;
  }
}
