import React from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import { StoryItem, StoryCover } from '../../../ui/components/story/StoryItem/StoryItem.js';
import Lightbox from '../../../ui/components/story/Lightbox/Lightbox.js';
import TweenLite from 'gsap';


class Story extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: window.stories[props.params.storySlug].title,
			tags: window.stories[props.params.storySlug].tags,
			subtitle: window.stories[props.params.storySlug].subtitle,
			items: window.stories[props.params.storySlug].items,
			background: window.stories[props.params.storySlug].background,
			nextSlug: window.stories[props.params.storySlug].next,
			width: 0,
			lastTouchX: 0,
			currentForce: 0,
			targetForce: 0,
			scrollPosition: 0,
			nextUpScrollPosition: 0,
			then: null,
			now: null,
			delta: 1,
			naturalForce: 0,
			isScrollDisabled: false,
			debounceTouchMove: false,
			incomingTransitionIsFinished: false,
		}

		// this.naturalForce = -0.12;
		this.sensitivity = 0.6;
		this.friction = window.innerWidth <= 768 ? 0.25 : 0.5;
		this.torque = 0.05;

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

		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousewheel', this.onMouseWheel);
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
		}
		TweenLite.fromTo(this.refs.inner, 1, fromTwo, toTwo);
		// TODO: Kill Tweens and do this using TimeLine
		
		setTimeout(() => {
			this.setState({ incomingTransitionIsFinished: true });
		}, 2222);

		setTimeout(() => {
			this.animate();
		}, 0);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('mousewheel', this.onMouseWheel);
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
		if (this.state.isScrollDisabled) return;

		e.preventDefault();
		this.setForce(e.deltaY);
	}

	onTouchStart(e) {
		if (this.state.isScrollDisabled) return;
		this.setState({lastTouchX: e.touches[0].clientX });
	}

	onTouchMove(e) {
		if (this.state.isScrollDisabled || this.state.debounceTouchMove) return;
		e.preventDefault();

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
		let naturalForce = null;
		if (delta === 0) naturalForce = this.state.naturalForce;
		if (delta < 0) naturalForce = 0.15;
		if (delta > 0) naturalForce = -0.15;

		this.setState({
			targetForce: (this.state.targetForce + (delta * -1 * this.sensitivity)),
			naturalForce, 
		});
	}

	animate() {
		const then = this.state.now ? this.state.now : null;
		const now = new Date().getTime();
		const delta = this.state.then ? (this.state.now - this.state.then) / 16.666 : 1;

		const minScroll = this.refs.inner.clientWidth * -1;
		let currentForce = this.state.currentForce + (this.state.targetForce - this.state.currentForce) * this.torque;
		const targetForce = this.state.targetForce + (this.state.naturalForce - this.state.targetForce) * this.friction;

		let scrollPosition = this.state.scrollPosition + currentForce * delta;
		let nextUpScrollPosition = this.state.nextUpScrollPosition + currentForce * delta;
		
		if (scrollPosition < minScroll && currentForce < 0)
			scrollPosition = window.innerWidth;
		if (scrollPosition > window.innerWidth && currentForce > 0)
			scrollPosition = minScroll;

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
		const { items, title, tags, subtitle, background, minScroll, incomingTransitionIsFinished } = this.state;
		const nextItems = window.stories[this.state.nextSlug].items;
		const nextTitle = window.stories[this.state.nextSlug].title;

		return (
			<div className="page page--story story" style={{ backgroundColor: background }}>
				<div className={`story__next-up story__next-up--${incomingTransitionIsFinished ? 'visible' : 'hidden'}`}>
					<span className="story__next-up-inner">
						<Link to={`/story/${this.state.nextSlug}`}>
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
						tags={tags}
						subtitle={subtitle}
						minScroll={minScroll}
					/>
					{
						items.map((item, i) => {
							return (
								<StoryItem
									item={item}
									index={i}
									key={i}
									minScroll={minScroll}
								/>
							)
						})
					}
				</div>
				<Lightbox />
			</div>
		);
	}
};

export default Story;
