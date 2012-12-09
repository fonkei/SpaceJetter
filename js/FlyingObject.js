/******
* Fliegendes Objekt
*
*******/

FlyingObject = function(x, y, s, f, sp, w, h) {
	this.x = x;
	this.y = y;
	this.speed = s;
	this.frame = f;
	this.sprite = sp;
	this.width = w;
	this.height = h;
	this.defunct = false;
	
	this.setX = function(xPos) { this.x = xPos; };
	this.getX = function() { return this.x; };
	this.incX = function(inc) { this.x += inc; };
	this.decX = function(dec) { this.x -= dec; };
	
	this.setY = function(yPos) { this.y = yPos; };
	this.getY = function() { return this.y; };
	this.incY = function(inc) { this.y += inc; };
	this.decY = function(dec) { this.y -= dec; };
	
	this.setSpeed = function(s) { this.speed = s; };
	this.getSpeed = function() { return this.speed; };
	this.incSpeed = function(inc) { this.speed += inc; };
	this.decSpeed = function(dec) { this.speed -= dec; };
	
	this.setVertSpeed = function(s) { this.vertSpeed = s; };
	this.getVertSpeed = function() { return this.vertSpeed; };
	this.incVertSpeed = function(inc) { this.vertSpeed += inc; };
	this.decVertSpeed = function(dec) { this.vertSpeed -= dec; };
	
	this.setSprite = function(val) { this.sprite = val; };
	this.getSprite = function() { return this.sprite; };

	this.setFrame = function(f) { this.frame = f; };
	this.getFrame = function() { return this.frame; };
	
	this.setWidth = function(val) { this.width = val; };
	this.getWidth = function() { return this.width; };
	
	this.setHeight = function(val) { this.height = val; };
	this.getHeight = function() { return this.height; };
	
	this.setDefunct = function() { this.defunct = true; };
	
	this.init = function() {
		var sprite = this.getSprite();
		var frame = this.getFrame();
		this.setWidth(sprite.getWidth(frame));
		this.setHeight(sprite.getHeight(frame));
	};
}


/****
*  Wolke
*
****/
Cloud = function(sp) {	
	this.base = FlyingObject;
	
	this.type = "Cloud";
	
	var xPos = getRandom(-100, width + 100);
	var yPos = getRandom(-100, height);
	var speed = windSpeed;
	
	// Ermittle die Position des naechsten Objekts
	if(xPos >= 0)
		yPos = -100;
	else if(yPos >= 0)
		xPos = -100;
	
	var frame = getRandom(0,2);
	
	this.base(xPos, yPos, speed, frame, sp);
}

Cloud.prototype = new FlyingObject();
Cloud.prototype.constructor = Cloud;

Cloud.prototype = {
	fly: function() {
		this.incSpeed(windSpeed / 100);
		this.incX(this.getSpeed());
	}
}

/****
*  PowerUp
*
****/
PowerUp = function(xPos, yPos, speed, frame, sp) {
	this.base = FlyingObject;

	
	this.base(xPos, yPos, speed, frame, sp);

	this.type = "PowerUp";
}

PowerUp.prototype = new FlyingObject();
PowerUp.prototype.constructor = PowerUp;


/****
*  Tank
*
****/
Tank = function(sp) {
	this.base = PowerUp;
	
	var xPos = getRandom(0, width-40);
	var yPos = getRandom(-100 , -60);
		
	var frame = 0;
	var speed = 0;
	
	this.base(xPos, yPos, speed, frame, sp);
	this.init();
	
	this.type = "Tank";
}

Tank.prototype = new PowerUp();
Tank.prototype.constructor = Tank;

Tank.prototype = {
	
	
	fly: function() {
		
	}
}

/****
*  Gegner
*
****/
Enemy = function(s, sp) {
	this.base = FlyingObject;
	var yPos = getRandom(100, 200);
	var speed = s;
	var xPos;
	
	// Ermittle die Position des naechsten Objekts
	var side = getRandom(0, 1);
	xPos = getRandom(100, 200);
	
	this.base(xPos, yPos, speed, 6, sp);
	/*this.timer = 0;	
	this.path = 0;
	this.pathkey = 4;*/
	this.dir = side;
}

