// SPDX-License-Identifier: MIT
// https://github.com/trustfractal/erc725/blob/master/contracts/ClaimHolder.sol
pragma solidity ^0.8.0;

import {ERC735} from "./ERC735.sol";
import {KeyHolder} from "./KeyHolder.sol";

contract ClaimHolder is KeyHolder, ERC735 {
    mapping(bytes32 => Claim) claims;
    mapping(uint256 => bytes32[]) claimsByType;

    function addClaim(
        uint256 _topic,
        uint256 _scheme,
        address _issuer,
        bytes memory _signature,
        bytes memory _data,
        string memory _uri
    ) public override returns (bytes32 claimRequestId) {
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

    function removeClaim(bytes32 _claimId) public override returns (bool success) {
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

    function getClaimIdsByTopic(uint256 _topic)
        public
        view
        override
        returns (bytes32[] memory claimIds)
    {
        return claimsByType[_topic];
    }
}
