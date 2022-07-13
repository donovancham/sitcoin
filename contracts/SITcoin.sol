// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title SIT Coin Smart Contract
/// @author Donovan Cham
/// @notice PRC-20 implementation of the SIT Coin token
/// @dev Implemented access control using openzeppelin's `AccessControl` 
/// library. This implementation allows supply on demand by allowing 
/// more tokens to be minted as demand increases. The minting of tokens 
/// can only be done calling the `mint()` function from a privileged 
/// address with the 'MINTER' role. 
/// 
/// PRC-20 is fully compatible with ERC-20 so `ERC20` base contract
/// passes PRC-20 token standards.
///
contract SITcoin is ERC20, ERC20Burnable, AccessControl, ERC20Permit {
    // Creates a unique role hash to identify minters
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev Emitted when `value` tokens are minted into the existing 
    /// supply pool.
    event Mint(address indexed minter, uint256 value);

    /// @notice Initialize token contract
    /// @dev Constructor inherits from ERC20 base. Mints initial supply
    /// according to specification.
    /// @param initialSupply The initial supply of the token
    constructor(uint256 initialSupply) ERC20("SIT Coin", "SITC") ERC20Permit("SIT Coin") {
        // Setup permissions for the contract
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        // Give owner all tokens from initial supply
        _mint(_msgSender(), initialSupply);
    }

    /// @notice Returns the number of decimals of the token
    /// @dev Override the existing implementation of 18 decimals ($ETH default)  
    /// for SIT Coin tokenomics proposal of 0 decimals for easier reading.
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

    function grantMinterRole(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, _account);
    }

    function revokeMinterRole(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        // Ensure that account has MINTER_ROLE before executing
        require(hasRole(MINTER_ROLE, _account));
        revokeRole(MINTER_ROLE, _account);
    }
}



