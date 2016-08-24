LettersConfig = function(game) {
	this.game = game;

	this._config = null;
	this._keys = null;
};

LettersConfig.prototype.init = function() {
	this._config = this.game.cache.getJSON("letters");
	this._keys = Object.keys(this._config).sort();
};

LettersConfig.prototype.getLetterConfig = function(letter) {
	return this._config[letter];
};

LettersConfig.prototype.getNextLetter = function(letter) {
	var letter = letter ? letter : this.currentLetter;
	var index = this._keys.indexOf(letter);

	return this._keys[index + 1];
};

LettersConfig.prototype.getPrevLetter = function(letter) {
	var letter = letter ? letter : this.currentLetter;
	var index = this._keys.indexOf(letter);

	return this._keys[index - 1];
};

Object.defineProperty(LettersConfig.prototype, "config", {
	get: function () {
		return this._config;
	}
});

Object.defineProperty(LettersConfig.prototype, "keys", {
	get: function () {
		return this._keys;
	}
});

module.exports = LettersConfig;