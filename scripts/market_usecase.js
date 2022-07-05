const Market = artifacts.require("Market")
const SITcoin = artifacts.require("SITcoin")
const { dev2, dev3, owner } = require("../scripts/wallet_accounts")

module.exports = async function(callback) {
    try{
        let seller = dev2;
        let buyer = dev3;
        console.log("seller: ", seller)
        console.log("buyer: ", buyer)
        console.log("system: ", owner)

        //setting user balances
        let instance = await Market.deployed()
        let sitcInstance = await SITcoin.deployed()
        
        /**
         * Use Case: One buyer one seller scenario
        */
        //-----------------------Listing Item---------------------------------------------
        let addItem = await instance.createItem("Test Item", 20, {from: seller})
        console.log("addItem: ", addItem) //1
        addItem = await instance.createItem("Test Item 2", 20, {from: seller})
        console.log("addItem: ", addItem) //2

        //----------------------- Check Listed Item Exists --------------------------------
        let itemExist = await instance.checkItemExist(1)
        console.log("itemExist: ", itemExist) //true
        itemExist = await instance.checkItemExist(2)
        console.log("itemExist: ", itemExist) //true

        //----------------------- View Details of specific item ---------------------------
        let itemInfo = await instance.getItem(1)
        //{ id: 1, desc: 'Test Item', seller: seller addr, buyer: address(0), price: 10, sold: false }
        console.log("itemInfo: ", itemInfo) 
        itemInfo = await instance.getItem(2)
        //{ id: 2, desc: 'Test Item 2', seller: seller addr, buyer: address(0), price: 20, sold: false }
        console.log("itemInfo: ", itemInfo)

        //------------------------ Get details of unsold items ----------------------------
        let unsold = await instance.getUnsoldItems()
        console.log("unsold: ", unsold) // 2 items (array)

        //------------------------ Get details of all items -------------------------------
        let getAllItems = await instance.getAllItems()
        console.log("getAllItems: ", getAllItems) // 2 items (array)

        //------------------------ Increase Allowance -------------------------------------
        await sitcInstance.increaseAllowance(instance.address, 400, {from: buyer})
        //----------------------- Check Allowance -----------------------------------------
        let allowance = await sitcInstance.allowance(buyer, instance.address)
        console.log(allowance) //400

        //----------------------- Buy Item ------------------------------------------------
        let purchase = await instance.purchaseItem(1, {from: buyer})
        console.log("purchase: ", purchase) //true

        //----------------------- Check Remaining Allowance -------------------------------
        allowance = await sitcInstance.allowance(buyer, instance.address)
        console.log(allowance) //380
        
        //----------------------- Check Item Marked as sold and buyer address updated------
        itemInfo = await instance.getItem(1)
        //{ id: 1, desc: 'Test Item', seller: seller addr, buyer: address(0), price: 10, sold: true }
        console.log("itemInfo: ", itemInfo) 

        //----------------------- View reamining wallet balance after sale ----------------
        sellerBal = await sitcInstance.balanceOf(seller)
        buyerBal = await sitcInstance.balanceOf(buyer)
        console.log("sellerBal: ", sellerBal) //810
        console.log("buyerBal: ", buyerBal) //790
        
        //----------------------- Check updated sales count -------------------------------
        let noOfItemSold = await instance.getSoldItemCount()
        console.log("noOfItemSold: ", noOfItemSold) //1

        //----------------------- View list of unsold items -------------------------------
        unsold = await instance.getUnsoldItems()
        console.log("unsold: ", unsold) // 1 item (array)

        //----------------------- Seller unlist items --------------------------------------
        let unlistItem = await instance.unlistItem(1, {from: seller})
        console.log("unlistItem: ", unlistItem) //false, because sold
        unlistItem = await instance.unlistItem(2, {from: seller})
        console.log("unlistItem: ", unlistItem) //true, not sold
        
        //----------------------- Tries to unlist items not listed by them ------
        addItem = await instance.createItem("Test Item 3", 10, {from: seller})
        console.log("addItem: ", addItem) //3
        unlistItem = await instance.unlistItem(3, {from: buyer})
        console.log("unlistItem: ", unlistItem) //false, wrong seller address

        //----------------------- Check that item is still listed ---------------------------
        itemInfo = await instance.getItem(3)
        //{ id: 2, desc: 'Test Item 3', seller: seller addr, buyer: address(0), price: 10, sold: false }
        console.log("itemInfo: ", itemInfo)
        itemExist = await instance.checkItemExist(3)
        console.log("itemExist: ", itemExist) //true

        //----------------------- View all items on the market ------------------------------
        getAllItems = await instance.getAllItems()
        console.log("getAllItems: ", getAllItems) // 3 items (array), 1 unlisted

        callback();
    }
    catch(error) {
        console.log(error)
    }
}