// SPDX-License-Identifier: MIT
/**
 * @dev Mint the NFT first and list it on the market.
 */
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// for NFT
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// for Token transaction
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SITcoin.sol";

contract NFTMarket is ReentrancyGuard {
    /**
     * @dev Properties of the items in the market.
     */
    struct Item{
        uint256 itemId;
        //address owner;
        ERC721 nft; //INSTANCE OF NFT Contract associated with the NFT
        uint tokenId;
        //string description;
        address seller;
        //address buyer;
        uint256 price;
        bool sold;
    }

    event NFTListed
    (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint256 price,
        address indexed seller
    );

    event NFTPurchased(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );
    
    // address payable public immutable receiverAcc;
    // uint public immutable feePercent;
    uint public itemCount;
     // Object sitcoin which Holds deployed token contract
    ERC20 public sitcoin;

    // itemId -> Ttem
    mapping (uint256 => Item) public _items;
    constructor (address _sitcoin) {
        // receiverAcc = payable(msg.sender);
        // feePercent = _feePercent;
        sitcoin = ERC20(_sitcoin);
    }

    /**
     * @dev Creates a new item in the market.
     * @param _nft Instance of the NFT contract
     * @param _tokenId Token identifier number
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
            msg.sender, 
            _price, 
            false
        );

        emit NFTListed(
            itemCount, 
            address(_nft), 
            _tokenId, 
            _price, 
            msg.sender
        );
     }
  
     function purchaseItem (uint _itemId) external payable nonReentrant {
        //uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = _items[_itemId];

        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        //require(msg.value >= _totalPrice, "Insufficient funds");
        require(!item.sold, "Item is already sold");

        // TODO: call increaseAllowance() before this
        sitcoin.transferFrom(msg.sender, item.seller, item.price);

        // transfer nft instance from contract to buyer 
        // TODO: call setApprovalForAll() before this 
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        emit NFTPurchased(
            _itemId, 
            address(item.nft), 
            item.tokenId, 
            item.price,
            item.seller, 
            msg.sender
        );
     }
     function getaddress() public view returns(address) {
        return address(this);
     }
}