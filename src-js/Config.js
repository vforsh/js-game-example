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