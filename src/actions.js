import { PrivateKey } from 'echojs-lib';
import sha3 from 'solidity-sha3';

export const ERRORS = {
	INVALID_PRIVATE_KEY: 'invalid_prk',
	INVALID_PRIVATE_KEY_FORMAT: 'invalid_prk_format',
	ALREADY_SAVED: 'already_saved',
}

export async function connect() {
	await new Promise((resolve) => setTimeout(() => resolve(), 2000));
}

export async function login(wif) {
	let privateKey;
	try {
		privateKey = PrivateKey.fromWif(wif);
	} catch (error) {
		throw new Error(ERRORS.INVALID_PRIVATE_KEY_FORMAT);
	}
	await new Promise((resolve) => setTimeout(() => resolve(), 2000));
	if (wif[1] === 'J') throw new Error(ERRORS.INVALID_PRIVATE_KEY);
	return { id: Math.floor(Math.random() * 500), name: 'accountName' };
}

export async function send(privateKey, text) {
	const hash = sha3(text);
	console.log(hash);
	await new Promise((resolve) => setTimeout(() => resolve(), 2000));
	// throw new Error(ERRORS.ALREADY_SAVED);
}

export async function validate(privateKey, text) {
	await new Promise((resolve) => setTimeout(() => resolve(), 2000));
	return { id: 123, name: 'qwe' };
}
