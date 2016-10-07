import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import PubSub from 'pubsub-js';

const view = ({ toggleAbout, isAboutVisible, isVisible, storyTitle, hideAbout, isUp }) => {
	return (
		<nav className={`nav nav--${isVisible ? 'visible' : 'hidden'}`}>
			<ul className={`nav__breadcrumbs nav__breadcrumbs--${isUp && !isAboutVisible? 'up' : 'down'}`} onClick={hideAbout}>
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
				{storyTitle && !isAboutVisible ?
					<li className="nav__breadcrumb">
						<span className="nav__breadcrumb-dash">—</span>
						{storyTitle}
					</li>
					:
					null
				}
			</ul>

			<span className={`nav__about-toggle nav__about-toggle--${isAboutVisible ? 'active' : 'inactive'} nav__about-toggle--${isUp && !isAboutVisible ? 'up' : 'down'}`} onClick={toggleAbout}>
				{window.innerWidth <= 768 ?
					<span className="nav__about-toggle-open nav__icon">ℹ</span>
					:
					<span className="nav__about-toggle-open">Info</span>
				}
				{window.innerWidth <= 768 ?
					<span className="nav__about-toggle-back nav__icon">🔙</span>
					:
					<span className="nav__about-toggle-back">
						Back
					</span>
				}
				
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
			isUp: window.location.pathname === '/' ? true : false,
			storyTitle: false,
			currentLocation: null,
		}

		this.toggleAbout = this.toggleAbout.bind(this);
		this.hideAbout = this.hideAbout.bind(this);
		this.getIsUp = this.getIsUp.bind(this);
		this.onScroll = _.throttle(this.onScroll.bind(this), 16.66);
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
			if (window.innerWidth <= 768) this.setState({ isVisible: !data });
		}));

		this.subs.push(PubSub.subscribe('navigate.to', (e, data) => {
			this.setState({ currentLocation: data.pathname });
			this.getIsUp();
		}));

		window.addEventListener('scroll', this.onScroll);
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
		window.removeEventListener('scroll', this.onScroll);
	}

	hideAbout() {
		PubSub.publish('about.toggle', false);
	}

	toggleAbout() {
		PubSub.publish('about.toggle', !this.state.isAboutVisible);
	}

	getIsUp() {
		if (this.state.currentLocation !== '/') return this.setState({ isUp: false });
		
		const overviewScrollTop = document.getElementsByClassName('overview')[0].offsetTop - 15;
		
		if (document.body.scrollTop >= overviewScrollTop && this.state.isUp) return this.setState({ isUp: false });
		if (document.body.scrollTop < overviewScrollTop && !this.state.isUp) return this.setState({ isUp: true });
	}

	onScroll() {
		this.getIsUp();
	}

	render() {
		return <Component {...this.state} {...this.props} toggleAbout={this.toggleAbout} hideAbout={this.hideAbout} />
	}
};

const Nav = data(view);

export default Nav;
