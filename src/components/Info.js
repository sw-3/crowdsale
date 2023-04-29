const Info = ({ account, accountBalance, whitelisted }) => {
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
        <span className="mx-1"> SCOT</span>
      </p>
    </div>
  )
}

export default Info
