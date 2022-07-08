/* eslint-disable no-undef */
// Migrations for Externally Owned Account System for SIT
// Identity contract and Key Manager contract

const Identity = artifacts.require("Identity");
const KeyManager = artifacts.require("KeyManager");
const { dev1 } = require("../scripts/walletAddress");

module.exports = (deployer) => {
    // Deploy Identity contract
    deployer.deploy(Identity, dev1, {from: dev1}).then( identity => {
        // Deploy Market after getting sitcoin address
        return deployer.deploy(KeyManager, identity.address);
    });
};