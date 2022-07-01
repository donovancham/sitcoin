// SPDX-License-Identifier: MIT
pragma solidity >=0.5.1 <=0.8.6;

import "./SITcoin.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Market {
    /**
    * @dev Properties of the items in the market.
    */
    struct Item{
        uint256 id;
        //address owner;
        string description;
        address seller;
        address buyer;
        uint256 price;
        bool sold;
    }
    event ItemCreated (
        uint256 indexed id, 
        string description, 
        address seller, 
        address buyer, 
        uint256 price,
        bool sold
    );

    /**
    * @dev Track the number of items in the market, and the number of items sold
    */
    using Counters for Counters.Counter;
    Counters.Counter private _identifier;
    Counters.Counter private _itemsSold;

    mapping(uint256 => Item) private _items;

    // Object sitcoin which Holds deployed token contract
    SITcoin public sitcoin;

    /** @dev Sets the contract ID of deployed contract into this contract through contructor.
     *  First deploy token contract and then deploy this contract.
     */
    constructor (address _sitcoin) {
        sitcoin = SITcoin(_sitcoin);
    }

    /**
    * @dev Creates a new item in the market.
    * @return The current token ID of the new item.
    */
    function createItem(string memory description, uint256 price) public returns(uint){
        // Price to be more than 0
        require(price > 0, "Price must be at least 1 SITC");
        // create new token ID
        _identifier.increment();
        uint256 currId = _identifier.current();

        // create new item mapped to token ID
        _items[currId] = Item (
            currId,
            description, 
            msg.sender, //seller
            address(0), //buyer
            price, //sitc tokens
            false //not sold
            );

        //TODO: If implementing NFT Market, transfer token to seller

        return currId;
    }
    function getItemCount() public view returns(uint){
        return _identifier.current();
    }
    function getSoldItemCount() public view returns(uint){
        return _itemsSold.current();
    }
    /**
    * @dev Show all unsold items in the market
    * @return array of all unsold items
    */
    function getUnsoldItems() public view returns (Item[] memory)
    {
        // Total item count
        uint itemCount = _identifier.current();
        // Items without buyer yet (unsold)
        uint unsoldItemCount = _identifier.current() - _itemsSold.current();
        // Temporary counter
        uint currIndex = 0;

        // Array to store all items, size of unsold items
        Item[] memory items = new Item[](unsoldItemCount);
        // Iterate through all items
        for (uint256 i = 1; i <= itemCount; i++)
        {
            // If item is not sold yet
            if (_items[i].buyer == address(0)){
                // Add item to array
                Item storage currItem = _items[i];
                items[currIndex] = currItem;
                // Increment counter
                currIndex++;
            }
        }
        return items;
    }

    /**
    * @dev Show all listed items in the market
    * @return array of all items
    */
    function getAllItems() public view returns (Item[] memory)
    {
        // Total item count
        uint itemCount = _identifier.current();
        // Temporary counter
        uint currIndex = 0;

        // Array to store all items, size of all items
        Item[] memory items = new Item[](itemCount);
        // Iterate through all items
        for (uint256 i = 1; i <= itemCount; i++)
        {
            // Add item to array
            Item storage currItem = _items[i];
            items[currIndex] = currItem;
            // Increment counter
            currIndex++;
        }
        return items;
    }

    /**
    * @dev Check if specific item exists in the market
    * @param _itemId id of the item to check
    * @return true if item exists, false otherwise
    */
    function checkItemExist(
        uint256 _itemId
    ) public view returns (bool)
    {
        // Item id cannot be below 0
        require(_itemId > 0, "Item index must be greater than 0");
        // Get the item at the index
        Item storage currItem = _items[_itemId];
        // If item exists, by checking for valid seller address
        return (currItem.seller != address(0));
    }

    /**
    * @dev Get specific item details
    * @return Object of selected item
    */
    function getItem (
        uint256 _itemId
    ) public view returns (Item memory)
    {
        // Item id cannot be below 0
        require(_itemId > 0, "Item index must be greater than 0");
        require(checkItemExist(_itemId), "Item does not exist");
        // Get the item at the index
        Item storage currItem = _items[_itemId];
        return currItem;
    }
    /**
    * @dev Seller can remove/unlist unsold item(s) from the market 
    */
    function unlistItem(uint256 _itemId) external returns (bool){
        // Item id cannot be below 0
        require(_itemId > 0, "Item index must be greater than 0");
        // Get the item object at the index
        Item storage currItem = _items[_itemId];

        require(currItem.seller != address(0), "Item does not exist");
        require(currItem.seller == msg.sender, "Only the seller can unlist an item");
        require(!currItem.sold, "Item is already sold");

        // Set item to unlisted, set values to default
        delete _items[_itemId];
        
        if (_items[_itemId].seller == address(0)) {
            return true;
        }else {return false;}
    }
    /**
    * @dev Buy items from the market
    */
    function purchaseItem(uint256 _itemId) external returns (bool success){
        // Item id cannot be below 0
        require(_itemId > 0, "Item index must be greater than 0");
        // Get the item object at the index
        Item storage currItem = _items[_itemId];
        // Check if item exists
        require(currItem.seller != address(0), "Item does not exist");
        // Check if item is sold
        require(!currItem.sold, "Item is already sold");
        // Check if item price is less than balance of function callee address
        require(currItem.price <= sitcoin.balanceOf(msg.sender), "Insufficient balance");

        //TODO: Take note if the token has been transferred from seller to buyer correctly
        if (sitcoin.transfer(currItem.seller, currItem.price)){
            // Set item to sold
            _items[_itemId].sold = true;
            // Increment number of items sold
            _itemsSold.increment();
            // Set item buyer to function callee address
            _items[_itemId].buyer = msg.sender;
            success = true;
        }else {success = false;}
        return success;
    }
}