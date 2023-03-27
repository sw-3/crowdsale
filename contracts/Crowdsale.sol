// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
	Token public token;			// type of Token smart contract
	uint256 public price;		// price in ETH
	uint256 public maxTokens;
	uint256 public tokensSold;

	event Buy(uint256 amount, address buyer);

	// pass in the Token address to the constructor
	constructor(
		Token _token,
		uint256 _price,
		uint256 _maxTokens
	) {
		token = _token;
		price = _price;
		maxTokens = _maxTokens * (10 ** token.decimals());
	}
	
	receive() external payable {
		uint256 amount = msg.value / price;
		buyTokens(amount * 1e18);
	}

	// 'payable' means msg.value will contain the amt paid by caller
	function buyTokens(uint256 _amount) public payable {

		// make sure they sent enough eth for _amount tokens
		require(msg.value == (_amount / 1e18) * price);

		// make sure enough tokens in smart contract
		// TODO: write test for this line!
		require(token.balanceOf(address(this)) >= _amount);

		require(token.transfer(msg.sender, _amount));
		tokensSold += _amount;

		emit Buy(_amount, msg.sender);
	}

}
