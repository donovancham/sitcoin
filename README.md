# SIT Coin
The purpose of this project is to create a meticulously designed and defined university cryptocurrency that can be used as a medium for trades and reward in the digital campus. For all intents and purposes, the cryptocurrency should be implemented without compromising the security of the digital campus in the digital world. 

In SIT’s push towards a digital campus, the metaverse that it creates will inherently have a digital economy where a university cryptocurrency (`$SITC`) will be the fundamental basic currency within this ecosystem. And it is of equally, if not more, vital importance that cryptocurrency is designed and defined properly. The aim is to utilize the virtual campus and `$SITC` to build a cohesive environment for SIT, both virtually and physically.

## Project Deliverables
The task is to ultimately deliver a POC demonstration that shows the feasibility of the adoption of a university cryptocurrency. The POC demonstration should be able to demonstrate that the tokenomics proposed is feasible to be implemented on a blockchain platform backend. 

1. Whitepaper
   - Literature survey
   - Use Cases
   - Tokenomics proposed
2. Select Companies to partner to work on POC
   - Wanxiang group with PlatON blockchain selected
   - Hashkey DID for digital identity requirements
3. POC implementation
   - Select use cases from tokenomics to implement
     - SIT Coin **(Token contract)**
     - Market use case **(NFT Marketplace)**
     - Identity Verification for permissioned access control requirements **(Digital Identity)**
   - Showcase use cases from tokenomics as part of feasibility demonstration

## SITCOIN Poster
![SITCOIN Poster](docs/poster/ITP_Gp14_SITCoinInitiative_Poster.jpg)

## Poster Video
You may watch the poster video for a short 5 minute summary of the project.

