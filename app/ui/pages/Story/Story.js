import React from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import _ from 'lodash';
import StoryItem from '../../../ui/components/story/StoryItem/StoryItem.js';


// const view = ({ items, scrollPosition }) => {
// 	return (
// 		<div className="page page--story story">
// 			<div className="story__inner">
// 				<div className="story__cover"></div>
// 				{
// 					items.map((item, i) => {
// 						return <StoryItem item={item} key={i} scrollPosition={scrollPosition} />;
// 					})
// 				}
// 			</div>
// 		</div>
// 	);
// };

class Story extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: window.stories[props.params.storySlug].title,
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
		}

		this.naturalForce = -0;
		this.sensitivity = 0.6;
		this.friction = 0.5;
		this.torque = 0.05;

		this.animate = this.animate.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onMouseWheel = this.onMouseWheel.bind(this);
	}

	componentDidMount() {
		PubSub.publish('nav.update', this.state.title);
		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousewheel', this.onMouseWheel);
		this.onResize();

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
		this.setState({
			targetForce: (this.state.targetForce + (e.deltaY * -1 * this.sensitivity)),
		});
	}

	animate() {
		const then = this.state.now ? this.state.now : null;
		const now = new Date().getTime();
		const delta = this.state.then ? (this.state.now - this.state.then) / 16.666 : 1;

		const width = this.refs.inner.clientWidth;
		let currentForce = this.state.currentForce + (this.state.targetForce - this.state.currentForce) * this.torque;

		if (currentForce < 0 && this.state.scrollPosition > -100) {
			const dampening = ((this.state.scrollPosition * -1) / 100);
			console.log(dampening);
		}

		const scrollPosition = _.clamp((this.state.scrollPosition + this.state.currentForce * delta), -(width - window.innerWidth), 0);
		const targetForce = this.state.targetForce + (this.naturalForce - this.state.targetForce) * this.friction;

		this.setState({
			scrollPosition,
			width,
			currentForce,
			targetForce,
			now,
			then,
			delta,
		});
		this.raf = requestAnimationFrame(this.animate);
		// PubSub.publish('story.animate', (currentForce * delta));
	}

	render() {
		const { items, title, subtitle, background, scrollPosition, width } = this.state;

		return (
			<div className="page page--story story">
				<div className="story__inner" ref="inner">
					<div
						className="story__cover"
						style={{transform: `translate3d(${scrollPosition}px, 0, 0)`}}
					>
						<div className="story__title-wrapper">
							<h1 className="story__title">{title}</h1>
							<h2 className="story__subtitle">{subtitle}</h2>
						</div>
					</div>
					{
						items.map((item, i) => {
							return <StoryItem item={item} index={i} key={i} scrollPosition={scrollPosition} />;
						})
					}
				</div>
			</div>
		);
	}
};

export default Story;
