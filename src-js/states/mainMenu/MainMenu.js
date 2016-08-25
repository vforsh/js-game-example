var TalkBubble = require('./TalkBubble.js');
var SimpleButton = require('../../gui/SimpleButton.js');
var ToggleButton = require('../../gui/ToggleButton.js');
var Config = require('../../Config.js');

MainMenu = function () {
	this.titleClicks = 0;
	this.talkBubbleClicks = 0;
	this.fromPreloader = false;
};

MainMenu.prototype = Object.create(Phaser.State);

MainMenu.prototype.init = function (fromPreloader) {
	this.fromPreloader = fromPreloader;
	this.titleClicks = 0;
};

MainMenu.prototype.create = function() {
	this.addBackground();
	this.addLetters();
	this.addTitle();
	this.addZebra();
	this.addTalkBubble();
	this.addButtons();
	this.addCredits();
	this.resize();

	if (this.game.weakDevice === false) {
		this.initAnimation();
	}

	if (this.fromPreloader) {
		this.handleMusicOnStart();

		this.stage.disableVisibilityChange = false;

		this.game.onBlur.add(this.onFocusLost, this);
		this.game.onFocus.add(this.onFocus, this);
	}

	//this.game.analytics.sendPageview("main_menu");
};

MainMenu.prototype.handleMusicOnStart = function() {
	if (this.game.device.desktop) {
		this.soundButton.switchTextures();
		this.startMusic();
	} else {
		this.soundButton.input.enabled = false;
		this.soundButton.switchTextures();
		this.game.input.onDown.addOnce(this.startMusic, this);
	}
};

MainMenu.prototype.onFocusLost = function() {
	this.game.wasMuted = this.game.sound.mute;
	this.game.sound.mute = true;
};

MainMenu.prototype.onFocus = function() {
	if (this.game.wasMuted === false) {
		this.game.sound.mute = false;
	}
};

MainMenu.prototype.addBackground = function() {
	this.background = this.game.add.image(0, 0, "main_menu", "BG0000");
};

MainMenu.prototype.addLetters = function() {
	this.letters = this.game.add.image(0, 0, "main_menu", "Letters_BG0000");
	this.letters.anchor.set(0.5, 0.5);
	this.letters.x = Config.HALF_GAME_WIDTH;
};

MainMenu.prototype.addTitle = function() {
	this.title = this.add.image(0, 0, "main_menu", "Title0000");
	this.title.anchor.set(0.5, 0.5);
	this.title.x = Config.HALF_GAME_WIDTH - 0.5;
	this.title.y = Config.GAME_HEIGHT * 0.15;
	this.title.inputEnabled = true;
	this.title.events.onInputDown.add(function() {
		if (this.titleClicks++ > 5) {
			this.titleClicks = 0;
			this.game.add.tween(this.title).to({alpha: 0}, 300, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);

			this.game.storage.clear();

			window.alert("Saved data was cleared!");
		}
	}, this);
};

MainMenu.prototype.addZebra = function() {
	this.zebra = this.game.add.image(0, 0, "main_menu", "Zebra0000");
	this.zebra.anchor.set(0.5, 1);
	this.zebra.x = Config.GAME_WIDTH - 85;
	this.zebra.inputEnabled = true;
	this.zebra.events.onInputDown.add(this.onZebraClick, this);
};

