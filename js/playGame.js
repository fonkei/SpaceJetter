
// Bewege das Raumschiff zur Mausposition (horizontal)
function moveSpaceship(e) {
	e.preventDefault();
	
	if(!spaceship.isShot && !spaceship.levelDone) {
		if(e.touches != undefined) {
			e = e.touches[0];
			gbMove = true;
		}
			
		mouseX = (e.pageX - myCanvas.offsetLeft);
		mouseY = (e.pageY - myCanvas.offsetTop);
		
		mouseX = (mouseX / scale)  - (spaceship.getWidth() / 2);
		mouseY = (mouseY / scale)  - (spaceship.getHeight() / 2);

		spaceship.setX(mouseX);
		spaceship.setY(mouseY);
		
		//console.log(spaceship.getX(), spaceship.getY(), mouseX, mouseY, spaceship.getWidth(), spaceship.getHeight());
	}
}

// Tastenaktionen
function keyDown(e) {
	keys[e.which] = true;
	if(!spaceship.isShot && isStarted) {
		move();
	}
}

function keyUp(e) {
	delete keys[e.which];
	spaceship.setFrame(5);
}

function move() {
	if (keys[LEFT_ARROW]) {
		spaceship.decX(20);
		spaceship.setFrame(0);
	}
	if (keys[RIGHT_ARROW]) {
		spaceship.incX(20);
		spaceship.setFrame(10);
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
	if(!spaceship.isShot && isStarted) 
		spaceship.shoot();	
}

function onMouseClick(e) {
	e.stopPropagation();
	e.preventDefault();  // verhindern des Normalverhaltens des Browsers
	
	fireBullet();
	
}

function onTouchStart(e) {
	gnStartTime = Number(new Date());
	setTimeout('checkTapHold(' + gnStartTime + ');clearTimeout();',2000);
}

function onTouchEnd(e) {
	gbStillTouching = false;
}

function checkTapHold(nID) {
	if ((!gbMove) && (gbStillTouching) && (gnStartTime == nID)) {
		gnStartTime = 0;
		gbMove = false; 
		if(!spaceship.isShot) {
			fireBullet();
		}
	}
}

//Erzeugt ein zufälliges Power Up
function createPowerUp(xPos, yPos) {
	if(powerUpCount >= 5) {
		var rand = getRandom(0, 2);

		switch(rand) {
			case 0:
				objects.push(new PUShield(powerupSprite['shield'], xPos, yPos));
				break;
			case 1:
				objects.push(new PURocket(powerupSprite['rocket'], xPos, yPos));
				break;
			case 2:
				objects.push(new PULaser(powerupSprite['laser'], xPos, yPos));
				break;
		}
		powerUpCount = 0;
	}
	else
		objects.push(new Sphere(powerupSprite['sphere'], xPos, yPos));


	/*for(p in powerupSprite) {
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
	}*/
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
				case 'packman':
					var newEnemy = new Packman(enemySprite['packman'], [path['path']]);
					objects.push(newEnemy);
					break;
				case 'cubic':
					var newEnemy = new Cubic(enemySprite['cubic'], [path['path']]);
					objects.push(newEnemy);
					break;
				case 'asteroid':
					var newEnemy = new Asteroid(enemySprite['asteroid'], [path['path']]);
					objects.push(newEnemy);
					break;
				case 'raider':
					var newEnemy = new Raider(enemySprite['raider'], [path['path']]);
					console.log("Raider");
					objects.push(newEnemy);
					break;
				case 'hawk':
					var newEnemy = new Hawk(enemySprite['hawk'], [path['path']]);
					console.log("Hawk");
					objects.push(newEnemy);
					break;
				default:
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
		//pathCounter = 0;
		enemyCounter = 0;
	}
	
}

// verringere Geschwindigkeit (beim Fallen)
function updateSpaceship() {
	// pruefe ob Raumschiff getroffen
	if(!spaceship.levelDone)
		spaceship.checkIsHit();
	
	if(!spaceship.isShot) {
		// Berechne die Neigung des Raumschiffs anhand Mausposition
		var currX = spaceship.getX();
		var diff = Math.round((lastX - currX) / 10);
		var frame = 5;
		
		if(diff > 0){			// nach rechts
			if(diff > 5)
				diff = 5;

			frame -= diff;
		}
		else if(diff < 0) {		// nach links
			if(diff < -5)
				diff = -5;
				
			frame += Math.abs(diff); 
		}

		spaceship.setFrame(frame);

		lastX = spaceship.getX();
	}
	
	ctx.strokeStyle = "#fc0";        // Linienstil
    ctx.strokeRect(spaceship.getX(), spaceship.getY(), spaceship.getWidth(), spaceship.getHeight());  // Ungefülltes Rechteck
	
	// pruefe Begrenzungen
	if(!spaceship.levelDone)
		spaceship.checkBoundary();
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
	
	// pruefe eingesammelte PowerUps
	var i = 1;
	for(pwu in powerUps) {
		var object = powerUps[pwu];
		var oWidth = object.getWidth();
		var sprite = object.getSprite();
		sprite.drawFrame(sctx, object.getFrame(), width - i*oWidth, 5);
		i++;
	}
}

