// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Utilities
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract AccountManager is AccessControl {
    using Address for address;
    using Strings for uint256;
    using ECDSA for bytes32;

    // bytes4(keccak256("isValidSignature(bytes32,bytes)")
    // First 4 bytes of the function signature
    // bytes4 internal constant MAGICVALUE = 0x1626ba7e;
    // bytes4 internal constant FAILVALUE = 0xffffffff;

    // Role hashes for determining role
    bytes32 internal constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 internal constant STUDENT_ROLE = keccak256("STUDENT_ROLE");
    bytes32 internal constant PUBLIC_ROLE = keccak256("PUBLIC_ROLE");

    struct Account {
        // Wallet Identity information
        address payable _address;
        uint8 _role; // 1 = MGR, 2 = STU, 3 = PUB
        bytes _signature;
        string _claimUri;
        string _profileUri;     // Profile information
    }

    // Claim struct from ERC-735 (Non-compatible with ERC725v2)
    struct Claim {
        uint256 claimType; 
        uint256 scheme; // ECDSA: 1
        address issuer; // msg.sender
        bytes signature; // this.address + claimType + data
        bytes data; // Meaningful data (IPFS hash of proof info)
        string uri; // Location of the claim (IPFS hash)
    }

    mapping(bytes32 => Account) accounts;
    address[] private accountStore;
    bytes32 private secretKey;

    // TODO Implement message signing function
    // TODO Implement unique ID generation to prevent crashes
    // TODO Implement checks to ensure each user only have 1 claim assigned
    // TODO Implement nonces to prevent replay attacks

    constructor(bytes32 _seed) {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MANAGER_ROLE, msg.sender);

        // Generate key used for signing
        // Combine random seed with contract owner address
        secretKey = keccak256(abi.encodePacked(msg.sender, _seed));

        // Create an account for the owner
    }

    modifier onlyManager() {
        require(hasRole(MANAGER_ROLE, msg.sender), "Permission denied");
        _;
    }

    // TODO Function to register (store data)
    function register() public returns (bool val) {
        // accountStore[msg.sender] = Account(msg.sender, PUBLIC_ROLE, false, );
    }
}
