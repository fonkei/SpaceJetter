/**
/**
 * Preroll
 *
 * Lade Bilder fur die Vorschau und zeige diese mit einem Uebergang an.
 * Es konnen beliebig viele Bilder eingeblendet werden.
 */
function Preroll()
{
    this.prerollImgPaths;
    this.prerollImg;
    this.displayDuration;
    this.fadeDuration;
    this.target;
    this.width;
    this.height;
}

// Initialisiere den Preroll
Preroll.prototype.init = function(prerollImgPaths, displayDuration, fadeDuration, target) {
    this.prerollImgPaths = prerollImgPaths;
    this.displayDuration = displayDuration;
	this.fadeDuration = fadeDuration;
    this.target = target;
	
	// Breite und Hoehe
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
	// Blende das Menue vorerst aus
    this.target.style.opacity = "0.0";
	
	// Blende die Bilder ein
	this.showPrerollImages();
}

// Rekursives Einblenden der Bilder
Preroll.prototype.showPrerollImages = function() {

	// Blende jedes Vorschaubild ein
    if (this.prerollImgPaths.length > 0)
    {
		// Lade das Bild und entferne den Pfad aus Array
		this.prerollImg = this.getImage(this.prerollImgPaths[0]);
		this.prerollImgPaths.splice(0, 1);
	
        // platziere das Bild mittig auf dem Bildschirm
        this.prerollImg.style.position = "absolute";
        this.prerollImg.style.left = (this.width / 2 - this.prerollImg.width / 2) + "px";
        this.prerollImg.style.top = (this.height / 2 - this.prerollImg.height / 2) + "px";
        
		document.body.appendChild(this.prerollImg);
        
		// Blende das Bild langsam mit JQuery ein
        $(this.prerollImg).css("opacity", "0.0");
        
		var that = this;
        
		$(this.prerollImg).animate({opacity: 1.0}, this.fadeDuration).
			delay(this.displayDuration).animate({opacity: 0.0}, this.fadeDuration, function()
            {
				that.showPrerollImages()
            });
    }
    // Zeige das nachfolgende Ziel an 
    else {
        $(this.target).animate({opacity: 1.0}, this.fadeDuration);
	}
}

// Erstelle das Bild mit dem uebergebenen Pfad
Preroll.prototype.getImage = function(path) {
	img = new Image();
	img.src = path;
	return img;
}

/*
function progress() {
	var pwidget = document.getElementById("pwidget");
	pwidget.style.visibility = "visible";

	if(actualprogress >= maxprogress) {
		clearInterval(itv);   	
		return;
	}	
	
	var progressnum = document.getElementById("progressnum");
	var indicator = document.getElementById("indicator");
	
	
	actualprogress += 1;	
	
	indicator.style.width = actualprogress + "px";
	progressnum.innerHTML = actualprogress;
	
	if(actualprogress == maxprogress) {
		clearInterval(itv); 
	}
}
*/