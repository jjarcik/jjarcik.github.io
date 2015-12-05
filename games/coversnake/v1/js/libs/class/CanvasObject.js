var CanvasObject = $class({
    x: 0,
    y: 0,
    dx:0,
    dy:0,
    layer: "",
    canvas: "",
    color: "red",
    constructor: function (canvas) {
        this.canvas = canvas;
    },
    draw: function () {
        //  console.log("drawing real in parent ");
    },
    setLayer: function (layname) {
        //  console.log(layname + " is the name of layer");
        this.layer = layname;
    },
    setX: function (x) {
        this.x = x;
    },
    setY: function (y) {
        this.y = y;
    },
    setXY: function (x, y) {
        this.y = y;
        this.x = x;
    },
    getX: function () {
        return this.x;
    },
    getY: function () {
        return this.y;
    },
    getXY: function () {
        return {"x": this.x, "y": this.y};
    },
    setCanvas: function (canvas) {
        this.canvas = canvas;
    },
    getCanvas: function () {
        return this.canvas;
    },    
    setDirect: function (dx, dy) {
        this.dx = dx;
        this.dy = dy;
    },    
    getDirectDx: function () {
        return this.dx;       
    },    
    getDirectDy: function () {
        return this.dy;       
    }

});