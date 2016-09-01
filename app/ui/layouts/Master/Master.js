import React from 'react';
import About from '../../../ui/components/shared/About/About.js';
import Nav from '../../../ui/components/shared/Nav/Nav.js';

import TransitionManager from '../../../ui/TransitionManager.js';

const Master = ({ location, children }) => {
	return (
		<div className="master-layout">
			<main className="page-content">
				<TransitionManager location={ location }>
					{ children }
				</TransitionManager>
			</main>
			<About />
			<Nav />
		</div>
	);
};

export default Master;

