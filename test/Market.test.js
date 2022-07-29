/* eslint-disable no-undef */
// Note that the artifacts.require should be the contract name
// declared in the code and NOT the file name
const Market = artifacts.require("Market")
const SITcoin = artifacts.require("SITcoin")
const { dev1, dev2, dev1hex } = require("../scripts/walletAddress")
const assertTruffle = require("../node_modules/truffle-assertions");

contract("Market", () => {
    var buyer = dev2;
    var seller = dev1;
    var sellerhex = dev1hex;
    var instance;
    var sitInstance;
    var emptyaddr = 0x0000000000000000000000000000000000000000;

	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	beforeEach(async () => {
		instance = await Market.deployed()
        sitInstance = await SITcoin.deployed()
	})
    // -------------- Test for checkItemExist() when market is empty -----------------
    it("Should show item doesn't exist", async () => {
        assert.equal(await instance.checkItemExist(1), false, "item shouldn't exist")
    })
    // -------------- Test transfer of initial tokens to accounts -----------------
    it("should transfer tokens correctly", async () => {
        await sitInstance.transfer(buyer, 800)
        await sitInstance.transfer(seller, 800)
        assert.equal(await sitInstance.balanceOf(buyer), 800, 'buyer does not have 800 SITC')
        assert.equal(await sitInstance.balanceOf(seller), 800, 'seller does not have 800 SITC')
    })
    // -------------- Test creation of item(s)  -----------------
    it("Should add an item to the market", async () => {
        await instance.createItem("Test Item", 10, {from: seller})
        await instance.createItem("Test Item 2", 10, {from: seller})
    })
    // -------------- Test checkItemExist() on added items -----------------
    it("Should show item exists", async () => {
        let exists = await instance.checkItemExist(1)
        assert.equal(exists, true, "item does not exist")
        exists = await instance.checkItemExist(2)
        assert.equal(exists, true, "item does not exist")
    })
    // -------------- Test getItem() to make sure market is updated -----------------
    it("get item at index", async () => {
        let item = await instance.getItem(1)
        assert.equal(item.id, 1, "item count incorrect")
        assert.equal(item.description, "Test Item", "item Description wrong")
        assert.equal(item.seller, sellerhex, "wrong address")
        assert.equal(item.buyer, emptyaddr, "wrong address")
        assert.equal(item.price, 10, "wrong price")
        assert.equal(item.sold, false, "wrong sold")
        
        item = await instance.getItem(2)
        assert.equal(item.id, 2, "item count incorrect")
        assert.equal(item.description, "Test Item 2", "item Description wrong")
        assert.equal(item.seller, sellerhex, "wrong address")
        assert.equal(item.buyer, emptyaddr, "wrong address")
        assert.equal(item.price, 10, "wrong price")
        assert.equal(item.sold, false, "wrong sold")
    })
    // -------------- Test that items are identified as not sold, using getUnsoldItems() -----------------
    it("Should show unsold item(s)", async () => {
        let unsold = await instance.getUnsoldItems()
        assert.equal(unsold.length, 2, "unsold item count incorrect")
        assert.equal(unsold[0].description, "Test Item", "wrong item at index 0")
        assert.equal(unsold[1].description, "Test Item 2", "wrong item at index 1")
    })
    // -------------- Test the ability to get all market items  -----------------
    it("Should return all items", async () => {
        let all = await instance.getAllItems()
        assert.equal(all.length, 2, "all item count incorrect")
        assert.equal(all[0].description, "Test Item", "wrong item at index 0")
        assert.equal(all[1].description, "Test Item 2", "wrong item at index 1")
    })
    // -------------- Test the ability to transfer allowance -----------------
    it("Should increase allowance from buyer to market contract", async () => {
        await sitInstance.increaseAllowance(instance.address, 10, {from:buyer})
        await sitInstance.allowance(buyer, instance.address).then(function(balance) { balanceInstance = balance})
        assert.equal(balanceInstance.words[0], 10, "wrong allowance")
    })
    // -------------- Test the ability to buy items -----------------
    it("Should allow item for purchase", async () => {
        await instance.purchaseItem(1, {from: buyer})
        
    })
    it("should not list sold items", async () => {
        let unsold = await instance.getUnsoldItems()
        assert.equal(unsold.length, 1, "unsold item count incorrect")
        assert.equal(unsold[0].description, "Test Item 2", "wrong item at index 0")
    })
    // -------------- Test the ability to unlist items -----------------
    it("Items should be unlisted when applicable", async () => {
        await assertTruffle.reverts(instance.unlistItem(1, {from: seller}))
        assert.equal(await instance.checkItemExist(1), true, "item should not be unlisted")

        await instance.unlistItem(2, {from: seller})
        checkItemExist = await instance.checkItemExist(2)
        assert.equal(checkItemExist, false, "item should be unlisted since not sold")
    })
    // -------------- Test that the balance of users involved in transactions are correct -----------------
    it("should check buyer and seller balance", async () => {
        // Given them some tokens first, check if their wallet balance is correct
        let sellerbal = await sitInstance.balanceOf(seller)
        let buyerbal = await sitInstance.balanceOf(buyer)     
        assert.equal(sellerbal,810, "seller balance incorrect")
        assert.equal(buyerbal,790, "buyer balance incorrect")
    })
    // --------------- Test that Items are added and listed correctly -----------------
    it("Should add item 3 onto the market", async () => {
        // console.log(await instance.createItem("Test Item 3", 30, {from: seller}))
        all = await instance.getAllItems()
        assert.equal(all.length, 3, "all item count incorrect")
        assert.equal(all[0].description, "Test Item", "wrong item at index 0")
        assert.equal(all[1].description, '', "wrong item at index 1")
        assert.equal(all[2].description, "Test Item 3", "wrong item at index 2")
    })
    // --------------- Test that users other than seller cannot unlist items -----------------
    it("Should not allow unlisting from users other than the seller", async () => {
        await assertTruffle.reverts(instance.unlistItem(3, {from: buyer}))   
        assert.equal(await instance.checkItemExist(3), true, "item should not be unlisted")
    })
})