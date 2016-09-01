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
		getData(buildApiEndpoint(this.props.location.pathname)).then(data => {
			this.willTransition(this.props, data);
		});
	}

	componentWillReceiveProps(nextProps) {
		if (isEqual(this.props.location, nextProps.location)) return;

		this.setState({
			isDataReady: false,
		});

		getData(buildApiEndpoint(nextProps.location.pathname)).then(data => {
			this.willTransition(nextProps, data);
		});
	}

	willTransition(transitionProps, data) {
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
			<div>Loading Site Cover</div>
		);
	}
}
