// SPDX-License-Identifier: MIT
// https://github.com/trustfractal/erc725/blob/master/contracts/ClaimHolder.sol
pragma solidity ^0.8.0;

import {ERC735} from "./interfaces/ERC735.sol";
import {KeyHolder} from "./KeyHolder.sol";

/// @title Claim Holder Identity Contract
/// @notice Digital Identity for users
/// @dev Implements [ERC725v1](https://github.com/ethereum/EIPs/blob/ede8c26a77eb1ac8fa2d01d8743a8cf259d8d45b/EIPS/eip-725.md) standard for implementing a blockchain identity. It also implements a blockchain identity with key management capabilities to manage its claim and credentials. [ERC735](https://github.com/ethereum/EIPs/issues/735) Claim holder is the standard for managing claims.
/// Deploying this contract will allow users to manage their identity by interacting with the contract.
contract ClaimHolder is KeyHolder, ERC735 {
    mapping(bytes32 => Claim) claims;
    mapping(uint256 => bytes32[]) claimsByType;

    /// @dev Adds a claim to the claim holder.
    /// @param _topic The numeric ID indicating the topic of the claim.
    /// @param _scheme The encryption scheme.
    /// @param _issuer The issuer of the claim.
    /// @param _signature The signature from the issuer.
    /// @param _data The data appended to the claim that is used prove the signature of the signer.
    /// @param _uri The location of the claim information.
    /// @return claimRequestId The ID of the claim that was created.
    function addClaim(
        uint256 _topic,
        uint256 _scheme,
        address _issuer,
        bytes memory _signature,
        bytes memory _data,
        string memory _uri
    ) public onlyOwner override returns (bytes32 claimRequestId) {
        bytes32 claimId = keccak256(abi.encodePacked(_issuer, _topic));

        if (msg.sender != address(this)) {
            require(
                keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 3),
                "Sender does not have claim signer key"
            );
        }

        if (claims[claimId].issuer != _issuer) {
            claimsByType[_topic].push(claimId);
        }

        claims[claimId].topic = _topic;
        claims[claimId].scheme = _scheme;
        claims[claimId].issuer = _issuer;
        claims[claimId].signature = _signature;
        claims[claimId].data = _data;
        claims[claimId].uri = _uri;

        emit ClaimAdded(
            claimId,
            _topic,
            _scheme,
            _issuer,
            _signature,
            _data,
            _uri
        );

        return claimId;
    }

    /// @dev Removes a claim from the identity contract.
    /// @param _claimId The ID of the claim.
    /// @return success True if successful.
    function removeClaim(bytes32 _claimId)
        public
        onlyOwner
        override
        returns (bool success)
    {
        if (msg.sender != address(this)) {
            require(
                keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1),
                "Sender does not have management key"
            );
        }

        /* uint index; */
        /* (index, ) = claimsByType[claims[_claimId].topic].indexOf(_claimId);
        claimsByType[claims[_claimId].topic].removeByIndex(index); */

        emit ClaimRemoved(
            _claimId,
            claims[_claimId].topic,
            claims[_claimId].scheme,
            claims[_claimId].issuer,
            claims[_claimId].signature,
            claims[_claimId].data,
            claims[_claimId].uri
        );

        delete claims[_claimId];
        return true;
    }

    /// @dev Get a claim from the identity contract.
    /// @param _claimId The ID of the claim.
    /// @return topic The numeric ID indicating the topic of the claim.
    /// @return scheme The encryption scheme.
    /// @return issuer The issuer of the claim.
    /// @return signature The signature from the issuer.
    /// @return data The data appended to the claim that is used prove the signature of the signer.
    /// @return uri The location of the claim information.
    function getClaim(bytes32 _claimId)
        public
        view
        override
        returns (
            uint256 topic,
            uint256 scheme,
            address issuer,
            bytes memory signature,
            bytes memory data,
            string memory uri
        )
    {
        return (
            claims[_claimId].topic,
            claims[_claimId].scheme,
            claims[_claimId].issuer,
            claims[_claimId].signature,
            claims[_claimId].data,
            claims[_claimId].uri
        );
    }

    /// @dev Gets a claim by the topic ID.
    /// @param _topic The topic ID of the claim.
    /// @return claimIds The IDs of the claims that match this topic ID for the identity contract.
    function getClaimIdsByTopic(uint256 _topic)
        public
        view
        onlyOwner
        override
        returns (bytes32[] memory claimIds)
    {
        return claimsByType[_topic];
    }
}
