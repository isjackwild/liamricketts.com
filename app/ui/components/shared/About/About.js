import React from 'react';
import PubSub from 'pubsub-js';

const view = ({ text, links, contact, isVisible, isDisplayed }) => {
	return (
		<section className={`about about--${isVisible ? 'visible' : 'hidden'} about--${isDisplayed ? 'display' : 'display-none'}`}>
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
			isDisplayed: false,
		}

		this.subs = [];
	}

	componentDidMount() {
		this.setState({
			text: window.about.about,
			links: window.about.links,
			contact: window.about.contact,
		});
		
		this.subs.push(PubSub.subscribe('about.toggle', (e, data) => {
			if (data === true) {
				this.setState({ isDisplayed: data });
				setTimeout((e) => {
					this.setState({ isVisible: data })
				}, 10);
			} else {
				this.setState({ isVisible: data });
				setTimeout((e) => {
					this.setState({ isDisplayed: data })
				}, 333);
			}
		}));
	}

	componentWillUnmount() {
		this.subs.forEach(sub => PubSub.unsubscribe(sub));
	}

	render() {
		return <Component {...this.props} {...this.state} />
	}
};

const About = data(view);

export default About;
