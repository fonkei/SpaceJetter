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
							 
	this.spriteRowHeights = [];
							 
	this.weaponRowHeights = [0, 		// Plasma
							 20, 		// Laser
							 60, 		// Rocket
							 90, 		// Bullet
							 100		// Shield
							 ];
							 
	this.enemyRowHeights = 	 [0,		// Raider
							  202,		// Hawk
							  407, 		// Asteroid
							  507,		// Bug
							  604,		// Packman
							  661		// Cubic
							  ];
							  
	this.powerUpRowHeights = [0,		// PowerUp Laser
							  37,		// PowerUp Rocket
							  74,		// PowerUp Shield
							  111		// PowerUp Sphere
							  ];
							  
	this.spriteRowHeights[0] = this.weaponRowHeights;
	this.spriteRowHeights[1] = this.enemyRowHeights;
	this.spriteRowHeights[2] = this.powerUpRowHeights;
	
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
	
	var wFrames = this.calculateFrames(weapons, 0);
	Level.prototype.setWeaponFrames(wFrames);
	
	var eFrames = this.calculateFrames(enemies, 1);
	Level.prototype.setEnemyFrames(eFrames);
	
	var pFrames = this.calculateFrames(powerUps, 2);
	Level.prototype.setPowerUpFrames(pFrames);

	Level.prototype.setPathData(pathData);
	
	return this.level;
}

// Berechne alle Frames anhand der gesammelten Daten
LevelManager.prototype.calculateFrames = function(data, s, h) {

	var arr = [];
	for(i in data) {
		var attribs = data[i];
		
		var frames = attribs['frames'];
		var width = parseInt(attribs['width']);
		var height = parseInt(attribs['height']);
		var row = parseInt(attribs['row']);
		var y = (h == undefined) ? this.spriteRowHeights[s][row-1] : h * (row-1);
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