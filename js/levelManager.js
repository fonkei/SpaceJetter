/**
 * 
 */
function LevelManager()
{
	this.level;
	this.levelFile;
	this.currentLevel = 0;
	this.levels;
	this.xml;
	
	this.spriteRowHeights = [0,			// Spaceship 
							 100, 		// Plasma
							 140, 		// Enemy Bug
							 240,		// Asteroid
							 340,		// PowerUp Laser
							 378,		// PowerUp Rocket
							 416,		// PowerUp Shield
							 454,		// Rocket
							 485,		// Laser
							 546,		// Shield
							 597,		// Enemy Cubic
							 639		// Bullet
							 ];
}

// Initialisation
LevelManager.prototype.init = function(file) {
	this.levelFile = file;
	this.level = new Level();
	
	// lade Level Datei	
	this.xml = this.getXml(file);
	
	// lade das erste Level
	this.loadLevel(this.currentLevel);
}

// Lade XML mit der uebergebenen URL
LevelManager.prototype.getXml = function(url) {
    var result = null;
	$.ajax({
		url: url,
		type: 'get',
		dataType: 'xml',
		async: false,
		success: function(data) {
			result = data;
		}
	});
    return result;
}

// Gebe die aktuelle Level ID zurueck
LevelManager.prototype.getCurrentLevelId = function() {
	return this.currentLevel;
}

// Lade das uebergebene Level
LevelManager.prototype.loadLevel = function(lvl) {
	this.currentLevel = lvl;
	
	var enemies = {};
	var objects = {};
	var powerUps = {};
	var weapons = {};
	var pathData = {};
	var attr = {};
	var data = {};	
	
	$(this.xml).find('level').each(function(){
		var id = $(this).attr('id');
		
		if(id == lvl) {
			Level.prototype.setLevelNr(id);
			Level.prototype.setColor($(this).find('color').text());
			Level.prototype.setTitle($(this).find('title').text());
			Level.prototype.setBgPicture($(this).find('picture').text());
			Level.prototype.setLvlHeight($(this).find('lvlHeight').text());
			Level.prototype.setLvlSpeed(parseInt($(this).find('lvlSpeed').text()));
			Level.prototype.setMaxWindStrenght($(this).find('maxWindStrenght').text());
			
			// Gegnerdaten sammeln
			$(this).find('enemy').each(function() {
			
				var desc = $(this).find('desc').text();	
				attr = {'width' : $(this).find('width').text(),
						'height' : $(this).find('height').text(),
						'frames' : $(this).find('frames').text().split(','),
						'row' : $(this).find('row').text()
					   };
								
				enemies[desc] = attr;
			});
			
			// Objektdaten sammeln
			$(this).find('object').each(function() {
			
				var desc = $(this).find('desc').text();	
				attr = {'width' : $(this).find('width').text(),
						'height' : $(this).find('height').text(),
						'frames' : $(this).find('frames').text().split(','),
						'row' : $(this).find('row').text()
					   };
								
				objects[desc] = attr;
			});
			
			// PowerUp-Dauten sammeln
			$(this).find('powerUp').each(function() {
			
				var desc = $(this).find('desc').text();	
				attr = {'width' : $(this).find('width').text(),
						'height' : $(this).find('height').text(),
						'frames' : $(this).find('frames').text().split(','),
						'row' : $(this).find('row').text()
					   };
								
				powerUps[desc] = attr;
			});
			
			// Weapon-Dauten sammeln
			$(this).find('weapon').each(function() {
			
				var desc = $(this).find('desc').text();	
				attr = {'width' : $(this).find('width').text(),
						'height' : $(this).find('height').text(),
						'frames' : $(this).find('frames').text().split(','),
						'row' : $(this).find('row').text()
					   };
								
				weapons[desc] = attr;
			});
			
			// Path-Daten sammeln
			$(this).find('enemyPath').each(function() {
			
				var pathId = $(this).attr('id');
				data = {'number' : $(this).find('number').text(),
						'enemyId': $(this).find('enemyId').text(),
						'path' : $(this).find('path').text().split(',').map(function(e) {return +e})	// Splitte Alle Werte und wandle diese in Integer um
					   };
								
				pathData[pathId] = data;
			});
			
		}
	});
	
	var eFrames = this.calculateFrames(enemies);
	Level.prototype.setEnemyFrames(eFrames);
	
	var oFrames = this.calculateFrames(objects);
	Level.prototype.setObjectFrames(oFrames);
	
	var pFrames = this.calculateFrames(powerUps);
	Level.prototype.setPowerUpFrames(pFrames);
	
	var wFrames = this.calculateFrames(weapons);
	Level.prototype.setWeaponFrames(wFrames);
	
	Level.prototype.setPathData(pathData);
	
	return this.level;
}

// Berechne alle Frames anhand der gesammelten Daten
LevelManager.prototype.calculateFrames = function(data, h) {

	var arr = [];
	for(i in data) {
		var attribs = data[i];
		
		var frames = attribs['frames'];
		var width = parseInt(attribs['width']);
		var height = parseInt(attribs['height']);
		var row = parseInt(attribs['row']);
		var y = (h == undefined) ? this.spriteRowHeights[row-1] : h * (row-1);
		var temp = [];
		for(j in frames) {
			var x = (parseInt(frames[j]) * width);
			var frame = [x, y, width, height, 0, 0, i];
			temp[j] = frame;
		}
		
		arr[i] = temp;
		
	}

	return arr;
}

LevelManager.prototype.getLevelSelectionData = function() {
	var levelSelectionData = [];
	

	$(this.xml).find('level').each(function(){
		var attribs = []
		var id = parseInt($(this).attr('id'));
		attribs['title'] = $(this).find('title').text();
		attribs['picture'] = $(this).find('picture').text();
		levelSelectionData[id] = attribs;
	});
	
	console.log(levelSelectionData);
	return levelSelectionData;
}

// Naechstes Level
LevelManager.prototype.nextLevel = function() {
	this.currentLevel++;
	this.loadLevel(this.currentLevel);
	return this.getCurrentLevel();
}

// Vorherriges Level
LevelManager.prototype.previousLevel = function() {
	this.currentLevel--;
	this.loadLevel(this.currentLevel);
}

// Lade das Level neu
LevelManager.prototype.reloadLevel = function() {
	// TODO
}

// Setze die Level zurueck
LevelManager.prototype.reset = function() {
	this.currentLevel = 0;
}

// Ermittle die Anzahl der Levels
LevelManager.prototype.getLevelCount = function() {
	return $(this.xml).find('level').length;
}

LevelManager.prototype.getCurrentLevel = function() {
	return this.level;
}