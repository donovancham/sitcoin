// SPDX-License-Identifier: MIT
// https://github.com/trustfractal/erc725/blob/master/contracts/KeyHolder.sol
pragma solidity ^0.8.0;

import {ERC725} from "./interfaces/ERC725.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ERC725v1 Key Holder Contract
/// @notice Creates an identity that can hold and manage keys
/// @dev Keys created can be used to sign actions or claims. There are 4 types of keys:
/// - `1` = MANAGEMENT
/// - `2` = ACTION
/// - `3` = CLAIM
/// - `4` = ENCRYPTION
/// Keys are byte32 hashed using the `keccak256()` function.
contract KeyHolder is ERC725, Ownable {
    mapping(bytes32 => Key) keys;
    mapping(uint256 => bytes32[]) keysByPurpose;

    /// @dev Initializes the contract by giving the owner of the identity a `MANAGEMENT` key, which is a proof of administration for the identity.
    constructor() {
        bytes32 _key = keccak256(abi.encodePacked(msg.sender));
        keys[_key].key = _key;
        keys[_key].purpose = 1;
        keys[_key].keyType = 1;
        keysByPurpose[1].push(_key);
        emit KeyAdded(_key, keys[_key].purpose, 1);
    }

    /// @dev Retrieves the key at the mapped position.
    /// @param _key The key to be retrieved
    /// @return purpose The purpose of the key retrieved.
    /// @return keyType The type of the key retrieved.
    /// @return key The mapping position of the key retrieved. (Same as param passed in)
    function getKey(bytes32 _key)
        public
        view
        override
        onlyOwner
        returns (
            uint256 purpose,
            uint256 keyType,
            bytes32 key
        )
    {
        return (keys[_key].purpose, keys[_key].keyType, keys[_key].key);
    }

    /// @dev Gets purpose of the key requested.
    /// @param _key The key to be retrieved.
    /// @return purpose The purpose of the key retrieved.
    function getKeyPurpose(bytes32 _key)
        public
        view
        onlyOwner
        returns (uint256 purpose)
    {
        return (keys[_key].purpose);
    }

    /// @dev Gets the keys of `_purpose` that the identity owns.
    /// @param _purpose The purpose to filter and retrieve the keys.
    /// @return _keys The set of keys that have this `_purpose`.
    function getKeysByPurpose(uint256 _purpose)
        public
        view
        override
        onlyOwner
        returns (bytes32[] memory _keys)
    {
        return keysByPurpose[_purpose];
    }

    /// @dev Adds a new key to the identity contract.
    /// @param _key The hash of the key to be added.
    /// @param _purpose The purpose of the key.
    /// @param _type The type of the key.
    /// @return success True if successful.
    function addKey(
        bytes32 _key,
        uint256 _purpose,
        uint256 _type
    ) public override onlyOwner returns (bool success) {
        require(keys[_key].key != _key, "Key already exists"); // Key should not already exist
        if (msg.sender != address(this)) {
            require(
                keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1),
                "Sender does not have management key"
            ); // Sender has MANAGEMENT_KEY
        }

        keys[_key].key = _key;
        keys[_key].purpose = _purpose;
        keys[_key].keyType = _type;

        keysByPurpose[_purpose].push(_key);

        emit KeyAdded(_key, _purpose, _type);

        return true;
    }

    /// @dev Removes a key from the identity contract.
    /// @param _key The key to be removed.
    /// @return success True if successful.
    function removeKey(bytes32 _key) public override onlyOwner returns (bool success) {
        require(keys[_key].key == _key, "No such key");
        emit KeyRemoved(keys[_key].key, keys[_key].purpose, keys[_key].keyType);

        /* uint index;
        (index,) = keysByPurpose[keys[_key].purpose.indexOf(_key);
        keysByPurpose[keys[_key].purpose.removeByIndex(index); */

        delete keys[_key];

        return true;
    }

    /// @dev Checks if the key requested has the `purpose` property according to what is requested.
    /// @param _key The key to be checked.
    /// @param _purpose The purpose of the key.
    /// @return result True if successful.
    function keyHasPurpose(bytes32 _key, uint256 _purpose)
        public
        view
        override
        returns (bool result)
    {
        // bool isThere;
        if (keys[_key].key == 0) return false;
        // isThere = keys[_key].purpose <= _purpose;
        // return isThere;
        return keys[_key].purpose <= _purpose;
    }
}
