class AnnotaionModel {
    constructor() {
        this.id = 0;
        this.category = "";
        this.objType = 0;
        this.atypicalYn = "";
        this.list3D = [];
        this.cameraVisibility;
        this.list2D = [];
    }

    fromJson(json) {
        this.id = json.id;
        this.category = json.category;
        this.objType = json.obj_type;
        this.atypicalYn = json.atypical_yn;

        for (let i = 0; i < json["3d_box"].length; i++) {
            let box = json["3d_box"][i];
            this.list3D.push({
                subId: box.sub_id,
                location: box.location,
                dimension: box.dimension,
                distance: box.distance,
                rotationY: box.rotation_y,
            });
        }

        this.cameraVisibility = json.camera_visibility;
        this.list2D = json["2d_polygon"];
    }

    toJson() {
        return {
            id: this.id, //한 객체를 가리키는 아이디
            category: this.category, //객체 종류 이름 (e.g. 승용차)
            obj_type: this.objType, //객체 타입 (동적 객체=0 or 주행환경 객체=1)
            atypical_yn: this.atypicalYn, //비정형 객체 유무 (육교, 램프구간, 중앙분리대, 방음벽: y, 도로위표지판, 가로수, 터널 : n)
            "3d_box": this.list3D.map((box) => {
                return {
                    sub_id: box.subId,
                    location: box.location,
                    dimension: box.dimension,
                    distance: box.distance,
                    rotation_y: box.rotationY,
                };
            }),
            camera_visibility: "y", //카메라 이미지 분별 여부(900px 미만 or 객체 종류 식별 불가)
            "2d_polygon": this.list2D, //비정형 객체에 대해 폴리곤 좌표 리스트 부여, 그 외의 객체에 대해서는 null
        };
    }

    toBoxModels() {
        const boxModels = [];
        for (let i = 0; i < this.list3D.length; i++) {
            const current3D = this.list3D[i];
            const boxModel = new BoxModel();

            boxModel.subId = current3D.subId;
            boxModel.location = {
                x: current3D.location[0],
                y: current3D.location[1],
                z: current3D.location[2],
            };

            boxModel.dimension = {
                width: current3D.dimension[0],
                height: current3D.dimension[1],
                length: current3D.dimension[2],
            };

            boxModel.angle = current3D.rotationY;

            let newCanvasRect = [...this.list2D];
            boxModel.loadBox2 = [];
            const polygons = [];
            let index = 0;
            newCanvasRect.map((rect) => {
                let geometry = [];
                rect.map((point) => {
                    geometry.push({ x: point[0], y: point[1] });
                    return point;
                });

                const polygon = {
                    name: "2DLabel",
                    order: index,
                    geometry: geometry,
                };

                if (geometry.length > 0) polygons.push(polygon);
                index++;
                return rect;
            });

            boxModel.loadBox2 = polygons;

            boxModels.push(boxModel);
        }
        return boxModels;
    }

    fromBoxModel(boxModel) {
        this.id = boxModel.id;
        this.atypicalYn = boxModel.AtypicalYn;
        this.cameraVisibility = boxModel.cameraVisibility;
        this.category = boxModel.category;
        this.objType = boxModel.objType == "value1" ? 1 : 0;

        const location = [];
        const dimension = [];

        location.push(boxModel.location.x);
        location.push(boxModel.location.y);
        location.push(boxModel.location.z);

        dimension.push(boxModel.dimension.width);
        dimension.push(boxModel.dimension.height);
        dimension.push(boxModel.dimension.length);

        let canvasRects = [];
        canvasRects = [...boxModel.canvasRects];
        const polygons = [];
        canvasRects.map((rect) => {
            const polygon = [];
            rect.geometry.map((point) => {
                const points = [];
                points.push(point.x);
                points.push(point.y);
                if (point.x != null && point.y) polygon.push(points);
                return point;
            });
            3;
            if (polygon.length > 0) polygons.push(polygon);
            return rect;
        });
        this.list2D = polygons;

        this.list3D.push({
            subId: boxModel.subId, // subId 추가 필요
            location: location,
            dimension: dimension,
            rotationY: boxModel.angle,
        });
    }
}
