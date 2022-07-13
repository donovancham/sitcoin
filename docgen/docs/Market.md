# `Market`

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

```sol

function constructor(

) public

```

Sets the SITCoin instance

 First deploy token contract and then deploy this contract.

## createItem

<br>

```sol

function createItem(

) external returns (uint256)

```

Creates a new item in the market.

### Return Values:

- The current token ID of the new item.

## unlistItem

<br>

```sol

function unlistItem(

) external returns (bool)

```

Seller can remove/unlist unsold item(s) from the market

## purchaseItem

<br>

```sol

function purchaseItem(

) external returns (bool)

```

Buy items from the market

## getItem

<br>

```sol

function getItem(

) external returns (struct Market.Item)

```

Get specific item details

### Return Values:

- Object of selected item

## checkItemExist

<br>

```sol

function checkItemExist(

  uint256 _itemId

) public returns (bool)

```

Check if specific item exists in the market

### Parameters:

- `_itemId`: id of the item to check

### Return Values:

- true if item exists, false otherwise

## getItemCount

<br>

```sol

function getItemCount(

) public returns (uint256)

```

Shows the count of items in the market (includes sold, unlisted and listed items)

### Return Values:

- total count

## getSoldItemCount

<br>

```sol

function getSoldItemCount(

) public returns (uint256)

```

Show all the count of sold items in the market.

### Return Values:

- count of sold items

## getUnsoldItems

<br>

```sol

function getUnsoldItems(

) external returns (struct Market.Item[])

```

Show all unsold items in the market

### Return Values:

- array of all unsold items

## getAllItems

<br>

```sol

function getAllItems(

) external returns (struct Market.Item[])

```

Show all listed items in the market

### Return Values:

- array of all items

## getaddress

<br>

```sol

function getaddress(

) public returns (address)

```

Get the current contract address

### Return Values:

- address of current contract

# Events:

- [`ItemCreated(uint256 id, string description, address seller, address buyer, uint256 price, bool sold)`](#Market-ItemCreated-uint256-string-address-address-uint256-bool-)

- [`ItemUnlisted(uint256 id, bool success)`](#Market-ItemUnlisted-uint256-bool-)

- [`ItemPurchased(uint256 id, address buyer, uint256 price, bool success)`](#Market-ItemPurchased-uint256-address-uint256-bool-)

- [`ErrorMsg(string errorMessage)`](#Market-ErrorMsg-string-)

## ItemCreated

<br>

```sol

ItemCreated(uint256 id, string description, address seller, address buyer, uint256 price, bool sold)

```

No description

## ItemUnlisted

<br>

```sol

ItemUnlisted(uint256 id, bool success)

```

No description

## ItemPurchased

<br>

```sol

ItemPurchased(uint256 id, address buyer, uint256 price, bool success)

```

No description

## ErrorMsg

<br>

```sol

ErrorMsg(string errorMessage)

```

No description
