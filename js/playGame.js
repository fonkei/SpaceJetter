
// Bewege den Ballon zur Mausposition (horizontal)
function moveBalloon(e) {
	spaceship.setX(e.clientX - myCanvas.offsetLeft - (spaceship.getWidth() / 2));
	spaceship.setY(e.clientY - myCanvas.offsetTop - (spaceship.getHeight() / 2));
}

// Tastenaktionen
function keyDown(e) {
	keys[e.which] = true;
	
	move();
}

function keyUp(e) {
	delete keys[e.which];
	spaceship.setFrame(0);
}

function move() {
	if (keys[LEFT_ARROW]) {
		spaceship.decX(20);
		spaceship.setFrame(1);
	}
	if (keys[RIGHT_ARROW]) {
		spaceship.incX(20);
		spaceship.setFrame(2);
	}
	if (keys[UP_ARROW]) {
		spaceship.decY(20);
		spaceship.decTankStatus(1);
		sound.ignite.play();
	}
	if (keys[DOWN_ARROW]) {
		spaceship.incY(20);
	}
	if (keys[P_KEY]) {
		pauseGame();
	}
	if (keys[SPACE_BAR]) {
		fireBullet();
	}
}

// Feuert eine Kugel ab
function fireBullet() {
	spaceship.shoot();
}

function onMouseClick(e) {
	e.stopPropagation();
	e.preventDefault();  // verhindern des Normalverhaltens des Browsers
	fireBullet();
}

//Erzeugt ein zufälliges Power Up
function createPowerUp() {
	for(p in powerupSprite) {
		switch(p) {
			case 'shield':
				var newpowerUp = new PUShield(powerupSprite['shield']);
				objects.push(newpowerUp);
				break;
			case 'rocket':
				var newpowerUp = new PURocket(powerupSprite['rocket']);
				objects.push(newpowerUp);
				break;
			case 'laser':
				var newpowerUp = new PULaser(powerupSprite['laser']);
				objects.push(newpowerUp);
				break;
		}
	}
}

//Erzeugt ein zufälliges Power Up
function createEnemy() {
	var paths = level.getPathData();
	//console.log(enemySprite['bug']);
	if(pathCounter in paths) {
		var path = paths[pathCounter];
		var number = parseInt(path['number']);
		var enemy = path['enemyId'];
			
		if(enemyCounter < number) {
			switch(enemy) {
				case 'bug':
					var newEnemy = new Bug(enemySprite['bug'], [path['path']]);
					objects.push(newEnemy);
					break;
				case 'asteroid':
					var newEnemy = new Asteroid(enemySprite['asteroid'], [path['path']]);
					objects.push(newEnemy);
					break;
			}
			enemyCounter++;
		}
		else {
			enemyCounter = 0;
			pathCounter++;
		}	
	}
	else {
		pathCounter = 0;
		enemyCounter = 0;
	}
	
}

// verringere Geschwindigkeit (beim Fallen)
function updateSpaceship() {
	// Flughoehe aktualisieren
	spaceship.incFlightAttitude(-spaceship.getVertSpeed());
	
	// Geschwindigkeit drosseln
	spaceship.derate();
		
	spaceship.checkBoundary();
	
	if(spaceship.checkAttitude())
		nextLevel();
}

// aktualisiere den Windpfeil
function updateWindArrow() {

	// Berechne Windgeschwindikeit
	var randSpeed = getRandom(-1, 1);
	
	if(windSpeed + randSpeed < maxWindStrenght && windSpeed + randSpeed > -maxWindStrenght)
		windSpeed += randSpeed;
	
	// Ermittle den Windpfeilwinkel
	degree = windSpeed * 10;
	
	// Position des Pfeils
	var posW = width / 2;
	var posH = 40 - 5 ;
	
	// Rotiere den Windpfeil um diesen Winkel an einer bestimmten Position
	rotateIt(sctx, windArrow, degree, posW, posH);
}


// Dreht ein Objekt entsprechend der Gradzahl an der gewuenschten Position
function rotateIt(objContext, objImg, lngPhi, posW, posH){
	var w = objImg.width;
	var h = objImg.height;
	
	var transW = posW - (w / 2);
	var transH = posH - (h / 2);	
	
	objContext.save();  
	
	objContext.translate(transW, transH);           	// Ursprung verschieben
	objContext.rotate(lngPhi*Math.PI/180);  			// Context drehen
	objContext.translate(-transW, -transH);         	// Ursprung verschieben
	
	objContext.drawImage(objImg, posW - w, posH - h);   // Bild zentriert zeichnen
	
	objContext.restore();
}

function updateStatusBar(){
	// aktualisiere Text
	drawText();

	// aktualisiere Windpfeil 
	updateWindArrow();
	
	// zeichne Tankstatus
	drawTankStatus();
}

function drawTankStatus() {
	// Position der Tankanzeige
	var posW = width - 50;
	var posH = 1;
	
	// Hole die richtige Tankanzeige, entsprechend dem aktuellen Status
	var frame = spaceship.getTankFrame();
	
	//tankSprite.drawFrame(sctx, frame, posW, posH);
}

// Lade naechstes Level
function nextLevel() {
	clearScene();
	clearLevel();
	
	level = lvlMngr.nextLevel();
	updateLevel(level);
	
	startGame();
}

