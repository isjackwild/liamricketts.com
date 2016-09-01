import React from 'react';
import { Link } from 'react-router';


const view = () => {
	return (
		<div className="page page--story">
			<Showstopper />
			<Overview />
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

const Story = data(view);

export default Story;
