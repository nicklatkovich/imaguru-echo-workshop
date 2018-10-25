import { PrivateKey } from 'echojs-lib';

export const ERRORS = {
	INVALID_PRIVATE_KEY: 'invalid_prk',
	INVALID_PRIVATE_KEY_FORMAT: 'invalid_prk_format',
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
