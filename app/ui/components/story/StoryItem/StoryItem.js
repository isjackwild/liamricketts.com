import React from 'react';
// import PubSub from 'pubsub-js';

const StoryItem = ({ item }) => {
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
		<div className={`story__item story__item--align-${alignmentClass} story__item--size-${size} story__item--margin-${margin}`}>
			<img className="story__image" src={src} />
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
