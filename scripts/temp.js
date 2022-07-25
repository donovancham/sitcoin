/* eslint-disable no-undef */
const SITcoin = artifacts.require("SITcoin")
const { dev2, dev3, owner } = require("./walletAddress")

module.exports = async function(callback) {
    try{
        console.log("seller: ", dev3)
        console.log("buyer: ", dev2)
        console.log("system: ", owner)

        let sitc = await SITcoin.deployed()

        let systemBal = await sitc.balanceOf(owner)
        
        console.log("systemBal: ", systemBal) //100 000

        let trfToSeller = await sitc.transfer(dev3, 800)
        let trfToBuyer = await sitc.transfer(dev2, 800)
        
        let sellerBal = await sitc.balanceOf(dev3)
        let buyerBal = await sitc.balanceOf(dev2)
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