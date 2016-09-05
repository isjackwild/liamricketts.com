import React from 'react';
import Master from './ui/layouts/Master/Master.js';
import Home from './ui/pages/Home/Home.js';
import Story from './ui/pages/Story/Story.js';

import { Route, IndexRoute } from 'react-router';

const Routes = (
	<Route path="/" component={Master}>
		<IndexRoute component={Home} />
		<Route path="/story/:storySlug" component={Story} />
	</Route>
);

export default Routes;