Enemy.prototype = new FlyingObject();
Enemy.prototype.constructor = Enemy;

/****
*  Enemy Bug 
*
****/
Bug = function(sp, paths) {
	this.base = Enemy;
	
	var speed = 0;

	this.base(speed, sp);
	this.init();
	
	
	this.degree = 0;
	
	this.type = "Bug";

	this.pathFinder = new PathManager(paths);
	this.newPath();	
}

Bug.prototype = new Enemy();
Bug.prototype.constructor = Bug;

Bug.prototype = {
	getDir: function() { return this.dir; },
	setDir: function(d) { this.dir = d; },
	
	getDegree: function() { return this.degree; },
	setDegree: function(d) { this.degree = ((d % 360) + 360) % 360; },
	
	incDegree: function(val) {
		this.degree = (((this.degree + val) % 360) + 360) % 360;
	},
	
	decDegree: function(val) {
		this.degree = (((this.degree - val) % 360) + 360) % 360;
	},
	
	newPath: function() {
		this.setX(this.pathFinder.getX());
		this.setY(this.pathFinder.getY());
	},
	
	fly: function() {	
		
		this.pathFinder.calculate();
		
		//var angle = this.getDegree() * Math.PI / 180;
		
		
		var vx = this.pathFinder.getVX();//this.getSpeed() * Math.cos(angle);
		var vy = this.pathFinder.getVY()//this.getSpeed() * Math.sin(angle);
		
		//console.log("vx: "+ vx + " vy: " +vy);
		
		this.incX(vx);
		this.decY(vy);
		
		this.turn(this.pathFinder.getDegree());
		// Pathfinder
		/*if(this.timer == 20) {
			console.log(this.paths[this.path][this.pathkey] + " " + this.pathkey + " " +this.paths[this.path].length + " " + this.getDegree());
			
			var deg = this.paths[this.path][this.pathkey];
			//this.decDegree(deg);
			
			console.log(deg);
			this.turn(deg);
			
			if(this.pathkey < this.paths[this.path].length - 1)
				this.pathkey++;
			else {
				this.path++;
				this.newPath();
				this.pathkey = 4;
			}
			//console.log(this.paths[path][0] + " " + this.paths[path][1] + " " + this.paths[path][2] + " " + this.paths[path][pathkey] + " " + pathkey + " " +this.paths[path].length);
			this.timer = 0;
		}
		this.timer++;*/
		
		//console.log("X: " + this.x + " xPos: " + xPos + " Y: " + this.y + " Frame: " + this.getFrame() + " Speed: " + this.getSpeed());
	},
	
	turn: function(d) {
		
		this.setDegree(d);
		
		var degree = this.getDegree();
		var frame;
				
		// Ermittle Frame
		frame = (((degree % 360) + 360) % 360) / 30;
		//console.log("degree: "+ d + " frame: " +frame);
		this.setFrame(frame);
	},
	
	dirToDegree: function(dir) {
		return -dir * 30;
	},
	
	changeDirection: function() {
		var newDir = this.getDir() == 0 ? 1 : 0;
		this.setDir(newDir);
		this.setSpeed(-this.getSpeed());
		return newDir;
	}, 
	
	flyAway: function() {
		var dir = this.changeDirection();
		if(dir)
			this.decSpeed(10);
		else
			this.incSpeed(10);
	},
	
	// schießen
	shoot: function() {
		bullets.push(new Bullet(bulletSprite, this.getX(), this.getY(), 0));
		bullets.push(new Bullet(bulletSprite, this.getX(), this.getY(), 1));
	}
}



/****
*  Vogel
*
****/
Bird = function(sp) {
	this.base = Enemy;
	
	var speed = getRandom(3, 7);
	
	
	this.base(speed, sp);
	this.init();
	
	this.type = "Bird";
	this.flyAwayFlag = false;
}

Bird.prototype = new Enemy();
Bird.prototype.constructor = Bird;

