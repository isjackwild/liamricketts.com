import React from 'react';
import Loader from '../Loader/Loader.js';
import PubSub from 'pubsub-js';
import TweenLite from 'gsap';
import _ from 'lodash';
import { init, kill } from './cloth-scene.js';

const view = ({ isReady, isDimmed, scrollDown, coverOpacity }) => {
	return (
		<section className={`showstopper ${isDimmed ? 'showstopper--dimmed' : ''}`}>
			<div className="showstopper__inner">
				<canvas className='showstopper__canvas'></canvas>
				<span className={`showstopper__wordmark ${isReady ? 'showstopper__wordmark--ready' : ''}`}>Liam Ricketts</span>
				<Loader />
				<div
					className="showstopper__shim"
					style={{opacity: coverOpacity}}
				></div>
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
			coverOpacity: 0,
		}

		this.onScroll = _.throttle(this.onScroll.bind(this), 16.66);
		// this.onScroll = this.onScroll.bind(this);
		this.subs = [];
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('load.complete', () => {
			this.setState({ isReady: true });
		}));

		this.subs.push(PubSub.subscribe('overview.dim', (e, data) => {
			this.setState({ isDimmed: data });
		}));

		window.addEventListener('scroll', this.onScroll);

		init();
	}

	componentWillUnmount() {
		kill();
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
		window.removeEventListener('scroll', this.onScroll);
	}

	onScroll() {
		console.log('scroll');
		const overviewScrollTop = document.getElementsByClassName('overview')[0].offsetTop - (window.innerHeight / 5);
		const multiplier = document.body.scrollTop / overviewScrollTop;
		const coverOpacity = _.clamp(multiplier, 0, 1);
		this.setState({ coverOpacity });
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
