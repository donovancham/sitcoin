// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
// for NFT
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// for Token transaction
//import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SITcoin} from "./SITcoin.sol";

contract NFTMarket is ReentrancyGuard, ERC721URIStorage, ERC721Holder {
    /**
     * @dev To track minted NFTs and items on the market.
     */
    struct NFT {
        uint256 tokenId; //id of NFT in PRC721
        string description;
        //string description;
        uint256 price;
        address author;
        address seller;
        address owner;
        bool sold;
        bool published; //on market
        string uri;
        ERC721 nft;
    }

    /**
     * @dev To emit event when item is newly added onto the market.
     */
    event NFTListed(
        uint256 itemId, //id of item on the market
        string title,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );
    /**
     * @dev To emit event when item is sold on the market.
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

    /** 
     * @dev Sets the token properties and stores the SITCoin instance
     * @param _sitcoin Address of SITcoin contract
     * First deploy token contract and then deploy this contract.
     */
    constructor(address _sitcoin) ERC721("SITC NFT", "SITC") {
        sitcoin = SITcoin(_sitcoin);
    }

    /**
     * @dev Mint a new NFT
     * @param description Description of the NFT.
     * @param _tokenURI Link to the digital asset
     * @param _price Price of the NFT
     * @return The id of the item created.
     */
    function mint(
        string memory description,
        string memory _tokenURI, 
        uint256 _price,
        ERC721 _nft
    ) 
        external returns (uint256) 
    {
        require(_price > 0, 'The price have to be more than 0');
        require(bytes(description).length > 0, 'The description cannot be empty');
        require(bytes(_tokenURI).length > 0, 'The tokenURI cannot be empty');
        
        NFTCount++;
        // _safemint -> _mint -> Mapping owner address to token count, 
        // Mapping from token ID to owner address
        _safeMint(msg.sender, NFTCount);
        // maps token ID to token URI
        _setTokenURI(NFTCount, _tokenURI);

        
        
        mintedNFTs[NFTCount] = NFT (
            NFTCount,
            description,
            _price,
            msg.sender, //author address
            address(0), //seller address
            address(0), //owner address
            false, //sold
            false, //published
            _tokenURI,
            _nft
        );
        return (NFTCount);
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
        require(msg.sender != address(0), "Invalid wallet address");

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
     */
    function createItem(uint256 _tokenId) external nonReentrant 
    {
        require(checkNFTExist(_tokenId), "NFT does not exist");

        NFT storage NFTItem = mintedNFTs[_tokenId];

        require(NFTItem.sold == false, "NFT is already sold");
        require(NFTItem.published == false, "NFT is already published");
        require(NFTItem.author == msg.sender, "You are not the author of this NFT");
        require(NFTItem.owner == address(0), "NFT is already owned");

        MarketItemCount++;
        mintedNFTs[_tokenId].published = true;
        mintedNFTs[_tokenId].seller = msg.sender;
        // Transfer ownership of NFT from seller to market
        // Call setApprovalForAll() before this to allow the market contract to sell the NFT
        NFTItem.nft.safeTransferFrom(msg.sender, address(this), _tokenId); //from, to, tokenId

        emit NFTListed(
            MarketItemCount, //itemId
            NFTItem.description, //description
            NFTItem.tokenId,
            NFTItem.price, //price
            msg.sender //seller
        );   
    }

    /**
     * @dev Purchase NFT from the market
     * @return true if item is sold, false if otherwise
     */
    function purchaseItem(uint256 _tokenId)
        external
        nonReentrant
        returns (bool)
    {
        // Check if item for purchase exist on the market
        NFT storage marketItem = mintedNFTs[_tokenId];

        require(marketItem.published == true, "Item is not published");
        require(marketItem.sold == false, "Item is already sold");
        require(marketItem.seller != msg.sender, "You are the seller of this Item");
        require(marketItem.seller != address(0), "Item does not exist");

        mintedNFTs[_tokenId].sold = true;
        // Update NFT item to sold, and new owner of NFT
        mintedNFTs[_tokenId].owner = msg.sender;

        // TODO: call increaseAllowance() before this
        if (sitcoin.transferFrom(msg.sender, marketItem.seller, marketItem.price))
        {
            
            // // transfer NFT Ownership from contract to buyer
            marketItem.nft.safeTransferFrom(address(this), msg.sender, marketItem.tokenId);

            MarketItemSold++;
            emit NFTPurchased(
                _tokenId, //tokenid
                marketItem.tokenId, //nft ID
                marketItem.price, //price
                marketItem.seller, //seller
                msg.sender //buyer
            );
            return true;
        }
        emit ErrorMsg("Error: token transfer failed");
        return false;
    }

    /**
     * @dev Unpublish items on the market
     * @return true if item is successfully unlisted, false otherwise
     */
     function unlistItem(uint256 _tokenId) external nonReentrant returns (bool)
     {
        // check if item exist on the market
        require(marketItemExist(_tokenId), "Item does not exist");

        NFT storage NFTItem = mintedNFTs[_tokenId];
        require(NFTItem.seller == msg.sender, "You are not the seller of this Item");
        require(NFTItem.sold == false, "Item is already sold");
        
        NFTItem.published = false;

        // transfer NFT Ownership from market back to author/owner
        NFTItem.nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        
        // Deletes listing on Market but item still exists as NFT
        if (!marketItemExist(_tokenId) && isOwnerOf(_tokenId, msg.sender) == true){
            MarketItemCount--;
            emit MarketItemUnlisted(_tokenId, true);
            return true;
        }
        else{
            emit ErrorMsg("Item still on the market, unable to unlist");
            return false;
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
    function marketItemExist(uint256 _tokenId) internal view returns (bool) {
        // Item id cannot be below 0
        if (_tokenId > 0) {
            // Get the item at the index
            NFT storage marketItem = mintedNFTs[_tokenId];
            if (marketItem.seller != address(0) && marketItem.published == true) {
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
     function getAllMarketItems() public view returns (NFT[] memory allItems, uint256 count) {
        // Total item count
        uint itemCount = MarketItemCount;
        uint totalCount = NFTCount;
        // Temporary counter
        uint currIndex = 0;

        // Array to store all items, size of all items (unlisted items are not included)
        NFT[] memory items = new NFT[](itemCount);
        // Iterate through all items
        for (uint256 i = 1; i <= totalCount; i++)
        {
            // If not unlisted item, add to array
            if (marketItemExist(i)) {
                // Add item to array
                NFT storage currItem = mintedNFTs[i];
                items[currIndex] = currItem;
                currIndex++;
            }
        }
        return (items, itemCount);
     }

    /**
     * @dev Get the all unsold items published on the market
     * @return unsold All unsold market items
     * @return count number of unsold Market items
     */
     function getUnsoldItems() public view returns (NFT[] memory unsold, uint256 count){
        uint totalCount = NFTCount;
        uint unsoldItemCount = MarketItemCount - MarketItemSold;
        uint currIndex = 0;

        NFT[] memory unsoldItems = new NFT[](unsoldItemCount);
        for (uint256 i = 1; i <= totalCount; i++)

        {   NFT storage currItem = mintedNFTs[i];

            if (currItem.sold == false && marketItemExist(i)) {
                unsoldItems[currIndex] = currItem;
                currIndex++;
            }
        }
        return (unsoldItems, unsoldItemCount);
     }

}
