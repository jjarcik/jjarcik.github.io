var Background = function () {
    // canvas
    this.canvas;
    // size
    this.size;
    // grid
    this.grid = 5;
    // uncovered
    this.uncovered = 0;

};

Background.prototype = {
    uncover: function (path, area, flies, bonus) {

        console.log("uncover background");

        if (path.length <= 1) {
            console.error("cesta je moc kratka");
            return this.uncovered;
        }

        var PL = [], PR = [];
         // console.log(path);
         //this.consoleArea(area);

        for (var i = 0; i < path.length - 1; i++) {

            var A = path[i];
            var B = path[i + 1];

            if (A.y === B.y && (A.y === 0 || A.y === (area.length - 1) * this.grid)){
                //console.log("continue  A.y: " +  A.y + " area.length:" + (area.length-1) * this.grid)
                continue;
            }
            
            if (A.x === B.x && (A.x === 0 || A.x === (area[0].length - 2) * this.grid)) {
                //console.log("continue  A.x: " +  A.x + " area[0].length:" + (area[0].length-2) * this.grid)
                continue;
            }

            /**/
            if (A.y === B.y) {
                var inc = (A.x < B.x) ? 1 : -1;
                for (var j = A.x / this.grid + inc; j !== B.x / this.grid + inc; j = j + inc) {
                    for (var k = -1; k <= 1; k = k + 2) {
                        // @TODO  / this.grid is not good maping
                        if (area[A.y / this.grid + k] && area[A.y / this.grid + k][j] === 0) {
                            if (inc > 0) {
                                if (k === -1) {
                                    PL.push({y: A.y / this.grid + k, x: j});
                                    area[A.y / this.grid + k][j] = "L";
                                } else {
                                    PR.push({y: A.y / this.grid + k, x: j});
                                    area[A.y / this.grid + k][j] = "R";
                                }
                            } else {
                                if (k === -1) {
                                    PR.push({y: A.y / this.grid + k, x: j});
                                    area[A.y / this.grid + k][j] = "R";
                                } else {
                                    PL.push({y: A.y / this.grid + k, x: j});
                                    area[A.y / this.grid + k][j] = "L";
                                }
                            }
                        }
                    }
                }
            }/**/

            if (A.x === B.x) {
                var inc = (A.y < B.y) ? 1 : -1;
                for (var j = A.y / this.grid; j !== B.y / this.grid; j = j + inc) {
                    for (var k = -1; k <= 1; k = k + 2) {
                        if (area[j][A.x / this.grid + k] === 0) {
                            if (inc > 0) {

                                if (k === -1) {
                                    PR.push({y: j, x: A.x / this.grid + k});
                                    area[j][A.x / this.grid + k] = "R";
                                } else {
                                    PL.push({y: j, x: A.x / this.grid + k});
                                    area[j][A.x / this.grid + k] = "L";
                                }
                            } else {
                                if (k === -1) {
                                    PL.push({y: j, x: A.x / this.grid + k});
                                    area[j][A.x / this.grid + k] = "L";
                                } else {
                                    PR.push({y: j, x: A.x / this.grid + k});
                                    area[j][A.x / this.grid + k] = "R";
                                }
                            }
                        }
                    }
                }
            }
        }

        var findNB = function (P) {
            var NP = [];
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (P.x > 0 && P.y > 0 && P.y < area.length - 1) {
                        // if (i === 0 && j === 0) {
                        try {
                            if (area[P.y + i][P.x + j] === 0) {
                                NP.push({y: P.y + i, x: P.x + j});
                            }
                        } catch (error) {
                            console.error("problem at: " + (P.y + i) + ", " + (P.x + j));
                        }
                        //  }
                    }
                }
            }

            return NP;
        };

        var fce = function (PL, PR) {
            var newPL = [], newPR = [];
            for (var j = 0; j < PL.length; j++) {
                var np = findNB(PL[j]);
                if (np) {
                    for (var k = 0; k < np.length; k++) {
                        newPL.push(np[k]);
                        area[np[k].y][np[k].x] = "L";
                    }
                }
            }

            for (var j = 0; j < PR.length; j++) {
                var np = findNB(PR[j]);
                if (np) {
                    for (var k = 0; k < np.length; k++) {
                        newPR.push(np[k]);
                        area[np[k].y][np[k].x] = "R";
                    }
                }
            }

            if (newPL.length === 0 || newPR.length === 0) {
                return (newPL.length === 0) ? "R" : "L";
            } else {
                return fce(newPL, newPR);
            }
        };

    //this.consoleArea(area);

        /**/
        var w = fce(PL, PR);
        var m = (w === "R") ? "L" : "R";

        /* DETECT COLLISION WITH FLIES*/
        var df = false;
        ffor:
                for (var y = 0; y < area.length; y++) {
            for (var x = 0; x < area[y].length; x++) {
                if (area[y][x] === m) {
                    for (var f in flies) {
                        var xy = flies[f].getXY();
                        if (xy.x / this.grid === x && xy.y / this.grid === y) {
                            df = true;
                            console.log("DETECT FLY IN UNCOVERED PLACE");
                            break ffor;
                        }
                    }
                }

            }
        }

        /* DETECT COLLISION WITH BONUS */
        //console.log("TEST BONUS COLLISION")
        for (var y = 0; y < area.length; y++) {
            for (var x = 0; x < area[y].length; x++) {
                if (area[y][x] === m) {
                    for (var b in bonus) {
                      //  console.log(bonus[b].x + " / " + x + ", " + bonus[b].y + ' / ' + y)
                        if (bonus[b].x === x && bonus[b].y === y) {
                            console.log("DETECT BONUS COLLISON");
                            bonus[b].action();
                        }
                    }
                }
            }
        }


        /**/
        for (var y = 0; y < area.length; y++) {
            for (var x = 0; x < area[y].length; x++) {
                if (area[y][x] === w) {
                    area[y][x] = 0;
                }

                if (area[y][x] === "L" || area[y][x] === "R") {
                    if (!df) {
                        area[y][x] = 1;
                    } else {
                        area[y][x] = 0;
                    }
                }
            }
        }
        /**/

       //  this.consoleArea(area);
        this.uncovered = this.drawLess(area);
        return this.uncovered;


    },
    //
    consoleArea: function (area) {
        var s = "";
        var d = Math.min(area.length, 500);
        for (var i = 0; i < d; i++) {
            for (var j = 0; j < area[i].length; j++) {
                s = s + area[i][j] + "";
            }
            s = s + "\n";
        }
        console.log(s);
    },
    //
    drawLess: function (area) {
        var bgr = "";

        for (var y = 0; y < area.length; y++) {
            for (var x = 0; x < area[y].length; x++) {
                var h = 0, w = 0;
                if (area[y][x] === 0) {
                    // console.log("find 0 at y: " + y + ", x:" + x);
                    while (area[y + h] && area[y + h][x] === 0) {
                        h++;
                        // console.log(h);
                    }

                    var i = 0;
                    // console.log("h = " + h);

                    while (area[y + i] && typeof area[y + i][x + w] !== 'undefined') {
                        i++;
                        if (i === h) {
                            i = 0;
                            w++;
                            // console.log("end on " + i);
                            // break;
                        }

                        if (area[y + i][x + w] === 1) {
                            // console.log("second end on " + i);
                            break
                        }
                    }

                    //  console.log("w = " + w);
                    // break;
                    // draw box W, H, X, Y
                    var py = y * this.grid;
                    var px =  x * this.grid;
                    bgr += "<div style='left:" + px + "px;top:" + py  + "px;width:" + w * this.grid + "px;height:" + h * this.grid + "px;background-position:" + -px%40 + "px " + -py%40 + "px'/>";
                    /**/
                    for (var i = 0; i < h; i++) {
                        for (var j = 0; j < w; j++) {
                            area[y + i][x + j] = "A";
                        }
                    }/**/
                }
            }
        }

        // console.log("clear");
        var covered = 0;
        for (var y = 0; y < area.length; y++) {
            for (var x = 0; x < area[y].length; x++) {
                if (area[y][x] === "A") {
                    area[y][x] = 0;
                    covered++;
                }
            }
        }

        $("#background").empty().append(bgr);/**/

        return covered * this.grid * this.grid;

    },
   //
    drawSimple: function (area) {

        /* REDUCE RECT*/

        /* DRWA RECT */
        var bgr = "";
        for (var i = 0; i < area.length; i++) {

            for (var j = 0; j < area[i].length; j++) {
                if (area[i][j] !== 0) {
                    bgr += "<div style='left:" + j * this.grid + "px;top:" + i * this.grid + "px;width:" + this.grid + "px;height:" + this.grid + "px'/>";
                }
            }
        }

        // var $rect = $("<div>").css({left: x, top: y, "width": w, "height": h});
        $("#background").empty().append(bgr);/**/
    },
    //
    drawOne: function (x,y, size){
        var bgr = "<div style='left:" + x  + "px;top:" + y  + "px;width:" + size * this.grid + "px;height:" + size * this.grid + "px'/>";
        $("#background").append(bgr);/**/
    },
    //
    setCanvas: function (canvas) {
        this.canvas = canvas;
    },
    //
    setSize: function (size) {
        this.size = size;
    },
    //
    clear: function () {
        $("#background").empty().append('<div style="width:100%;height:100%;left:0;top:0"></div>');/**/

    }
};