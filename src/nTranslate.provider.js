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
