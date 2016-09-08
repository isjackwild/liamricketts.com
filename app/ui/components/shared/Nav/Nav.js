import React from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';

const view = ({ toggleAbout, isAboutVisible, isAboutToggleEnabled, isVisible, storyTitle, hideAbout }) => {
	return (
		<nav className={`nav nav--${isVisible ? 'visible' : 'hidden'}`}>
			<ul className="nav__breadcrumbs" onClick={hideAbout}>
				<li className="nav__wordmark">
					<Link to='/'>Liam Ricketts</Link>
				</li>
				{isAboutVisible ?
					<li className="nav__breadcrumb">
						<span className="nav__breadcrumb-dash">—</span>
						About
					</li>
					:
					null
				}
				{!isAboutVisible ?
					<li className="nav__breadcrumb">
						<span className="nav__breadcrumb-dash">—</span>
						<Link to='/'>Stories</Link>
					</li>
					:
					null
				}
				{storyTitle && !isAboutVisible ?
					<li className="nav__breadcrumb">
						<span className="nav__breadcrumb-dash">—</span>
						{storyTitle}
					</li>
					:
					null
				}
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
			isVisible: true,
			isAboutToggleEnabled: true,
			storyTitle: false,
		}

		this.toggleAbout = this.toggleAbout.bind(this);
		this.hideAbout = this.hideAbout.bind(this);
		this.subs = [];
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('about.toggle', (e, data) => {
			this.setState({ isAboutVisible: data });
		}));

		this.subs.push(PubSub.subscribe('nav.update', (e, data) => {
			this.setState({ storyTitle: data });
		}));

		this.subs.push(PubSub.subscribe('lightbox.show', (e, data) => {
			this.setState({ isVisible: false });
		}));

		this.subs.push(PubSub.subscribe('lightbox.hide', (e, data) => {
			this.setState({ isVisible: true });
		}));

		this.subs.push(PubSub.subscribe('overview.dim', (e, data) => {
			this.setState({ isVisible: !data });
		}));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	hideAbout() {
		PubSub.publish('about.toggle', false);
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
		return <Component {...this.state} {...this.props} toggleAbout={this.toggleAbout} hideAbout={this.hideAbout} />
	}
};

const Nav = data(view);

export default Nav;
