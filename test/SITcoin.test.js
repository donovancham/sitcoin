/* eslint-disable no-undef */
// test/SITcoin.test.js
// Load dependencies
const SITcoin = artifacts.require("SITcoin")
const { owner, ownerhex, dev1, dev1hex, dev2, dev2hex, dev3, dev3hex } = require("../scripts/walletAddress")
const truffleAssert = require('truffle-assertions');
const { initWeb3 } = require('../scripts/web3Module');
const addressZero = '0x0000000000000000000000000000000000000000';

contract("SITcoin", () => {
    var ownerBal;
    var dev1Bal;
    var dev2Bal;
    const initialSupply = 10000000
    const web3 = initWeb3()

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
        dev2Bal = await this.sitcoin.balanceOf(dev2).then( bal => {
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
        assert.equal(initialSupply, await this.sitcoin.totalSupply(), 'Wrong supply')
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
    // Test grantMinterRole()
    // Test revokeMinterRole()
    it("should allow permissioned users to mint", async () => {

        const mintAmount = 100000

        // Grant MINTER permissions to dev1
        await this.sitcoin.grantMinterRole(dev1, {from:owner});

        // Test that permissioned user is able to mint
        let tx = await this.sitcoin.mint(owner, mintAmount, {from:dev1})

        // Check data from event emitted is correct
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.from == 0 && ev.to === ownerhex && ev.value.words[0] == mintAmount
        })
        
        // Ensure supply updated
        assert.equal(await this.sitcoin.totalSupply(), initialSupply + mintAmount, 'Supply not updated')
        // Ensure owner balance has money
        assert.equal(await this.sitcoin.balanceOf(owner, {from:owner}), ownerBal + mintAmount, 'Tokens not updated')

        // Revoke MINTER permissions from dev1
        await this.sitcoin.revokeMinterRole(dev1, {from:owner})

        // Test mint from non-owner
        await truffleAssert.reverts(
            this.sitcoin.mint(dev1, mintAmount, {from:dev1}),
            "exited with an error (status 0)"
        )
    })

    // Test approve()
    // Test allowance()
    // Test transferFrom()
    it("should allow third-party transfer execution", async () => {
        // Setup Roles
        let buyer = owner
        let buyerhex = ownerhex
        let seller = dev1
        let sellerhex = dev1hex
        let market = dev2
        let markethex = dev2hex

        // 1. Buyer approves funds for market
        let tx = await this.sitcoin.approve(market, 100, {from:buyer})
        truffleAssert.eventEmitted(tx, 'Approval', (ev) => {
            return ev.owner == buyerhex && ev.spender === markethex && ev.value.words[0] == 100
        })

        // Ensure seller allowance matches
        assert.equal(await this.sitcoin.allowance(buyer, market), 100, 'Allowance not updated')

        // 2. Market initiates transaction
        tx = await this.sitcoin.transferFrom(buyer, seller, 100, {from:dev2})
        truffleAssert.eventEmitted(tx, 'Approval', (ev) => {
            return ev.owner == buyerhex && ev.spender === markethex && ev.value.words[0] == 0
        })
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.from == buyerhex && ev.to === sellerhex && ev.value.words[0] == 100
        })

        // Ensure no more allowance
        assert.equal(await this.sitcoin.allowance(buyer, market), 0, 'Allowance not used up')
        // Ensure seller account balance increased
        assert.equal(await this.sitcoin.balanceOf(seller), dev1Bal + 100, 'No money')
    })
    
    // Test allowance()
    // Test decreaseAllowance()
    // Test increaseAllowance()
    it("should allow users to remove allowances", async () => {
        let tx = await this.sitcoin.increaseAllowance(dev1, 200, {from:owner})
        truffleAssert.eventEmitted(tx, 'Approval', (ev) => {
            return ev.owner == ownerhex && ev.spender === dev1hex && ev.value.words[0] == 200
        })

        // Check allowance
        assert.equal(await this.sitcoin.allowance(owner, dev1), 200, 'Allowance not updated')

        // Ensure unable to decrease allowance below 0
        await truffleAssert.reverts(
            this.sitcoin.decreaseAllowance(dev1, 100000, {from:owner}),
            "exited with an error (status 0)"
        )
        
        // Check if allowance will be successfully deducted
        tx = await this.sitcoin.decreaseAllowance(dev1, 50, {from:owner})
        truffleAssert.eventEmitted(tx, 'Approval', (ev) => {
            return ev.owner == ownerhex && ev.spender === dev1hex && ev.value.words[0] == 150
        })

        assert.equal(await this.sitcoin.allowance(owner, dev1), 150, 'Allowance not deducted')
    })

    // Test burn()
    // Test burnFrom()
    it("should allow token burning from accounts owning sitcoin", async () => {
        // Execute burn function to burn
        let tx = await this.sitcoin.burn(1100, {from:owner})
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.from == ownerhex && ev.to === addressZero && ev.value.words[0] == 1100
        })

        // Ensure balance matches up with the amount
        assert.equal(await this.sitcoin.balanceOf(owner), ownerBal - 1100, 'Tokens not burnt')

        // Burn from existing allowance in dev1
        tx = await this.sitcoin.burnFrom(owner, 150, {from: dev1})
        
        // Check if allowance will be successfully deducted
        truffleAssert.eventEmitted(tx, 'Approval', (ev) => {
            return ev.owner == ownerhex && ev.spender === dev1hex && ev.value.words[0] == 0
        })

        // Ensure that value is burnt
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.from == ownerhex && ev.to === addressZero && ev.value.words[0] == 150
        })
    })
})