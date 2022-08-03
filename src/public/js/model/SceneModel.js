class SceneModel {
  constructor() {
    this.scene;
    this.camera;
    this.renderer;
    this.pointcloud = null;
    this.orbitControls = null;
    this.raycaster = null;
    this.transformControls = null;
    this.stats = null;

    this.cameraLidar;
    this.rendererLidar;
    this.pointcloudLidar = null;
    this.orbitControlsLidar = null;
    this.raycasterLidar = null;
  }
}
