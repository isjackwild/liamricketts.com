import React from 'react';
import PubSub from 'pubsub-js';
import OverviewStoryItem from '../OverviewStoryItem/OverviewStoryItem.js';


const view = ({ story, isMouseOver, isDimmed, onMouseEnter, onMouseLeave }) => {
	return (
		<div
			className={`overview-story overview-story--${isMouseOver ? 'mouse-over' : 'mouse-out'} ${isDimmed ? 'overview-story--dimmed' : ''}`}
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
			isDimmed: false,
			isReady: false,
		}

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.dim = this.dim.bind(this);
		this.subs = [];
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('overview.dim', this.dim));
		this.subs.push(PubSub.subscribe('load.complete', () => {
			this.setState({ isReady: true});
		}));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	onMouseEnter() {
		if (!this.state.isReady) return;
		this.setState({ isMouseOver: true });
		PubSub.publish('overview.dim', true);
	}

	onMouseLeave() {
		this.setState({ isMouseOver: false });
		PubSub.publish('overview.dim', false);
	}

	dim(e, data) {
		if (this.state.isMouseOver && data === true) return;
		this.setState({ isDimmed: data });
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
