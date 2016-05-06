/**
 * nCore Module, working with nStack Translate has never been this easy!
 * @version v - 2016-05-06
 * @link https://www.github.com/nodes-frontend/nTranslate
 * @author Dennis Haulund Nielsen
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function () {
	'use strict';

	angular.module('nCore.nTranslate', ['ngStorage']);

})();

(function () {
	'use strict';

	angular
		.module('nCore.nTranslate')
		.provider('nTranslateConfig', nTranslateConfig);

	function nTranslateConfig() {

		var defaults = {
			root: 'https://nstack.io/api',
			apiVersion: 'v1',
			platform: 'web',
			endpoints: {
				languages: 'languages',
				bestFit: 'languages/best_fit',
				keys: 'keys'
			},
			apiKey: null,
			appId: null,
			storageIdentifier: null,
			persist: true,
			expires: Date.now() + (24 * 60 * 60 * 1000) // 24 Hours
		};

		this.configure = function(config) {
			if(!arguments[0]) {
				return defaults;
			} else {
				angular.extend(defaults, config);
			}
		};

		/* @ngInject */
		this.$get = function() {
			return defaults;
		};

	}

})();

(function () {
	'use strict';

	angular
		.module('nCore.nTranslate')
		.service('nTranslate', nTranslate);

	/* @ngInject */
	function nTranslate($exceptionHandler, $q, $http, $localStorage, nTranslateConfig) {

		var configuration = nTranslateConfig;
		
		/**
		 * Configuration Validation
		 * 
		 * Check if any required fields are empty and throw exceptions accordingly
		 */
		if(!configuration.apiKey) {
			throw $exceptionHandler('missingfield', _nTranslateMissingKeyError('apiKey'));
		}
		if(!configuration.appId) {
			throw $exceptionHandler('missingfield', _nTranslateMissingKeyError('appId'));
		}
		if(!configuration.storageIdentifier && configuration.persist) {
			throw $exceptionHandler('missingfield', _nTranslateMissingIdentifier());
		}
		
		/**
		 * If nTranslate has been configured to use persistance, we register the expires timestamp for further usage.
		 */
		if(configuration.persist && configuration.expires && configuration.storageIdentifier) {
			$localStorage[configuration.storageIdentifier + '-TranslateSettings'] = {
				expires: configuration.expires
			};
		}
		
		/**
		 * Expose API
		 */
		var service = {
			getLanguages: getLanguages,
			getBestFitLanguage: getBestFitLanguage,
			getAllKeys: getAllKeys,
			getKeysFromSection: getKeysFromSection,
			getAllKeysSync: getAllKeysSync,
			getKeysFromSectionSync: getKeysFromSectionSync
		};

		return service;
		
		/**
		 * Fetch all registerred languages
		 * 
		 * @param showInactiveLanguages {bool} - Fetch inactive languages (for development purposes)
		 * @param forceExpiry {bool} - If true, clear and invalidate cache
		 * @returns {Promise}
		 */
		function getLanguages(showInactiveLanguages, forceExpiry) {

			var deferred = $q.defer();

			var requestParams = {
				headers: _constructHeaders(),
				params: {
					show_inactive_languages: showInactiveLanguages || false
				}
			};

			if(forceExpiry) {
				_clearStorage();
			}

			if(!_isPersistanceExpired() && angular.isDefined($localStorage[configuration.storageIdentifier + '-TranslateLanguages'])) {
				deferred.resolve($localStorage[configuration.storageIdentifier + '-TranslateLanguages']);
			} else {
				$http.get(_constructUrl(configuration.endpoints.languages), requestParams)
					.then(function nTranslateGetAllKeysSuccess(data) {
						if(configuration.persist) {
							_persistLanguagesToStorage(data);
							deferred.resolve($localStorage[configuration.storageIdentifier + '-TranslateLanguages']);
						} else {
							deferred.resolve(data.data.data);
						}
					})
					.catch(function nTranslateGetAllKeysError(reason) {
						deferred.reject(reason);
					});
			}

			return deferred.promise;

		}
		
		/**
		 * Fetch bestFitLanguage. This is done by the server compairing the Accept-Languages header in the request with the registerred languages.
		 *
		 * @param showInactiveLanguages {bool} - Fetch inactive languages (for development purposes)
		 * @param forceExpiry {bool} - If true, clear and invalidate cache
		 * @returns {Promise}
		 */
		function getBestFitLanguage(showInactiveLanguages, forceExpiry) {

			var deferred = $q.defer();

			var requestParams = {
				headers: _constructHeaders(),
				params: {
					show_inactive_languages: showInactiveLanguages || false
				}
			};

			if(forceExpiry) {
				_clearStorage();
			}

			if(!_isPersistanceExpired() && angular.isDefined($localStorage[configuration.storageIdentifier + '-TranslateBestFit'])) {
				deferred.resolve($localStorage[configuration.storageIdentifier + '-TranslateBestFit']);
			} else {
				$http.get(_constructUrl(configuration.endpoints.bestFit), requestParams)
					.then(function nTranslateGetAllKeysSuccess(data) {
						if(configuration.persist) {
							_persistBestFitLanguageToStorage(data);
							deferred.resolve($localStorage[configuration.storageIdentifier + '-TranslateBestFit']);
						} else {
							deferred.resolve(data.data.data);
						}
					})
					.catch(function nTranslateGetAllKeysError(reason) {
						deferred.reject(reason);
					});
			}

			return deferred.promise;

		}
		
		/**
		 * Fetches Array of translation sections, each with their key/values.
		 *
		 * @param forceExpiry {bool} - If true, clear and invalidate cache
		 * @returns {Promise}
		 */
		function getAllKeys(forceExpiry) {

			var deferred = $q.defer();

			var requestParams = {
				headers: _constructHeaders()
			};

			if(forceExpiry) {
				_clearStorage();
			}

			if(!_isPersistanceExpired() && angular.isDefined($localStorage[configuration.storageIdentifier + '-Translate'])) {
				deferred.resolve($localStorage[configuration.storageIdentifier + '-Translate']);
			} else {
				$http.get(_constructUrl(configuration.endpoints.keys), requestParams)
					.then(function nTranslateGetAllKeysSuccess(data) {
						if(configuration.persist) {
							_persistAllToStorage(data);
							deferred.resolve($localStorage[configuration.storageIdentifier + '-Translate']);
						} else {
							deferred.resolve(data.data.data);
						}
					})
					.catch(function nTranslateGetAllKeysError(reason) {
						deferred.reject(reason);
					});
			}

			return deferred.promise;

		}
		
		/**
		 * Fetches a single translation section Object with it's key/values 
		 * 
		 * @param section {string} - The section to be fetched
		 * @param forceExpiry {bool} - If true, clear and invalidate cache
		 * @returns {Promise}
		 */
		function getKeysFromSection(section, forceExpiry) {

			if(!section) {
				throw $exceptionHandler('missingfields', 'Missing section argument');
			}

			var deferred = $q.defer();

			var requestParams = {
				headers: _constructHeaders()
			};

			if(forceExpiry) {
				_clearStorage();
			}

			if(!_isPersistanceExpired() && angular.isDefined($localStorage[configuration.storageIdentifier + '-Translate'])) {
				deferred.resolve($localStorage[configuration.storageIdentifier + '-Translate'][section]);
			} else {
				$http.get(_constructUrl(configuration.endpoints.keys + '/' + section), requestParams)
						.then(function nTranslateGetKeysFromSectionSuccess(data) {
							if(configuration.persist) {
								_persistSectionToStorage(section, data);
								deferred.resolve($localStorage[configuration.storageIdentifier + '-Translate'][section]);
							} else {
								deferred.resolve(data.data.data);
							}
						})
						.catch(function nTranslateGetKeysFromSectionError(reason) {
							deferred.reject(reason);
						});
			}

			return deferred.promise;

		}

		/**
		 * Fetches all translation sections from the local storage synchronously.
		 *
		 * @param section {string} - The section to be fetched
		 * @returns {array}
		 */
		function getAllKeysSync() {
			if(!angular.isDefined($localStorage[configuration.storageIdentifier + '-Translate'])) {
				return [];
			} else {
				return $localStorage[configuration.storageIdentifier + '-Translate']
			}
		}

		/**
		 * Fetches a single translation section from the local storage synchronously.
		 *
		 * @param section {string} - The section to be fetched
		 * @returns {object}
		 */
		function getKeysFromSectionSync(section) {
			if(!angular.isDefined($localStorage[configuration.storageIdentifier + '-Translate'][section])) {
				return {};
			} else {
				return $localStorage[configuration.storageIdentifier + '-Translate'][section];
			}
		}
		
		/**
		 * Convenience method for creating the proper authorization headers required by nStack.
		 * @returns {Object}
		 * @private
		 */
		function _constructHeaders() {
			return {
				'X-Application-Id': configuration.appId,
				'X-Rest-Api-Key': configuration.apiKey
			};
		}
		
		/**
		 * Convenience method for creating an URL string based on the configuration options.
		 * @param endpoint {string}
		 * @returns {string}
		 * @private
		 */
		function _constructUrl(endpoint) {
			return [
				configuration.root,
				configuration.apiVersion,
				'translate',
				configuration.platform,
				endpoint
			].join('/')
		}

		/**
		 * Check if localStorage persistance has expired by looking at the current time vs. the configured expiration time.
		 * @returns {boolean}
		 * @private
		 */
		function _isPersistanceExpired() {
			if(!configuration.persist) {
				return true;
			}
			return $localStorage[configuration.storageIdentifier + '-TranslateSettings'].expires < Date.now();
		}

		/**
		 * Convenience method to sanitize and store Languages in localStorage.
		 * @param data {object | array}
		 * @private
		 */
		function _persistLanguagesToStorage(data) {
			$localStorage[configuration.storageIdentifier + '-TranslateLanguages'] = data.data.data;
		}

		/**
		 * Convenience method to sanitize and store Best Fit Language in localStorage.
		 * @param data {object}
		 * @private
		 */
		function _persistBestFitLanguageToStorage(data) {
			$localStorage[configuration.storageIdentifier + '-TranslateBestFit'] = data.data.data;
		}

		/**
		 * Convenience method to sanitize and store all translation sections in localStorage.
		 * @param data {object | array}
		 * @private
		 */
		function _persistAllToStorage(data) {
			$localStorage[configuration.storageIdentifier + '-Translate'] = data.data.data;
			$localStorage[configuration.storageIdentifier + '-TranslateCurrentLanguage'] = data.data.meta.language;
		}

		/**
		 * Convenience method to sanitize and store a translation section in localStorage.
		 * @param section {string}
		 * @param data {object | array}
		 * @private
		 */
		function _persistSectionToStorage(section, data) {
			if(!$localStorage[configuration.storageIdentifier + '-Translate']) {
				$localStorage[configuration.storageIdentifier + '-Translate'] = {};
			}
			$localStorage[configuration.storageIdentifier + '-Translate'][section] = data.data.data;
			$localStorage[configuration.storageIdentifier + '-TranslateCurrentLanguage'] = data.data.meta.language;
		}

		/**
		 * Convenience method to delete the two commonly accessed localStorage objects (translation keys and languages)
		 * @private
		 */
		function _clearStorage() {
			delete $localStorage[configuration.storageIdentifier + '-Translate'];
			delete $localStorage[configuration.storageIdentifier + '-TranslateLanguages'];
		}

		/**
		 * Convencience method to create an exception message.
		 * @param key {string}
		 * @returns {string}
		 * @private
		 */
		function _nTranslateMissingKeyError(key) {
			return 'Required key: ' + key + ' is missing. Did you configure the nTranslateConfigProvider properly?'
		}

		/**
		 * Convencience method to create an exception message.
		 * @returns {string}
		 * @private
		 */
		function _nTranslateMissingIdentifier() {
			return 'Required key: storageIdentifier is missing. We need this key (usually the projectName) to persist data to localStorage'
		}

	}
	nTranslate.$inject = ["$exceptionHandler", "$q", "$http", "$localStorage", "nTranslateConfig"];

})();
