nCore.nTranslate
================
*This module is build specifically for our nStack cloud solutions. If you don't work with any Nodes Agency services, this module will be of little use to you.*
------

This module makes working with nStack translate easy, and helps your applications performance and loadtime by persisting translation values in localstorage.

### Getting started

##### Bower

```bash
bower install nTranslate --save
```

##### Require nCore.nTranslate

```javascript
angular.module('app', [
    'nCore.nTranslate'
]);
```

Usage
=====

In order to use the nTranslate module, you must first configure some required options:

```javascript 
angular.module('app')
	.configure(function(nTranslateConfigProvider) {
		nTranslateConfigProvider.configure({
			appId: 'foo',
			apiKey: 'bar'
		});
	});
```

The ```appId``` and ```apiKey``` are mandatory, if these are not provided we throw exceptions at you.

##### About localstorage persistance

In order to take advantage of persisting values in localstorage, one additional option is required.
You will have to configure the ```storageIdentifier``` option with a name that identifies this app from others.
We do this in order to be able to differentiate between development projects, as these all usually are served from localhost,
which can have some annoying side effects as localstorage is tied to the domain the site is served from.

##### Options

Following is a list of options that can be configured during the config phase of your Angular application:

| Key               | Default                                                                 | Description                                                              |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| root              | ```'https://nstack.io/api'```                                           | The root nStack endpoint                                                 |
| apiVersion        | ```'v1'```                                                              | The API version                                                          |
| platform          | ```'web'```                                                             | The platform from which to get keys                                      |
| endpoints         | ```{languages:'languages',bestFit:'languages/best_fit', keys:'keys'}``` | An object containing the three queryable endpoints                       |
| apiKey *required* | ```null```                                                              | The apiKey for authorizing the application                               |
| appId *required*  | ```null```                                                              | The appId for identifying the application                                |
| storageIdentifier | ```null```                                                              | A unique identifier for localStorage *required if ```persist``` is true* |
| persist           | ```true```                                                              | Persist translation data in localstorage                                 |
| expires           | ```Date.now() + (24 * 60 * 60 * 1000)``` (24 Hours)                     | How long should translation be persisted for?                            |

##### Methods

The nTranslate services has the following methods:

###### ```getLanguages([showInactiveLanguages, forceExpiry])```

Returns an array of all languages.

Optional arguments:

- ```showInactiveLanguages``` - If true, also fetches languages that has not yet been activated (for development purposes)
- ```forceExpiry``` - If true, invalidates the cache and forces data to be loaded from the API

###### ```getBestFitLanguage([showInactiveLanguages, forceExpiry])```

Returns the bestFitLanguage object. This is done by the server compairing the Accept-Languages header in the request with the registerred languages.

Optional arguments:

- ```showInactiveLanguages``` - If true, also compares against languages that has not yet been activated (for development purposes)
- ```forceExpiry``` - If true, invalidates the cache and forces data to be loaded from the API

###### ```getAllKeys([forceExpiry])```

Returns an array of all translation sections and the corresponding key/value pairs

Optional arguments:

- ```forceExpiry``` - If true, invalidates the cache and forces data to be loaded from the API

###### ```getKeysFromSection(section, [forceExpiry])```

Returns an object of a single translation section and the corresponding key/value pairs

Optional arguments:

- ```forceExpiry``` - If true, invalidates the cache and forces data to be loaded from the API

---

##### Example

- Resolve in a ui-router state configuration

This is our recommended approach:
Use our abstract ```application``` state and have the application wait for the all sections and keys to be loaded (either from localstorage or from the API)
*or*
Resolve one section pr. state.

```javascript 
angular.module('application')
	.configure(function($stateProvider) {
		$stateProvider
			.state({
				name: 'application',
				abstract: true,
				views: {},
				resolve: {
					translate: function(nTranslate) {
						return nTranslate.getAllKeys();
						// or
						return nTranslate.getKeysFromSection('fooBar');
					}
				}
			})
	});
```
