import "./ExchangeComponents.css";

export default function PaymentAccount({
  fromCurrency,
  onPaid,
  onBack,
  amount,
  currencySymbol,
}) {
  const accounts = {
    NGN: {
      number: "0123456789",
      name: "Naira Account",
      bank: "Access Bank",
      accountName: "Exchange Services Ltd",
      routing: "ACCESS123",
    },
    USD: {
      number: "9876543210",
      name: "Dollar Account",
      bank: "Citibank",
      accountName: "Exchange Services Ltd",
      routing: "CITI456",
    },
  };

  const account = accounts[fromCurrency] || accounts.NGN;

  return (
    <div className="exchange-component payment-wrapper fade-in">
      <div className="payment-amount-display">
        <h3>Send payment to complete your exchange</h3>
        <div className="payment-total">
          {currencySymbol}
          {parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

      <div className="account-details-card">
        <div className="account-row">
          <span className="account-label">Bank Name</span>
          <div className="account-value">{account.bank}</div>
        </div>

        <div className="account-row">
          <span className="account-label">Account Number</span>
          <div className="account-value highlight">{account.number}</div>
        </div>

        <div className="account-row">
          <span className="account-label">Account Name</span>
          <div className="account-value">{account.accountName}</div>
        </div>

        <div className="account-row">
          <span className="account-label">Currency</span>
          <span className="currency-tag">{fromCurrency}</span>
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={onPaid}>
          I Have Made Payment →
        </button>
      </div>
    </div>
  );
}
