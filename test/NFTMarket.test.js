const SITcoin = artifacts.require("SITcoin");
const NFTMarket = artifacts.require("NFTMarket");
const NFT = artifacts.require("NFT");
const { dev1, dev1hex, dev2, dev2hex } = require("../scripts/walletAddress");
const { expect } = require("chai");

contract("NFTMarket", () => {
    var nft;
    var market;
    var sitc;
    var user1 = dev1;
    var user1hex = dev1hex;
    var user2 = dev2;
    var user2hex = dev2hex;
    var URI = "SampleLink";

    beforeEach(async () => {
        sitc = await SITcoin.deployed()
        nft = await NFT.deployed()
        market = await NFTMarket.deployed()

    })
    describe("Contract Deployment", () => {

        it("Should track name and symbol of nft collections", async () => {
            expect(await nft.name()).to.equal("SITC NFT")
            expect(await nft.symbol()).to.equal("SITC")
            //assert.equal(await nftInstance.symbol(), "SITC", "symbol is wrong");
        })
        it("Should track name and symbol of sitc", async () => {
            expect(await sitc.name()).to.equal("SIT Coin")
            expect(await sitc.symbol()).to.equal("SITC")
        })
    });
    describe("Minting NFTs", () => {

        it("Should track each minted NFT", async () => {
            //user1 mint an NFT
            let mint = await nft.mint(URI, {from: user1})
            console.log("mint: ", mint)

            // total number of tokens in NFT contract
            await nft.counter().then(function(count) { countInstance = count})
            console.log("counter: ", countInstance.words[0])
            // Mapping owner address to token count in ERC721 contract
            await nft.balanceOf(user1).then(function(balance) { balanceInstance = balance})
            console.log("balance: ", balanceInstance.words[0])
            // Mapping token id to token URI in ERC721URIStorage contract     
            let uri = await nft.tokenURI(1)
            console.log("uri: ", uri)

            expect(countInstance.words[0]).to.equal(1)
            expect(balanceInstance.words[0]).to.equal(1)    
            expect(uri).to.equal(URI)

            //user2 mint an NFT
            mint = await nft.mint(URI, {from: user2})
            console.log("mint: ", mint)

            await nft.counter().then(function(count) { countInstance = count})
            console.log("counter: ", countInstance.words[0])
            await nft.balanceOf(user2).then(function(balance) { balanceInstance = balance})
            console.log("balance: ", balanceInstance.words[0]) 
            uri = await nft.tokenURI(2)
            console.log("uri: ", uri)

            expect(countInstance.words[0]).to.equal(2)
            expect(balanceInstance.words[0]).to.equal(1)    
            expect(uri).to.equal(URI)

        })
    });
    describe("Making marketplace items", () => {
        let price = 10;
        it("Should approve marketplace to spend nft", async () => {
            // in IERC721: setApprovalForAll(address operator, bool _approved);
            // user1 approves marketplace to spend nft (is like increase allowance for ERC20)
            let approve = await nft.setApprovalForAll(market.address, true, {from: user1})
            console.log("approve: ", approve)

            let checkapproved = await nft.isApprovedForAll(user1, market.address)
            console.log("checkapproved: ", checkapproved)
            expect(checkapproved).to.equal(true)
        })
        
        it("Should track marketplace items", async () => {

            // user1 makes a marketplace item
            let makeItem = await market.createItem(nft.address, 1, price, {from: user1})
            console.log("makeItem: ", makeItem)

            // Owner of NFT should now be marketplace
            owner = await nft.ownerOf(1)
            console.log("owner: ", owner)
            expect(owner).to.equal(await market.getaddress())

            // Marketplace item count should be 1
            await market.itemCount().then(function(itemCount) { itemCountInstance = itemCount})
            console.log("itemCount: ", itemCountInstance.words[0])
            expect(itemCountInstance.words[0]).to.equal(1)

            // Get item from items mapping then check fields to ensure they are correct
            const item = await market._items(1)
            console.log("item: ", item)
            // expect(item.itemId).to.equal(1)
            // expect(item.nft).to.equal(nft.address)
            // expect(item.tokenId).to.equal(1)
            // expect(item.price).to.equal(price)
            // expect(item.sold).to.equal(false)
        })
        
    });
    // describe("", () => {
        
    // });
    // describe("", () => {
        
    // });

});