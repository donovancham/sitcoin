// SPDX-License-Identifier: MIT
// https://github.com/ethereum/EIPs/blob/ede8c26a77eb1ac8fa2d01d8743a8cf259d8d45b/EIPS/eip-725.md
pragma solidity ^0.8.0;

/// @title ERC725v1: Proxy Identity
/// @dev The following describes standard functions for a unique identity for humans, groups, objects and machines. This identity can hold keys to sign actions (transactions, documents, logins, access, etc), and claims, which are attested from third parties (issuers) and self attested ([#ERC735](https://github.com/ethereum/EIPs/issues/735)), as well as a proxy function to act directly on the blockchain.
interface ERC725 {

    // uint256 constant MANAGEMENT_KEY = 1;
    // uint256 constant ACTION_KEY = 2;
    // uint256 constant CLAIM_SIGNER_KEY = 3;
    // uint256 constant ENCRYPTION_KEY = 4;

    /// @dev MUST be triggered when `addKey` was successfully called.
    /// @param key The ID of the Key.
    /// @param purpose The purpose of the Key.
    /// @param keyType The type of the Key.
    event KeyAdded(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);

    /// @dev MUST be triggered when `removeKey` was successfully called.
    /// @param key The ID of the Key.
    /// @param purpose The purpose of the Key.
    /// @param keyType The type of the Key.
    event KeyRemoved(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);

    /// @dev Keys are cryptographic public keys, or contract addresses associated with this identity.
    /// @param purpose `uint256[]` Array of the key types, like 1 = MANAGEMENT, 2 = ACTION, 3 = CLAIM, 4 = ENCRYPTION
    /// @param keyType The type of key used, which would be a uint256 for different key types. e.g. 1 = ECDSA, 2 = RSA, etc.
    /// @param key `bytes32` The public key. (for non-hex and long keys, its the Keccak256 hash of the key)
    struct Key {
        uint256 purpose; //e.g., MANAGEMENT_KEY = 1, ACTION_KEY = 2, etc.
        uint256 keyType; // e.g. 1 = ECDSA, 2 = RSA, etc.
        bytes32 key;
    }

    /// @dev Returns the full key data, if present in the identity.
    /// @param _key The ID of the Key.
    /// @param purpose The purpose of the Key.
    /// @param keyType The type of the Key.
    /// @param key The ID of the Key.
    function getKey(bytes32 _key) external view returns(uint256 purpose, uint256 keyType, bytes32 key);

    /// @dev Returns the `TRUE` if a key has is present and has the given purpose. If key is not present it returns `FALSE`.
    /// @param _key The ID of the Key.
    /// @param purpose The purpose of the Key.
    /// @return exists `TRUE` if a key has is present, `FALSE` if not.
    function keyHasPurpose(bytes32 _key, uint256 purpose) external view returns(bool exists);

    /// @dev Returns an array of public key bytes32 hold by this identity.
    /// @param _purpose The purpose of the Key.
    /// @return keys The `byte32` array of keys with the requested purpose.
    function getKeysByPurpose(uint256 _purpose) external view returns(bytes32[] memory keys);

    /// @dev Adds a `_key` to the identity. The `_purpose` specifies the purpose of key.
    /// @param _key The ID of the Key.
    /// @param _purpose The purpose of the Key.
    /// @param _keyType The type of the Key.
    /// @return success `TRUE` if successful.
    function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) external returns (bool success);

    /// @dev Removes `_key` from the identity.
    /// @param _key The ID of the Key.
    /// @param success `TRUE` if successful.
    function removeKey(bytes32 _key) external returns (bool success);
}