// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokensSold;
    mapping(address => bool) public whitelist;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokensSold, uint256 ethRaised);
    event AddToWhitelist(address wlAddress);

    // pass in the Token address to the constructor
    constructor(
        Token _token,
        uint256 _price,
        uint256 _maxTokens
    ) {
        owner = msg.sender;
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
        whitelist[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Caller is not the owner');
        _;
    }
    
    // receive function allows sending ETH direct to contract addr
    receive() external payable {
        uint256 amount = msg.value / price;
        buyTokens(amount * 1e18);
    }

    // 'payable' means msg.value will contain the amt sent by caller
    function buyTokens(uint256 _amount) public payable {

        // first, make sure they are on the whitelist!
        require(whitelist[msg.sender], 'Address not whitelisted.');

        // make sure they sent enough eth for _amount tokens
        require(msg.value == (_amount / 1e18) * price);

        // make sure enough tokens in smart contract
        require(token.balanceOf(address(this)) >= _amount);

        require(token.transfer(msg.sender, _amount));
        tokensSold += _amount;

        emit Buy(_amount, msg.sender);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function addToWhitelist(address _wlAddress) 
    public onlyOwner 
    {
        whitelist[_wlAddress] = true;

        emit AddToWhitelist(_wlAddress);
    }

    function finalize() public onlyOwner {

        // finalizes the crowd sale, send remaining tokens to owner
        require(token.transfer(owner, token.balanceOf(address(this))));

        // send the ETH to crowdsale owner
        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value: value }("");
        require(sent);

        emit Finalize(tokensSold, value);
    }

}
