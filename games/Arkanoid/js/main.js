var plane = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0],
    [0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0]
];

$e = {
    ball: $("#ball"),
    borders: $("#borders"),
    racket: $("#racket"),
    table: $("#table"),
    header: $("header"),
    testline: $("#testline"),
    testlinex: $("#testlinex")
};

c = {
    speed: 5,
    audio: false,
    spacemiddle: 30,
    mx_start: -1,
    my_start: -1,
    mxboost: 3,
    racket_w: 15
};

s = {
    paused: true,
    timer1: 0,
    score: 0,
    isAndroid: /Android/i.test(navigator.userAgent)
};

bricks = [];

var Brick = function(x, y, cor) {
    this.cor = cor;
    this.x = x;
    this.y = y;
    this.w = c.bricksize[0]; //typeof w !== 'undefined' ? w : c.bricksize[0];
    this.h = c.bricksize[1];//typeof h !== 'undefined' ? h : c.bricksize[1];
    this.e = $("<div>").addClass("border").appendTo($e.borders);
    this.active = true;
    this.style = 0;
};

Brick.prototype.draw = function() {
    this.e.width(c.bricksize[0]).height(c.bricksize[1]).css({left: this.cor.x * c.bricksize[0], top: this.cor.y * c.bricksize[1]});
    this.e.addClass("brick" + this.style);
};

Brick.prototype.contact = function(i) {
    if (this.style === 4) {
        // this.style--;
        // this.e.removeClass("brick2").addClass("brick1");

    } else {
        this.active = false;
        s.score++;
        this.e.hide();
        //this.e.remove();
    }
    if (this.style === 1) {
        playSound({"wav": "audio/b.wav"});
    } else {
        playSound({"wav": "audio/e.wav"});
    }
    if (s.score === bricks.length) {
        gameOver();
    }

};

var Ball = function() {
    this.size = $e.ball.width();
    this.x = $e.ball.offset().left;
    this.y = $e.ball.offset().top - $e.table.offset().top;
    this.mx = c.mx_start*c.mxboost;
    this.my = c.my_start*c.mxboost;
};

Ball.prototype.changeColor = function(color) {
    $e.ball.css("background-color", color);
};

Ball.prototype.move = function() {
    var ball = this;
    ball.x += ball.mx;
    ball.y += ball.my;
    // $("#log").text(ball.y);
    // $e.testline.css("top",ball.y+ 20 + ball.size / 2);
    //  $e.testlinex.css("left",ball.x  + ball.size / 2);
//console.log(ball.x);
    // detect collision
    var detect = 0;
    $(bricks).each(function(i, v) {
        if (this.active) {
            // Test right collision
            var test1 = (ball.x + ball.size) >= v.x && ball.x <= (v.x + v.w);
            var test2 = ball.x >= v.x && ball.x <= (v.x + v.w);
            if (test1 || test2) {
                // ball.y + ball.size >= v.y && ball.y <= v.y + v.h
                if ((ball.y + ball.size >= v.y && ball.y < v.y) || (ball.y < (v.y + v.h) && ball.y > v.y)) {
                    var dy, dx = 0;
                    if (ball.y > v.y) {
                        dy = Math.min(v.y + v.h - ball.y, ball.size);
                    }
                    if (ball.y < v.y) {
                        dy = ball.y + ball.size - v.y;
                    }

                    if (ball.x > v.x) {
                        dx = Math.min(v.x + v.w - ball.x, ball.size);
                    }
                    if (ball.x < v.x) {
                        dx = ball.x + ball.size - v.x;
                    }

                    if (dx >= dy) {
                        ball.my *= -1;
                        ball.y += ball.my;
                    }

                    if (dy >= dx) {
                        ball.mx *= -1;
                        ball.x += ball.mx;
                    }

                    //console.log(v.x);
                    /*
                     if (dx > 1 && dy > 1){
                     //clearInterval(s.timer1);
                     //v.e.addClass("out");
                     //lastv = v;
                     //console.log(dx + " | " + dy);
                     }*/

                    /*
                     var test3 = ball.x >= v.x && ball.x <= v.x + v.w;
                     if (!test3 && (v.x >= ball.x || ball.y - ball.size <= v.y + v.h)) {
                     ball.mx *= -1;
                     ball.x += ball.mx;                        
                     }
                     
                     if (test3) {
                     ball.my *= -1;
                     ball.y += ball.my;                        
                     }*/




                    detect++;
                    v.contact(i);
                    //return false;


                }
            }
        }
    });


    if (ball.y < 0) {
        ball.my = 1*c.mxboost;
        playSound({"wav": "audio/d.wav"});
    }

    if (ball.y > c.border[3]) {
        gameOver();

    }


    if (ball.x < 0) {
        ball.mx = 1*c.mxboost;
        playSound({"wav": "audio/d.wav"});
    }

    if (ball.x + ball.size > c.border[2]) {
        ball.mx = -1*c.mxboost;
        playSound({"wav": "audio/d.wav"});
    }

    //$e.ball.css({left: this.x, top: this.y});
    $e.ball.transform("translate(" + (this.x - $e.table.width()/2) + "px," + (this.y - $e.table.height() + 70) + "px)");
    
};

