// Deploy SW3 Token and the Crowdsale contract.
// NOTE the commented section, if you want to deploy Crowdsale for a token that
//      has already been deployed.

const hre = require("hardhat");

async function main() {
  const NAME = 'SW3 Token'
  const SYMBOL = 'SW3'
  const TOKEN_SUPPLY = '1000000'
  const CROWDSALE_SUPPLY = '400000'   // selling 40% of token supply
  const PRICE = ethers.utils.parseUnits('0.00025', 'ether')
  const WHITELIST_REQUIRED = false    // for our purposes, no whitelist

  const Token = await ethers.getContractFactory('Token')

//  Uncomment this block to get existing token contract on the network
//  ------------------------------------------------------------------------------
//  NOTE: use tokenAddr in Crowdsale.deploy call below, instead of token.address
//
//  const tokenAddr = '0x...'
//  const token = Token.attach(tokenAddr)
//  console.log(`Attached to Token deployed at: ${token.address}\n`)

  // Comment out this block, if deploying with existing token in previous block
  let token = await Token.deploy(NAME, SYMBOL, TOKEN_SUPPLY)
  await token.deployed()
  console.log(`Token deployed to: ${token.address}\n`)

  // Deploy Crowdsale
  const Crowdsale = await ethers.getContractFactory('Crowdsale')
  const crowdsale = await Crowdsale.deploy
                            (
                              token.address,
                              PRICE,
                              ethers.utils.parseUnits(CROWDSALE_SUPPLY, 'ether'),
                              WHITELIST_REQUIRED
                            )
  await crowdsale.deployed()
  console.log(`Crowdsale deployed to: ${crowdsale.address}\n`)

  // send tokens to crowdsale
  const transaction = await token.transfer
                              (
                                crowdsale.address,
                                ethers.utils.parseUnits(CROWDSALE_SUPPLY, 'ether')
                              )
  await transaction.wait()

  console.log(`Tokens transferred to Crowdsale\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
