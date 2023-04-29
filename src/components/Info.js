const Info = ({ account, accountBalance, tokenSymbol, whitelisted, wlRequired }) => {

  let wlIndicator

  // make sure whitelisting is required before we display whitelist status
  wlRequired ? (

    whitelisted ? (
      wlIndicator = "(Whitelisted)"
    ) : (
      wlIndicator = "(NOT Whitelisted)"
    )

  ) : (
    wlIndicator = ""
  )

  return(
    <div className="my-3">
      <p>
        <strong>Account:</strong> {account}
        <span className="mx-3">{wlIndicator}</span>
      </p>

      <p><strong>Tokens Owned:</strong> {accountBalance}
        <span className="mx-1"> {tokenSymbol}</span>
      </p>
    </div>
  )
}

export default Info
