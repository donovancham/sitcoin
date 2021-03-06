// Migrations for SITcoin contract and Market contract

const SITcoin = artifacts.require("SITcoin");
const { owner } = require("../scripts/walletAddress");
const Market = artifacts.require("Market");
const NFTMarket = artifacts.require("NFTMarket");

module.exports = (deployer) => {
    // Deploy with starting of 10mil tokens
    deployer.deploy(SITcoin, 10000000, {from: owner}).then( async () => {
        const sitcoin = await SITcoin.deployed();
        await deployer.deploy(Market, sitcoin.address);
        await deployer.deploy(NFTMarket, sitcoin.address);
    });
        
};