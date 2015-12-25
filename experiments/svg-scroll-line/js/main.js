/*

author: Jan Jarcik
license: WTFPL (http://www.wtfpl.net/)
*/

// size of already rendered parts
var START = 150;

// length of path - fill same in css property stroke-dashoffset, stroke-dasharray
var END = 4000;

// path to svg file
var URL = 'svg/path.svg'


var path1 = "";

$(window).on("scroll", function () {
   
    var s  = $(window).scrollTop() + START;
 
    $(path1).css({"stroke-dashoffset":END - s});
});

$(window).ready(function () {

    $(function () {
        $('#svgparent').svg({loadURL: URL,onLoad: initAnimation});
    });

    var initAnimation = function (svgw) {
        svg = svgw;
        path1 = svg.getElementById("path1");
        $(path1).animate({"stroke-dashoffset":END - START}, 2000);        
    };

});