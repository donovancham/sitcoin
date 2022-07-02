// SPDX-License-Identifier: MIT
// https://github.com/masaun/NFT-auth-token/blob/master/contracts/NftAuthToken.sol
pragma solidity >=0.5.1 <=0.8.6;

import { PRC721 } from "./PRC721.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract AccessToken is PRC721, AccessControl {
    using SafeMath for uint;

    uint public currentAuthTokenId;

    // Create a new role identifier for user role
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    constructor() PRC721("SITM Access Token", "SAT") {

        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Override both to prevent conflicts
    // https://forum.openzeppelin.com/t/derived-contract-must-override-function-supportsinterface/6315/4
    function supportsInterface(bytes4 interfaceId) public view virtual override(PRC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mintAuthToken(address to, string memory ipfsHash) public returns (uint _newAuthTokenId) {
        _mintAuthToken(to, ipfsHash);

        /// Grant an user who is minted the AuthToken the user-role
        _setupRole(USER_ROLE, to);
    }

    function _mintAuthToken(address to, string memory ipfsHash) internal returns (uint _newAuthTokenId) {
        uint newAuthTokenId = getNextAuthTokenId();
        currentAuthTokenId++;
        _mint(to, newAuthTokenId);
        _setTokenURI(newAuthTokenId, ipfsHash);  /// [Note]: Use ipfsHash as a password and metadata
        //_setTokenURI(newAuthTokenId, authTokenURI); 

        return newAuthTokenId;
    }
}