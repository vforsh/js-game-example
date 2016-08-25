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