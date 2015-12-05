var s = [5, 5];
var floor = 6;
var imgsize = [800, 1280];
var q = 100;
var $game = $("#game");

$(function () {
    
    for (var y = 0; y < s[1]; y++) {
        for (var x = 0; x < s[0]; x++) {
            $game.append(createItem(x, y, s[0], s[1]));
        }
    }

    $("div", $game).on("click", function () {
        var $ov = $(this);
        $ov.transition({scale: 0.9}, q, function () {
            var s = $ov.find(".s");
            var i = s.index();
            i = (i + 1) % floor;            
            
            $ov.transition({rotateY: '90'}, q,  function () {
                s.removeClass("s");
                console.log($ov.find(".floorimg").eq(i));
                $ov.find(".floorimg").eq(i).addClass("s").attr("data-i", i);
                $ov.transition({rotateY: '0'}, q, function () {
                    $ov.transition({scale: 1}, q, function () {
                        checkArea();
                    });
                });

            });

        });
    });

    mix();

    $(window).resize(function () {
        var ww = $(window).width();
        var wh = $(window).height();
        var ri = imgsize[1] / imgsize[0];
        var iw = ww;
        var ih = iw / ri;
        var ml = 0;
        var mt = 0;

        if (ih < wh) {
            ih = wh;
            iw = ih * ri;
        }

        if (ww < iw) {
            var d = iw - ww;
            ml = -d / 2;
        }

        if (wh < ih) {
            var d = ih - wh;
            mt = -d / 2;
        }

        $(".floorimg").each(function () {
            $(this).height(ih).width(iw).css("margin-left", ml).css("margin-top", mt);
            var parent = $(this).parent();
            var pw = parent.width();
            var ph = parent.height();
            $(this).css("left", -parent.data("x") * pw).css("top", -parent.data("y") * ph);
        });

    });

    $(window).resize();

});

function createImg(src) {
    return $("<img src='" + src + "' alt='' class='floorimg'/>");
}

function createItem(x, y, wx, wy) {
    var imgs = [createImg("img/img10.jpg"), createImg("img/img11.jpg"), createImg("img/img12.jpg"), createImg("img/img13.jpg"), createImg("img/img14.jpg"), createImg("img/img15.jpg")];
    var $item;
    $item = $("<div>");
      $item.attr("data-y", y);
    $item.attr("data-x", x);
    $item.width(100 / wx + "%");
    $item.height(100 / wy + "%");

    for (var f = 0; f < floor; f++) {
        var img = imgs[f];
        if (f === 0) {
            //img.addClass("s");
        }
        $item.append(img);
    }

    return $item;

}

function mix() {
    for (var mix = 0; mix < 1; mix++) {
        for (var r = 0; r < s[0] * s[1]; r++) {
            var se = Math.floor(Math.random() * floor);
            //$("div", $game).eq(r).find(".floorimg:eq(" + se + ")").addClass("s");
            for (var i = 0; i < se; i++) {
                setTimeout((function (r) {
                    return function () {
                        $("div", $game).eq(r).click();
                    }
                })(r), (i * 400) + mix * floor * 400);

            }

        }
    }

    setTimeout(function(){
        $("#darker").fadeOut(400, function(){
            $(this).remove();
        });
    }, floor * 400);
}

function checkArea() {
    for (var i = 0; i < floor; i++) {
        var t = $(".floorimg.s[data-i=" + i + "]").length;
        if (t === s[0] * s[1]) {            
            mix();
            alert ("GOOD!");
        }
    }

}