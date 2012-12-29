// Initialisation beim Start
window.addEventListener("load", function() {
	// Hole das Canvas Element
	myCanvas = document.getElementById('gameCanvas');
	myStatusBar = document.getElementById('statusbar');
	myFooter = document.getElementById('foot');
	
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
	
	RATIO = width / height; 
	
	currentWidth = width;
	currentHeight = height;
	currStatusHeight = 40;
	
	myCanvas.width = width;
	myCanvas.height = height;
	SBWidth = myStatusBar.width = width;
	SBHeight = myStatusBar.height;	
	
	// Profil Manager
	prflMngr = new ProfileManager();
	prflMngr.init();
	
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
				[0, 0, 67, 110, 0, 0],
				[67, 0, 67, 110, 0, 0],
				[135, 0, 67, 110, 0, 0],
				[201, 0, 67, 110, 0, 0],
				[268, 0, 67, 110, 0, 0],
				[335, 0, 67, 110, 0, 0],
				[402, 0, 67, 110, 0, 0],
				[469, 0, 67, 110, 0, 0],
				[536, 0, 67, 110, 0, 0],
				[603, 0, 67, 110, 0, 0],
				[670, 0, 67, 110, 0, 0],
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
	$("#backBtn").click(function() {
		if(isStarted == true)
			pauseGame();
	});
	
	$("#clearProfileBtn").click(function() {
		prflMngr.resetProfile();
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
	
	$("#levelBtn").click(function() {
		buildLevelSelection();
		stopGame();
	});
	
	$("#reloadBtn").click(function() {
		startNewGame(currLevel);
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
	spaceship.setFrame(5);
	
	// Events
	document.addEventListener("mousemove", moveSpaceship, false);
	document.addEventListener("mousedown", onMouseClick, false);
	document.addEventListener("keydown", keyDown, false);
	document.addEventListener("keyup", keyUp, false);
	document.addEventListener("touchmove", moveSpaceship, false);
	document.addEventListener("touchstart", onTouchStart, false);
	document.addEventListener("touchend", onTouchEnd, false);
	window.addEventListener("resize", resize, false);
	
	resize();
	currLevel = lvl;
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
		
		if(i <= storedLevel) {
			$('.ui-grid-d').append('<div class="ui-block-'+blocks[blockCount]+'"><a id="level'+i+'" href="#main" data-role="button" data-theme="c" onclick="startNewGame('+i+')"/></div> ');
		}	
		else {
			$('.ui-grid-d').append('<div class="ui-block-'+blocks[blockCount]+'"><a id="level'+i+'" href="#main" data-role="button" data-theme="c" class="ui-disabled"/></div> ');
		}
			
		$('#level'+i).css(cssObj);
		i++;
	}
}

function resize() {
	currentHeight = window.innerHeight * 0.87;
	currStatusHeight = window.innerHeight * 0.05;
	currFooterHeight = window.innerHeight * 0.08;
	
	// resize the width in proportion
	// to the new height
	currentWidth = currentHeight * RATIO;
	scale = currentWidth / width;
	
	
	//console.log(widthRatio,heightRatio, RATIO);
	// this will create some extra space on the
	// page, allowing us to scroll past
	// the address bar, thus hiding it.
	if (android || ios) {
		document.body.style.height = (window.innerHeight + 50) + 'px';
	}
	
	myCanvas.style.width = currentWidth + 'px';
	myCanvas.style.height = currentHeight + 'px';
	
	myStatusBar.style.width = currentWidth + 'px';
	myStatusBar.style.height = currStatusHeight + 'px';
	
	myFooter.style.width = currentWidth + 'px';
	myFooter.style.height = currFooterHeight + 'px';
	
	
	
	// a short delay
	window.setTimeout(function() {
		window.scrollTo(0,1);
	}, 1);
}


