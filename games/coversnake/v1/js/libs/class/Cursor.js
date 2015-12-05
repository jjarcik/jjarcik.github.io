// cursor is the player and can be only one
/**/
var Cursor = $class({
    Extends: CanvasObject,
    // if moving, there is the actualy path
    path: [],
    // last path before closing the path
    lastpath: [],
    // direction of move by x
    dx: 0,
    // direction of move by y
    dy: 0,
    // is the cursor moving
    isMoving: false,
    // default speed of moving
    speed: 1,
    // helper var for directing speed
    speedcounter: 0,
    // grid
    grid: 5,
    //
    length: 0,
    // cursor make line and its moving
    isonline: false,
    // 
    color: "orange",
    // constructor
    constructor: function (canvas, grid) {
        CanvasObject.call(this, canvas);
        this.x = 0;
        this.y = 0;
        this.grid = grid;
    },
    /**/
    // move the cursor
    move: function () {
        if (this.isMoving) {
            this.x += this.dx;
            this.y += this.dy;
        }
    },
    // detect if there is a colision with border
    detectBorderCollision: function () {

        if (this.x < 0) {            
            this.dx = this.dy = 0;
            this.x = 0;
            return true;
        }
        if (this.y < 0) {
            this.dx = this.dy = 0;
            this.y = 0;
            return true;
        }

        if (this.y > this.getCanvas().height()) {
            console.log(this.y + " > " + this.getCanvas().height());
            this.dx = this.dy = 0;
            this.y = this.getCanvas().height();
            return true;
        }

        if (this.x > this.getCanvas().width()) {
            console.log(this.x + " > " + this.getCanvas().width());
            this.dx = this.dy = 0;
            this.x = this.getCanvas().width();
            return true;
        }

        return false;

    },
    //
    closePath: function () {
        console.log("close path");
        this.savePathPoint();
        this.getCanvas().removeLayer('pathlines');
        //this.getCanvas().removeLayerGroup('pathlines');
        // this.drawLine();
        this.lastpath = this.path;
        this.path = [];
        this.isMoving = false;
    },
    clearPath: function () {
        this.getCanvas().removeLayer('pathlines');
        this.path = [];
        this.lastpath = [];
        this.isMoving = false;
        this.dx = 0;
        this.dy = 0;
        
    },
    savePathPoint: function () {
        //if (this.path.length === 0 || (this.x > 0 && this.y > 0)) {
        // console.log("safe Path point X:" + this.x + ", Y:" + this.y);
        this.path.push({"x": this.x, "y": this.y});
        // }
    },
    // draw actualy path of the cursor
    drawPath: function () {
        // console.log("draw path");
        if (this.getCanvas().getLayer("pathlines")) {
            this.getCanvas().removeLayer("pathlines");
        }

        var line = {
            strokeStyle: '#ccc',
            strokeWidth: 1,
            layer: true,
            name: "pathlines"
        };

        $.each(this.path, function (i, v) {
            line["x" + (i + 1)] = v.x + 0;
            line["y" + (i + 1)] = v.y + 0;
        });

        line["x" + (this.path.length + 1)] = this.x;
        line["y" + (this.path.length + 1)] = this.y;


        this.getCanvas().drawLine(line);//.drawLayers();
    }
    ,
    // draw full lines of every path
    // this is very heavy function
    drawLine: function () {
        console.log("draw lines");
        var el = this.getCanvas().getLayer("lines");
        if (!el) {
            this.getCanvas().drawLine({
                strokeStyle: '#000',
                strokeWidth: 1,
                layer: true,
                name: "lines"
            });

        }

        var lines = [];
        var thl = this.length;
        var th = this;
        $.each(this.path, function (i, v) {
            lines["x" + (i + thl)] = v.x + 0;
            lines["y" + (i + thl)] = v.y + 0;
            th.length++;
        });

        this.getCanvas().setLayer("lines", lines).drawLayers();


        // this.getCanvas().drawLine(line).addLayerToGroup("line" + this.length, 'lines');//.drawLayers();

    },
    // draw object   
    /**/
    draw: function () {
        this.getCanvas().drawArc({
            // draggable: true,
            layer: true,
            name: this.layer,
            fillStyle: this.color,
            x: 0, y: 0,
            radius: 10
        });
    },
    redraw: function () {
        this.getCanvas().setLayer(this.layer, {
            x: this.x,
            y: this.y
        });//.drawLayers();

    },
    getLast1Point: function () {
        if (this.path.length > 0) {
            return this.path[this.path.length - 1];
        } else
            return false;
    },
    getLast2Point: function () {
        if (this.path.length > 1) {
            return [this.path[this.path.length - 1], this.path[this.path.length - 2]];
        } else
            return false;
    },
    //
    clear: function () {
        this.path = [];
        this.lastpath = [];
        this.dx = 0;
        this.dy = 0;
        this.x = 0;
        this.y = 0;
        this.isonline = false;
    },
    // @TODO Move the function to Class Cursor
    changeCurDir: function (d) {
        this.isMoving = true;
        if (!this.isonline) {
            this.savePathPoint();
        }

        switch (d) {
            case "L":
                if (!this.getDirectDx())
                    this.setDirect(-1 * this.grid, 0);
                break;
            case "U":
                if (!this.getDirectDy())
                    this.setDirect(0, -1 * this.grid);
                break;
            case "R":
                if (!this.getDirectDx())
                    this.setDirect(this.grid, 0);
                break;
            case "D":
                if (!this.getDirectDy())
                    this.setDirect(0, this.grid);
                break;
        }
    },
    highLight: function () {
        var $ok = $(".ok", "#atack").removeClass("trans").css({"left": this.x, "top": this.y}).removeClass("big").show();
        setTimeout(function () {
            $ok.addClass("trans").addClass("big");
        }, 100);
    }
    /**/
});
