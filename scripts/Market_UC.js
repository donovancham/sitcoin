const Market = artifacts.require("Market")
const SITcoin = artifacts.require("SITcoin")
const { dev2, dev3, owner } = require("./walletAddress")

module.exports = async function(callback) {
    try{
        let seller = dev2;
        let buyer = dev3;
        console.log("seller: ", seller)
        console.log("buyer: ", buyer)
        console.log("system: ", owner)

        //setting user balances
        let market = await Market.deployed()
        let sitc = await SITcoin.deployed()
        
        /**
         * Use Case: One buyer one seller scenario
        */
        //-----------------------Listing Item---------------------------------------------
        let addItem = await market.createItem("Test Item", 20, {from: seller})
        console.log("addItem: ", addItem) //1
        addItem = await market.createItem("Test Item 2", 20, {from: seller})
        console.log("addItem: ", addItem) //2

        //----------------------- Check Listed Item Exists --------------------------------
        let itemExist = await market.checkItemExist(1)
        console.log("itemExist: ", itemExist) //true
        itemExist = await market.checkItemExist(2)
        console.log("itemExist: ", itemExist) //true

        //----------------------- View Details of specific item ---------------------------
        let itemInfo = await market.getItem(1)
        //{ id: 1, desc: 'Test Item', seller: seller addr, buyer: address(0), price: 10, sold: false }
        console.log("itemInfo: ", itemInfo) 
        itemInfo = await market.getItem(2)
        //{ id: 2, desc: 'Test Item 2', seller: seller addr, buyer: address(0), price: 20, sold: false }
        console.log("itemInfo: ", itemInfo)

        //------------------------ Get details of unsold items ----------------------------
        let unsold = await market.getUnsoldItems()
        console.log("unsold: ", unsold) // 2 items (array)

        //------------------------ Get details of all items -------------------------------
        let getAllItems = await market.getAllItems()
        console.log("getAllItems: ", getAllItems) // 2 items (array)

        //------------------------ Increase Allowance -------------------------------------
        await sitc.increaseAllowance(market.address, 20, {from: buyer})
        //----------------------- Check Allowance -----------------------------------------
        let allowance = await sitc.allowance(buyer, market.address)
        console.log(allowance) //400

        //----------------------- Buy Item ------------------------------------------------
        let purchase = await market.purchaseItem(1, {from: buyer})
        console.log("purchase: ", purchase) //true

        //----------------------- Check Remaining Allowance -------------------------------
        allowance = await sitc.allowance(buyer, market.address)
        console.log(allowance) //380
        
        //----------------------- Check Item Marked as sold and buyer address updated------
        itemInfo = await market.getItem(1)
        //{ id: 1, desc: 'Test Item', seller: seller addr, buyer: address(0), price: 10, sold: true }
        console.log("itemInfo: ", itemInfo) 

        //----------------------- View reamining wallet balance after sale ----------------
        sellerBal = await sitc.balanceOf(seller)
        buyerBal = await sitc.balanceOf(buyer)
        console.log("sellerBal: ", sellerBal) //810
        console.log("buyerBal: ", buyerBal) //790
        
        //----------------------- Check updated sales count -------------------------------
        let noOfItemSold = await market.getSoldItemCount()
        console.log("noOfItemSold: ", noOfItemSold) //1

        //----------------------- View list of unsold items -------------------------------
        unsold = await market.getUnsoldItems()
        console.log("unsold: ", unsold) // 1 item (array)

        //----------------------- Seller unlist items --------------------------------------

        unlistItem = await market.unlistItem(2, {from: seller})
        console.log("unlistItem: ", unlistItem) //true, not sold
        
        //----------------------- Add and check new items ---------------------------
        addItem = await market.createItem("Test Item 3", 10, {from: seller})
        console.log("addItem: ", addItem) //3
        
        itemInfo = await market.getItem(3)
        //{ id: 2, desc: 'Test Item 3', seller: seller addr, buyer: address(0), price: 10, sold: false }
        console.log("itemInfo: ", itemInfo)
        
        itemExist = await market.checkItemExist(3)
        console.log("itemExist: ", itemExist) //true

        //----------------------- View all items on the market ------------------------------
        getAllItems = await market.getAllItems()
        console.log("getAllItems: ", getAllItems) // 3 items (array), 1 unlisted

        callback();
    }
    catch(error) {
        console.log(error)
    }
}