// Note that the artifacts.require should be the contract name
// declared in the code and NOT the file name
const Contract = artifacts.require("SITcoin")
const { owner, dev1, minter } = require("../scripts/wallet_accounts")
const truffleAssert = require('truffle-assertions');

contract("SITcoin", () => {
	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	before(async () => {
		instance = await Contract.deployed()
	})

    // Test constructor
    // Test balanceOf()
    it("should be initialized with 100,000 tokens in owner wallet", async () => {
        let balance = await instance.balanceOf(owner)
        assert.equal(balance, 100000, 'balance not 100K')
    })

    // Test name()
    it("should be named 'SIT Coin'", async () => {
        assert.equal('SIT Coin', await instance.name(), 'Name wrong')
    })

    // Test symbol()
    it("should be symbol 'SITC'", async () => {
        assert.equal('SITC', await instance.symbol(), 'Symbol wrong')
    })

    // Test totalSupply()
    it("supply should be 100,000 tokens", async () => {
        assert.equal(100000, await instance.totalSupply(), 'Supply wrong')
    })

    // Test transfer()
    // Test balanceOf()
    it("should transfer tokens correctly", async () => {
        // Transfer from owner to dev1 account
        await instance.transfer(dev1, 300, {from:owner})
        assert.equal(await instance.balanceOf(owner), 99700, 'Sender does not have 99700 SITC')
        assert.equal(await instance.balanceOf(dev1), 300, 'Recipient does not have 300 SITC')
    })

    // Test grantMinter()
    // revoke()
    it("non-admin cannot call promote or demote functions", async () => {
        // Ensure that promote minter results in failure
        await truffleAssert.reverts(
            instance.grantMinter(minter, {from: dev1}),
            "exited with an error"
        )

        // Ensure that revoke minter results in failure
        await truffleAssert.reverts(
            instance.revokeMinter(minter, {from: dev1}),
            "exited with an error"
        )
    })

    // Test mint()
    // Test grantMinter()
    // revoke()
    it("minter should be able to mint", async () => {
        // Give minter permission
        await instance.grantMinter(minter, {from:owner})

        // Test mint
        await instance.mint(dev1, 100, {from:minter})
        assert.equal(await instance.balanceOf(dev1, {from:dev1}), 400, 'Mint unsuccessful')

        // Remove minter permission
        await instance.revokeMinter(minter, {from:owner})

        await truffleAssert.reverts(
            instance.mint(dev1, 100, {from:minter}),
            "exited with an error"
        )
    })
})