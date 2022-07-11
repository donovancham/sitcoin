// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {SITcoin} from "./SITcoin.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Market is ReentrancyGuard {
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

    // Generate notification
    event ItemCreated (
        uint256 indexed id, 
        string description, 
        address seller, 
        address buyer, 
        uint256 price,
        bool sold
    );
    event ItemUnlisted (
        uint256 indexed id,
        bool success
    );
    event ItemPurchased (
        uint256 indexed id,
        address buyer,
        uint256 price,
        bool success
    );
    event ErrorMsg(
        string errorMessage
    );

    /**
     * @dev Track the number of items in the market, and the number of items sold
     */
    using Counters for Counters.Counter;
    Counters.Counter private _identifier;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsUnlisted;
    // itemId -> Ttem
    mapping(uint256 => Item) private _items;

    // Object sitcoin which Holds deployed token contract
    SITcoin internal sitcoin;

    /** 
     * @dev Sets the SITCoin instance
     *  First deploy token contract and then deploy this contract.
     */
    constructor (address _sitcoin) {
        sitcoin = SITcoin(_sitcoin);
    }

    /**
     * @dev Creates a new item in the market.
     * @return The current token ID of the new item.
     */
    function createItem(string memory description, uint256 price) external nonReentrant returns(uint){
        // Price to be more than 0
        if(price > 0){
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
            emit ItemCreated(currId,description,msg.sender,address(0),price,false);
            return currId;
        } else {
            emit ErrorMsg("Price must be greater than 0");
            return 0;
        }
    }

    /**
     * @dev Seller can remove/unlist unsold item(s) from the market 
     */
    function unlistItem(uint256 _itemId) external returns (bool){

        if (!checkItemExist(_itemId)){
            emit ErrorMsg("Item does not exist");
            return false;
        }
        Item storage currItem = _items[_itemId];
        if (currItem.seller != msg.sender || currItem.sold){
            emit ErrorMsg("Item does not belong to you or already sold");
            return false;
        }
        else{
            // Set item to unlisted, set values to default
            delete _items[_itemId];
            // return true;
            if (_items[_itemId].seller == address(0)) {
                emit ItemUnlisted(_itemId, true);
                _itemsUnlisted.increment();
                return true;
            }
            else {
                emit ErrorMsg("Item is not unlisted");
                return false;
            }
        }
    }

    /**
     * @dev Buy items from the market
     *
     */
    function purchaseItem(uint256 _itemId) external nonReentrant returns (bool) {
        // // Item id cannot be below 0
        if (!checkItemExist(_itemId))
        {
            emit ErrorMsg("Item does not exist");
            return false;
        }
        else {
            // Get the item object at the index
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
    }





    /**
     * @dev Get specific item details
     * @return Object of selected item
     */
    function getItem (
        uint256 _itemId
    ) external view returns (Item memory)
    {
        require(checkItemExist(_itemId), "Item does not exist");
        // Get the item at the index
        Item storage currItem = _items[_itemId];
        return currItem;
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
        if(_itemId > 0){
            // Get the item at the index
            Item storage currItem = _items[_itemId];
            // If item exists, by checking for valid seller address
            return (currItem.seller != address(0));
        }
        else{
            return false;
        }
    }
    /**
     * @dev Shows the count of items in the market (includes sold, unlisted and listed items)
     * @return total count
     */
    function getItemCount() public view returns(uint){
        return _identifier.current();
    }
    
    /**
     * @dev Show all the count of sold items in the market.
     * @return count of sold items
     */
    function getSoldItemCount() public view returns(uint){
        return _itemsSold.current();
    }

    /**
     * @dev Show all unsold items in the market
     * @return array of all unsold items
     */
    function getUnsoldItems() external view returns (Item[] memory)
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
     * @dev Show all listed items in the market
     * @return array of all items
     */
    function getAllItems() external view returns (Item[] memory)
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
     * @return address of current contract
     */
     function getaddress() public view returns (address) {
        return address(this);
    }
}