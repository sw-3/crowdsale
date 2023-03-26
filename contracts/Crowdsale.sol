// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
	Token public token;			// type of Token smart contract

	// pass in the Token address to the constructor
	constructor(Token _token) {
		token = _token;
	}
	
}
