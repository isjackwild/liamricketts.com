import React from 'react';
// import PubSub from 'pubsub-js';

const StoryItem = ({ item }) => {
	const { size, alignment, margin, images } = item;
	console.log(size, margin);
	const src = (() => {
		switch(size) {
			case 'small':
				return images.small;
			case 'medium':
			case 'large':
				return images.medium;
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
		</div>
	);
};

export default StoryItem;
