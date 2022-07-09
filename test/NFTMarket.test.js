const SITcoin = artifacts.require("SITcoin");
const NFTMarket = artifacts.require("NFTMarket");
const NFT = artifacts.require("NFT");
const { dev1, dev1hex, dev2, dev2hex } = require("../scripts/constants");
const { expect } = require("../node_modules/chai/chai");
const truffleAssert = require('../node_modules/truffle-assertions');

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
    describe("Transferring tokens to users", () => {
        // -------------- Test transfer of initial tokens to accounts -----------------
        it("should transfer tokens correctly", async () => {
            await sitc.transfer(user1, 1600)
            await sitc.transfer(user2, 1600)
            assert.equal(await sitc.balanceOf(user1), 1600, 'user1 does not have 1600 SITC')
            assert.equal(await sitc.balanceOf(user2), 1600, 'user2 does not have 1600 SITC')
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

        // it("Should fail if price is zero", async () => {
        //     await truffleAssert.reverts(market.createItem(nft.address, 1, 0, {from: user1}),
        //     "Price must be greater than 0");
        // })

        it("Should track marketplace items", async () => {

            // user1 makes a marketplace item
            let makeItem = await market.createItem(nft.address, 1, price, {from: user1})
            console.log("makeItem: ", makeItem)

            // Owner of NFT should now be marketplace
            owner = await nft.ownerOf(1)
            checkIfOwner = await nft.isOwnerOf(1, market.address)
            console.log("owner: ", owner)
            console.log("checkIfOwner: ", checkIfOwner)
            expect(owner).to.equal(await market.getaddress())
            expect(checkIfOwner).to.equal(true)

            // Marketplace item count should be 1
            await market.itemCount().then(function(itemCount) { itemCountInstance = itemCount})
            console.log("itemCount: ", itemCountInstance.words[0])
            expect(itemCountInstance.words[0]).to.equal(1)

            // Get item from items mapping then check fields to ensure they are correct
            await market._items(1).then(function(item) { itemInstance = item})
            console.log("item_NFTInstance: ", itemInstance.nft)
            expect(itemInstance.itemId.words[0]).to.equal(1)
            //expect(itemInstance.nft).to.equal(nft.address)
            expect(itemInstance.tokenId.words[0]).to.equal(1)
            expect(itemInstance.seller).to.equal(user1hex)
            expect(itemInstance.price.words[0]).to.equal(price)
            expect(itemInstance.sold).to.equal(false)
        })   
    });
    describe("Purchasing marketplace items", () => {
            // -------------- Test the ability to transfer allowance -----------------
        it("Should increase allowance from buyer to NFTMarket contract", async () => {
            let increaseAllowance = await sitc.increaseAllowance(market.address, 10, {from:user2})
            console.log("increaseAllowance", increaseAllowance)
            let allowance = await sitc.allowance(user2, market.address)
            console.log("allowance", allowance)
            //assert.equal(allowance, 800, "wrong allowance")
        })
        // it("Should fail for invalid item ids", async () => {
        //     let failedPurchase = await market.purchaseItem(3, {from: user2})
        //     console.log("failedPurchase", failedPurchase)
        // })
        it("Should update item as sold, pay seller, transfer NFT to buyer, emit NFTPurchased event", async () => {
            // Check user1 and user2 balances before purchase
            await sitc.balanceOf(user1).then(function(usr1Balance) { usr1BalanceInstance = usr1Balance})
            await sitc.balanceOf(user2).then(function(usr2Balance) { usr2BalanceInstance = usr2Balance})
            console.log("User1 Bal: ", usr1BalanceInstance.words[0])
            console.log("User2 Bal: ", usr2BalanceInstance.words[0])
            expect(usr1BalanceInstance.words[0]).to.equal(1600)
            expect(usr2BalanceInstance.words[0]).to.equal(1600)

            // user2 purchase item
            let purchase = await market.purchaseItem(1, {from: user2})
            console.log("purchase: ", purchase)

            await sitc.balanceOf(user1).then(function(usr1Balance) { usr1BalanceInstance = usr1Balance})
            await sitc.balanceOf(user2).then(function(usr2Balance) { usr2BalanceInstance = usr2Balance})
            console.log("User1 Bal: ", usr1BalanceInstance.words[0])
            console.log("User2 Bal: ", usr2BalanceInstance.words[0])
            expect(usr1BalanceInstance.words[0]).to.equal(1610)
            expect(usr2BalanceInstance.words[0]).to.equal(1590)

            // user2 should now own the nft
            console.log("owner of nft 1: ", await nft.ownerOf(1))
        })
        // it("Should fail for sold item ids", async () => {
        //     failedPurchase = await market.purchaseItem(1, {from: user2})
        //     console.log("failedPurchase", failedPurchase)
        // })
        it("Should show that NFT balance of user2 is updated" , async () => {
            // Mapping owner address to token count in ERC721 contract
            await nft.balanceOf(user2).then(function(balance) { balanceInstance = balance})
            console.log("balance: ", balanceInstance.words[0])

            expect(balanceInstance.words[0]).to.equal(2) 
        })
    });
    // describe("", () => {
        
    // });

});