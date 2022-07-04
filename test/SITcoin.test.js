// test/SITcoin.test.js
// Load dependencies
const SITcoin = artifacts.require("SITcoin")
const { owner, ownerhex, dev1, dev1hex } = require("../scripts/wallet_accounts")
const truffleAssert = require('truffle-assertions');

contract("SITcoin", () => {
	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	before(async () => {
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

    // Test decimals()
    it("should show correct decimal", async () => {
        assert.equal(0, await this.sitcoin.decimals(), 'Wrong decimal')
    })

    // Test totalSupply()
    it("should show correct supply", async () => {
        assert.equal(100000, await this.sitcoin.totalSupply(), 'Wrong supply')
    })

    // Test transfer()
    // Test balanceOf()
    it("should transfer tokens correctly", async () => {
        // Transfer from owner to dev1 account
        let tx = await this.sitcoin.transfer(dev1, 300, {from:owner})

        // Check data from event emitted is correct
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.from == ownerhex && ev.to == dev1hex && ev.value.words[0] == 300
        })

        // Ensure balances match
        assert.equal(await this.sitcoin.balanceOf(owner, {from: owner}), 99700, 'Sender does not have 99700 SITC')
        assert.equal(await this.sitcoin.balanceOf(dev1, {from: owner}), 300, 'Recipient does not have 300 SITC')
    })

    // Test mint()
    it("should allow only owner to mint", async () => {
        // Test mint from owner
        let tx = await this.sitcoin.mint(owner, 100000, {from:owner})

        // Check data from event emitted is correct
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.from == 0 && ev.to === ownerhex && ev.value.words[0] == 100000
        })
        
        // Ensure supply updated
        assert.equal(await this.sitcoin.totalSupply(), 200000, 'Supply not updated')
        // Ensure owner balance has money
        assert.equal(await this.sitcoin.balanceOf(owner, {from:owner}), 199700, 'Tokens not updated')

        // Test mint from non-owner
        await truffleAssert.reverts(
            this.sitcoin.mint(dev1, 100000, {from:dev1}),
            "exited with an error"
        )
    })
})