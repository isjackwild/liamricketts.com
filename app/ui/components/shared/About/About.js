import React from 'react';
import PubSub from 'pubsub-js';


const view = ({ text, links, address, contact, isVisible, close, stopProp }) => {
	return (
		<section
			className={`about about--${isVisible ? 'visible' : 'hidden'}`}
			onClick={close}
		>
			<div className="about__text" dangerouslySetInnerHTML={{__html: text}} onClick={stopProp}></div>
			<ul className="about__contact" onClick={stopProp}>
				{
					contact.map((option, i) => {
						return (
							<li className="about__contact-option" key={i} onClick={stopProp}>
								{option.url ?
									<a href={option.url}>{option.entry}</a>
									:
									option.entry
								}
							</li>
						);
					})
				}
			</ul>
			<div className="about__address" dangerouslySetInnerHTML={{__html: address}} onClick={stopProp}></div>
			<ul className="about__links" onClick={stopProp}>
				{
					links.map((link, i) => {
						return (
							<li className="about__link" key={i} onClick={stopProp}>
								<a href={link.url} target="blank">{link.label}</a>
							</li>
						);
					})
				}
			</ul>
			<div className="about__credits" onClick={stopProp}>
				<span>Design and Development by <a href="http://www.isjackwild.com" target="blank">Jack Wild</a></span>
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
		}

		this.subs = [];

		this.preventDefault = this.preventDefault.bind(this);
		this.enableScroll = this.enableScroll.bind(this);
		this.disableScroll = this.disableScroll.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.close = this.close.bind(this);
	}

	onKeyDown(e) {
		switch(e.keyCode) {
			case 27:
				if (this.state.isVisible) this.close();
				break;
		}
	}

	componentDidMount() {
		window.addEventListener('keydown', this.onKeyDown);		
		this.subs.push(PubSub.subscribe('about.toggle', (e, data) => {
			this.setState({ isVisible: data });
		}));
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown);		
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

	close() {
		PubSub.publish('about.toggle', false);
	}

	stopProp(e) {
		e.stopPropagation();
	}

	render() {
		return <Component {...this.props} {...this.state} close={this.close} stopProp={this.stopProp} />
	}
};

const About = data(view);

export default About;
