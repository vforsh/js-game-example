/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Vladislav on 28.07.2016.
	 */
	var Game = __webpack_require__(1);
	
	window.onload = function() {
		new Game();
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Boot = __webpack_require__(2);
	var Preloader = __webpack_require__(5);
	var MainMenu = __webpack_require__(7);
	var Config = __webpack_require__(3);
	
	Game = function() {
	    this.start();
	};
	
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Config = __webpack_require__(3);
	var Game = __webpack_require__(1);
	var detectLanguage = __webpack_require__(4);
	
	Boot = function () {
	
	};
	
	Boot.prototype = Object.create(Phaser.State);
	Boot.prototype = {
	
		constructor: Boot,
	
		init: function() {
			if (Phaser.Device.isAndroidStockBrowser()) {
				this.game.canvas.parentElement.style.overflow = "visible";
			}
	
			// HACK
			//var style1 = { font: "10px GrilledCheeseBTNToasted" };
			//var text1:Phaser.Text = this.add.text(0, 0, "1234567890%", style1);
			//text1.destroy();
	
			var style2 = { font: "10px bariol_boldbold" };
			var text2 = this.add.text(0, 0, "1234567890%", style2);
			text2.destroy();
		},
	
		preload: function() {
			if (this.game.device.ie && this.game.device.ieVersion <= 9) {
				this.load.useXDomainRequest = false;
			}
	
			this.load.crossOrigin = "anonymous";
			this.load.useXDomainRequest = true;
	
			this.load.atlasJSONHash('preloader', 'assets/graphics/preloader.png', 'assets/graphics/preloader.json');
		},
	
		create: function () {
			this.setupScale();
			this.setupCanvasStyle();
			this.setupCustomConsole();
			this.addFPSMeter();
			this.detectWeakDevice();
			this.detectLanguage();
			this.checkUserType();
	
			this.input.maxPointers = 1;
			this.stage.disableVisibilityChange = true;
			//this.game.plugins.add(new game.StateTransition(this.game)); // TODO implement StateTransition plugin
			//this.game.add.plugin(Phaser.Plugin.Debug);
			this.game.renderer.clearBeforeRender = false;
			this.game.tweens.frameBased = true;
	
			this.game.state.start('Preloader', true, false);
		},
	
		setupScale: function () {
			if (this.game.device.desktop) {
				this.scaleForDesktop();
			} else {
				this.scaleForMobile();
				this.scaleGame();
	
				if (this.isLandscape()) {
					this.onEnterLandscape();
				}
			}
		},
	
		scaleForDesktop: function () {
			var scale = this.game.scale;
	
			scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			scale.aspectRatio = Config.SOURCE_GAME_WIDTH / Config.SOURCE_GAME_HEIGHT;
			scale.pageAlignHorizontally = true;
			scale.pageAlignVertically = true;
		},
	
		scaleForMobile: function () {
			var scale = this.game.scale;
	
			scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			scale.forceOrientation(false, true);
			scale.onSizeChange.add(this.onSizeChange, this);
		},
	
		onSizeChange: function () {
			if (this.isPortrait()) {
				this.scaleGame();
				this.game.state.resize(Config.GAME_WIDTH, Config.GAME_HEIGHT);
				this.onEnterPortrait();
			} else {
				this.onEnterLandscape();
			}
		},
	
		setupCanvasStyle: function () {
			if (this.game.device.desktop) {
				this.game.canvas.style.boxShadow = "0 0 30px black";
				this.game.canvas.parentElement.style.backgroundColor = "#152E4D";
				//this.game.canvas.parentElement.style.backgroundColor = "#FFFFFF";
			} else {
				this.game.canvas.style.backgroundColor = "black";
			}
		},
	
		setupCustomConsole: function () {
			if (this.game.device.desktop) {
				var debugConsole = document.getElementById("debug_console");
				if (debugConsole) {
					debugConsole.style.display = "none";
				}
			}
		},
	
		addFPSMeter: function () {
			if (Game.development) {
				var fpsMeter = new utils.FPSMeter(this.game);
				this.stage.addChild(fpsMeter);
			}
		},
	
		detectWeakDevice: function () {
			Game.weakDevice = this.game.renderType === Phaser.CANVAS;
		},
	
		detectLanguage: function () {
			Game.language = detectLanguage();
		},
	
		scaleGame: function () {
			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;
			var deviceWidth = windowWidth * this.game.device.pixelRatio;
			var newGameWidth = 0;
			var newGameHeight = 0;
			if (deviceWidth <= Config.SOURCE_GAME_WIDTH) {
				newGameWidth = windowWidth * 2;
				newGameHeight = windowHeight * 2;
			} else {
				newGameWidth = windowWidth;
				newGameHeight = windowHeight;
			}
	
			var originalWidth = Config.SOURCE_GAME_WIDTH;
			var worldScale = newGameWidth / originalWidth;
			this.world.scale.set(worldScale, worldScale);
			this.scale.setGameSize(newGameWidth, newGameHeight);
	
			Config.ASPECT_RATIO = newGameWidth / newGameHeight;
			Config.WORLD_SCALE = worldScale;
			Config.GAME_WIDTH = this.game.canvas.width / worldScale;
			Config.GAME_HEIGHT = this.game.canvas.height / worldScale;
			Config.HALF_GAME_WIDTH = Config.GAME_WIDTH * 0.5;
			Config.HALF_GAME_HEIGHT = Config.GAME_HEIGHT * 0.5;
		},
	
		onEnterLandscape: function () {
			document.getElementById('rotate').style.display = 'block';
			document.getElementById('rotate').style.width = window.innerWidth + 'px';
			document.getElementById('rotate').style.height = window.innerHeight + 'px';
		},
	
		onEnterPortrait: function () {
			document.getElementById('rotate').style.display = 'none';
		},
	
		isLandscape: function () {
			return (window.innerWidth > window.innerHeight);
		},
	
		isPortrait: function () {
			return (window.innerHeight > window.innerWidth);
		},
	
		checkUserType: function () {
			// TODO implement Stats
			/*var returningUser = Game.stats.getBooleanValue("Drawing_Numbers");
			 if (returningUser) {
			 Game.analytics.sendEvent("user_type", "returning");
			 } else {
			 Game.stats.saveValue("Drawing_Letters", true);
			 Game.analytics.sendEvent("user_type", "new");
			 }*/
		}
	
	};
	
	module.exports = Boot;

/***/ },
/* 3 */
/***/ function(module, exports) {

	Config = function() {
		
	};
	
	Config.LANGUAGES = ["en", 'es', 'fr', 'it', 'pt'];
	Config.SOURCE_GAME_WIDTH = 640;
	Config.SOURCE_GAME_HEIGHT = 780; // TODO test 754
	Config.GAME_WIDTH = Config.SOURCE_GAME_WIDTH;
	Config.GAME_HEIGHT = Config.SOURCE_GAME_HEIGHT;
	Config.HALF_GAME_WIDTH = Config.GAME_WIDTH * 0.5;
	Config.HALF_GAME_HEIGHT = Config.GAME_HEIGHT * 0.5;
	Config.WORLD_SCALE = 1;
	Config.ASPECT_RATIO = Config.SOURCE_GAME_WIDTH / Config.SOURCE_GAME_HEIGHT;
	
	module.exports = Config;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	
	LanguageDetector = function() {
	
	};
	
	LanguageDetector.detect = function() {
		/*var savedLanguage = LanguageDetector.getSavedLanguage();
		var kimLanguage = LanguageDetector.getKIMLanguage();
		var browserLanguage = LanguageDetector.getBrowserLanguage();
		var queryLanguage = LanguageDetector.getQueryLanguage();
	
		var language = savedLanguage || kimLanguage || browserLanguage || queryLanguage;
		var languageSupported = Config.LANGUAGES.indexOf(language) > -1;
		if (!languageSupported) {
			language = 'en';
		}
	
		return language;*/
	
		return 'en';
	};
	
	LanguageDetector.getSavedLanguage = function() {
		var savedLanguage = Game.storage.getValue('language');
		if (savedLanguage) {
			return _.trim(savedLanguage, '\"');
		}
	
		return null;
	};
	
	LanguageDetector.getKIMLanguage = function() {
		if (Game.KIM && Game.KIM['getLanguage']) {
			return Game.KIM.getLanguage();
		}
	
		return null;
	};
	
	LanguageDetector.getBrowserLanguage = function() {
		return navigator.language || navigator.userLanguage || navigator.browserLanguage;
	};
	
	LanguageDetector.getQueryLanguage = function() {
		var net = new Phaser.Net(this.game);
		var queryLang = net.getQueryString("lang");
	
		if (_.isString(queryLang) && queryLang.length === 2) {
			return queryLang;
		}
	
		return null;
	};
	
	module.exports = LanguageDetector.detect;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var LettersConfig = __webpack_require__(6);
	
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
	
			//console.log(`Language: ${Game.language}`);
	
			console.log("PRELOADER CREATE");
	
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

/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports) {

	
	
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
	
		//if (Game.weakDevice === false) {
		//	this.initAnimation();
		//}
	
		if (this.fromPreloader) {
			this.handleMusicOnStart();
	
			this.stage.disableVisibilityChange = false;
	
			this.game.onBlur.add(this.onFocusLost, this);
			this.game.onFocus.add(this.onFocus, this);
		}
	
		Game.analytics.sendPageview("main_menu");
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
		Game.wasMuted = this.game.sound.mute;
		this.game.sound.mute = true;
	};
	
	MainMenu.prototype.onFocus = function() {
		if (game.Main.wasMuted === false)
			this.game.sound.mute = false;
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
		var _this = this;
		this.title = this.add.image(0, 0, "main_menu", "Title0000");
		this.title.anchor.set(0.5, 0.5);
		this.title.x = Config.HALF_GAME_WIDTH - 0.5;
		this.title.y = Config.GAME_HEIGHT * 0.15;
		this.title.inputEnabled = true;
		this.title.events.onInputDown.add(function () {
			if (_this.titleClicks++ > 5) {
				_this.titleClicks = 0;
				_this.game.add.tween(_this.title).to({alpha: 0}, 300, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
				game.Main.storage.clear();
				window.alert("Saved data was cleared!");
			}
		});
	};
	
	MainMenu.prototype.addZebra = function() {
		this.zebra = this.game.add.image(0, 0, "main_menu", "Zebra0000");
		this.zebra.anchor.set(0.5, 1);
		this.zebra.x = Config.GAME_WIDTH - 85;
		this.zebra.inputEnabled = true;
		this.zebra.events.onInputDown.add(this.onZebraClick, this);
	};
	
	MainMenu.prototype.onZebraClick = function() {
		this.game.sound.play('pop_4', 0.5);
		this.tweens.removeFrom(this.zebra);
		this.zebra.y = Config.GAME_HEIGHT + 137;
		this.game.add.tween(this.zebra).to({y: '-40'}, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
		this.talkBubble.updateContent();
	};
	
	MainMenu.prototype.addTalkBubble = function() {
		this.talkBubble = new game.TalkBubble(this.game, this.world);
		this.talkBubble.position.x = this.zebra.left - 10;
	};
	
	MainMenu.prototype.onTalkBubbleClick = function() {
		this.talkBubbleClicks++;
		if (this.talkBubbleClicks === 5) {
			this.testKIM_API();
		}
	};
	
	MainMenu.prototype.addButtons = function() {
		var _this = this;
		this.soundButton = new game.ToggleButton(this.game, 0, 0, "main_menu", "Button_Sound_On0000", "Button_Sound_Off0000");
		this.soundButton.callback.add(function () {
			_this.game.sound.mute = !_this.game.sound.mute;
		});
		this.soundButton.visible = _.isUndefined(game.Main.KIM);
		if (this.game.sound.mute) {
			this.soundButton.switchTextures();
		}
		this.playButton = new game.SimpleButton(this.game, 0, 0, "main_menu", "Button_Play0000");
		this.playButton.setCallbackDelay(200);
		this.playButton.callback.addOnce(this.onPlayButtonClick, this);
		var imageKey = "Flag_" + game.Main.language.toUpperCase() + "_Round0000";
		this.languageButton = new game.SimpleButton(this.game, 0, 0, "main_menu", imageKey);
		this.languageButton.x = Config.GAME_WIDTH - 60;
		this.languageButton.callback.addOnce(this.gotoLanguagesMenu, this);
		this.creditsButton = new game.SimpleButton(this.game, 0, 0, "main_menu", "Button_Credits0000");
		this.creditsButton.callback.add(this.toggleCredits, this);
		this.buttons = [this.soundButton, this.creditsButton, this.playButton, this.languageButton];
		this.buttons.forEach(function (button) {
			_this.world.add(button);
		});
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
		var _this = this;
		this.game.add.tween(this.credits).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
		this.game.add.tween(this.credits).to({y: this.credits.y + 200}, 500, Phaser.Easing.Back.In, true)
			.onComplete.addOnce(function () {
			_this.playButton.input.enabled = true;
			_this.creditsButton.input.enabled = true;
			_this.credits.visible = false;
		}, this);
	};
	
	MainMenu.prototype.showCredits = function() {
		var _this = this;
		this.credits.visible = true;
		this.credits.alpha = 0;
		this.credits.y = (Config.GAME_HEIGHT - this.credits.height) * 0.5 + 200;
		this.game.add.tween(this.credits).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
		this.game.add.tween(this.credits).to({y: this.credits.y - 200}, 500, Phaser.Easing.Back.Out, true);
		this.playButton.input.enabled = false;
		this.creditsButton.input.enabled = false;
		this.game.input.onDown.addOnce(function () {
			_this.hideCredits();
		}, this);
	};
	
	MainMenu.prototype.startMusic = function() {
		if (game.Main.mainMusicLoop) {
			game.Main.mainMusicLoop.play();
		}
		this.soundButton.switchTextures();
		this.soundButton.input.enabled = true;
	};
	
	MainMenu.prototype.testKIM_API = function() {
		var style = {font: "30px " + game.Main.fontFamily, fill: "#fff0000", align: "center"};
		var text = this.game.add.text(0, 0, "", style);
		text.anchor.set(0.5, 0.5);
		text.x = Config.HALF_GAME_WIDTH;
		text.y = Config.GAME_HEIGHT * 0.9;
		text.setShadow(0, 2, 0, 0, true, true);
		text.lineSpacing = -6;
		text.setText("\n\t\t\t\tKIM API: " + (_.isUndefined(game.Main.KIM) === false) + "\n\t\t\t\t" + window.location.href + "\n\t\t\t");
	};
	
	MainMenu.prototype.initAnimation = function() {
		this.game.add.tween(this.letters.scale).from({x: 1.5, y: 1.5}, 600, Phaser.Easing.Back.Out, true);
		this.game.add.tween(this.letters).from({alpha: 0}, 600, Phaser.Easing.Cubic.Out, true);
		this.animateTitle();
		this.animateZebra();
		this.animateButtons();
	};
	
	MainMenu.prototype.animateTitle = function() {
		var _this = this;
		var delay = 350;
		this.title.alpha = 0;
		this.title.scale.set(1.3, 1.3);
		this.game.add.tween(this.title).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, true, delay);
		this.game.add.tween(this.title.scale).to({x: 1, y: 1}, 600, Phaser.Easing.Back.Out, true, delay)
			.onComplete.addOnce(function () {
			_this.game.add.tween(_this.title.scale).to({
				y: 0.94,
				x: 1.06
			}, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);
		});
	};
	
	MainMenu.prototype.animateZebra = function() {
		var _this = this;
		var delay = 700;
		this.zebra.scale.set(0);
		this.game.add.tween(this.zebra.scale).to({x: 1, y: 1}, 600, Phaser.Easing.Back.Out, true, delay)
			.onComplete.addOnce(function () {
			_this.game.add.tween(_this.zebra.scale).to({y: 0.95}, 800, Phaser.Easing.Sinusoidal.Out, true, 0, 10000, true);
		});
		this.game.add.tween(this.talkBubble.scale).from({
			x: 0,
			y: 0
		}, 600, Phaser.Easing.Back.Out, true, delay + 400);
		this.game.add.tween(this.talkBubble).from({angle: -40}, 600, Phaser.Easing.Back.Out, true, delay + 400)
			.onComplete.addOnce(function () {
			_this.game.add.tween(_this.talkBubble.position).to({y: '+10'}, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);
		});
	};
	
	MainMenu.prototype.animateButtons = function() {
		var _this = this;
		var delay = 1300;
		this.buttons.forEach(function (button) {
			button.scale.set(0, 0);
			var tween = _this.game.add.tween(button.scale).to({
				x: 1,
				y: 1
			}, 500, Phaser.Easing.Back.Out, true, delay);
			if (button === _this.playButton) {
				tween.onComplete.addOnce(_this.shakePlayButton, _this);
			}
			delay += 150;
		});
	};
	
	MainMenu.prototype.shakePlayButton = function() {
		var _this = this;
		var angle = -5;
		this.time.events.repeat(2200, Number.MAX_VALUE, function () {
			_this.playButton.angle = angle;
			_this.game.add.tween(_this.playButton).to({angle: Math.abs(angle)}, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 2, true)
				.onComplete.add(function () {
				_this.game.add.tween(_this.playButton).to({angle: 0}, 100, Phaser.Easing.Linear.None, true);
			});
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

/***/ }
/******/ ]);
//# sourceMappingURL=game.js.map