Bird.prototype = {
	getDir: function() { return this.dir; },
	setDir: function(d) { this.dir = d; },
	
	setFlyAwayFlag: function() { this.flyAwayFlag = true; },
	getFlyAwayFlag: function() { return this.flyAwayFlag; },
	
	fly: function() {
		this.incX(this.getSpeed());
		this.incY(lvlSpeed);
		
		var xPos = Math.round(this.getX());
		var dir = this.getDir();
		
		if((xPos % 50) >= 0 && (xPos % 50) <= 10) {
			if(dir == 1)
				this.setFrame(0);
			else
				this.setFrame(2);
				
			this.incY(4);
		}
		else {
			if(dir == 1)
				this.setFrame(1);
			else
				this.setFrame(3);
				
			this.decY(3);
		}
		//console.log("X: " + this.x + " xPos: " + xPos + " Y: " + this.y + " Frame: " + this.getFrame() + " Speed: " + this.getSpeed());
	},
	
	changeDirection: function() {
		var newDir = this.getDir() == 0 ? 1 : 0;
		this.setDir(newDir);
		this.setSpeed(-this.getSpeed());
		return newDir;
	}, 
	
	flyAway: function() {
		var dir = this.changeDirection();
		if(dir)
			this.decSpeed(10);
		else
			this.incSpeed(10);
	}
}

/****
*  Flugzeug
*
****/
Plane = function(sp) {
	this.base = Enemy;
	
	var speed = getRandom(10, 15);
	
	this.base(speed, sp);
	
	this.type = "Plane";
}

Plane.prototype = new Enemy();
Plane.prototype.constructor = Plane;

Plane.prototype = {
	getDir: function() { return this.dir; },
	
	fly: function() {
		this.incX(this.getSpeed());
		
		var xPos = Math.round(this.getX());
		var dir = this.getDir();
		
		if((xPos % 20) >= 0 && (xPos % 20) <= 5) {
			if(dir == 1)
				this.setFrame(7);
			else
				this.setFrame(4);
				
			this.incY(3);
		}
		else {
			if(dir == 1)
				this.setFrame(6);
			else
				this.setFrame(5);
				
			this.decY(3);
		}
	}
}

/****
*  Spaceship
*
****/
Spaceship = function(x, y, horSpeed, vertSpeed, f) {	
	this.base = FlyingObject;
	
	this.base(x, y, horSpeed, f);

	this.type = "Spaceship";
	this.width = 128;
	this.height = 100;
	this.vertSpeed = vertSpeed;
	this.fligtAttitude = 0;
	this.tankStatus = 420;
	this.timer = 0;
	this.heightBarFrame = 3;
}

Spaceship.prototype = new FlyingObject();
Spaceship.prototype.constructor = Spaceship;

