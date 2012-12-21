// Initialisation beim Start
window.addEventListener("load", function() {
	// Hole das Canvas Element
	myCanvas = document.getElementById('gameCanvas');
	var myStatusBar = document.getElementById('statusbar');
	
	if (!myCanvas || !myCanvas.getContext || !myStatusBar || !myStatusBar.getContext) {
		return;
	}
	
	// Hole das Canvas 2d Context
	ctx = myCanvas.getContext('2d');
	sctx = myStatusBar.getContext('2d');
	
	// Initialisiere das Spiel
	//playBackgroundMusic();
	
	myCanvas.style.opacity = 1;
	myStatusBar.style.opacity = 1;
	
	width = myCanvas.width;
	height = myCanvas.height;
	SBWidth = myStatusBar.width;
	SBHeight = myStatusBar.height;	
	
	// Level Manager
	lvlMngr = new LevelManager();
	lvlMngr.init("js/levels.xml");
	
	// Image Manager
	imgMngr =  new ImageManager();
	imgMngr.load({
		"spriteSheet"			: "./pics/spriteSheets/spriteSheet.png",
		"bgSheet"				: "./pics/spriteSheets/ParallaxStars2.png",
		"explosionSprite"		: "./pics/spriteSheets/explosionSprite.png",
		"windArrow"		 		: "./pics/up_arrow_small.png"
	}, onDone);
	
	buildLevelSelection();
	
	sound= new Sound();

}, false);

function onDone() {
	spriteSheet 	= imgMngr.get("spriteSheet");
	explosionSheet = imgMngr.get("explosionSprite");
	
	bgSheet 		= imgMngr.get("bgSheet");
	windArrow 		= imgMngr.get("windArrow");
	
	/*var bgFrames = [
				[0, 0, 480, 1300, 0, 0],
				[481, 0, 480, 1300, 0, 0],
				[962, 0, 480, 1300, 0, 0]
			];*/
			
	var bgFrames = [
				[0, 0, 600, 1680, 0, 0],
			];
	
	backgroundSprite = new SpriteSheet(bgSheet, bgFrames, 1);

	
	var spaceshipFrames = [
				[0, 0, 128, 100, 0, 0],
				[129, 0, 128, 100, 0, 0],
				[258, 0, 128, 100, 0, 0],
				[387, 0, 12, 12, 0, 0]
			];
	
	spaceshipSprite = new SpriteSheet(spriteSheet, spaceshipFrames);
	
	
	var explosions = new Array();
	var wh = '64';
	var frames = new Array('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15');
	
	for(var i=0; i<6; i++){
		explosions['exp'+i] = {'width' : wh, 'height' : wh, 'frames' : frames, 'row' : ""+(i+1)+""};
	}
	
	//console.log(explosions);
	
	var explosionFrames = lvlMngr.calculateFrames(explosions, 64);

	//console.log(explosionFrames);
	for(e in explosionFrames) {
		explosionSprite[e] = new SpriteSheet(explosionSheet, explosionFrames[e]);
	}
	console.log(explosionSprite);
}

// Event zum starten des Spieles
$(document).ready(function(){
	$("#level1").click(function() {
		startNewGame(1);
	});
	$("#level2").click(function() {
		startNewGame(2);
	});
	$("#level3").click(function() {
		startNewGame(3);
	});
	$("#backBtn").click(function() {
		if(isStarted == true)
			pauseGame();
	});
	$("#soundBtn").click(function() {
		if(!soundOn) {
			$(this).css('background-image', 'url(css/images/Mute.png)');
		}
		else {
			$(this).css('background-image', 'url(css/images/Sound2.png)');
		}
		mute();
	});
	
	$("#pauseBtn").click(function() {
		if(gamePaused) {
			$(this).css('background-image', 'url(css/images/Pause2.png)');
		}
		else {
			$(this).css('background-image', 'url(css/images/Play2.png)');
		}
		pauseGame();
	});
});


// Spiele Hintergrundmusik ab
function playBackgroundMusic() {
	var audio = document.createElement('audio');
	audio.addEventListener("canplay", function () { audio.play(); }, false);
	audio.loop = true;
	audio.volume = 0.5;
	audio.src = "audio/backgroundMusic.mp3";
}

// starte ein neues Spiel
function startNewGame(lvl) {
	clearLevel();
	
	// Erstelle Raumschiff
	spaceship = new Spaceship(spaceshipXPosition, spaceshipYPosition, spaceshipHorSpeed, spaceshipVertSpeed, spaceshipFrame);
	spaceship.setSprite(spaceshipSprite);
	spaceship.setFrame(0);
	
	// Events
	document.addEventListener("mousemove", moveBalloon, false);
	document.addEventListener("mousedown", onMouseClick, false);
	document.addEventListener("keydown", keyDown, false);
	document.addEventListener("keyup", keyUp, false);
	
	level = lvlMngr.loadLevel(lvl-1);
	updateLevel(level);
	
	sound.levelsound.play();
	startGame();
}

function clearLevel() {
	stopGame();

	if(spaceship != null && spaceship != undefined) {
		delete spaceship;
	}
	
	objects = [];
	bullets = [];
	
	enemyCounter = 0;
	pathCounter = 0;
	
	lvlSpeed = 0;
	bgHeight = 0;
	lvlScore = 0;
	
	this.rocketPowerUp = false;
	this.laserPowerUp = false;
	this.shieldPowerUp = false;
	
	hasFocus = true;
	isStarted = false;
}

function startGame() {
	if(hasFocus && !isStarted) {
		isStarted = true;
		
		gameHandle = setInterval(draw, 50);
		powerUpHandle = setInterval(createPowerUp, 15000);
		enemyHandle = setInterval(createEnemy, 1000);
	}
}

function stopGame() {
	if(isStarted) {
		isStarted = false;
	
		clearInterval(gameHandle);
		clearInterval(powerUpHandle);
		clearInterval(enemyHandle);
	
		gameHandle = 0;
		powerUpHandle = 0;
		enemyHandle = 0;
		
		sound.levelsound.pause();
	}
}

// Spiel pausieren oder wieder fortsetzen
function pauseGame() {
	if (!gamePaused) {
		stopGame();
		gamePaused = true;
	} else if (gamePaused) {
		startGame();
		gamePaused = false;
	}
}

// Spiel pausieren oder wieder fortsetzen
function mute() {
	if (!soundOn) {
		soundOn = true;
	} else {
		soundOn = false;
	}
}

function buildLevelSelection() {
	var lvlSelectionData = lvlMngr.getLevelSelectionData();

	var blocks = {0:'a', 1:'b', 2:'c', 3:'d', 4:'e'};
	var i = 1;
	for(l in lvlSelectionData) {
		var attribs = lvlSelectionData[l];

		var path = attribs['picture']
		var blockCount  = (i-1) % 5;
		
		if(path == null || path == undefined || path == "")
			path = "pics/nopic.png";
		else
			path = attribs['picture'];
			
		console.log(path);
		var cssObj = {'background-image' : 'url('+path+')',
					  'width' : '50px',
					  'height' : '50px'};
		
		$('.ui-grid-d').append('<div class="ui-block-'+blocks[blockCount]+'"><a id="level'+i+'" href="#main" data-role="button" data-theme="c" onclick="startNewGame('+i+')"/></div> ');
		$('#level'+i).css(cssObj);
		i++;
	}
}

