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
*  PowerUp
*
****/
PowerUp = function(sp, xPos, yPos) {
	this.base = FlyingObject;

	var frame = 0;
	var speed = getRandom(3, 7);
	
	this.base(xPos, yPos, speed, frame, sp);
	
	var degree = getRandom(210, 330);
	var angle = degree * Math.PI / 180;
	this.vx = speed * Math.cos(angle);
	this.vy = speed * Math.sin(angle);
	this.counter = 0;
	
	this.type = "PowerUp";
}

PowerUp.prototype = new FlyingObject();
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype = {
	getVX: function() { return this.vx; },
	setVX: function(vx) { this.vx = vx; },
	
	getVY: function() { return this.vy; },
	setVY: function(vy) { this.vy = vy; },
	
	fly: function() {
		this.incY(lvlSpeed);
		
		if(this.counter < 24) {
			this.setFrame(this.counter);
			this.counter++;
		}
		else
			this.counter = 0;
	}
}

/****
*  PowerUp Shield
*
****/
PUShield = function(sp, xPos, yPos) {
	this.base = PowerUp;

	this.base(sp, xPos, yPos);
	this.init();
	
	this.type = "PUShield";
}

PUShield.prototype = new PowerUp();
PUShield.prototype.constructor = PUShield;

/****
*  PowerUp Rocket
*
****/
PURocket = function(sp, xPos, yPos) {
	this.base = PowerUp;

	this.base(sp, xPos, yPos);
	this.init();
	
	this.type = "PURocket";
}

PURocket.prototype = new PowerUp();
PURocket.prototype.constructor = PURocket;

/****
*  PowerUp PULaser
*
****/
PULaser = function(sp, xPos, yPos) {
	this.base = PowerUp;

	this.base(sp, xPos, yPos);
	this.init();
	
	this.type = "Shield";
}

PULaser.prototype = new PowerUp();
PULaser.prototype.constructor = PULaser;

/****
*  Sphere
*
****/
Sphere = function(sp, xPos, yPos) {
	this.base = PowerUp;
	
	this.base(sp, xPos, yPos);
	this.init();

	this.type = "Sphere";
}

Sphere.prototype = new PowerUp();
Sphere.prototype.constructor = Sphere;


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
	this.hitCount = 4;
	this.type = "Enemy";

	this.shootTimer = 0;
	this.pathFinder = new PathManager(paths);
	this.newPath();	
	this.isShot = false;
	this.expFrame = 0;
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
		
		var vx = this.pathFinder.getVX();
		var vy = this.pathFinder.getVY();

		this.incX(vx);
		this.decY(vy);
		
		if(this.shootTimer == 50) {
			this.shoot(vx, vy);
			this.shootTimer = 0;
		}
		this.shootTimer++;
		
		if(!this.isShot)
			this.turn(this.pathFinder.getDegree());
		else {
			this.explode();
		}
	},
	
	turn: function(d) {
		
		this.setDegree(d);
		
		var degree = this.getDegree();
		var frame;
				
		// Ermittle Frame
		frame = (((degree % 360) + 360) % 360) / 30;
				
		this.setFrame(frame);
	},
	
	shoot: function(vx, vy) {
		if(!this.isShot) {
			var speed = 2;
			var xPos1 = this.getX() + (this.getWidth() / 2) - 40 ;
			var yPos1 = this.getY() + (this.getHeight() / 2) + 5;
			
			var xPos2 = this.getX() + (this.getWidth() / 2) + 40 ;
			var yPos2 = this.getY() + (this.getHeight() / 2) + 5;
			
			vx = vx * speed;
			vy = -vy * speed;
			
			objects.push(new Bullet(weaponSprite['bullet'], xPos1 , yPos1, vx, vy));
			objects.push(new Bullet(weaponSprite['bullet'], xPos2 , yPos2, vx, vy));
		}
	},
	
	hit: function() {
		shock = true;
		if(!this.isShot)
			audioMngr.play("exp4");

		this.isShot = true;
		this.setSprite(explosionSprite['exp1']);
		this.setFrame(this.expFrame);
	},
	
	explode: function() {
		if(this.expFrame < 16) {
			this.setFrame(this.expFrame);
			this.expFrame++;
		}
		else {
			this.expFrame = 0;
			this.defunct = true;
			createPowerUp(this.getX(), this.getY());
		}
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

}

