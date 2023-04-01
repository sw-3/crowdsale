// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
	address public owner;
	Token public token;
	uint256 public price;
	uint256 public maxTokens;
	uint256 public tokensSold;
	address[] public whitelist;

	event Buy(uint256 amount, address buyer);
	event Finalize(uint256 tokensSold, uint256 ethRaised);

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
		whitelist.push(msg.sender);
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

	// note that Solidity does not expose array lengths, so...
	function getWhitelistLength()
		public view
		returns (uint256)
	{
		return whitelist.length;
	}

	function isInWhitelist(address _address)
		public view
		returns (bool)
	{
		for (uint64 i = 0; i < whitelist.length; i++) {
			if (whitelist[i] == _address) {
				return true;
			}
		}
		return false;
	}

	function addToWhitelist(address _address)
		public onlyOwner
	{

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
