// test/SITcoin.test.js
// Load dependencies
const SITcoin = artifacts.require("SITcoin")
const { owner, ownerhex, dev1, dev1hex } = require("../scripts/wallet_accounts")
const truffleAssert = require('truffle-assertions');

contract("SITcoin", () => {
    var ownerBal;
    var dev1Bal;

	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	beforeEach(async () => {
        // New instance every test
		this.sitcoin = await SITcoin.deployed()
        
        ownerBal = await this.sitcoin.balanceOf(owner).then( bal => {
            return bal.toNumber()
        })
        dev1Bal = await this.sitcoin.balanceOf(dev1).then( bal => {
            return bal.toNumber()
        })
	})

    // Test name()
    // Test symbol()
    // Test decimals()
    // Test totalSupply()
    it("should be able to get basic info", async () => {
        assert.equal('SIT Coin', await this.sitcoin.name(), 'Wrong name')
        assert.equal('SITC', await this.sitcoin.symbol(), 'Wrong symbol')
        assert.equal(0, await this.sitcoin.decimals(), 'Wrong decimal')
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

        // Update balances
        // ownerBal = ownerBal - 300
        // dev1Bal = dev1Bal + 300

        // Ensure balances match
        assert.equal(
            await this.sitcoin.balanceOf(owner, {from: owner}), 
            ownerBal - 300, 
            'Sender does not have 300 less SITC'
        )
        assert.equal(
            await this.sitcoin.balanceOf(dev1, {from: owner}),
            dev1Bal + 300, 
            'Recipient does not have 300 more SITC'
        )
    })

    // Test mint()
    it("should allow only owner to mint", async () => {
        // Test mint from owner
        let tx = await this.sitcoin.mint(owner, 100000, {from:owner})

        // Check data from event emitted is correct
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.from == 0 && ev.to === ownerhex && ev.value.words[0] == 100000
        })

        // Update balance
        // ownerBal = ownerBal + 100000
        
        // Ensure supply updated
        assert.equal(await this.sitcoin.totalSupply(), 200000, 'Supply not updated')
        // Ensure owner balance has money
        assert.equal(await this.sitcoin.balanceOf(owner, {from:owner}), ownerBal + 100000, 'Tokens not updated')

        // Test mint from non-owner
        await truffleAssert.reverts(
            this.sitcoin.mint(dev1, 100000, {from:dev1}),
            "exited with an error"
        )
    })
})