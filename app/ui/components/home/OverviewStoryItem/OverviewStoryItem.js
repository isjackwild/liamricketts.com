import React from 'react';

const view = ({ src, padding, ready, onImageLoad }) => {
	return (
		<div
			className={`overview-story__item overview-story__item--${ready ? 'loaded' : 'pending'}`}
			style={{ backgroundImage: `url(${src})` }}
		>
			<div
				className="overview-story__item-spacer"
				style={{ paddingBottom: `${padding}%` }}
			>
			</div>
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			src: null,
			loaded: false,
		}

		this.onImageLoad = this.onImageLoad.bind(this);
	}

	componentDidMount() {
		console.log(this.props.item);
		this.setState({
			src: this.props.item.images.small,
			padding: this.props.item.images.aspectRatio * 100,
		});
	}

	onImageLoad() {
		this.setState({ loaded: true });
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
