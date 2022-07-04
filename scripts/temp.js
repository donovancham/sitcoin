const SITcoin = artifacts.require("SITcoin")
const { seller, buyer, system } = require("../scripts/wallet_accounts")

module.exports = async function(callback) {
    try{
        console.log("seller: ", seller)
        console.log("buyer: ", buyer)
        console.log("system: ", system)

        let sitc = await SITcoin.deployed()

        let systemBal = await sitc.balanceOf(system)
        
        console.log("systemBal: ", systemBal) //100 000

        let trfToBuyer = await sitc.transfer(buyer, 800)
        let trfToSeller = await sitc.transfer(seller, 800)
        let sellerBal = await sitc.balanceOf(seller)
        let buyerBal = await sitc.balanceOf(buyer)
        systemBal = await sitc.balanceOf(system)

        
        console.log("trfToBuyer: ", trfToBuyer)
        console.log("trfToSeller: ", trfToSeller)
        console.log("systemBal: ", systemBal)
        console.log("sellerBal: ", sellerBal)
        console.log("buyerBal: ", buyerBal)

        callback();
    }
    catch(error) {
        console.log(error)
    }
}
//let seller = "lat1x9h7lrw06ank7x4fs3m39u6r07729wh7cmvx7z"
//let buyer = "lat1k5rfdkmrjwtvtkst98eccj3lahn98gyjed6hp8"
//let system = "lat14nmuyvupslhjr8twv42e2ghn3sq6fhpxklu8sz"