// SPDX-License-Identifier: MIT
// https://github.com/trustfractal/erc725/blob/master/contracts/ClaimVerifier.sol
pragma solidity ^0.8.0;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {ClaimHolder} from "./ClaimHolder.sol";

/// @title Claim Verifier System Contract
/// @notice An interface to verify claims from identity with the valid signers
/// @dev Interface can be deployed and called as an arbitrary validator in web3 dApp or deployed together with another contract to verify identities and use as access control measure.
contract ClaimVerifier {
    using ECDSA for bytes32;

    /// @dev Emits when valid claim is verified.
    /// @param _identity The identity holding the claim to be verified.
    /// @param claimType The type of claim being verified.
    event ClaimValid(ClaimHolder _identity, uint256 claimType);

    /// @dev Emits when invalid claim is attempted to be verified.
    /// @param _identity The identity holding the claim to be verified.
    /// @param claimType The type of claim being verified.
    event ClaimInvalid(ClaimHolder _identity, uint256 claimType);

    ClaimHolder public trustedClaimHolder;

    /// @dev Initializes with only one valid signer.
    /// @param _trustedClaimHolder The contract address of the valid claim holder identity contract.
    constructor(address _trustedClaimHolder) {
        trustedClaimHolder = ClaimHolder(_trustedClaimHolder);
    }

    /// @dev Ensures that the claim is valid.
    /// @param _identity The identity requesting verification.
    /// @param claimType The type of claim to be verified.
    /// @return claimValid True if valid.
    function checkClaim(ClaimHolder _identity, uint256 claimType)
        public
        returns (bool claimValid)
    {
        if (claimIsValid(_identity, claimType)) {
            emit ClaimValid(_identity, claimType);
            return true;
        } else {
            emit ClaimInvalid(_identity, claimType);
            return false;
        }
    }

    /// @dev Internal function that runs when `checkClaim()` is called.
    /// @param _identity The identity requesting verification.
    /// @param claimType The type of claim to be verified.
    /// @return claimValid True if valid.
    function claimIsValid(ClaimHolder _identity, uint256 claimType)
        internal
        view
        returns (bool claimValid)
    {
        uint256 foundClaimType;
        uint256 scheme;
        address issuer;
        bytes memory sig;
        bytes memory data;

        // Construct claimId (identifier + claim type)
        bytes32 claimId = keccak256(abi.encodePacked(trustedClaimHolder, claimType));

        // Fetch claim from user
        (foundClaimType, scheme, issuer, sig, data, ) = _identity.getClaim(
            claimId
        );

        bytes32 dataHash = keccak256(abi.encodePacked(_identity, claimType, data));
        // bytes32 prefixedHash = keccak256(
        //   abi.encodePacked("\x19Ethereum Signed Message:\n32",
        //     dataHash)
        // );
        bytes32 prefixedHash = dataHash.toEthSignedMessageHash();

        // Recover address of data signer
        // address recovered = getRecoveredAddress(sig, prefixedHash);
        address recovered = prefixedHash.recover(sig);

        // Take hash of recovered address
        bytes32 hashedAddr = keccak256(abi.encodePacked(recovered));

        // Does the trusted identifier have they key which signed the user's claim?
        return trustedClaimHolder.keyHasPurpose(hashedAddr, 3);
    }

    // function getRecoveredAddress(bytes memory sig, bytes32 dataHash)
    //     public
    //     pure
    //     returns (address addr)
    // {
    //     bytes32 ra;
    //     bytes32 sa;
    //     uint8 va;

    //     // Check the signature length
    //     if (sig.length != 65) {
    //         return address(0);
    //     }

    //     // Divide the signature in r, s and v variables
    //     assembly {
    //         ra := mload(add(sig, 32))
    //         sa := mload(add(sig, 64))
    //         va := byte(0, mload(add(sig, 96)))
    //     }

    //     if (va < 27) {
    //         va += 27;
    //     }

    //     address recoveredAddress = ecrecover(dataHash, va, ra, sa);

    //     return (recoveredAddress);
    // }
}
