//Space shooter.

var Game = {
	SPACE_WIDTH: 10000,
	SPACE_HEIGHT: 10000,
	CAMERA_WIDTH: 800,
	CAMERA_HEIGHT: 500,
	CANVAS: null,
	isRunning: false
};

Game.createCanvas = function(){
	this.CANVAS = document.createElement('canvas');
	this.CANVAS.height = this.CAMERA_HEIGHT;
	this.CANVAS.width = this.CAMERA_WIDTH;
	document.getElementsByTagName('body')[0].appendChild(this.CANVAS);
};

Game.start = function(){
	this.isRunning = true;
	this.frame();
};

Game.pause = function(){
	this.isRunning = false;
};

Game.frame = function(){
	if (this.isRunning) {
		this.update();
		this.draw();
		requestAnimationFrame(this.frame);
	}
};

Game.update = function(){
	if (Key.isPressed(Key.LEFT)) {
		this.SHIP.rotateLeft();
	}
	if (Key.isPressed(Key.RIGHT)) {
		this.SHIP.rotateRight();
	}
	if (Key.isPressed(Key.UP)) {
		this.SHIP.accelerate();
	}
	if (Key.isPressed(Key.DOWN)) {
		this.SHIP.brake();
	}
	if (Key.isPressed(Key.SPACE)){
		this.SHIP.fire();
	}
	this.SHIP.update();
	this.CAMERA.update();
};

Game.render = function(){
	var ctx = CANVAS.getContext('2d');
	this.clearCanvas(ctx);
    this.SPACE.draw(ctx, this.CAMERA.x, this.CAMERA.y);
	this.SHIP.draw(ctx, this.CAMERA.x, this.CAMERA.y);
};	

Game.clearCanvas = function(ctx){
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, CAMERA_WIDTH, this.CAMERA_HEIGHT);
};

Game.KEY = {
	LEFT: 37,
	UP: 38,
	RIGHT:39,
	DOWN: 40,
	SPACE: 32,
	pressed:{},
	isPressed: function(keyCode){
			return this.pressed[keyCode] != undefined;
	},
    keyDown: function(event){
    	this.pressed[event.keyCode] = new Date().getTime(); 
    },
    keyUp: function(event){
    	delete this.pressed[event.keyCode];
    }
};

(function(){
	function Ship() {
		this.x=CANVAS_WIDTH/2;
		this.y=CANVAS_HEIGHT/2;
		this.angle=0;
		this.width=200;
		this.height=100;
		this.speed=0;
		this.maxSpeed=20;
		this.acceleration=0.5;
		this.friction=1/20;
		this.rotateSpeed=4;
		this.image='./ship.png';
		this.fireParts = [new ShipFire(), new ShipFire()];
		this.parts=[];
		this.draw=function(ctx, x, y){		
			var image = new Image();
			image.src = this.image;
	    	for (var i = 0; i < this.parts.length; i++) {
				this.parts[i].draw(ctx, x, y);
			}
	    	ctx.save();
	    	ctx.translate(this.x - x, this.y - y);
	    	ctx.rotate(Math.PI/180*this.angle);
			this.fireParts[0].draw(ctx, -this.width/2+5, -this.height/2+10);
		 	this.fireParts[1].draw(ctx, -this.width/2+5, this.height/2-20);
			
	    	ctx.drawImage(image, -this.width/2, -this.height/2, this.width, this.height);
	    	ctx.fillStyle = '#00FF00';
	    	ctx.fillRect(0, 0, 1,1);
	    	ctx.restore();
	    	
		};
		this.accelerate= function(){
			this.speed += this.acceleration;
			this.speed = this.speed > this.maxSpeed ? this.maxSpeed : this.speed;
		};
		this.brake= function(){
			this.speed -= this.acceleration;
			this.speed = this.speed < 0 ? 0: this.speed;
		};
		this.fire = function(){
			var bullet = new Bullet(this);
			this.parts[this.parts.length] = bullet;
		};
		this.rotateRight= function(){
			this.angle+=this.rotateSpeed;
		};
		this.rotateLeft= function(){
			this.angle-=this.rotateSpeed;
		};
		this.update= function(){
			this.speed -= this.friction;
			if (this.speed < 0)
				this.speed = 0;
			this.x += Math.cos(Math.PI/180*this.angle)*this.speed;
			this.y += Math.sin(Math.PI/180*this.angle)*this.speed;
			
			if (this.x+this.width/2 > SPACE_WIDTH){
				this.x = SPACE_WIDTH - this.width/2;
			}
			if (this.x - this.width/2 < 0) {
				this.x = this.width/2
			}
			if (this.y > SPACE_HEIGHT - this.width/2) {
				this.y = SPACE_HEIGHT -this.width/2;
			}
			if (this.y < this.width/2 ) {
				this.y = this.width/2;
			}
			for(var i = 0; i < this.fireParts.length; i++){
				this.fireParts[i].update();
			}
			for (var i = 0; i < this.parts.length; i++) {
				this.parts[i].update();
			}
		};
	}

	Ship.prototype.draw = function(ctx){

	};
	Ship.prototype.update = function(){

	};
	Ship.prototype.accelerate  = function(){

	};
	Ship.prototype.brake = function(){

	};
	Ship.prototype.fire = function(){

	};
	Ship.prototype.rotateRight = function(){

	};
	Ship.prototype.rotateLeft = function(){

	};
	
	Game.SHIP = Ship;
})();


