// SPDX-License-Identifier: MIT
// https://github.com/ethereum/EIPs/issues/735
pragma solidity ^0.8.0;

/// @title ERC735: Claim Holder
/// @dev The following describes standard functions for adding, removing and holding of claims. These claims can attested from third parties (issuers) or self attested.
interface ERC735 {

    /// @dev COULD be triggered when addClaim was successfully called.
    /// @param claimRequestId The ID of the claim request.
    /// @param topic A `uint256` number which represents the topic of the claim. (e.g. 1 biometric, 2 residence...)
    /// @param scheme The scheme with which this claim SHOULD be verified or how it should be processed. Its a `uint256` for different schemes. E.g. could `3` mean contract verification, where the `data` will be call data, and the `issuer` a contract address to call (ToBeDefined). Those can also mean different key types e.g. 1 = ECDSA, 2 = RSA, etc. 
    /// @param issuer The issuers identity contract address, or the address used to sign the above signature. If an identity contract, it should hold the key with which the above message was signed, if the key is not present anymore, the claim SHOULD be treated as invalid. The issuer can also be a contract address itself, at which the claim can be verified using the call `data`.
    /// @param signature Signature which is the proof that the claim issuer issued a claim of topic for this identity.
    /// @param data The hash of the claim data, sitting in another location, a bit-mask, call data, or actual data based on the claim scheme.
    /// @param uri The location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such.
    event ClaimRequested(uint256 indexed claimRequestId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);

    /// @dev MUST be triggered when a claim was successfully added.
    /// @param claimId The ID of the Claim.
    /// @param topic A `uint256` number which represents the topic of the claim. (e.g. 1 biometric, 2 residence...)
    /// @param scheme The scheme with which this claim SHOULD be verified or how it should be processed. Its a `uint256` for different schemes. E.g. could `3` mean contract verification, where the `data` will be call data, and the `issuer` a contract address to call (ToBeDefined). Those can also mean different key types e.g. 1 = ECDSA, 2 = RSA, etc. 
    /// @param issuer The issuers identity contract address, or the address used to sign the above signature. If an identity contract, it should hold the key with which the above message was signed, if the key is not present anymore, the claim SHOULD be treated as invalid. The issuer can also be a contract address itself, at which the claim can be verified using the call `data`.
    /// @param signature Signature which is the proof that the claim issuer issued a claim of topic for this identity.
    /// @param data The hash of the claim data, sitting in another location, a bit-mask, call data, or actual data based on the claim scheme.
    /// @param uri The location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such.
    event ClaimAdded(bytes32 indexed claimId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);

    /// @dev MUST be triggered when removeClaim was successfully called.
    /// @param claimId The ID of the Claim.
    /// @param topic A `uint256` number which represents the topic of the claim. (e.g. 1 biometric, 2 residence...)
    /// @param scheme The scheme with which this claim SHOULD be verified or how it should be processed. Its a `uint256` for different schemes. E.g. could `3` mean contract verification, where the `data` will be call data, and the `issuer` a contract address to call (ToBeDefined). Those can also mean different key types e.g. 1 = ECDSA, 2 = RSA, etc. 
    /// @param issuer The issuers identity contract address, or the address used to sign the above signature. If an identity contract, it should hold the key with which the above message was signed, if the key is not present anymore, the claim SHOULD be treated as invalid. The issuer can also be a contract address itself, at which the claim can be verified using the call `data`.
    /// @param signature Signature which is the proof that the claim issuer issued a claim of topic for this identity.
    /// @param data The hash of the claim data, sitting in another location, a bit-mask, call data, or actual data based on the claim scheme.
    /// @param uri The location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such.
    event ClaimRemoved(bytes32 indexed claimId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);

    /// @dev MUST be triggered when changeClaim was successfully called.
    /// @param claimId The ID of the Claim.
    /// @param topic A `uint256` number which represents the topic of the claim. (e.g. 1 biometric, 2 residence...)
    /// @param scheme The scheme with which this claim SHOULD be verified or how it should be processed. Its a `uint256` for different schemes. E.g. could `3` mean contract verification, where the `data` will be call data, and the `issuer` a contract address to call (ToBeDefined). Those can also mean different key types e.g. 1 = ECDSA, 2 = RSA, etc. 
    /// @param issuer The issuers identity contract address, or the address used to sign the above signature. If an identity contract, it should hold the key with which the above message was signed, if the key is not present anymore, the claim SHOULD be treated as invalid. The issuer can also be a contract address itself, at which the claim can be verified using the call `data`.
    /// @param signature Signature which is the proof that the claim issuer issued a claim of topic for this identity.
    /// @param data The hash of the claim data, sitting in another location, a bit-mask, call data, or actual data based on the claim scheme.
    /// @param uri The location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such.
    event ClaimChanged(bytes32 indexed claimId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);

