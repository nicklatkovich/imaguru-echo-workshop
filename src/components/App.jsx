import React, { Component } from 'react';

import Connection from './Connection';
import { connect } from '../actions';
import Login from './Login';

export default class App extends Component {

	constructor(...args) {
		super(...args);
		this.state = { connectedToEcho: false, privateKey: null, userId: null };
	}

	async componentWillMount() {
		await connect();
		this.setState({ connectedToEcho: true });
	}

	render() {
		if (!this.state.connectedToEcho) return <Connection />
		if (!this.state.privateKey) {
			return <Login onLogged={(privateKey, userId) => this.setState({ privateKey, userId })} />;
		}
		return <div>qwe</div>;
	}

}