var ship = new Ship();

function ShipFire(){
	this.tickCount = 0;
	this.tickCount=0;
    this.frameIndex=[0,0];	
    this.ticksPerFrame=4;
    this.framesCount=[5,4];
    this.ship = ship;
    this.image='./fire.png';
    this.update = function(){
        if (this.tickCount++ > this.ticksPerFrame){	
    		if (++this.frameIndex[1] > this.framesCount[1] - 1) {
    			this.frameIndex[1] = 0;
    			if (++this.frameIndex[0] > this.framesCount[0] - 1) {
    				this.frameIndex[0] = 0;
    			}
    		}
    		this.tickCount = 0;
    	}
    };
    this.draw = function(ctx, x, y){
    	var image = new Image();
    	image.src = this.image;	
    		ctx.drawImage(
    			image,
    			this.frameIndex[0]*95,
    			this.frameIndex[1]*95,
    			95,95,
    			x, y,
    			10, 10   				
    		);	
    }
}

function Bullet(ship){
	this.speed = 10;
	this.image = new Image();
	this.image.src = './bullet.png';
	this.ship = ship;
	this.angle = ship.angle;
	this.x = ship.x;
	this.y = ship.y;
	this.update = function(){;
		this.x += Math.cos(Math.PI/180*this.angle)*this.speed;
		this.y += Math.sin(Math.PI/180*this.angle)*this.speed; 
	};
	this.draw = function(ctx, xView, yView){
		ctx.save();
    	ctx.translate(this.x - xView, this.y - yView);
    	ctx.rotate(Math.PI/180*ship.angle);
		ctx.drawImage(
			this.image,
			10,10, 20,20,
			-5,
			-5,
			10,10
		);
		ctx.restore();
	};
}

	function Space(width, height){
		this.width = width;
		this.height = height;
		this.texture = null;
	}

	Space.prototype.generate = function(){
		var context = document.createElement('canvas').getContext('2d');
		context.canvas.width = this.width;
		context.canvas.height = this.height;

		context.fillStyle = '#000000';
		context.fillRect(0, 0, this.width, this.height);
		
		var colors = ['#ffffff', '#ff00ff', '#00ffff', '#0000ff'];
		for (var i = 0; i < this.width; i+=Math.floor((Math.random()*9)+1)) {
			for (var j = 0; j < this.height; j += Math.floor((Math.random()*500)+35)) {
				context.fillStyle = colors[Math.floor(Math.random()*3)]
				context.beginPath();
				context.arc(i, j, Math.floor((Math.random()*2)+1), 0, 2 * Math.PI, false);
				context.fill();	
			}
		}
		this.texture = new Image();
		this.texture.src = context.canvas.toDataURL('image/png');	
		context = null;
	}

	Space.prototype.draw = function(context, x, y){
		context.drawImage(
			this.texture,
			x,
			y,
			context.canvas.width,
			context.canvas.height,
			0,
			0,
			context.canvas.width,
			context.canvas.height
		);
	}

	function Camera(x, y, canvasWidth, canvasHeight, spaceWidth, spaceHeight){
		this.x = x;
		this.y = y;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.spaceWidth = spaceWidth;
		this.spaceHeight = spaceHeight;
		this.followed = null;
	}

	Camera.prototype.follow = function(character){
		this.followed = character;
	};

	Camera.prototype.update = function(){
		if (this.followed == null)
			return;
		this.x = this.followed.x - this.canvasWidth/2;
		this.y = this.followed.y - this.canvasHeight/2;
		if (this.x + this.canvasWidth > this.spaceWidth) {
			this.x = this.spaceWidth - this.canvasWidth;
		}
		if (this.x < 0) {
			this.x = 0;
		}

		if (this.y > this.spaceHeight - this.canvasHeight) {
			this.y = this.spaceHeight - this.canvasHeight;
		}

		if (this.y < 0) {
			this.y = 0;
		}
	};
 
var space = new Space(SPACE_WIDTH, SPACE_HEIGHT);
space.generate();
var camera = new Camera(0,0,CANVAS_WIDTH, CANVAS_HEIGHT, SPACE_WIDTH,SPACE_HEIGHT);
camera.follow(ship);

createCanvas();
frame();
window.addEventListener('keydown', function(e){Key.keyDown(e);} ,false);
window.addEventListener('keyup', function(e){Key.keyUp(e);} ,false);

//Add global class Game
//Refactore ship, to be able to inherit it and make different typed of ships(e.g enemies)
//TODO: create enemies.
//TODO: create collision detection.
//TODO: fix ship blinking.
//TODO: finish wearpon.