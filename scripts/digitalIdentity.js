// Imports
const Web3 = require('web3')
const { owner, dev1, dev2, dev3 } = require('./walletAddress')

// Connections for DevNet 1
const devnetHTTP = "https://devnetopenapi2.platon.network/rpc"
const devnetWS = "wss://devnetopenapi2.platon.network/ws"

// Connections for DevNet 2
const devnet2HTTP = "https://devnet2openapi.platon.network/rpc"
const devnet2WS = "wss://devnet2openapi.platon.network/ws"

async function main() {
    var web3

    // Main code
    try {
        web3 = initWeb3()
    }
    catch (e) {
        console.log(e)
    }

    // await console.log(web3.platon.currentProvider)

    // Get all available accounts to use
    // await web3.platon.getAccounts().then(console.log)

    // Get account balance
    let balance = await web3.platon.getBalance(owner).then(web3.utils.fromVon)
    console.log(`Account: ${owner}, Balance: ${Number(balance).toFixed(4)} LAT`)

    let data = web3.utils.utf8ToHex('Hello World')
    console.log(`Hex Data: ${data}`)

    // Calculate gas
    let gas = web3.utils.toVon('0.01', 'lat')
    console.log(`Gas: ${gas}`)

    let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(owner))
    console.log(`Nonce: ${nonce}`)

    // Transaction signing
    await web3.platon.signTransaction({
        from: owner,
        data: data,
        value: '1000000000000000000',
        gasPrice: '10000000000000',
        gas: '21000',
        nonce: nonce
    }).then(console.log)
}

/**
 * Instantiates a `Web3` object using the available connections.
 * Allows connection to two networks:
 * 1 - Platon Development Network 1
 * 2 - Platon Development Network 2
 * 
 * @param {number} network The network to connect
 * @returns The instantiated Web3 object
 */
function initWeb3(network = 1) {
    if (network === 1) {
        // Instantiate Web3 for DevNet 1 (default)
        let web3 = new Web3(Web3.givenProvider || devnetHTTP || devnetWS)
        // Set default account
        web3.platon.defaultAccount = 'lat1rd8c02e905rguunal8ck77ftct0jph2v6zj7cq'
        return web3
    }
    else if (network === 2) {
        // Instantiate Web3 for DevNet 2
        return new Web3(Web3.givenProvider || devnet2HTTP || devnet2WS)
    }
    else {
        throw "Invalid Selection. Valid Options: 1 (DevNet 1), 2 (DevNet 2)"
    }
}

main()