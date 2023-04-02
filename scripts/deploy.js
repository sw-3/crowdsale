// Modified by commenting out the SCOT token deploy section.
// Instead, will use the already-deployed SW3T token on Mumbai.
const hre = require("hardhat");

async function main() {
//  const NAME = 'Scott Token'
//  const SYMBOL = 'SCOT'
  const MAX_SUPPLY = '1000000'
  const PRICE = ethers.utils.parseUnits('0.000025', 'ether')

  // get token contract for SW3T
  const tokenAddr = '0xf5D9957F0DBbedaAEA9cadF99aD2b7965Fcc910A'
  const Token = await ethers.getContractFactory('Token')
  const token = Token.attach(tokenAddr)

//  let token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
//  await token.deployed()
//  console.log(`Token deployed to: ${token.address}\n`)
  console.log(`Attached to Token deployed at: ${token.address}\n`)

  // Deploy Crowdsale
  const Crowdsale = await ethers.getContractFactory('Crowdsale')
  const crowdsale = await Crowdsale.deploy(tokenAddr, PRICE, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'))
  await crowdsale.deployed()
  console.log(`Crowdsale deployed to: ${crowdsale.address}\n`)

  // send tokens to crowdsale
  const transaction = await token.transfer(crowdsale.address, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'))
  await transaction.wait()

  console.log(`Tokens transferred to Crowdsale\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
