// Imports
const {create} = require('ipfs-http-client')
const Web3 = require('web3')
const { owner, dev1, dev2, dev3 } = require('./walletAddress')
const { initWeb3, getContractAbi } = require('./web3Module')

// Connections for DevNet 1
const devnetHTTP = "https://devnetopenapi2.platon.network/rpc"
const devnetWS = "wss://devnetopenapi2.platon.network/ws"

// Connections for DevNet 2
const devnet2HTTP = "https://devnet2openapi.platon.network/rpc"
const devnet2WS = "wss://devnet2openapi.platon.network/ws"

async function main() {
    var web3
    var ipfs

    // Main code
    try {
        web3 = initWeb3()
        ipfs = await create("http://localhost:5001")
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
    let receipt = await web3.platon.signTransaction({
        from: owner,
        data: data,
        // value: '1000000000000000000',
        gasPrice: '10000000000000',
        gas: '21000',
        nonce: nonce
    })
    
    console.log(receipt)
    console.log(`Raw: ${receipt.raw}`)
    console.log(`Hash: ${receipt.tx.hash}`)

    console.log(receipt.tx.hash.length)

    let signed = await web3.platon.sign("Hello World", owner)
    console.log(signed)
    
    let sig = await web3.platon.personal.sign("Hello world", owner, "Splatter8693")
    console.log(`Signature: ${sig}`)

    let dataSender = await web3.platon.personal.ecRecover("Hello world", sig)
    console.log(`Recovered sender ${dataSender == owner ? 'is owner!' : dataSender}`)

    let ds2 = await web3.platon.personal.ecRecover("Hello world", signed)
    console.log(`Recovered sender ${ds2 == owner ? 'is owner!' : dataSender}`)

    // ipfs uploads
    // ipfs.add()
}

main()