/****
*  Enemy Packman 
*
****/
Packman = function(sp, paths) {
	this.base = Enemy;
	
	var speed = 0;

	this.base(speed, sp);
	this.init();
	
	
	this.degree = 0;
	this.hitCount = 2;
	this.type = "Enemy";
	this.currDegree = 270;
	
	this.pathFinder = new PathManager(paths);
	this.newPath();	
	this.isShot = false;
	this.expFrame = 0;
	
	this.timer = 0;
	this.shootTimer = 0;
}

Packman.prototype = new Enemy();
Packman.prototype.constructor = Packman;

Packman.prototype = {
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
		
		var vx = this.pathFinder.getVX();
		var vy = this.pathFinder.getVY();

		this.incX(vx);
		this.decY(vy);
		
		if(this.shootTimer == 50) {
			this.shoot();
			this.shootTimer = 0;
		}
		this.shootTimer++;
		
		if(!this.isShot)
			this.turn(this.pathFinder.getDegree());
		else {
			this.explode();
		}
	},
	
	turn: function(d) {
		
		this.setDegree(d);
		
		var degree = this.getDegree();
		var frame;
		
		if(this.timer == 3) {
			if(degree < this.currDegree)
				this.currDegree -= 15;
			else if(degree > this.Degree)
				this.currDegree += 15;
			else
				this.currDegree = degree;
				
			this.timer = 0;
		}
		this.timer++;
		
		// Ermittle Frame
		frame = (((this.currDegree % 360) + 360) % 360) / 15;
			
		this.setFrame(frame);
	},
	
	shoot: function() {
		if(!this.isShot) {
			var xPos = this.getX() + (this.getWidth() / 2) - 5 ;
			var yPos = this.getY() + (this.getHeight() / 2) + 5;
		
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, 0, 10));
		}
	},
	
	hit: function() {
		shock = true;
		if(!this.isShot)
			audioMngr.play("exp1");
		
		this.isShot = true;
		this.setSprite(explosionSprite['exp1']);
		this.setFrame(this.expFrame);
	},
	
	explode: function() {
		if(this.expFrame < 16) {
			this.setFrame(this.expFrame);
			this.expFrame++;
		}
		else {
			this.expFrame = 0;
			this.defunct = true;
			createPowerUp(this.getX(), this.getY());
		}
	},
}

/****
*  Enemy Raider 
*
****/
Raider = function(sp, paths) {
	this.base = Enemy;
	
	var speed = 0;

	this.base(speed, sp);
	this.init();
	
	
	this.degree = 0;
	this.hitCount = 20;
	this.type = "Enemy";
	this.currDegree = 270;
	
	this.pathFinder = new PathManager(paths);
	this.newPath();	
	this.isShot = false;
	this.expFrame = 5;
	
	this.timer = 0;
	this.shootTimer = 0;
}

Raider.prototype = new Enemy();
Raider.prototype.constructor = Raider;

