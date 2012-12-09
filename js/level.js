function Level()
{
	this.levelNr;
	this.title;
	this.bgPicture;
	this.bgMusic;
	this.color;
	
	this.clouds = [];
	this.powerUps = [];
	this.enemies = [];
	
	this.lvlHeight;
	this.lvlSpeed;
	this.maxWindStrenght;
	this.enemyFrames;
	this.objectFrames;
	this.powerUpFrames;
	this.pathData;
}

Level.prototype = {
	setLevelNr: function(val) { this.levelNr = val; },
	getLevelNr: function() { return this.levelNr; },

	setTitle: function(val) { this.title = val; },
	getTitle: function() { return this.title; },
	
	setBgPicture: function(val) { this.bgPicture = val; },
	getBgPicture: function() { return this.bgPicture; },
	
	setBgMusic: function(val) { this.bgMusic = val; },
	getBgMusic: function() { return this.bgMusic; },
	
	setColor: function(val) { this.color = val; },
	getColor: function() { return this.color; },
	
	setLvlHeight: function(val) { this.lvlHeight = val; },
	getLvlHeight: function() { return this.lvlHeight; },
	
	setLvlSpeed: function(val) { this.lvlSpeed = val; },
	getLvlSpeed: function() { return this.lvlSpeed; },
	
	setMaxWindStrenght: function(val) { this.maxWindStrenght = val; },
	getMaxWindStrenght: function() { return this.maxWindStrenght; },
	
	setEnemyFrames: function(val) { this.enemyFrames = val; },
	getEnemyFrames: function() { return this.enemyFrames; },
	
	setObjectFrames: function(val) { this.objectFrames = val; },
	getObjectFrames: function() { return this.objectFrames; },
	
	setPowerUpFrames: function(val) { this.powerUpFrames = val; },
	getPowerUpFrames: function() { return this.powerUpFrames; },
	
	setPathData: function(val) { this.pathData = val; },
	getPathData: function() { return this.pathData; },
}
