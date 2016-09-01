import React from 'react';
import { Link } from 'react-router';

import { getData } from '../../../lib/utils.js';

const view = ({ title, email, address }) => {
	return (
		<div className="page page--contact">
			<div>
				<h1>{title}</h1>
				<h3>{email}</h3>
				<h3>{address}</h3>
				<Link to="/about">About</Link>
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

const Contact = data(view);

export default Contact;