[![SITCOIN Poster Thumbnail](https://img.youtube.com/vi/4fBHaSYol2I/0.jpg)](https://www.youtube.com/watch?v=4fBHaSYol2I)

## Documentation Links
- [SITCOIN Project documentation](docs/SUMMARY.md)
- [Web3 dApp documentation](docs/web3dapp.md)
- [Setup and Installation](docs/SETUP.md)

## Dev Notes
### Pull Requests
- Merge main to working branch and resolve conflicts before merge
- Ensure that `platon-truffle tests` are run and all tests pass before merging.

### Testing
- Write tests according to use case scenarios
- Try to cover all code when writing tests
- Priority coverage for functions to be used in use cases

### Dependencies

#### Environment Dependencies
- Node JS (`10.18.1` to `14.19.3`) 
- PlatON client
  - Go (`1.16+`)
  - git (`2.19.1+`)
  - If Linux (`18.04.1` and above)
  - cmake (`3.0+`)

#### Smart Contract Dev Dependencies
- `platon-truffle` (solidity dev env)
- `@openzeppelin/contracts` (contract)
- `truffle-assertions` (testing)
- Optional Dependencies
  - `solidity-docgen` (documentation)
  - `solc@0.8.6` (documentation)

#### Frontend web3 Dependencies
- @babel/core
- Bootstrap
- IPFS HTTP Client (Used for connecting to IPFS)
- isomorphic-dompurify
- Next JS
- Notiflix (JS library for notifications, popups etc.)
- React JS
- React Bootstrap
- PlatON JS SDK
- NextAuth
- jsdoc (documentation)


## Project Features

### Smart Contracts
- [x] SITCOIN
	- [x] `ERC-20` Burnable
	- [x] Access Controls (RBAC)
	- [x] Mintable
	- [x] 0 decimal place
- [x] NFT Market
	- [x] `ERC-721` URI Storage
	- [x] Market Functions
		- [x] Create
		- [x] Delete
		- [x] View
		- [x] Buy
  		- [x] Execute token transfers
  		- [x] NFT ownership transfer
- [x] Digital Identity (Self-Sovereign Identity)
	- [x] `ClaimHolder.sol`
		- [x] `KeyHolder.sol`
			- [x] `ERC-725v1` (Identity)
		- [x] `ERC-735` (Claims)
	- [x] Verify Claim
		- [x] JS Implementation using **"PlatON JS SDK"**
			- [x] `web3.platon.personal.sign` to generate signature
			- [x] `web3.platon.personal.ecRecover` to recover address
			- [x] Verified by checking `recover(signature, dataHash)` = signer address

### Future Improvements List
- SIT Coin
  - Permits (Gasless transactions) 
	- [EIP-712: Domain](https://eips.ethereum.org/EIPS/eip-712)
	- Gas Relay Station [(OpenGSN)](https://opengsn.org/)
- NFT Market
  - Update Market Item
  - IPFS integration
	- Gas Cost Optimization
- Digital Identity
	- [Hashkey DID](https://www.hashkey.id/home)
    - Await for update of Hashkey DID (Soul-bound Tokens, Credentials)
    - Cross-chain features for testing interactions without requiring Hashkey DID to deploy to testnet
- Upgradable Contracts [(OpenZeppelin Upgradeable)](https://docs.openzeppelin.com/upgrades-plugins/1.x/)

### Web3 dApp
- [ ] Login
  - [ ] Deploy new Identity
  - [x] View Identity Details
	- [ ] KYC Process
		- [ ] Get signed Claim (Claim = Proof of identity)
	- [ ] Login verification
		- [ ] Sign in framework
		- [ ] Verify Claim feature
- [x] Wallet
	- [x] Network
		- [x] Connected Network
		- [x] SITC Supply
	- [x] Account
		- [x] My Address
		- [x] SITC Balance
	- [x] Transfer Tokens
	- [x] Burn Tokens
- [x] Marketplace
	- [x] Manage
		- [x] Create
		- [x] Delete
		- [x] List my items
	- [x] List all items
	- [x] Buy Item

The implementation of the Login feature was not able to be completed fully **on the web3 dApp** on the project delivery deadline. However the implementation has already been shown to be working from the [JS script](scripts/identity.js) before the development of the dApp. 


## Changelog
- v1.9.0 (Final update from ITP (2021/22 T3) Group 14)
  - Added documentation in `README.md`
    - Project Deliverables
    - Project Features
    - Writing Tests
    - Pull Requests workflow
  - Updated documentation folder from `docgen` to `docs`
  - Comments added for web3 dApp components
    - Cleaned unused imports
    - Unfinished sections marked with `@todo` jsdoc tags
    - Added jsdoc styled comments for documenting
      - [x] `components`
      - [x] `context`
  - Minor web3 dApp updates
    - Fixed form not validating issue for `AllowanceForm` in `Marketplace.js`
    - Fixed form not validating issue for `CreateNFTForm` in `Marketplace.js`
  - Testing
    - All tests ran and fixed
    - Added `ClaimHolder.test.js`

- v1.8.6
  - Added documentation for web3 dApp
    - Component functions
    - TODO comments for unfinished sections
  - Added documentation for project requirements and implementation status
- v1.8.5
  - Updated web3 dApp
    - Market Component
      - Added wallet balance to manage allowance modal for better UX
      - Added checks to verify that allowance to grant does not exceed current wallet balance
- v1.8.4
  - Updated web3 dApp
    - Login Component
      - Identity Management
        - Deploy new identity contract **(Incomplete)**
        - Get Identity Data feature implemented
      - KYC Process
        - UI Implemented
        - Adding signed claim feature not implemented **(Incomplete)** 
      - Login Feature
        - Added login framework using NextAuth JS 
        - Create API Route for verifying signature **(Incomplete)**
- v1.8.3
  - Updated web3 dApp
    - Wallet Component
      - Added `burn` token implementation
- v1.8.2
  - Updated web3 dApp
    - Market Component
      - Added Horizontal layout for NFTs to be displayed
- v1.8.1
  - Added `.env.local` setup guide
  - Updated web3 dApp
    - Market Component
      - UI
        - Added modal form for "Create NFT"
        - Added modal form for "Manage Allowance"
        - Added `approval` grant to allow Market to manage NFT sales for user
      - Added Market approval function required to Create NFTs
      - Create NFT implemented
      - View NFT implemented
      - Buy NFT implemented
      - List NFT for sale implemented
      - Unlist NFT from sale implemented
      - Added checks to against the NFT data to determine user's role (owner, creator)
      - Added `allowance` management functions to manage users allowance to Market Contract
    - Market Context
      - Added `approval` checks in the `useEffect` component to refresh `approval` status on load and event triggers
    - Wallet Context
      - Updated `useEffect` to separate the event triggers that calls the updaters
      - Added `allowance` as a state to update on each refresh
- v1.8.0
  - Updated web3 dApp
    - Market Component
      - Added `Marketplace` component for NFT Market UI
      - Added `nftmarket` page to load NFT Market UI separately
      - Added `NFTMarketContext` for loading NFT Market info
      - Updated `Header` to lock Navbar elements before user connects account
      - Implemented NFT creation section
    - Transfer Tokens Component
      - Added Server-side validation features
      - Added dynamic checkers for updating validation elements `onChange`
      - Removed previous validation usages
      - Improved gas efficiency for transactions (2x down to 1.1x)

- v1.7.9
  - Updated tests
    - Commented out `console.log` to improve result printing in Market
    - Fixed `NFTMarket.sol` tests
  - Updated main page
    - Added poster and poster video elements to improve project description in `README`
- v1.7.8
  - Updated `refresh` state in `WalletContext.js`
    - Changed from `bool` to `int`
- v1.7.7
  - Updated documentation
    - Added diagrams for smart contract documentation summary
    - Added documentation for `Market.sol`
    - Added documentation for `NFTMarket.sol`
    - Update `docify.js` to auto generate better Summary file
- v1.7.6
  - Updated `Wallet.js` UI component
    - Added refresh button
    - Added button locking when account is already connected
  - Added `NFTMarket.js` Context
    - Gets information about market from contract
    - Sets states to be used in `Marketplace.js` component
  - Update `Header.js` component
    - Removed placeholder links on navbar
- v1.7.5
  - Removed sensitive data from the main commits
  - Rebased heads but PRs refs unable to update
- v1.7.4
  - Updated documentations
    - `ClaimHolder.sol`
    - `ERC725.sol`
    - `ERC735.sol`
  - Updated `migrations`
    - Updated `2_SITcoin_migration.js`
      - Updated initial minted amount to 10,000,000 SITC (10 mil)
    - Updated `3_Identity_migration.js`
      - Removed `ClaimVerifier` deployment
      - Added **SIT_STUDENT** Claim
      - Added **SIT_FACULTY** Claim
- v1.7.3
  - Changed environment variables calling from `.env` to `.env.local` for web app
  - Untracked `.env` to be used for storage of sensitive local variables
  - Completed implementation of identity claims verification system
    - Updated `scripts/web3Module.js` to include function for getting bytecode from compiled contract JSON
    - Added new wallet addresses for use with SIT identity claim system
    - Added `dotenv` package for using local env variables
    - Implemented JS interface in `scripts/identity.js`
    - JS verification system due to using `web3.platon.personal.sign` not compatible with `web3.eth.sign`
    - Removing contract-based verification system
  - Updated Smart Contracts
    - Removed `ClaimVerifier.sol`
    - Updated `ClaimHolder.sol`
      - Added `getVerifyData()` function for reducing exposure to other elements of claim when verifying identity
- v1.7.2
  - Added `Ownable` access control measures for `ClaimHolder.sol` and `KeyHolder.sol`
  - Clean up unimplemented sections of `ERC725.sol` and `KeyHolder.sol`
- v1.7.1
  - Added Migrations for `ClaimHolder.sol` and `ClaimVerifier.sol`
    - Creates an identity for SIT
    - Creates a signer key for SIT
    - Deploys a `ClaimVerifier` to verify identities
- v1.7
  - Updated Documentations
    - Updated guides for setup and installation
  - Updated web3 App
    - Updated `Header.js` component
      - Added refresh state to ensure information variables are updated
    - Updated `Layout.js` component
      - Fixed footer issue where content will be blocked by footer
    - Added `style/style.css`
      - Custom CSS to fix footer issue
    - Updated `WalletContext.js` context provider
      - Added changes to initialization to prevent double loading
      - Updated to get information from contract
      - Added contract object instantiation to interact with contract methods
    - Updated `Wallet.js` component
      - Added new UI for displaying information
      - Implemented transfer token function
        - Added sanitization checks (DOMpurify)
        - Added validation checks
        - Added error handling
        - Added transaction details reporting after complete operation

- v1.6.4-3
  - Updated web3 App
    - Added `.env` to store public environment variables
    - Updated `Wallet.js` component
      - Added UI for network information
      - Added UI for Wallet information
      - Added UI for transfer `$SITC`
  - Added documentation
    - `KeyHolder.sol` documented
    - `ClaimHolder.sol` documented
    - `ClaimVerifier.sol` documented
  - Updated existing documentation docs
  - Added project dependencies to `README`
- v1.6.4-2
  - Added change listeners
  - Updated wallet context
    - Improved information displayed
    - Added checks to ensure wallet connected
    - Moved wallet context to layout scope for all pages to get wallet state
- v1.6.4-1
  - Refactored next JS folders, moved to `./src`
  - Updated web3 App
    - Added header navbar element
    - Added footer element
- v1.6.3
  - Updated `test/SITcoin.test.js`
    - Added tests for granting/revoking roles
    - Added tests for normal token burning
    - Added tests for token burning from user that has allowance
  - Added `.gitattributes` for solidity syntax highlighting in github docs page
  - Updated documentation
    - Added better readability format for `contract.hbs` template.
    - Updated comments in `SITcoin.sol` for better documentation.
- v1.6.2
  - Added [auto documentation generation](https://forum.openzeppelin.com/t/incorporating-solidity-docgen-into-your-project/1882)
    - Automatically generates documentation for solidity contracts from `natspec` compliant comments
    - Set up npm script for generating docs
    - Installed `solidity-docgen`
    - Installed `solc@0.8.6`
    - Document format can be changed using `contract.hbs` to template the output
- v1.6.1
  - Updated `SITcoin.sol`
    - Implemented token burning
    - Implemented `AccessControl` instead of token burning
    - Implemented `ERC20Permit` for gasless transfers
- v1.6
  - web3 App
    - Removed `alert.module.js`
    - Implemented `Ipfs.js` for connecting to IPFS local node
    - Added Contexts for managing wallet state variables
    - Added Contexts for managing IPFS node
  - Updated `contracts` folder
    - Deleted `Identity.sol`
    - Deleted `KeyManager.sol`
    - Deleted `PRC721.sol`
    - Updated `AccessToken.sol`
      - Removed all previous implementation
      - Restarting from clean slate
    - Added `ERC725.sol` (Digital Identity proxy account with keys)
    - Added `ERC735.sol` (Claim Holder)
    - Added `KeyHolder.sol` 
    - Added `ClaimHolder.sol`
    - Added `ClaimVerifier.sol`
  - Updated `scripts`
    - Moved `PlatonWeb3.js` from `components` folder and renamed to `web3Module.js`
    - Fixed JSON import contract ABI issue

- v1.5.12
  - Edits to `MFTMarket.sol`
    - Removed `Market` struct, using only `NFT` struct
    - Refactored the code due to above changes
  - Edited `NFTMarket.test.js` according to changes above
  - Test and use case files for market tested with no errors
- v1.5.11
  - Edits to `NFTMarket.sol`
    - Added Functions `marketItemExist()`, `getAllMarketItems()`, `getUnsoldItems()`, `unlistItem()`, `getMyNFTs()`, `getTotalMarketItems()`, 'getTotalNFTCount()`
    - Refactored the code
    - Added Docstrings
  - Edits to `Market.sol`
    - Added inheritance to `ReentrancyGuard` 
    - Refactored the code
  - Added use case script for `NFTMarket`
  - Added test cases for `NFTMarket`
- v1.5.10
  - Added tests for `NFTMarket`
    - [In Progress] Edit tests according to edits in `NFTMarket.sol`
  - Edits to `NFTMarket.sol`
    - Added functions `checkItemExist()`, `checkNFTExist()`, `getName()`, `getSymbol()`, `isOwnerOf()`, `mint()`
    - Refactoring of codes
  - Created `PRC721URIStorage.sol`
  - [In Progress] Merging `NFT.sol` to `NFTMarket.sol`
  - Deleted `NFT.sol`
- v1.5.9
  - web3 App
    - Added interface for connecting with [Samurai wallet](https://devdocs.platon.network/docs/en/Samurai_API)
    - Added button to connect to Samurai wallet
    - Added alerts for UI
  - Edit tests
    - Fix imports due to changing filename
- v1.5.8
  - Edited migration file
    - Migration for `NFT.sol`
    - Migration for `NFTMarket.sol`
  - Added tests for `NFTMarket` and `NFT`
- v1.5.7
  - Added NFT contract `NFT.sol`
    - Inherits the `ERC721URIStorage.sol` to link URI to `tokenId`
    - Allow users to mint NFT before listing them in the NFT Market
  - Edited `NFTMarket.sol`
    - `NFTListed` event and `NFTPurchased` event
    - Implemented `transferFrom()` in `purchaseItem()` for both tokens and NFT transfer
- v1.5.6
  - Added NFT market place `NFTMarket.sol`
    - Added `createItem()`, `purchaseItem()` and `getTotalPrice()`
    - Not working yet, work in progress
  - Minor update to `README.md` for run tests command
- v1.5.5
  - web3 App
    - Implemented using [Next.js](https://nextjs.org/)
    - UI done using [React-bootstrap](https://react-bootstrap.github.io/)
    - Blockchain interaction done using [PlatON web3.js](https://devdocs.platon.network/docs/en/JS_SDK/)
    - Current implementation unable to progress 
  - Update `constants.js`
    - Changed name from `wallet_accounts.js`
    - Future uses will be providing contract addresses for dApp
  - Update `README.md`
    - Added installation instructions for quick deployment
- v1.5.4
  - Added `ItemUnlisted` and `ItemPurchased` events
    - Events used in `purchaseItem()` and `unlistItem()`
  - Added more tests cases and use cases
    - Test and use cases working as intended
  - Changed wallet addresses in `market_usecases.js` to use shared wallet account for dev
- v1.5.3
  - Updated `wallet_accounts.js`
    - Added shared accounts for smoother dev
  - Updated `Market.test.js`
    - Added smoother testing variables
  - Updated `SITcoin.test.js`
    - Added test for `transferFrom()` scenario
    - Added test for `approve()` and `allowance()`
- v1.5.2
  - Updated `Market.sol`
    - `purchaseItem()` to call `transferFrom()` instead of `transfer()`
  - Updated `Market_test.js`
    - Implemented `sitcoin.increaseAllowance(address, value, {from: sender})` before `purchaseItem()`
      - Address: Market Contract address, using `marketInstance.address`
      - Value: Price of item
    - Added tests for unlisting of items (`unlistItem()`) and checking unsold items (`getUnsoldItems()`)
    - Balance are being updated correctly after the changes above
- v1.5.1
  - Update `wallet_accounts.js`
    - Added `HEX` addresses for accounts
  - Update `SITcoin.test.js`
    - Added variables for wallet balances to reduce interference from other test deployments
    - Add `beforeEach` function to redeploy after each test
- v1.5
  - Removed `PRC20.sol`
  - Reimplemented `SITcoin.sol`
    - Added documentations for all functions
    - Removed `PRC20.sol` inheritance
    - Added `decimals()` function override to desired decimal place of 0
  - Updated `SITcoin.test.js`
    - Updated function calls to explicitly call from owner
    - Updated some descriptions
    - Added event-based assertions with `truffleAssert.eventEmitted`s
  
- v1.4.3
  - Edited `Market.sol`
    - Updated the code to include code reuse for certain functions
    - Updated the constructor and state variables
  - Edited `PRC20.sol`
    - `transfer()` function using `tx.origin` instead of `msg.sender`
  - Added Migration code in `2_SITcoin_migration` for market contract
  - Tests
    - Edited test case for `purchaseItem()`
    - Edited assert for `getItem()`
- v1.4.2
  - Tests
    - Implemented tests for `MINTER_ROLE` permissions
    - Implemented testing framework `assertTruffle`
- v1.4.1
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
- v1.4
  - Implemented **PRC721**
  - Implemented `SafeMath` in `PRC721.sol`

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
  - Implemented SafeMath in `PRC20.sol`
- v1.3.2
  - Updated code in `Market.sol`
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