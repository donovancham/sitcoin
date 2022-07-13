# `NFTMarket`

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

## constructor

<br>

```sol

function constructor(

  address _sitcoin

) public

```

Sets the token properties and stores the SITCoin instance

### Parameters:

- `_sitcoin`: Address of SITcoin contract

First deploy token contract and then deploy this contract.

## mint

<br>

```sol

function mint(

  string description,

  string _tokenURI,

  uint256 _price

) external returns (uint256)

```

Mint a new NFT

### Parameters:

- `description`: Description of the NFT.

- `_tokenURI`: Link to the digital asset

- `_price`: Price of the NFT

### Return Values:

- The id of the item created.

## isOwnerOf

<br>

```sol

function isOwnerOf(

  uint256 tokenId,

  address account

) public returns (bool)

```

Check if wallet address (user) is owner of a particular NFT

### Parameters:

- `tokenId`: The token ID of the NFT to be checked

- `account`: The account number to check against

### Return Values:

- True if the user owns the NFT, false otherwise

## getSymbol

<br>

```sol

function getSymbol(

) external returns (string)

```

Get the symbol of the token

### Return Values:

- token symbol

## getName

<br>

```sol

function getName(

) external returns (string)

```

Get the name of the token

### Return Values:

- token name

## myOwnedNFTs

<br>

```sol

function myOwnedNFTs(

) external returns (struct NFTMarket.NFT[] _myNFTs, uint256 count)

```

Get the total number of NFT owned (minted and bought) by the user

### Return Values:

- _myNFTs Number of NFTs the user owns

- count Number of NFTs the user owns

## getMyNFTCreations

<br>

```sol

function getMyNFTCreations(

) external returns (struct NFTMarket.NFT[] _myNFTs, uint256 count)

```

Get all the NFT that is created by the author

### Return Values:

- _myNFTs NFTs created by the author

- count Number of NFTs the author created

## getTotalNFTCount

<br>

```sol

function getTotalNFTCount(

) external returns (uint256)

```

Get total number of NFTs minted

### Return Values:

- Number of NFTs minted

## createItem

<br>

```sol

function createItem(

  uint256 _tokenId

) external

```

Add NFT into the market for purchase

### Parameters:

- `_tokenId`: Token identifier number

## purchaseItem

<br>

```sol

function purchaseItem(

) external returns (bool)

```

Purchase NFT from the market

### Return Values:

- true if item is sold, false if otherwise

## unlistItem

<br>

```sol

function unlistItem(

) external returns (bool)

```

Unpublish items on the market

### Return Values:

- true if item is successfully unlisted, false otherwise

## getaddress

<br>

```sol

function getaddress(

) public returns (address)

```

Get the address of current contract

### Return Values:

- Address of current contract

## getTotalMarketItems

<br>

```sol

function getTotalMarketItems(

) external returns (uint256)

```

Get total number of items on the market, excluding unlisted items

### Return Values:

- Number of items on the market

## getAllMarketItems

<br>

```sol

function getAllMarketItems(

) public returns (struct NFTMarket.NFT[] allItems, uint256 count)

```

Get the all items published on the market

### Return Values:

- allItems sll Market items

- count number of Market items

## getUnsoldItems

<br>

```sol

function getUnsoldItems(

) public returns (struct NFTMarket.NFT[] unsold, uint256 count)

```

Get the all unsold items published on the market

### Return Values:

- unsold All unsold market items

- count number of unsold Market items

# Events:

- [`NFTListed(uint256 itemId, string title, uint256 tokenId, uint256 price, address seller)`](#NFTMarket-NFTListed-uint256-string-uint256-uint256-address-)

- [`NFTPurchased(uint256 itemId, uint256 tokenId, uint256 price, address seller, address buyer)`](#NFTMarket-NFTPurchased-uint256-uint256-uint256-address-address-)

- [`MarketItemUnlisted(uint256 itemId, bool success)`](#NFTMarket-MarketItemUnlisted-uint256-bool-)

- [`ErrorMsg(string errorMessage)`](#NFTMarket-ErrorMsg-string-)

## NFTListed

<br>

```sol

NFTListed(uint256 itemId, string title, uint256 tokenId, uint256 price, address seller)

```

To emit event when item is newly added onto the market

## NFTPurchased

<br>

```sol

NFTPurchased(uint256 itemId, uint256 tokenId, uint256 price, address seller, address buyer)

```

To emit event when item is sold on the market

## MarketItemUnlisted

<br>

```sol

MarketItemUnlisted(uint256 itemId, bool success)

```

To emit event when item is unlisted on the market

## ErrorMsg

<br>

```sol

ErrorMsg(string errorMessage)

```

To emit event when transactional error occurs
