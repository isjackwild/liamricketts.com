import React from 'react';
import PubSub from 'pubsub-js';


const coverView = ({ title, subtitle, scrollPosition }) => {
	return (
		<div
			className="story__cover"
			style={{transform: `translate3d(${scrollPosition}px, 0, 0)`}}
		>
			<div className="story__title-wrapper">
				<h1 className="story__title">{title}</h1>
				<h2 className="story__subtitle">{subtitle}</h2>
			</div>
		</div>
	);
};


const imageView = ({ item, scrollPosition, openInLightbox }) => {
	const { size, alignment, margin, caption, images } = item;

	const src = (() => {
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

	const alignmentClass = (() => {
		if (size === 'large') return 'top';
		if (size === 'medium') return 'middle';
		return alignment;
	})();

	return (
		<div
			className={`story__item story__item--align-${alignmentClass} story__item--size-${size} story__item--margin-${margin}`}
			style={{transform: `translate3d(${scrollPosition}px, 0, 0)`}}
		>
			<img
				className="story__image"
				src={src}
				width={images.fullWidth}
				height={images.fullHeight}
				onClick={openInLightbox}
			/>
			{caption ?
				<span
					className={`story__caption story__caption--${size === 'large' ? 'right' : 'below'}`}
					dangerouslySetInnerHTML={{ __html: caption }}
				></span>
				:
				null
			}
		</div>
	);
};


const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			scrollPosition: 0,
		}

		this.naturalForce = -0.1;
		this.sensitivity = 0.6;
		this.friction = 0.5;
		this.torque = 0.05;

		this.update = this.update.bind(this);
		this.openInLightbox = this.openInLightbox.bind(this);

		this.subs = [];
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('story.animate', this.update));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	update(e, force) {
		let scrollPosition = this.state.scrollPosition + force;
		
		if (scrollPosition < this.props.minScroll && force < 0)
			scrollPosition = window.innerWidth;
		if (scrollPosition > window.innerWidth && force > 0)
			scrollPosition = this.props.minScroll;

		this.setState({ scrollPosition });
	}

	openInLightbox() {
		PubSub.publish('lightbox.show', this.props.item.images);
	}

	render() {
		return <Component {...this.state} {...this.props} openInLightbox={this.openInLightbox} />
	}
};

export const StoryItem = data(imageView);
export const StoryCover = data(coverView);

