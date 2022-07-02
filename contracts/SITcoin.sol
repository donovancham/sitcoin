// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PRC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title SITcoin
/// @dev 
contract SITcoin is PRC20, AccessControl {
    // Create a new role identifier for the minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev Sets the values for {name} and {symbol}.
    /// Update totalSupply with initially minted amount.
    constructor(uint256 initialSupply) PRC20("SIT Coin", "SITC") {
        _mint(msg.sender, initialSupply);

        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), 'No Minter Privilege. Access Denied.');
        _;
    }

    /// @dev Increases token supply by minting more tokens
    /// @param to The address where the minted tokens are sent
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) public onlyMinter() {
        _mint(to, amount);
    }

    // @todo Come back after completing NFT pass implementation
    function grantMinter(address account) public virtual {
        // Only DEFAULT_ADMIN_ROLE as caller can grant roles
        grantRole(MINTER_ROLE, account);
    }

    // @todo Come back after completing NFT pass implementation
    function revokeMinter(address account) public virtual {
        // Only DEFAULT_ADMIN_ROLE as caller can revoke roles
        revokeRole(MINTER_ROLE, account);
    }
}



