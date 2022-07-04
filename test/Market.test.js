// Note that the artifacts.require should be the contract name
// declared in the code and NOT the file name
const Market = artifacts.require("Market")
const SITcoin = artifacts.require("SITcoin")
const { dev1, dev2, dev1hex, dev2hex } = require("../scripts/wallet_accounts")

contract("Market", () => {
	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	beforeEach(async () => {
		instance = await Market.deployed()
        sitInstance = await SITcoin.deployed()
	})
    
    // Test constructor
    // it("", async () => {
    //     let balance = await instance.balanceOf(dev1)
    //     assert.equal(left, right, 'error comment')
    // })
    it("Should show item doesn't exist", async () => {
        let exists = await instance.checkItemExist(1)
        assert.equal(exists, false, "item shouldn't exist")
    })

    it("should transfer tokens correctly", async () => {
        await sitInstance.transfer(dev2, 800)
        await sitInstance.transfer(dev1, 800)
        assert.equal(await sitInstance.balanceOf(dev2), 800, 'dev2 does not have 800 SITC')
        assert.equal(await sitInstance.balanceOf(dev1), 800, 'dev1 does not have 800 SITC')
    })

    it("Should add an item to the market", async () => {
        await instance.createItem("Test Item", 10, {from: dev1})
        await instance.createItem("Test Item 2", 10, {from: dev1})

        let item = await instance.getItem(1)
        console.log("item 1: ", item)
        assert.equal(item.id, 1, "item count incorrect")
        assert.equal(item.description, "Test Item", "item Description wrong")
        assert.equal(item.seller, dev1hex, "wrong address")
        assert.equal(item.buyer, 0x0000000000000000000000000000000000000000, "wrong address")
        assert.equal(item.price, 10, "wrong price")
        assert.equal(item.sold, false, "wrong sold")
        
        item = await instance.getItem(2)
        console.log("item 2: ", item)
        assert.equal(item.id, 2, "item count incorrect")
        assert.equal(item.description, "Test Item 2", "item Description wrong")
        assert.equal(item.seller, dev1hex, "wrong address")
        assert.equal(item.buyer, 0x0000000000000000000000000000000000000000, "wrong address")
        assert.equal(item.price, 10, "wrong price")
        assert.equal(item.sold, false, "wrong sold")
    })

    it("Should show item exists", async () => {
        let exists = await instance.checkItemExist(1)
        console.log("exists 1: ", exists)
        assert.equal(exists, true, "item does not exist")
        exists = await instance.checkItemExist(2)
        console.log("exists 2: ", exists)
        assert.equal(exists, true, "item does not exist")
    })

    it("get item at index", async () => {
        let item = await instance.getItem(1)
        assert.equal(item.id, 1, "item id incorrect")
        assert.equal(item.description, "Test Item", "item description incorrect")
        assert.equal(item.seller, dev1hex, "item dev1 incorrect")
        assert.equal(item.buyer, 0x0000000000000000000000000000000000000000, "item dev2 incorrect")
        assert.equal(item.price, 10, "item price incorrect")
        assert.equal(item.sold, false, "item sold incorrect")
        item = await instance.getItem(2)
        assert.equal(item.id, 2, "item id incorrect")
        assert.equal(item.description, "Test Item 2", "item description incorrect")
        assert.equal(item.seller, dev1hex, "item dev1 incorrect")
        assert.equal(item.buyer, 0x0000000000000000000000000000000000000000, "item dev2 incorrect")
    })

    it("Should show unsold item(s)", async () => {
        let unsold = await instance.getUnsoldItems()
        assert.equal(unsold.length, 2, "unsold item count incorrect")
        assert.equal(unsold[0].description, "Test Item", "wrong item at index 0")
        assert.equal(unsold[1].description, "Test Item 2", "wrong item at index 1")
    })

    it("Should return all items", async () => {
        let all = await instance.getAllItems()
        assert.equal(all.length, 2, "all item count incorrect")
        assert.equal(all[0].description, "Test Item", "wrong item at index 0")
        assert.equal(all[1].description, "Test Item 2", "wrong item at index 1")
    })

    it("Should mark item as sold", async () => {
        let sold = await instance.purchaseItem(1, {from: dev2})
        console.log("sold: ", sold)
        //assert.equal(sold, true, "item not sold")

        // Given them some tokens first, check if their wallet balance is correct
        let bal = await sitInstance.balanceOf(dev1)
        console.log("dev1 balance: ", bal)
        assert.equal(bal,810, "dev1 balance incorrect")
        
        bal = await sitInstance.balanceOf(dev2)
        console.log("dev2 balance: ", bal)
        assert.equal(bal,790, "dev2 balance incorrect")

        assert.equal(await instance.getIemCount(), 2, "item count incorrect")
        assert.equal(await instance.getSoldItemCount(), 1, "Sold item count incorrect")
    })
    // it("Should show unsold item(s)", async () => {
    //     let unsold = await instance.getUnsoldItems()
    //     assert.equal(unsold.length, 1, "unsold item count incorrect")
    //     assert.equal(unsold[0].description, "Test Item 2", "wrong item at index 0")
    // })
    // it("Items should be unlisted", async () => {
    //     let unlist = await instance.unlistItem(1)
    //     assert.equal(unlist, false, "error: item should not be unlisted since sold")
    //     unlist = await instance.unlistItem(2)
    //     assert.equal(unlist, true, "item should be unlisted since not sold")
    // })
    // it("Should show unlisted item doesn't exist", async () => {
    //     let exists = await instance.checkItemExist(1)
    //     assert.equal(exists, true, "item exist")
    //     exists = await instance.checkItemExist(2)
    //     assert.equal(exists, false, "item should have been unlisted")
    // })
})