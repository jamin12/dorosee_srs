class FileModel {
    constructor() {
        this.frameSize;
        this.lidarFiles = [];
        this.imageFiles = [];
        this.radarFiles = [];
        // tw : add result Files
        this.resultFiles = [];
        this.lidarCalibFiles = [];
        this.blurFiles = [];

        this.rootPath;
        this.lidarCalibPath;
        this.blurPath;
        this.lidarPath;
        this.radarPath;
        this.imagePath;
        this.resultPath;
        this.rootFolderFiles;
        this.blurImgPath;
        this.JSONOBjects;
    }
}
