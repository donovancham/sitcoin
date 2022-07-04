// SPDX-License-Identifier: MIT

const SITcoin = artifacts.require("SITcoin");
const { system } = require("../scripts/wallet_accounts");
const Market = artifacts.require("Market");

module.exports = (deployer) => {
    // Deploy with starting of 100,000 tokens
    deployer.deploy(SITcoin, 100000, {from: system}).then( () => {
        return deployer.deploy(Market, SITcoin.address);
    });
};
//     deployer.deploy(SITcoin, 100000, {from: sitcOwner});
//     deployer.deploy(Market, SITcoin.address); // Pass in the address of the SITcoin contract
// }
