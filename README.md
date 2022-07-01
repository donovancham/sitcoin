# SIT Coin
The purpose of this project is to create a meticulously designed and defined university cryptocurrency that can be used as a medium for trades and reward in the digital campus. For all intents and purposes, the cryptocurrency should be implemented without compromising the security of the digital campus in the digital world. 

In SIT’s push towards a digital campus, the metaverse that it creates will inherently have a digital economy where a university cryptocurrency (`$SITC`) will be the fundamental basic currency within this ecosystem. And it is of equally, if not more, vital importance that cryptocurrency is designed and defined properly. The aim is to utilize the virtual campus and `$SITC` to build a cohesive environment for SIT, both virtually and physically.

## Deployment
```sh
platon-truffle compile
platon-truffle migrate
```

## Run Scripts
```sh
platon-truffle exec external/transfer_token.js
```

## Openzeppelin Contracts library installation
```sh
npm install @openzeppelin/contracts
```

## Changelog
- v1.3.2
  - Updated code in Market.sol
    - Changed fetchAllItems() to fetchUnsoldItems() to get all unsold items
    - Added fetchAllItems() to get all listed items 
    - checkItemExist() to check for specific items
    - unlistItem() to remove unsold items on the market
  - Added documentation
- v1.3.1
  - Created Market contract, test file and script (Market.sol, market_usecase.js, test_Market.js)
  - Updated code in Market.sol
    - State variables
    - Item struct
    - Functions include createItem(), fetchAllItems()
- v1.3
  - Testing implemented
  - Removed unneccessary code in PRC20.sol
- v1.2
  - SIT Coin Contract deployed
  - Interactive script completed
- v1.1
  - PRC20 Token Contract
    - Corrected implementation of PRC20 token contract
    - Implemented openzeppelin contracts framework
- v1.0
  - Deployment on PlatOn local private testnet
  - Smart Contract code done