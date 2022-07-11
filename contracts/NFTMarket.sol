// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./PRC721URIStorage.sol";
// for NFT
import {PRC721} from "./PRC721.sol";
// for Token transaction
//import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SITcoin} from "./SITcoin.sol";

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
        address author;
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
     * @dev To emit event when item is newly added onto the market
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
    /**
     * @dev To emit event when item is unlisted on the market
     */
    event MarketItemUnlisted(
        uint256 itemId,
        bool success
    );
    /**
     * @dev To emit event when transactional error occurs
    */
    event ErrorMsg(
        string errorMessage
    );

    // Track total no. of NFT in the market
    uint256 private MarketItemCount;
    // Track total no. of NFT sold on the market
    uint256 private MarketItemSold;
    // Track total no. of NFT unlisted on the market
    uint256 private unlistedItemCount;

    SITcoin internal sitcoin;
    // Track total no. of NFT minted
    uint256 private NFTCount;

    // tokenId -> NFT
    mapping(uint256 => NFT) public mintedNFTs;
    // itemId -> Market
    mapping(uint256 => Market) public _marketItems;

    /** 
     * @dev Sets the token properties and stores the SITCoin instance
     * @param _sitcoin Address of SITcoin contract
     * First deploy token contract and then deploy this contract.
     */
    constructor(address _sitcoin) PRC721("SITC NFT", "SITC") {
        // receiverAcc = payable(msg.sender);
        // feePercent = _feePercent;
        sitcoin = SITcoin(_sitcoin);
    }

    /**
     * @dev Mint a new NFT
     * @param title Title of the NFT.
     * @param description Description of the NFT.
     * @param authorName Creator of NFT
     * @param _tokenURI Link to the digital asset
     * @param _price Price of the NFT
     * @return The id of the item created.
     */
    function mint(
        string memory title,
        string memory description,
        string memory authorName,
        string memory _tokenURI, 
        uint256 _price
    ) 
        external returns (uint256) 
    {
        if (_price > 0){
            NFTCount++;
            // _safemint -> _mint -> Mapping owner address to token count, 
            // Mapping from token ID to owner address
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
        emit ErrorMsg("Price must be greater than 0");
        return (0);
    }

    /**
    * @dev Check if wallet address (user) is owner of a particular NFT
    * @param tokenId The token ID of the NFT to be checked
    * @param account The account number to check against
    * @return True if the user owns the NFT, false otherwise
    */
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

    /**
     * @dev Get the symbol of the token
     * @return token symbol
     */
    function getSymbol() external view returns (string memory) {
        return symbol(); // SITC
    }

    /**
     * @dev Get the name of the token
     * @return token name
     */
    function getName() external view returns (string memory) {
        return name(); //SITC NFT
    }

    /**
     * @dev Check if a specific NFT is minted or not
     * @return true if the NFT is minted else false
     */
    function checkNFTExist(uint256 _tokenId) internal view returns (bool) {
        // Item id cannot be below 0
        if (_tokenId > 0 && mintedNFTs[_tokenId].author != address(0)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Get the total number of NFT owned (minted and bought) by the user
     * @return _myNFTs Number of NFTs the user owns
     * @return count Number of NFTs the user owns
     */
    function myOwnedNFTs() external view returns (NFT[] memory _myNFTs, uint256 count)
    {
        require(msg.sender != address(0), "Invalid wallet address");
        uint256 numOftokens = balanceOf(msg.sender);
        if (numOftokens == 0) {
            return (new NFT[](0), 0);
        } 
        else {
            // Array to store all items, size of all items
            NFT[] memory NFTitems = new NFT[](numOftokens);

            uint256 currIndex = 0;
            uint256 totalTokens = NFTCount;
            for (uint256 i = 1; i <= totalTokens; i++) 
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

    /**
     * @dev Get the total number of NFT minted by user
     * @return count Number of NFTs the author created
     */
    function getMyCreationCount(address author) internal view returns (uint256 count) {
    
        uint256 currIndex = 0;
        for (uint256 i = 1; i <= NFTCount; i++) 
        {
            // Find the NFTs that belongs to the user
            if (mintedNFTs[i].author == author) {
                currIndex++;
            }
        }
        return currIndex;
    }

    /**
     * @dev Get all the NFT that is created by the author
     * @return _myNFTs NFTs created by the author
     * @return count Number of NFTs the author created
     */
    function getMyNFTCreations() external view returns (NFT[] memory _myNFTs, uint256 count)
    {
        require(msg.sender != address(0), "Invalid walletaddress");

        uint256 totalTokens = getMyCreationCount(msg.sender);
        if (totalTokens == 0) 
        {
            return (new NFT[](0), 0);
        } 
        else {
            // Array to store all items, size of all items
            NFT[] memory NFTitems = new NFT[](totalTokens);
            uint256 _NFTCount = NFTCount;
            uint256 currIndex = 0;
            
            for (uint256 i = 1; i <= _NFTCount; i++) 
            {
                // Find the NFTs that belongs to the user
                if (mintedNFTs[i].author == msg.sender) {
                    NFTitems[currIndex] = mintedNFTs[i];
                    currIndex++;
                }
            }
            return (NFTitems, totalTokens);
        }
    }

    /**
     * @dev Get total number of NFTs minted
     * @return Number of NFTs minted
     */
    function getTotalNFTCount() external view returns (uint256) {
        return NFTCount;
    }





    /**
     * @dev Add NFT into the market for purchase
     * @param _tokenId Token identifier number
     * @param _nft the address of current contract holding the nft
     */
    function createItem(uint256 _tokenId, PRC721 _nft) external nonReentrant 
    {
        if (checkNFTExist(_tokenId)) {
            // Otain NFT item for listing
            NFT storage NFTItem = mintedNFTs[_tokenId];
            // Ensure Item not sold or already published, and only author can put item up for sale
            if (NFTItem.sold == false && 
                NFTItem.published == false && 
                NFTItem.author == msg.sender && 
                NFTItem.owner == address(0)) 
            {

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
            }else{emit ErrorMsg("Item sold, published, or not owned by you");} 
        }else{emit ErrorMsg("Item does not exist");}      
    }

    /**
     * @dev Purchase NFT from the market
     * @return true if item is sold, false if otherwise
     */
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
            if (sitcoin.transferFrom(msg.sender, marketItem.seller, marketItem.price))
            {
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
            else {
                emit ErrorMsg("Not enough tokens");
                return false;
            }
        } else {
            emit ErrorMsg("Item does not exist or already sold");
            return false;
        }
    }

    /**
     * @dev Unpublish items on the market
     * @return true if item is successfully unlisted, false otherwise
     */
     function unlistItem(uint256 _itemId) external nonReentrant returns (bool)
     {
        // check if item is sold
        if (!marketItemExist(_itemId)){
            emit ErrorMsg("Item does not exist");
            return false;
        }
        Market storage marketItem = _marketItems[_itemId];

        // Check if msg.sender is the seller and if item is sold
        if (marketItem.seller != msg.sender || marketItem.sold){
            emit ErrorMsg("Only seller can unlist, or item is sold");
            return false;
        }
        else{
            // transfer NFT Ownership from market back to author/owner
            marketItem.nft.transferFrom(address(this), msg.sender, marketItem.tokenId);
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
                emit ErrorMsg("Item still on the market, unable to unlist");
                return false;
            }
        }
     }
     
    /**
     * @dev Get the address of current contract
     * @return Address of current contract
     */
    function getaddress() public view returns (address) {
        return address(this);
    }
    /** 
     * @dev Check if item exist in the market
     * @return true if item exist, false if not
     */
    function marketItemExist(uint256 _itemId) internal view returns (bool) {
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
     * @dev Get total number of items on the market, excluding unlisted items
     * @return Number of items on the market
     */
    function getTotalMarketItems() external view returns (uint256) {
        return MarketItemCount - unlistedItemCount;
    }

    /**
     * @dev Get the all items published on the market
     * @return allItems sll Market items
     * @return count number of Market items
     */
     function getAllMarketItems() public view returns (Market[] memory allItems, uint256 count) {
        // Total item count
        uint itemCount = MarketItemCount - unlistedItemCount;
        uint totalCount = MarketItemCount;
        // Temporary counter
        uint currIndex = 0;

        // Array to store all items, size of all items (unlisted items are not included)
        Market[] memory items = new Market[](itemCount);
        // Iterate through all items
        for (uint256 i = 1; i <= totalCount; i++)
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

    /**
     * @dev Get the all unsold items published on the market
     * @return unsold All unsold market items
     * @return count number of unsold Market items
     */
     function getUnsoldItems() public view returns (Market[] memory unsold, uint256 count){
        uint totalCount = MarketItemCount;
        uint unsoldItemCount = MarketItemCount - MarketItemSold - unlistedItemCount;
        uint currIndex = 0;

        Market[] memory unsoldItems = new Market[](unsoldItemCount);
        for (uint256 i = 1; i <= totalCount; i++)
        {
            if (_marketItems[i].sold == false && marketItemExist(i)) {
                Market storage currItem = _marketItems[i];
                unsoldItems[currIndex] = currItem;
                currIndex++;
            }
        }
        return (unsoldItems, unsoldItemCount);
     }

}
