import React from 'react';
import PubSub from 'pubsub-js';
import _ from 'lodash';

const view = ({ isVisible, isLoaded, mode, hide, width, height, src, loaderSrc, scrollX, scrollY, onTouchStart, onTouchMove }) => {
	return (
		<div
			className={`lightbox lightbox--${isVisible ? 'visible' : 'hidden'} lightbox--${isLoaded ? 'loaded' : 'loading'}`}
			onClick={hide}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
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
			index: 0,
			touchStart: 0,
			ignoreTouchMove: false,
			itemsFiltered: [],
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
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onTouchStart = this.onTouchStart.bind(this);
		this.onTouchMove = this.onTouchMove.bind(this);
		this.easing = 0.4;
		this.touchTO = null;
		this.swipeThreshold = 200;
		this.swipeTimeThreshold = 200;
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('lightbox.show', this.show));
		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('keydown', this.onKeyDown);
		this.loadImage.onload = this.onLoaded;
		console.log(_.filter(this.props.items, item => item.type === 'image'));
		this.setState({
			itemsFiltered: _.filter(this.props.items, item => item.type === 'image')
		});
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
		cancelAnimationFrame(this.raf);
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('keydown', this.onKeyDown);
		this.loadImage.src = null;
		this.loadImage.onload = null;
		clearTimeout(this.nullifyTimeout);
		clearTimeout(this.touchTO);
	}

	onMouseMove(e) {
		if (!this.state.isVisible) return;
		const fromCenterX = e.clientX - (window.innerWidth / 2);
		const fromCenterY = e.clientY - (window.innerHeight / 2);
		const targetForceX = _.clamp(fromCenterX, -500, 500) * -0.04;
		const targetForceY = _.clamp(fromCenterY, -500, 500) * -0.04;

		this.setState({
			targetForceX,
			targetForceY,
		});
	}

	onKeyDown(e) {
		switch(e.keyCode) {
			case 27:
				this.hide();
				break;
			case 37:
				if (this.state.index > 0) this.show(null, this.state.index - 1);
				break;
			case 39:
				if (this.state.index < this.state.itemsFiltered.length - 1) this.show(null, this.state.index + 1);
				break;
		}
	}

	onTouchStart(e) {
		clearTimeout(this.touchTO);
		this.setState({
			ignoreTouchMove: false,
			touchStart: e.touches[0].clientX,
		});
		this.touchTO = setTimeout(() => {
			this.setState({ ignoreTouchMove: true });
		}, this.swipeTimeThreshold);
	}

	onTouchMove(e) {
		if (this.state.ignoreTouchMove) return;
		const diff = this.state.touchStart - e.touches[0].clientX;
		if (diff < this.swipeThreshold * -1 && this.state.index > 0) {
			this.show(null, this.state.index - 1);
			this.setState({ ignoreTouchMove: true });
			clearTimeout(this.touchTO);
			return;
		} else if (diff > this.swipeThreshold &&  this.state.index < this.state.itemsFiltered.length - 1) {
			this.show(null, this.state.index + 1);
			this.setState({ ignoreTouchMove: true });
			clearTimeout(this.touchTO);
			return 
		}
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
		const currentForceX = this.state.currentForceX + (this.state.targetForceX - this.state.currentForceX) * this.easing;
		const currentForceY = this.state.currentForceY + (this.state.targetForceY - this.state.currentForceY) * this.easing;

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

	show(e, index) {
		cancelAnimationFrame(this.raf);
		const { images, size } = this.state.itemsFiltered[index];
		const mode = images.aspectRatio > this.state.aspectRatio ? 'tall' : 'wide';
		const width = (mode === 'tall') ? window.innerWidth : window.innerHeight / images.aspectRatio;
		const height = (mode === 'wide') ? window.innerHeight : window.innerWidth * images.aspectRatio;
		const overflowX = (mode === 'tall') ? 0 : width - window.innerWidth;
		const overflowY = (mode === 'wide') ? 0 : height - window.innerHeight;

		const loaderSrc = (() => {
			switch(size) {
				case 'small':
					return images.medium;
				case 'medium':
				case 'large':
					return images.large;
				default:
					return images.medium;
			}
		})();

		this.setState({
			scrollX: this.state.isMobile ? 0 : overflowX / -2,
			scrollY: this.state.isMobile ? 0 : overflowY / -2,
			currentForceX: 0,
			currentForceY: 0,
			targetForceX: 0,
			targetForceY: 0,
			image: images,
			src: this.state.isMobile ? images.medium : images.large,
			loaderSrc,
			isLoaded: false,
			mode,
			width,
			height, 
			overflowX,
			overflowY,
			index,
		});

		this.loadImage.src = images.large;
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
		return <Component {...this.state} {...this.props} hide={this.hide} onTouchMove={this.onTouchMove} onTouchStart={this.onTouchStart} />
	}
};

const Lightbox = data(view);

export default Lightbox;