// Lade naechstes Level
function nextLevel() {
	clearScene();
	
	lvlMngr.nextLevel();
	
	prflMngr.updateProfile();
	updateLevel(storedLevel);

	startNewGame(storedLevel);
}

// Aktualliesiere Daten des Levels 
function updateLevel(level) {
	maxLvlHeight = level.getLvlHeight();
	lvlSpeed = level.getLvlSpeed();
	maxWindStrenght = level.getMaxWindStrenght();
	SKY_COLOR = level.getColor();
	bgFrame = 0;//level.getLevelNr();
	
	// Gegnersprite anlegen
	var enemyFrames = level.getEnemyFrames();
	for(e in enemyFrames) {
		enemySprite[e] = new SpriteSheet(enemySheet, enemyFrames[e]);
	}
	
	// PowerUp-Sprite anlegen
	var powerUpFrames = level.getPowerUpFrames();
	for(p in powerUpFrames) {
		powerupSprite[p] = new SpriteSheet(powerUpSheet, powerUpFrames[p]);
	}
	
	// Weapon-Sprite anlegen
	var weaponFrames = level.getWeaponFrames();
	for(w in weaponFrames) {
		weaponSprite[w] = new SpriteSheet(weaponSheet, weaponFrames[w]);
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
	var yPos = -(backgroundSprite.getHeight(0)) + height;
	yPos += bgHeight;

	if((bgHeight + height) >= backgroundSprite.getHeight(0))
		bgHeight = 0;

	var x = 0;
	if(shock) {
		backgroundSprite.drawFrame(ctx, bgFrame, 3, yPos);	
		shock = false;
	}
	backgroundSprite.drawFrame(ctx, bgFrame, 0, yPos);	
	
	bgHeight += lvlSpeed;
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
	
	if(hasFocus) {
		startGame();
		$('.pause').css('background-image', 'url(css/images/Pause2.png)');
	}
	else {
		pauseGame();
		$('.pause').css('background-image', 'url(css/images/Play2.png)');
	}
		
	//console.log("hasFocus: " + hasFocus + " isStarted: " + isStarted);
}

function levelDone() {
		$('.successlvlScore').text(lvlScore);
		$.mobile.changePage('#successDialog', 'pop', true, true);
		console.log(" 1 "+lvlScore);
		// Sphere Zaehler
		 $(function () {
	     	var collection = new Array();
	     	collection.length = sphereCount;
	     	var counter = 0;
	     	$(collection).each(function () {
	        	$('.countText').animate({ opacity: "1" }, 100, function () {
	           		counter++;
	           		lvlScore += 100;
	           		$('.countText').text(counter);
	           		$('.totalText').text(lvlScore);
	       			console.log(lvlScore);
	        	});
	      	});
	   	});
}

function gameOver() {
		stopGame();
		$.mobile.changePage('#gameOverDialog', 'pop', true, true);
		$('.gameOverlvlScore').text(lvlScore);
}

//===========================================================
// Zeichenfunktionen
//===========================================================

// Zeichnet alles (Diese Funktion wird jede 50 ms wiederholt)
function draw() {
	checkFocus();
		
	drawScene();
	
	if(!spaceship.defunct)
		drawSpaceship();
	
	drawObjects();
}

// Zeichnet alle Hintergrundteile der Szene 
function drawScene() {
	// loeschen des Inhaltes vom Canvas-Elements
	clearScene();

	// Zeichnen des Himmels
	ctx.fillStyle = SKY_COLOR;
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

	var sprite = spaceship.getSprite(); 
	sprite.drawFrame(ctx, spaceship.getFrame(), spaceship.getX(), spaceship.getY());
}

function drawText() {
	// Flughoehe
	sctx.fillStyle = "white";
    sctx.font = "Bold 16px Arial";
	sctx.fillText(lvlScore, 10, 20);
}

function drawObjects() {
	for (var i = 0; i < objects.length; i++) {
		// bewege Objekt
		objects[i].fly();
		
		if(!spaceship.levelDone) {
			spaceship.checkCollisions(objects[i]);
			spaceship.checkHit(objects[i]);
		}
		else {
			spaceship.levelDoneSequence();
		}
			
		// Zeichne Objekt
		var sprite = objects[i].getSprite();
		sprite.drawFrame(ctx, objects[i].getFrame(), objects[i].getX(), objects[i].getY());
		
		if (objects[i].defunct == true || objects[i].getX() > (width + 100) || (objects[i].getX() + objects[i].getWidth()) < -100 || objects[i].getY() > height + 100 ) {
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
