// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
	Token public token;			// type of Token smart contract
	uint256 public price;		// price in ETH

	// pass in the Token address to the constructor
	constructor(Token _token, uint256 _price) {
		token = _token;
		price = _price;
	}
	
	// 'payable' means msg.value will contain the amt paid to buy
	function buyTokens(uint256 _amount) public payable {
		token.transfer(msg.sender, _amount);
	}

}
