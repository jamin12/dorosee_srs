
var position_movement = {} ; 
var first_position = {};
var position_diff = {} ;




class EventController {
    constructor(mainController) {
        this.mainController = mainController;
        this.mainView = mainController.mainView;

        this.keyEventModel = new KeyEventModel();
        this.keyEventController = new KeyEventController(mainController,this.keyEventModel);

        this.mouseEventModel = new MouseEventModel();
        this.mouseEventController = new MouseEventController(mainController,this.mouseEventModel);
    }
    
}
