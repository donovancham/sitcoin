# `ClaimVerifier`

# Functions:

- [`constructor(address _trustedClaimHolder)`](#ClaimVerifier-constructor-address-)

- [`checkClaim(contract ClaimHolder _identity, uint256 claimType)`](#ClaimVerifier-checkClaim-contract-ClaimHolder-uint256-)

- [`claimIsValid(contract ClaimHolder _identity, uint256 claimType)`](#ClaimVerifier-claimIsValid-contract-ClaimHolder-uint256-)

- [`getRecoveredAddress(bytes sig, bytes32 dataHash)`](#ClaimVerifier-getRecoveredAddress-bytes-bytes32-)

## constructor

<br>

```sol

function constructor(

) public

```

No description

## checkClaim

<br>

```sol

function checkClaim(

) public returns (bool claimValid)

```

No description

## claimIsValid

<br>

```sol

function claimIsValid(

) public returns (bool claimValid)

```

No description

## getRecoveredAddress

<br>

```sol

function getRecoveredAddress(

) public returns (address addr)

```

No description

# Events:

- [`ClaimValid(contract ClaimHolder _identity, uint256 claimType)`](#ClaimVerifier-ClaimValid-contract-ClaimHolder-uint256-)

- [`ClaimInvalid(contract ClaimHolder _identity, uint256 claimType)`](#ClaimVerifier-ClaimInvalid-contract-ClaimHolder-uint256-)

## ClaimValid

<br>

```sol

ClaimValid(contract ClaimHolder _identity, uint256 claimType)

```

No description

## ClaimInvalid

<br>

```sol

ClaimInvalid(contract ClaimHolder _identity, uint256 claimType)

```

No description
