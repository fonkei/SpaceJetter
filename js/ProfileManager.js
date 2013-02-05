/**
 * 
 */
function ProfileManager()
{

}

// Initialisation
ProfileManager.prototype.init = function() {	
	this.loadProfile();
}


// Lade Profil
ProfileManager.prototype.loadProfile = function() {
	if(localStorage.getItem("currLevel") != undefined) 
		currLevel = localStorage.getItem("currLevel");
	else {
		localStorage.setItem("currLevel", 1);
		currLevel = localStorage.getItem("currLevel");
	}

	console.log("CurrLevel: ", currLevel);
}

ProfileManager.prototype.updateProfile = function() {
	if((currLevel + 1) <= maxLevel) {
		currLevel++;
		localStorage.setItem("currLevel", currLevel);
	}
	else {
		// TODO: Alle Level geschafft
	}
}

ProfileManager.prototype.resetProfile = function() {
	localStorage.clear();
	this.loadProfile();
}

