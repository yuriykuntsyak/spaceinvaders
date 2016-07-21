;(function() 
{
	var Game = function(canvasId)
	{
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');
		var gameSize = {x: canvas.width, y: canvas.height};

		this.bodies = createInvaders(this).concat([new Player(this, gameSize)]);

		var self = this;

		// main game loop
		var tick = function()
		{
			self.update(gameSize);
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
		update: function(gameSize)
		{
			var bodies = this.bodies;

			var notCollidingWithAnything = function(b1)
			{
				return bodies.filter
				(
					function(b2)
					{
						return colliding(b1, b2);
					}
				).length == 0;
			}

			this.bodies = this.bodies.filter(notCollidingWithAnything);

			console.log(this.bodies.length);
			for(var i = 0; i< this.bodies.length; i++)
			{
				if(this.bodies[i].position.y < 0 || this.bodies[i].position.y > gameSize.y)
					this.bodies.splice(i, 1);
				else
					this.bodies[i].update();
			}
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

	var Invader = function(game, position)
	{
		this.game = game;
		this.size = {width:32, height:32};
		this.position = position;
		this.patrolX = 0;
		this.speedX = 3.5;
	}

	Invader.prototype =
	{
		update: function()
		{
			if(this.patrolX < 0 || this.patrolX > 800 - 8*35)
				this.speedX *= -1; // Invert horizontal direction
			this.position.x += this.speedX; 
			this.patrolX += this.speedX;

			if(Math.random() < 0.01)
			{
				var bullet = new Bullet(
				{x:this.position.x+this.size.width/2-3/2, y:this.position.y+7},
				{x:Math.random()-0.5, y:1.5},
				"INVADER");
				this.game.addBody(bullet);
			}
				
		}
	}

	var Player = function(game, gameSize)
	{
		this.game = game;
		this.size = {width:40, height:32};
		this.position = {x: gameSize.x/2-this.size.width/2, y:gameSize.y/2-this.size.height/2};
		this.keyboarder = new Keyboarder();
		this.bullets = 0;
		this.timer = 0;
	}

	Player.prototype =
	{
		update: function()
		{
			// Move left
			if(this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && this.position.x >= 4)
				this.position.x -= 4;
			// Move right
			if(this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && this.position.x <= 800-4-this.size.width)
				this.position.x += 4;
			// Shoot
			if(this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) && this.bullets < 1)
			{
				var bullet = new Bullet(
					{x:this.position.x+this.size.width/2-3/2, y:this.position.y-7},
					{x:0, y:-3},
					"PLAYER");
				this.game.addBody(bullet);
				this.bullets++;
			}

			this.timer++;
			if(this.timer % 12 == 0)
				this.bullets = 0;
		}
	}

	var Bullet = function(position, velocity, origin)
	{
		this.size = {width:2, height:6};
		this.position = position;
		this.velocity = velocity;
		this.origin = origin;
	}

	Bullet.prototype =
	{
		update: function()
		{
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
		}
	}

	var createInvaders = function(game)
	{
		var invaders = [];
		for(var i = 0; i < 24; i++)
		{
			var x = (i % 8) * 35;
			var y = (i % 3) * 35;
			invaders.push(new Invader(game, {x:x, y:y}));
		}

		return invaders;
	}

	var colliding = function(b1, b2)
	{
		if(
			b1 instanceof Bullet &&
			(
				(b1.origin == "INVADER" && b2 instanceof Invader) ||
				(b1.origin == "PLAYER" && b2 instanceof Player)
			)
		)
			return false;

		else if 
		(
			b2 instanceof Bullet &&
			(
				(b2.origin == "INVADER" && b1 instanceof Invader) ||
				(b2.origin == "PLAYER" && b1 instanceof Player)
			)
		)
				return false;

		return  !
		(
			b1 == b2 ||
			b1.position.x + b1.size.width < b2.position.x  || // L R
			b1.position.x > b2.position.x + b2.size.width  || // R L
			b1.position.y + b1.size.height < b2.position.y || // T B
			b1.position.y > b2.position.y + b2.size.height    // B T
		);
	}

	var loadSound = function(url, callback)
	{
		var loaded = function()
		{
			callback(sound);
			sound.addEventListener("canplaythrough", loaded);
		}

		var sound = new Audio(url);
		sound.addEventListener("canplaythrough", loaded);
		sound.load();
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
		
		if(body instanceof Player)
		{
			var image = document.getElementById("player-img"); // 112x70
			screen.drawImage(image, body.position.x, body.position.y, 40, 32);

		}
		else if(body instanceof Invader)
		{
			var image = document.getElementById("invader1-img"); // 512x512
			screen.drawImage(image, body.position.x, body.position.y, 32, 32);
		}
		else
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