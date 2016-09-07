import React from 'react';
import PubSub from 'pubsub-js';
import _ from 'lodash';

const view = ({ isVisible, mode, hide, width, height, src, scrollX, scrollY }) => {
	return (
		<div
			className={`lightbox lightbox--${isVisible ? 'visible' : 'hidden'}`}
			onClick={hide}
		>
			<div
				className="lightbox__inner"
				style={{transform: `translate3d(${scrollX}px, ${scrollY}px, 0)`}}
			>
				<img className={`lightbox__image lightbox__image--${mode}`} src={src} />
			</div>
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			src: null,
			mode: null,
			aspectRatio: window.innerHeight / window.innerWidth,
			width: 0,
			height: 0,
			overflowX: 0,
			overflowY: 0,
			currentForceX: 0,
			currentForceY: 0,
			targetForceX: 0,
			targetForceY: 0,
			scrollX: 0,
			scrollY: 0,
		}

		this.subs = [];
		this.raf = undefined;
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.animate = this.animate.bind(this);
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('lightbox.show', this.show));
		this.subs.push(PubSub.subscribe('lightbox.hide', this.hide));
		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousemove', this.onMouseMove);
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
		cancelAnimationFrame(this.raf);
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('mousemove', this.onMouseMove);
	}

	onMouseMove(e) {
		if (!this.state.isVisible) return;
		const fromCenterX = e.clientX - (window.innerWidth / 2);
		const fromCenterY = e.clientY - (window.innerHeight / 2);
		const targetForceX = _.clamp(fromCenterX, -500, 500) * -0.05;
		const targetForceY = _.clamp(fromCenterY, -300, 300) * -0.05;

		this.setState({
			targetForceX,
			targetForceY,
		});
		console.log(targetForceX, targetForceY)
	}

	onResize() {
		const aspectRatio = window.innerHeight / window.innerWidth;
		const mode = this.state.image.aspectRatio > aspectRatio ? 'tall' : 'wide';
		const width = (mode === 'tall') ? window.innerWidth : window.innerWidth * this.state.image.aspectRatio;
		const height = (mode === 'wide') ? window.innerHeight : window.innerWidth * this.state.image.aspectRatio;
		const overflowX = (mode === 'tall') ? 0 : width - window.innerWidth;
		const overflowY = (mode === 'wide') ? 0 : height - window.innerHeight;

		this.setState({
			aspectRatio,
			mode,
			width,
			height,
			overflowX,
			overflowY,
		});
	}

	animate() {
		const currentForceX = this.state.currentForceX + (this.state.targetForceX - this.state.currentForceX) * 0.022;
		const currentForceY = this.state.currentForceY + (this.state.targetForceY - this.state.currentForceY) * 0.022;

		let scrollX = this.state.scrollX + currentForceX;
		let scrollY = this.state.scrollY + currentForceY;
		
		scrollX = _.clamp(scrollX, (this.state.overflowX * -1), 0);
		scrollY = _.clamp(scrollY, (this.state.overflowY * -1), 0);

		this.setState({
			scrollX,
			scrollY,
			currentForceX,
			currentForceY,
		});

		this.raf = requestAnimationFrame(this.animate);
	}

	show(e, image) {
		const mode = image.aspectRatio > this.state.aspectRatio ? 'tall' : 'wide';
		const width = (mode === 'tall') ? window.innerWidth : window.innerWidth / image.aspectRatio;
		const height = (mode === 'wide') ? window.innerHeight : window.innerWidth * image.aspectRatio;
		const overflowX = (mode === 'tall') ? 0 : width - window.innerWidth;
		const overflowY = (mode === 'wide') ? 0 : height - window.innerHeight;

		this.setState({
			scrollX: 0,
			scrollY: 0,
			currentForceX: 0,
			currentForceY: 0,
			targetForceX: 0,
			targetForceY: 0,
			isVisible: true,
			image: image,
			src: image.large,
			mode,
			width,
			height, 
			overflowX,
			overflowY,
		});

		this.animate();
	}

	hide() {
		this.setState({
			isVisible: false,
			currentForceX: 0,
			currentForceY: 0,
			targetForceX: 0,
			targetForceY: 0,
		});
		cancelAnimationFrame(this.raf);
	}

	render() {
		return <Component {...this.state} {...this.props} hide={this.hide} />
	}
};

const Lightbox = data(view);

export default Lightbox;
