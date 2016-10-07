import React from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import { StoryItem, StoryCover } from '../../../ui/components/story/StoryItem/StoryItem.js';
import Lightbox from '../../../ui/components/story/Lightbox/Lightbox.js';
import ScrollHint from '../../../ui/components/story/ScrollHint/ScrollHint.js';
import TweenLite from 'gsap';


class Story extends React.Component {
	constructor(props) {
		super(props);
		const count = localStorage.getItem('LRScrollHint') !== null ? parseInt(localStorage.getItem('LRScrollHint')) : 0;

		this.state = {
			title: window.stories[props.params.storySlug].title,
			metadata: window.stories[props.params.storySlug].metadata,
			subtitle: window.stories[props.params.storySlug].subtitle,
			items: window.stories[props.params.storySlug].items,
			background: window.stories[props.params.storySlug].background,
			nextSlug: window.stories[props.params.storySlug].next,
			width: 0,
			lastTouchX: 0,
			currentForce: 0,
			targetForce: 0,
			scrollPosition: 0,
			then: null,
			now: null,
			delta: 1,
			naturalForce: 0,
			isScrollDisabled: false,
			debounceTouchMove: false,
			incomingTransitionIsFinished: false,
			isScrollHintInclude: count < 3 ? true : false,
			// isScrollHintInclude: true,
		}

		// this.naturalForce = -0.12;
		this.sensitivity = window.innerWidth <= 768 ? 0.73 : 0.6;
		this.friction = window.innerWidth <= 768 ? 0.1 : 0.3;
		this.torque = window.innerWidth <= 768 ? 0.25 : 0.05;
		this.dampenDist = Math.min(500, window.innerWidth * 0.66);

		this.animate = this.animate.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onMouseWheel = this.onMouseWheel.bind(this);
		this.onTouchStart = this.onTouchStart.bind(this);
		this.onTouchMove = _.throttle(this.onTouchMove.bind(this), 16);
		this.onTouchEnd = this.onTouchEnd.bind(this);

		this.subs = []
	}

