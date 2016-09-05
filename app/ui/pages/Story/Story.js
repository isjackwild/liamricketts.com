import React from 'react';
import { Link } from 'react-router';
import StoryItem from '../../../ui/components/story/StoryItem/StoryItem.js';


const view = ({ items }) => {
	return (
		<div className="page page--story story">
			{
				items.map((item, i) => {
					return <StoryItem item={item} key={i} />;
				})
			}
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: window.stories[props.params.storySlug].title,
			subtitle: window.stories[props.params.storySlug].subtitle,
			items: window.stories[props.params.storySlug].items,
			background: window.stories[props.params.storySlug].background,
		}
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Story = data(view);

export default Story;
