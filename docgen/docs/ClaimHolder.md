# `ClaimHolder`

# Functions:

- [`addClaim(uint256 _topic, uint256 _scheme, address _issuer, bytes _signature, bytes _data, string _uri)`](#ClaimHolder-addClaim-uint256-uint256-address-bytes-bytes-string-)

- [`removeClaim(bytes32 _claimId)`](#ClaimHolder-removeClaim-bytes32-)

- [`getClaim(bytes32 _claimId)`](#ClaimHolder-getClaim-bytes32-)

- [`getClaimIdsByTopic(uint256 _topic)`](#ClaimHolder-getClaimIdsByTopic-uint256-)

## addClaim

<br>

```sol

function addClaim(

) public returns (bytes32 claimRequestId)

```

No description

## removeClaim

<br>

```sol

function removeClaim(

) public returns (bool success)

```

No description

## getClaim

<br>

```sol

function getClaim(

) public returns (uint256 topic, uint256 scheme, address issuer, bytes signature, bytes data, string uri)

```

No description

## getClaimIdsByTopic

<br>

```sol

function getClaimIdsByTopic(

) public returns (bytes32[] claimIds)

```

No description
