# `KeyHolder`

Keys created can be used to sign actions or claims. There are 4 types of keys:

- `1` = MANAGEMENT

- `2` = ACTION

- `3` = CLAIM

- `4` = ENCRYPTION

Keys are byte32 hashed using the `keccak256()` function.

# Functions:

- [`constructor()`](#KeyHolder-constructor--)

- [`getKey(bytes32 _key)`](#KeyHolder-getKey-bytes32-)

- [`getKeyPurpose(bytes32 _key)`](#KeyHolder-getKeyPurpose-bytes32-)

- [`getKeysByPurpose(uint256 _purpose)`](#KeyHolder-getKeysByPurpose-uint256-)

- [`addKey(bytes32 _key, uint256 _purpose, uint256 _type)`](#KeyHolder-addKey-bytes32-uint256-uint256-)

- [`removeKey(bytes32 _key)`](#KeyHolder-removeKey-bytes32-)

- [`keyHasPurpose(bytes32 _key, uint256 _purpose)`](#KeyHolder-keyHasPurpose-bytes32-uint256-)

## constructor

<br>

```Solidity

function constructor(

) public

```

Initializes the contract by giving the owner of the identity a `MANAGEMENT` key, which is a proof of administration for the identity.

## getKey

<br>

```Solidity

function getKey(

  bytes32 _key

) public returns (uint256 purpose, uint256 keyType, bytes32 key)

```

Retrieves the key at the mapped position.

### Parameters:

- `_key`: The key to be retrieved

### Return Values:

- purpose The purpose of the key retrieved.

- keyType The type of the key retrieved.

- key The mapping position of the key retrieved. (Same as param passed in)

## getKeyPurpose

<br>

```Solidity

function getKeyPurpose(

  bytes32 _key

) public returns (uint256 purpose)

```

Gets purpose of the key requested.

### Parameters:

- `_key`: The key to be retrieved.

### Return Values:

- purpose The purpose of the key retrieved.

## getKeysByPurpose

<br>

```Solidity

function getKeysByPurpose(

  uint256 _purpose

) public returns (bytes32[] _keys)

```

Gets the keys of `_purpose` that the identity owns.

### Parameters:

- `_purpose`: The purpose to filter and retrieve the keys.

### Return Values:

- _keys The set of keys that have this `_purpose`.

## addKey

<br>

```Solidity

function addKey(

  bytes32 _key,

  uint256 _purpose,

  uint256 _type

) public returns (bool success)

```

Adds a new key to the identity contract.

### Parameters:

- `_key`: The hash of the key to be added.

- `_purpose`: The purpose of the key.

- `_type`: The type of the key.

### Return Values:

- success True if successful.

## removeKey

<br>

```Solidity

function removeKey(

  bytes32 _key

) public returns (bool success)

```

Removes a key from the identity contract.

### Parameters:

- `_key`: The key to be removed.

### Return Values:

- success True if successful.

## keyHasPurpose

<br>

```Solidity

function keyHasPurpose(

  bytes32 _key,

  uint256 _purpose

) public returns (bool result)

```

Checks if the key requested has the `purpose` property according to what is requested.

### Parameters:

- `_key`: The key to be checked.

- `_purpose`: The purpose of the key.

### Return Values:

- result True if successful.
