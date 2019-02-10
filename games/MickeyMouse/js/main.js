$(function () {
    var $mickey = $("#mickey");
    var $mickeyscale = $("#mickeyscale");
    var mickeyss = [0, 1, 2, 1];
    var mickeys = 0;
    var maxangle = 70;
    var maxmovex = 200;
    var maxcloudscale = 10;
    var maxscaleinc = 0.01;
    var cloudsscaleinterval = 15000;
    var clouds = [];



    //$mickey.css("scale", .5);

    /*
     clouds.push($("div", "#clouds").eq(1));
     clouds.push($("div", "#clouds").eq(2));
     clouds.push($("div", "#clouds").eq(3));
     clouds.push($("div", "#clouds").eq(4));    */


    $(window).resize();
    setInterval(function () {
        $mickey.removeClass();
        var s = mickeyss[(mickeys++) % 4];
       $mickey.addClass("s" + s);
    }, 200);
    
    var makeCloud = function () {
        
        var max = $(window).width();
        var $d = $("<div>");
        $d.appendTo("#clouds");
        var mt = -max / 2 + (Math.round(Math.random()) * 2 - 1) * Math.random()*$(window).height() / 2;
        var ml = -max / 2 + (Math.round(Math.random()) * 2 - 1) * Math.random()*$(window).width() / 2;
        var mx = Math.random()*$(window).width() / 2;
        var my = Math.random()*$(window).height() / 2;
        //$d.css({"margin-left":-ml/2, "margin-top":-mt/2});
        $d.animate({
            width: 2*max,
            height: 2*max,
            "margin-left": ml ,
            "margin-top": mt,
            "opacity": 1},
        10000, "linear", function () {
            $(this).fadeOut(1500, function(){
                $(this).remove();
            });
        });

    };

    setInterval(makeCloud, 5000);



    /*
     $.each(clouds, function () {
     //$(this).css("translate","-=1px");                
     //, "translate":"-=1"
     //$(this).transition({translate:-100, queue:false}, cloudsscaleinterval, 'linear');                
     
     $(this).delay($(this).data("delay")).animate({
     width: $(this).data("scale"), 
     height: $(this).data("scale"), 
     "margin-left": -$(this).data("scale") / 2  + $(this).data("mx") ,
     "margin-top": -$(this).data("scale") / 2  + $(this).data("my"), 
     "opacity":  $(this).data("opacity")}, $(this).data("speed"), "linear", function () {
     $(this).fadeOut(400);
     });
     
     // $(this).transition({scale:maxcloudscale,opacity:0,x:$(this).data("x"),queue:false}, $(this).data("speed"), 'linear', function(){
     // $(this).remove();
     // });
     
     //$(this).transition({scale: maxcloudscale, queue:false}, cloudsscaleinterval*5, 'linear');
     // $(this).fadeOut(5200);
     //$(this).css("scale",scale);
     });
     /**/


    var mickyPosition = function (x) {
        var wwh = $(window).width() / 2;
        var mx = x - wwh;
        var angle = maxangle * mx / wwh;
        $mickey.css("rotate", -angle);
        $mickeyscale.css("margin-left", maxmovex * mx / wwh);
    };

    $(document).on("mousemove", function (e) {
        mickyPosition(e.clientX);
    });
    
    $(document).on("touchstart touchmove", function (e) {
        mickyPosition(e.originalEvent.touches[0].pageX);
    });

});