    /// @dev The claims issued to the identity. Returns the claim properties.
    /// @param topic A `uint256` number which represents the topic of the claim. (e.g. 1 biometric, 2 residence...)
    /// @param scheme The scheme with which this claim SHOULD be verified or how it should be processed. Its a `uint256` for different schemes. E.g. could `3` mean contract verification, where the `data` will be call data, and the `issuer` a contract address to call (ToBeDefined). Those can also mean different key types e.g. 1 = ECDSA, 2 = RSA, etc. 
    /// @param issuer The issuers identity contract address, or the address used to sign the above signature. If an identity contract, it should hold the key with which the above message was signed, if the key is not present anymore, the claim SHOULD be treated as invalid. The issuer can also be a contract address itself, at which the claim can be verified using the call `data`.
    /// @param signature Signature which is the proof that the claim issuer issued a claim of topic for this identity.
    /// @param data The hash of the claim data, sitting in another location, a bit-mask, call data, or actual data based on the claim scheme.
    /// @param uri The location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such.
    struct Claim {
        uint256 topic;      // Numeric ID for claims
        uint256 scheme;     // ECDSA: 1
        address issuer;     // msg.sender
        bytes signature;    // this.address + topic + data
        bytes data;         // Meaningful data (IPFS hash of proof info)
        string uri;         // Location of the claim (IPFS hash)
    }

    /// @dev Returns a claim by ID.
    /// @param _claimId The ID of the Claim.
    /// @return topic A `uint256` number which represents the topic of the claim. (e.g. 1 biometric, 2 residence...)
    /// @return scheme The scheme with which this claim SHOULD be verified or how it should be processed. Its a `uint256` for different schemes. E.g. could `3` mean contract verification, where the `data` will be call data, and the `issuer` a contract address to call (ToBeDefined). Those can also mean different key types e.g. 1 = ECDSA, 2 = RSA, etc. 
    /// @return issuer The issuers identity contract address, or the address used to sign the above signature. If an identity contract, it should hold the key with which the above message was signed, if the key is not present anymore, the claim SHOULD be treated as invalid. The issuer can also be a contract address itself, at which the claim can be verified using the call `data`.
    /// @return signature Signature which is the proof that the claim issuer issued a claim of topic for this identity.
    /// @return data The hash of the claim data, sitting in another location, a bit-mask, call data, or actual data based on the claim scheme.
    /// @return uri The location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such.
    function getClaim(bytes32 _claimId) external view returns(uint256 topic, uint256 scheme, address issuer, bytes memory signature, bytes memory data, string memory uri);

    /// @dev Returns an array of claim IDs by topic.
    /// @param _topic The topic of the Claims to get.
    /// @return claimIds The `byte32` array of the Claims.
    function getClaimIdsByTopic(uint256 _topic) external view returns(bytes32[] memory claimIds);

    /// @dev Requests the ADDITION or the CHANGE of a claim from an `issuer`. 
    /// @param _topic A `uint256` number which represents the topic of the claim. (e.g. 1 biometric, 2 residence...)
    /// @param _scheme The scheme with which this claim SHOULD be verified or how it should be processed. Its a `uint256` for different schemes. E.g. could `3` mean contract verification, where the `data` will be call data, and the `issuer` a contract address to call (ToBeDefined). Those can also mean different key types e.g. 1 = ECDSA, 2 = RSA, etc. 
    /// @param _issuer The issuers identity contract address, or the address used to sign the above signature. If an identity contract, it should hold the key with which the above message was signed, if the key is not present anymore, the claim SHOULD be treated as invalid. The issuer can also be a contract address itself, at which the claim can be verified using the call `data`.
    /// @param _signature Signature which is the proof that the claim issuer issued a claim of topic for this identity. `_signature` is a signed message of the following structure: keccak256(address identityHolder_address, uint256 topic, bytes data).
    /// @param _data The hash of the claim data, sitting in another location, a bit-mask, call data, or actual data based on the claim scheme.
    /// @param _uri The location of the claim, this can be HTTP links, swarm hashes, IPFS hashes, and such.
    /// @return claimRequestId COULD be send to the `approve` function, to approve or reject this claim.
    function addClaim(uint256 _topic, uint256 _scheme, address _issuer, bytes memory _signature, bytes memory _data, string memory _uri) external returns (bytes32 claimRequestId);

    /// @dev Removes a claim.
    /// @param _claimId The ID of the Claim to be removed.
    /// @return success `TRUE` if successful.
    function removeClaim(bytes32 _claimId) external returns (bool success);
}