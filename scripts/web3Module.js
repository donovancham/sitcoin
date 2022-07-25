const Web3 = require('web3')
const fs = require('fs')
const path = require('path')
const { owner } = require('./walletAddress')

// Connections for DevNet 1
const devnetHTTP = "https://devnetopenapi2.platon.network/rpc"
const devnetWS = "wss://devnetopenapi2.platon.network/ws"

// Connections for DevNet 2
const devnet2HTTP = "https://devnet2openapi.platon.network/rpc"
const devnet2WS = "wss://devnet2openapi.platon.network/ws"

/**
 * Gets the contract abi from compiled contracts folder
 * 
 * @param {string} contract The name of the contract
 * @returns The abi object
 */
const getContractAbi = (contract) => {
    try {
        let filename = path.resolve(__dirname, `../build/contracts/${contract}.json`)
        let parsed = JSON.parse(fs.readFileSync(filename))

        // console.log('File parsed')
        // console.log(parsed)
        
        return parsed.abi

        // const { abi } = await import(`../build/contracts/${contract}.json`, {
        //     assert: { type: json }
        // })
        // return abi
    }
    catch (err) {
        console.log("Contract name does not exist")
        console.log(err)
    }
}

/**
 * Gets the contract bytecode from compiled contracts folder
 * 
 * @param {string} contract The name of the contract
 * @returns The bytecode object
 */
 const getContractByteCode = (contract) => {
    try {
        let filename = path.resolve(__dirname, `../build/contracts/${contract}.json`)
        let parsed = JSON.parse(fs.readFileSync(filename))
        
        return parsed.bytecode
    }
    catch (err) {
        console.log("Contract name does not exist")
        console.log(err)
    }
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
const initWeb3 = (network = 1) => {
    if (network === 1) {
        // Instantiate Web3 for DevNet 1 (default)
        let web3 = new Web3(Web3.givenProvider || devnetHTTP || devnetWS)
        // Set default account
        web3.platon.defaultAccount = owner
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

module.exports = {
    initWeb3,
    getContractAbi,
    getContractByteCode
}