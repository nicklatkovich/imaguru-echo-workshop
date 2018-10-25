const { ChainStore, PrivateKey, ContractFrame } = require('echojs-lib');
const { Apis } = require('echojs-ws');

const wif = 'ENTER_YOUR_WIF_HERE';
const bytecode = 'ENTER_SMART_CONTRACT_BYTECODE_HERE';
const gasLimit = 10e6;
const privateKey = PrivateKey.fromWif(wif);
const publicKey = privateKey.toPublicKey();
const contractFrame = new ContractFrame();

async function deploy() {
	const instance = Apis.instance('wss://echo-dev.io/ws', true);
	await instance.init_promise;
	const accountId = await ChainStore.FetchChain('getAccountRefsOfKey', publicKey.toString())
		.then((res) => res.toJS()[0]);
	const [{ trx: { operation_results: [[_, resId]] } }] = await contractFrame.deployContract({
		accountId: accountId,
		gas: gasLimit,
		bytecode,
	}, privateKey);
	const {
		exec_res: { new_address },
	} = await instance.dbApi().exec('get_contract_result', [resId]);
	console.log(`Contract id: 1.16.${Number.parseInt(new_address.slice(8), 16)}`);
}

deploy().then(() => process.exit(0)).catch((error) => {
	console.error(error);
	process.exit(1);
});
