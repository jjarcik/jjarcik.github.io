var balls = [];
var it = 0;
var forcex = 0;
var forcey = 100;
var audio = true;
var $score = $("#score");
var inited = false;
var ismobiledevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var isAndroid = /Android/i.test(navigator.userAgent);
var orientationx = 0;
var orientationy = 0;
var ballinterval = 2500;

function Ball() {
    var colors = ["ball1", "ball2"];
    this.id = new Date().getTime();
    this.$dom = $("<div data-box2d-shape='circle'>").addClass("ball").appendTo("body");
    this.$dom.addClass(colors[Math.floor(Math.random() * colors.length)]);
    this.$dom.attr("id", "b" + this.id);
    this.runed = true;
    this.$dom.box2d({'y-velocity': 5});
}

function init() {

    balls.push(new Ball());
    
    inited = true;

    $.Physics.setWorldGravity({"x-velocity": --forcex, "y-velocity": forcey});

    setInterval(function() {
        if (!isAndroid) {
            playSound({"wav": "audio/2.wav"});
        }
        balls.push(new Ball());
    }, ballinterval)

    // check score
    setInterval(function() {
        var score = 0;
        var l = $(".ball").each(function() {
            if ($(this).offset().top > $(window).height() - 100) {
                if (($(this).hasClass("ball1") && $(this).offset().left > $(window).width() / 2) || ($(this).hasClass("ball2") && $(this).offset().left < $(window).width() / 2)) {
                    score++;
                }

            }
        }).length / 2;

        $score.text(score + " / " + l);
    }, 100)

    $(".tower").box2d({'y-velocity': 0});
    playSound({"mp3": "audio/music.mp3"});

    $(document).mousemove(function(e) {
        forcex = (e.pageX / $(window).width() - .5) * 10;
        $.Physics.setWorldGravity({"x-velocity": forcex, "y-velocity": forcey})
    });

}

function keyEventer() {

    $("#pause").click(function() {
        forcey = -forcey;

        $("audio").remove();

        if (audio) {
            $(this).html("&#9658;");
            audio = false;
        } else {
            $(this).text("ll");
            audio = true;
            playSound({"mp3": "audio/music.mp3"});
        }

    })

    $(".darker,#manual").click(function() {
        $(".darker").add("#manual").fadeOut(500, function() {
            $(this).remove();
        })
        setTimeout(init, 500);
    });

    $('body').keydown(function(evt) {
        evt.preventDefault();
        if (inited) {
            switch (evt.which) {
                case 37:
                $.Physics.setWorldGravity({"x-velocity": --forcex, "y-velocity": forcey})
                break;
                case 39:
                $.Physics.setWorldGravity({"x-velocity": ++forcex, "y-velocity": forcey})
                break;
            }
        }

    });

    touch = function() {
        if (inited) {
            forcey = -forcey;
            $.Physics.setWorldGravity({"x-velocity": forcex, "y-velocity": forcey});
            playSound({"wav": "audio/a1.wav"});
        }
    };

    $('body').keyup(function(evt) {
        evt.preventDefault();
        if (evt.which === 32) {
            touch();
        }
    });

    $('body').bind("touchend", touch)
    $('body').bind("click", touch)

}

$(document).ready(function() {

    var watchID = null;
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        startWatch();
    }

    function startWatch() {
        var options = {frequency: 500};
        watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }

    function stopWatch() {
        if (watchID) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
        }
    }

    function onSuccess(acceleration) {
        //var element = document.getElementById('tower');
        forcex = -acceleration.x * 10;
        forcey = 90;
        //forcey = acceleration.y * 10;
        // element.innerHTML = acceleration.y;
        
        if (orientationx === 90){
            forcey = 90;// -forcex + orientationx;
            forcex = acceleration.y * 10;
            if (orientationy===-90){              
                forcex = forcex * -1; 
            }

        }
        
        
        $.Physics.setWorldGravity({"x-velocity": forcex, "y-velocity": forcey})

    }
    function onError() {
        alert('onError!');
    }

    $("<div>").appendTo("body").addClass("darker").animate({
        opacity: .9
    }, 500, function() {
        $("#manual").fadeIn();
    });


    keyEventer();
    doOnOrientationChange();
});



function doOnOrientationChange(){
    switch (window.orientation)
    {
        case -90:                  
        orientationx = 90;
        orientationy= -90;
        break
        case 90:                        
        orientationx = 90;
        orientationy= 90;
        break;
        default:                
        orientationx = 0;
        orientationy= 0;
        break;
    }
}

window.addEventListener('orientationchange', doOnOrientationChange);

playSound = function(options) {
    
    if (audio) {        
        var a = '<audio id ="audio" preload ="preload" autoplay="autoplay">';
        if (options.wav) {            
            a += '<source src="' + options.wav + '" type="audio/wav" />';
        }

        if (options.mp3) {            
            a += '<source src="' + options.mp3 + '" type="audio/mpeg" />';
        }
        a += '</audio>';

        $("body").prepend(a);
        
    }
};