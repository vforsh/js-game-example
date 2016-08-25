var Boot = require('./states/Boot.js');
var Preloader = require('./states/Preloader.js');
var MainMenu = require('./states/mainMenu/MainMenu.js');
var Config = require('./Config.js');
var LocalStorageWrapper = require('./LocalStorageWrapper.js');
var GameStats = require('./GameStats.js');

Game = function () {
	this.isDesktop = true;
	this.weakDevice = false;
	this.wasPaused = false;
	this.wasMuted = false;
	this.development = false;
	this.language = "en";
	this.lettersConfig = null;
	this.fontFamily = "bariol_boldbold";
	this.texts = null;
	this.storage = new LocalStorageWrapper();
	this.stats = new GameStats(this.storage);
	this.mainMusicLoop = null;
	this.fullVolume = 0.25;
	this.reducedVolume = 0.15;
	this.wordsSounds = null;
	this.analytics = null;

	Phaser.Game.call(this, this.createConfig());

	this.start();
};

Game.prototype = Object.create(Phaser.Game.prototype);
Game.prototype.constructor = Game;

Game.prototype.start = function () {
	this.state.add('Boot', Boot, true);
	this.state.add('Preloader', Preloader);
	this.state.add('MainMenu', MainMenu);
	//this.state.add('LanguagesMenu', LanguagesMenu);
	//this.state.add('ChooseLevelMenu', ChooseLevelMenu);
	//this.state.add('ChooseWordMenu', ChooseWordMenu);
	//this.state.add('Level', Level);
	//this.state.add('WordLevel', WordLevel);
	//this.state.add('FreeZone', FreeZone);
	//this.state.add('LettersCompleteScreen', LettersCompleteScreen);
};

Game.prototype.createConfig = function () {
	var desktop = this.checkDesktop();
	var transparent = !desktop;

	return {
		width: Config.SOURCE_GAME_WIDTH,
		height: Config.SOURCE_GAME_HEIGHT,
		//renderer: Phaser.CANVAS,
		renderer: Phaser.AUTO,
		transparent: transparent,
		antialias: true,
		enableDebug: Game.development
	};
};

Game.prototype.checkDesktop = function () {
	var desktop = false;
	var ua = detect.parse(window.navigator.userAgent);
	if (ua.device.type === "Desktop") {
		desktop = true;

		if (ua.device.family.indexOf("Nexus") > -1) {
			desktop = false;
		}
	}

	return desktop;
};

Game.prototype.changeState = function(newState, arg) {
	this.state.start(newState, true, false, arg);
};

module.exports = Game;