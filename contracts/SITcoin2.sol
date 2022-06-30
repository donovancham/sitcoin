pragma solidity >=0.5.1 <=0.8.6;

import "PRC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SITcoin
/// @notice SIT Coin Contract
/// @dev 
contract SITcoin is PRC20, Ownable {

    // Initialize contract
    constructor(uint256 initialSupply) ERC20("SIT Coin", "SITC") {
        _mint(msg.sender, initialSupply);
    }

    
}


