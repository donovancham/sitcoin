// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {SITcoin} from "./SITcoin.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Market Contract
/// @notice Creates a market where items can be traded.
/// @dev The predecessor to the NFT Market. It serves as an initial draft to plan out the infrastructure to be used for the NFT Market contract.
contract Market is ReentrancyGuard {
    /// @dev Properties of the items in the market.
    /// @member id The identifier number of the item.
    /// @member description The item description.
    /// @member seller The address of the seller account.
    /// @member buyer The address of the buyer account if the item has been bought.
    /// @member price The price of the item.
    /// @member sold Indicates whether the item has been sold.
    struct Item{
        uint256 id;
        //address owner;
        string description;
        address seller;
        address buyer;
        uint256 price;
        bool sold;
    }

    /// @dev Event should be fired when an item is created.
    /// @param id The identifier number of the item.
    /// @param description The item description.
    /// @param price The price of the item.
    event ItemCreated (
        uint256 indexed id, 
        string description, 
        uint256 price
    );

    /// @dev Event should be fired when an item is attempted to be removed from listing.
    /// @param id The identifier number of the item.
    /// @param success Indicates whether the item is successfully unlisted.
    event ItemUnlisted (
        uint256 indexed id,
        bool success
    );

    /// @dev Event should be fired when an item is purchased
    /// @param id The identifier number of the item.
    /// @param buyer The address of the buyer account if the item has been bought.
    /// @param price The price of the item.
    /// @param success Indicates whether the item is successfully purchased.
    event ItemPurchased (
        uint256 indexed id,
        address buyer,
        uint256 price,
        bool success
    );

    /// @dev Event should be fired when an error has occurred
    /// @param errorMessage The error message that should be logged.
    event ErrorMsg(
        string errorMessage
    );

    // Track the number of items in the market, and the number of items sold
    using Counters for Counters.Counter;
    Counters.Counter private _identifier;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsUnlisted;
    // itemId -> Ttem
    mapping(uint256 => Item) private _items;

    // Object sitcoin which Holds deployed token contract
    SITcoin internal sitcoin;

    /// @dev Constructor that initializes the market contract. Requires the token contract to be initialized together.
    /// @param _sitcoin The address of the token contract to be used in the market.
    constructor (address _sitcoin) {
        sitcoin = SITcoin(_sitcoin);
    }

    /// @dev Creates a new item in the market.
    /// @param description The description of the new `item`.
    /// @param price The price of the new `item`.
    /// @return _id The current token ID of the new item.
    function createItem(string memory description, uint256 price) external nonReentrant returns(uint _id){
        // Price to be more than 0
        require(price > 0, "Price must be greater than 0");

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

        // Notification
        emit ItemCreated(currId, description, price);
        return currId;
    }

    /// @dev Seller can remove/unlist unsold item(s) from the market 
    /// @param _itemId The ID of the `item` to be unlisted.
    /// @return _success Indicates whether the item was successfully removed.
    function unlistItem(uint256 _itemId) external returns (bool _success){
        require(_itemId > 0, "Item ID must be greater than 0");
        require(checkItemExist(_itemId), "Item does not exist");

        Item storage currItem = _items[_itemId];
        require(currItem.sold == false, "Item is already sold");
        require(currItem.seller == msg.sender, "Only seller can unlist item");

        // Set item to unlisted, set values to default
        delete _items[_itemId];
        require(_items[_itemId].seller == address(0), "Item is not unlisted");
 
        emit ItemUnlisted(_itemId, true);
        _itemsUnlisted.increment();
        return true;
    }
    
    /// @dev Buy items from the market
    /// @param _itemId The ID of the `item` to be bought.
    /// @return _success Indicates whether the `item` is successfully bought.
    function purchaseItem(uint256 _itemId) external nonReentrant returns (bool _success) {
        // // Item id cannot be below 0
        require(_itemId > 0, "Item ID must be greater than 0");
        require(checkItemExist(_itemId), "Item does not exist");

        Item storage currItem = _items[_itemId];

        // Check if item is sold
        require(!currItem.sold, "Item is already sold");

        if (sitcoin.transferFrom(msg.sender, currItem.seller, currItem.price))
        {
            // Set item to sold
            _items[_itemId].sold = true;
            // Increment number of items sold
            _itemsSold.increment();
            // Set item buyer to function callee address
            _items[_itemId].buyer = msg.sender;
            emit ItemPurchased(_itemId, _items[_itemId].buyer, currItem.price, true);
            return true;
        }
        else 
        {
            emit ErrorMsg("Not enough tokens");
            return false;
        }

    }

    /// @dev Gets the information pertaining to an item.
    /// @param _itemId The ID of the `item` to retrieve the info from.
    /// @return _item The `item` object.
    function getItem (
        uint256 _itemId
    ) external view returns (Item memory _item)
    {
        require(checkItemExist(_itemId), "Item does not exist");
        // Get the item at the index
        Item storage currItem = _items[_itemId];
        return currItem;
    }

    /// @dev Check if specific item exists in the market
    /// @param _itemId id of the item to check.
    /// @return _success true if item exists, false otherwise.
    function checkItemExist(
        uint256 _itemId
    ) public view returns (bool _success)
    {
        // Item id cannot be below 0
        require(_itemId > 0, "Item ID must be greater than 0");

        // Get the item at the index
        Item storage currItem = _items[_itemId];
        // If item exists, by checking for valid seller address
        return (currItem.seller != address(0));
    }
    
    /// @dev Shows the count of items in the market (includes sold, unlisted and listed items)
    /// @return _totalItemCount The total number of items in the market.
    function getItemCount() public view returns(uint _totalItemCount){
        return _identifier.current() - _itemsUnlisted.current();
    }
    
    /**
     * @dev Show all the count of sold items in the market.
     * @return _soldItemCount count of sold items.
     */
    function getSoldItemCount() public view returns(uint _soldItemCount){
        return _itemsSold.current();
    }

    /**
     * @dev Show all unsold items in the market.
     * @return _unsoldItemArray array of all unsold items.
     */
    function getUnsoldItems() external view returns (Item[] memory _unsoldItemArray)
    {
        // Total item count
        uint itemCount = _identifier.current();
        // Items without buyer yet (unsold)
        uint unsoldItemCount = _identifier.current() - _itemsSold.current() - _itemsUnlisted.current();
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
     * @dev Show all listed items in the market.
     * @return _listedItemsArray array of all items.
     */
    function getAllItems() external view returns (Item[] memory _listedItemsArray)
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
     * @dev Get the current contract address
     * @return _contractAddress address of current contract
     */
     function getaddress() public view returns (address _contractAddress) {
        return address(this);
    }
}