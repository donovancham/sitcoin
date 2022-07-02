const Market = artifacts.require("Market")

module.exports = async function(callback) {
    try{
        //0x316fEf8DCFd7676f1aA9847712f3437fBCA2BAFe
        const seller = "lat1x9h7lrw06ank7x4fs3m39u6r07729wh7cmvx7z"
        //0xb50696Db639396C5DA0B29f38C4a3feDe653a092
        const buyer = "lat1k5rfdkmrjwtvtkst98eccj3lahn98gyjed6hp8"
        //0xAcf7C2338187ef219d6E65559522f38C01a4dC26
        const system = "lat14nmuyvupslhjr8twv42e2ghn3sq6fhpxklu8sz"
        console.log("seller: ", seller)
        console.log("buyer: ", buyer)

        //setting user balances
        let instance = await Market.deployed()
        let systemBal = await instance.balanceOf(system)
        
        console.log("systemBal: ", systemBal) //100 000

        let trfToBuyer = await instance.transfer(buyer, 800)
        let trfToSeller = await instance.transfer(seller, 800)
        let sellerBal = await instance.balanceOf(seller)
        let buyerBal = await instance.balanceOf(buyer)
        systemBal = await instance.balanceOf(system)

        
        console.log("trfToBuyer: ", trfToBuyer)
        console.log("trfToSeller: ", trfToSeller)
        console.log("systemBal: ", systemBal) //98400
        console.log("sellerBal: ", sellerBal) //800
        console.log("buyerBal: ", buyerBal) //800

        // ----------------Use Case: One buyer one seller scenario-----------------------
        console.log("addItem: ", addItem) //1
        addItem = await instance.createItem("Test Item 2", 20)
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

        let purchase = await instance.purchaseItem(1)
        console.log("purchase: ", purchase) //true
        sellerBal = await instance.balanceOf(seller)
        buyerBal = await instance.balanceOf(buyer)
        console.log("sellerBal: ", sellerBal) //810
        console.log("buyerBal: ", buyerBal) //790
        
        let noOfItemSold = await instance.getSoldItemCount()
        console.log("noOfItemSold: ", noOfItemSold) //1

        unsold = await instance.getUnsoldItems()
        console.log("unsold: ", unsold) // 1 item (array)

        let unlistItem = await instance.unlistItem(1)
        console.log("unlistItem: ", unlistItem) //false, because sold
        unlistItem = await instance.unlistItem(2)
        console.log("unlistItem: ", unlistItem) //true, not sold
        
        callback();
    }
    catch(error) {
        console.log(error)
    }
}