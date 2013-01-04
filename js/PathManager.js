/****
*	Path Manager
*
*****/

function PathManager(paths) {
	this.paths = paths;
	this.pathNr = 0;
	this.pathKey = 3;
	this.angle;
	this.timer = 0;
	this.x;
	this.y;
	this.speed;
	this.vx;
	this.vy;
	this.degree;
				 
	this.init();
}

PathManager.prototype = {
	getPathNr: function() { return this.pathNr; },
	setPathNr: function(nr) { this.pathNr = nr; },
	incPathNr: function() { this.pathNr++; },
	resetPathNr: function() { this.pathKey = 0; },
	
	getPathKey: function() { return this.pathKey; },
	setPathKey: function(key) { this.pathKey = key; },
	incPathKey: function() { this.pathKey++; },
	resetPathKey: function() { this.pathKey = 3; },
	
	getAngle: function() { return this.angle; },
	setAngle: function(a) { this.angle = a; },
	
	getTimer: function() { return this.timer; },
	setTimer: function(t) { this.timer = t; },
	incTimer: function() { this.timer++; },
	
	getX: function() { return this.x; },
	setX: function(x) { this.x = x; },
	
	getY: function() { return this.y; },
	setY: function(y) { this.y = y; },
	
	getSpeed: function() { return this.speed; },
	setSpeed: function(s) { this.speed = s; },
	
	getVX: function() { return this.vx; },
	setVX: function(vx) { this.vx = vx; },
	
	getVY: function() { return this.vy; },
	setVY: function(vy) { this.vy = vy; },
	
	getDegree: function() { return this.degree; },
	setDegree: function(d) { this.degree = ((d % 360) + 360) % 360; },
	
	init: function() {
		var pathNr = this.getPathNr();
		this.setValue(this.paths[pathNr][3]);
		this.setValue(this.paths[pathNr][0]);
		this.setValue(this.paths[pathNr][1]);
		this.setValue(this.paths[pathNr][2]);
	},
	
	getNextPathDir: function() {
		//console.log("PathLength: " +this.paths[this.getPathNr()].length);
		if(this.getPathKey() < this.paths[this.getPathNr()].length - 1) {
			this.incPathKey();
		}
		else {
			
			if(this.getPathNr() < this.paths.length - 1) {
				this.incPathNr();
				this.resetPathKey();
				//this.init();
			}
			else {
				//this.resetPathNr();
				//this.resetPathKey();
			}
		}
		return this.paths[this.getPathNr()][this.getPathKey()];
	}, 
	
	calculate: function() {
		// Pathfinder
		this.setAngle(this.getDegree() * Math.PI / 180);
		
		var angle = this.getAngle();
		this.setVX(this.getSpeed() * Math.cos(angle));
		this.setVY(this.getSpeed() * Math.sin(angle));
		
		if(this.getTimer() == 20) {
			
			var pathkey = this.getNextPathDir();
			this.setValue(pathkey);
			
			this.setTimer(0);
		}
		this.incTimer();
	},
	
	setValue: function(pathkey) {
		if(!isNaN(parseInt(pathkey))) {
			this.setDegree(pathkey);
		}
		else {
			var values = pathkey.split('|', 2);
			if(values.length >=	1) {
				var key = $.trim(values[0]);
				
				var val = parseInt(values[1]);
				switch(key) {
					case 'x':
						this.setX(val);
						break;
					case 'y':
						this.setY(val);
						break;
					case 's':
						this.setSpeed(val);
						break;
				}
			} 
		}
	}
}