MainMenu.prototype.onZebraClick = function() {
	//this.game.sound.play('pop_4', 0.5);
	this.tweens.removeFrom(this.zebra);
	this.zebra.y = Config.GAME_HEIGHT + 137;
	this.game.add.tween(this.zebra).to({y: '-40'}, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
	this.talkBubble.updateContent();
};

MainMenu.prototype.addTalkBubble = function() {
	this.talkBubble = new TalkBubble(this.game, this.world);
	this.talkBubble.position.x = this.zebra.left - 10;
};

MainMenu.prototype.onTalkBubbleClick = function() {
	this.talkBubbleClicks++;
	if (this.talkBubbleClicks === 5) {
		this.testKIM_API();
	}
};

MainMenu.prototype.addButtons = function() {
	this.soundButton = new ToggleButton(this.game, 0, 0, "main_menu", "Button_Sound_On0000", "Button_Sound_Off0000");
	this.soundButton.callback.add(function() {
		this.game.sound.mute = !this.game.sound.mute;
	}, this);

	this.soundButton.visible = _.isUndefined(this.game.KIM);
	if (this.game.sound.mute) {
		this.soundButton.switchTextures();
	}

	this.playButton = new SimpleButton(this.game, 0, 0, "main_menu", "Button_Play0000");
	this.playButton.setCallbackDelay(200);
	this.playButton.callback.addOnce(this.onPlayButtonClick, this);

	var imageKey = "Flag_" + this.game.language.toUpperCase() + "_Round0000";
	this.languageButton = new SimpleButton(this.game, 0, 0, "main_menu", imageKey);
	this.languageButton.x = Config.GAME_WIDTH - 60;
	this.languageButton.callback.addOnce(this.gotoLanguagesMenu, this);

	this.creditsButton = new SimpleButton(this.game, 0, 0, "main_menu", "Button_Credits0000");
	this.creditsButton.callback.add(this.toggleCredits, this);

	this.buttons = [this.soundButton, this.creditsButton, this.playButton, this.languageButton];
	this.buttons.forEach(function(button) {
		this.world.add(button);
	}, this);
};

MainMenu.prototype.onPlayButtonClick = function() {
	this.game.changeState("ChooseLevelMenu");
};

MainMenu.prototype.gotoLanguagesMenu = function() {
	this.game.changeState("LanguagesMenu");
};

MainMenu.prototype.addCredits = function() {
	this.credits = this.game.add.image(0, 0, "main_menu", "CreditsBoard0000");
	this.credits.position.set(Math.round((Config.GAME_WIDTH - this.credits.width) * 0.5), Math.round((Config.GAME_HEIGHT - this.credits.height) * 0.5));
	this.credits.visible = false;
};

MainMenu.prototype.toggleCredits = function() {
	if (this.credits.visible) {
		this.hideCredits();
	}
	else {
		this.showCredits();
	}
};

MainMenu.prototype.hideCredits = function() {
	this.game.add.tween(this.credits).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
	this.game.add.tween(this.credits).to({y: this.credits.y + 200}, 500, Phaser.Easing.Back.In, true)
		.onComplete.addOnce(function() {
			this.playButton.input.enabled = true;
			this.creditsButton.input.enabled = true;
			this.credits.visible = false;
		}, this);
};

MainMenu.prototype.showCredits = function() {
	this.credits.visible = true;
	this.credits.alpha = 0;
	this.credits.y = (Config.GAME_HEIGHT - this.credits.height) * 0.5 + 200;

	this.game.add.tween(this.credits).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
	this.game.add.tween(this.credits).to({y: this.credits.y - 200}, 500, Phaser.Easing.Back.Out, true);

	this.playButton.input.enabled = false;
	this.creditsButton.input.enabled = false;
	this.game.input.onDown.addOnce(function () {
		this.hideCredits();
	}, this);
};

MainMenu.prototype.startMusic = function() {
	if (this.game.mainMusicLoop) {
		this.game.mainMusicLoop.play();
	}

	this.soundButton.switchTextures();
	this.soundButton.input.enabled = true;
};

MainMenu.prototype.testKIM_API = function() {
	var style = {font: "30px " + this.game.fontFamily, fill: "#fff0000", align: "center"};
	var text = this.game.add.text(0, 0, "", style);
	text.anchor.set(0.5, 0.5);
	text.x = Config.HALF_GAME_WIDTH;
	text.y = Config.GAME_HEIGHT * 0.9;
	text.setShadow(0, 2, 0, 0, true, true);
	text.lineSpacing = -6;
	text.setText("\n\t\t\t\tKIM API: " + (_.isUndefined(this.game.KIM) === false) + "\n\t\t\t\t" + window.location.href + "\n\t\t\t");
};

MainMenu.prototype.initAnimation = function() {
	this.game.add.tween(this.letters.scale).from({x: 1.5, y: 1.5}, 600, Phaser.Easing.Back.Out, true);
	this.game.add.tween(this.letters).from({alpha: 0}, 600, Phaser.Easing.Cubic.Out, true);

	this.animateTitle();
	this.animateZebra();
	this.animateButtons();
};

MainMenu.prototype.animateTitle = function() {
	var delay = 350;
	this.title.alpha = 0;
	this.title.scale.set(1.3, 1.3);
	this.game.add.tween(this.title).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, true, delay);
	this.game.add.tween(this.title.scale).to({x: 1, y: 1}, 600, Phaser.Easing.Back.Out, true, delay)
		.onComplete.addOnce(function () {
			this.game.add.tween(this.title.scale).to({
				y: 0.94,
				x: 1.06
			}, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);
		}, this);
};

