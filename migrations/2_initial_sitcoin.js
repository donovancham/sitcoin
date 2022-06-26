var sitcoin = artifacts.require("SITcoin");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(sitcoin);
};
