import React from 'react';

const view = ({ text, links, contact, isVisible }) => {
	return (
		<section className={`about about--${isVisible ? 'visible' : 'hidden'}`}>
			<div className="about__text">
				<p>{text}</p>
			</div>
		</section>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: '',
			links: [],
			contact: [],
			isVisible: false,
		}
	}

	componentDidMount() {
		this.setState({
			text: window.about.about,
			links: window.about.links,
			contact: window.about.contact,
		});
	}

	render() {
		return <Component {...this.props} {...this.state} />
	}
};

const About = data(view);

export default About;
