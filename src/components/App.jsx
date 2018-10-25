import React, { Component } from 'react';

import Connection from './Connection';
import { connect, send, ERRORS, validate } from '../actions';
import Login from './Login';

export default class App extends Component {

	constructor(...args) {
		super(...args);
		this.state = {
			connectedToEcho: false,
			privateKey: null,
			userId: null,
			userName: null,
			message: null,
			isError: false,
			okButton: false,
		};
	}

	async componentWillMount() {
		await connect();
		this.setState({ connectedToEcho: true });
	}

	render() {
		if (!this.state.connectedToEcho) return <Connection />
		if (!this.state.privateKey) {
			return (
				<Login onLogged={(privateKey, userId, userName) => this.setState({ privateKey, userId, userName })} />
			);
		}
		return (
			<div id="app">
				<div id="profile">
					<div id="user-name">{this.state.userName}</div>
					<div id="user-id">1.2.{this.state.userId}</div>
				</div>
				<div id="main">
					<textarea ref={(node) => this.textarea = node} />
					<button
						onClick={async () => {
							this.setState({ message: 'Отправка хэша в блокчейн...' });
							try {
								await send(this.state.privateKey, this.state.userId, this.textarea.value);
							} catch (error) {
								if (error.message === ERRORS.ALREADY_SAVED) {
									this.setState({ message: 'Данный текст уже отправлялся', isError: true });
									return;
								}
								throw error;
							}
							this.setState({ okButton: true, message: 'Успешно отправлено' });
						}}
					>Отправить</button>
					<button
						onClick={async () => {
							this.setState({ message: 'Валидация текста...' });
							let id;
							let name;
							try {
								({ id, name } = await validate(this.state.privateKey, this.textarea.value));
							} catch (error) {
								if (error.message === ERRORS.IS_FREE) {
									this.setState({ message: 'Текст никому не принадлежит', okButton: true });
									return;
								}
								throw error;
							}
							this.setState({
								message: `Текст принадлежит аккаунту ${name} (1.2.${id})`,
								okButton: true,
							});
						}}
					>Проверить</button>
				</div>
				{this.state.message ? (
					<div id="modal" className={this.state.isError ? 'error' : ''}>
						<div>
							{this.state.message}
							{this.state.okButton || this.state.isError ? (
								<button
									onClick={() => this.setState({ message: null, okButton: false, isError: false })}
								>OK</button>
							) : null}
						</div>
					</div>
				) : null}
			</div>
		);
	}

}
