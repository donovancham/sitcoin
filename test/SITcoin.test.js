// test/SITcoin.test.js
// Load dependencies
const SITcoin = artifacts.require("SITcoin")
const { owner, dev1, minter } = require("../scripts/wallet_accounts")
const truffleAssert = require('truffle-assertions');

contract("SITcoin", () => {
	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	beforeEach(async () => {
        // New instance every test
		this.sitcoin = await SITcoin.deployed()
	})

    // Test constructor
    // Test balanceOf()
    it("should be initialized with 100,000 tokens in owner wallet", async () => {
        let balance = await this.sitcoin.balanceOf(owner, {from: owner})
        assert.equal(balance, 100000, 'Wrong balance')
    })

    // Test name()
    it("should show correct name", async () => {
        assert.equal('SIT Coin', await this.sitcoin.name(), 'Wrong name')
    })

    // Test symbol()
    it("should show correct symbol", async () => {
        assert.equal('SITC', await this.sitcoin.symbol(), 'Wrong symbol')
    })

    // Test totalSupply()
    it("should show correct supply", async () => {
        assert.equal(100000, await this.sitcoin.totalSupply(), 'Wrong supply')
    })

    // Test transfer()
    // Test balanceOf()
    it("should transfer tokens correctly", async () => {
        // Transfer from owner to dev1 account
        await this.sitcoin.transfer(dev1, 300, {from:owner})
        assert.equal(await this.sitcoin.balanceOf(owner, {from: owner}), 99700, 'Sender does not have 99700 SITC')
        assert.equal(await this.sitcoin.balanceOf(dev1, {from: owner}), 300, 'Recipient does not have 300 SITC')
    })

    // Test grantMinter()
    // Test revokeMinter()
    it("deny non-admin from accessing privileged functions", async () => {
        // Ensure that promote minter results in failure
        await truffleAssert.reverts(
            this.sitcoin.grantMinter(minter, {from: dev1}),
            "exited with an error"
        )

        // Ensure that revoke minter results in failure
        await truffleAssert.reverts(
            this.sitcoin.revokeMinter(minter, {from: dev1}),
            "exited with an error"
        )
    })

    // Test mint()
    // Test grantMinter()
    // Test revokeMinter()
    it("should allow minter to mint", async () => {
        // Give minter permission
        await this.sitcoin.grantMinter(minter, {from:owner})

        // Test mint
        await this.sitcoin.mint(dev1, 100, {from:minter})
        assert.equal(await this.sitcoin.balanceOf(dev1, {from:dev1}), 100, 'Mint unsuccessful')

        // Remove minter permission
        await this.sitcoin.revokeMinter(minter, {from:owner})

        await truffleAssert.reverts(
            this.sitcoin.mint(dev1, 100, {from:minter}),
            "exited with an error"
        )
    })
})