MainMenu.prototype.animateZebra = function() {
	var delay = 700;
	this.zebra.scale.set(0);
	this.game.add.tween(this.zebra.scale).to({x: 1, y: 1}, 600, Phaser.Easing.Back.Out, true, delay)
		.onComplete.addOnce(function () {
			this.game.add.tween(this.zebra.scale).to({y: 0.95}, 800, Phaser.Easing.Sinusoidal.Out, true, 0, 10000, true);
		}, this);

	this.game.add.tween(this.talkBubble.scale).from({x: 0, y: 0}, 600, Phaser.Easing.Back.Out, true, delay + 400);
	this.game.add.tween(this.talkBubble).from({angle: -40}, 600, Phaser.Easing.Back.Out, true, delay + 400)
		.onComplete.addOnce(function () {
			this.game.add.tween(this.talkBubble.position).to({y: '+10'}, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);
		}, this);
};

MainMenu.prototype.animateButtons = function() {
	var delay = 1300;
	this.buttons.forEach(function(button) {
		button.scale.set(0, 0);
		var tween = this.game.add.tween(button.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Back.Out, true, delay);
		if (button === this.playButton) {
			tween.onComplete.addOnce(this.shakePlayButton, this);
		}

		delay += 150;
	}, this);
};

MainMenu.prototype.shakePlayButton = function() {
	var angle = -5;
	this.time.events.repeat(2200, Number.MAX_VALUE, function() {
		this.playButton.angle = angle;
		this.playShakeTween(angle);
	}, this);
};

MainMenu.prototype.playShakeTween = function(angle) {
	this.game.add.tween(this.playButton).to({angle: Math.abs(angle)}, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 2, true)
		.onComplete.add(function() {
			this.game.add.tween(this.playButton).to({angle: 0}, 100, Phaser.Easing.Linear.None, true);
		}, this);
};

MainMenu.prototype.resize = function() {
	this.resizeBackground();
	this.alingSprites();
	this.alignButtons();
};

MainMenu.prototype.resizeBackground = function() {
	this.background.height = Config.GAME_HEIGHT;
	this.letters.y = Config.HALF_GAME_HEIGHT;
	if (this.letters.height < Config.GAME_HEIGHT) {
		var scale = Config.GAME_HEIGHT / this.letters.height;
		this.letters.scale.set(scale, scale);
	}
};

MainMenu.prototype.alingSprites = function() {
	this.title.y = Config.GAME_HEIGHT * 0.2;
	this.zebra.y = Config.GAME_HEIGHT + 137;
	this.talkBubble.position.y = this.zebra.top + 150;
	this.soundButton.x = Config.GAME_WIDTH - this.soundButton.width * 0.5 - 20;
	this.soundButton.y = Config.GAME_HEIGHT * 0.08;
};

MainMenu.prototype.alignButtons = function() {
	var distance = this.zebra.top - this.title.bottom;
	var y = this.title.bottom + distance * 0.5;
	var dx = 155;
	this.playButton.x = Config.HALF_GAME_WIDTH;
	this.playButton.y = y;
	this.creditsButton.x = this.playButton.x - dx;
	this.creditsButton.y = y;
	this.languageButton.x = this.playButton.x + dx;
	this.languageButton.y = y;
};

MainMenu.prototype.shutdown = function() {
	this.buttons = null;
};

module.exports = MainMenu;