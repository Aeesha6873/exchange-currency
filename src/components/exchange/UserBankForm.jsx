import { useState, useEffect } from "react";
import "./ExchangeComponents.css";

export default function UserBankForm({
  onSubmit,
  onBack,
  toCurrency,
  convertedAmount,
}) {
  const [form, setForm] = useState({
    accountNumber: "",
    bankCode: "",
    accountName: "",
  });
  const [loading, setLoading] = useState(false);
  const [bankList, setBankList] = useState([]);

  const banks = [
    { code: "044", name: "Access Bank", country: "NG" },
    { code: "058", name: "GTBank", country: "NG" },
    { code: "033", name: "UBA", country: "NG" },
    { code: "232", name: "Sterling Bank", country: "NG" },
    { code: "011", name: "First Bank", country: "NG" },
    { code: "214", name: "First City Monument Bank", country: "NG" },
    { code: "050", name: "Ecobank", country: "NG" },
  ];

  useEffect(() => {
    setBankList(banks);
  }, []);

  useEffect(() => {
    if (form.accountNumber && form.accountNumber.length >= 10) {
      setLoading(true);
      setTimeout(() => {
        setForm((prev) => ({ ...prev, accountName: "Aisha Abdullahi" }));
        setLoading(false);
      }, 800);
    }
  }, [form.accountNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bankCode || !form.accountNumber) {
      alert("Please fill in all required fields");
      return;
    }

    if (form.accountNumber.length !== 10) {
      alert("Account number must be 10 digits");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    onSubmit();
  };

  return (
    <div className="exchange-component bank-form-wrapper fade-in">
      <div className="receive-summary">
        <div className="receive-label">YOU WILL RECEIVE</div>
        <div className="receive-amount">
          ${parseFloat(convertedAmount).toLocaleString()} {toCurrency}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>SELECT YOUR BANK</label>
          <select
            value={form.bankCode}
            onChange={(e) => setForm({ ...form, bankCode: e.target.value })}
            required>
            <option value="">Choose your bank</option>
            {bankList.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>ACCOUNT NUMBER</label>
          <input
            type="text"
            placeholder="1234567890"
            value={form.accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, accountNumber: value.slice(0, 10) });
            }}
            pattern="\d{10}"
            required
          />
          <div className="digit-count">
            {form.accountNumber.length}/10 digits
          </div>
        </div>

        <div className="form-field">
          <label>ACCOUNT NAME</label>
          <input
            type="text"
            value={form.accountName}
            onChange={(e) => setForm({ ...form, accountName: e.target.value })}
            required
            readOnly={form.accountName}
          />
          {form.accountName && (
            <div className="account-verified">
              <span>✓</span>
              <span>Account verified successfully</span>
            </div>
          )}
        </div>

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            ← Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !form.accountName ||
              !form.bankCode ||
              !form.accountNumber ||
              loading
            }>
            {loading ? (
              <>
                <div className="loading-spinner" />
                Verifying...
              </>
            ) : (
              "Complete Exchange →"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
