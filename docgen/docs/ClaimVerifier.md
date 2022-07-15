# `ClaimVerifier`

Interface can be deployed and called as an arbitrary validator in web3 dApp or deployed together with another contract to verify identities and use as access control measure.

# Functions:

- [`constructor(address _trustedClaimHolder)`](#ClaimVerifier-constructor-address-)

- [`checkClaim(contract ClaimHolder _identity, uint256 claimType)`](#ClaimVerifier-checkClaim-contract-ClaimHolder-uint256-)

## constructor

<br>

```Solidity

function constructor(

  address _trustedClaimHolder

) public

```

Initializes with only one valid signer.

### Parameters:

- `_trustedClaimHolder`: The contract address of the valid claim holder identity contract.

## checkClaim

<br>

```Solidity

function checkClaim(

  contract ClaimHolder _identity,

  uint256 claimType

) public returns (bool claimValid)

```

Ensures that the claim is valid.

### Parameters:

- `_identity`: The identity requesting verification.

- `claimType`: The type of claim to be verified.

### Return Values:

- claimValid True if valid.

# Events:

- [`ClaimValid(contract ClaimHolder _identity, uint256 claimType)`](#ClaimVerifier-ClaimValid-contract-ClaimHolder-uint256-)

- [`ClaimInvalid(contract ClaimHolder _identity, uint256 claimType)`](#ClaimVerifier-ClaimInvalid-contract-ClaimHolder-uint256-)

## ClaimValid

<br>

```Solidity

ClaimValid(contract ClaimHolder _identity, uint256 claimType)

```

Emits when valid claim is verified.

### Parameters:

- `_identity`: The identity holding the claim to be verified.

- `claimType`: The type of claim being verified.

## ClaimInvalid

<br>

```Solidity

ClaimInvalid(contract ClaimHolder _identity, uint256 claimType)

```

Emits when invalid claim is attempted to be verified.

### Parameters:

- `_identity`: The identity holding the claim to be verified.

- `claimType`: The type of claim being verified.
