import { useEffect, useState } from 'react'

import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation'
import Buy from './Buy'
import Info from './Info'
import Loading from './Loading'
import Progress from './Progress'
import OwnerUI from './OwnerUI'

// ABIs
import TOKEN_ABI from '../abis/Token.json'
import CROWDSALE_ABI from '../abis/Crowdsale.json'

// config
import config from '../config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [crowdsale, setCrowdsale] = useState(null)
  const [tokenName, setTokenName] = useState(null)
  const [tokenSymbol, setTokenSymbol] = useState(null)

  const [account, setAccount] = useState(null)
  const [accountBalance, setAccountBalance] = useState(0)

  const [price, setPrice] = useState(0)
  const [maxTokens, setMaxTokens] = useState(0)
  const [tokensSold, setTokensSold] = useState(0)
  const [whitelisted, setWhitelisted] = useState(false)
  const [wlRequired, setWlRequired] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const { chainId } = await provider.getNetwork()

    // initiate contracts
    const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)
    const tokenName = await token.name()
    setTokenName(tokenName)
    const tokenSymbol = await token.symbol()
    setTokenSymbol(tokenSymbol)

    const crowdsale = new ethers.Contract(config[chainId].crowdsale.address, CROWDSALE_ABI, provider)
    setCrowdsale(crowdsale)

    // fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // fetch account balance
    const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
    setAccountBalance(accountBalance)

    // fetch crowdsale data
    const price = ethers.utils.formatUnits(await crowdsale.price(), 18)
    setPrice(price)
    const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18)
    setMaxTokens(maxTokens)
    const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(), 18)
    setTokensSold(tokensSold)
    const whitelisted = await crowdsale.whitelist(account)
    setWhitelisted(whitelisted)
    const wlRequired = await crowdsale.whitelistRequired()
    setWlRequired(wlRequired)
    if (account === (await crowdsale.owner())) {
      setIsOwner(true)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  return(
    <Container>
      <Navigation
        tokenName={tokenName}
      />

      <h1 className='my-4 text-center'>Introducing {tokenName}!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'><strong>Current Price:</strong> {price} ETH</p>
          <Buy
            provider={provider}
            price={price}
            crowdsale={crowdsale}
            tokenSymbol={tokenSymbol}
            whitelisted={whitelisted}
            wlRequired={wlRequired}
            acctBal={accountBalance}
            setIsLoading={setIsLoading}
          />
          <Progress maxTokens={maxTokens} tokensSold={tokensSold}/>
        </>
      )}

      <hr />

      {account && (
        <Info
          account={account}
          accountBalance={accountBalance}
          tokenSymbol={tokenSymbol}
          whitelisted={whitelisted}
          wlRequired={wlRequired}
        />
      )}

      {(isOwner) ? (
        isLoading ? (
          <Loading />
        ) : (
          <OwnerUI
            provider={provider}
            crowdsale={crowdsale}
            wlRequired={wlRequired}
            setIsLoading={setIsLoading}
          />
        )
      ) : (
        <p> </p>
      )}

    </Container>
  )
}

export default App
