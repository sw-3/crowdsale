import { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'

const Buy = (
  { provider, price, crowdsale, tokenSymbol, whitelisted, wlRequired, acctBal, setIsLoading }) => {
  const MIN_BUY = 1
  const MAX_BUY = 1000

  const [amount, setAmount] = useState('0')
  const [isWaiting, setIsWaiting] = useState(false)

  const buyHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const newBalance = Number(acctBal) + Number(amount)

      if (wlRequired && !whitelisted) {
        window.alert(`Only whitelisted accounts can purchase ${tokenSymbol} Tokens`)
      }
      else if ( (amount < MIN_BUY) || (amount > MAX_BUY) ) {
        window.alert(`Must purchase between ${MIN_BUY} and ${MAX_BUY} ${tokenSymbol} Tokens`)
      }
      else if (newBalance > MAX_BUY) {
        window.alert(`Cannot purchase more than ${MAX_BUY} ${tokenSymbol} from the same address`)
      }
      else
      {
        const signer = await provider.getSigner()

        const value = ethers.utils.parseUnits((amount * price).toString(), 'ether')
        const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

        const transaction = await crowdsale.connect(signer).buyTokens(formattedAmount, { value: value })
        await transaction.wait()
      }

    } catch {
      window.alert('User rejected or transaction reverted')
    }

    setIsLoading(true)
  }

  return(
    <Form onSubmit={buyHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Form.Group as={Row}>
        <Col>
          <Form.Control type='number' placeholder='Enter amount' onChange={(e) => setAmount(e.target.value)}/>
        </Col>
        <Col className='text-center'>
          {isWaiting ? (
            <Spinner annimation='border' />
          ): (
            <Button variant='primary' type='submit' style={{ width: '100%' }}>
              Buy Tokens
            </Button>
          )}
        </Col>
      </Form.Group>
    </Form>
  )
}

export default Buy
