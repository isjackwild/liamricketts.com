import React from 'react';
import PubSub from 'pubsub-js';

const StoryItem = ({ item, scrollPosition }) => {
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
			<img className="story__image" src={src} width={images.fullWidth} height={images.fullHeight}/>
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

export default StoryItem;




// class StoryItem extends React.Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			scrollPosition: 0,
// 			offsetLeft: 0,
// 		}

// 		this.naturalForce = -0.1;
// 		this.sensitivity = 0.6;
// 		this.friction = 0.5;
// 		this.torque = 0.05;

// 		this.update = this.update.bind(this);
// 		this.onResize = this.onResize.bind(this);

// 		this.subs = [];
// 	}

// 	componentDidMount() {
// 		window.addEventListener('resize', this.onResize);
// 		this.subs.push(PubSub.subscribe('story.animate', this.update));
// 		this.onResize();
// 	}

// 	componentWillUnmount() {
// 		window.removeEventListener('resize', this.onResize);
// 		this.subs.forEach(sub => PubSub.unsubscribe(sub));
// 	}

// 	onResize() {
// 		const width = this.refs.self.clientWidth;
// 		this.setState({ width });
// 	}

// 	update(e, force) {
// 		let scrollPosition = this.state.scrollPosition + force;
// 		const normalizedPosition = ((this.state.scrollPosition * -1) - this.refs.self.offsetLeft) * -1;

// 		const offsetLeft = this.refs.self.offsetLeft;
// 		const rect = this.refs.self.getBoundingClientRect();

// 		const minIn = (this.refs.self.clientWidth + this.refs.self.offsetLeft) * -1;
// 		const maxIn = window.innerWidth - this.refs.self.offsetLeft;
		
// 		if (normalizedPosition < (rect.width * -1) && force < 0)
// 			scrollPosition = offsetLeft + rect.width + this.props.remainingScroll;
// 		if (normalizedPosition > window.innerWidth && force > 0)
// 			scrollPosition -= offsetLeft;

// 		this.setState({ scrollPosition, offsetLeft, minIn, maxIn, normalizedPosition });
// 	}

// 	render() {
// 		const { scrollPosition, offsetLeft, minIn, maxIn, normalizedPosition } = this.state;
// 		const { item } = this.props;
// 		const { size, alignment, margin, caption, images } = item;

// 		const src = (() => {
// 			switch(size) {
// 				case 'small':
// 					return images.medium;
// 				case 'medium':
// 				case 'large':
// 					return images.large;
// 				default:
// 					return images.medium;
// 			}
// 		})();

// 		const alignmentClass = (() => {
// 			if (size === 'large') return 'top';
// 			if (size === 'medium') return 'middle';
// 			return alignment;
// 		})();

// 		return (
// 			<div
// 				className={`story__item story__item--align-${alignmentClass} story__item--size-${size} story__item--margin-${margin}`}
// 				style={{transform: `translate3d(${scrollPosition}px, 0, 0)`}}
// 				ref="self"
// 			>
// 				<img className="story__image" src={src} width={images.fullWidth} height={images.fullHeight}/>
// 				{caption ?
// 					<span
// 						className={`story__caption story__caption--${size === 'large' ? 'right' : 'below'}`}
// 						dangerouslySetInnerHTML={{ __html: caption }}
// 					></span>
// 					:
// 					null
// 				}
// 				<div className="story__debug">
// 					<span>scrollPosition: {scrollPosition}</span><br/>
// 					<span>offsetLeft: {offsetLeft}</span><br />
// 					<span>normalizedPosition: {normalizedPosition}</span>
// 				</div>
// 			</div>
// 		);
// 	}
// };

// export default StoryItem;
