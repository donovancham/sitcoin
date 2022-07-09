// SPDX-License-Identifier: MIT

//TODO: move nft and market tgt, burn nft remove from nft and market array

/**
 * @dev Mint the NFT first and list it on the market.
 */
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./PRC721URIStorage.sol";
// for NFT
import {PRC721} from "./PRC721.sol";
// for Token transaction
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SITcoin.sol";

contract NFTMarket is ReentrancyGuard, PRC721URIStorage {
    /**
     * @dev To track minted NFTs
     */
    struct NFT {
        uint256 tokenId; //id of NFT in PRC721
        string title;
        string description;
        uint256 price;
        string authorName;
        address seller;
        address owner;
        bool sold;
        bool published; //on market
        string uri;
    }
    /**
     * @dev To track published items on the market
     */ 
    struct Market {
        uint256 itemId; //id of item on the market
        string title;
        uint256 tokenId;
        uint256 price;
        address seller;
        bool sold;
        PRC721 nft;
    }
    /**
     * @dev To emit event when item is published on the market
     */
    event NFTListed(
        uint256 itemId, //id of item on the market
        string title,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );
    /**
     * @dev To emit event when item is sold on the market
     */
    event NFTPurchased(
        uint256 itemId,  //id of item on the market
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );

    event MarketItemUnlisted(
        uint256 itemId,
        bool success
    );

    // Track total no. of NFT in the market
    uint256 public MarketItemCount;
    uint256 public MarketItemSold;
    uint256 public unlistedItemCount;

    // TODO: Change to SITCoin?
    ERC20 public sitcoin;

    // Track total no. of NFT minted
    uint256 public NFTCount;

    // tokenId -> NFT
    mapping(uint256 => NFT) public mintedNFTs;
    // itemId -> Market
    mapping(uint256 => Market) public _marketItems;

    constructor(address _sitcoin) PRC721("SITC NFT", "SITC") {
        // receiverAcc = payable(msg.sender);
        // feePercent = _feePercent;
        sitcoin = ERC20(_sitcoin);
    }

    function mint(
        string memory title,
        string memory description,
        string memory authorName,
        string memory _tokenURI, 
        uint256 _price
    ) 
        external returns (uint256) 
    {
        require(_price > 0, "Price must be greater than 0");
        NFTCount++;
        // _safemint -> _mint -> Mapping owner address to token count, Mapping from token ID to owner address
        _safeMint(msg.sender, NFTCount);
        // maps token ID to token URI
        _setTokenURI(NFTCount, _tokenURI);

        // TODO: Allow user to set private/public item
        mintedNFTs[NFTCount] = NFT (
            NFTCount,
            title,
            description,
            _price,
            authorName,
            msg.sender, //author address
            address(0), //owner address
            false, //sold
            false, //published
            _tokenURI
        );


        return (NFTCount);
    }

    /* return true if the address is the owner of the token or else false */
    function isOwnerOf(uint256 tokenId, address account)
        public
        view
        returns (bool)
    {
        address owner = ownerOf(tokenId);
        if (owner != address(0)) {
            return owner == account;
        } else {
            return false;
        }
    }
    function getSymbol() public view returns (string memory) {
        return symbol(); // SITC
    }
    function getName() public view returns (string memory) {
        return name(); //SITC NFT
    }
    function checkNFTExist(uint256 _tokenId) private view returns (bool) {
        // Item id cannot be below 0
        if (_tokenId > 0 && mintedNFTs[_tokenId].seller != address(0)) {
            return true;
        } else {
            return false;
        }
    }

    function getMyNFTs() public view returns (NFT[] memory _myNFTs, uint256 count)
    {
        require(msg.sender != address(0), "Invalid walletaddress");
        uint256 numOftokens = balanceOf(msg.sender);
        if (numOftokens == 0) {
            return (new NFT[](0), 0);
        } 
        else {
            // Array to store all items, size of all items
            NFT[] memory NFTitems = new NFT[](numOftokens);

            uint256 currIndex = 0;
            uint256 totalTokens = NFTCount;
            for (uint256 i = 1; i < totalTokens; i++) 
            {
                // Find the NFTs that belongs to the user
                if (ownerOf(i) == msg.sender) {
                    NFTitems[currIndex] = mintedNFTs[i];
                    currIndex++;
                }
            }
            return (NFTitems, numOftokens);
        }
    }



    //TODO: Market - Set public or private
    /**
     * @dev Add NFT into the market for purchase
     * @param _tokenId Token identifier number
     */
    function createItem(uint256 _tokenId, PRC721 _nft) external nonReentrant 
    {
        if (checkNFTExist(_tokenId)) {
            // Otain NFT item for listing
            NFT storage NFTItem = mintedNFTs[_tokenId];
            // Ensure Item not sold or already published
            if (NFTItem.sold == false && NFTItem.published == false) {

                MarketItemCount++;
            
                // Transfer ownership of NFT from seller to market
                // Call setApprovalForAll() before this to allow the market contract to sell the NFT
                transferFrom(msg.sender, address(this), _tokenId); //from, to, tokenId

                mintedNFTs[_tokenId].published = true;

                _marketItems[MarketItemCount] = Market (
                    MarketItemCount,
                    NFTItem.title,
                    NFTItem.tokenId,
                    NFTItem.price,
                    msg.sender,
                    false,
                    _nft
                );

                emit NFTListed(
                    MarketItemCount, //itemId
                    NFTItem.title,
                    NFTItem.tokenId,
                    NFTItem.price, //price
                    msg.sender //seller
                );
            }
            
        }
    }

    function purchaseItem(uint256 _itemId)
        external
        nonReentrant
        returns (bool)
    {
        // Check if item for purchase exist on the market
        Market storage marketItem = _marketItems[_itemId];
        if (marketItem.seller != address(0) && marketItem.sold == false) {
            // Get the published item on the market
            // TODO: call increaseAllowance() before this
            sitcoin.transferFrom(msg.sender, marketItem.seller, marketItem.price);

            // // transfer NFT Ownership from contract to buyer
            marketItem.nft.transferFrom(address(this), msg.sender, marketItem.tokenId);

            // Update item in market to sold
            _marketItems[_itemId].sold = true;

            // Update NFT item to sold, and new owner of NFT
            mintedNFTs[marketItem.tokenId].owner = msg.sender;
            mintedNFTs[marketItem.tokenId].sold = true;

            MarketItemSold++;
            emit NFTPurchased(
                _itemId, //itemId
                marketItem.tokenId, //nft ID
                marketItem.price, //price
                marketItem.seller, //seller
                msg.sender //buyer
            );

            return true;
        } 
        return false;
    }

    function getaddress() public view returns (address) {
        return address(this);
    }
    /** 
     * @dev Check if item exist in the market
     */
    function marketItemExist(uint256 _itemId) public view returns (bool) {
        // Item id cannot be below 0
        if (_itemId > 0) {
            // Get the item at the index
            Market storage marketItem = _marketItems[_itemId];
            if (marketItem.seller != address(0)) {
                return true;
            } 
            return false; // item does not exist
        } 
        return false; // item does not exist
    }
    /**
     * @dev Get the item from the market
     */
     function getAllMarketItems() public view returns (Market[] memory allItems, uint256 count) {
        // Total item count
        uint itemCount = MarketItemCount - unlistedItemCount;
        // Temporary counter
        uint currIndex = 0;

        // Array to store all items, size of all items (unlisted items are not included)
        Market[] memory items = new Market[](itemCount);
        // Iterate through all items
        for (uint256 i = 1; i <= MarketItemCount; i++)
        {
            // If not unlisted item, add to array
            if (marketItemExist(i)) {
                // Add item to array
                Market storage currItem = _marketItems[i];
                items[currIndex] = currItem;
                currIndex++;
            }
        }
        return (items, currIndex+1);
     }

     function getUnsoldItems() public view returns (Market[] memory unsold, uint256 count){
        uint itemCount = MarketItemCount;
        uint unsoldItemCount = MarketItemCount - MarketItemSold - unlistedItemCount;
        uint currIndex = 0;

        Market[] memory unsoldItems = new Market[](unsoldItemCount);
        for (uint256 i = 1; i <= itemCount; i++)
        {
            if (_marketItems[i].sold == false && marketItemExist(i)) {
                Market storage currItem = _marketItems[i];
                unsoldItems[currIndex] = currItem;
                currIndex++;
            }
        }
        return (unsoldItems, unsoldItemCount);
     }

     function unlistItem(uint256 _itemId) external nonReentrant returns (bool)
     {
        // check if item is sold
        if (!marketItemExist(_itemId)){
            return false;
        }
        Market storage marketItem = _marketItems[_itemId];
        if (marketItem.seller != msg.sender || marketItem.sold){
            emit MarketItemUnlisted(_itemId, false);
            return false;
        }
        else{
            NFT storage NFTItem = mintedNFTs[marketItem.tokenId];
            NFTItem.published = false;
            // Deletes listing on Market but item still exists as NFT
            delete _marketItems[_itemId];
            if (!marketItemExist(_itemId)){
                unlistedItemCount++;
                emit MarketItemUnlisted(_itemId, true);
                return true;
            }
            else{
                emit MarketItemUnlisted(_itemId, false);
                return false;
            }
        }
     }

}
