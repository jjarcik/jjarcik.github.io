// fly is the enemy and there can be more flies
var Fly = $class({
    Extends: CanvasObject,
    // direction of move by x
    dx: 0,
    // direction of move by y
    dy: 1,
    //
    drawstyle: 1,
    //
    grid: 5,
    // koeficient of speed 
    // 1 is the fastest, 10 is the slowest
    speed: 2,
    // helper var for directing speed
    speedcounter: 0,
    // true if the direct of the fly was changed, we can use it for some special
    // efects f.ex. do an action after border collision
    directchanged: false,
    // colors
    colors: ["#333", "#333", "#444", "#444", "#444"],
    //
    id: 0,
    // constructor
    constructor: function (canvas, grid, space, i) {
        CanvasObject.call(this, canvas);
        this.x = Math.floor((Math.random() * space[0] / grid)) * grid;
        this.y = Math.floor((Math.random() * space[1] / grid)) * grid;
        this.dx = Math.floor((Math.random() * 2 - 1)) * grid;
        this.dy = Math.floor((Math.random() * 2) - 1) * grid;
        this.dy = (this.dy === 0) ? grid : this.dy;
        this.dx = (this.dx === 0) ? grid : this.dx;
        this.grid = grid;
        this.id = i;
        this.color = this.colors[this.id];


    },
    // move the fly
    move: function () {
        this.directchanged = false;
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
        this.detectBorderCollision();
    },
    // detect if there is a colision with border
    detectBorderCollision: function () {
        if (this.y + this.dy < 0 || this.y + this.dy > this.getCanvas().height()) {
            this.dy = -this.dy;
            this.directchanged = true;
        }

        if (this.x + this.dx < 0 || this.x + this.dx > this.getCanvas().width()) {
            this.dx = -this.dx;
            this.directchanged = true;
        }

    },
    detectInAreaCollision: function (area) {
        var fp = {};
        // check colision point before moving
        fp.x = this.x + this.dx;
        fp.y = this.y + this.dy;

        var p = area.getPoint({x: fp.x, y: fp.y});
        if (p) {
            switch (p) {
                case 2:
                    console.log(fp.x + ", " + fp.y);
                    console.log(fp);
                    return true;
                case 1:
                    var t1 = area.getPoint({x: fp.x - this.grid, y: fp.y});
                    var t2 = area.getPoint({x: fp.x + this.grid, y: fp.y});
                    var t3 = area.getPoint({x: fp.x, y: fp.y - this.grid});
                    var t4 = area.getPoint({x: fp.x, y: fp.y + this.grid});

                    if (this.drawstyle !== 2) {
                        if (t1 && t2) {
                            this.dy = -this.dy;
                            this.directchanged = true;
                        }

                        if (t3 && t4) {
                            this.dx = -this.dx;
                            this.directchanged = true;
                        }
                    } else {

                    }
            }
        }
        return false;
    },
    // set color
    setColor: function (color) {
        this.color = color;
    },
    getColor: function () {
        return this.color;
    },
    //@TODO PUT THIS METHODS TO CANVAS OBJECT
    getDXDY: function () {
        return {dx: this.dx, dy: this.dy};
    },
    // first draw
    draw: function () {
        switch (this.drawstyle) {
            case 3:
            case 1:
                this.getCanvas().removeLayer(this.layer);
                this.getCanvas().drawArc({
                    layer: true,
                    name: this.layer,
                    fillStyle: this.color,
                    x: 0, y: 0,
                    radius: 10
                });
                break;
            case 2:
                console.log("draw");
                this.getCanvas().removeLayer(this.layer);
                this.getCanvas().drawRect({
                    layer: true,
                    name: this.layer,
                    fillStyle: this.color,
                    x: 0, y: 0,
                    width: 20,
                    height: 20
                });
                break;
        }
    },
    redraw: function () {
        this.getCanvas().setLayer(this.layer, {
            x: this.x,
            y: this.y
        });//.drawLayers();
    },
    beSquare: function () {
        this.drawstyle = 2;
        this.draw();
        this.redraw();
        console.log("BE square");
    },
    beHard: function () {
        this.drawstyle = 3;
        this.color = "#F7DC2D";
        this.draw();
        this.redraw();
        console.log("BE Hard");
    },
    beQuick: function () {
        this.dx *= 2;
        this.dy *= 2;
    },
    beNormal: function () {
        this.drawstyle = 1;
        this.color = this.colors[this.id];
        this.draw();
        this.redraw();
        console.log("BE Normal");
    },
    heighLight: function () {
        var $point = $("<div style='left:" + this.x + "px;top:" + this.y + "px'/>");
        $point.addClass("trans");
        $("#atack").append($point);
        setTimeout(function () {
            $point.addClass("big");
        }, 100);
    },
    special: function (area, background) {
        if (this.drawstyle === 2) {
            if (area.getPoint({x: this.x, y: this.y})) {
                // this.area.mask[f.y / th.options.GRID][f.x / th.options.GRID] = 0;
                // th.background.drawOne(f.x - th.options.GRID, f.y - th.options.GRID, 3);
                /**/
                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        area.setPoint({x: this.x + i * this.grid, y: this.y + j * this.GRID}, 0);
                    }
                }/**/
                // console.log({x:f.x - th.options.GRID,y:f.y - th.options.GRID});
            }
        }


        if (this.drawstyle === 3 && this.directchanged) {
            console.log("do HARD");
            // this.area.mask[f.y / th.options.GRID][f.x / th.options.GRID] = 0;
            background.drawOne(this.x - 10 * this.grid, this.y - 10 * this.grid, 21);
            /**/
            for (var i = -10; i <= 10; i++) {
                for (var j = -10; j <= 10; j++) {
                    area.setPoint({x: this.x + i * this.grid, y: this.y + j * this.grid}, 0);
                }
            }/**/


        }
    }
});