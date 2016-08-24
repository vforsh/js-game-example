var Config = require('./../Config.js');
var Game = require('./../Game.js');
var detectLanguage = require('./../LanguageDetector.js');

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