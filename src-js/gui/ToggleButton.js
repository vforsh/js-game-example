var SimpleButton = require('./SimpleButton.js');

ToggleButton = function(game, x, y, spritesheet, key1, key2) {
	SimpleButton.call(this, game, x, y, spritesheet, key1);

	this.spriteSheet = spritesheet;
	this.textureKey1 = key1;
	this.textureKey2 = key2;
	this.activeTextureKey = this.textureKey1;
	this._state = 1;
	this.events.onInputUp.add(this.switchTextures, this, 2);
};

ToggleButton.prototype = Object.create(SimpleButton.prototype);
ToggleButton.prototype.constructor = ToggleButton;

ToggleButton.prototype.switchTextures = function () {
	this.activeTextureKey = (this.activeTextureKey === this.textureKey1)
		? this.textureKey2
		: this.textureKey1;

	this.frameName = this.activeTextureKey;
	this._state = (this.activeTextureKey === this.textureKey1) ? 1 : 2;
};

Object.defineProperty(ToggleButton.prototype, "state", {
	get: function () {
		return this._state;
	}
});

module.exports = ToggleButton;