Raider.prototype = {
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
		
		var vx = this.pathFinder.getVX();
		var vy = this.pathFinder.getVY();

		this.incX(vx);
		this.decY(vy);
		
		if(!spaceship.defunct) {
			if(this.shootTimer % 20 == 0) {
				this.shootPlasma();
			}
			if(this.shootTimer % 50 == 0) {
				this.shootBullet();
			}
			if(this.shootTimer % 70 == 0) {
				this.shootRocket();
				this.shootTimer = 0;
			}
			this.shootTimer++;
		}
		
		if(!this.isShot)
			this.turn(this.pathFinder.getDegree());
		else {
			this.explode();
		}
	},
	
	turn: function(d) {
		
		this.setDegree(d);
		
		var degree = this.getDegree();
		var frame;
		
		if(this.timer == 2) {
			if(degree < this.currDegree)
				this.currDegree -= 15;
			else if(degree > this.currDegree)
				this.currDegree += 15;
			else
				this.currDegree = degree;
				
			this.timer = 0;
		}
		this.timer++;
		
		// Ermittle Frame
		var frame;
		var deg = this.currDegree;
		if(deg < 180) {
			if(deg == 0)
				frame = 10;
			else
				frame = 11 - (this.currDegree / 15);
		}
		else {
			if(deg == 180)
				frame = 0;
			else if(deg == 360)
				frame = 10;
			else
				frame = (this.currDegree / 15) - 13;
		}
			
		this.setFrame(frame);
	},
	
	shootBullet: function() {
		if(!this.isShot) {
			var xPos = this.getX() + (this.getWidth() / 2) - 5 ;
			var yPos = this.getY() + (this.getHeight() / 2) + 5;
		
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, 3, 8));
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, 1.5, 9));
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, 0, 10));
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, -1.5, 9));
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, -3, 8));
		}
	},
	
	shootPlasma: function() {
		if(!this.isShot) {
			var xPos = this.getX() + (this.getWidth() / 2) - 5 ;
			var yPos = this.getY() + (this.getHeight() / 2) + 5;
			
			objects.push(new Plasma(weaponSprite['plasma'], xPos, yPos, 0, -30, 10, 1, 20, "Enemy"));
			objects.push(new Plasma(weaponSprite['plasma'], xPos, yPos, 1, 30, 10, 1, 20, "Enemy"));
		}
	},
	
	shootRocket: function() {
		if(!this.isShot) {
			var xPos = this.getX() + (this.getWidth() / 2) - 5 ;
			var yPos = this.getY() + (this.getHeight() / 2) + 5;
			
			objects.push(new Rocket(weaponSprite['rocket'], xPos, yPos, "Enemy", 3));
		}
	},
	
	hit: function() {
		shock = true;
		if(!this.isShot)
			audioMngr.play("exp5");

		this.isShot = true;
		this.setSprite(explosionSprite['exp1']);
		this.setFrame(this.expFrame);
	},
	
	explode: function() {
		if(this.expFrame < 16) {
			this.setFrame(this.expFrame);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, this.getX() + 20, this.getY() + 20);
			explosionSprite['exp0'].drawFrame(ctx, this.expFrame, this.getX() - 20, this.getY() - 20);
			explosionSprite['exp3'].drawFrame(ctx, this.expFrame, this.getX() + 20, this.getY() - 20);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, this.getX() - 20, this.getY() + 20);

			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, this.getX() + 40, this.getY() + 40);
			explosionSprite['exp0'].drawFrame(ctx, this.expFrame, this.getX() - 40, this.getY() - 40);
			explosionSprite['exp3'].drawFrame(ctx, this.expFrame, this.getX() + 40, this.getY() - 40);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, this.getX() - 40, this.getY() + 40);
			this.expFrame++;
		}
		else {
			this.expFrame = 0;
			this.defunct = true;
		}
	},
}


/****
*  Enemy Hawk 
*
****/
Hawk = function(sp, paths) {
	this.base = Enemy;
	
	var speed = 0;

	this.base(speed, sp);
	this.init();
	
	
	this.degree = 0;
	this.hitCount = 20;
	this.type = "Enemy";
	this.currDegree = 270;
	
	this.pathFinder = new PathManager(paths);
	this.newPath();	
	this.isShot = false;
	this.expFrame = 5;
	
	this.timer = 0;
	this.shootTimer = 0;
}

Hawk.prototype = new Enemy();
Hawk.prototype.constructor = Hawk;

