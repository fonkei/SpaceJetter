// Initialisation beim Start
window.addEventListener("load", function() {
	// Hole das Canvas Element
	myCanvas = document.getElementById('gameCanvas');
	var myStatusBar = document.getElementById('statusbar');
	
	if (!myCanvas || !myCanvas.getContext || !myStatusBar || !myStatusBar.getContext) {
		return;
	}

	// Events
	document.addEventListener("mousemove", moveBalloon, false);
	document.addEventListener("mousedown", onMouseClick, false);
	document.addEventListener("keydown", keyDown, false);
	document.addEventListener("keyup", keyUp, false);
	
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
		"windArrow"		 		: "./pics/up_arrow_small.png"
	}, onDone);
	
	spaceship = new Spaceship(spaceshipXPosition, spaceshipYPosition, spaceshipHorSpeed, spaceshipVertSpeed, spaceshipFrame);
	sound= new Sound();
	
	
}, false);

function onDone() {
	spriteSheet 	= imgMngr.get("spriteSheet");
	
	windArrow 		= imgMngr.get("windArrow");
	
	/*var bgFrames = [
				[0, 0, 1, 1, 0, 0],
			];
	
	backgroundSprite = new SpriteSheet(spriteSheet, bgFrames);*/

	
	var spaceshipFrames = [
				[0, 0, 128, 100, 0, 0],
				[129, 0, 128, 100, 0, 0],
				[258, 0, 128, 100, 0, 0],
				[387, 0, 12, 12, 0, 0]
			];
	
	spaceshipSprite = new SpriteSheet(spriteSheet, spaceshipFrames);
	
	
	spaceship.setFrame(0);
	
	/*var bulletFrames = [
				[0, 101, 10, 40, 0, 0]
			];
	
	bulletSprite = new SpriteSheet(spriteSheet, bulletFrames);*/
	
	/*var tankFrames = [
				[0, 1841, 42, 39, 0, 0],
				[43, 1841, 42, 39, 0, 0],
				[86, 1841, 42, 39, 0, 0],
				[129, 1841, 42, 39, 0, 0],
				[172, 1841, 42, 39, 0, 0]
			];
	
	tankSprite = new SpriteSheet(spriteSheet, tankFrames);*/
	
	/*var powerupFrames = [
				[0, 1920, 42, 60, 0, 0]
			];
	
	powerupSprite = new SpriteSheet(spriteSheet, powerupFrames);*/
	
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
	$("#playBtn").click(function() {
		//startGame();
	});
	$("#pauseBtn").click(function() {
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
	
	level = lvlMngr.loadLevel(lvl-1);
	updateLevel(level);
	sound.levelsound.play();
	startGame();
}

function clearLevel() {
	stopGame();

	spaceship.setFlightAttitude(0);
	spaceship.setTankStatus(420);
	
	objects = [];
	bullets = [];
	
	spaceship.setX(200);
	spaceship.setX(250);
	spaceship.setFrame(0);
	
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


