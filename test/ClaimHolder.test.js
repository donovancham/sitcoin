const ClaimHolder = artifacts.require("ClaimHolder")
const { owner, ownerhex, dev1, dev1hex } = require("../scripts/walletAddress")
const truffleAssert = require('truffle-assertions');
const { initWeb3 } = require('../scripts/web3Module');

contract ("ClaimHolder", () => {
    // Initializes web3 context for interaction with contract
    const web3 = initWeb3()
    
    // Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	beforeEach(async () => {
        // New instance every test
		this.claimHolder = await ClaimHolder.deployed()
	})
})