LocalStorageWrapper = function() {
	this.localStorage = null;
	this._enabled = true;
	this.init();
};

LocalStorageWrapper.prototype.constructor = LocalStorageWrapper;

LocalStorageWrapper.prototype.init = function() {
	try {
		this.localStorage = window.localStorage;
		this.localStorage.setItem("testKey", "testData");
		this.localStorage.removeItem("testKey");
	} catch (e) {
		console.warn("localStorage isn't available! [" + e.toString() + "]");
		this._enabled = false;
	}
};

LocalStorageWrapper.prototype.saveValue = function(key, value) {
	if (this._enabled) {
		var dataToSave = JSON.stringify(value);
		if (_.isString(value) === false) {
			this.localStorage.setItem(key, value);
		} else {
			var dataToSave = JSON.stringify(value);
			this.localStorage.setItem(key, dataToSave);
		}
	} else {
		console.warn("Can't save value, LocalStorage isn't available!");
	}
};

LocalStorageWrapper.prototype.getValue = function(key) {
	return this.localStorage.getItem(key);
};

LocalStorageWrapper.prototype.remove = function(key) {
	if (this._enabled) {
		this.localStorage.removeItem(key);
	} else {
		console.warn("Can't remove value, LocalStorage isn't available!");
	}
};

LocalStorageWrapper.prototype.clear = function() {
	if (this._enabled) {
		this.localStorage.clear();
	}
};

Object.defineProperty(LocalStorageWrapper.prototype, "enabled", {
	get: function () {
		return this._enabled;
	}
});

module.exports = LocalStorageWrapper;