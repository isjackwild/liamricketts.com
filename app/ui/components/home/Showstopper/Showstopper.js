import React from 'react';
import Loader from '../Loader/Loader.js';
import PubSub from 'pubsub-js';
import TweenLite from 'gsap';
import { init, kill } from './cloth-scene.js';

const view = ({ isReady, isDimmed, scrollDown }) => {
	return (
		<section className={`showstopper ${isDimmed ? 'showstopper--dimmed' : ''}`}>
			<div className="showstopper__inner">
				<canvas className='showstopper__canvas'></canvas>
				<span className={`showstopper__wordmark ${isReady ? 'showstopper__wordmark--ready' : ''}`}>Liam Ricketts</span>
				<Loader />
			</div>
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

		init();
	}

	componentWillUnmount() {
		kill();
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	// scrollDown() {
	// 	const scrollTop = document.getElementsByClassName('overview')[0].offsetTop;
	// 	const to = {
	// 		scrollTop,
	// 		ease: Power3.easeInOut,
	// 	}

	// 	TweenLite.to(document.body, 0.8, to);
	// }

	render() {
		return <Component {...this.state} {...this.props} scrollDown={this.scrollDown} />
	}
};

const Showstopper = data(view);

export default Showstopper;
