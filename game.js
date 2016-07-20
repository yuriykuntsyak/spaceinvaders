;(function() 
{
	var Game = function(canvasId)
	{
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');
		var gameSize = {x: canvas.width, y: canvas.height};

		this.bodies = [new Player(this, gameSize)];

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
			for(var i = 0; i< this.bodies.length; i++)
				this.bodies[i].update();
		},
		// canvas rendering
		draw: function(screen, gameSize)
		{
			clearCanvas(screen, gameSize);

			for(var i = 0; i < this.bodies.length; i++)
				drawRect(screen, this.bodies[i]);
		},

		addBody: function(body)
		{
			this.bodies.push(body);
		}
	}

	var Player = function(game, gameSize)
	{
		this.game = game;
		this.size = {width:16, height:16};
		this.position = {x: gameSize.x/2-this.size.width/2, y:gameSize.y/2-this.size.height/2};
		this.keyboarder = new Keyboarder();
	}

	Player.prototype =
	{
		update: function()
		{
			// Move left
			if(this.keyboarder.isDown(this.keyboarder.KEYS.LEFT))
				this.position.x -= 2;
			// Move right
			if(this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT))
				this.position.x += 2;
			// Shoot
			if(this.keyboarder.isDown(this.keyboarder.KEYS.SPACE))
			{
				var bullet = new Bullet(
					{x:this.position.x+this.size.width/2-3/2, y:this.position.y},
					{x:0, y:-6});
				this.game.addBody(bullet);
			}
		}
	}

	var Bullet = function(position, velocity)
	{
		this.size = {width:3, height:3};
		this.position = position;
		this.velocity = velocity;
	}

	Bullet.prototype =
	{
		update: function()
		{
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
		}
	}

	var Keyboarder = function()
	{
		var keyState = {};

		window.onkeydown = function(e)
		{
			keyState[e.keyCode] = true;
		}
		window.onkeyup = function(e)
		{
			keyState[e.keyCode] = false;
		}

		this.isDown = function(keyCode)
		{
			return keyState[keyCode];
		}

		this.KEYS = {LEFT:37, RIGHT:39, SPACE:32};

	}

	var drawRect = function(screen, body)
	{
		screen.fillRect(body.position.x, body.position.y, body.size.width, body.size.height);
	}

	var clearCanvas = function(screen, gameSize)
	{
		screen.clearRect(0, 0, gameSize.x, gameSize.y);
	}

	window.onload = function()
	{
		new Game("screen");
	}
})();