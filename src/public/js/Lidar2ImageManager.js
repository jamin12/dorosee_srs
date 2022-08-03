class Lidar2ImageManager {
    static cameraDirection = [
        "front",
        "left_front",
        "left_rear",
        "right_front",
        "right_rear",
    ];
    static cameraArray = {
        front: {
            AngleRot: 0,
            AngleLR: 0,
            AngleUD: 0,
            X_t: 0,
            Y_t: 0,
            Z_t: 0,
            fx: 0,
            fy: 0,
            cx: 0,
            cy: 0,
            k1: 0,
            k2: 0,
            p1: 0,
            p2: 0,
        },
        left_front: {
            AngleRot: 0,
            AngleLR: 0,
            AngleUD: 0,
            X_t: 0,
            Y_t: 0,
            Z_t: 0,
            fx: 0,
            fy: 0,
            cx: 0,
            cy: 0,
            k1: 0,
            k2: 0,
            p1: 0,
            p2: 0,
        },
        right_front: {
            AngleRot: 0,
            AngleLR: 0,
            AngleUD: 0,
            X_t: 0,
            Y_t: 0,
            Z_t: 0,
            fx: 0,
            fy: 0,
            cx: 0,
            cy: 0,
            k1: 0,
            k2: 0,
            p1: 0,
            p2: 0,
        },
        left_rear: {
            AngleRot: 0,
            AngleLR: 0,
            AngleUD: 0,
            X_t: 0,
            Y_t: 0,
            Z_t: 0,
            fx: 0,
            fy: 0,
            cx: 0,
            cy: 0,
            k1: 0,
            k2: 0,
            p1: 0,
            p2: 0,
        },
        right_rear: {
            AngleRot: 0,
            AngleLR: 0,
            AngleUD: 0,
            X_t: 0,
            Y_t: 0,
            Z_t: 0,
            fx: 0,
            fy: 0,
            cx: 0,
            cy: 0,
            k1: 0,
            k2: 0,
            p1: 0,
            p2: 0,
        },
    };

    // HARD CODING

    // // Rz
    // static AngleRot = -0.02007128857076168;

    // // Ry
    // static AngleLR = -0.00534512335434556;

    // // Rx
    // static AngleUD = 0.005977770779281855;

    // Rz
    static AngleRot = 0;

    // Ry
    static AngleLR = 0;

    // Rx
    static AngleUD = 0;

    static X_t = 0;
    static Y_t = 0;
    static Z_t = 0;

    static fx = 0;
    static fy = 0;
    static cx = 0;
    static cy = 0;

    static k1 = 0;
    static k2 = 0;
    static p1 = 0;
    static p2 = 0;

    // parsed data from kitti Calib file

    static R1 = 0;
    static R2 = 0;
    static R3 = 0;
    static T1 = 0;

    static R4 = 0;
    static R5 = 0;
    static R6 = 0;
    static T2 = 0;

    static R7 = 0;
    static R8 = 0;
    static R9 = 0;
    static T3 = 0;

    // static AngleRot = -0.009375;
    // static AngleLR = 1.078813;
    // static AngleUD = 0.072266;

    // static X_t = -0.895957;
    // static Y_t = -1.33812499046326;
    // static Z_t = -0.95531302690506;

    // static fx = 1648.097419;
    // static fy = 1612.646643;
    // static cx = 693.7;
    // static cy = 579.1;
    // static k1 = 0;
    // static k2 = 0;
    // static p1 = 0;
    // static p2 = 0;

    static RT = [
        [0.006204, 0.999981, 0.0, 1.964],
        [-0.999981, 0.006204, 0.0, 0.0745],
        [0.0, 0.0, 1.0, -1.170301],
    ];

    static RT_POSITON = "srs_center.txt";

    static lidar2Radar(x_lidar, y_lidar, z_lidar) {
        let lidar = [[x_lidar], [y_lidar], [z_lidar], [1]];
        const result = math.multiply(this.RT.get(this.RT_POSITON), lidar);
        return [result[0][0], result[1][0], result[2][0]];
    }

    static radar2Lidar(x_camera, y_camera, z_camera) {
        let camera = [[x_camera], [-z_camera], [y_camera], [1]];
        console.log("lidar2Image", this.RT);
        let newRT = [
            this.RT.get(this.RT_POSITON)[0],
            this.RT.get(this.RT_POSITON)[1],
            this.RT.get(this.RT_POSITON)[2],
            [0, 0, 0, 1],
        ];
        const result = math.multiply(math.inv(newRT), camera);
        return { x: result[0][0], y: result[2][0], z: -result[1][0] };
    }

    //
    static Validation_LH_RH_image_nia(calibFileName) {
        // if(folderpath.indexOf("LH") != -1){
        // console.log({ calibFileName });
        fs.readFile(
            calibFileName,
            "utf8",
            function (err, data) {
                // console.log("calib data ->", data);
                let parseData = JSON.parse(data);
                // console.log({ parseData });
                let calibration = parseData.calibration;

                // let lidar = calibration.lidar.front;
                // this.setValueFromLidar(lidar);

                let cameraS = Object.keys(calibration.camera);
                // console.log("cameraArray",cameraS);

                for (let i = 0; i < cameraS.length; i++) {
                    // console.log("cameraS[i]",cameraS[i])
                    const camera = calibration.camera[cameraS[i]];
                    const intrinsic = camera.Intrinsic;
                    const extrinsic = camera.Extrinsic;
                    const distortion = intrinsic.Distortion;

                    // console.log("camera ---------->", camera, intrinsic, distortion);

                    // console.log("Intrinsic", intrinsic);
                    // console.log("Extrinsic", extrinsic);
                    // console.log("distortion", distortion);

                    this.cameraArray[cameraS[i]].AngleRot =
                        (3.14 / 180) * extrinsic.Rx;
                    this.cameraArray[cameraS[i]].AngleLR =
                        (3.14 / 180) * extrinsic.Rz;
                    this.cameraArray[cameraS[i]].AngleUD =
                        (3.14 / 180) * extrinsic.Ry;

                    // this.cameraArray[cameraS[i]].AngleRot = (extrinsic.Rx / 180) * 3.14;
                    // this.cameraArray[cameraS[i]].AngleLR = (extrinsic.Rz / 180) * 3.14;
                    // this.cameraArray[cameraS[i]].AngleUD = (extrinsic.Ry / 180) * 3.14;

                    // this.cameraArray[cameraS[i]].AngleRot = extrinsic.Rx;
                    // this.cameraArray[cameraS[i]].AngleLR = extrinsic.Rz;
                    // this.cameraArray[cameraS[i]].AngleUD = extrinsic.Ry;

                    this.cameraArray[cameraS[i]].X_t = extrinsic.Tx;
                    this.cameraArray[cameraS[i]].Y_t = extrinsic.Ty;
                    this.cameraArray[cameraS[i]].Z_t = extrinsic.Tz;

                    this.cameraArray[cameraS[i]].fx = intrinsic.Fx;
                    this.cameraArray[cameraS[i]].fy = intrinsic.Fy;
                    this.cameraArray[cameraS[i]].cx = intrinsic.Cx;
                    this.cameraArray[cameraS[i]].cy = intrinsic.Cy;

                    this.cameraArray[cameraS[i]].k1 = distortion.Param0;
                    this.cameraArray[cameraS[i]].k2 = distortion.Param1;
                    this.cameraArray[cameraS[i]].p1 = distortion.Param2;
                    this.cameraArray[cameraS[i]].p2 = distortion.Param3;

                    // console.log("this.cameraArray",this.cameraArray[cameraS[i]]);
                }
                console.log("calibration.camera", this.cameraArray);
                this.setValue("front");
                // console.log("fx, fy, cx, cy, k1, k2, p1, p2 ---->",Lidar2ImageManager.fx,Lidar2ImageManager.fy,Lidar2ImageManager.cx,Lidar2ImageManager.cy,Lidar2ImageManager.k1,Lidar2ImageManager.k2,Lidar2ImageManager.p1,Lidar2ImageManager.p2);
            }.bind(this)
        );
    }

    static getXeYeZe_kitti(X_I, Y_I, Z_I) {
        this.k1 = 0;
        this.k2 = 0;
        this.p1 = 0;
        this.p2 = 0;

        // parsed data from kitti calibration file
        var XeYeZe_matrix_operator_1 = [
            [this.R1, this.R2, this.R3, this.T1],
            [this.R4, this.R5, this.R6, this.T2],
            [this.R7, this.R8, this.R9, this.T3],
        ];

        var XeYeZe_matrix_operator_2 = [[X_I], [Y_I], [Z_I], [1]];

        var result = math.multiply(
            XeYeZe_matrix_operator_1,
            XeYeZe_matrix_operator_2
        );
        // console.log("result는? ",result);
        return result;
    }

    static Validation_LH_RH_image(folderpath, calibFileName) {
        // if(folderpath.indexOf("LH") != -1){
        fs.readFile(
            calibFileName,
            "utf8",
            function (err, data) {
                // console.log("Calib---->",data);
                // var parse_calib_json = JSON.parse(data);
                // // console.log("parse_calib",data.split(",")[4].split("Tr")[0]);
                // this.AngleRot = data.split(",")[4].split("Tr")[0];
                // this.AngleLR = data.split(",")[2].split("t")[1];
                // this.AngleUD = data.split(",")[3];

                // console.log("AngleRot, LR, UD --->",this.AngleRot,this.AngleLR,this.AngleUD);
                // this.X_t = data.split(",")[4].split("TranslationMatrix")[1];
                // this.Y_t = data.split("TranslationMatrix")[1].split(",")[1];
                // this.Z_t = data.split("TranslationMatrix")[1].split(",")[2].split("intrinsicCameraParameter")[0];
                // console.log("X_t, Y_t, Z_t ---->",this.X_t,this.Y_t,this.Z_t);

                this.fx = this.changeFormat(
                    data.split("P2: ")[1].split(" ")[0]
                );
                this.fy = this.changeFormat(data.split(" ")[6]);
                this.cx = this.changeFormat(data.split(" ")[3]);
                this.cy = this.changeFormat(data.split(" ")[7]);
                // this.k1 = data.split("intrinsicCameraParameter")[1].split(",")[4];
                // this.k2 = data.split("intrinsicCameraParameter")[1].split(",")[5];
                // this.p1 = data.split("intrinsicCameraParameter")[1].split(",")[6];
                // this.p2 = data.split("intrinsicCameraParameter")[1].split(",")[7].split("----------")[0];

                this.R1 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[0]
                );
                this.R2 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[1]
                );
                this.R3 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[2]
                );
                this.T1 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[3]
                );
                this.R4 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[4]
                );
                this.R5 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[5]
                );
                this.R6 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[6]
                );
                this.T2 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[7]
                );
                this.R7 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[8]
                );
                this.R8 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[9]
                );
                this.R9 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[10]
                );
                this.T3 = this.changeFormat(
                    data.split("Tr_velo_to_cam: ")[1].split(" ")[11]
                );
                // console.log("fx, fy, cx, cy, k1, k2, p1, p2 ---->",this.fx,this.fy,this.cx,this.cy,this.k1,this.k2,this.p1,this.p2);

                this.k1 = 0;
                this.k2 = 0;
                this.p1 = 0;
                this.p2 = 0;

                // console.log("R1 ~ T3", this.R1, this.R2,this.R3,this.T1,this.R4,this.R5,this.R6,this.T2,this.R7,this.R8,this.R9,this.T3);
            }.bind(this)
        );
    }

    static changeFormat(originstring) {
        let origin = originstring;
        let number = Number(origin.split("e")[0]);
        let notnumber = origin.split("e")[1];
        let resultnumber = 0;

        if (notnumber.indexOf("+") != -1) {
            resultnumber = number * 10 ** Number(notnumber.split("+")[1]);
        } else if (notnumber.indexOf("-") != -1) {
            let lower = 10 ** Number(notnumber.split("-")[1]);
            resultnumber = number / lower;
        }
        return resultnumber.toFixed(5);
    }

    static getXeYeZe(X_I, Y_I, Z_I) {
        const tx = this.X_t;
        const ty = this.Y_t;
        const tz = this.Z_t;

        const AngleUD = this.AngleUD;
        const AngleLR = this.AngleLR;
        const AngleRot = this.AngleRot;

        var XeYeZe_matrix_operator_1 = [
            [0, 1, 0],
            [0, 0, -1],
            [-1, 0, 0],
        ];

        var XeYeZe_matrix_operator_2 = [
            [1, 0, 0],
            [0, math.cos(AngleRot), math.sin(AngleRot) * -1],
            [0, math.sin(AngleRot), math.cos(AngleRot)],
        ];

        var XeYeZe_matrix_operator_3 = [
            [math.cos(AngleUD), 0, math.sin(AngleUD)],
            [0, 1, 0],
            [math.sin(AngleUD) * -1, 0, math.cos(AngleUD)],
        ];

        var XeYeZe_matrix_operator_4 = [
            [math.cos(AngleLR), math.sin(AngleLR) * -1, 0],
            [math.sin(AngleLR), math.cos(AngleLR), 0],
            [0, 0, 1],
        ];

        var XeYeZe_matrix_operator_5 = [[X_I - tx], [Y_I - ty], [Z_I - tz]];

        var result = math.multiply(
            XeYeZe_matrix_operator_1,
            XeYeZe_matrix_operator_2
        );
        result = math.multiply(result, XeYeZe_matrix_operator_3);
        result = math.multiply(result, XeYeZe_matrix_operator_4);
        result = math.multiply(result, XeYeZe_matrix_operator_5);
        return result;
    }
    // venus2 kitti style
    static reverseGetXeYeZe(result) {
        this.k1 = 0;
        this.k2 = 0;
        this.p1 = 0;
        this.p2 = 0;

        const XeYeZe1 = [[result[0][0]], [result[1][0]], [result[2][0]], [1]];

        // parsed data from kitti calibration file
        var XeYeZe_matrix_operator_1 = [
            [this.R1, this.R2, this.R3, this.T1],
            [this.R4, this.R5, this.R6, this.T2],
            [this.R7, this.R8, this.R9, this.T3],
            [0, 0, 0, 1],
        ];

        var xyz1 = math.multiply(math.inv(XeYeZe_matrix_operator_1), XeYeZe1);
        var xyz = [[xyz1[0][0]], [xyz1[1][0]], [xyz1[2][0]]];

        return xyz;
    }

    // venus2 before style
    static reverseGetXeYeZe_(result) {
        var XeYeZe_matrix_operator_1 = [
            [0, 1, 0],
            [0, 0, -1],
            [-1, 0, 0],
        ];

        var XeYeZe_matrix_operator_2 = [
            [1, 0, 0],
            [0, math.cos(this.AngleRot), math.sin(this.AngleRot) * -1],
            [0, math.sin(this.AngleRot), math.cos(this.AngleRot)],
        ];

        var XeYeZe_matrix_operator_3 = [
            [math.cos(this.AngleUD), 0, math.sin(this.AngleUD)],
            [0, 1, 0],
            [math.sin(this.AngleUD) * -1, 0, math.cos(this.AngleUD)],
        ];

        var XeYeZe_matrix_operator_4 = [
            [math.cos(this.AngleLR), math.sin(this.AngleLR) * -1, 0],
            [math.sin(this.AngleLR), math.cos(this.AngleLR), 0],
            [0, 0, 1],
        ];

        let resultArray = math.multiply(
            math.inv(XeYeZe_matrix_operator_1),
            result
        );
        resultArray = math.multiply(
            math.inv(XeYeZe_matrix_operator_2),
            resultArray
        );
        resultArray = math.multiply(
            math.inv(XeYeZe_matrix_operator_3),
            resultArray
        );
        resultArray = math.multiply(
            math.inv(XeYeZe_matrix_operator_4),
            resultArray
        );

        let returnarray = [
            resultArray[0][0] + this.X_t,
            resultArray[1][0] + this.Y_t,
            resultArray[2][0] + this.Z_t,
        ];
        return returnarray;
    }

    static makeArray(x3d, y3d, z3d) {
        // console.log("return array ->",[[x3d],[y3d],[z3d]]);
        return [[x3d], [y3d], [z3d]];
    }

    static getXuYu(XeYeZe_matrix) {
        var Xe = XeYeZe_matrix[0][0];
        var Ye = XeYeZe_matrix[1][0];
        var Ze = XeYeZe_matrix[2][0];

        var result = [[Xe / Ze], [Ye / Ze]];

        return result;
    }

    static getRuSquare(XuYu_matrix) {
        var Xu = XuYu_matrix[0][0];
        var Yu = XuYu_matrix[1][0];

        var RuSquare = Xu * Xu + Yu * Yu;

        return RuSquare;
    }

    // Xd Yd 메소드 이상함

    static getXdYd(RuSquare, XuYu_matrix, k1, k2, p1, p2) {
        var coef_for_operator_1 = 1 + k1 * RuSquare + k2 * RuSquare * RuSquare;
        var Xu = XuYu_matrix[0][0];
        var Yu = XuYu_matrix[1][0];

        var getXdYd_matrix_operator_1 = [
            [Xu * coef_for_operator_1],
            [Yu * coef_for_operator_1],
        ];

        var getXdYd_matrix_operator_2 = [
            [2 * p1 * Xu * Yu + p2 * (RuSquare + 2 * Xu * Xu)],
            [p1 * (RuSquare + 2 * Yu * Yu) + 2 * p2 * Xu * Yu],
        ];

        var result = math.add(
            getXdYd_matrix_operator_1,
            getXdYd_matrix_operator_2
        );

        return result;
    }

    static getXpYp(XdYd_matrix, fx, fy, cx, cy) {
        var Xd = XdYd_matrix[0][0];
        var Yd = XdYd_matrix[1][0];

        var getXpYp_matrix_operator_1 = [
            [fx, 0, cx],
            [0, fy, cy],
            [0, 0, 0],
        ];

        var getXpYp_matrix_operator_2 = [[Xd], [Yd], [1]];

        var result = math.multiply(
            getXpYp_matrix_operator_1,
            getXpYp_matrix_operator_2
        );

        result = [[result[0][0]], [result[1][0]]];

        return result;
    }

    static lidar2Image_prev(x_lidar, y_lidar, z_lidar) {
        var XeYeZe_matrix = this.getXeYeZe_kitti(x_lidar, y_lidar, z_lidar);

        var XuYu_matrix = this.getXuYu(XeYeZe_matrix);

        var RuSquare = this.getRuSquare(XuYu_matrix);

        var XdYd_matrix = this.getXdYd(
            RuSquare,
            XuYu_matrix,
            this.k1,
            this.k2,
            this.p1,
            this.p2
        );

        var XpYp_matrix = this.getXpYp(
            XdYd_matrix,
            this.fx,
            this.fy,
            this.cx,
            this.cy
        );

        return { x: XpYp_matrix[0][0], y: XpYp_matrix[1][0] };
    }

    static lidar2Image(z_lidar, x_lidar, y_lidar) {
        const XcYcZc_matrix = this.getXcYcZc(x_lidar, -z_lidar, y_lidar);

        const UV_Matrix = this.getUV(XcYcZc_matrix);

        return { x: UV_Matrix[0], y: UV_Matrix[1] };
    }

    static async setValue(direction) {
        try {
            switch (direction) {
                case "front":
                    direction = "front";
                    break;
                case "leftfront":
                    direction = "left_front";
                    break;
                case "leftrear":
                    direction = "left_rear";
                    break;
                case "rightfront":
                    direction = "right_front";
                    break;
                case "rightrear":
                    direction = "right_rear";
                    break;
            }

            this.AngleRot = this.cameraArray[direction].AngleRot;

            this.AngleLR = this.cameraArray[direction].AngleLR;

            this.AngleUD = this.cameraArray[direction].AngleUD;

            this.X_t = this.cameraArray[direction].X_t;
            this.Y_t = this.cameraArray[direction].Y_t;
            this.Z_t = this.cameraArray[direction].Z_t;

            this.fx = this.cameraArray[direction].fx;
            this.fy = this.cameraArray[direction].fy;
            this.cx = this.cameraArray[direction].cx;
            this.cy = this.cameraArray[direction].cy;

            this.k1 = this.cameraArray[direction].k1;
            this.k2 = this.cameraArray[direction].k2;
            this.p1 = this.cameraArray[direction].p1;
            this.p2 = this.cameraArray[direction].p2;

            console.log("fx,fy,cx,cy", this.fx, this.fy, this.cx, this.cy);
        } catch (e) {
            console.error(e);
        }
    }

    static getXcYcZc(X, Y, Z) {
        // console.log("dataTest", {
        //   tx: this.X_t,
        //   ty: this.Y_t,
        //   tz: this.Z_t,
        //   rx: this.AngleRot,
        //   ry: this.AngleUD,
        //   rz: this.AngleLR,
        //   cx: this.cx,
        //   cy: this.cy,
        //   fx: this.fx,
        //   fy: this.fy,
        //   k1: this.k1,
        //   k2: this.k2,
        //   p1: this.p1,
        //   p2: this.p2,
        // });

        const tx = this.X_t;
        const ty = this.Y_t;
        const tz = this.Z_t;

        // z Index 가 반대 방향일 경우도 생각을 해야함
        const rx = this.AngleRot;
        const ry = this.AngleUD;
        const rz = this.AngleLR;

        var s1 = math.sin(rx);
        var s2 = math.sin(ry);
        var s3 = math.sin(rz);

        var c1 = math.cos(rx);
        var c2 = math.cos(ry);
        var c3 = math.cos(rz);

        var Twc = [[tx], [ty], [tz]];

        var Rwc = [
            [c2 * s3, -s2, c2 * c3],
            [-c1 * c3 + s1 * s2 * s3, s1 * c2, c1 * s3 + s1 * s2 * c3],
            [-s1 * c3 - c1 * s2 * s3, -c1 * c2, s1 * s3 - c1 * s2 * c3],
        ];

        var minus_RwcT = [
            [-Rwc[0][0], -Rwc[1][0], -Rwc[2][0]],
            [-Rwc[0][1], -Rwc[1][1], -Rwc[2][1]],
            [-Rwc[0][2], -Rwc[1][2], -Rwc[2][2]],
        ];

        const right_value = math.multiply(minus_RwcT, Twc);

        var total_value = [
            [Rwc[0][0], Rwc[1][0], Rwc[2][0], right_value[0][0]],
            [Rwc[0][1], Rwc[1][1], Rwc[2][1], right_value[1][0]],
            [Rwc[0][2], Rwc[1][2], Rwc[2][2], right_value[2][0]],
        ];

        const result = math.multiply(total_value, [[X], [Y], [Z], [1]]);

        return result;
    }

    static reverseXcYcZc(result) {
        const tx = this.X_t;
        const ty = this.Y_t;
        const tz = this.Z_t;
        const rx = this.AngleRot;
        const ry = this.AngleUD;
        const rz = this.AngleLR;

        var s1 = math.sin(rx);
        var s2 = math.sin(ry);
        var s3 = math.sin(rz);

        var c1 = math.cos(rx);
        var c2 = math.cos(ry);
        var c3 = math.cos(rz);

        var Twc = [[tx], [ty], [tz]];

        var Rwc = [
            [c2 * s3, -s2, c2 * c3],
            [-c1 * c3 + s1 * s2 * s3, s1 * c2, c1 * s3 + s1 * s2 * c3],
            [-s1 * c3 - c1 * s2 * s3, -c1 * c2, s1 * s3 - c1 * s2 * c3],
        ];

        var minus_RwcT = [
            [-Rwc[0][0], -Rwc[1][0], -Rwc[2][0]],
            [-Rwc[0][1], -Rwc[1][1], -Rwc[2][1]],
            [-Rwc[0][2], -Rwc[1][2], -Rwc[2][2]],
        ];

        const right_value = math.multiply(minus_RwcT, Twc);

        var total_value = [
            [Rwc[0][0], Rwc[1][0], Rwc[2][0], right_value[0][0]],
            [Rwc[0][1], Rwc[1][1], Rwc[2][1], right_value[1][0]],
            [Rwc[0][2], Rwc[1][2], Rwc[2][2], right_value[2][0]],
            [0, 0, 0, 1],
        ];

        const result_4dim = [result[0], result[1], result[2], [1]];
        const xyz1 = math.multiply(math.inv(total_value), result_4dim);
        // const result = this.multiplyMatrices(total_value, [[X], [Y], [Z], [1]]);
        // 카메라 회전 값

        return xyz1;
    }

    static getUV(result) {
        const xc = result[0][0];
        const yc = result[1][0];
        const zc = result[2][0];

        const x = xc / zc;
        const y = yc / zc;

        const cx = this.cx;
        const cy = this.cy;
        // 카메라 화각 x y
        const fx = this.fx;
        const fy = this.fy;

        const k1 = this.k1;
        const k2 = this.k2;
        const p1 = this.p1;
        const p2 = this.p2;

        const rSquare = x * x + y * y;

        const xd =
            x * (1 + k1 * rSquare + k2 * rSquare * rSquare) +
            (2 * p1 * x * y + p2 * (rSquare + 2 * x * x));
        const yd =
            y * (1 + k1 * rSquare + k2 * rSquare * rSquare) +
            (2 * p2 * x * y + p1 * (rSquare + 2 * y * y));

        const u = cx + fx * xd;
        const v = cy + fy * yd;

        return [u, v];
    }
}
