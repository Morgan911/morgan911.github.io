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

var ship = {
	x:CANVAS_WIDTH/2,
	y:CANVAS_HEIGHT/2,
	angle:0,
	width:CANVAS_WIDTH/5,
	height:CANVAS_HEIGHT/5,
	speed:0,
	maxSpeed:6,
	acceleration:2,
	friction:1/4,
	rotateSpeed:5,
	image:'./ship.png',
	draw:function(){
		var image = new Image();
		image.src = this.image;
    	var ctx = CANVAS.getContext('2d')
    	ctx.save();
    	ctx.translate(this.x, this.y);
    	ctx.rotate(Math.PI/180*this.angle);
    	ctx.drawImage(image, -this.width/2, -this.height/2, this.width, this.height);
    	ctx.fillStyle = '#00FF00';
    	ctx.fillRect(0, 0, 1,1);
    	ctx.restore();
	},
	accelerate: function(){
		this.speed += this.acceleration;
		this.speed = this.speed > this.maxSpeed ? this.maxSpeed : this.speed;
	},
	brake: function(){
		this.speed -= this.acceleration;
		this.speed = this.speed < 0 ? 0: this.speed;
	},
	rotateRight: function(){
		if (this.speed > 0)
			this.angle+=this.rotateSpeed;
	},
	rotateLeft: function(){
		if (this.speed > 0)
			this.angle-=this.rotateSpeed;
	},
	update: function(){
		this.speed -= this.friction;
		if (this.speed < 0)
			this.speed = 0;
		this.x += Math.cos(Math.PI/180*this.angle)*this.speed;
		this.y += Math.sin(Math.PI/180*this.angle)*this.speed;
	}
}


createCanvas();
frame();
window.addEventListener('keydown', function(e){Key.keyDown(e);} ,false);
window.addEventListener('keyup', function(e){Key.keyUp(e);} ,false);

//TODO: dont turn if speed is 0
//TODO: create asteroids.
//TODO: create collision detection.
//TODO: Implement camera.