class BoxModel {
    constructor(minVector, maxVector, angle, box3, box3Helper) {
        this.minVector = minVector;
        this.maxVector = maxVector;
        this.angle = angle;
        // bounding Box
        this.box3 = box3;
        this.box3Helper = box3Helper;
        // this.box3HelperLidar = new THREE.Box3Helper(box3, 0xff0000);
        this.text3D;
        this.arrowHelper;

        this.heightCar = 1.65;
        this.centerZ = 0.9;

        this.anchor;

        this.boxOrder - 1;

        this.yaw = 0;
        this.distance = 0;
        this.box2D = {
            xmin: 0,
            xmax: 0,
            ymin: 0,
            ymax: 0,
        };
        this.dimension = {
            width: 0,
            height: 0,
            length: 0,
        };
        this.location;

        this.geometry = [];

        this.boxPoints = {
            top: {
                leftFront: 0,
                leftRear: 0,
                rightFront: this.maxVector,
                rightRear: 0,
            },
            bottom: {
                leftFront: 0,
                leftRear: this.minVector,
                rightFront: 0,
                rightRear: 0,
            },
        };

        this.lineArray;
        this.selectboxLineArray;
        this.lineXArray;
        this.lineYArray;

        this.bufferGeometry = new THREE.BufferGeometry();
        this.frameNo = 1;
        this.id = 1;
        this.subId = -1;
        this.objType = "value1";
        this.category = "BICYCLE";
        this.AtypicalYn = "y";
        this.cameraVisibility = "y";

        this.lidarPosition;
        this.lidarMinVector;
        this.lidarMaxVector;
        this.box3Lidar = null;
        this.box3HelperLidar = null;
        this.canvasRects = [];
        // tw : json load 시에만 사용
        this.loadBox2 = [];
    }
}
