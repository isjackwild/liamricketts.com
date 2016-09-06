import React from 'react';
import PubSub from 'pubsub-js';

const view = ({ src, padding, isReady, onImageLoad, title }) => {
	return (
		<div
			className={`overview-story__item overview-story__item--${isReady ? 'ready' : 'pending'}`}
			style={{ backgroundImage: `url(${src})` }}
		>
			<div
				className="overview-story__item-spacer"
				style={{ paddingBottom: `${padding}%` }}
			>
			</div>
			{title ? 
				<div className="overview-story__title">
					<h1>{title}</h1>
				</div>
				:
				null
			}
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			src: null,
			isLoaded: false,
			isReady: false,
		}

		this.imgLoader = new Image();
		this.onImageLoad = this.onImageLoad.bind(this);
		this.subs = [];
	}

	componentDidMount() {
		this.setState({
			src: this.props.item.images.small,
			padding: this.props.item.images.aspectRatio * 100,
		});

		this.subs.push(PubSub.subscribe('load.complete', () => {
			this.setState({ isReady: true });
		}));
		
		setTimeout(() => {
			this.loadImage();
		}, 333);
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
		this.imgLoader.onload = null;
		this.imgLoader.onerror = null;
		this.imgLoader.src = '';
		this.imgLoader = undefined;
	}

	loadImage() {
		PubSub.publish('load.add');
		this.imgLoader.onload = this.onImageLoad;
		this.imgLoader.onerror = this.onImageLoad;
		setTimeout(() => {
			this.imgLoader.src = this.state.src;
		}, 0)
	}

	onImageLoad() {
		this.setState({ loaded: true });
		PubSub.publish('load.loaded');
	}

	render() {
		return (
			<Component
				{...this.state}
				{...this.props}
			/>
		)
	}
};

const OverviewStoryItem = data(view);

export default OverviewStoryItem;
