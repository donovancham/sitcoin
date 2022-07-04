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
platon-truffle exec scripts/transferToken.js
```

## Openzeppelin Contracts library installation
```sh
npm install @openzeppelin/contracts
```

## Changelog
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
  - Added use cases for market, under market_usecase.js
  - Added documentation and TODO for market contract
  - Minor edit to market test file, under test_Market.js
  - Edited the wallet address for test files
- v1.3.5
  - Added tests for market
  - Added new function purchaseItem(), getItemCount(), getSoldItemCount() and getItem()
  - Renamed fetchAllItems() and fetchUnsoldItems() to getAllItems() and getUnsoldItems()
    - Edited codes in some of these functions
- v1.3.4
  - Added tests for minting and minter roles
- v1.3.3
  - Implemented SafeMath in PRC20.sol
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