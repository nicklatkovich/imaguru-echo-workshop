import { PrivateKey, ChainStore, TransactionBuilder } from 'echojs-lib';
import { Apis } from 'echojs-ws';
import sha3 from 'solidity-sha3';

const contractId = '1.16.16807';

export const ERRORS = {
	INVALID_PRIVATE_KEY: 'invalid_prk',
	INVALID_PRIVATE_KEY_FORMAT: 'invalid_prk_format',
	ALREADY_SAVED: 'already_saved',
	IS_FREE: 'is_free',
}

export async function connect() {
	await Apis.instance('wss://echo-dev.io/ws', true).init_promise;
}

export async function login(wif) {
	let privateKey;
	try {
		privateKey = PrivateKey.fromWif(wif);
	} catch (error) {
		throw new Error(ERRORS.INVALID_PRIVATE_KEY_FORMAT);
	}
	const publicKey = privateKey.toPublicKey();
	const userId = await ChainStore.FetchChain('getAccountRefsOfKey', publicKey.toString())
		.then((res) => res.toJS()[0]);
	const userName = await getNameById(userId);
	return { id: Number.parseInt(userId.split('.')[2]), name: userName };
}

export async function send(privateKey, accountId, text) {
	const hash = sha3(text);
	const transaction = new TransactionBuilder();
	transaction.add_type_operation('contract', {
		registrar: `1.2.${accountId}`,
		receiver: contractId,
		asset_id: '1.3.0',
		value: 0,
		gasPrice: 0,
		gas: 5e6,
		code: `67971080${hash.substr(2)}`,
	});
	await transaction.set_required_fees('1.3.0');
	transaction.add_signer(privateKey);
	const broadcastResult = await transaction.broadcast();
	const resultId = broadcastResult[0].trx.operation_results[0][1];
	const callResult = await Apis.instance().dbApi().exec('get_contract_result', [resultId])
		.then((res) => res.exec_res.output);
	if (callResult !== '') throw new Error(ERRORS.ALREADY_SAVED);
}

export async function validate(privateKey, text) {
	const hash = sha3(text);
	const result = await Apis.instance().dbApi().exec(
		'call_contract_no_changing_state',
		[contractId, '1.2.1', '1.3.0', `75e36616${hash.substr(2)}`],
	);
	const authorId = Number.parseInt(result.substr(0, 64), 16);
	if (authorId === 0) throw new Error(ERRORS.IS_FREE);
	return { id: authorId, name: await getNameById(`1.2.${authorId}`) };
}

function getNameById(id) {
	return ChainStore.FetchChain('getAccount', id).then((res) => res.toJS().name);
}