Spaceship.prototype = {
	setVertSpeed: function(s) { this.vertSpeed = s; },
	getVertSpeed: function() { return this.vertSpeed; },
	incVertSpeed: function(inc) { this.vertSpeed += inc; },
	decVertSpeed: function(dec) { this.vertSpeed -= dec; },
	
	setFlightAttitude: function(val) { this.flightAttitude = val; },
	getFlightAttitude: function() { return this.flightAttitude; },
	incFlightAttitude: function(inc) { this.flightAttitude += inc; },
	decFlightAttitude: function(dec) { this.flightAttitude -= dec; },
	
	setTankStatus: function(val) { this.tankStatus = val; },
	getTankStatus: function() { return this.tankStatus; },
	incTankStatus: function(inc) { this.tankStatus += inc; },
	decTankStatus: function(dec) { this.tankStatus -= dec; },
	
	getSprite: function() { return this.sprite; },
	
	derate: function() {
		if(this.vertSpeed <= -20)
			this.vertSpeed = -20;
		if(this.vertSpeed >= 20)
			this.vertSpeed = 20;
	},
	
	checkAttitude: function() {
		var nextLevelFlag = false;
		
		this.incY(lvlSpeed);
		
		
		// Falls die Flughoehe kleiner Null ist nicht mehr sinken
		if(this.flightAttitude < 0) {
			this.setFlightAttitude(0);
			this.setVertSpeed(0);
		}
		
		// Falls die Flughoehe die maximale Level Hoehe erreicht
		if(this.flightAttitude > maxLvlHeight) {
			this.setFlightAttitude(maxLvlHeight);
			this.setVertSpeed(0);
			
			// lade naechstes Level
			nextLevelFlag = true;
		}
		
		this.setFlightAttitude(Math.round(this.flightAttitude));
		return nextLevelFlag;
	},
	
	checkBoundary: function() {
		// Beende Bewegung wenn Ballon am Rand ist
		var x = this.getX();
		var y = this.getY();
		var w = this.getWidth();
		var h = this.getHeight();
		
		if(x <= 0) { 				// linker Rand
			this.setX(0);
		}
		if((x + w) >= width) {		// rechter Rand
			this.setX((width - w));
		}		
		if(y <= 0) { 			// oberer Rand
			this.setY(0);
		}
		if((y + w) >= height) {		// unterer Rand
			this.setY((height - h));
		}
	},
	
	getTankFrame: function() {
		var frame = 0;
		var tankStatus = this.tankStatus;
		
		// Hole die richtige Tankanzeige, entsprechend dem aktuellen Status			
		if (tankStatus < 100){
			frame = 4;
		}
		if (tankStatus >= 100 && tankStatus < 200){
			frame = 3;
		}
		if (tankStatus >= 200 && tankStatus < 300){
			frame = 2;
		}
		if (tankStatus >= 300 && tankStatus < 400){
			frame = 1;
		} 
		if (tankStatus >= 400){
			frame = 0;
		}
		
		return frame;
	},
	
	// Kollisionsverarbeitung
	checkCollisions: function(object) {
		var spaceshipX = this.getX();
		var spaceshipY = this.getY();
		var objectX = object.getX();
		var objectY = object.getY();
		var objectWidth = object.getWidth();
		var objectHeigth = object.getHeight();
		
		if(spaceshipX + this.width >= objectX && spaceshipX <= objectX + objectWidth  && spaceshipY + this.height >= objectY && spaceshipY <= objectY + objectHeigth) {
			if(object instanceof Bird) {
				if(!object.getFlyAwayFlag()) {
					object.flyAway();
					object.setFlyAwayFlag();
				}
			}
			else if(object instanceof Tank) {
				this.incTankStatus(100);
				object.setDefunct();
			}
		}
	},
	
	// Pruefe auf Treffer
	checkHit: function(object) { 
		var objectX = object.getX();
		var objectY = object.getY();
		var objectWidth = object.getWidth();
		var objectHeight = object.getHeight();
		
		for (var i = 0; i < bullets.length; i++) {
			if(bullets[i].getX() + bullets[i].getWidth() >= objectX && bullets[i].getX() <= objectX + objectWidth && bullets[i].getY() + bullets[i].getHeight() >= objectY && bullets[i].getY() <= objectY + objectHeight) {
				object.defunct = true;
				bullets[i].defunct = true;
				lvlScore += 5;
			}
		}
	},
	
	// schießen
	shoot: function() {
		bullets.push(new Bullet(bulletSprite, this.getX(), this.getY(), 0));
		bullets.push(new Bullet(bulletSprite, this.getX(), this.getY(), 1));
	}
}

/****
*  Bullet
*
****/
Bullet = function(sp, shooterX, shooterY, side) {
	this.base = FlyingObject;
	
	var xPos;		
	var yPos;
	
	if(side == 0) {
		
		xPos = shooterX;
		yPos = shooterY + 40;
	}
	else {
		xPos = shooterX + 120;
		yPos = shooterY + 40;
	}
		
	var frame = 0;
	var speed = 30;
	
	
	this.base(xPos, yPos, speed, 0, sp);
	this.init();
	
	this.type = "Bullet";
}

Bullet.prototype = new FlyingObject();
Bullet.prototype.constructor = Bullet;

Bullet.prototype = {
	fly: function() {
		this.incY(lvlSpeed);
		this.decY(this.getSpeed());
	}
}


function getRandom(a, b) {
	var z = Math.random();
	z *= (b - a + 1);
	z += a;
	return (Math.floor(z));
}

