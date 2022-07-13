// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";


/// @title SIT Coin Smart Contract
/// @author Donovan Cham
/// @notice PRC-20 implementation of the SIT Coin token
/// @dev ERC20 token implemented with controlled supply that allows minting and burning of tokens. This token is designed to be deployed on the PlatON blockchain, which requires compatibility with the `PRC20` fungible token standard. `PRC20` is fully compatible with `ERC20` so openzeppelin's `ERC20` implementation can be used to provide standard `ERC20` functional implemnetations without any conflicts.
/// Implemented access control using openzeppelin's `AccessControl` library. This implementation allows supply on demand by allowing more tokens to be minted as demand increases. The minting of tokens can only be done calling the `mint()` function from a privileged address with the 'MINTER' role. 
/// 
///
contract SITcoin is ERC20, ERC20Burnable, AccessControl {
    // Creates a unique role hash to identify minters
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Event to indicate that tokens were minted
    /// @dev Emitted when `value` tokens are minted into the existing supply pool by `minter`.
    /// @param minter The address of the privileged `MINTER_ROLE` that called the contract.
    /// @param amount The amount of tokens minted.
    event Mint(address indexed minter, uint256 amount);

    /// @notice Initialize token contract
    /// @dev Constructor inherits from ERC20 base. Mints initial supply according to specification.
    /// @param initialSupply The initial supply of the token
    constructor(uint256 initialSupply) ERC20("SIT Coin", "SITC") {
        // Setup permissions for the contract
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        // Give owner all tokens from initial supply
        _mint(_msgSender(), initialSupply);
    }

    /// @notice Returns the number of decimals of the token
    /// @dev Override the existing implementation of 18 decimals _(`$ETH` default)_ for SIT Coin tokenomics proposal of 0 decimals. This allows for greater readability when calling functions that get the amount of tokens.
    /// @return uint8 The number of decimals used to get its user representation. 
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    /// @notice Increases token supply
    /// @dev Only minters are allowed to increase supply
    /// @param to The address where the minted tokens are sent
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        emit Mint(_msgSender(), amount);
    }
    
    /// @notice Grants permission to mint
    /// @dev Gives an `account` permission to mint tokens. Can only be called by the contract owner.
    /// @param _account The account to grant minting permissions
    function grantMinterRole(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, _account);
    }

    /// @notice Revokes permission to mint
    /// @dev Revokes an `account` permission to mint tokens. Can only be called by the contract owner. The `_account` being called must have an existing privileged minter role.
    /// @param _account The account to revoke minting permissions
    function revokeMinterRole(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        // Ensure that account has MINTER_ROLE before executing
        require(hasRole(MINTER_ROLE, _account));
        revokeRole(MINTER_ROLE, _account);
    }
}



