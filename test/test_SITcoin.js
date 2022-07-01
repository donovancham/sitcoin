// Note that the artifacts.require should be the contract name
// declared in the code and NOT the file name
const Contract = artifacts.require("SITcoin")
const owner = "lat17vxqyp28xtlhuvrgjz9436zg98hcshtcpg6wda"
const dev1 = "lat1xetc8djtswghu3r0yk3p55jl25yhlr706l7545"

contract("SITcoin", () => {
	// Ensure that smart contract is deployed in memory environment before running
    // Use beforeEach to deploy new box for each test
	before(async () => {
		instance = await Contract.deployed()
	})

    // Test constructor
    // Test balanceOf()
    it("should be initialized with 100,000 tokens in owner wallet", async () => {
        let balance = await instance.balanceOf(owner)
        assert.equal(balance, 100000, 'balance not 100K')
    })

    // Test name()
    it("should be named 'SIT Coin'", async () => {
        assert.equal('SIT Coin', await instance.name(), 'Name wrong')
    })

    // Test symbol()
    it("should be symbol 'SITC'", async () => {
        assert.equal('SITC', await instance.symbol(), 'Symbol wrong')
    })

    // Test totalSupply()
    it("supply should be 100,000 tokens", async () => {
        assert.equal(100000, await instance.totalSupply(), 'Supply wrong')
    })

    // Test transfer()
    // Test balanceOf()
    it("should transfer tokens correctly", async() => {
        await instance.transfer(dev1, 300)
        assert.equal(await instance.balanceOf(owner), 99700, 'Sender does not have 99700 SITC')
        assert.equal(await instance.balanceOf(dev1), 300, 'Recipient does not have 300 SITC')
    })

    // Test mint()
    it("No permission should be denied access to mint", async() => {
        let instance2 = await Contract.new()
    })
})