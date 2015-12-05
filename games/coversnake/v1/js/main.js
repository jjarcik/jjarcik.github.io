/**
    The game is controlled by keyboard (key up, down, left, right, space) and
    by touch gestures. I used this plugins for build the game:
    jCanvas (libs/plugins/jcanvas.js)
    jQuery (libs/jquery/jquery.js)
    Hammer.JS (libs/plugins/plugins.js)

    You can find all other classes in /libs/class/
    The MIT License 

    author: Jan Jarčík
    https://github.com/jjarcik/
    jarcik.jan@gmail.com
    created: 5.10.2014
*/

var play = new Game();

$(function () {  

    play.init();
    play.start();
    
});