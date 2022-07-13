Implemented access control using openzeppelin's `AccessControl` 

library. This implementation allows supply on demand by allowing 

more tokens to be minted as demand increases. The minting of tokens 

can only be done calling the `mint()` function from a privileged 

address with the 'MINTER' role. 

PRC-20 is fully compatible with ERC-20 so `ERC20` base contract

passes PRC-20 token standards.

# Functions:

- [`constructor(uint256 initialSupply)`](#SITcoin-constructor-uint256-)

- [`decimals()`](#SITcoin-decimals--)

- [`mint(address to, uint256 amount)`](#SITcoin-mint-address-uint256-)

- [`grantMinterRole(address _account)`](#SITcoin-grantMinterRole-address-)

- [`revokeMinterRole(address _account)`](#SITcoin-revokeMinterRole-address-)

# Events:

- [`Mint(address minter, uint256 value)`](#SITcoin-Mint-address-uint256-)

# Function `constructor(uint256 initialSupply)` {#SITcoin-constructor-uint256-}

Constructor inherits from ERC20 base. Mints initial supply

according to specification.

## Parameters:

- `initialSupply`: The initial supply of the token

# Function `decimals() → uint8` {#SITcoin-decimals--}

Override the existing implementation of 18 decimals ($ETH default)  

for SIT Coin tokenomics proposal of 0 decimals for easier reading.

## Return Values:

- uint8 The number of decimals used to get its user representation.

# Function `mint(address to, uint256 amount)` {#SITcoin-mint-address-uint256-}

Only minters are allowed to increase supply

## Parameters:

- `to`: The address where the minted tokens are sent

- `amount`: The amount of tokens to mint

# Function `grantMinterRole(address _account)` {#SITcoin-grantMinterRole-address-}

No description

# Function `revokeMinterRole(address _account)` {#SITcoin-revokeMinterRole-address-}

No description

# Event `Mint(address minter, uint256 value)` {#SITcoin-Mint-address-uint256-}

Emitted when `value` tokens are minted into the existing 

supply pool.
