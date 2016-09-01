import React from 'react';
import Master from './ui/layouts/Master/Master.js';
import About from './ui/pages/About/About.js';
import Contact from './ui/pages/Contact/Contact.js';

import { Route, IndexRoute } from 'react-router';
// import TransitionManager from './ui/TransitionManager.js';

const Routes = (
	<Route path="/" component={Master}>
		<IndexRoute component={About} />
		<Route path="about" component={About} />
		<Route path="contact" component={Contact} />
	</Route>
);

export default Routes;