Hawk.prototype = {
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
		
		var vx = this.pathFinder.getVX();
		var vy = this.pathFinder.getVY();

		this.incX(vx);
		this.decY(vy);
		
		if(this.shootTimer % 20 == 0) {
			this.shootPlasma();
		}
		if(this.shootTimer % 50 == 0) {
			this.shootBullet();
			
		}
		if(this.shootTimer % 150 == 0) {
			this.createEnemy();
			this.shootTimer = 0;
		}
		this.shootTimer++;
		
		if(!this.isShot)
			this.turn(this.pathFinder.getDegree());
		else {
			this.explode();
		}
	},
	
	turn: function(d) {
		
		this.setDegree(d);
		
		var degree = this.getDegree();
		var frame;
		
		if(this.timer == 2) {
			if(degree < this.currDegree)
				this.currDegree -= 15;
			else if(degree > this.Degree)
				this.currDegree += 15;
			else
				this.currDegree = degree;
				
			this.timer = 0;
		}
		this.timer++;
		
		// Ermittle Frame
		var frame;
		var deg = this.currDegree;
		if(deg < 180) {
			if(deg == 0)
				frame = 10;
			else
				frame = 11 - (this.currDegree / 15);
		}
		else {
			if(deg == 180)
				frame = 0;
			else if(deg == 360)
				frame = 10;
			else
				frame = (this.currDegree / 15) - 13;
		}
			
		this.setFrame(frame);
	},
	
	shootBullet: function() {
		if(!this.isShot) {
			var xPos = this.getX() + (this.getWidth() / 2) - 5 ;
			var yPos = this.getY() + (this.getHeight() / 2) + 5;
		
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, 3, 8));
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, 1.5, 9));
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, 0, 10));
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, -1.5, 9));
			objects.push(new Bullet(weaponSprite['bullet'], xPos , yPos, -3, 8));
		}
	},
	
	shootPlasma: function() {
		if(!this.isShot) {
			var xPos = this.getX() + (this.getWidth() / 2) - 5 ;
			var yPos = this.getY() + (this.getHeight() / 2) + 5;
			
			objects.push(new Plasma(weaponSprite['plasma'], xPos, yPos, 0, -30, 10, 1, 20, "Enemy"));
			objects.push(new Plasma(weaponSprite['plasma'], xPos, yPos, 1, 30, 10, 1, 20, "Enemy"));
		}
	},
	
	shootRocket: function() {
		if(!this.isShot) {
			var xPos = this.getX() + (this.getWidth() / 2) - 5 ;
			var yPos = this.getY() + (this.getHeight() / 2) + 5;
			
			objects.push(new Rocket(weaponSprite['plasma'], xPos, yPos, 0, -30, 10, 1, 20, "Enemy"));
		}
	},

	createEnemy: function() {
		if(!this.isShot) {
			var xPos = this.getX() + (this.getWidth() / 2) - 30;
			var yPos = this.getY() + (this.getHeight() / 2);
			var paths = ['x|'+xPos, 'y|'+yPos, 's|8', '270'];

			var newEnemy = new Packman(enemySprite['packman'], [paths]);
			objects.push(newEnemy);
			objects.sort();
		}
	},
	
	hit: function() {
		
		shock = true;
		if(!this.isShot)
			audioMngr.play("exp5");

		this.isShot = true;
		this.setSprite(explosionSprite['exp1']);
		this.setFrame(this.expFrame);
	},
	
	explode: function() {
		if(this.expFrame < 16) {
			var xPos = this.getX() + (this.getWidth() / 2);
			var yPos = this.getY() + (this.getHeight() / 2);

			this.setFrame(this.expFrame);

			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, xPos + 20, yPos + 20);
			explosionSprite['exp0'].drawFrame(ctx, this.expFrame, xPos - 20, yPos - 20);
			explosionSprite['exp3'].drawFrame(ctx, this.expFrame, xPos + 20, yPos - 20);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, xPos - 20, yPos + 20);

			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, xPos + 40, yPos + 40);
			explosionSprite['exp0'].drawFrame(ctx, this.expFrame, xPos - 40, yPos - 40);
			explosionSprite['exp3'].drawFrame(ctx, this.expFrame, xPos + 40, yPos - 40);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, xPos - 40, yPos + 40);

			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, xPos, yPos + 40);
			explosionSprite['exp0'].drawFrame(ctx, this.expFrame, xPos, yPos - 40);
			explosionSprite['exp3'].drawFrame(ctx, this.expFrame, xPos + 40, yPos);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, xPos - 40, yPos);

			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, xPos, yPos + 60);
			explosionSprite['exp0'].drawFrame(ctx, this.expFrame, xPos, yPos - 60);
			explosionSprite['exp3'].drawFrame(ctx, this.expFrame, xPos + 60, yPos);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, xPos - 60, yPos);
			this.expFrame++;
		}
		else {
			this.expFrame = 0;
			this.defunct = true;
		}
	},
}


/****
*  Enemy Cubic 
*
****/
Cubic = function(sp, paths) {
	this.base = Enemy;
	
	var speed = 10;

	this.base(speed, sp);
	this.init();
	
	
	this.degree = 0;
	this.hitCount = 4;
	this.type = "Enemy";
	this.frame = 0;

	this.pathFinder = new PathManager(paths);
	this.newPath();	
	this.timer = 0;
	
	this.isShot = false;
	this.expFrame = 0;
}

Cubic.prototype = new Enemy();
Cubic.prototype.constructor = Cubic;

Cubic.prototype = {
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
		
		var vx = this.pathFinder.getVX();
		var vy = this.pathFinder.getVY();

		this.incX(vx);
		this.decY(vy);
		
		if(!this.isShot)
			this.move();
		else {
			this.explode();
		}
	},
	
	move: function() {
		var degree = this.getDegree();
		var speed = this.getSpeed();
		
		var angle = -degree * Math.PI / 180;
		
		var vx = speed * Math.cos(angle);
		var vy = speed * Math.sin(angle);
		
		var	frame = Math.floor(degree / 15);
		
		
		
		if(degree < 355) {
			this.incDegree(15);
			if(this.timer == 4) {
				var posX = this.getX() + (this.getWidth() / 2);
				var posY = this.getY() + (this.getHeight() / 2);
				
				objects.push(new Bullet(weaponSprite['bullet'], posX, posY, vx, vy));
				this.timer = 0;
			}	
			this.timer++;
		}
		else
			this.setDegree(0);
		
		this.setFrame(frame);
	},
	
	hit: function() {
		shock = true;
		if(!this.isShot)
			audioMngr.play("exp4");

		this.isShot = true;
		this.setSprite(explosionSprite['exp4']);
		this.setFrame(this.expFrame);
	},
	
	explode: function() {
		if(this.expFrame < 16) {
			this.setFrame(this.expFrame);
			this.expFrame++;
		}
		else {
			this.expFrame = 0;
			this.defunct = true;
			createPowerUp(this.getX(), this.getY());
		}
	},
}

