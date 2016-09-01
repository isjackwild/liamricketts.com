import React from 'react';

const view = () => {
	return (
		<section className="showstopper"></section>
	);
};

const data = Component => class extends React.Component {
	render() {
		return <Component />
	}
};

const Showstopper = data(view);

export default Showstopper;
