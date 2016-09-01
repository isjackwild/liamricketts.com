import React from 'react';

const view = () => {
	return (
		<nav className="nav"></nav>
	);
};

const data = Component => class extends React.Component {
	render() {
		return <Component />
	}
};

const Nav = data(view);

export default Nav;
