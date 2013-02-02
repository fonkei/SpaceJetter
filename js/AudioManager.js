
function AudioManager() {
	this.load_queue = [];
	this.loading_sounds = 0;
	this.sounds = {};
	this.fileExtension = null;
	this.channels = null;
	this.init();
}

_p = AudioManager.prototype;

_p.init = function () {
	var tempAudio = new Audio();
    this.fileExtension = tempAudio.canPlayType('audio/ogg; codecs="vorbis"')? ".ogg" : ".wav";
	delete tempAudio;
	
	var channel_max = 10;
	this.channels = new Array();
	for (a = 0; a < channel_max; a++) {
		this.channels[a] = new Audio();
		this.channels[a].timeFinished = -1;
	}
}

_p.loadSnd = function (files, callback) {
	var self = this;
	var audioCallback = function (evt) {
			self._loadFinished(callback);
			evt.target.removeEventListener('canplaythrough', audioCallback, false);
			evt.target.removeEventListener('load', audioCallback, false);
			evt.target.removeEventListener('error', audioCallback, false);
		}
		var numLoaded = 0;
		this.loading_sounds = 0;
		if (!navigator.userAgent.match(/like Mac OS X/i)) // iOS browsers don't do any Audio without user interaction
			for (name in files) {
				if (this.sounds[name])
					continue;
				++numLoaded;
				this.loading_sounds++;
				var snd = new Audio();
				snd.timeFinished = -1;
				var filename = files[name] + this.fileExtension;
				this.sounds[name] = snd;
				snd.addEventListener('canplaythrough', audioCallback, false);
				snd.addEventListener('load', audioCallback, false);
				snd.addEventListener('error', audioCallback, false);
				snd.src = filename;
				snd.volume = 0.5;
				snd.load();
			}
		// No sounds to load? Fire callback directly
		if (numLoaded == 0)
		{
			callback();
		}
};

_p.setRepeat = function(s) {
	audio = this.sounds[s];
	if(!audio)
		return;
	audio.addEventListener('ended', function () {
		// Wait 500 milliseconds before next loop
		setTimeout(function () { audio.play(); }, 0);
	}, false);
}

_p.setVolume = function(s, val) {
	audio = this.sounds[s];
	if(!audio)
		return;
	audio.volume = val;
}

_p._loadFinished = function(callback) {
	this.loading_sounds--;
	if (this.loading_sounds == 0) {
		callback();
	}
};

_p.play = function (s) {
	ss = this.sounds[s];
	if (!ss)
		return;
	// First try playing the original sound to avoid lag on some browsers
	var thistime = new Date().getTime();
	if (ss.timeFinished < thistime) {
		ss.timeFinished = thistime + ss.duration * 1000;
		ss.play();
	} else {
		// Failing that, load a copy of that sound in a channel and play it
		for (a = 0; a < this.channels.length; a++) {
			var c = this.channels[a];
			if (c.timeFinished < thistime) {
				c.timeFinished = thistime + ss.duration * 1000;
				c.src = ss.src;
				c.load();
				c.play();
				break;
			}
		}
	}
};
