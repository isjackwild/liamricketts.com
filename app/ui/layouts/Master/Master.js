import React from 'react';

import TransitionManager from '../../TransitionManager.js';

const Master = ({ location, children }) => {
	return (
		<div className="master-layout">
			<main className="page-content">
				<TransitionManager location={ location }>
					{ children }
				</TransitionManager>
			</main>
		</div>
	);
};

export default Master;

