// https://github.com/lukso-network/lsp-smart-contracts/blob/main/contracts/LSP6KeyManager/LSP6KeyManager.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LSP6KeyManager } from "@lukso/lsp-smart-contracts/contracts/LSP6KeyManager/LSP6KeyManager.sol";

contract KeyManager is LSP6KeyManager {
    constructor(address _newOwner) LSP6KeyManager(_newOwner) {
        
    }
}