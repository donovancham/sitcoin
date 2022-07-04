const Market = artifacts.require("Market")
const SITcoin = artifacts.require("SITcoin")
const { seller, buyer, system } = require("../scripts/wallet_accounts")

module.exports = async function(callback) {
    try{
        console.log("seller: ", seller)
        console.log("buyer: ", buyer)
        console.log("system: ", system)

        //setting user balances
        let instance = await Market.deployed()
        let sitcInstance = await SITcoin.deployed()

        // let systemBal = await sitcInstance.balanceOf(system)
        
        // console.log("systemBal: ", systemBal) //100 000

        // let trfToBuyer = await sitcInstance.transfer(buyer, 800)
        // let trfToSeller = await sitcInstance.transfer(seller, 800)
        // let sellerBal = await sitcInstance.balanceOf(seller)
        // let buyerBal = await sitcInstance.balanceOf(buyer)
        // systemBal = await sitcInstance.balanceOf(system)

        
        // console.log("trfToBuyer: ", trfToBuyer)
        // console.log("trfToSeller: ", trfToSeller)
        // console.log("systemBal: ", systemBal) //98400
        // console.log("sellerBal: ", sellerBal) //800
        // console.log("buyerBal: ", buyerBal) //800

        // ----------------Use Case: One buyer one seller scenario-----------------------
        let addItem = await instance.createItem("Test Item", 20, {from: seller})
        console.log("addItem: ", addItem) //1
        addItem = await instance.createItem("Test Item 2", 20, {from: seller})
        console.log("addItem: ", addItem) //2

        let itemExist = await instance.checkItemExist(1)
        console.log("itemExist: ", itemExist) //true
        itemExist = await instance.checkItemExist(2)
        console.log("itemExist: ", itemExist) //true

        let itemInfo = await instance.getItem(1)
        //{ id: 1, desc: 'Test Item', seller: seller addr, buyer: address(0), price: 10, sold: false }
        console.log("itemInfo: ", itemInfo) 
        itemInfo = await instance.getItem(2)
        //{ id: 2, desc: 'Test Item 2', seller: seller addr, buyer: address(0), price: 20, sold: false }
        console.log("itemInfo: ", itemInfo)

        let unsold = await instance.getUnsoldItems()
        console.log("unsold: ", unsold) // 2 items (array)

        let getAllItems = await instance.getAllItems()
        console.log("getAllItems: ", getAllItems) // 2 items (array)
        //----------------------------------------------------------------------------------------------------
        await sitcInstance.increaseAllowance(instance.address, 400, {from: buyer})
        let allowance = await sitcInstance.allowance(buyer, instance.address)
        console.log(allowance) //400

        let purchase = await instance.purchaseItem(1, {from: buyer})
        console.log("purchase: ", purchase) //true

        allowance = await sitcInstance.allowance(buyer, instance.address)
        console.log(allowance) //380
        
        itemInfo = await instance.getItem(1)
        //{ id: 1, desc: 'Test Item', seller: seller addr, buyer: address(0), price: 10, sold: false }
        console.log("itemInfo: ", itemInfo) 

        sellerBal = await sitcInstance.balanceOf(seller)
        buyerBal = await sitcInstance.balanceOf(buyer)
        console.log("sellerBal: ", sellerBal) //810
        console.log("buyerBal: ", buyerBal) //790
        
        let noOfItemSold = await instance.getSoldItemCount()
        console.log("noOfItemSold: ", noOfItemSold) //1

        unsold = await instance.getUnsoldItems()
        console.log("unsold: ", unsold) // 1 item (array)

        let unlistItem = await instance.unlistItem(1, {from: seller})
        console.log("unlistItem: ", unlistItem) //false, because sold
        unlistItem = await instance.unlistItem(2, {from: seller})
        console.log("unlistItem: ", unlistItem) //true, not sold
        
        getAllItems = await instance.getAllItems()
        console.log("getAllItems: ", getAllItems) // 2 items (array)

        callback();
    }
    catch(error) {
        console.log(error)
    }
}