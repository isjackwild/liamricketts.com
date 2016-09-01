import React from 'react';

const view = ({ text, links, contact, isVisible }) => {
	return (
		<section className={`about about--${isVisible ? 'visible' : 'hidden'}`}>
			<div className="about__text">
				<p>{text}</p>
			</div>
			<ul className="about__contact">
				{
					contact.map((option, i) => {
						return (
							<li className="about__contact-option" key={i}>
								<a href={option.url}>{option.entry}</a>
							</li>
						);
					})
				}
			</ul>
			<ul className="about__links">
				{
					links.map((link, i) => {
						return (
							<li className="about__link" key={i}>
								<a href={link.url}>{link.label}</a>
							</li>
						);
					})
				}
			</ul>
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
