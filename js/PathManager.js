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
	
	/*this.paths = [// x    y  sp first
				   [width, 100, 5, 180, 180, 210, 240, 270, 270, 270],
				   [-100, 100, 5, 0, 0, 330, 300, 270, 270, 240, 300, 240],
				   [500, -100, 5, 270, 300, 240, 300, 240, 300, 240, 300, 240]
				 ];*/
				 
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
		
		this.setDegree(this.paths[pathNr][3]);
		this.setX(this.paths[pathNr][0]);
		this.setY(this.paths[pathNr][1]);
		this.setSpeed(this.paths[pathNr][2]);
	},
	
	getNextPathDir: function() {
		console.log("PathLength: " +this.paths[this.getPathNr()].length);
		if(this.getPathKey() < this.paths[this.getPathNr()].length - 1) {
			this.incPathKey();
		}
		else {
			
			if(this.getPathNr() < this.paths.length - 1) {
				this.incPathNr();
				this.resetPathKey();
				this.init();
				console.log("hier ");
			}
			else {
				this.resetPathNr();
				this.resetPathKey();
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
			//console.log(this.paths[this.pathNr][this.pathKey] + " " + this.pathKey + " " +this.paths[this.pathNr].length + " " + this.getDegree());
			
			var deg = this.getNextPathDir();
			this.setDegree(deg);
			
			

			//console.log(this.paths[path][0] + " " + this.paths[path][1] + " " + this.paths[path][2] + " " + this.paths[path][pathkey] + " " + pathkey + " " +this.paths[path].length);
			this.setTimer(0);
		}
		this.incTimer();
	},
	
	/*turn: function(d) {
		this.incDegree(d);
		
		var degree = this.getDegree();
		var frame;
				
		// Ermittle Frame
		frame = (((degree % 360) + 360) % 360) / 30;
		this.setFrame(frame);
	},*/
}