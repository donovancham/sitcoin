module.exports = function(callback) {
  // perform actions
  // Import account, "<private key>", "<password>"
  web3.personal.importRawKey("", "")
  // Unlock account, "<Wallet Address>", "<password>"
  web3.personal.unlockAccount("", "", 999999999)
}


