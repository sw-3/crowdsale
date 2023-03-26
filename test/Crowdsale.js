const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Crowdsale', () => {
	let crowdsale

	beforeEach(async () => {
		const Crowdsale = await ethers.getContractFactory('Crowdsale')
		const Token = await ethers.getContractFactory('Token')

		token = await Token.deploy('ScottW3 Token', 'SW3T', '100000000')
		crowdsale = await Crowdsale.deploy(token.address)
	})

	describe('Deployment', () => {
		it('returns token address', async () => {
			expect(await crowdsale.token()).to.equal(token.address)
		})
	})
})
