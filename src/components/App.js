import { useEffect, useState } from 'react'

import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation'
import Info from './Info'

// ABIs
import TOKEN_ABI from '../abis/Token.json'
import CROWDSALE_ABI from '../abis/Crowdsale.json'

function App() {

	const [account, setAccount] = useState(null)	// defines state var + function to set it
	const [provider, setProvider] = useState(null)

	const [isLoading, setIsLoading] = useState(true)

	const loadBlockchainData = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)   // this gets metamask interface to BC
		setProvider(provider)

		// initiate contracts
		const token = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', TOKEN_ABI, provider)
		console.log(token)

		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		const account = ethers.utils.getAddress(accounts[0])
		setAccount(account)

		setIsLoading(false)
	}

	useEffect(() => {
		if (isLoading) {
			loadBlockchainData()
		}
	}, [isLoading])

	return(
		<Container>
			<Navigation />
			<hr />
			{account && (
				<Info account={account} />
			)}
		</Container>
	)
}

export default App
