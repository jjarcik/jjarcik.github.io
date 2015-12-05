var Canvas = function (id) {
    // HTML DOOM ID
    this.id = id;
    // jQuery object
    this.elm = $(this.id);
    // size of canvas
    this.size = [];
    // array of all object in canvas
    this.objects = {};
        
};

Canvas.prototype = {
    // get ID
    getID: function () {
        return this.id;
    },
    // get jQuery Element
    getCanvas: function () {
        return this.elm;
    },
    // add Object to Canvas
    addCanvasObject: function (key, value) {        
        value.setLayer(key);
        this.objects[key] = value;
    },
    getCanvasObject: function (key) {        
        return this.objects[key];
    },
    // draw all object
    drawAll: function () {                       
        $.each(this.objects, function (i, o) {           
            o.draw();
        });        
        this.elm.drawLayers();
    },
     // draw all object
    redrawAll: function () {               
        $.each(this.objects, function (i, o) {           
            o.redraw();
        });
        this.elm.drawLayers();
    },
    setSize: function (w, h) {
        this.size = [w, h];
        this.elm.attr("width", w).attr("height", h);
    },
    clear: function (){
        this.objects = {};
    }
};