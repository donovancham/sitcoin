// SPDX-License-Identifier: MIT
pragma solidity >=0.5.1 <=0.8.6;

import "./SITcoin.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Market {
    /**
    * @dev Properties of the items in the market.
    */
    struct Item{
        //uint256 tokenId;
        //address owner;
        string description;
        address seller;
        address buyer;
        uint256 price;
        bool sold;
    }

    /**
    * @dev Track the number of items in the market, and the number of items sold
    */
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
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
        _tokenIds.increment();
        uint256 currId = _tokenIds.current();

        // create new item mapped to token ID
        _items[currId] = Item (
            description, 
            msg.sender, //owner
            address(0), //buyer
            price, 
            false
            );

        //TODO: If implementing NFT Market, transfer token to seller

        return currId;
    }

    /**
    * @dev Show all unsold items in the market
    * @return array of all unsold items
    */
    function fetchUnsoldItems() public view returns (Item[] memory)
    {
        // Total item count
        uint itemCount = _tokenIds.current();
        // Items without buyer yet (unsold)
        uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
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
    function fetchAllItems() public view returns (Item[] memory)
    {
        // Total item count
        uint itemCount = _tokenIds.current();
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
    * @param _itemId tokenId of the item to check
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
    * @dev Seller can remove/unlist unsold item(s) from the market 
    */
    function unlistItem(uint256 _itemId) external {
        // Item id cannot be below 0
        require(_itemId > 0, "Item index must be greater than 0");
        // Get the item object at the index
        Item storage currItem = _items[_itemId];
        // Check if item exists
        require(currItem.seller != address(0), "Item does not exist");
        // If item exists, check if function callee address is the seller 
        require(currItem.seller == msg.sender, "Only the seller can unlist an item");
        // Check if item is sold
        require(!currItem.sold, "Item is already sold");
        // Set item to unlisted
        _items[_itemId].seller = address(0);
        delete _items[_itemId];
    }
}