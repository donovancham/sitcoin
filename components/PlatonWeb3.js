import Web3 from 'web3'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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
export async function getContractAbi(contract) {
    try {
        const { abi } = await import(`../build/contracts/${contract}.json`, {
            assert: { type: json }
        })
        return abi
    }
    catch (err) {
        Notify.failure("Contract name does not exist\n{$err}")
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

/**
 * Connects to Samurai wallet on browser.
 * 
 * @param {Web3} web3 
 * @returns The address of the account connected on success. Returns false on failure.
 */
export async function connectSamurai(web3) {
    try {
        // Requests the browser wallet to connect to the network.
        let accounts = await web3.platon.requestAccounts()
        return accounts[0]
    }
    catch (e) {
        // User Rejected connection wallet connection
        // Get message of error
        console.log(`Error code: ${e.code}`)
        console.log(`Error message: ${e.message}`)
        return false
    }
}