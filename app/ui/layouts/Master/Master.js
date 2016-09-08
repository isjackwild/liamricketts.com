import React from 'react';
import About from '../../../ui/components/shared/About/About.js';
import Nav from '../../../ui/components/shared/Nav/Nav.js';
import Title from '../../../ui/components/shared/Title/Title.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import TransitionManager from '../../../ui/TransitionManager.js';


	// <TransitionManager location={ location } params={params} >
	// 			</TransitionManager>
const view = ({ location, children, isReady, params }) => {
	return (
		<div className="master-layout">
			<main className={`page-content ${isReady ? 'page-content--ready' : ''}`}>
				<ReactCSSTransitionGroup 
					transitionName="transition--fade"
					transitionEnterTimeout={900} 
					transitionLeaveTimeout={450}>
					{ React.cloneElement(children, { key: location.pathname }) }
				</ReactCSSTransitionGroup>
			
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
			document.body.classList.add('is-init');
		}, 33);
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Master = data(view);

export default Master;

