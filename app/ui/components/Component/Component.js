import React from 'react';

const view = () => {
	return (
		<div></div>
	);
};

const data = Component => class extends React.Component {
	render() {
		return <Component />
	}
};

const Component = data(view);

export default Component;
