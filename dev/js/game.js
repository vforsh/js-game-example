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
	var LocalStorageWrapper = __webpack_require__(11);
	var GameStats = __webpack_require__(12);
	
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
	
			this.game.texts = allTexts[Game.language];
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
/***/ function(module, exports, __webpack_require__) {

	var TalkBubble = __webpack_require__(8);
	var SimpleButton = __webpack_require__(9);
	var ToggleButton = __webpack_require__(10);
	var Config = __webpack_require__(3);
	
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

/***/ },
/* 8 */
/***/ function(module, exports) {

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

/***/ },
/* 9 */
/***/ function(module, exports) {

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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var SimpleButton = __webpack_require__(9);
	
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

/***/ },
/* 11 */
/***/ function(module, exports) {

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

/***/ },
/* 12 */
/***/ function(module, exports) {

	GameStats = function(storage) {
		this.storage = storage;
	};
	
	GameStats.BOOSTERS_WAS_SEEN = "Boosters_Was_Seen";
	GameStats.TUTORIAL_COMPLETE = "Tutorial";
	GameStats.COINS = "Coins";
	GameStats.ALL_TIME_COINS = "All_Time_Coins";
	GameStats.LANGUAGE = "Language";
	
	GameStats.prototype.constructor = GameStats;
	
	GameStats.prototype.getValue = function(key) {
		return this.storage.getValue(key);
	};
	
	GameStats.prototype.getBooleanValue = function(key) {
		var value = this.storage.getValue(key);
	
		return (value === "true");
	};
	
	GameStats.prototype.getNumericValue = function(key) {
		var value = this.storage.getValue(key);
		var num = parseFloat(value) || 0;
		return num;
	};
	
	GameStats.prototype.saveValue = function(key, value) {
		this.storage.saveValue(key, value);
	};
	
	GameStats.prototype.increase = function (key, increment) {
		increment = increment || 1;
	
		var oldValue = parseInt(this.storage.getValue(key));
		var newValue = oldValue + increment;
	
		this.saveValue(key, newValue);
	};
	
	GameStats.prototype.changeNumericValue = function(key, changeValue) {
		var oldValue = this.getNumericValue(key);
		var newValue = oldValue + changeValue;
	
		this.saveValue(key, newValue);
	
		return newValue;
	};
	
	GameStats.prototype.getLetterSaveKey = function(language, letter) {
		return game.Main.language + "_" + letter;
	};
	
	GameStats.prototype.getWordSaveKey = function(language, letter, word) {
		return language + "_" + letter + "_" + word;
	};
	
	GameStats.prototype.isLetterComplete = function(letterKey) {
		return this.getBooleanValue(letterKey);
	};
	
	module.exports = GameStats;

/***/ }
/******/ ]);
//# sourceMappingURL=game.js.map