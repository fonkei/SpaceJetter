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
		storedLevel = localStorage.getItem("currLevel");
	else {
		localStorage.setItem("currLevel", 1);
		storedLevel = localStorage.getItem("currLevel");
	}
}

ProfileManager.prototype.updateProfile = function() {
	currLevel++;
	localStorage.setItem("currLevel", currLevel);
}

ProfileManager.prototype.resetProfile = function() {
	localStorage.clear();
}

