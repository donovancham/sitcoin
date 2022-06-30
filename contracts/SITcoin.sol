// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC20/ERC20.sol)
pragma solidity >=0.5.1 <=0.8.6;

import "./PRC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SITcoin
/// @dev 
contract SITcoin is PRC20, Ownable {

    /// @dev Sets the values for {name} and {symbol}.
    /// Update totalSupply with initially minted amount.
    constructor(uint256 initialSupply) PRC20("SIT Coin", "SITC") {
        _mint(msg.sender, initialSupply);
    }

}


