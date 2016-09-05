import React from 'react';
import PubSub from 'pubsub-js';

const view = ({ isVisible, title, subtitle }) => {
	return (
		<div className={`title title--${isVisible ? 'visible' : 'hidden'}`}>
			<h1 className="title__title">{title}</h1>
			<h2 className="title__subtitle">{subtitle}</h2>
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			title: '',
			subtitle: '',
		}

		this.subs = [];
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('title.show', this.show));
		this.subs.push(PubSub.subscribe('title.hide', this.hide));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	show(e, data) {
		this.setState({
			title: data.title,
			subtitle: data.subtitle,
			isVisible: true,
		});
	}

	hide() {
		this.setState({ isVisible: false });
	}

	render() {
		return <Component {...this.state} {...this.props} />
	}
};

const Title = data(view);

export default Title;
