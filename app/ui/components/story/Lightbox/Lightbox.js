import React from 'react';
import PubSub from 'pubsub-js';
import _ from 'lodash';

const view = ({ isVisible, isLoaded, mode, hide, width, height, src, loaderSrc, scrollX, scrollY }) => {
	return (
		<div
			className={`lightbox lightbox--${isVisible ? 'visible' : 'hidden'} lightbox--${isLoaded ? 'loaded' : 'loading'}`}
			onClick={hide}
		>
			<div
				className="lightbox__inner"
				style={{transform: `translate3d(${scrollX}px, ${scrollY}px, 0)`}}
			>
				<img
					className={`lightbox__image lightbox__image--${mode} ${!isLoaded ? 'lightbox__image--hidden' : ''}`}
					src={src}
					width={`${width}px`}
					height={`${height}px`}
				/>
				<img className={`lightbox__image-loader lightbox__image-loader--${mode} lightbox__image-loader--${isLoaded ? 'hidden' : 'visible'}`} src={loaderSrc} />
			</div>
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			isLoaded: false,
			loaderSrc: null,
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
			isMobile: (window.innerWidth > 768) ? false : true,
		}

		this.loadImage = new Image();
		this.nullifyTimeout = null;
		this.dampenDist = 300;
		this.subs = [];
		this.raf = undefined;
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.animate = this.animate.bind(this);
		this.onLoaded = this.onLoaded.bind(this);
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('lightbox.show', this.show));
		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousemove', this.onMouseMove);
		this.loadImage.onload = this.onLoaded;
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
		cancelAnimationFrame(this.raf);
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('mousemove', this.onMouseMove);
		this.loadImage.src = null;
		this.loadImage.onload = null;
		clearTimeout(this.nullifyTimeout);
	}

	onMouseMove(e) {
		if (!this.state.isVisible) return;
		const fromCenterX = e.clientX - (window.innerWidth / 2);
		const fromCenterY = e.clientY - (window.innerHeight / 2);
		const targetForceX = _.clamp(fromCenterX, -500, 500) * -0.05;
		const targetForceY = _.clamp(fromCenterY, -500, 500) * -0.05;

		this.setState({
			targetForceX,
			targetForceY,
		});
	}

	onResize() {
		const aspectRatio = window.innerHeight / window.innerWidth;
		const mode = this.state.image && this.state.image.aspectRatio > aspectRatio ? 'tall' : 'wide';
		const width = (mode === 'tall') ? window.innerWidth : window.innerHeight * this.state.image.aspectRatio;
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

		let dampeningY = 1;
		if (currentForceY > 0 && this.state.scrollY > (this.dampenDist * -1)) {
			dampeningY = Math.abs(this.state.scrollY) / this.dampenDist;
		} else if (currentForceY < 0 && this.state.scrollY < (this.state.overflowY - this.dampenDist) * -1) {
			dampeningY = (this.state.scrollY - (this.state.overflowY * -1)) / this.dampenDist;
		}

		let dampeningX = 1;
		if (currentForceX > 0 && this.state.scrollX > (this.dampenDist * -1)) {
			dampeningX = Math.abs(this.state.scrollX) / this.dampenDist;
		} else if (currentForceX < 0 && this.state.scrollX < (this.state.overflowX - this.dampenDist) * -1) {
			dampeningX = (this.state.scrollX - (this.state.overflowX * -1)) / this.dampenDist;
		}

		const easeOutCubic = (t) => (--t)*t*t+1;
		let scrollX = this.state.scrollX + (currentForceX * easeOutCubic(dampeningX));
		let scrollY = this.state.scrollY + (currentForceY * easeOutCubic(dampeningY));
		
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
		const width = (mode === 'tall') ? window.innerWidth : window.innerHeight / image.aspectRatio;
		const height = (mode === 'wide') ? window.innerHeight : window.innerWidth * image.aspectRatio;
		const overflowX = (mode === 'tall') ? 0 : width - window.innerWidth;
		const overflowY = (mode === 'wide') ? 0 : height - window.innerHeight;

		this.setState({
			scrollX: this.state.isMobile ? 0 : overflowX / -2,
			scrollY: this.state.isMobile ? 0 : overflowY / -2,
			currentForceX: 0,
			currentForceY: 0,
			targetForceX: 0,
			targetForceY: 0,
			image: image,
			src: this.state.isMobile ? image.medium : image.large,
			loaderSrc: image.small,
			isLoaded: false,
			mode,
			width,
			height, 
			overflowX,
			overflowY,
		});

		this.loadImage.src = image.large;
		// setTimeout(() => {
		// }, 16.666);
		requestAnimationFrame(() => {
			this.setState({ isVisible: true });
		});

		if (!this.state.isMobile) {
			this.animate();
		}
	}

	hide() {
		this.loadImage.src = null;
		this.setState({
			isVisible: false,
			currentForceX: 0,
			currentForceY: 0,
			targetForceX: 0,
			targetForceY: 0,
		});
		cancelAnimationFrame(this.raf);
		PubSub.publish('lightbox.hide');
		this.nullifyTimeout = setTimeout(() => {
			this.setState({
				src: null,
				loaderSrc: null,
			});
		}, 333);
	}

	onLoaded() {
		this.setState({ isLoaded: true });
	}

	render() {
		return <Component {...this.state} {...this.props} hide={this.hide} />
	}
};

const Lightbox = data(view);

export default Lightbox;
