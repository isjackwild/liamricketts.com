import React from 'react';

const view = () => {
	return (
		<div className="loader"></div>
	);
};

const data = Component => class extends React.Component {
	render() {
		return <Component />
	}
};

const Loader = data(view);

export default Loader;
