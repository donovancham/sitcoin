// Note that the artifacts.require should be the contract name
// declared in the code and NOT the file name
const Contract = artifacts.require("Market")
// chnage if needed
const owner = "lat17vxqyp28xtlhuvrgjz9436zg98hcshtcpg6wda"
const dev1 = "lat1xetc8djtswghu3r0yk3p55jl25yhlr706l7545"

contract("Market", () => {
	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	before(async () => {
		instance = await Contract.deployed()
	})

    // Test constructor
    // it("", async () => {
    //     let balance = await instance.balanceOf(owner)
    //     assert.equal(left, right, 'error comment')
    // })

})