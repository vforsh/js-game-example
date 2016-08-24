var Game = require('./Game.js');

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