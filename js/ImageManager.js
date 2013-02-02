/*
*
*
*/


function ImageManager(placeholderDataUri) {
	this._ressources = {};
	
	if (placeholderDataUri) {
		this._placeholder = new Image();
		this._placeholder.src = placeholderDataUri;
	}
}

_p = ImageManager.prototype;

_p.loadImg = function(ressources, onDone, onProgress) {
	// The images queue
	var queue = [];
	
	for (var res in ressources) {
		queue.push({
			key: res,
			path: ressources[res]
		});
	}
	
	if (queue.length == 0) {
		onProgress && onProgress(0,0,null,null,true);
		onDone && onDone();
		return;
	}
	
	var itemCounter = {
		loaded: 0,
		total: queue.length
	};
	
	for (var i = 0; i < queue.length; i++) {
		this._loadImage(queue[i], itemCounter, onDone, onProgress);
	}
};

_p.updatePath = function(obj, path) {
	var self = this;
	self.load({obj : path}, null);
	return self.get(obj);
};

_p._loadImage = function(queueItem, itemCounter, onDone, onProgress) {
	var self = this;

	
	var img = new Image();

	img.onload = function() {
		self._ressources[queueItem.key] = img;
		self._onItemLoaded(queueItem, itemCounter, onDone, onProgress, true);
	};
	
	img.onerror = function() {
		self._ressources[queueItem.key] = self._placeholder ? self._placeholder : null;
		self._onItemLoaded(queueItem, itemCounter, onDone, onProgress, false);
	};
	
	img.src = queueItem.path;	

};

_p._onItemLoaded = function(queueItem, itemCounter, onDone, onProgress, success) {
	itemCounter.loaded++;
	onProgress && onProgress(itemCounter.loaded, itemCounter.total, queueItem.key, queueItem.path, success);
	
	if (itemCounter.loaded == itemCounter.total) {
		onDone && onDone();
	}
};


_p.get = function(key) {
	return this._ressources[key];
};

_p.getAll = function() {
	return this._ressources;
}

