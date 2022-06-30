// SPDX-License-Identifier: MIT

const SITcoin = artifacts.require("SITcoin");
// Change as needed
const sitcOwner = "lat17vxqyp28xtlhuvrgjz9436zg98hcshtcpg6wda";

module.exports = function(deployer) {
    // Deploy with starting of 100,000 tokens
    deployer.deploy(SITcoin, 100000, {from: sitcOwner});
};