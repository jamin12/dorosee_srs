

class MouseEventModel{

    static MOUSE_EVENT = {
        NONE : 0,
        DRAG : 1,
        RIGHT_DRAG : 2,
        MOUSE_DOWN : 3,
    };

    static mouseEvent = this.MOUSE_EVENT.NONE;

    constructor(){
        this.mouse = {};
        this.anchor = {};
        this.anchorCursor;
        this.pastPosition = {x:0,y:0};
        this.positionMovement = {};
        this.firstPosition = {};
        this.positionDiff = {};
    }

    
}