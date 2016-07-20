;(function() 
{
	var Game = function(canvasId)
	{
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');
		var gameSize = {x: canvas.width, y: canvas.height};
		var self = this;

		// main game loop
		var tick = function()
		{
			self.update();
			self.draw(screen, gameSize);
/* Tells the browser that you wish to perform an animation and requests 
 * that the browser call a specified function to update an animation before the next repaint. 
 * The method takes as an argument a callback to be invoked before the repaint.
*/			
			requestAnimationFrame(tick); 
		}

		tick();
	}

	Game.prototype = 
	{
		// var & obj update
		update: function()
		{
			console.log("update");
		},
		// canvas rendering
		draw: function(screen, gameSize)
		{
			screen.fillRect(150,150,32,32);
		}
	}

	window.onload = function()
	{
		new Game("screen");
	}
})();