/****
*  Asteroid
*
****/
Asteroid = function(sp, paths) {
	this.base = Enemy;
	
	var speed = 0;

	this.base(speed, sp);
	this.init();
	
	
	this.degree = 0;
	this.hitCount = 1;
	this.type = "Enemy";
	this.picNr = getRandom(0, 11);
	this.pathFinder = new PathManager(paths);
	this.newPath();	
	this.count = 0;
	this.timer = getRandom(0,3);
	
	this.isShot = false;
	this.expFrame = 0;
}

Asteroid.prototype = new Enemy();
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype = {
	getDir: function() { return this.dir; },
	setDir: function(d) { this.dir = d; },
	
	setFlyAwayFlag: function() { this.flyAwayFlag = true; },
	getFlyAwayFlag: function() { return this.flyAwayFlag; },
	
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
		
		var vx = this.pathFinder.getVX();
		var vy = this.pathFinder.getVY();
		
		this.incX(vx);
		this.decY(vy);
		
		if(!this.isShot)
			this.turn(this.pathFinder.getDegree());
		else {
			this.explode();
		}
	},
	
	turn: function(d) {
		
		this.setDegree(d);
		
		if(this.count == this.timer) {
			if(this.picNr < 12) {
				this.setFrame(this.picNr);
				this.picNr++;
			}
			else {
				this.picNr = 0;
			}	
			this.count = 0;
		}
			
			
		this.count++;
	},
	
	hit: function() {
		shock = true;
		if(!this.isShot)
			audioMngr.play("exp1");
		
		this.isShot = true;
		this.setSprite(explosionSprite['exp3']);
		this.setFrame(this.expFrame);
	},
	
	explode: function() {
		if(this.expFrame < 16) {
			this.setFrame(this.expFrame);
			this.expFrame++;
		}
		else {
			this.expFrame = 0;
			this.defunct = true;
		}
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
*  Spaceship
*
****/
Spaceship = function(x, y, horSpeed, vertSpeed, f) {	
	this.base = FlyingObject;
	
	this.base(x, y, horSpeed, f);

	this.type = "Spaceship";
	this.width = 67;
	this.height = 110;
	this.vertSpeed = vertSpeed;
	this.fligtAttitude = 0;
	this.tankStatus = 420;
	this.timer = 0;
	this.shootTimer = 0;

	this.rocketPowerUp = false;
	this.laserPowerUp = false;
	this.shieldPowerUp = false;
	
	this.isShot = false;
	this.expFrame = 0;
	this.shields = [];
	this.levelDone = false;
	this.endPositionFound = false;
	this.sequenceDone = false;
	this.speed = 0.05;
	this.soundNum = 0;
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
	
	derate: function() {
		if(this.vertSpeed <= -20)
			this.vertSpeed = -20;
		if(this.vertSpeed >= 20)
			this.vertSpeed = 20;
	},
	
	checkAttitude: function() {
		var nextLevelFlag = false;
		
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
			this.setX(width - w);
		}		
		if(y <= 0) { 			// oberer Rand
			this.setY(0);
		}
		if((y + h) >= height) {		// unterer Rand
			this.setY(height - h);
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
		
		for(s in this.shields) {
			var shield = this.shields[s];
			var shieldX = shield.getX();
			var shieldY = shield.getY();
			var shieldWidth = shield.getWidth();
			var shieldHeigth = shield.getHeight();
			
			if(shieldX + shieldWidth >= objectX && shieldX <= objectX + objectWidth  && shieldY + shieldHeigth >= objectY && shieldY <= objectY + objectHeigth) {
				if(object.type == "Enemy") {
					if(object instanceof Plasma || object instanceof Rocket )
						object.setDefunct();
					else	
						object.hit();
				}
				if(object instanceof Bullet)
					object.setDefunct();				
			}
		}
		
		if(!this.isShot){
			if(spaceshipX + this.width >= objectX && spaceshipX <= objectX + objectWidth  && spaceshipY + this.height >= objectY && spaceshipY <= objectY + objectHeigth) {
				if(object instanceof PUShield) {
					
					var newShield = new Shield(weaponSprite['shield'], this);
					this.shields.push(newShield);
					objects.push(newShield);
					
					if($.grep(powerUps, function(e){ return e instanceof PUShield; }) == "") { // durchsuche Array nach dem Shield Objekt
						powerUps.push(new PUShield(powerupSprite['shield']));
						this.shieldPowerUp = true;
					}
					object.setDefunct();
				}
				if(object instanceof PURocket) {
					if($.grep(powerUps, function(e){ return e instanceof PURocket; }) == "") { // durchsuche Array nach dem Rocket Objekt
						powerUps.push(new PURocket(powerupSprite['rocket']));
						this.rocketPowerUp = true;
					}
						
					object.setDefunct();
				}
				if(object instanceof PULaser) {
					if($.grep(powerUps, function(e){ return e instanceof PULaser; }) == "") {// durchsuche Array nach dem Laser Objekt
						powerUps.push(new PULaser(powerupSprite['laser']));
						this.laserPowerUp = true;
					}
					
					object.setDefunct();
				}
				if(object instanceof Sphere) {
					sphereCount++;
					object.setDefunct();
				}
				if(object.type == "Enemy") {
					if(!object.isShot) {
						if(powerUps.length > 0) {
							shock = true;
							powerUps = [];
							this.destroyShields();
						}
						else  
							this.hit();
						
						if(object instanceof Plasma || object instanceof Rocket )
							object.setDefunct();
						else
							object.hit();
					}
				}
				if(object instanceof Bullet) {
					if(powerUps.length > 0) {
						shock = true;
						powerUps = [];
						this.destroyShields();
					}
					else
						this.hit();
					object.setDefunct();
				}
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
				if(object.type ==  "Enemy") {
					// Alle, die getroffen sind nicht mehr beruecksichtigen
					if(!(object instanceof Plasma) && !(object instanceof Rocket)) {
						if(!object.isShot) {
							if(object.hitCount <= 0) {
								if(object instanceof Raider || object instanceof Hawk)
									this.levelDone = true;
								
								// Objekt zerstoeren 	
								object.hit();
								powerUpCount++;
								lvlScore += 100;
							}
							else
								object.hitCount--;
								
							bullets[i].defunct = true;
						}
					}
				}
			}
		}
	},
	
	checkIsHit: function() {
		if(this.isShot)
			this.explode();
	},
	
	// schießen
	shoot: function() {
		
		audioMngr.play("laser");

		//if(this.shootTimer % 10 == 0) {
			bullets.push(new Plasma(weaponSprite['plasma'], this.getX(), this.getY(), 0, 15, 10, 0, 40));
			bullets.push(new Plasma(weaponSprite['plasma'], this.getX(), this.getY(), 1, 45, 10, 0, 40));
		//}
			if(this.rocketPowerUp) {
				//if(this.shootTimer % 20 == 0)
					bullets.push(new Rocket(weaponSprite['rocket'], this.getX(), this.getY()));
					
			}
			if(this.laserPowerUp) {
				//if(this.shootTimer % 20 == 0)
					bullets.push(new Laser(weaponSprite['laser'], this.getX(), this.getY()));
			}
		
		//if(this.shootTimer % 25 == 0)
		//	this.shootTimer = 0;
			
		//this.shootTimer++;
	},
	
	// getroffen
	hit: function() {
		shock = true;

		// zerstoere Schutzschilder
		for(s in this.shields) {
			this.shields[s].setDefunct();
			this.shields[s].delete
		}
			
		this.shields = [];
		if(!this.isShot)
			audioMngr.play("exp2");

		this.isShot = true;
		this.setSprite(explosionSprite['exp1']);
		this.setFrame(this.expFrame);
	},
	
	explode: function() {
		if(this.expFrame < 16) {
			this.setFrame(this.expFrame);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, this.getX() + 20, this.getY() + 20);
			explosionSprite['exp0'].drawFrame(ctx, this.expFrame, this.getX() - 20, this.getY() - 20);
			explosionSprite['exp3'].drawFrame(ctx, this.expFrame, this.getX() + 20, this.getY() - 20);
			explosionSprite['exp1'].drawFrame(ctx, this.expFrame, this.getX() - 20, this.getY() + 20);

			this.expFrame++;

		}
		else {
			this.expFrame = 0;
			this.setDefunct();
			gameOver();
		}
	},
	
	destroyShields: function() {
		for(s in this.shields) {
			var shield = this.shields[s];
			shield.setDefunct();
		}
		this.shieldPowerUp = this.rocketPowerUp = this.laserPowerUp = false;
		this.shields = [];
	},
	
	levelDoneSequence: function() {
		/*for(o in objects)
			objects[o].setDefunct();*/
			
		var x = Math.round(this.getX() + (this.getWidth() / 2));
		var y = Math.round(this.getY() + (this.getHeight() / 2));
		var xPos = Math.round(width / 2);
		var yPos = Math.round(height - 200);
		
		if(!this.endPositionFound && (x != xPos || y != yPos)) {
			if(x > xPos)
				this.decX(0.5);
			else if(x < xPos)
				this.incX(0.5);
			
			if(y > yPos)
				this.decY(0.5);
			else if(y < yPos)
				this.incY(0.5);

			console.log("Not Found: ",x, xPos, y, yPos);
		}						
		else {
			this.endPositionFound = true;
			if(y > -100) {
				this.speed += 0.05;
				this.decY(this.speed);
			}
			else if(y <= -100 && !this.sequenceDone) { 
				this.sequenceDone = true;
				stopGame();
				levelDone();
			}

			console.log("Found: ",y, this.speed);
		}
	}
}

