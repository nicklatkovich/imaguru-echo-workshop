import React, { Component } from 'react';

import Connection from './Connection';

export default class App extends Component {

	constructor(...args) {
		super(...args);
		this.state = { connectedToEcho: false };
	}

	render() {
		if (!this.state.connectedToEcho) return <Connection />
		return <div>qwe</div>;
	}

}
