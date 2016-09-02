import React from 'react';
import About from '../../../ui/components/shared/About/About.js';
import Nav from '../../../ui/components/shared/Nav/Nav.js';

import TransitionManager from '../../../ui/TransitionManager.js';

const view = ({ location, children, isReady }) => {
	return (
		<div className="master-layout">
			<main className={`page-content ${isReady ? 'page-content--ready' : ''}`}>
				<TransitionManager location={ location }>
					{ children }
				</TransitionManager>
			</main>
			<About />
			<Nav />
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isReady: false,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ isReady: true });
		}, 33);
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Master = data(view);

export default Master;