/****
*  Bullet
*
****/
Bullet = function(sp, xPos, yPos, vx, vy) {
	this.base = FlyingObject;
		
	var frame = 0;

	this.vx = vx;
	this.vy = vy;
	this.base(xPos, yPos, 10, 0, sp);
	this.init();
	
	this.type = "Bullet";
}

Bullet.prototype = new FlyingObject();
Bullet.prototype.constructor = Bullet;

Bullet.prototype = {
	fly: function() {
		this.incX(this.vx);
		this.incY(this.vy);
	}
}

/****
*  Plasma
*
****/
Plasma = function(sp, shooterX, shooterY, side, offsetX, offsetY, dir, speed, t) {
	this.base = FlyingObject;
	
	var xPos;		
	var yPos;
	
	if(side == 0) {
		xPos = shooterX + offsetX; // 15;
		yPos = shooterY + offsetY; // 10;
	}
	else {
		xPos = shooterX + offsetX; // 40;
		yPos = shooterY + offsetY; // 10;
	}
	this.dir = dir;
	var frame = dir; // 0 = hochschiessen; 1 = runterschiessen
	var speed = speed;
	
	this.canShoot = false;
	this.base(xPos, yPos, speed, frame, sp);
	this.init();
	
	this.type = (t != undefined) ? t : "Plasma";

}

