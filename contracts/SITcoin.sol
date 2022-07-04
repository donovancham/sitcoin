// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @title SIT Coin Smart Contract
/// @author Donovan Cham
/// @notice PRC-20 implementation of the SIT Coin token
/// @dev Implemented access control using openzeppelin's `Ownable` library.
/// This implementation allows supply on demand by allowing more tokens to
/// be minted as demand increases. The minting of tokens is done only by  
/// the owner of this contract. 
/// 
/// PRC-20 is fully compatible with ERC-20 so `ERC20` base contract
/// passes PRC-20 token standards.
///
contract SITcoin is ERC20, Ownable {

    /// @notice Initialize token contract
    /// @dev Constructor inherits from ERC20 base. Mints initial supply
    /// according to specification.
    /// @param initialSupply The initial supply of the token
    constructor(uint256 initialSupply) ERC20("SIT Coin", "SITC") {
        // Give owner all tokens from initial supply
        _mint(_msgSender(), initialSupply);
    }

    /// @notice Returns the number of decimals of the token
    /// @dev Override the existing implementation of 18 decimals for SIT Coin 
    /// tokenomics proposal of 0 decimals for easier reading.
    /// @return uint8 The number of decimals used to get its user representation. 
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    /// @notice Increases token supply
    /// @dev Only minters are allowed to increase supply
    /// @param to The address where the minted tokens are sent
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) public onlyOwner() {
        _mint(to, amount);
    }
}



