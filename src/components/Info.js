const Info = ({ account, accountBalance, tokensPurchased, tokenSymbol, whitelisted, wlRequired }) => {

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
        <strong>Account:</strong> <span className="mx-3">{account}</span>
        <span className="mx-3">{wlIndicator}</span>
      </p>

      <p><strong>Tokens Owned:</strong> {accountBalance}
        <span className="mx-1"> {tokenSymbol}</span>
        <span className="mx-5">
          <strong>Tokens Purchased:</strong> {tokensPurchased} {tokenSymbol}
        </span>
      </p>
    </div>
  )
}

export default Info
