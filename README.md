# SIT Coin
The purpose of this project is to create a meticulously designed and defined university cryptocurrency that can be used as a medium for trades and reward in the digital campus. For all intents and purposes, the cryptocurrency should be implemented without compromising the security of the digital campus in the digital world. 

In SIT’s push towards a digital campus, the metaverse that it creates will inherently have a digital economy where a university cryptocurrency (`$SITC`) will be the fundamental basic currency within this ecosystem. And it is of equally, if not more, vital importance that cryptocurrency is designed and defined properly. The aim is to utilize the virtual campus and `$SITC` to build a cohesive environment for SIT, both virtually and physically.

## Installation (Linux)
1. Install [Node.js](https://nodejs.org/en/download/)
```sh
# TODO
```

1. Install [PlatON Truffle Suite](https://platon-truffle.readthedocs.io/en/v1.1.1/getting-started/installation.html)
```sh
# Truffle Install
npm install -g platon-truffle
npm audit fix --force
sudo ln -s /usr/local/node-v18.2.0-linux-x64/bin/* /usr/bin/
platon-truffle version
```

3. Install other dependencies
```sh
# Install Dependencies
sudo apt update
sudo apt install -y golang-go cmake llvm g++ libgmp-dev libssl-dev

# Check your go version >= 1.6
go version

# ADDITIONAL STEP TO INSTALL LATEST VERSION OF GO
sudo apt-get remove golang-go
wget https://go.dev/dl/go1.18.3.linux-amd64.tar.gz
sudo tar -xvf go1.18.3.linux-amd64.tar.gz -C /usr/local

# Edit the PATH
nano ~/.profile

# <<<<< Add this at the end of the file
export GOPATH=$HOME/go
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin
# End of nano edit >>>>>

# Refresh PATH and check go version
source ~/.profile
go version
```

4. Install [PlatON](https://devdocs.platon.network/docs/en/Install_PlatON)
```sh
# Install Platon Network
git clone -b master https://github.com/PlatONnetwork/PlatON-Go.git --recursive
cd PlatON-Go
go mod download github.com/Azure/azure-pipeline-go
go get github.com/PlatONnetwork/PlatON-Go/internal/build
go get github.com/PlatONnetwork/PlatON-Go/p2p/discover
go get github.com/PlatONnetwork/PlatON-Go/cmd/platon
go get github.com/PlatONnetwork/PlatON-Go/p2p/simulations
go get github.com/PlatONnetwork/PlatON-Go/cmd/ctool/core
make all
sudo cp -f ./build/bin/platon /usr/bin/
sudo cp -f ./build/bin/platonkey /usr/bin/
ls /usr/bin | grep platon
```

## DevNet Setup (Linux)
1. Connect Wallet to DevNet

Form Header | Form Data
-----------|----------
**Network Name:** | PlatON Devnet2
**New RPC URL:** | https://devnetopenapi2.platon.network/rpc
**Chain ID:** | 2203181
**Currency Symbol:** | LAT
**Block Explorer URL:** | https://devnetscan.platon.network/

2. Connect to DevNet
```sh
platon attach https://devnetopenapi2.platon.network/rpc
```

3. Import private keys into DevNet
```sh
# Import account
web3.personal.importRawKey("<private key>", "<password>")
# Unlock account
web3.personal.unlockAccount("<Wallet Address>", "<password>", 999999999)
```

## Running Project
1. Clone repo
```sh
git clone https://github.com/donovancham/sitcoin.git
```

2. Install dependencies
```sh
npm install --save-dev <pkgname>
```

3. Add `truffle-config.js`. Copy exactly
```js
module.exports = {
    /**
     * Networks define how you connect to your platon client and let you set the
     * defaults web3 uses to send transactions. If you don't specify one truffle
     * will spin up a development blockchain for you on port 9545 when you
     * run `develop` or `test`. You can ask a truffle command to use a specific
     * network from the command line, e.g
     *
     * $ truffle test --network <network-name>
     */
  
    networks: {
      // Useful for testing. The `development` name is special - platon-truffle uses it by default
      // if it's defined here and no other network is specified at the command line.
      // You should run a client in a separate terminal
      // tab if you use this network and you must also set the `host`, `port` and `network_id`
      // options below to some value.
      //
      development: {
          host: "34.85.65.222",     // Localhost (default: none)
          port: 6789,            // Standard Ethereum port (default: none)
          network_id: "*",       // Any network (default: none)
      },
  
      // Another network with more advanced options...
      // advanced: {
        // port: 8777,             // Custom port
        // network_id: 1342,       // Custom network
        // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
        // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
        // from: <address>,        // Account to send txs from (default: accounts[0])
        // websockets: true        // Enable EventEmitter interface for web3 (default: false)
      // },
  
      // Useful for private networks
      // private: {
        // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
        // network_id: 2111,   // This network is yours, in the cloud.
        // production: true    // Treats this network as if it was a public net. (default: false)
      // }
    },
  
    // Set default mocha options here, use special reporters etc.
    mocha: {
      // timeout: 100000
    },
  
    // Configure your compilers
    compilers: {
      solc: {
        version: "0.8.6",    // Fetch exact version from solc-bin (default: 0.6.12)
        // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
        settings: {          // See the solidity docs for advice about optimization and evmVersion
          optimizer: {
            enabled: true,
            runs: 200
          },
        //  evmVersion: "byzantium"
        }
      }
      // wasm: {
      //   version: "v0.13.0"
      // }
    }
  }
```

4. Compile and deploy contracts to DevNet
```sh
platon-truffle compile
platon-truffle migrate
```

5. Run Tests
```sh
platon-truffle test
platon-truffle test --show-events
```

## Running Scripts
```sh
platon-truffle exec scripts/transferToken.js
```

## Changelog
- v1.6.9
  - web3 App
    - Added interface for connecting with Samurai wallet
    - Added button to connect to Samurai wallet
    - Added alerts for UI
  - Edit tests
    - Fix imports due to changing filename
- v1.6.8
  - Edited migration file
    - Migration for `NFT.sol`
    - Migration for `NFTMarket.sol`
  - Added tests for `NFTMarket` and `NFT`
- v1.6.7
  - Added NFT contract `NFT.sol`
    - Inherits the `ERC721URIStorage.sol` to link URI to `tokenId`
    - Allow users to mint NFT before listing them in the NFT Market
  - Edited `NFTMarket.sol`
    - `NFTListed` event and `NFTPurchased` event
    - Implemented `transferFrom()` in `purchaseItem()` for both tokens and NFT transfer
- v1.6.6
  - Added NFT market place `NFTMarket.sol`
    - Added `createItem()`, `purchaseItem()` and `getTotalPrice()`
    - Not working yet, work in progress
  - Minor update to `README.md` for run tests command
- v1.6.5
  - web3 App
    - Implemented using **Next.js**
    - UI done using **React-bootstrap**
    - Blockchain interaction done using **web3.js**
    - Current implementation unable to progress 
  - Update `constants.js`
    - Changed name from `wallet_accounts.js`
    - Future uses will be providing contract addresses for dApp
  - Update `README.md`
    - Added installation instructions for quick deployment
- v1.6.4
  - Added `ItemUnlisted` and `ItemPurchased` events
    - Events used in `purchaseItem()` and `unlistItem()`
  - Added more tests cases and use cases
    - Test and use cases working as intended
  - Changed wallet addresses in `market_usecases.js` to use shared wallet account for dev
- v1.6.3
  - Updated `wallet_accounts.js`
    - Added shared accounts for smoother dev
  - Updated `Market.test.js`
    - Added smoother testing variables
  - Updated `SITcoin.test.js`
    - Added test for `transferFrom()` scenario
    - Added test for `approve()` and `allowance()`
- v1.6.2
  - Updated `Market.sol`
    - `purchaseItem()` to call `transferFrom()` instead of `transfer()`
  - Updated `Market_test.js`
    - Implemented `sitcoin.increaseAllowance(address, value, {from: sender})` before `purchaseItem()`
      - Address: Market Contract address, using `marketInstance.address`
      - Value: Price of item
    - Added tests for unlisting of items (`unlistItem()`) and checking unsold items (`getUnsoldItems()`)
    - Balance are being updated correctly after the changes above
- v1.6.1
  - Update `wallet_accounts.js`
    - Added `HEX` addresses for accounts
  - Update `SITcoin.test.js`
    - Added variables for wallet balances to reduce interference from other test deployments
    - Add `beforeEach` function to redeploy after each test
- v1.6
  - Removed `PRC20.sol`
  - Reimplemented `SITcoin.sol`
    - Added documentations for all functions
    - Removed `PRC20.sol` inheritance
    - Added `decimals()` function override to desired decimal place of 0
  - Updated `SITcoin.test.js`
    - Updated function calls to explicitly call from owner
    - Updated some descriptions
    - Added event-based assertions with `truffleAssert.eventEmitted`s
  
- v1.5.3
  - Edited `Market.sol`
    - Updated the code to include code reuse for certain functions
    - Updated the constructor and state variables
  - Edited `PRC20.sol`
    - `transfer()` function using `tx.origin` instead of `msg.sender`
  - Added Migration code in `2_SITcoin_migration` for market contract
  - Tests
    - Edited test case for `purchaseItem()`
    - Edited assert for `getItem()`
- v1.5.2
  - Tests
    - Implemented tests for `MINTER_ROLE` permissions
    - Implemented testing framework `assertTruffle`
- v1.5.1
  - Reverted `SafeMath` due to Solidity v0.8.0 auto checks for arithmetic overflow
    - `PRC20.sol`
    - `PRC721.sol`
  - Update all olidity requirements to v0.8.0 to compile
  - Extended **PRC721**
    - Added Token URI functions
    - Updated `_burn()` function
    - Updated `tokenURI()` function
  - Implemented `AccessToken.sol`
    - Added `MINTER_ROLE` for restricting mint access
    - Updated `_mint()` to `_safeMint()`
- v1.5
  - Implemented **PRC721**
  - Implemented `SafeMath` in `PRC721.sol`

- v1.4.2
  - Added tests for minting and minter roles
- v1.4.1
  - Implemented `SafeMath` in `PRC20.sol`

- v1.3.6
  - Added use cases for market, under `market_usecase.js`
  - Added documentation and TODO for market contract
  - Minor edit to market test file, under `test_Market.js`
  - Edited the wallet address for test files
- v1.3.5
  - Added tests for market
  - Added new function`purchaseItem()`, `getItemCount()`, `getSoldItemCount()` and `getItem()`
  - Renamed `fetchAllItems()` and `fetchUnsoldItems()` to `getAllItems()` and `getUnsoldItems()`
    - Edited codes in some of these functions
- v1.3.4
  - Added tests for minting and minter roles
- v1.3.3
  - Implemented SafeMath in PRC20.sol
- v1.3.2
  - Updated code in Market.sol
    - Changed `fetchAllItems()` to `fetchUnsoldItems()` to get all unsold items
    - Added `fetchAllItems()` to get all listed items 
    - `checkItemExist()` to check for specific items
    - `unlistItem()` to remove unsold items on the market
  - Added documentation
- v1.3.1
  - Created Market contract, test file and script (`Market.sol`, `market_usecase.js`, `test_Market.js`)
  - Updated code in `Market.sol`
    - State variables
    - Item struct
    - Functions include `createItem()`, `fetchAllItems()`
- v1.3
  - Testing implemented
  - Removed unneccessary code in `PRC20.sol`

- v1.2
  - SIT Coin Contract deployed
  - Interactive script completed

- v1.1
  - **PRC20** Token Contract
    - Corrected implementation of **PRC20** token contract
    - Implemented openzeppelin contracts framework

- v1.0
  - Deployment on PlatOn local private testnet
  - Smart Contract code done