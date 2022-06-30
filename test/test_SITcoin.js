// Note that the artifacts.require should be the contract name
// declared in the code and NOT the file name
const Contract = artifacts.require("SITcoin")
const sitcOwner = "lat17vxqyp28xtlhuvrgjz9436zg98hcshtcpg6wda"

contract("SITcoin", () => {
	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	before(async () => {
		instance = await Contract.deployed()
	})

    // Test if Contract initialized
    describe("#constructor(uint256 initialSupply)", function () {
        it("Ensure that contract is initialized", async () => {
            let balance = await instance.balanceOf(sitcOwner)
            assert.equal(balance, 100000)
        })
    })
})