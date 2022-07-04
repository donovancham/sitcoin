// SPDX-License-Identifier: MIT

const SITcoin = artifacts.require("SITcoin");
const Market = artifacts.require("Market");
// Change as needed
const sitcOwner = "lat14nmuyvupslhjr8twv42e2ghn3sq6fhpxklu8sz";

module.exports = function(deployer) {
    // Deploy with starting of 100,000 tokens
    deployer.deploy(SITcoin, 100000, {from: sitcOwner});
    deployer.deploy(Market, SITcoin.address); // Pass in the address of the SITcoin contract
}