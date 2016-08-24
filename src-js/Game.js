 var Boot = require('./states/Boot.js');
var Preloader = require('./states/Preloader.js');
var MainMenu = require('./states/mainMenu/MainMenu.js');
var Config = require('./Config.js');

Game.isDesktop = true;
Game.weakDevice = false;
Game.wasPaused = false;
Game.wasMuted = false;
Game.development = false;
Game.language = "en";
Game.lettersConfig = null;
Game.fontFamily = "bariol_boldbold";
Game.texts = null;
Game.storage = null;
Game.stats = null;
Game.mainMusicLoop = null;
Game.fullVolume = 0.25;
Game.reducedVolume = 0.15;
Game.wordsSounds = null;
Game.analytics = null;
Game.KIM = null;
Game.KIM_AVAILABLE = false;

Game = function() {
	var config = this.createConfig();

	Phaser.Game.call(this, config);
};

Game.prototype = Object.create(Phaser.Game);

Game.prototype = {

    constructor: Game,

    start: function() {
        this.game = new Phaser.Game(this.createConfig());

        //Main.storage = new utils.LocalStorageWrapper();
        //Main.stats = new game.GameStats(Main.storage);
        //
        //Main.analytics = new utils.GoogleAnalytics();

        //this.initKIM_API();

        this.game.state.add('Boot', Boot, true);
        this.game.state.add('Preloader', Preloader);
        this.game.state.add('MainMenu', MainMenu);
        //this.game.state.add('LanguagesMenu', LanguagesMenu);
        //this.game.state.add('ChooseLevelMenu', ChooseLevelMenu);
        //this.game.state.add('ChooseWordMenu', ChooseWordMenu);
        //this.game.state.add('Level', Level);
        //this.game.state.add('WordLevel', WordLevel);
        //this.game.state.add('FreeZone', FreeZone);
        //this.game.state.add('LettersCompleteScreen', LettersCompleteScreen);
    },

	createConfig: function() {
		var desktop = this.checkDesktop();
		var transparent = !desktop;

		return {
			width: Config.SOURCE_GAME_WIDTH,
			height: Config.SOURCE_GAME_HEIGHT,
			//renderer: Phaser.CANVAS,
			renderer: Phaser.AUTO,
			transparent: transparent,
			antialias: false,
			enableDebug: Game.development
		};
	},

	checkDesktop: function() {
		var desktop = false;
		var ua = detect.parse(window.navigator.userAgent);
		if (ua.device.type === "Desktop") {
			desktop = true;

			if (ua.device.family.indexOf("Nexus") > -1) {
				desktop = false;
			}
		}

		return desktop;
	},

	changeState: function(newState, arg) {
		/*var stateTransitionPlugin = this.plugins.plugins[0];
		stateTransitionPlugin.changeState(newState, arg);*/

		console.log("change state", newState);

		this.state.start(newState, true, false, arg);
	}

};

module.exports = Game;