Plasma.prototype = new FlyingObject();
Plasma.prototype.constructor = Plasma;

Plasma.prototype = {
	fly: function() {
		if(this.dir == 0)
			this.decY(this.getSpeed());
		else
			this.incY(this.getSpeed());
	}
}

/****
*  Rocket
*
****/
Rocket = function(sp, shooterX, shooterY, t, delay) {
	this.base = FlyingObject;
	
	var xPos = shooterX + 33;		
	var yPos = shooterY + 40;
	
	var frame = 9;
	var speed = 20;	
	
	this.base(xPos, yPos, speed, frame, sp);
	this.init();
	
	this.canShoot = false;
	this.angle = 1.57;
	this.degree = 90;
	this.nearestX;
	this.nearestY;
	this.nearestObject;
	this.vx = 0;
	this.vy = -20;
	this.delay = delay != undefined ? delay : 0;
	this.timer = 0;

	this.type = (t != undefined ? t : "Rocket");
	this.searchNearest();
}

Rocket.prototype = new FlyingObject();
Rocket.prototype.constructor = Rocket;

Rocket.prototype = {
	getAngle: function() { return this.angle; },
	setAngle: function(a) { this.angle = a; },
	
	incVX: function(inc) { this.vx += inc; },
	decVX: function(dec) { this.vx -= dec; },
	
	setVY: function(vy) { this.vy = vy; },
	getVY: function() { return this.vy; },
	
	incVY: function(inc) { this.vy += inc; },
	decVY: function(dec) { this.vy -= dec; },
	
	incAngle: function(inc) { this.angle += inc; },
	decAngle: function(dec) { this.angle -= dec; },
	
	incDegree: function(inc) { this.degree += inc; },
	decDegree: function(dec) { this.degree -= dec; },

	searchNearest: function() {
		this.nearestX = width;
		this.nearestY = height;
		if(this.type != "Enemy") {
			for(o in objects) {
				var object = objects[o];
				if(object.type == "Enemy" && !(object instanceof Rocket) && !(object instanceof Plasma)) {
					var objX = Math.abs(object.getX() - this.getX());
					var objY = Math.abs(object.getY() - this.getY());
				
					if(objX <= this.nearestX && objY <= this.nearestY){
						this.nearestX = object.getX();
						this.nearestY = object.getY();
						this.nearestObject = object;
					}
				}
			}
			this.calculate();
		}
		else {
			if(!spaceship.defunct) {
				var spX = spaceship.getX();
				var spY = spaceship.getY();
				var objX = Math.abs(spX - this.getX());
				var objY = Math.abs(spY - this.getY());
				this.nearestX = spX;
				this.nearestY = spY;
				this.nearestObject = spaceship;
				this.setFrame(27);
				this.angle = 4.7;
				this.calculate();
			}	
		}
		
	},

	fly: function() {
		if(this.nearestObject != undefined && !this.nearestObject.defunct) {
			if(this.type == "Enemy") {
				if(this.timer == this.delay){
					this.calculate();	
					this.timer = 0;
				}
				this.timer++;
			}
			else 
				this.calculate();
		}
		
		this.incX(this.vx);
		this.incY(this.vy);
	},
	
	calculate: function() {
		if(this.nearestObject != undefined && !this.nearestObject.defunct) {
			var x1 = this.getX() + (this.getWidth() / 2);
			var x2 = this.nearestObject.getX() + (this.nearestObject.getWidth() / 2);
			
			var y1 = this.getY();
			var y2 = this.nearestObject.getY() + (this.nearestObject.getHeight() / 2);
			
			var theta = Math.atan2(-(y2-y1), x2-x1);
			
			if(theta < 0)
				theta += 2 * Math.PI;
			
			if(theta < this.angle)
				this.decAngle(0.1);
			else if(theta > this.angle)
				this.incAngle(0.1);
			
			var degree = this.angle * (180 / Math.PI);
			
			var	frame = Math.floor(degree / 10);
			
			this.setFrame(frame);
				
			this.vx = this.getSpeed() * Math.cos(this.angle);
			this.vy = this.getSpeed() * -Math.sin(this.angle);
		}
	}
}

