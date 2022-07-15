# `ClaimHolder`

Implements [ERC725v1](https://github.com/ethereum/EIPs/blob/ede8c26a77eb1ac8fa2d01d8743a8cf259d8d45b/EIPS/eip-725.md) standard for implementing a blockchain identity. It also implements a blockchain identity with key management capabilities to manage its claim and credentials. [ERC735](https://github.com/ethereum/EIPs/issues/735) Claim holder is the standard for managing claims. 
Deploying this contract will allow users to manage their identity by interacting with the contract.


# Functions:
- [`addClaim(uint256 _topic, uint256 _scheme, address _issuer, bytes _signature, bytes _data, string _uri)`](#ClaimHolder-addClaim-uint256-uint256-address-bytes-bytes-string-)
- [`removeClaim(bytes32 _claimId)`](#ClaimHolder-removeClaim-bytes32-)
- [`getClaim(bytes32 _claimId)`](#ClaimHolder-getClaim-bytes32-)
- [`getClaimIdsByTopic(uint256 _topic)`](#ClaimHolder-getClaimIdsByTopic-uint256-)

## addClaim
<br>
```Solidity
function addClaim(
  uint256 _topic,
  uint256 _scheme,
  address _issuer,
  bytes _signature,
  bytes _data,
  string _uri
) public returns (bytes32 claimRequestId)
```

Adds a claim to the claim holder.

### Parameters:
- `_topic`: The numeric ID indicating the topic of the claim.

- `_scheme`: The encryption scheme.

- `_issuer`: The issuer of the claim.

- `_signature`: The signature from the issuer.

- `_data`: The data appended to the claim that is used prove the signature of the signer.

- `_uri`: The location of the claim information.

### Return Values:
- claimRequestId The ID of the claim that was created.
## removeClaim
<br>
```Solidity
function removeClaim(
  bytes32 _claimId
) public returns (bool success)
```

Removes a claim from the identity contract.

### Parameters:
- `_claimId`: The ID of the claim.

### Return Values:
- success True if successful.
## getClaim
<br>
```Solidity
function getClaim(
  bytes32 _claimId
) public returns (uint256 topic, uint256 scheme, address issuer, bytes signature, bytes data, string uri)
```

Get a claim from the identity contract.

### Parameters:
- `_claimId`: The ID of the claim.

### Return Values:
- topic The numeric ID indicating the topic of the claim.

- scheme The encryption scheme.

- issuer The issuer of the claim.

- signature The signature from the issuer.

- data The data appended to the claim that is used prove the signature of the signer.

- uri The location of the claim information.
## getClaimIdsByTopic
<br>
```Solidity
function getClaimIdsByTopic(
  uint256 _topic
) public returns (bytes32[] claimIds)
```

Gets a claim by the topic ID.

### Parameters:
- `_topic`: The topic ID of the claim.

### Return Values:
- claimIds The IDs of the claims that match this topic ID for the identity contract.


