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

# Events:

- [`ItemCreated(uint256 id, string description, address seller, address buyer, uint256 price, bool sold)`](#Market-ItemCreated-uint256-string-address-address-uint256-bool-)

- [`ItemUnlisted(uint256 id, bool success)`](#Market-ItemUnlisted-uint256-bool-)

- [`ItemPurchased(uint256 id, address buyer, uint256 price, bool success)`](#Market-ItemPurchased-uint256-address-uint256-bool-)

- [`ErrorMsg(string errorMessage)`](#Market-ErrorMsg-string-)

# Function `constructor(address _sitcoin)` {#Market-constructor-address-}

Sets the SITCoin instance

 First deploy token contract and then deploy this contract.

# Function `createItem(string description, uint256 price) → uint256` {#Market-createItem-string-uint256-}

Creates a new item in the market.

## Return Values:

- The current token ID of the new item.

# Function `unlistItem(uint256 _itemId) → bool` {#Market-unlistItem-uint256-}

Seller can remove/unlist unsold item(s) from the market

# Function `purchaseItem(uint256 _itemId) → bool` {#Market-purchaseItem-uint256-}

Buy items from the market

# Function `getItem(uint256 _itemId) → struct Market.Item` {#Market-getItem-uint256-}

Get specific item details

## Return Values:

- Object of selected item

# Function `checkItemExist(uint256 _itemId) → bool` {#Market-checkItemExist-uint256-}

Check if specific item exists in the market

## Parameters:

- `_itemId`: id of the item to check

## Return Values:

- true if item exists, false otherwise

# Function `getItemCount() → uint256` {#Market-getItemCount--}

Shows the count of items in the market (includes sold, unlisted and listed items)

## Return Values:

- total count

# Function `getSoldItemCount() → uint256` {#Market-getSoldItemCount--}

Show all the count of sold items in the market.

## Return Values:

- count of sold items

# Function `getUnsoldItems() → struct Market.Item[]` {#Market-getUnsoldItems--}

Show all unsold items in the market

## Return Values:

- array of all unsold items

# Function `getAllItems() → struct Market.Item[]` {#Market-getAllItems--}

Show all listed items in the market

## Return Values:

- array of all items

# Function `getaddress() → address` {#Market-getaddress--}

Get the current contract address

## Return Values:

- address of current contract

# Event `ItemCreated(uint256 id, string description, address seller, address buyer, uint256 price, bool sold)` {#Market-ItemCreated-uint256-string-address-address-uint256-bool-}

No description

# Event `ItemUnlisted(uint256 id, bool success)` {#Market-ItemUnlisted-uint256-bool-}

No description

# Event `ItemPurchased(uint256 id, address buyer, uint256 price, bool success)` {#Market-ItemPurchased-uint256-address-uint256-bool-}

No description

# Event `ErrorMsg(string errorMessage)` {#Market-ErrorMsg-string-}

No description
