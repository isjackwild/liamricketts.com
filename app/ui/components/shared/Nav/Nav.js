import React from 'react';
import PubSub from 'pubsub-js';

const view = ({ toggleAbout, isAboutVisible, isAboutToggleEnabled }) => {
	return (
		<nav className="nav">
			<ul className="nav__breadcrumbs">
				<li className="nav__wordmark">Liam Ricketts</li>
				<span className="nav__breadcrumb-dash">—</span>
				<li className="nav__breadcrumb">Test</li>
				<span className="nav__breadcrumb-dash">—</span>
				<li className="nav__breadcrumb">Goes Here</li>
			</ul>

			<span className={`nav__about-toggle nav__about-toggle--${isAboutVisible ? 'active' : 'inactive'} nav__about-toggle--${isAboutToggleEnabled ? 'enabled' : 'disabled'}`} onClick={toggleAbout}>
				<span className="nav__about-toggle-open">About & Contact</span>
				<span className="nav__about-toggle-back">
					<span className="nav__back-hand">☜</span>Back
				</span>
			</span>
		</nav>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAboutVisible: false,
			isAboutToggleEnabled: true,
		}

		this.toggleAbout = this.toggleAbout.bind(this);
		this.subs = [];
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('about.toggle', (e, data) => {
			this.setState({ isAboutVisible: data });
		}));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	toggleAbout() {
		if (!this.state.isAboutToggleEnabled) return;

		this.setState({ isAboutToggleEnabled: false });
		setTimeout(() => {
			this.setState({ isAboutToggleEnabled: true });
		}, 333);

		PubSub.publish('about.toggle', !this.state.isAboutVisible);
	}

	render() {
		return <Component {...this.state} {...this.props} toggleAbout={this.toggleAbout} />
	}
};

const Nav = data(view);

export default Nav;
