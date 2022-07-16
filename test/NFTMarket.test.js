const SITcoin = artifacts.require("SITcoin");
const NFTMarket = artifacts.require("NFTMarket");
const { dev1, dev1hex, dev2, dev2hex, dev3 } = require("../scripts/walletAddress");
const { expect } = require("../node_modules/chai/chai");
const assertTruffle = require("../node_modules/truffle-assertions");

contract("NFTMarket", () => {
    var market;
    var sitc;
    var user1 = dev1;
    var user1hex = dev1hex;
    var user2 = dev2;
    var user2hex = dev2hex;
    var user3 = dev3;
    var URI = "SampleLink";

    beforeEach(async () => {
        sitc = await SITcoin.deployed()
        market = await NFTMarket.deployed()
    })
    describe("Contract Deployment", () => {

        it("Should track name and symbol of nft collections", async () => {
            expect(await market.getName()).to.equal("SITC NFT")
            expect(await market.getSymbol()).to.equal("SITC")
        })
        it("Should track name and symbol of sitc", async () => {
            expect(await sitc.name()).to.equal("SIT Coin")
            expect(await sitc.symbol()).to.equal("SITC")
        })
    });
    describe("Minting NFTs", () => {

        it("Should track each minted NFT", async () => {
            //user1 mint an NFT
            await market.mint("Rubber Ducky", URI, 10, market.address, {from: user1})
            // total number of tokens in NFT contract
            await market.getTotalNFTCount().then(function(count) { countInstance = count})
            // Mapping owner address to token count in ERC721 contract
            await market.balanceOf(user1).then(function(balance) { balanceInstance = balance})
        
            // Get the Mapping of token id to token URI in ERC721URIStorage contract     
            let uri = await market.tokenURI(1)
          

            expect(countInstance.words[0]).to.equal(1)
            expect(balanceInstance.words[0]).to.equal(1)    
            expect(uri).to.equal(URI)
        
            //user2 mint an NFT
            await market.mint("Electro Boy", URI, 10, market.address, {from: user2})
            //user3 mint an NFT
            await market.mint("Bro Code", URI, 10, market.address, {from: user3})
            //user1 mint an NFT
            await market.mint("Maplestory 2070", URI, 10, market.address,{from: user1})

            await market.getTotalNFTCount().then(function(count) { countInstance = count})
          
            await market.balanceOf(user2).then(function(balance) { balanceInstance = balance})
          
            uri = await market.tokenURI(2)
        
            expect(countInstance.words[0]).to.equal(4)
            expect(balanceInstance.words[0]).to.equal(1)    
            expect(uri).to.equal(URI)
        })
        it("Should update balance of NFT for each user", async () => {
            await market.myOwnedNFTs({from: user1}).then(function(myNFT) { myNFTInstance1 = myNFT})
            await market.myOwnedNFTs({from: user2}).then(function(myNFT) { myNFTInstance2 = myNFT})
            await market.myOwnedNFTs({from: user3}).then(function(myNFT) { myNFTInstance3 = myNFT})

            expect(myNFTInstance1.count.words[0]).to.equal(2)
            expect(myNFTInstance2.count.words[0]).to.equal(1)
            expect(myNFTInstance3.count.words[0]).to.equal(1)
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

        it("Should approve marketplace to spend nft", async () => {
            // in IERC721: setApprovalForAll(address operator, bool _approved);
            // user1 approves marketplace to spend nft (is like increase allowance for ERC20)
            await market.setApprovalForAll(market.address, true, {from: user1})

            let checkapproved = await market.isApprovedForAll(user1, market.address)
            expect(checkapproved).to.equal(true)
        })

        it("Should track marketplace items", async () => {

            // user1 makes a marketplace item
            await market.createItem(1, {from: user1})

            // Owner of NFT should now be marketplace
            owner = await market.ownerOf(1)
            checkIfOwner = await market.isOwnerOf(1, market.address)

            expect(owner).to.equal(await market.getaddress())
            expect(checkIfOwner).to.equal(true)


            // Marketplace item count should be 1
            await market.getTotalMarketItems().then(function(itemCount) { itemCountInstance = itemCount})

            expect(itemCountInstance.words[0]).to.equal(1)

            // Get item from items mapping then check fields to ensure they are correct
            await market.mintedNFTs(1).then(function(item) { itemInstance = item})

            expect(itemInstance.tokenId.words[0]).to.equal(1)
            expect(itemInstance.description).to.equal("Rubber Ducky")
            expect(itemInstance.price.words[0]).to.equal(10)
            expect(itemInstance.seller).to.equal(user1hex)
            expect(itemInstance.sold).to.equal(false)
            expect(itemInstance.published).to.equal(true)
        })   
    });
    describe("Purchasing marketplace items", () => {

        // -------------- Test the ability to transfer allowance -----------------
        it("Should increase allowance from buyer to NFTMarket contract", async () => {
            await sitc.increaseAllowance(market.address, 30, {from:user2})
            // console.log("increaseAllowance", increaseAllowance)
            await sitc.allowance(user2, market.address).then(function(allowance) { allowanceInstance = allowance})
            // console.log("allowance", allowanceInstance)
            expect(allowanceInstance.words[0]).to.equal(30)

        })
        it("Should update item as sold, pay seller, transfer NFT to buyer, emit NFTPurchased event", async () => {

            // user2 purchase item
            await market.purchaseItem(1, {from: user2})


            await sitc.balanceOf(user1).then(function(usr1Balance) { usr1BalanceInstance = usr1Balance})
            await sitc.balanceOf(user2).then(function(usr2Balance) { usr2BalanceInstance = usr2Balance})

            expect(usr1BalanceInstance.words[0]).to.equal(1610)
            expect(usr2BalanceInstance.words[0]).to.equal(1590)

            // user2 should now own the nft
            let isOwner = await market.isOwnerOf(1, user2)

            expect(isOwner).to.equal(true)

        })
        it("Should show that NFT balance of user2 is updated" , async () => {
            // Mapping owner address to token count in ERC721 contract
            await market.balanceOf(user2).then(function(balance) { balanceInstance = balance})
            await market.myOwnedNFTs({from: user2}).then(function(myNFTs) { myNFTsInstance = myNFTs})

            expect(myNFTsInstance.count.words[0]).to.equal(2)
            expect(balanceInstance.words[0]).to.equal(2) 

            // Mapping owner address to token count in ERC721 contract
            await market.balanceOf(user1).then(function(balance) { balanceInstance = balance})
            await market.myOwnedNFTs({from: user1}).then(function(myNFTs) { myNFTsInstance = myNFTs})

            expect(myNFTsInstance.count.words[0]).to.equal(1)
            expect(balanceInstance.words[0]).to.equal(1) 
        })
        it("Should not allow purchase of sold items", async () => {
            await assertTruffle.reverts(market.purchaseItem(1, {from:user3}))
        })
        it("Should not allow purchase of non-existence items", async () => {
            await assertTruffle.reverts(market.purchaseItem(4, {from:user3}))
        })
    });
    describe("List sold or existing items", () => {
        it("Should not publish sold items", async () => {
            await assertTruffle.reverts(market.createItem(1,{from: user1}))
            await assertTruffle.reverts(market.createItem(1,{from: user2}))
        })
        it("Should not publish item if not owner", async () => {
            await assertTruffle.reverts(market.createItem(2,{from: user1}))
        })
        it("Should not publish item if item does not exist", async () => {
            await assertTruffle.reverts(market.createItem(3, {from: user2}))
        })
    });
    describe("Get unsold items on the market", () => {

        it("Should approve marketplace to spend nft", async () => {
            // in IERC721: setApprovalForAll(address operator, bool _approved);
            // user1 approves marketplace to spend nft (is like increase allowance for ERC20)
            await market.setApprovalForAll(market.address, true, {from: user2})

            await market.setApprovalForAll(market.address, true, {from: user2})

            checkapproved = await market.isApprovedForAll(user2, market.address)
            expect(checkapproved).to.equal(true)
        })
        it("Should track marketplace items", async () => {

            // user1 makes a marketplace item
            let makeItem = await market.createItem(2, {from: user2})

            // Owner of NFT should now be marketplace
            checkIfOwner = await market.isOwnerOf(2, market.address)
            expect(checkIfOwner).to.equal(true)


            // Marketplace item count should be 2
            await market.getTotalMarketItems().then(function(itemCount) { itemCountInstance = itemCount})

            expect(itemCountInstance.words[0]).to.equal(2)

            // Get item from items mapping then check fields to ensure they are correct
            await market.mintedNFTs(2).then(function(item) { itemInstance = item})

            expect(itemInstance.tokenId.words[0]).to.equal(2)
            expect(itemInstance.description).to.equal("Electro Boy")
            expect(itemInstance.price.words[0]).to.equal(10)
            expect(itemInstance.seller).to.equal(user2hex)
            expect(itemInstance.sold).to.equal(false)
            expect(itemInstance.published).to.equal(true)
        })   

        it("Should list only unsold items", async () => {
            await market.getUnsoldItems().then(function(unsoldItems) { unsoldItemsInstance = unsoldItems})
            expect(unsoldItemsInstance.count.words[0]).to.equal(1)
        })
    });
    describe("Unlist items", () => {
        it("Should fail to unlist non-existence items", async () => {
            // Item does not exist
            await assertTruffle.reverts(market.unlistItem(5, {from: user1}))
        })
        it("Should fail to unlist sold items", async () => {
            // Item is sold
            await assertTruffle.reverts(market.unlistItem(1, {from: user1}))
        })
        it("Should fail to unlist items if not owner", async () => {
            // Item is not owner
            await assertTruffle.reverts(market.unlistItem(2, {from: user1}))
        })
        it("Should unlist items", async () => {
            // Item is owner and not sold
            await market.unlistItem(2, {from: user2})

            let marketItems = await market.getAllMarketItems()
            console.log("marketItems: ", marketItems)

            // Marketplace item count should be 1
            await market.getTotalMarketItems().then(function(itemCount) { itemCountInstance = itemCount})

            expect(itemCountInstance.words[0]).to.equal(1)
        })
        it("Show that NFT still exist in user balance even though unlisted on Market", async () => {
            // Mapping owner address to token count in ERC721 contract
            await market.balanceOf(user2).then(function(balance) { balanceInstance = balance})
            await market.myOwnedNFTs({from: user2}).then(function(myNFTs) { myNFTsInstance = myNFTs})
            expect(myNFTsInstance.count.words[0]).to.equal(2)
            expect(balanceInstance.words[0]).to.equal(2) 
        })
    });

});