function updateLevel(level) {
	maxLvlHeight = level.getLvlHeight();
	lvlSpeed = level.getLvlSpeed();
	maxWindStrenght = level.getMaxWindStrenght();
	bgFrame = level.getLevelNr();
	
	// Gegnersprite anlegen
	var enemyFrames = level.getEnemyFrames();
	for(e in enemyFrames) {
		enemySprite[e] = new SpriteSheet(spriteSheet, enemyFrames[e]);
	}
	
	// PowerUp-Sprite anlegen
	var powerUpFrames = level.getPowerUpFrames();
	for(p in powerUpFrames) {
		powerupSprite[p] = new SpriteSheet(spriteSheet, powerUpFrames[p]);
	}
	
	// Weapon-Sprite anlegen
	var weaponFrames = level.getWeaponFrames();
	for(w in weaponFrames) {
		weaponSprite[w] = new SpriteSheet(spriteSheet, weaponFrames[w]);
	}
}

// Dreht ein Objekt entsprechend der Gradzahl (jQuery)
function rotate($object, degree) {
	// For All Browsers
    $object.css({ 
	'-webkit-transform' : 'rotate('+degree+'deg)',
       '-moz-transform' : 'rotate('+degree+'deg)',  
        '-ms-transform' : 'rotate('+degree+'deg)',  
         '-o-transform' : 'rotate('+degree+'deg)',  
            'transform' : 'rotate('+degree+'deg)',  
                 'zoom' : 1});
}

// Erstellt eine zufaellige Zahl in einem bestimmten Bereich 
function getRandom(a, b) {
	var z = Math.random();
	z *= (b - a + 1);
	z += a;
	return (Math.floor(z));
}

function updateBackground() {
	var yPos = 1300 - height;
	yPos -= lvlHeight;
	//backgroundSprite.drawFrame(ctx, bgFrame, 0, -yPos);
	lvlHeight += lvlSpeed;
}

function clearScene() {	
	ctx.clearRect(0,0, width, height);
	sctx.clearRect(0,0, width, 40);
}

function checkFocus() {
	$(window).bind('blur', function(){
        hasFocus = false;
    });

    $(window).bind('focus', function(){
        hasFocus = true;
    });
    // IE EVENTS
    $(document).bind('focusout', function(){
        hasFocus = false;
    });

    $(document).bind('focusin', function(){
        hasFocus = true;
    });
	
	if(hasFocus)
		startGame();
	else
		pauseGame();
		
	//console.log("hasFocus: " + hasFocus + " isStarted: " + isStarted);
}

//===========================================================
// Zeichenfunktionen
//===========================================================

// Zeichnet alles (Diese Funktion wird jede 50 ms wiederholt)
function draw() {
	checkFocus();
		
	drawScene();
	drawSpaceship();
	drawObjects();
}

// Zeichnet alle Hintergrundteile der Szene 
function drawScene() {
	// loeschen des Inhaltes vom Canvas-Elements
	clearScene();
	
	// Zeichnen des Himmels als ein linearer Gradient
	sky = ctx.createLinearGradient(0, width, 0, height);
	//sky.addColorStop(Math.random(), SKY_COLOR);
	sky.addColorStop(1, SKY_COLOR);
	sky.addColorStop(1, '#FFFFFF');
	ctx.fillStyle = sky;
	ctx.fillRect(0, 0, width, height);
	
	// Hintergrundbild zeichnen
	updateBackground();
	
	// aktualisiere StatusBar
	updateStatusBar();
}

// Zeichnet den Ballon an seiner aktuellen Position
function drawSpaceship() {
	// Zeichne den Ballon
	updateSpaceship();
	
	spaceshipSprite.drawFrame(ctx, spaceship.getFrame(), spaceship.getX(), spaceship.getY());
}

function drawText() {
	// Flughoehe
	sctx.fillStyle = "white";
    sctx.font = "Bold 16px Sans-Serif";
	sctx.fillText(lvlScore, 10, 20);
}

function drawObjects() {
	for (var i = 0; i < objects.length; i++) {
		// bewege Objekt
		objects[i].fly();
		
		spaceship.checkCollisions(objects[i]);
		spaceship.checkHit(objects[i]);
	
		// Zeichne Objekt
		var sprite = objects[i].getSprite();
		sprite.drawFrame(ctx, objects[i].getFrame(), objects[i].getX(), objects[i].getY());
		
		if (objects[i].defunct == true || objects[i].getX() > (width + 100) || (objects[i].getX() + objects[i].getWidth()) < -100 || objects[i].getY() > height ) {
			delete objects[i];
			objects.splice(i, 1);
			i--;
		}
	}
	
	for (var b = 0; b < bullets.length; b++) {
		bullets[b].fly();
			
		// Zeichne Objekt
		var sprite = bullets[b].getSprite();
		sprite.drawFrame(ctx, bullets[b].getFrame(), bullets[b].getX(), bullets[b].getY());
		
		if (bullets[b].defunct == true || bullets[b].getX() > width || bullets[b].getX() < 0 || bullets[b].getY() < 0 || bullets[b].getY() > height ) {
			delete bullets[b];
			bullets.splice(b, 1);
			i--;
		}
	}
	
	//console.log(bullets.length + " " + objects.length);
}
