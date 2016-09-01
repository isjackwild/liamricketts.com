import React from 'react';
import { isEqual } from 'lodash';

import { getData, buildApiEndpoint } from '../lib/utils.js';


export default class TransitionManager extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isDataReady: false,
			isInitialLoadReady: false,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.isDataReady;
	}

	componentWillMount() {
		this.willTransition(this.props, window.stories);
	}

	componentWillReceiveProps(nextProps) {
		if (isEqual(this.props.location, nextProps.location)) return;

		this.setState({
			isDataReady: false,
		});

		this.willTransition(this.props, window.stories);
	}

	willTransition(transitionProps, data) {
		console.log('will transition');
		if (!isEqual(this.props.location, transitionProps.location)) return;

		this.setState({
			isDataReady: true,
			isInitialLoadReady: true,
			data,
		});
	}

	render() {
		return (
			this.state.isInitialLoadReady ?
			React.cloneElement(this.props.children, { data: this.state.data })
			:
			<div>Loading</div>
		);
	}
}
