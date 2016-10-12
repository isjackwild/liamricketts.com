import React from 'react';
import PubSub from 'pubsub-js';
import _ from 'lodash';

const view = ({ x, y, opacity, translate, scale, isVisible, background }) => {
	return (
		<span
			className={`scroll-hint scroll-hint--${isVisible ? 'visible' : 'hidden'}`}
			style={{transform: `translate3d(${x}px, ${y}px, 0)`}}
		>
			<span
				className="scroll-hint__inner"
				style={{
					transform: `translate3d(0px, ${translate}px, 0) scale(${scale})`,
					opacity: opacity,
					backgroundColor: background,
				}}
			>
				Scroll down
			</span>
		</span>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			opacity: 1,
			translate: 0,
			scale: 1,
			isVisible: false,
			isRemoved: false,
			x: 0,
			y: 0,
		}

		this.onMouseWheel = _.throttle(this.onMouseWheel.bind(this), 16.66);
		this.onMouseMove = _.throttle(this.onMouseMove.bind(this), 16.66);
		this.subs = [];
	}

	componentDidMount() {
		window.addEventListener('mousewheel', this.onMouseWheel);
		window.addEventListener('wheel', this.onMouseWheel);
		window.addEventListener('mousemove', this.onMouseMove);
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
		window.removeEventListener('mousewheel', this.onMouseWheel);
		window.removeEventListener('wheel', this.onMouseWheel);
		window.removeEventListener('mousemove', this.onMouseMove);
	}

	removeSelf() {
		if (this.state.isRemoved) return;
		this.setState({ isRemoved: false });
		PubSub.publish('scroll-hint.remove', true);
		const count = localStorage.getItem('LRScrollHint') !== null ? parseInt(localStorage.getItem('LRScrollHint')) + 1 : 0;
		localStorage.setItem('LRScrollHint', count);
	}

	onMouseMove(e) {
		this.setState({
			isVisible: true,
			x: e.clientX,
			y: e.clientY,
		});
	}

	onMouseWheel(e) {
		let scale = this.state.scale + (e.deltaY / 650);
		let opacity = this.state.opacity + (e.deltaY / -40);
		let translate = this.state.translate + (e.deltaY * -1);
		opacity = _.clamp(opacity, 0, 1);
		translate = Math.min(translate, 0);
		scale = Math.max(scale, 1);
		if (opacity === 0) this.removeSelf();
		this.setState({ opacity, translate, scale });
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Showstopper = data(view);

export default Showstopper;
