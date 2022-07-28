# `Market`

The predecessor to the NFT Market. It serves as an initial draft to plan out the infrastructure to be used for the NFT Market contract.

# Functions:

- [`constructor(address _sitcoin)`](#Market-constructor-address-)

- [`createItem(string description, uint256 price)`](#Market-createItem-string-uint256-)

- [`unlistItem(uint256 _itemId)`](#Market-unlistItem-uint256-)

- [`purchaseItem(uint256 _itemId)`](#Market-purchaseItem-uint256-)

- [`getItem(uint256 _itemId)`](#Market-getItem-uint256-)

- [`checkItemExist(uint256 _itemId)`](#Market-checkItemExist-uint256-)

- [`getItemCount()`](#Market-getItemCount--)

- [`getSoldItemCount()`](#Market-getSoldItemCount--)

- [`getUnsoldItems()`](#Market-getUnsoldItems--)

- [`getAllItems()`](#Market-getAllItems--)

- [`getaddress()`](#Market-getaddress--)

## constructor

<br>

```Solidity

function constructor(

  address _sitcoin

) public

```

Constructor that initializes the market contract. Requires the token contract to be initialized together.

### Parameters:

- `_sitcoin`: The address of the token contract to be used in the market.

## createItem

<br>

```Solidity

function createItem(

  string description,

  uint256 price

) external returns (uint256 _id)

```

Creates a new item in the market.

### Parameters:

- `description`: The description of the new `item`.

- `price`: The price of the new `item`.

### Return Values:

- `_id`: The current token ID of the new item.

## unlistItem

<br>

```Solidity

function unlistItem(

  uint256 _itemId

) external returns (bool _success)

```

Seller can remove/unlist unsold item(s) from the market 

### Parameters:

- `_itemId`: The ID of the `item` to be unlisted.

### Return Values:

- `_success`: Indicates whether the item was successfully removed.

## purchaseItem

<br>

```Solidity

function purchaseItem(

  uint256 _itemId

) external returns (bool _success)

```

Buy items from the market

### Parameters:

- `_itemId`: The ID of the `item` to be bought.

### Return Values:

- `_success`: Indicates whether the `item` is successfully bought.

## getItem

<br>

```Solidity

function getItem(

  uint256 _itemId

) external returns (struct Market.Item _item)

```

Gets the information pertaining to an item.

### Parameters:

- `_itemId`: The ID of the `item` to retrieve the info from.

### Return Values:

- `_item`: The `item` object.

## checkItemExist

<br>

```Solidity

function checkItemExist(

  uint256 _itemId

) public returns (bool _success)

```

Check if specific item exists in the market

### Parameters:

- `_itemId`: id of the item to check.

### Return Values:

- `_success`: true if item exists, false otherwise.

## getItemCount

<br>

```Solidity

function getItemCount(

) public returns (uint256 _totalItemCount)

```

Shows the count of items in the market (includes sold, unlisted and listed items)

### Return Values:

- `_totalItemCount`: The total number of items in the market.

## getSoldItemCount

<br>

```Solidity

function getSoldItemCount(

) public returns (uint256 _soldItemCount)

```

Show all the count of sold items in the market.

### Return Values:

- `_soldItemCount`: count of sold items.

## getUnsoldItems

<br>

```Solidity

function getUnsoldItems(

) external returns (struct Market.Item[] _unsoldItemArray)

```

Show all unsold items in the market.

### Return Values:

- `_unsoldItemArray`: array of all unsold items.

## getAllItems

<br>

```Solidity

function getAllItems(

) external returns (struct Market.Item[] _listedItemsArray)

```

Show all listed items in the market.

### Return Values:

- `_listedItemsArray`: array of all items.

## getaddress

<br>

```Solidity

function getaddress(

) public returns (address _contractAddress)

```

Get the current contract address

### Return Values:

- `_contractAddress`: address of current contract

# Events:

- [`ItemCreated(uint256 id, string description, uint256 price)`](#Market-ItemCreated-uint256-string-uint256-)

- [`ItemUnlisted(uint256 id, bool success)`](#Market-ItemUnlisted-uint256-bool-)

- [`ItemPurchased(uint256 id, address buyer, uint256 price, bool success)`](#Market-ItemPurchased-uint256-address-uint256-bool-)

- [`ErrorMsg(string errorMessage)`](#Market-ErrorMsg-string-)

## ItemCreated

<br>

```Solidity

ItemCreated(uint256 id, string description, uint256 price)

```

Event should be fired when an item is created.

### Parameters:

- `id`: The identifier number of the item.

- `description`: The item description.

- `price`: The price of the item.

## ItemUnlisted

<br>

```Solidity

ItemUnlisted(uint256 id, bool success)

```

Event should be fired when an item is attempted to be removed from listing.

### Parameters:

- `id`: The identifier number of the item.

- `success`: Indicates whether the item is successfully unlisted.

## ItemPurchased

<br>

```Solidity

ItemPurchased(uint256 id, address buyer, uint256 price, bool success)

```

Event should be fired when an item is purchased

### Parameters:

- `id`: The identifier number of the item.

- `buyer`: The address of the buyer account if the item has been bought.

- `price`: The price of the item.

- `success`: Indicates whether the item is successfully purchased.

## ErrorMsg

<br>

```Solidity

ErrorMsg(string errorMessage)

```

Event should be fired when an error has occurred

### Parameters:

- `errorMessage`: The error message that should be logged.
