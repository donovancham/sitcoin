// SPDX-License-Identifier: MIT
// https://github.com/masaun/NFT-auth-token/blob/master/contracts/NftAuthToken.sol
pragma solidity ^0.8.0;

import { PRC721 } from "./PRC721.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract AccessToken is PRC721, AccessControl {

    uint public currentAuthTokenId;

    // Create a new role identifier for user role
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    // Create minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() PRC721("SITM Access Token", "SAT") {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), 'No Minter Privilege. Access Denied.');
        _;
    }

    // @todo Come back after completing NFT pass implementation
    function promoteMinter(address account) public virtual {
        // Only DEFAULT_ADMIN_ROLE as caller can grant roles
        grantRole(MINTER_ROLE, account);
    }

    // @todo Come back after completing NFT pass implementation
    function demoteMinter(address account) public virtual {
        // Only DEFAULT_ADMIN_ROLE as caller can revoke roles
        revokeRole(MINTER_ROLE, account);
    }

    function mintAuthToken(
        address to, 
        string memory ipfsHash
    ) public onlyMinter() returns (uint _newAuthTokenId) {
        _newAuthTokenId = _mintAuthToken(to, ipfsHash);

        /// Grant an user who is minted the AuthToken the user-role
        _setupRole(USER_ROLE, to);

        return _newAuthTokenId;
    }

    function _mintAuthToken(address to, string memory ipfsHash) internal returns (uint _newAuthTokenId) {
        uint newAuthTokenId = getNextAuthTokenId();
        currentAuthTokenId++;
        _safeMint(to, newAuthTokenId);

        /// [Note]: Use ipfsHash as a password and metadata
        _setTokenURI(newAuthTokenId, ipfsHash);

        return newAuthTokenId;
    }

    /***
     * @notice Login with Auth Token
     **/
    function loginWithAuthToken(uint authTokenId, address userAddress, string memory ipfsHash) public view returns (bool _isAuth) {
        // Check whether a login user has role or not
        require(hasRole(USER_ROLE, userAddress), "Caller is not a user");

        // Convert each value (data-type are string) to hash in order to compare with each other 
        bytes32 hash1 = keccak256(abi.encodePacked(ipfsHash));
        bytes32 hash2 = keccak256(abi.encodePacked(tokenURI(authTokenId)));

        // Check if user owns token
        if (userAddress == ownerOf(authTokenId)) {
            // Ensure hash sent matches auth database
            if (hash1 == hash2) {
                return true;
            }
        }

        return false;
    }

    /***
     * @notice - Private function
     **/
    function getNextAuthTokenId() private view returns (uint nextAuthTokenId) {
        return currentAuthTokenId + 1;
    }

    // Override both to prevent conflicts
    // https://forum.openzeppelin.com/t/derived-contract-must-override-function-supportsinterface/6315/4
    function supportsInterface(bytes4 interfaceId) public view virtual override(PRC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}