/****
*  Laser
*
****/
Laser = function(sp, shooterX, shooterY) {
	this.base = FlyingObject;
	
	var xPos = shooterX + 33 - 5;		
	var yPos = shooterY;	
	var frame = 0;
	var speed = 60;
	
	this.base(xPos, yPos, speed, frame, sp);
	this.init();

	this.type = "Laser";
}

Laser.prototype = new FlyingObject();
Laser.prototype.constructor = Laser;

Laser.prototype = {
	fly: function() {
		this.decY(this.getSpeed());
	}
}

/****
*  Shield
*
****/
Shield = function(sp, obj) {
	this.base = FlyingObject;
	
	this.obj = obj;
	var xPos = this.obj.getX(); //shooterX + 64;		
	var yPos = this.obj.getY(); //shooterY + 40;
		
	var frame = 0;
	var speed = 2;
	
	this.base(xPos, yPos, speed, frame, sp);
	this.init();
	
	this.degree = 0;
	this.canShoot = false;
	this.vx;
	this.vy;
	this.type = "Shield";
}

Shield.prototype = new FlyingObject();
Shield.prototype.constructor = Shield;

Shield.prototype = {

	fly: function() {
		var x1 = this.obj.getX() + (this.obj.getWidth() / 2);
		var y1 = this.obj.getY() + (this.obj.getHeight() / 2);
		
		var angle = this.degree * (Math.PI / 180);
		var speed = this.getSpeed();
		var angle = angle * speed;
		
		this.vx = (x1 + 100 * Math.cos(angle)) - (this.getWidth() / 2);
		this.vy = (y1 + 100 * Math.sin(angle)) - (this.getHeight() / 2);
		
		var	frame = Math.floor(this.degree / 15);
		
		if(this.degree < 355)
			this.degree += 5;
		else
			this.degree = 0;
		
		this.setFrame(frame);
		
		this.setX(this.vx);
		this.setY(this.vy);		
	}
}




function getRandom(a, b) {
	var z = Math.random();
	z *= (b - a + 1);
	z += a;
	return (Math.floor(z));
}

