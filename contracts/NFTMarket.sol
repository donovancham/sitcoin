// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./SITcoin.sol";

contract NFTMarket is ReentrancyGuard {

    address payable public immutable receiverAcc;
    uint public immutable feePercent;
    uint public itemCount;

    /**
     * @dev Properties of the items in the market.
     */
    struct Item{
        uint256 itemId;
        //address owner;
        ERC721 nft; //INSTANCE OF NFT Contract associated with the NFT
        uint tokenId;
        //string description;
        address payable seller;
        //address buyer;
        uint256 price;
        bool sold;
    }

    // itemID -> Ttem
    mapping (uint256 => Item) public _items;

    event Listed(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint256 price,
        address indexed seller
    );

    constructor (uint _feePercent) {
        receiverAcc = payable(msg.sender);
        feePercent = _feePercent;
    }

    /**
     * @dev Creates a new item in the market.
     * @param _nft The description of the item.
     * @param _tokenId The price of the item.
     * @param _price The price of the item.
     */
     function createItem (ERC721 _nft, uint _tokenId, uint256 _price) external nonReentrant {
        require(_price > 0, "Price must be greater than 0");
        itemCount++;

        // address(this) referring to the address of the contract instance
        _nft.transferFrom(msg.sender, address(this), _tokenId); //from, to, tokenId
        
        // map itemId -> Item
        _items[itemCount] = Item(
            itemCount, 
            _nft,
             _tokenId, 
             payable(msg.sender), 
             _price, 
             false
        );
        emit Listed(itemCount, address(_nft), _tokenId, _price, msg.sender);
     }
     function getTotalPrice(uint _itemId) view public returns (uint) {
        return((_items[_itemId].price*(100 + feePercent)) / 100);
     }
     function purchaseItem (uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = _items[_itemId];

        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        require(msg.value >= _totalPrice, "Insufficient funds");
        require(!item.sold, "Item is already sold");

        // This transfers LAT to account of the seller
        // TODO: Change it to token only, using transferFrom()
        item.seller.transfer(item.price);
     }
}