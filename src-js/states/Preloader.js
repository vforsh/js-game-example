var Game = require('../Game');
var LettersConfig = require('../LettersConfig.js');

Preloader = function () {
	this.bg = null;
	this.bgItems = null;
	this.publisherLogo = null;
	this.backPreloadSprite = null;
	this.frontPreloadSprite = null;
	this.loadingText = null;
	this.copyright = null;
};

Preloader.prototype = Object.create(Phaser.State);
Preloader.prototype = {

	constructor: Preloader,

	init: function() {
		this.addBackgound();
		this.addPreloadBar();
		this.addLoadingText();

		this.resize();
	},

	addBackgound: function() {
		this.bg = this.game.add.image(0, 0, "preloader", "BG0000");

		this.bgItems = this.game.add.image(0, 0, "preloader", "BG_Items0000");
		this.bgItems.anchor.set(0.5, 0.5);
		this.bgItems.scale.set(1.33, 1.33);
	},

	addPreloadBar: function () {
		this.backPreloadSprite = this.game.add.image(0, 0, "preloader", "Preloader_Back0000");
		this.backPreloadSprite.anchor.set(0.5, 0.5);
		this.backPreloadSprite.x = Config.HALF_GAME_WIDTH;
		this.backPreloadSprite.y = Config.HALF_GAME_HEIGHT;

		this.frontPreloadSprite = this.game.add.sprite(0, 0, "preloader", "Preloader_Front0000");
		this.frontPreloadSprite.x = (Config.GAME_WIDTH - this.frontPreloadSprite.width) * 0.5;
	},

	addLoadingText: function () {
		var style = {font: "58px " + Game.fontFamily, fill: "#ffffff", align: "center"};

		this.loadingText = this.game.add.text(0, 0, "Loading...", style);
		this.loadingText.anchor.set(0.5, 0.5);
		this.loadingText.position.set(Config.HALF_GAME_WIDTH, Config.HALF_GAME_HEIGHT + 175);
		this.loadingText.setShadow(2, 2, "#E54510", 2);
		//this.loadingText.visible = false;
	},

	addCopyright: function () {
		var content = "(C) RoboWhale, 2016\nUse with permission";
		var style = {font: "22px " + Game.fontFamily, fill: "#CDE7F7", align: "center"};
		this.copyright = this.game.add.text(0, 0, content, style);
		this.copyright.anchor.set(0.5, 0.5);
		this.copyright.position.set(Config.HALF_GAME_WIDTH, Config.HALF_GAME_HEIGHT + 175);
		this.copyright.setShadow(2, 2, "#333333");
		this.copyright.lineSpacing = -8;
		this.copyright.alpha = 0.75;
	},

	preload: function () {
		this.loadLettersConfigs();
		this.loadOtherAssets();
		this.loadAudio();
		this.loadGraphics();

		this.load.setPreloadSprite(this.frontPreloadSprite);
	},

	loadLettersConfigs: function() {
		var baseUrl = "https://robowhale.com/html5/dl-editor/";
		var filename = Game.language + "_letters.json";

		//this.load.json("letters", baseUrl + filename);

		this.load.json("letters", "assets/letters/" + filename); // local
	},

	loadOtherAssets: function() {
		this.load.json("texts", "assets/texts.json");
	},

	loadAudio: function() {
		//this.load.audio("Game_loop", ['assets/audio/GameLoop.ogg', 'assets/audio/GameLoop.m4a'], true);
		if (this.game.sound.usingWebAudio) {
			this.load.audio("tap", 'assets/audio/tap.wav', true);

			/*// level
			this.load.audio("star_collect", ['assets/audio/convert_item.ogg', 'assets/audio/convert_item.m4a'], true);
			this.load.audio("show_picture", ['assets/audio/achieved.ogg', 'assets/audio/achieved.m4a'], true);
			this.load.audio("restart", ['assets/audio/restart.ogg', "assets/audio/restart.m4a"], true);
			this.loadSound("star_arrive", "Collect Item");
			this.loadSound("stars_on_complete", "Small Success");
			this.loadSound("letter_show", "Scoring a Point");
			this.loadSound("win", "Cartoon Big Win");

			// word level
			this.loadSound("error_1", "App Error");
			this.loadSound("tile_click_success_5", "Correct Answer 3");
			this.loadSound("tiles_collected_1", "Collect Item");
			this.loadSound("word_level_complete_1", "Happy Win Game");
			this.loadSound("cheers", "kids_cheers");

			// free zone
			this.loadSound("pop_2", "Pop_B", ['wav']);
			this.loadSound("pop_4", "Pop_D", ['wav']);
			this.loadSound("photo", 'photo');
			this.loadSound("erase", "erase_board");

			// letters complete
			this.loadSound("win_2", "Game Award 3");
			this.loadSound("win_3", "Well done");*/
		}

		/*var assetName = Game.language + "_sounds";
		this.load.audio("words_sounds", ['assets/audio/words/' + assetName + '.ogg', 'assets/audio/words/' + assetName + '.m4a'], true);
		this.load.json("sounds_config", 'assets/audio/words/' + Game.language + '_sounds.json');*/
	},

	loadSound: function(key, filename) {
		var basePath = "assets/audio/";
		var fullFilename = basePath + filename + ".";
		var urls = ['ogg', 'm4a'].map(function(format) {
			return fullFilename + format;
		});

		this.load.audio(key, urls, true);
	},

	loadGraphics: function() {
		this.load.atlasJSONHash('backgrounds_1', 'assets/graphics/backgrounds_1.png', 'assets/graphics/backgrounds_1.json');
		this.load.atlasJSONHash('letters_1', 'assets/graphics/letters_1.png', 'assets/graphics/letters_1.json');
		this.load.atlasJSONHash('letters_2', 'assets/graphics/letters_2.png', 'assets/graphics/letters_2.json');
		this.load.atlasJSONHash('pictures_1', 'assets/graphics/pictures_1.png', 'assets/graphics/pictures_1.json');
		this.load.atlasJSONHash('pictures_2', 'assets/graphics/pictures_2.png', 'assets/graphics/pictures_2.json');
		this.load.atlasJSONHash('choose_level', 'assets/graphics/choose_level.png', 'assets/graphics/choose_level.json');
		this.load.atlasJSONHash('graphics_1', 'assets/graphics/graphics_1.png', 'assets/graphics/graphics_1.json');
		this.load.atlasJSONHash('main_menu', 'assets/graphics/main_menu.png', 'assets/graphics/main_menu.json');
		this.load.atlasJSONHash('languages_menu', 'assets/graphics/languages_menu.png', 'assets/graphics/languages_menu.json');
		this.load.atlasJSONHash('word_level', 'assets/graphics/word_level.png', 'assets/graphics/word_level.json');
		this.load.atlasJSONHash('free_zone', 'assets/graphics/free_zone.png', 'assets/graphics/free_zone.json');
		this.load.atlasJSONHash('letters_complete', 'assets/graphics/letters_complete.png', 'assets/graphics/letters_complete.json');
	},

	loadUpdate: function() {
		this.loadingText.setText(this.load.progress + "%");
	},

	create: function () {
		this.initTexts();
		//this.initWordSounds();
		this.initGameMusicLoop();
		this.createCanvasLetterBMD();
		this.initLettersConfig();
		this.handleSoundByKIM_API();

		console.log("Language: %s", Game.language);

		this.game.changeState("MainMenu", true);
		//(<game.Game> this.game).changeState("LanguagesMenu");
		//(<game.Game> this.game).changeState("ChooseLevelMenu");
		//(<game.Game> this.game).changeState("ChooseWordMenu");
		//(<game.Game> this.game).changeState("Level", "i");
		//(<game.Game> this.game).changeState("WordLevel", "a");
		//(<game.Game> this.game).changeState("FreeZone");
		//(<game.Game> this.game).changeState("LettersCompleteScreen");
	},

	initTexts: function() {
		var allTexts = this.game.cache.getJSON("texts");

		Game.texts = allTexts[Game.language];
	},

	initWordSounds: function() {
		var soundsConfig = this.game.cache.getJSON("sounds_config");
		var sound = this.game.add.sound("words_sounds");
		sound.allowMultiple = true;

		console.groupCollapsed("Sound markers");
		Object.keys(soundsConfig).sort().forEach(function(key) {
			var data = soundsConfig[key];
			var start = data[0];
			var end = data[1];
			var duration = end - start;

			sound.addMarker(key, start, duration);

			console.log("%s: [%s - %s, duration: %s]", key, start, end, duration.toFixed(2));
		});
		console.groupEnd();
	
		Game.wordsSounds = sound;
	},

	initGameMusicLoop: function() {
		Game.GameMusicLoop = this.sound.add("Game_loop", Game.fullVolume, true, true);
	},

	createCanvasLetterBMD: function() {
		var bmd = this.game.make.bitmapData(330, 350, "canvas_letter", true);

		// create big and small bmds ???
		////var bmd:Phaser.BitmapData = this.game.make.bitmapData(512, 512, "canvas_letter", true);
		//var bmd:Phaser.BitmapData = this.game.make.bitmapData(256, 256, "canvas_letter", true);

		bmd.smoothed = true;
	},

	initLettersConfig: function() {
		Game.lettersConfig = new LettersConfig(this.game);
		Game.lettersConfig.init();
	},

	handleSoundByKIM_API: function() {
		if (Game.KIM) {
			Game.KIM.onToggleBGM = this.onSoundToggle.bind(this);

			this.sound.mute = !Game.KIM.isMusicOn();
		}
	},

	onSoundToggle: function() {
		this.sound.mute = !Game.KIM.isMusicOn();
	},

	resize: function() {
		this.resizeBackground();
		this.alignSprites();
	},

	resizeBackground: function() {
		this.bg.width = Config.GAME_WIDTH + 1;
		this.bg.height = Config.GAME_HEIGHT + 1;

		this.bgItems.x = Config.HALF_GAME_WIDTH;
		this.bgItems.y = Config.HALF_GAME_HEIGHT;
	},

	alignSprites: function() {
		this.backPreloadSprite.y = Config.GAME_HEIGHT * 0.5;

		this.frontPreloadSprite.y = this.backPreloadSprite.bottom - 41;

		this.loadingText.y = this.backPreloadSprite.y + 80;
		//this.copyright.y = Config.GAME_HEIGHT - this.copyright.height * 0.5 - 8;
	},

	shutdown: function () {
		this.cache.removeImage("preloader", true);
	}

};

module.exports = Preloader;