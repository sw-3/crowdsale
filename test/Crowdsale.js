const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Crowdsale', () => {
	let crowdsale, token
	let accounts, deployer, user1
	let maxTokens, crowdsaleMaxTokens, price	// all human-readable amounts

	beforeEach(async () => {
		// load contracts
		const Crowdsale = await ethers.getContractFactory('Crowdsale')
		const Token = await ethers.getContractFactory('Token')

		// deploy token
		maxTokens = 100000000
		token = await Token.deploy('ScottW3 Token', 'SW3T', maxTokens)

		// configure accounts
		accounts = await ethers.getSigners()
		deployer = accounts[0]
		user1 = accounts[1]

		// deploy crowdsale
		//crowdsaleMaxTokens = maxTokens
		crowdsaleMaxTokens = 100
		price = 1
		crowdsale = await Crowdsale.deploy(token.address, ether(price), crowdsaleMaxTokens)

		// send tokens to crowdsale
		// this causes the tokens to be held inside the Crowdsale contract;
		// 		the contract can use the transfer function, to transfer out
		let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(crowdsaleMaxTokens))
		await transaction.wait()
	})

	describe('Deployment', () => {

		it('sends tokens to the Crowdsale contract', async () => {
			expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(crowdsaleMaxTokens))
		})
		
		it('returns the price', async () => {
			expect(await crowdsale.price()).to.equal(ether(price))
		})

		it('returns token address', async () => {
			expect(await crowdsale.token()).to.equal(token.address)
		})

		it('returns max tokens', async () => {
			expect(await crowdsale.maxTokens()).to.equal(tokens(crowdsaleMaxTokens))
		})

	})

	describe('Buying tokens', () => {
		let transaction, result
		let amountToBuy, costInEth, amount

		describe('Success', () => {

			beforeEach(async () => {
				amountToBuy = 10
				costInEth = amountToBuy * price
				amount = tokens(amountToBuy)
				transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(costInEth) })
				result = await transaction.wait()
			})

			it('transfers tokens', async () => {
				expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(crowdsaleMaxTokens - amountToBuy))
				expect(await token.balanceOf(user1.address)).to.equal(amount)
			})

			it('updates contract ether balance', async () => {
				expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
			})

			it('updates tokensSold', async () => {
				expect(await crowdsale.tokensSold()).to.equal(amount)
			})

			it('emits a Buy event', async () => {
				// --> https://hardhat.org/hardhat-chai-matchers/docs/reference#.emit
				await expect(transaction).to.emit(crowdsale, 'Buy')
					.withArgs(amount, user1.address)
			})
		})

		describe('Failure', () => {

			it('rejects insufficient ETH', async () => {
				await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted
			})

			it('rejects purchase of more than remaining tokens', async () => {
				await expect(crowdsale.connect(user1).buyTokens(tokens(101), { value: ether(101) })).to.be.reverted
			})
		})

	})

})
