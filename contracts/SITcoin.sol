pragma solidity >=0.5.1;

contract PRC20Token{
    mapping(address => uint256) public balances;
    /**
     * @dev Mint token into owner's wallet.
     * TODO: Amount minted to be changed according to team's decision
     */
    function mint() public {
        // msg.sender refers to the address of the one who calls the function (MyContract's address), 
        // not the one who sent the request (wallet address)
        // tx.origin, tx means function that initiated the mint() function
        balances[tx.origin] ++;
    }

    /**
     * @dev Check if the balance of current user is sufficient for requested transaction
     * @param _spender address of user spending the tokens
     * @param _value the amount being transferred
     * @return true if sufficient amount, false if not
     */
    function checkBalance
    (
        address _spender, 
        uint256 _value
    ) 
    public view returns (bool) 
    {
        if (balances[_spender] >= _value && _value > 0)
        {
            return true;
        }
        else { return false; }
    }
    /**
     * @dev Conduct requested transaction if all requirements are met
     * @param _spender address of user spending the tokens
     * @param _receiver address of user receiving the tokens
     * @param _value the amount being transferred
     * @return true if succeeded, false if not
     */
    function transaction
    (
        address _spender, 
        address _receiver, 
        uint256 _value
    ) 
    public returns (bool)
    {
        bool enoughToken = checkBalance(_spender, _value);
        if (enoughToken) {
            balances[_spender] -= _value;
            balances[_receiver] += _value;
            return true;
        }
        else{
            return false;
        }
    }
}

/**
 * @title SITC
 * @dev Includes necessary token functionalities that users can do
 */
contract SITC is PRC20Token{
    // only need to deploy this contract, inheriting from PRC20Token
    string public name;
    string public symbol;
    uint8 public decimal;
    // virtual campus or contract owner
    address private owner; 

    // keep an array of owners
    address[] public users;
    // counter for people who own the token
    uint256 userCount;

    // used to check if the person that calls the function is the contract owner
    modifier ownerOnly() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    /**
     * @dev Set basic information of token, mint fixed amount of 
     * token at the start, and set contract deployer as owner
     */
    constructor() public {
        name = "SIT Coin";
        symbol = "SITC";
        decimal = 2;
        balances[msg.sender] = 999999999999999;
        owner = msg.sender;
    }

    /**
     * @dev obtain more tokens into owner wallet. Only the owner is allowed to mint for more tokens
     */
    function mint() public ownerOnly{
        // preserve existing but also adding additional functionalities to mint() in parent
        super.mint(); //preserve parent mint() function
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }
    /**
     * @dev Return balance of current caller 
     * @return token balance in wallet
     */
    function getBalance() public view returns(uint256) {
        return balances[msg.sender];
    }
}