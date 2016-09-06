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
			currentForce: -0.4,
			targetForce: -0.4,
			scrollPosition: 0,
		}

		this.naturalForce = -0.1;

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
	}

	onResize() {
		const width = this.refs.inner.clientWidth
		this.setState({ width });
	}

	onMouseWheel(e) {
		e.preventDefault();
		console.log(e.deltaY);
	}

	animate() {
		const width = this.refs.inner.clientWidth;
		const scrollPosition = _.clamp((this.state.scrollPosition + this.state.currentForce), -(width - window.innerWidth), 0);

		this.setState({
			scrollPosition,
			width,
		});
		this.raf = requestAnimationFrame(this.animate);
	}

	render() {
		const { items, title, subtitle, background, scrollPosition } = this.state;

		return (
			<div className="page page--story story">
				<div className="story__inner" ref="inner">
					<div className="story__cover"></div>
					{
						items.map((item, i) => {
							return <StoryItem item={item} key={i} scrollPosition={scrollPosition} />;
						})
					}
				</div>
			</div>
		);
	}
};

export default Story;
