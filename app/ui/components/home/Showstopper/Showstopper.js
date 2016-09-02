import React from 'react';
import Loader from '../Loader/Loader.js';
import PubSub from 'pubsub-js';

const view = ({ isReady }) => {
	return (
		<section className="showstopper">
			<div className="showstopper__inner">
				<span className="showstopper__wordmark">Liam Ricketts</span>
				<Loader />
			</div>
			<div className={`showstopper__arrow ${isReady ? 'showstopper__arrow--ready' : ''}`}></div>
		</section>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isReady: false,
		}

		this.subs = [];
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('load.complete', () => {
			this.setState({ isReady: true });
		}));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Showstopper = data(view);

export default Showstopper;
