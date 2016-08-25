SimpleButton = function(game, x, y, key, frame) {
	Phaser.Image.call(this, game, x, y, key, frame);

	this.callbackDelay = 0;
	this.enabled = true;
	this.disableInput = false;
	this.userData = {};
	this._callback = new Phaser.Signal();
	this.anchor.set(0.5, 0.5);

	this.inputEnabled = true;
	this.events.onInputDown.add(this.onInputDown, this);
	this.events.onInputUp.add(this.onInputUp, this);
	if (this.game.device.desktop) {
		this.input.useHandCursor = true;
	}
};

SimpleButton.prototype = Object.create(Phaser.Image.prototype);
SimpleButton.prototype.constructor = SimpleButton;

SimpleButton.prototype.onInputDown = function () {
	if (this.disableInput) {
		return;
	}

	if (this.game.device.webAudio) {
		this.game.sound.play("tap");
	}

	this.game.add.tween(this.scale).to({ x: 0.9, y: 0.9 }, 50, Phaser.Easing.Cubic.Out, true);
};

SimpleButton.prototype.onInputUp = function () {
	if (this.disableInput) {
		return;
	}

	this.game.tweens.removeFrom(this.scale);
	this.game.add.tween(this.scale).to({ x: 1, y: 1 }, 150, Phaser.Easing.Cubic.Out, true)
		.onComplete.addOnce(this.onInputUpComplete, this);
};

SimpleButton.prototype.onInputUpComplete = function () {
	if (this.callbackDelay > 0) {
		this.game.time.events.add(this.callbackDelay, this._callback.dispatch, this._callback, this);
	} else {
		this._callback.dispatch(this);
	}
};

SimpleButton.prototype.setCallbackDelay = function (delay) {
	this.callbackDelay = delay;
};

SimpleButton.prototype.enable = function () {
	if (this.enabled === false) {
		this.enabled = true;
		this.input.enabled = true;
	}
};

SimpleButton.prototype.disable = function () {
	if (this.enabled) {
		this.enabled = false;
		this.input.enabled = false;
	}
};

SimpleButton.prototype.destroy = function () {
	Phaser.Image.prototype.destroy.call(this);

	this._callback.dispose();
	this._callback = null;
};

Object.defineProperty(SimpleButton.prototype, "callback", {
	get: function () {
		return this._callback;
	}
});

module.exports = SimpleButton;