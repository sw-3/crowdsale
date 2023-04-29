const Info = ({ account, accountBalance, tokenSymbol, whitelisted }) => {
  return(
    <div className="my-3">
      {whitelisted ? (
          <p>
            <strong>Account:</strong> {account}
            <span className="mx-3">(Whitelisted)</span>
          </p>
        ) : (
          <p>
            <strong>Account:</strong> {account}
            <span className="mx-3">(NOT Whitelisted)</span>
          </p>
        )}

      <p><strong>Tokens Owned:</strong> {accountBalance}
        <span className="mx-1"> {tokenSymbol}</span>
      </p>
    </div>
  )
}

export default Info
