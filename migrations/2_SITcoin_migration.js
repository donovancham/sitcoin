// Migrations for SITcoin contract and Market contract

const SITcoin = artifacts.require("SITcoin");
const { owner } = require("../scripts/constants");
const Market = artifacts.require("Market");

module.exports = (deployer) => {
    // Deploy with starting of 100,000 tokens
    deployer.deploy(SITcoin, 100000, {from: owner}).then( sitcoin => {
        // Deploy Market after getting sitcoin address
        return deployer.deploy(Market, sitcoin.address);
    });
};