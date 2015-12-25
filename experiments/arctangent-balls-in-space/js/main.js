"use strict";

/** 

 	Running balls away from the current mouse position, build on Arctg2 
	license: WTFPL
	ECMAScript 6

	http://en.wikipedia.org/wiki/Atan2
	http://gamedev.stackexchange.com/questions/14602/what-are-atan-and-atan2-used-for-in-games

*/

// HTML container for rendering
var CONTAINER = "#container";

// count of balls
var COUNT_OF_BALLS = 200;

// determines the distance from mouse cursor, large number = large distance
var POWER = 900; 

// balls stack
var balls = [];

// mouse position
var cursor = {x: 0, y: 0}

class Ball {

	constructor() {

		// default random position
		this.offsetX = rdm(0, 500);
		this.offsetY = rdm(0, 1) * 40 + 100;
		
		// real position after recalculations
		this.x = 0;
		this.y = 0;
	}

	// recalculate ball position by mouse position 
	update(cursor){

		// distance from the ball ( the sign determines the orientation in space ) 
		var mousex = cursor.x - this.offsetX;
		var mousey = cursor.y -this.offsetY;

		// Math.atan2 (y, x) returns (-pi; pi>	
		var theta = Math.atan2( this.y - mousey, this.x - mousex);

		// Pythagorean theorem for count distance (c^2 = a^2 + b^2) powered by coefficient POWER
		var distance = POWER / ( Math.sqrt( Math.pow(mousex - this.x, 2) + Math.pow(mousey - this.y, 2)) );
		
		// set new positions of ball
		this.x = Math.round(this.x + Math.cos(theta) * distance - this.x * 0.15);
		this.y = Math.round(this.y + Math.sin(theta) * distance - this.y * 0.15); 
	}

	// set css position of ball
	render(){
		this.e.css({"top": this.offsetY + this.y, "left": this.offsetX + this.x});
	}

	// insert html element to DOM
	appendTo(container){
		this.e = $("<div class='ball'></div>").css("background-color", rdmColor());	
		$(container).append(this.e);
	}

}


$(window).ready(function () {
	
	// create balls
	for (var j = 0; j < COUNT_OF_BALLS; j++){
		balls[j] = new Ball();
		balls[j].appendTo(CONTAINER);
	}

	// set interval for update data and render balls
	setInterval(function(){
		for (var i in balls) {
			balls[i].update(cursor);
			balls[i].render();
		}
	}, 10)

	// save mouse position
 	$("body").on("mousemove", function(e){
 		cursor = {x: e.pageX, y: e.pageY};		
 	});
 	
 });


// simply get random number
function rdm(from, to){
	return Math.floor(Math.random() * (to - from + 1) + from);
}

// simply get random color
function rdmColor(){
	return "#" + Math.floor(Math.random() * 256).toString(16) + "0000";
	//return "#"+((1<<24)*Math.random()|0).toString(16)
}


