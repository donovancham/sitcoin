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
        console.log("systemBal: ", systemBal) //98400
        console.log("sellerBal: ", sellerBal) //800
        console.log("buyerBal: ", buyerBal) //800

        callback();
    }
    catch(error) {
        console.log(error)
    }
}