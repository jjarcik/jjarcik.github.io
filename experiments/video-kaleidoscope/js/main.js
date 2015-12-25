$(window).load(function () {

    // first pass of synchronization after loading video
    // after reload page, each video starts at the same time
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }

    // just stop and play on body click
    var s = 0;

    var $main = $("#main");

    $("body").on("click", function () {

        if (s === 0) {
            $("video").each(function () {
                $(this).get(0).play();
            });
            s = 1;
        } else {
            $("video").each(function () {
                $(this).get(0).pause();
            });
            s = 0;
        }

    });        
    
    // rotate of kaleidoscop by mouse move
    $("body").on("mousemove", function (e) {
        var r = Math.round(360 * e.clientX / $(window).width());        
        var o = 1 - e.clientY / $(window).height();        
        $main.css({
            "transform": "rotate(" + r + "deg)",
            "opacity": o,
        });
    });
    
    // fadeout loader and start
    $("#spinner").fadeOut(400, function(){
       setTimeout(function(){
           $("body").click();
       }, 1000) ;
    });

});
