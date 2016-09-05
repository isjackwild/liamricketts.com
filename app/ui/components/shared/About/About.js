import React from 'react';
import PubSub from 'pubsub-js';


const view = ({ text, links, address, contact, isVisible, isDisplayed }) => {
	return (
		<section className={`about about--${isVisible ? 'visible' : 'hidden'} about--${isDisplayed ? 'display' : 'display-none'}`}>
			<div className="about__text" dangerouslySetInnerHTML={{__html: text}}></div>
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
			<div className="about__address" dangerouslySetInnerHTML={{__html: address}}></div>
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
			<div className="about__credits">
				<span>Site Design and Development by <a href="http://www.isjackwild.com" target="blank">Jack Wild</a></span>
				<span>Typeset in Cooper Hewitt and Libre Baskerville from <a href="http://open-foundry.com/" target="blank">Open Foundry</a></span>
			</div>
		</section>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: window.about.about,
			address: window.about.address,
			links: window.about.links,
			contact: window.about.contact,
			isVisible: false,
			isDisplayed: false,
		}

		this.subs = [];

		this.preventDefault = this.preventDefault.bind(this);
		this.enableScroll = this.enableScroll.bind(this);
		this.disableScroll = this.disableScroll.bind(this);
	}

	componentDidMount() {		
		this.subs.push(PubSub.subscribe('about.toggle', (e, data) => {
			if (data === true) {
				this.disableScroll();
				this.setState({ isDisplayed: data });
				setTimeout((e) => {
					this.setState({ isVisible: data })
				}, 10);
			} else {
				this.enableScroll();
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

	preventDefault(e) {
		e = e || window.event;
		if (e.preventDefault) e.preventDefault();
		e.returnValue = false;
	}

	disableScroll() {
		if (window.addEventListener) window.addEventListener('DOMMouseScroll', this.preventDefault, false);
		window.onwheel = this.preventDefault;
		window.onmousewheel = document.onmousewheel = this.preventDefault;
		window.ontouchmove  = this.preventDefault;
	}

	enableScroll() {
		if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
		window.onmousewheel = document.onmousewheel = null;
		window.onwheel = null;
		window.ontouchmove = null;
	}

	render() {
		return <Component {...this.props} {...this.state} />
	}
};

const About = data(view);

export default About;
