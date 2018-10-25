
export const ERRORS = {
	INVALID_PRIVATE_KEY: 'invalid_prk',
}

export async function connect() {
	await new Promise((resolve) => setTimeout(() => resolve(), 2000));
}

export async function login(wif) {
	await new Promise((resolve) => setTimeout(() => resolve(), 2000));
	if (wif.length < 5) throw new Error(ERRORS.INVALID_PRIVATE_KEY);
	return Math.floor(Math.random() * 500);
}
