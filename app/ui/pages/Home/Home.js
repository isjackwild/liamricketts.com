import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import Showstopper from '../../../ui/components/home/Showstopper/Showstopper.js';
import Overview from '../../../ui/components/home/Overview/Overview.js';


const view = () => {
	return (
		<div className="page page--home">
			<Showstopper />
			<Overview />
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.onScrolls = _.throttle(this.onScroll.bind(this), 16.66);
	}

	componentDidMount() {
		PubSub.publish('nav.update', false);
		window.addEventListener('scroll', this.onScroll);
		ga('send', 'pageview', window.location.pathname);

		if (window.homeScroll) {
			setTimeout(() => {
				document.body.scrollTop = window.homeScroll;
			}, 0);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	onScroll() {
		window.homeScroll = document.body.scrollTop;
	}

	render() {
		return <Component {...this.props.data} />
	}
};

const Home = data(view);

export default Home;
