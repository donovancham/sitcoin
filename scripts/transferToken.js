const SITcoin = artifacts.require("SITcoin")

module.exports = async function(callback) {
    try {
        const owner = "lat14nmuyvupslhjr8twv42e2ghn3sq6fhpxklu8sz"
        const dev1 = "lat1x9h7lrw06ank7x4fs3m39u6r07729wh7cmvx7z"
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
        console.log('Current Allowance of Dev1: ', allowance)
        console.log('Owner Balance: ', ownerBal)
        console.log('Dev1 Balance: ', dev1Bal)
        
        let trf = await instance.transfer(dev1, 100)
        console.log(trf)

        // console.log('Owner Balance: ', ownerBal)
        // console.log('Dev1 Balance: ', dev1Bal)

        // allowance = await instance.allowance(owner, dev1)
        // console.log('Updated allowance for dev1: ', allowance)

        // allowance = await instance.allowance(owner, owner)
        // console.log('Owner allowance: ', allowance)

        callback();
    }
    catch(error) {
        console.log(error)
    }
}

  
