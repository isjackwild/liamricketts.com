import React from 'react';
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
	}

	componentDidMount() {
		PubSub.publish('nav.update', false);
	}

	render() {
		return <Component {...this.props.data} />
	}
};

const Home = data(view);

export default Home;