var Racket = function() {
    this.x = $e.racket.offset().left;
    this.y = $e.racket.offset().top - $e.table.offset().top;
    this.w = $e.racket.width();
    this.h = $e.racket.height();
    this.active = true;
};

Racket.prototype.contact = function() {
    playSound({"wav": "audio/d.wav"});
};

function start() {

    ball = new Ball();
    racket = new Racket();

    loadPlane();


    $(bricks).each(function(i, v) {
        this.draw();
    });

    bricks.push(racket);
    keyEventer();
}

function loadPlane() {

    for (var x in plane) {
        for (var y in plane[x]) {
            if (plane[x][y] !== 0) {
                var b = new Brick(y * c.bricksize[0], x * c.bricksize[1], {x: y, y: x});
                b.style = plane[x][y]
                bricks.push(b);
            }
        }
    }
}

function gameOver() {
    clearInterval(s.timer1);
    $(".live").first().remove();
    s.paused = true;
    $e.ball.css("visibility", "hidden");
    if (s.score === bricks.length) {
        alert("DONE! - PRESS F5 FOR NEW GAME");
    } else {
        if ($(".live").length === 0) {
            alert("GAME OVER - PRESS F5 FOR NEW GAME");
        }
    }
}

function keyEventer() {
    var moveRacket = function(e) {
        var movex = e.pageX;
        if (!e.pageX && e.originalEvent.touches) {
            movex = e.originalEvent.touches[0].pageX;
        }

        racket.x = Math.min(movex, c.border[2] - $e.racket.width());
        $e.racket.transform("translate(" + (racket.x) + "px,0px)");
        //$e.racket.css("left", racket.x);
        if (racket.x < ball.x && racket.x + racket.w > ball.x) {
            if (ball.y + ball.size > racket.y) {
                ball.y = racket.y - 2;
                ball.my = -1;
            }
        }

    };
    
    $("body").on("click touchstart", function(e) {
        $("h1").hide();
        if (s.paused) {
            var movex = e.clientX;
            if (!e.clientX) {
                movex = e.originalEvent.touches[0].pageX;
            }
            movex = Math.abs(movex);
            s.paused = false;
            ball.x = movex + $e.racket.width() / 2;
            ball.y = racket.y - ball.size - 5;
            ball.mx = c.mx_start*c.mxboost;
            ball.my = c.my_start*c.mxboost;

            racket.x;
            // $e.ball.css({left: ball.x, top: ball.y});
            $e.ball.transform("translate(" + ball.x + "px," + ball.y + "px)");
            $e.ball.css("visibility", "visible");
            playSound({"wav": "audio/d.wav"});            
            s.timer1 = setInterval((function(b) {
                return function() {
                    b.move();
                };
            })(ball), c.speed);
        }
    });


    $("body").bind("mousemove", moveRacket);
    $("body").bind("touchstart touchmove touchend", moveRacket);
}

$(document).ready(function() {
    $(window).resize();
    start();
});

$(window).resize(function() {
    $e.table.height($(window).height() - $e.header.height());
    c.border = [$e.table.offset().left, $e.table.offset().top, $e.table.width(), $e.table.height()];
    c.bricksize = [Math.floor(c.border[2] / plane[0].length), Math.floor((c.border[3] - $e.table.height() * c.spacemiddle / 100) / plane.length)];
    ball.size = Math.floor(c.bricksize[1] / 2);

    $e.racket.width(c.border[2] * c.racket_w / 100);
    $e.ball.width(ball.size).height(ball.size);
    racket.w = $e.racket.width();
    racket.y = $e.racket.offset().top - $e.table.offset().top;

    clearInterval(s.timer1);
    s.paused = true;
    $(bricks).each(function() {
        if (this.draw !== undefined) {
            this.x = this.cor.x * c.bricksize[0];
            this.y = this.cor.y * c.bricksize[1];
            this.w = c.bricksize[0];
            this.h = c.bricksize[1];
            this.draw();
        }

    });


});


$.fn.transform = function(data) {
    this.css({
        "transform": data,
        "-ms-transform": data,
        "-webkit-transform": data,
        "-moz-transform": data});
    return this;
};

playSound = function(options) {
    if (c.audio) {
        if (!s.isAndroid) {
            var a = '<audio id ="audio" preload ="preload" autoplay="autoplay">' +
                    '   <source src="' + options.wav + '" type="audio/wav" />' +
                    '   <source src="' + options.mp3 + '" type="audio/mpeg" />' +
                    '</audio>';

            //$("#audio_conteiner").empty();
            //$("#audio_conteiner").prepend(a);
            $("body").append(a);
        } else {
            
            var a = options.mp3 ? options.mp3 : "" + options.wav ? options.wav : "";
            myaudio = new Media('/android_asset/www/' + a);
            try {
                myaudio.id = 'playerMyAdio';
                myaudio.play();
            } catch (e) {
                alert('no audio support!');
                audio = false;
            }
        }
    }
};