const SITcoin = artifacts.require("SITcoin")
//dev3 = buyer, dev2 = seller
const { dev2, dev3, owner } = require("../scripts/wallet_accounts")

module.exports = async function(callback) {
    try{
        console.log("seller: ", dev2)
        console.log("buyer: ", dev3)
        console.log("system: ", owner)

        let sitc = await SITcoin.deployed()

        let systemBal = await sitc.balanceOf(owner)
        
        console.log("systemBal: ", systemBal) //100 000

        let trfToBuyer = await sitc.transfer(dev3, 800)
        let trfToSeller = await sitc.transfer(dev2, 800)
        let sellerBal = await sitc.balanceOf(dev2)
        let buyerBal = await sitc.balanceOf(dev3)
        systemBal = await sitc.balanceOf(owner)

        
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
//let seller = "lat1ed0c92vu5puul7aud2lgltcpd66pj6dm0rcyvw"
//let buyer = "lat143qqa2ek84tjj07tnm6p2quup5yuzeyv77c04u"
//let system = "lat14nmuyvupslhjr8twv42e2ghn3sq6fhpxklu8sz"
//let owner = "lat1rd8c02e905rguunal8ck77ftct0jph2v6zj7cq"