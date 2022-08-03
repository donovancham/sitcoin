# `NFTMarket`

NFT Market that only has NFT item up for sale. NFT has to be minted first before it can be listed onto the market for sale. It is a derivative of the Market contract.

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

```Solidity

function constructor(

  address _sitcoin

) public

```

Sets the token properties and stores the SITCoin instance. First deploy token contract and then deploy this contract.

### Parameters:

- `_sitcoin`: Address of SITcoin contract.

## mint

<br>

```Solidity

function mint(

  string description,

  string _tokenURI,

  uint256 _price,

  contract ERC721 _nft

) external returns (uint256 _itemID)

```

Mint a new NFT.

### Parameters:

- `description`: Description of the NFT.

- `_tokenURI`: Link to the digital asset.

- `_price`: Price of the NFT.

- `_nft`: The address of the NFT contract.

### Return Values:

- `_itemID`: The id of the item created.

## isOwnerOf

<br>

```Solidity

function isOwnerOf(

  uint256 tokenId,

  address account

) public returns (bool _success)

```

Check if wallet address (user) is owner of a particular NFT.

### Parameters:

- `tokenId`: The token ID of the NFT to be checked.

- `account`: The account number to check against.

### Return Values:

- `_success`: True if the user owns the NFT, false otherwise.

## getSymbol

<br>

```Solidity

function getSymbol(

) external returns (string _symbol)

```

Get the symbol of the token.

### Return Values:

- `_symbol`: token symbol

## getName

<br>

```Solidity

function getName(

) external returns (string _name)

```

Get the name of the token.

### Return Values:

- `_name`: token name

## myOwnedNFTs

<br>

```Solidity

function myOwnedNFTs(

) external returns (struct NFTMarket.NFT[] _myNFTs, uint256 count)

```

Get the total number of NFT owned (minted and bought) by the user.

### Return Values:

- `_myNFTs`: Number of NFTs the user owns.

- `count`: Number of NFTs the user owns.

## getMyNFTCreations

<br>

```Solidity

function getMyNFTCreations(

) external returns (struct NFTMarket.NFT[] _myNFTs, uint256 count)

```

Get all the NFT that is created by the author.

### Return Values:

- `_myNFTs`: NFTs created by the author.

- `count`: Number of NFTs the author created.

## getTotalNFTCount

<br>

```Solidity

function getTotalNFTCount(

) external returns (uint256 totalNftCount)

```

Get total number of NFTs minted.

### Return Values:

- `totalNftCount`: Number of NFTs minted.

## createItem

<br>

```Solidity

function createItem(

  uint256 _tokenId

) external

```

Add NFT into the market for purchase.

### Parameters:

- `_tokenId`: Token identifier number.

## purchaseItem

<br>

```Solidity

function purchaseItem(

  uint256 _tokenId

) external returns (bool _success)

```

Purchase NFT from the market.

### Parameters:

- `_tokenId`: The ID of the NFT item.

### Return Values:

- `_success`: true if item is sold, false if otherwise.

## unlistItem

<br>

```Solidity

function unlistItem(

  uint256 _tokenId

) external returns (bool _success)

```

Unpublish items on the market

### Parameters:

- `_tokenId`: The ID of the NFT item.

### Return Values:

- `_success`: true if item is successfully unlisted, false otherwise

## getaddress

<br>

```Solidity

function getaddress(

) public returns (address contractAddress)

```

Get the address of current contract

### Return Values:

- `contractAddress`: Address of current contract

## getTotalMarketItems

<br>

```Solidity

function getTotalMarketItems(

) external returns (uint256 marketItemCount)

```

Get total number of items on the market, excluding unlisted items

### Return Values:

- `marketItemCount`: Number of items on the market

## getAllMarketItems

<br>

```Solidity

function getAllMarketItems(

) public returns (struct NFTMarket.NFT[] allItems, uint256 count)

```

Get the all items published on the market

### Return Values:

- `allItems`: sll Market items

- `count`: number of Market items

## getUnsoldItems

<br>

```Solidity

function getUnsoldItems(

) public returns (struct NFTMarket.NFT[] unsold, uint256 count)

```

Get the all unsold items published on the market

### Return Values:

- `unsold`: All unsold market items

- `count`: number of unsold Market items

# Events:

- [`NFTListed(uint256 tokenId, string description, uint256 price, address seller)`](#NFTMarket-NFTListed-uint256-string-uint256-address-)

- [`NFTPurchased(uint256 itemId, uint256 tokenId, uint256 price, address seller, address buyer)`](#NFTMarket-NFTPurchased-uint256-uint256-uint256-address-address-)

- [`MarketItemUnlisted(uint256 itemId, bool success)`](#NFTMarket-MarketItemUnlisted-uint256-bool-)

- [`ErrorMsg(string errorMessage)`](#NFTMarket-ErrorMsg-string-)

## NFTListed

<br>

```Solidity

NFTListed(uint256 tokenId, string description, uint256 price, address seller)

```

To emit event when item is newly added onto the market.

### Parameters:

- `tokenId`: The ID of the NFT minted.

- `description`: The description of the NFT item.

- `price`: The price of the NFT item.

- `seller`: The address of the seller account.

## NFTPurchased

<br>

```Solidity

NFTPurchased(uint256 itemId, uint256 tokenId, uint256 price, address seller, address buyer)

```

To emit event when item is sold on the market.

### Parameters:

- `itemId`: The ID of the item in the market.

- `tokenId`: The NFT ID.

- `price`: The price of the item.

- `seller`: The address of the seller account.

- `buyer`: The address of the buyer account.

## MarketItemUnlisted

<br>

```Solidity

MarketItemUnlisted(uint256 itemId, bool success)

```

To emit event when item is unlisted on the market.

### Parameters:

- `itemId`: The ID of the item in the market.

- `success`: Indicates whether the action performed is successful.

## ErrorMsg

<br>

```Solidity

ErrorMsg(string errorMessage)

```

To emit event when transactional error occurs. Used to log error messages on the chain.

### Parameters:

- `errorMessage`: The error message to be logged.
