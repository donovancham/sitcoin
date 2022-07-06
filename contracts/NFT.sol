// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC721/ERC721.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public counter;
    constructor() ERC721("SITC NFT", "SITC"){}
    function mint(string memory _tokenURI) external returns(uint){
        counter++;
        // _safemint -> _mint -> Mapping owner address to token count, Mapping from token ID to owner address
        _safeMint(msg.sender, counter);
        // maps token ID to token URI
        _setTokenURI(counter, _tokenURI);
        
        return(counter);
    }
}