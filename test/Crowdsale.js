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
		user2 = accounts[2]

		// deploy crowdsale
		//crowdsaleMaxTokens = maxTokens
		crowdsaleMaxTokens = 100
		price = 1
		crowdsale = await Crowdsale.deploy(token.address, ether(price), crowdsaleMaxTokens)

		// send tokens to crowdsale
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
			expect(await crowdsale.maxTokens()).to.equal(crowdsaleMaxTokens)
		})

		it('adds deployer address to whitelist', async () => {
			expect(await crowdsale.getWhitelistLength()).to.equal(1)
			expect(await crowdsale.whitelist(0)).to.equal(deployer.address)
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

	describe('Sending ETH', () => {
		let transaction, result
		let amount, ethToSend, amtToReceive

		describe('Success', () => {

			beforeEach(async () => {
				ethToSend = 10
				amount = ether(ethToSend)

				// mimic user sending some ETH from their wallet
				transaction = await user1.sendTransaction({ to: crowdsale.address, value: amount })
				result = await transaction.wait()
			})

			it('updates contracts ether balance', async () => {
				expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
			})

			it('updates user token balance', async () => {
				amtToReceive = tokens(ethToSend / price)
				expect(await token.balanceOf(user1.address)).to.equal(amtToReceive)
			})
		})
	})

	describe('Updating Price', () => {
		let transaction, result
		let price = ether(2)

		describe('Success', () => {

			beforeEach(async () => {
				transaction = await crowdsale.connect(deployer).setPrice(price)
				result = await transaction.wait()
			})

			it('updates the price', async () => {
				expect(await crowdsale.price()).to.equal(price)
			})

		})

		describe('Failure', () => {
			it('prevents non-owner from updating price', async () => {
				await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted
			})
		})
	})

	describe('Managing Whitelist', () => {
		let transaction, result

		describe('Success', () => {
			it('identifies address in whitelist', async () => {
				expect(await crowdsale.isInWhitelist(deployer.address)).to.equal(true)
			})

			it('identifies address not in whitelist', async () => {
				expect(await crowdsale.isInWhitelist(user1.address)).to.equal(false)
			})

			it('adds address to whitelist', async () => {
				transaction = await crowdsale.connect(deployer).addToWhitelist(user1.address)
				result = await transaction.wait()
				expect(await crowdsale.isInWhitelist(user1.address)).to.equal(true)
			})

		})

		describe('Failure', () => {
			it('prevents non-owner from adding to whitelist', async () => {
				await expect(crowdsale.connect(user1).addToWhitelist(user2.address)).to.be.reverted
			})
		})

	})

	describe('Finalizing sale', () => {
		let transaction, result
		let ethBalanceBefore, ethBalanceAfter
		let amount = tokens(10)
		let value = ether(10)

		describe('Success', () => {
			beforeEach(async () => {
				transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value })
				result = await transaction.wait()

				ethBalanceBefore = await ethers.provider.getBalance(deployer.address)

				transaction = await crowdsale.connect(deployer).finalize()
				result = await transaction.wait()
				ethBalanceAfter = await ethers.provider.getBalance(deployer.address)
			})

			it('transfers remaining tokens to owner', async() => {
				expect(await token.balanceOf(crowdsale.address)).to.equal(0)
				expect(await token.balanceOf(deployer.address)).to.equal(tokens(99999990))
			})

			it('transfers ETH to owner', async() => {
				expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(0)
			})

			it('emits a Finalize event', async () => {
				await expect(transaction).to.emit(crowdsale, 'Finalize')
					.withArgs(amount, value)
			})
		})

		describe('Failure', () => {

			it('prevents non-owner from finalizing', async () => {
				await expect(crowdsale.connect(user1).finalize()).to.be.reverted
			})
		})
	})
})
