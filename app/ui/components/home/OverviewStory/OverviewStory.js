import React from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import OverviewStoryItem from '../OverviewStoryItem/OverviewStoryItem.js';


const view = ({ story, isMouseOver, isDimmed, onMouseEnter, onMouseLeave }) => {
	return (
		<Link
			to={`/story/${story.slug}`}
			className={`overview-story overview-story--${isMouseOver ? 'mouse-over' : 'mouse-out'} ${isDimmed ? 'overview-story--dimmed' : ''}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{
				story.items.map((item, i) => {
					if (item.hideInHomepage) return;
					return <OverviewStoryItem item={item} key={i} title={i === 0 ? story.title : null} />;
				})
			}
		</Link>
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
			this.setState({ isReady: true });
		}));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	onMouseEnter() {
		if (!this.state.isReady) return;
		this.setState({ isMouseOver: true });
		PubSub.publish('overview.dim', true);
		// PubSub.publish('title.show', {
		// 	title: this.props.story.title,
		// 	subtitle: this.props.story.subtitle,
		// });
	}

	onMouseLeave() {
		this.setState({ isMouseOver: false });
		PubSub.publish('overview.dim', false);
		// PubSub.publish('title.hide', false);
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
