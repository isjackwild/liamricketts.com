import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes.js';

import { dataStore } from './app.js';

import { init as initLoadManager } from './lib/load-manager.js';

/*
	On the server, optionally render initial page JSON.
	window.initPageSlug should be the key.
	window.initPageData should be the JSON.
 */
if (window.initCollectionSlug) {
	dataStore[`${window.location.origin}/api/${window.initCollectionSlug}`] = window.initCollectionData;
}

initLoadManager();

render((
	<Router history={browserHistory} routes={routes} />
), document.getElementById('react-root'));
