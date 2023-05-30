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
const LOGO_COLOR = '#0f2a87'
const MAX_BUY = 1000

function App() {
  const [provider, setProvider] = useState(null)
  const [crowdsale, setCrowdsale] = useState(null)
  const [tokenName, setTokenName] = useState(null)
  const [tokenSymbol, setTokenSymbol] = useState(null)
  const [tokenAddress, setTokenAddress] = useState(null)

  const [account, setAccount] = useState(null)
  const [accountBalance, setAccountBalance] = useState(0)
  const [tokensPurchased, setTokensPurchased] = useState(0)

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

    const tokenAddress = token.address
    setTokenAddress(tokenAddress)
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

    // fetch account balance & amount of Token already purchased via the Crowdsale
    const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
    setAccountBalance(accountBalance)
    const tokensPurchased = ethers.utils.formatUnits(await crowdsale.balances(account), 18)
    setTokensPurchased(tokensPurchased)

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
      <Navigation />

      <h1 className='my-4 text-center' style={{ color: LOGO_COLOR }}>Introducing {tokenName}!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'>
            <strong className='mx-2'>Current Price:</strong> {price} sepoliaETH
          </p>
          <p className='text-center'>
            <strong className='mx-2'>MAX Purchase Amount:</strong> {MAX_BUY} {tokenSymbol}
          </p>
          <p className='text-center'>
            <strong className='mx-2'>Token Address on Sepolia:</strong> {tokenAddress}
          </p>

          <hr />

          <h5 className='text-center' style={{ color: LOGO_COLOR }}>
            THIS CROWDSALE IS FOR EDUCATIONAL PURPOSES ONLY.
          </h5>
          <p className='text-center' style={{ width: '80%', marginLeft: '10%', marginRight: '-10%' }}>
            Using sepoliaETH, you may purchase up to {MAX_BUY} {tokenSymbol} tokens per address. (Go to
            sepoliafaucet.com and connect your free Alchemy account to receive sepoliaETH.)
            This Crowdsale will distribute a maximum of 400,000 {tokenSymbol} tokens (40% of the total supply).
            The remaining tokens are distributed between multiple test wallets for testing purposes. Add
            the token address above to your wallet to see your tokens.
          </p>

          <p className='text-center' style={{ width: '80%', marginLeft: '10%', marginRight: '-10%' }}>
            <strong style={{ color: LOGO_COLOR }}>TO CONTINUE THE EXMPLE...</strong><br />
            As a token holder, you have full access to the example {tokenName} project DAO! You will be
            able to create and vote on proposals there. So go ahead! Get yourself
            some {tokenSymbol} tokens here, and head on over to the DAO:<br />{`< link coming soon >`}
          </p>

          <Buy
            provider={provider}
            price={price}
            crowdsale={crowdsale}
            tokenSymbol={tokenSymbol}
            whitelisted={whitelisted}
            wlRequired={wlRequired}
            tokensPurchased={tokensPurchased}
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
          tokensPurchased={tokensPurchased}
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
