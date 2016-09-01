import React from 'react';
import OverviewStoryItem from '../OverviewStoryItem/OverviewStoryItem.js';

const view = ({ story, isMouseOver, onMouseEnter, onMouseLeave }) => {
	return (
		<div
			className={`overview-story overview-story--${isMouseOver ? 'mouse-over' : 'mouse-out'}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{
				story.items.map((item, i) => {
					return <OverviewStoryItem item={item} key={i} />;
				})
			}
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isMouseOver: false,
		}

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	onMouseEnter() {
		this.setState({ isMouseOver: true });
	}

	onMouseLeave() {
		this.setState({ isMouseOver: false });
	}

	render() {
		return (
			<Component
				{...this.state}
				{...this.props}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			/>
		)
	}
};

const OverviewStory = data(view);

export default OverviewStory;
