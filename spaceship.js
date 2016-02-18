//Space shooter.

//First step: create canvas.

CANVAS_WIDTH = 800;
CANVAS_HEIGHT = 500;
CANVAS = null;

function createCanvas(){
	CANVAS = document.createElement('canvas');
	CANVAS.height = CANVAS_HEIGHT;
	CANVAS.width = CANVAS_WIDTH;
	document.getElementsByTagName('body')[0].appendChild(CANVAS);	
}

//Second step: create game loop.

function frame(){
	update();
	render();
	requestAnimationFrame(frame);
} 

//Third step: create game logic.

function update(){
	if (Key.isPressed(Key.LEFT)) {
		ship.rotateLeft();
	}
	if (Key.isPressed(Key.RIGHT)) {
		ship.rotateRight();
	}
	if (Key.isPressed(Key.UP)) {
		ship.accelerate();
	}
	if (Key.isPressed(Key.DOWN)) {
		ship.brake();
	}
	if (Key.isPressed(Key.SPACE)){
		ship.fire();
	}
	ship.update();
}

function render(){
	clearCanvas();
	drawBg();
	ship.draw();
}

function clearCanvas(){
	var ctx = CANVAS.getContext('2d');
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);	
}

function drawBg(){
    var ctx = CANVAS.getContext('2d')
    ctx.fillStyle = '#550000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

var Key = {
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
}

function Ship(){
	this.x=CANVAS_WIDTH/2;
	this.y=CANVAS_HEIGHT/2;
	this.angle=0;
	this.width=CANVAS_WIDTH/5;
	this.height=CANVAS_HEIGHT/5;
	this.speed=0;
	this.maxSpeed=6;
	this.acceleration=2;
	this.friction=1/20;
	this.rotateSpeed=3;
	this.image='./ship.png';
	this.fireParts = [new ShipFire(), new ShipFire()];
	this.parts=[];
	this.draw=function(){		
		var image = new Image();
		image.src = this.image;
    	var ctx = CANVAS.getContext('2d');
    	for (var i = 0; i < this.parts.length; i++) {
			this.parts[i].draw(ctx);
		}
    	ctx.save();
    	ctx.translate(this.x, this.y);
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
		console.log(bullet);
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
		for(var i = 0; i < this.fireParts.length; i++){
			this.fireParts[i].update();
		}
		for (var i = 0; i < this.parts.length; i++) {
			this.parts[i].update();
		}
	}
}
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
	this.draw = function(ctx){
		ctx.save();
    	ctx.translate(this.x, this.y);
    	ctx.rotate(Math.PI/180*this.angle);
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

createCanvas();
frame();
window.addEventListener('keydown', function(e){Key.keyDown(e);} ,false);
window.addEventListener('keyup', function(e){Key.keyUp(e);} ,false);

//TODO: create wearpon.
//TODO: create asteroids.
//TODO: create collision detection.
//TODO: Implement camera.