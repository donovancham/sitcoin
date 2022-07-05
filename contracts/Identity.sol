// https://github.com/lukso-network/lsp-smart-contracts/blob/main/contracts/LSP0ERC725Account/LSP0ERC725Account.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LSP0ERC725Account } from "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0ERC725Account.sol";

contract Identity is LSP0ERC725Account {
    constructor(address _newOwner) LSP0ERC725Account(_newOwner) {
        
    }
}