// SPDX-License-Identifier: MIT

const SITcoin = artifacts.require("SITcoin");
const { owner } = require("../scripts/wallet_accounts");

module.exports = (deployer) => {
    // Deploy with starting of 100,000 tokens
    deployer.deploy(SITcoin, 100000, {from: owner});
};