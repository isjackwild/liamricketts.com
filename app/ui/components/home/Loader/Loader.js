import React from 'react';
import PubSub from 'pubsub-js';

const view = ({ progress, isComplete }) => {
	let images = [];

	for (let i = 0; i <= 30; i++) {
		images.push(<div className={`loader__image loader__image--${progress >= i ? 'lit' : 'dim'}`} key={i}></div>)
	}

	return (
		<div className={`loader loader--${isComplete ? 'loaded' : 'pending'}`}>
			{ images }
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			progress: 0,
			isComplete: false,
		};

		this.update = this.update.bind(this);
		this.onLoadComplete = this.onLoadComplete.bind(this);
		this.subs = [];
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('load.percent', this.update));
		this.subs.push(PubSub.subscribe('load.complete', this.onLoadComplete));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	update(e, perc) {
		const progress = (perc / 100) * 30;
		this.setState({ progress });
	}

	onLoadComplete() {
		setTimeout(() => {
			this.setState({ isComplete: true });
		}, 999);
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Loader = data(view);

export default Loader;
