class MainController {
    constructor(mainView, mainModel) {
        this.mainView = mainView;
        this.mainModel = mainModel;
        this.frameModel = new FrameModel();
        this.sceneModel = new SceneModel();
        this.fileModel = new FileModel();
        this.layout = new Layout();
        this.mainModel.oldCanvasSize.width = $(this.mainModel.canvas3D).width();

        this.mainModel.oldCanvasSize.height = $(
            this.mainModel.canvas3D
        ).height();

        this.sceneController = new SceneController(this, this.sceneModel);
        this.pointCloudController = new PointCloudController(this);
        this.imageController = new ImageController(this);
        this.fileController = new FileController(this, this.fileModel);
        this.frameController = new FrameController(this, this.frameModel);
        this.eventController = new EventController(this);
    }

    mainInit() {
        this.sceneController.sceneInit();
        this.addEvents();
    }

    addEvents() {
        $("#select_classes").change(function () {
            var value = $(this).val();
            ClassArrayManager.makeSelectSubClass(value);
            document.getElementById("object_property_save").innerText =
                "* save";
        });

        // $("#select_subclasses").change(function () {
        //   var value = $(this).val();
        //   document.getElementById("object_property_save").innerText = "* save";
        // });

        $(".occlusion_radio").on("change", function () {
            var radiovaluetest = $("input[name=occlusion_value]:checked").val();
            // console.log("radiovaluetest",radiovaluetest);
            document.getElementById("object_property_save").innerText =
                "* save";
        });

        $("#select_truncation").change(function () {
            var value = $(this).val();
            // console.log('select_truncation는',value);
            document.getElementById("object_property_save").innerText =
                "* save";
        });

        $("#td_tracking_id").on("change", function () {
            // var boxid = selectedBox.id;
            // // var boxid = document.getElementById("td_tracking_id").value;
            // // console.log("반응하니",boxid);
            // if(boxid != null){
            //     // var box = getBoxById(boxid);
            //     var box = getEvaluatorBoxById(boxid);
            //     // console.log("bbboxxxxxx",box);
            //     // box.truncation = document.getElementById("truncation_value_input").value;
            // }
            document.getElementById("object_property_save").innerText =
                "* save";
        });
    }
}
