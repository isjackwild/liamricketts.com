import React from 'react';
import PubSub from 'pubsub-js';


const Cover = ({ title, subtitle, tags, scrollPosition }) => {
	return (
		<div
			className="story__cover"
			style={{transform: `translate3d(${scrollPosition ? scrollPosition : 0}px, 0, 0)`}}
		>
			<div className="story__title-wrapper">
				<h1 className="story__title">{title}</h1>
				<h2 className="story__subtitle">{subtitle}</h2>
			</div>

			<div className="story__tag-wrapper">
				{
					tags.map((tag, i) => {
						return <span className="story__tag" key={i}>{tag}</span>
					})
				}
			</div>
		</div>
	);
};


class Image extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoaded: false,
		}

		this.onLoaded = this.onLoaded.bind(this);
		this.openInLightbox = this.openInLightbox.bind(this);
	}

	componentDidMount() {
		if (this.refs.image.complete) {
			this.onLoaded();
		} else {
			this.refs.image.onload = this.onLoaded;
		}
	}

	componentWillUnmount() {
		this.refs.image.onload = null;
	}

	onLoaded() {
		this.setState({ isLoaded: true });
	}

	openInLightbox() {
		PubSub.publish('lightbox.show', this.props.item.images);
	}

	render() {
		const { isLoaded } = this.state;
		const { item, scrollPosition } = this.props;
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
				style={{transform: `translate3d(${scrollPosition ? scrollPosition : 0}px, 0, 0)`}}
			>
				<div className={`story__image-wrapper story__image-wrapper--${isLoaded ? 'loaded' : 'loading'}`}>
					<img
						ref="image"
						className={`story__image ${!isLoaded ? 'story__image--hidden' : ''}`}
						src={src}
						width={images.fullWidth}
						height={images.fullHeight}
						onClick={this.openInLightbox}
					/>
					<img
						className={`story__image-loader ${isLoaded ? 'story__image-loader--hidden' : ''}`}
						src={images.small}
						width={images.fullWidth}
						height={images.fullHeight}
					/>
				</div>
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
	}
}


const decorator = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			scrollPosition: 0,
		}


		this.update = this.update.bind(this);
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

	render() {
		return <Component {...this.state} {...this.props} openInLightbox={this.openInLightbox} />
	}
};

// export const StoryItem = decorator(Image);
// export const StoryCover = decorator(Cover);
// 
export const StoryItem = Image;
export const StoryCover = Cover;

