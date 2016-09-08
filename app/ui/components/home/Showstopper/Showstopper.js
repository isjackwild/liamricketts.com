import React from 'react';
import Loader from '../Loader/Loader.js';
import PubSub from 'pubsub-js';

const view = ({ isReady, isDimmed }) => {
	return (
		<section className={`showstopper ${isDimmed ? 'showstopper--dimmed' : ''}`}>
			<div className="showstopper__inner">
				<span className={`showstopper__wordmark ${isReady ? 'showstopper__wordmark--ready' : ''}`}>Liam Ricketts</span>
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
			isDimmed: false,
		}

		this.subs = [];
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('load.complete', () => {
			this.setState({ isReady: true });
		}));

		this.subs.push(PubSub.subscribe('overview.dim', (e, data) => {
			this.setState({ isDimmed: data });
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
