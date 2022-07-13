# `SITcoin`

ERC20 token implemented with controlled supply that allows minting and burning of tokens. This token is designed to be deployed on the PlatON blockchain, which requires compatibility with the `PRC20` fungible token standard. `PRC20` is fully compatible with `ERC20` so openzeppelin's `ERC20` implementation can be used to provide standard `ERC20` functional implemnetations without any conflicts.

Implemented access control using openzeppelin's `AccessControl` library. This implementation allows supply on demand by allowing more tokens to be minted as demand increases. The minting of tokens can only be done calling the `mint()` function from a privileged address with the 'MINTER' role. 

# Functions:

- [`constructor(uint256 initialSupply)`](#SITcoin-constructor-uint256-)

- [`decimals()`](#SITcoin-decimals--)

- [`mint(address to, uint256 amount)`](#SITcoin-mint-address-uint256-)

- [`grantMinterRole(address _account)`](#SITcoin-grantMinterRole-address-)

- [`revokeMinterRole(address _account)`](#SITcoin-revokeMinterRole-address-)

## constructor

<br>

```sol

function constructor(

  uint256 initialSupply

) public

```

Constructor inherits from ERC20 base. Mints initial supply according to specification.

### Parameters:

- `initialSupply`: The initial supply of the token

## decimals

<br>

```sol

function decimals(

) public returns (uint8)

```

Override the existing implementation of 18 decimals _(`$ETH` default)_ for SIT Coin tokenomics proposal of 0 decimals. This allows for greater readability when calling functions that get the amount of tokens.

### Return Values:

- uint8 The number of decimals used to get its user representation.

## mint

<br>

```sol

function mint(

  address to,

  uint256 amount

) public

```

Only minters are allowed to increase supply

### Parameters:

- `to`: The address where the minted tokens are sent

- `amount`: The amount of tokens to mint

## grantMinterRole

<br>

```sol

function grantMinterRole(

  address _account

) public

```

Gives an `account` permission to mint tokens. Can only be called by the contract owner.

### Parameters:

- `_account`: The account to grant minting permissions

## revokeMinterRole

<br>

```sol

function revokeMinterRole(

  address _account

) public

```

Revokes an `account` permission to mint tokens. Can only be called by the contract owner. The `_account` being called must have an existing privileged minter role.

### Parameters:

- `_account`: The account to revoke minting permissions

# Events:

- [`Mint(address minter, uint256 amount)`](#SITcoin-Mint-address-uint256-)

## Mint

<br>

```sol

Mint(address minter, uint256 amount)

```

Emitted when `value` tokens are minted into the existing supply pool by `minter`.

### Parameters:

- `minter`: The address of the privileged `MINTER_ROLE` that called the contract.

- `amount`: The amount of tokens minted.
