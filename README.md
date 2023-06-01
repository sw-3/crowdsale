# Example Crowdsale for a New Token

This project demonstrates a basic crowdsale for a token ICO.

## Project Components
The project consists of 2 smart contracts and a web front end.
- **Token.sol** is a token based on the ERC-20 standard.
- **Crowdsale.sol** is the smart contract that manages the crowdsale. It implements an *optional whitelist* and a *finalize* function to send the proceeds and remaining tokens to the contract owner.
- **Crowdsale Frontend** is a React.js app which provides the user interface to the crowdsale.

## Technologies Used
- **react.js**  This project was built with v 18.2.0
- **node.js v16.X:**  This project was built with v 16.14.2.  Run `node -v` to see your version of node.
- **hardhat:**  This project is using v 2.13.0.  Run `npx hardhat --version` to see your version.
- **solidity:**  Built with v0.8.18; this should be set in the *hardhat.config.js* file.

## Installation
1. In a terminal session:  Clone the repo onto your local machine, and cd to the main directory.
2. On the command line, Enter `npm install`
3. Enter `npx hardhat test` to compile the smart contracts and run their tests.

## Run Locally
1. In a terminal session:  Enter `npx hardhat node` to launch a blockchain node on your computer. (Note the output generated; you will use the addresses for some Hardhat accounts for this project.)
2. In a 2nd terminal session:  Enter `npx hardhat run --network localhost ./scripts/deploy.js`

After the above, you should see output of the address for the deployed Token and Crowdsale contracts. The deploy script also transfers 40% of the total supply of tokens to the Crowdsale contract. In the terminal window that is running the blockchain node, you should see that the deploy & configure transactions ran successfully.

Your blockchain is now running locally with the Crowdsale contracts deployed!

**IMPORTANT NOTE:** Compare the 2 deployed contract addresses on the terminal screen, with the first 2 addresses in the **./src/config.json** file. The addresses in the file MUST match the addresses on the screen in this step. If they do not match, *correct the addresses in the config.json file now*.

3. You should add the Hardhat network (chainId 31337) to your Metamask wallet, and import the Hardhat #0 account to have access to the *finalize* function of the Crowdsale, as well as the 60% of tokens not owned by the Crowdsale. You can import other Hardhat accounts into Metamask to purchase tokens from the Crowdsale.

## Launch The Front End
In a 3rd terminal window:  Enter `npm run start`<br />
This will launch a browser window to display the Crowdsale application front end. You must have Metamask (or a compatible wallet) installed in your browser, and within Metamask connect to the local Hardhat network (chainId 31337).
