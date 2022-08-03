class JsonModel {
    constructor() {
        this.frameNo = 0;
        this.annotation = [];
    }

    fromJson(json) {
        this.frameNo = json.frame_no;
        for (let i = 0; i < json.annotation.length; i++) {
            let annotationModel = new AnnotaionModel();
            annotationModel.fromJson(json.annotation[i]);
            this.annotation.push(annotationModel);
        }
        return this;
    }

    toJson() {
        const annotations = [];
        for (let i = 0; i < this.annotation.length; i++) {
            annotations.push(this.annotation[i].toJson());
        }

        return {
            frame_no: this.frameNo,
            annotation: annotations,
        };
    }
}
