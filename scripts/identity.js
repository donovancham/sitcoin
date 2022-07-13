// Imports
const {create} = require('ipfs-http-client')
const Web3 = require('web3')
const { owner, dev1, dev2, dev3 } = require('./walletAddress')
const { initWeb3, getContractAbi } = require('./web3Module')

const web3 = initWeb3()

const sitcoinAbi = getContractAbi('SITcoin')
console.log(sitcoinAbi)
