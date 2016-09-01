import React from 'react';
import { Link } from 'react-router';

import { getData } from '../../../lib/utils.js';

const view = ({ title, text }) => {
	return (
		<div className="page page--about">
			<div>
				<h1>{title}</h1>
				<h3>{text}</h3>
				<Link to="/contact">Contact</Link>
			</div>
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <Component {...this.props.data} />
	}
};

const About = data(view);

export default About;
