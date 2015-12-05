var Game = function () {
// set default options
    this.options = {
        COUNT_OF_FLIES: 2,
        FPS: 60,
        GRID: 5
    };
    // set Canvas
    this.canvas = new Canvas("#maincanvas");
    // instance of Cursor
    this.cursor = new Cursor(this.canvas.getCanvas(), this.options.GRID);
    // [un]covered background
    this.background = new Background();
    // array of flies
    this.flies = [];
    // area of game,
    this.area = new Area();
    // state of the game
    this.states = {
        isplaying: false,
        gameinterval: 0,
        uncovered: 0,
        newgameinterval: 0,
        gameinprogress: false
    };
};
Game.prototype = {
    // initialize the app
    init: function () {

        var th = this;
        $(document).keydown(function (e) {
            switch (e.which) {
                case 37: // left    
                    th.cursor.changeCurDir("L");
                    break;
                case 38: // up
                    th.cursor.changeCurDir("U");
                    break;
                case 39: // right
                    th.cursor.changeCurDir("R");
                    break;
                case 40: // down
                    th.cursor.changeCurDir("D");
                    break;
                case 32:
                    th.states.isplaying = !th.states.isplaying;
                    //th.background.consoleArea(th.area.mask);
                    break;
                default:
                    return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });

        var hammertime = new Hammer(document.getElementById('border'));
        hammertime.get('pan').set({direction: Hammer.DIRECTION_ALL});
        hammertime.on('panup', function (ev) {
            th.cursor.changeCurDir("U");
        });
        hammertime.on('pandown', function (ev) {
            th.cursor.changeCurDir("D");
        });
        hammertime.on('panleft', function (ev) {
            th.cursor.changeCurDir("L");
        });
        hammertime.on('panright', function (ev) {
            th.cursor.changeCurDir("R");
        });

        $("#menub").on("click", function () {
            $("#menudesk").hide().fadeIn(200);
            th.states.isplaying = false;
            $("#bonus").removeClass("ok");
            $("#gameover").hide();
        });

        $("#menudesk").on("click", function () {
            $("#bonus").addClass("ok");
            $("#menudesk").fadeOut(200, function () {
                $(this).hide();
            });
            th.states.isplaying = true;
            th.states.gameinprogress = true;
            th.cursor.highLight();
        });

        $("#gameover").on("click", function () {
            th.start();
            $("#gameover").fadeOut(200, function () {
                $(this).hide();
                th.states.isplaying = true;
                th.cursor.highLight();
            });
        });

        $(window).on("resize", function () {
            var hh = $("#header").height();
            var w = window.innerWidth - window.innerWidth % th.options.GRID;
            var h = window.innerHeight - window.innerHeight % th.options.GRID - hh;
            th.canvas.setSize(w, h);
            $("#surface").width(w).height(window.innerHeight - hh);
            $("#border").height(h - 5);
            if (th.states.gameinprogress) {
                $("#newgame").show();
                //th.states.isplaying = false;
                clearTimeout(th.states.newgameinterval);
                th.states.newgameinterval = setTimeout(function () {
                    //   th.states.isplaying = true;
                    $("#newgame").fadeOut();
                    th.clearGame();
                    th.start();
                }, 1000);

            }
        });

        $(window).resize();
    },
    start: function () {

        this.canvas.addCanvasObject("cursor", this.cursor);

        for (var i = 0; i < this.options.COUNT_OF_FLIES; i++) {
            var fly = new Fly(this.canvas.getCanvas(), this.options.GRID, this.canvas.size, i);
            this.flies.push(fly);
            this.canvas.addCanvasObject("fly" + i, fly);
        }/**/



        function fooBar(bonus, th) {
            return function () {
                var $b = $("#" + bonus.id).hide();
                if ($b.hasClass("speedup")) {
                    $.each(th.flies, function (i, f) {
                        //f.beHard();
                        f.beQuick();
                        bonus.highLight();
                    });
                }

                /*
                 if ($b.hasClass("apple")) {
                 $.each(th.flies, function (i, f) {
                 //f.beNormal();                        
                 });
                 }/**/

                if ($b.hasClass("skull")) {
                    console.log("stop game by skull");
                    bonus.highLight();
                    th.stopGame();
                }

            };
        }

        // add bonus        
        for (var i = 0; i < 5; i++) {
            var bonus = new Bonus(this.canvas.size, this.options.GRID, "bonus" + i, Math.floor(i / 3));
            bonus.draw();
            this.area.addBonus(bonus, fooBar(bonus, this));
        }

        this.area.setGrid(this.options.GRID);
        this.area.setSize(this.canvas.size);
        this.area.createMask();
        this.background.setCanvas(this.canvas.getCanvas());
        this.background.setSize(this.canvas.size);
        this.canvas.drawAll();
        // set interval by FPS
        this.states.gameinterval = setInterval(this.step.bind(this), 1000 / this.options.FPS);
    },
    //
    step: function () {
        if (this.states.isplaying) {

            var th = this;

            $.each(this.flies, function (i, f) {
                f.speedcounter = (f.speedcounter + 1) % f.speed;
                if (f.speedcounter === 0) {
                    f.move();
                    f.special(th.area, th.background);
                }

            });
            /**/
            this.cursor.speedcounter = (this.cursor.speedcounter + 1) % this.cursor.speed;            
            if (this.cursor.speedcounter === 0) {
                this.cursor.move();
                if (this.cursor.detectBorderCollision()) {
                    console.log("detect border collision");
                    this.cursor.closePath();
                    this.area.safePoints();
                    this.states.uncovered = this.background.uncover(this.cursor.lastpath, this.area.mask, this.flies, this.area.bonus);
                    this.cursor.isonline = true;
                    this.score();
                } else {
                    if (this.cursor.isMoving) {
                        clearInterval(this.states.curhighlighting);
                        this.states.curhighlighting = null;
                        this.cursor.drawPath();
                        var dc = this.detectCursorCollision();
                        if (dc) {
                            if (dc === 2) {
                                console.log("stop game by cursor collision");
                                this.stopGame();
                            } else {
                                // DETECT CURSOR COLLISION
                                if (!this.cursor.isonline) {
                                    this.cursor.closePath();
                                    this.area.safePoints();
                                    this.states.uncovered = this.background.uncover(this.cursor.lastpath, this.area.mask, this.flies, this.area.bonus);
                                    this.cursor.isMoving = true;
                                    this.cursor.isonline = true;
                                    this.score();
                                }
                            }
                        } else {
                            if (this.cursor.isonline) {
                                this.cursor.savePathPoint();
                                // GET OUT
                            }
                            this.cursor.isonline = false;
                        }
                    } else {
                        if (!this.states.curhighlighting) {                            
                            this.states.curhighlighting = setInterval(function(){
                                th.cursor.highLight();
                            },2500);
                            
                        }
                    }
                    this.area.setPoint({x: this.cursor.x, y: this.cursor.y}, 2);
                }
            }

            
            this.canvas.redrawAll();
            if (this.detectFlYCollision()) {
                console.log("stop game by fly collision");
                this.stopGame();
                //th.states.isplaying = false;
            }

        }

    },
    detectFlYCollision: function () {
        var th = this;
        var r = false;
        // detect fly on actual path   
        $.each(this.flies, function (i, f) {
            if (f.detectInAreaCollision(th.area)) {
                //th.background.consoleArea(th.area.mask)
                f.heighLight();
                r = true;
            }
        });
        return r;
    },
    // detect collision of cursor with itself
    detectCursorCollision: function () {
        if (!this.cursor.isMoving) {
            return false;
        }
        var fp = this.cursor.getXY();
        var r = this.area.getPoint({x: fp.x, y: fp.y});
        return r;
    },
    //
    stopGame: function () {
        // this.states.isplaying = false;
        this.cursor.clearPath();

        // TODO do it in class Cursor        
        var newX = (this.cursor.x > this.canvas.size[0] / 2) ? (this.canvas.size[0]) : 0;
        var newY = (this.cursor.y > this.canvas.size[1] / 2) ? (this.canvas.size[1]) : 0;
        if (Math.abs(this.cursor.x - newX) < Math.abs(this.cursor.y - newY)) {
            this.cursor.setX(newX);
        } else {
            this.cursor.setY(newY);
        }


        this.area.clearPath();
        var th = this;

        $("span", "#lives").last().remove();
        if ($("span", "#lives").length === 0) {
            $("#kill").show().hide().fadeIn(100, function () {
                $(this).fadeOut(400, function () {
                    $(this).hide();
                    $("#gameover").fadeIn(200, function () {
                        th.clearGame();
                        th.states.isplaying = false;
                    });
                });
            });
        } else {
            this.cursor.highLight();
        }
    },
    // 
    clearGame: function () {
        console.log("clear");
        this.background.clear();
        this.canvas.clear();
        this.area = new Area();
        this.flies = [];
        this.states.uncovered = 0;
        $("#score").text(0 + "%");
        $("#bonus").empty();
        this.cursor.clear();
        $("#lives").empty().append("<span /><span /><span />");
        clearInterval(this.states.gameinterval);
    },
    // change and count the score
    score: function () {
        var surf = (this.area.mask.length) * (this.area.mask[0].length) * this.options.GRID * this.options.GRID;
        // console.log(this.states.uncovered);
        // console.log(surf);
        var score = Math.floor(((surf - this.states.uncovered) / surf) * 100);
        $("#score").text(score + "%");
        if (score > 90) {
            //console.log("GRATULATUION")
            this.clearGame();
        }
    }

};