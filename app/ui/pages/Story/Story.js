import React from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import { StoryItem, StoryCover } from '../../../ui/components/story/StoryItem/StoryItem.js';
import Lightbox from '../../../ui/components/story/Lightbox/Lightbox.js';
import TweenMax from 'gsap';


class Story extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: window.stories[props.params.storySlug].title,
			tags: window.stories[props.params.storySlug].tags,
			subtitle: window.stories[props.params.storySlug].subtitle,
			items: window.stories[props.params.storySlug].items,
			background: window.stories[props.params.storySlug].background,
			width: 0,
			currentForce: -0.15,
			targetForce: -0.15,
			scrollPosition: 0,
			then: null,
			now: null,
			delta: 1,
			naturalForce: 0,
		}

		// this.naturalForce = -0.12;
		this.sensitivity = 0.6;
		this.friction = 0.5;
		this.torque = 0.05;

		this.animate = this.animate.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onMouseWheel = this.onMouseWheel.bind(this);
	}

	componentDidMount() {
		setTimeout(() => {
			PubSub.publish('nav.update', this.state.title);
		}, 0);

		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousewheel', this.onMouseWheel);
		this.onResize();

		const fromOne = {
			x: window.innerWidth / 5,
			opacity: 0,
		}
		const toOne = {
			x: 0,
			delay: 0.05,
			ease: Power2.easeOut,
		}
		TweenMax.fromTo(this.refs.inner, 2.2, fromOne, toOne);

		const fromTwo = {
			opacity: 0,
		}
		const toTwo = {
			opacity: 1,
			ease: Sine.easeIn,
		}
		TweenMax.fromTo(this.refs.inner, 1, fromTwo, toTwo);
		// TODO: Kill Tweens and do this using TimeLine

		setTimeout(() => {
			this.animate();
		}, 0);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('mousewheel', this.onMouseWheel);
		cancelAnimationFrame(this.raf);
	}

	onResize() {
		const width = this.refs.inner.clientWidth;
		this.setState({ width });
	}

	onMouseWheel(e) {
		e.preventDefault();
		let naturalForce = null;
		if (e.deltaY === 0) naturalForce = this.state.naturalForce;
		if (e.deltaY < 0) naturalForce = 0.15;
		if (e.deltaY > 0) naturalForce = -0.15;

		this.setState({
			targetForce: (this.state.targetForce + (e.deltaY * -1 * this.sensitivity)),
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

		this.setState({
			minScroll,
			currentForce,
			targetForce,
			now,
			then,
			delta,
		});
		this.raf = requestAnimationFrame(this.animate);
		PubSub.publish('story.animate', (currentForce * delta));
	}

	render() {
		const { items, title, tags, subtitle, background, minScroll } = this.state;

		return (
			<div className="page page--story story" style={{ backgroundColor: background }}>
				<div className="story__inner" ref="inner">
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
