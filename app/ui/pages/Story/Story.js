import React from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import StoryItem from '../../../ui/components/story/StoryItem/StoryItem.js';


const view = ({ items }) => {
	return (
		<div className="page page--story story">
			<div className="story__cover"></div>
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

	componentDidMount() {
		PubSub.publish('nav.update', this.state.title);
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Story = data(view);

export default Story;