	componentDidMount() {
		setTimeout(() => {
			PubSub.publish('nav.update', this.state.title);
		}, 0);

		this.subs.push(PubSub.subscribe('about.toggle', (e, data) => {
			this.setState({ isScrollDisabled: data });
		}));

		this.subs.push(PubSub.subscribe('scroll-hint.remove', (e, data) => {
			this.setState({ isScrollHintInclude: false });
		}));

		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousewheel', this.onMouseWheel);
		window.addEventListener('wheel', this.onMouseWheel);
		window.addEventListener('touchstart', this.onTouchStart);
		window.addEventListener('touchmove', this.onTouchMove);
		window.addEventListener('touchend', this.onTouchEnd);

		this.onResize();

		const fromOne = {
			x: Math.max(window.innerWidth / 4, 300),
			opacity: 0,
		}
		const toOne = {
			x: 0,
			delay: 0.05,
			ease: Power2.easeOut,
		}
		TweenLite.fromTo(this.refs.inner, 2.2, fromOne, toOne);

		const fromTwo = {
			opacity: 0,
		}
		const toTwo = {
			opacity: 1,
			ease: Sine.easeIn,
			onComplete: () => { this.setState({ incomingTransitionIsFinished: true }) }
		}
		TweenLite.fromTo(this.refs.inner, 1, fromTwo, toTwo);
		// TODO: Kill Tweens and do this using TimeLine
		
		// setTimeout(() => {
		// 	this.setState({ incomingTransitionIsFinished: true });
		// }, 2222);

		setTimeout(() => {
			this.animate();
		}, 0);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('mousewheel', this.onMouseWheel);
		window.removeEventListener('wheel', this.onMouseWheel);
		window.removeEventListener('touchstart', this.onTouchStart);
		window.removeEventListener('touchmove', this.onTouchMove);
		window.removeEventListener('touchend', this.onTouchEnd);
		cancelAnimationFrame(this.raf);
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	onResize() {
		const width = this.refs.inner.clientWidth;
		this.setState({ width });
	}

	onMouseWheel(e) {
		e.preventDefault();
		if (this.state.isScrollDisabled || !this.state.incomingTransitionIsFinished) return;

		this.setForce(e.deltaY);
	}

	onTouchStart(e) {
		if (this.state.isScrollDisabled || !this.state.incomingTransitionIsFinished) return;
		this.setState({lastTouchX: e.touches[0].clientX });
	}

	onTouchMove(e) {
		e.preventDefault();
		if (this.state.isScrollDisabled || this.state.debounceTouchMove || !this.state.incomingTransitionIsFinished) return;

		const delta = (this.state.lastTouchX - e.touches[0].clientX);
		this.setState({
			lastTouchX: e.touches[0].clientX,
			debounceTouchMove: true,
		});
		this.setForce(delta)
	}

	onTouchEnd(e) {
		// e.preventDefault();
		// e.stopPropagation();
		this.setForce(0);
	}

	setForce(delta) {
		// let naturalForce = null;
		// if (delta === 0) naturalForce = this.state.naturalForce;
		// if (delta < 0) naturalForce = 0.15;
		// if (delta > 0) naturalForce = -0.15;

		this.setState({
			targetForce: (this.state.targetForce + (delta * -1 * this.sensitivity)),
			// naturalForce,
		});
	}

	animate() {
		const then = this.state.now ? this.state.now : null;
		const now = new Date().getTime();
		const delta = this.state.then ? (this.state.now - this.state.then) / 16.666 : 1;

		const minScroll = this.refs.inner.clientWidth * -1;
		let currentForce = this.state.currentForce + (this.state.targetForce - this.state.currentForce) * this.torque;
		const targetForce = this.state.targetForce + (this.state.naturalForce - this.state.targetForce) * this.friction;


		let dampening = 1;
		if (currentForce > 0 && this.state.scrollPosition > (this.dampenDist * -1)) {
			dampening = Math.abs(this.state.scrollPosition) / this.dampenDist;
		} else if (currentForce < 0 && this.state.scrollPosition < (this.state.minScroll + this.dampenDist)) {
			dampening = (this.state.scrollPosition - this.state.minScroll) / this.dampenDist;
		}

		const easeOutCubic = (t) => (--t)*t*t+1;
		let scrollPosition = this.state.scrollPosition + currentForce * delta * easeOutCubic(dampening);
		
		// if (scrollPosition < minScroll && currentForce < 0)
		// 	scrollPosition = window.innerWidth;
		// if (scrollPosition > window.innerWidth && currentForce > 0)
		// 	scrollPosition = minScroll;
		// 	
		scrollPosition = _.clamp(scrollPosition, minScroll, 0);

		this.setState({
			minScroll,
			currentForce,
			targetForce,
			scrollPosition,
			now,
			then,
			delta,
			debounceTouchMove: false,
		});
		this.raf = requestAnimationFrame(this.animate);
	}

	render() {
		const { items, title, metadata, subtitle, background, minScroll, incomingTransitionIsFinished, isScrollHintInclude } = this.state;
		let nextItems = window.stories[this.state.nextSlug].items;
		if (window.innerWidth <= 768) nextItems = nextItems.slice(0, 12);
		const nextTitle = window.stories[this.state.nextSlug].title;
		let lightboxIndex = -1;
		return (
			<div className="page page--story story" style={{ backgroundColor: background }}>
				<div className={`story__next-up story__next-up--${incomingTransitionIsFinished ? 'visible' : 'hidden'}`}>
					<span className="story__next-up-inner">
						<Link to={`/stories/${this.state.nextSlug}`}>
							{
								nextItems.map((item, i) => {
									return (
										<img
											src={item.images.small}
											key={i}
											className="story__next-up-image"
										/>
									)
								})
							}
						</Link>
					</span>
					<span className="story__next-up-span-wrapper">
						<span className="story__next-up-span story__next-up-span--text">Next up: </span>
						<Link to={`/story/${this.state.nextSlug}`}>
							<span className="story__next-up-span story__next-up-span--title">{nextTitle}</span>
						</Link>
					</span>
				</div>
				<div
					className="story__inner"
					ref="inner"
					style={{transform: `translate3d(${this.state.scrollPosition}px, 0, 0)`, backgroundColor: background}}
				>
					<StoryCover
						title={title}
						metadata={metadata}
						subtitle={subtitle}
						minScroll={minScroll}
					/>
					{
						items.map((item, i) => {
							if (item.type === 'image') lightboxIndex++;
							return (
								<StoryItem
									item={item}
									lightboxIndex={item.type === 'image' ? lightboxIndex : null}
									key={i}
									minScroll={minScroll}
								/>
							)
						})
					}
				</div>
				{isScrollHintInclude ?
					<ScrollHint background={background} />
					:
					null
				}
				<Lightbox items={items} />
			</div>
		);
	}
};

export default Story;
