TalkBubble = function(game, parent) {
	Phaser.Group.call(this, game, parent, "talk_bubble");

	this.content = ['Yay!', "Let's learn\nalphabet!", 'My name is\nZebra.', "Let's play!"];
	this.contentPointer = 0;
	this.initContent();
	this.addBack();
	this.addText();
};

TalkBubble.prototype = Object.create(Phaser.Group.prototype);
TalkBubble.prototype.constructor = TalkBubble;

TalkBubble.prototype.initContent = function () {
	var keys = Object.keys(this.game.texts).filter(function (key) {
		return key.indexOf("zebra_") > -1 && key !== "zebra_0";
	});

	this.content = keys.map(function(key) {
		return this.game.texts[key];
	}, this);
};

TalkBubble.prototype.addBack = function () {
	this.back = this.game.add.image(0, 0, "main_menu", "TalkBubble0000", this);
	this.back.anchor.set(1, 0.33);
};

TalkBubble.prototype.addText = function () {
	var style = { font: "48px " + this.game.fontFamily, fill: "#206B8C", align: "center" };
	var content = this.game.texts['zebra_0'];
	this.text = this.game.add.text(0, 0, content, style, this);
	this.text.anchor.set(0.5, 0.5);
	this.text.x = this.back.left + 107;
	this.text.y = this.back.top + this.back.height * 0.5 - 2;
	this.text.lineSpacing = -10;
	this.text.fontSize = 35;
};

TalkBubble.prototype.updateContent = function () {
	var newContent = this.content[this.contentPointer++];
	if (this.contentPointer === this.content.length) {
		this.contentPointer = 0;
	}

	this.text.setText(newContent);
	if (this.text.width > 170) {
		var scale = 170 / this.text.width;
		this.text.scale.set(scale, scale);
	} else {
		this.text.scale.set(1, 1);
	}

	this.game.tweens.removeFrom(this.scale);
	this.game.tweens.removeFrom(this);
	this.scale.set(1, 1);
	this.angle = 0;
	this.game.add.tween(this.scale).from({ x: 0, y: 0 }, 700, Phaser.Easing.Back.Out, true);
	this.game.add.tween(this).from({ angle: -50 }, 700, Phaser.Easing.Back.Out, true);
};

module.exports = TalkBubble;