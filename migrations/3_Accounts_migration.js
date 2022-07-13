/* eslint-disable no-undef */
// Migrations for Account System for SIT

const AccountManager = artifacts.require("AccountManager");
const { owner, dev1 } = require("../scripts/walletAddress");
const { create } = require('ipfs-http-client');
const Web3 = require('web3');

const devnetHTTP = "https://devnetopenapi2.platon.network/rpc";

module.exports = (deployer) => {
    const web3 = Web3(devnetHTTP)
    // Ensure that `ipfs daemon` is running to deploy properly
    const ipfs = await create("http://localhost:5001")

    // Deploy Account Manager Contracts
    // deployer.deploy(AccountManager, { from: owner });
};