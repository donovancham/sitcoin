const SITcoin = artifacts.require("SITcoin");
const NFTMarket = artifacts.require("NFTMarket");
const { dev1, dev1hex, dev2, dev2hex, dev3 } = require("../scripts/walletAddress");

module.exports = async function(callback) {
    try{

        var market;
        var sitc;
        var user1 = dev1;
        var user1hex = dev1hex;
        var user2 = dev2;
        var user2hex = dev2hex;
        var user3 = dev3;
        var URI = "SampleLink";

        sitc = await SITcoin.deployed()
        market = await NFTMarket.deployed()

        /**
         * Use Case: Mint NFTS and List them on the market
        */
       //----------------------- Transfer tokens to user --------------------------------
        await sitc.transfer(user1, 1600)
        await sitc.transfer(user2, 1600)
        await sitc.transfer(user3, 1600)
        console.log("user1 balance: ", await sitc.balanceOf(user1)) //1600
        console.log("user2 balance: ", await sitc.balanceOf(user2)) //1600
        console.log("user3 balance: ", await sitc.balanceOf(user3)) //1600

        //----------------------- Mint NFT ---------------------------------------------
        await market.mint("Rubber Ducky", URI, 10, market.address, {from: user1})
        await market.mint("Electro Boy", URI, 10, market.address, {from: user2})
        await market.mint("Bro Code", URI, 10, market.address, {from: user3})
        await market.mint("Maplestory 2070", URI, 10, market.address, {from: user1})

        //----------------------- Check NFT balance of each user --------------------------------
        await market.balanceOf(user1).then(function(balance) { u1BalIns = balance})
        await market.balanceOf(user2).then(function(balance) { u2BalIns = balance})
        await market.balanceOf(user3).then(function(balance) { u3BalIns = balance})
        console.log("u1BalIns: ", u1BalIns.words[0]) //2
        console.log("u2BalIns: ", u2BalIns.words[0]) //1
        console.log("u3BalIns: ", u3BalIns.words[0]) //1

        //----------------------- Check NFT details --------------------------------
        await market.mintedNFTs(1).then(function(nft) { nftIns = nft})
        console.log("tokenId: ", nftIns.tokenId.words[0]) //1
        console.log("description: ", nftIns.description) //Rubber Ducky
        console.log("price: ", nftIns.price.words[0]) //10
        console.log("author addr: ", nftIns.author) //0x...
        console.log("seller addr: ", nftIns.seller) //0x0
        console.log("owner addr: ", nftIns.owner) //0x...
        console.log("sold: ", nftIns.sold) //false
        console.log("published: ", nftIns.published) //false
        console.log("uri: ", nftIns.uri) //SampleLink        

        await market.mintedNFTs(2).then(function(nft) { nftIns = nft})
        console.log("tokenId: ", nftIns.tokenId.words[0]) //1
        console.log("description: ", nftIns.description) // Electro Boy
        console.log("price: ", nftIns.price.words[0]) //10
        console.log("author addr: ", nftIns.author) //0x...
        console.log("seller addr: ", nftIns.seller) //0x0
        console.log("owner addr: ", nftIns.owner) //0x0
        console.log("sold: ", nftIns.sold) //false
        console.log("published: ", nftIns.published) //false
        console.log("uri: ", nftIns.uri) //SampleLink

        await market.mintedNFTs(3).then(function(nft) { nftIns = nft})
        console.log("tokenId: ", nftIns.tokenId.words[0]) //1
        console.log("description: ", nftIns.description) //  Bro Code
        console.log("price: ", nftIns.price.words[0]) // 10
        console.log("author addr: ", nftIns.author) //0x...
        console.log("seller addr: ", nftIns.seller) //0x0
        console.log("owner addr: ", nftIns.owner) //0x0
        console.log("sold: ", nftIns.sold) //false
        console.log("published: ", nftIns.published) //false
        console.log("uri: ", nftIns.uri) //SampleLink

        await market.mintedNFTs(4).then(function(nft) { nftIns = nft})
        console.log("tokenId: ", nftIns.tokenId.words[0]) //1
        console.log("description: ", nftIns.description) //  Maplestory 2070
        console.log("price: ", nftIns.price.words[0]) //10
        console.log("author addr: ", nftIns.author) //0x...
        console.log("seller addr: ", nftIns.seller) //0x0
        console.log("owner addr: ", nftIns.owner) //0x0
        console.log("sold: ", nftIns.sold) //false
        console.log("published: ", nftIns.published) //false
        console.log("uri: ", nftIns.uri) //SampleLink

        // ------------------------ Approve market place to sell NFT --------------------------------
        await market.setApprovalForAll(market.address, true, {from: user1})
        await market.setApprovalForAll(market.address, true, {from: user2})
        await market.setApprovalForAll(market.address, true, {from: user3})
        console.log("user1 approved: ", await market.isApprovedForAll(user1, market.address)) //true
        console.log("user2 approved: ", await market.isApprovedForAll(user2, market.address)) //true
        console.log("user3 approved: ", await market.isApprovedForAll(user3, market.address)) //true

        // ------------------------ List NFT up for sale on market --------------------------------
        await market.createItem(1, {from: user1})
        await market.createItem(2, {from: user2})
        await market.createItem(3, {from: user3})
        
        // ------------------------ Owner of listed NFT belongs to Market --------------------------
        console.log("Market owner of 1: ", await market.isOwnerOf(1, market.address)) //true
        console.log("Market owner of 2: ",await market.isOwnerOf(2, market.address))
        console.log("Market owner of 3: ",await market.isOwnerOf(3, market.address))

        // ------------------------ Check Market Item details --------------------------------
        await market.mintedNFTs(1).then(function(item) { itemins = item})
        console.log("token ID: ", itemins.tokenId.words[0]) //1
        console.log("item description: ", itemins.description) //Rubber Ducky
        console.log("item price: ", itemins.price.words[0]) //10
        console.log("item seller: ", itemins.seller) //user1
        console.log("item sold: ", itemins.sold) //false

        await market.mintedNFTs(2).then(function(item) { itemins = item})
        console.log("token ID: ", itemins.tokenId.words[0]) //1
        console.log("item description: ", itemins.description) // Electro Boy
        console.log("item price: ", itemins.price.words[0]) //10
        console.log("item seller: ", itemins.seller) //user2
        console.log("item sold: ", itemins.sold) //false

        await market.mintedNFTs(3).then(function(item) { itemins = item})
        console.log("token ID: ", itemins.tokenId.words[0]) //1
        console.log("item description: ", itemins.description) //  Bro Code
        console.log("item price: ", itemins.price.words[0]) //10
        console.log("item seller: ", itemins.seller) //user3
        console.log("item sold: ", itemins.sold) //false

        // ------------------------ Increase allowance from User2 to Market ------------------------
        await sitc.increaseAllowance(market.address, 30, {from: user2})
        await sitc.allowance(user2, market.address).then(function(allowance){allowanceins = allowance})
        console.log("allowance: ", allowanceins.words[0]) //30

        // ------------------------ Buy NFT from Market --------------------------------
        await market.purchaseItem(1, {from: user2})
        
        // ------------------------ Check NFT Balance --------------------------------
        await market.balanceOf(user1).then(function(balance) { u1BalIns = balance})
        await market.balanceOf(user2).then(function(balance) { u2BalIns = balance})
        await market.balanceOf(user3).then(function(balance) { u3BalIns = balance})
        console.log("u1BalIns: ", u1BalIns.words[0]) //1 not in market, 1 sold to user2
        console.log("u2BalIns: ", u2BalIns.words[0]) //1, 1 in market
        console.log("u3BalIns: ", u3BalIns.words[0]) //0, 1 in market

        // ------------------------ Check SITC balance of user 1 and user 2 ------------------------
        await sitc.balanceOf(user1).then(function(balance) { u1BalIns = balance})
        await sitc.balanceOf(user2).then(function(balance) { u2BalIns = balance})
        await sitc.balanceOf(user3).then(function(balance) { u3BalIns = balance})
        console.log("u1BalIns: ", u1BalIns.words[0]) //1610
        console.log("u2BalIns: ", u2BalIns.words[0]) //1590
        console.log("u3BalIns: ", u3BalIns.words[0]) //1600

        // ------------------------ Show unsold items --------------------------------
        await market.getUnsoldItems().then(function(items) { unsoldIns = items})
        console.log("unsoldIns: ", unsoldIns.count.words[0]) //2

        // ------------------------ Show all market items --------------------------------
        let allItems = await market.getAllMarketItems()
        console.log("allItems: ", allItems) //3, including sold

        // ------------------------ User unlist NFT from market ------------------------
        await market.unlistItem(2, {from: user2}) //success

        // ------------------------ Show unsold items --------------------------------
        await market.getUnsoldItems().then(function(items) { unsoldIns = items})
        console.log("unsoldIns: ", unsoldIns.count.words[0]) //1

        // ------------------------ Show all market items --------------------------------
        allItems = await market.getAllMarketItems()
        console.log("allItems: ", allItems) //2, including sold

        // ------------------------ check currently owned NFT of all users --------------------------------
        await market.myOwnedNFTs({from: user1}).then(function(myNFTs) { u1NFTIns = myNFTs})
        await market.myOwnedNFTs({from: user2}).then(function(myNFTs) { u2NFTIns = myNFTs})
        await market.myOwnedNFTs({from: user3}).then(function(myNFTs) { u3NFTIns = myNFTs})
        console.log("u1NFTIns: ", u1NFTIns) //1 - Maplestory
        console.log("u2NFTIns: ", u2NFTIns) //2 - Duck and electro boy (unlisted, Ownership transferred back)
        console.log("u3NFTIns: ", u3NFTIns) //0 - In Market

        // ------------------------ Get NFT created by each user (author) ---------------------------------
        await market.getMyNFTCreations({from: user1}).then(function(myNFTs) { u1NFTIns = myNFTs})
        await market.getMyNFTCreations({from: user2}).then(function(myNFTs) { u2NFTIns = myNFTs})
        await market.getMyNFTCreations({from: user3}).then(function(myNFTs) { u3NFTIns = myNFTs})
        console.log("u1NFTIns: ", u1NFTIns) //2 - Maplestory, Duck
        console.log("u2NFTIns: ", u2NFTIns) //1 - Electro Boy
        console.log("u3NFTIns: ", u3NFTIns) //1 - Bro Code

        callback();
    }
    catch(err){
        console.log(err)
    }
}

