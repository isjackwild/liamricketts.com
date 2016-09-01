import React from 'react';
import OverviewStory from '../OverviewStory/OverviewStory.js'

const view = ({ stories }) => {
	return (
		<section className="overview">
			{
				stories.map((story, i) => {
					return <OverviewStory story={story} key={i} />;
				})
			}
		</section>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			stories: [],
		}
	}

	componentDidMount() {
		this.setState({ stories: window.stories });
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Overview = data(view);

export default Overview;
