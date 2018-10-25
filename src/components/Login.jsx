import { PrivateKey } from 'echojs-lib';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { login, ERRORS } from '../actions';

/** @augments {Component<{onLogged: function(privateKey, userId:Number)}>} */
export default class Login extends Component {

	constructor(...args) {
		super(...args);
		this.state = { processing: false, error: null };
		this.wifInput = null;
	}

	static propTypes = {
		onLogged: PropTypes.func.isRequired,
	}

	getModal() {
		if (this.state.processing) return (
			<div id="processing">
				<div>Авторизация...</div>
			</div>
		);
		if (this.state.error) return (
			<div id="error">
				<div>
					<div>{this.state.error}</div>
					<button onClick={() => this.setState({ error: null })}>OK</button>
				</div>
			</div>
		);
		return null;
	}

	render() {
		return (
			<div id="login">
				<div>Введить ваш приватный ключ</div>
				<input
					id="prk-input"
					type="password"
					ref={(node) => {
						this.wifInput = node;
					}}
				/>
				<button
					ref={(node) => {
						this.submitButton = node;
					}}
					onClick={async (e) => {
						this.wifInput.disabled = true;
						this.submitButton.disabled = true;
						this.setState({ processing: true });
						try {
							const userId = await login(this.wifInput.value);
							this.props.onLogged(PrivateKey.fromWif(this.wifInput.value), userId);
						} catch (error) {
							this.wifInput.disabled = false;
							this.submitButton.disabled = false;
							this.wifInput.value = '';
							const unknownErrorMessage = 'Неизвестная ошибка';
							const errorMessage = {
									[ERRORS.INVALID_PRIVATE_KEY]: 'Приватный ключ введен неверно',
									'Non-base58 character': 'Неверный формат приватного ключа',
								}[error.message] || unknownErrorMessage;
							this.setState({ error: errorMessage, processing: false });
							if (errorMessage === unknownErrorMessage) throw error;
						}
					}}
				>Вход</button>
				{this.getModal()}
			</div>
		);
	}

}
