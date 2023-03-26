const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Crowdsale', () => {
	let crowdsale, token
	let accounts, deployer, user1

	beforeEach(async () => {
		// load contracts
		const Crowdsale = await ethers.getContractFactory('Crowdsale')
		const Token = await ethers.getContractFactory('Token')

		// deploy token
		token = await Token.deploy('ScottW3 Token', 'SW3T', '100000000')

		// configure accounts
		accounts = await ethers.getSigners()
		deployer = accounts[0]
		user1 = accounts[1]

		// deploy crowdsale
		crowdsale = await Crowdsale.deploy(token.address, ether(1))

		// send tokens to crowdsale
		// this causes the tokens to be held inside the Crowdsale contract;
		// 		the contract can use the transfer function, to transfer out
		let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(100000000))
		await transaction.wait()
	})

	describe('Deployment', () => {

		it('sends tokens to the Crowdsale contract', async () => {
			expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(100000000))
		})
		
		it('returns the price', async () => {
			expect(await crowdsale.price()).to.equal(ether(1))
		})

		it('returns token address', async () => {
			expect(await crowdsale.token()).to.equal(token.address)
		})

	})

	describe('Buying tokens', () => {
		let transaction, result
		let amount = tokens(10)

		describe('Success', () => {

			beforeEach(async () => {
				transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) })
				result = await transaction.wait()
			})

			it('transfers tokens', async () => {
				expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(99999990))
				expect(await token.balanceOf(user1.address)).to.equal(amount)
			})

			it('updates contract ether balance', async () => {
				expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
			})
		})

	})

})
