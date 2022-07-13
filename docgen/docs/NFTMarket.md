# Functions:

- [`constructor(address _sitcoin)`](#NFTMarket-constructor-address-)

- [`mint(string description, string _tokenURI, uint256 _price, contract ERC721 _nft)`](#NFTMarket-mint-string-string-uint256-contract-ERC721-)

- [`isOwnerOf(uint256 tokenId, address account)`](#NFTMarket-isOwnerOf-uint256-address-)

- [`getSymbol()`](#NFTMarket-getSymbol--)

- [`getName()`](#NFTMarket-getName--)

- [`myOwnedNFTs()`](#NFTMarket-myOwnedNFTs--)

- [`getMyNFTCreations()`](#NFTMarket-getMyNFTCreations--)

- [`getTotalNFTCount()`](#NFTMarket-getTotalNFTCount--)

- [`createItem(uint256 _tokenId)`](#NFTMarket-createItem-uint256-)

- [`purchaseItem(uint256 _tokenId)`](#NFTMarket-purchaseItem-uint256-)

- [`unlistItem(uint256 _tokenId)`](#NFTMarket-unlistItem-uint256-)

- [`getaddress()`](#NFTMarket-getaddress--)

- [`getTotalMarketItems()`](#NFTMarket-getTotalMarketItems--)

- [`getAllMarketItems()`](#NFTMarket-getAllMarketItems--)

- [`getUnsoldItems()`](#NFTMarket-getUnsoldItems--)

# Events:

- [`NFTListed(uint256 itemId, string title, uint256 tokenId, uint256 price, address seller)`](#NFTMarket-NFTListed-uint256-string-uint256-uint256-address-)

- [`NFTPurchased(uint256 itemId, uint256 tokenId, uint256 price, address seller, address buyer)`](#NFTMarket-NFTPurchased-uint256-uint256-uint256-address-address-)

- [`MarketItemUnlisted(uint256 itemId, bool success)`](#NFTMarket-MarketItemUnlisted-uint256-bool-)

- [`ErrorMsg(string errorMessage)`](#NFTMarket-ErrorMsg-string-)

# Function `constructor(address _sitcoin)` {#NFTMarket-constructor-address-}

Sets the token properties and stores the SITCoin instance

## Parameters:

- `_sitcoin`: Address of SITcoin contract

First deploy token contract and then deploy this contract.

# Function `mint(string description, string _tokenURI, uint256 _price, contract ERC721 _nft) → uint256` {#NFTMarket-mint-string-string-uint256-contract-ERC721-}

Mint a new NFT

## Parameters:

- `description`: Description of the NFT.

- `_tokenURI`: Link to the digital asset

- `_price`: Price of the NFT

## Return Values:

- The id of the item created.

# Function `isOwnerOf(uint256 tokenId, address account) → bool` {#NFTMarket-isOwnerOf-uint256-address-}

Check if wallet address (user) is owner of a particular NFT

## Parameters:

- `tokenId`: The token ID of the NFT to be checked

- `account`: The account number to check against

## Return Values:

- True if the user owns the NFT, false otherwise

# Function `getSymbol() → string` {#NFTMarket-getSymbol--}

Get the symbol of the token

## Return Values:

- token symbol

# Function `getName() → string` {#NFTMarket-getName--}

Get the name of the token

## Return Values:

- token name

# Function `myOwnedNFTs() → struct NFTMarket.NFT[] _myNFTs, uint256 count` {#NFTMarket-myOwnedNFTs--}

Get the total number of NFT owned (minted and bought) by the user

## Return Values:

- _myNFTs Number of NFTs the user owns

- count Number of NFTs the user owns

# Function `getMyNFTCreations() → struct NFTMarket.NFT[] _myNFTs, uint256 count` {#NFTMarket-getMyNFTCreations--}

Get all the NFT that is created by the author

## Return Values:

- _myNFTs NFTs created by the author

- count Number of NFTs the author created

# Function `getTotalNFTCount() → uint256` {#NFTMarket-getTotalNFTCount--}

Get total number of NFTs minted

## Return Values:

- Number of NFTs minted

# Function `createItem(uint256 _tokenId)` {#NFTMarket-createItem-uint256-}

Add NFT into the market for purchase

## Parameters:

- `_tokenId`: Token identifier number

# Function `purchaseItem(uint256 _tokenId) → bool` {#NFTMarket-purchaseItem-uint256-}

Purchase NFT from the market

## Return Values:

- true if item is sold, false if otherwise

# Function `unlistItem(uint256 _tokenId) → bool` {#NFTMarket-unlistItem-uint256-}

Unpublish items on the market

## Return Values:

- true if item is successfully unlisted, false otherwise

# Function `getaddress() → address` {#NFTMarket-getaddress--}

Get the address of current contract

## Return Values:

- Address of current contract

# Function `getTotalMarketItems() → uint256` {#NFTMarket-getTotalMarketItems--}

Get total number of items on the market, excluding unlisted items

## Return Values:

- Number of items on the market

# Function `getAllMarketItems() → struct NFTMarket.NFT[] allItems, uint256 count` {#NFTMarket-getAllMarketItems--}

Get the all items published on the market

## Return Values:

- allItems sll Market items

- count number of Market items

# Function `getUnsoldItems() → struct NFTMarket.NFT[] unsold, uint256 count` {#NFTMarket-getUnsoldItems--}

Get the all unsold items published on the market

## Return Values:

- unsold All unsold market items

- count number of unsold Market items

# Event `NFTListed(uint256 itemId, string title, uint256 tokenId, uint256 price, address seller)` {#NFTMarket-NFTListed-uint256-string-uint256-uint256-address-}

To emit event when item is newly added onto the market

# Event `NFTPurchased(uint256 itemId, uint256 tokenId, uint256 price, address seller, address buyer)` {#NFTMarket-NFTPurchased-uint256-uint256-uint256-address-address-}

To emit event when item is sold on the market

# Event `MarketItemUnlisted(uint256 itemId, bool success)` {#NFTMarket-MarketItemUnlisted-uint256-bool-}

To emit event when item is unlisted on the market

# Event `ErrorMsg(string errorMessage)` {#NFTMarket-ErrorMsg-string-}

To emit event when transactional error occurs
