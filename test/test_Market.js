// Note that the artifacts.require should be the contract name
// declared in the code and NOT the file name
const Contract = artifacts.require("Market")
//0x316fEf8DCFd7676f1aA9847712f3437fBCA2BAFe
const seller = "lat1x9h7lrw06ank7x4fs3m39u6r07729wh7cmvx7z"
//0xb50696Db639396C5DA0B29f38C4a3feDe653a092
const buyer = "lat1k5rfdkmrjwtvtkst98eccj3lahn98gyjed6hp8"
//0xAcf7C2338187ef219d6E65559522f38C01a4dC26
const system = "lat14nmuyvupslhjr8twv42e2ghn3sq6fhpxklu8sz"

contract("Market", () => {
	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	before(async () => {
		instance = await Contract.deployed()
	})

    // Test constructor
    // it("", async () => {
    //     let balance = await instance.balanceOf(seller)
    //     assert.equal(left, right, 'error comment')
    // })
    it("should transfer tokens correctly", async () => {
        await instance.transfer(buyer, 800)
        await instance.transfer(seller, 800)
        assert.equal(await instance.balanceOf(buyer), 800, 'Buyer does not have 800 SITC')
        assert.equal(await instance.balanceOf(seller), 800, 'Seller does not have 800 SITC')
    })
    it("Should add an item to the market", async () => {
        let counter = await instance.createItem("Test Item", 10)
        assert.equal(counter, 1, "item count incorrect")
        counter = await instance.createItem("Test Item 2", 10)
        assert.equal(counter, 2, "item count incorrect")
    })

    it("Should show item exists", async () => {
        let exists = await instance.checkItemExist(1)
        assert.equal(exists, true, "item does not exist")
        exists = await instance.checkItemExist(2)
        assert.equal(exists, true, "item does not exist")
    })

    it("get item at index", async () => {
        let item = await instance.getItem(1)
        assert.equal(item.id, 1, "item id incorrect")
        assert.equal(item.description, "Test Item", "item description incorrect")
        assert.equal(item.seller, seller, "item seller incorrect")
        assert.equal(item.buyer, address(0), "item buyer incorrect")
        assert.equal(item.price, 10, "item price incorrect")
        assert.equal(item.sold, false, "item sold incorrect")
        item = await instance.getItem(2)
        assert.equal(item.id, 2, "item id incorrect")
        assert.equal(item.description, "Test Item 2", "item description incorrect")
        assert.equal(item.seller, seller, "item seller incorrect")
        assert.equal(item.buyer, address(0), "item buyer incorrect")
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
        assert.equal(await instance.balanceOf(seller),800, "seller balance incorrect")
        assert.equal(await instance.balanceOf(buyer),800, "buyer balance incorrect")
        let sold = await instance.purchaseItem(1)
        assert.equal(sold, true, "item not sold")
        // Given them some tokens first, check if their wallet balance is correct
        assert.equal(await instance.balanceOf(seller),810, "seller balance incorrect")
        assert.equal(await instance.balanceOf(buyer),790, "buyer balance incorrect")
        assert.equal(await instance.getIemCount(), 2, "item count incorrect")
        assert.equal(await instance.getSoldItemCount(), 1, "Sold item count incorrect")
    })
    it("Should show unsold item(s)", async () => {
        let unsold = await instance.getUnsoldItems()
        assert.equal(unsold.length, 1, "unsold item count incorrect")
        assert.equal(unsold[0].description, "Test Item 2", "wrong item at index 0")
    })
    it("Items should be unlisted", async () => {
        let unlist = await instance.unlistItem(1)
        assert.equal(unlist, false, "error: item should not be unlisted since sold")
        unlist = await instance.unlistItem(2)
        assert.equal(unlist, true, "item should be unlisted since not sold")
    })
    it("Should show unlisted item doesn't exist", async () => {
        let exists = await instance.checkItemExist(1)
        assert.equal(exists, true, "item exist")
        exists = await instance.checkItemExist(2)
        assert.equal(exists, false, "item should have been unlisted")
    })
})