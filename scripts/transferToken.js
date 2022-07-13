const SITcoin = artifacts.require("SITcoin")
const { owner, dev1 } = require("./walletAddress")

module.exports = async function(callback) {
    try {
        console.log("Owner: ", owner)
        console.log('dev1: ', dev1)

        // Ensure that smart contract is deployed in memory environment before running
        let instance = await SITcoin.deployed()
        // console.log(instance)
        
        let allowance = await instance.allowance(owner, dev1)
        let ownerBal = await instance.balanceOf(owner)
        let dev1Bal = await instance.balanceOf(dev1)
        let supply = await instance.totalSupply()

        console.log('Total Supply: ', supply)
        console.log('Owner Balance: ', ownerBal)
        console.log('Dev1 Balance: ', dev1Bal)
        
        let trf = await instance.transfer(dev1, 100)
        console.log(trf)

        // Update balance
        ownerBal = await instance.balanceOf(owner)
        dev1Bal = await instance.balanceOf(dev1)

        console.log('Owner Balance: ', ownerBal)
        console.log('Dev1 Balance: ', dev1Bal)

        callback();
    }
    catch(error) {
        console.log(error)
    }
}

  
