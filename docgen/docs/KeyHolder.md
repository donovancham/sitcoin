# `KeyHolder`

# Functions:

- [`getKey(bytes32 _key)`](#KeyHolder-getKey-bytes32-)

- [`getKeyPurpose(bytes32 _key)`](#KeyHolder-getKeyPurpose-bytes32-)

- [`getKeysByPurpose(uint256 _purpose)`](#KeyHolder-getKeysByPurpose-uint256-)

- [`addKey(bytes32 _key, uint256 _purpose, uint256 _type)`](#KeyHolder-addKey-bytes32-uint256-uint256-)

- [`removeKey(bytes32 _key)`](#KeyHolder-removeKey-bytes32-)

- [`keyHasPurpose(bytes32 _key, uint256 _purpose)`](#KeyHolder-keyHasPurpose-bytes32-uint256-)

## getKey

<br>

```sol

function getKey(

) public returns (uint256 purpose, uint256 keyType, bytes32 key)

```

No description

## getKeyPurpose

<br>

```sol

function getKeyPurpose(

) public returns (uint256 purpose)

```

No description

## getKeysByPurpose

<br>

```sol

function getKeysByPurpose(

) public returns (bytes32[] _keys)

```

No description

## addKey

<br>

```sol

function addKey(

) public returns (bool success)

```

No description

## removeKey

<br>

```sol

function removeKey(

) public returns (bool success)

```

No description

## keyHasPurpose

<br>

```sol

function keyHasPurpose(

) public returns (bool result)

```

No description
