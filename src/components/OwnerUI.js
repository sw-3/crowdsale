import { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

const OwnerUI = ({ provider, crowdsale, wlRequired, setIsLoading }) => {

  const [address, setAddress] = useState('0')
  const [isWaiting, setIsWaiting] = useState(false)

  const addWhitelistHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const signer = await provider.getSigner()

      const transaction = await crowdsale.connect(signer).addToWhitelist(address)
      await transaction.wait()

    } catch {
      window.alert('User rejected or transaction reverted')
    }

    setIsLoading(true)
  }

  const finalizeHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const signer = await provider.getSigner()

      const transaction = await crowdsale.connect(signer).finalize()
      await transaction.wait()

    } catch {
      window.alert('User rejected or transaction reverted')
    }

    setIsLoading(true)
  }


  return(
    <>
      <hr />

      {wlRequired ? (
        <>
        <h3 className='my-5 text-center'>Add an Address to the Whitelist</h3>

        <Form onSubmit={addWhitelistHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
          <Form.Group as={Row}>
            <Col>
              <Form.Control type='address' placeholder='Enter address' onChange={(e) => setAddress(e.target.value)}/>
            </Col>
            <Col className='text-center'>
              {isWaiting ? (
                <Spinner annimation='border' />
              ): (
                <Button variant='primary' type='submit' style={{ width: '100%' }}>
                  Add Address To Whitelist
                </Button>
              )}
            </Col>
          </Form.Group>
        </Form>
        <hr />
        </>
      ) : (
        <p> </p>
      )}

      <Form onSubmit={finalizeHandler} style={{ maxWidth: '600px', margin: '50px auto' }}>
        <Form.Group as={Row}>
          <Col className='text-center'>
            {isWaiting ? (
              <Spinner annimation='border' />
            ): (
              <Button variant='primary' type='submit' style={{ width: '100%' }}>
                <strong>FINALIZE CROWDSALE!</strong>
              </Button>
            )}
          </Col>
        </Form.Group>
      </Form>

    </>
  )
}

export default OwnerUI
