# Installation (Linux)
1. Install [Node.js](https://nodejs.org/en/download/)
```sh
# Install n to manage node version
curl -L https://git.io/n-install | bash
n 14

$ node -v 
v14.19.3

$ npm -v
6.14.17
```

2. Install [PlatON Truffle Suite](https://platon-truffle.readthedocs.io/en/v1.1.1/getting-started/installation.html) and [Lerna](https://github.com/lerna/lerna)
```sh
# Truffle Install
npm install -g platon-truffle
npm audit fix --force
platon-truffle version

# Install Lerna for PlatON-JS-SDK
npm install -g lerna
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

# DevNet Setup (Linux)
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

# Running Project
1. Clone repo
```sh
git clone https://github.com/donovancham/sitcoin.git
```

2. Install dependencies from `package.json`
```sh
npm install
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

# Running Scripts
1. Using `platon-truffle`
```sh
platon-truffle exec scripts/transferToken.js
```

2. Using node.js
```sh
node scripts/transferToken.js
```