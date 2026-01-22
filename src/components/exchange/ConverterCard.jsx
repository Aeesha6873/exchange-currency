import { useState } from "react";
import "./ExchangeComponents.css";

export default function ConverterCard({ data, onNext }) {
  const [form, setForm] = useState(data);
  const [loading, setLoading] = useState(false);

  const rates = {
    "NGN-USD": 0.00097,
    "USD-NGN": 1000,
  };

  const currencyInfo = {
    NGN: { name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬", color: "#10b981" },
    USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸", color: "#f97316" },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...form,
      [name]: value,
    };

    if (updated.from && updated.to && updated.amount) {
      const rateKey = `${updated.from}-${updated.to}`;
      const rate = rates[rateKey] || 1;
      updated.convertedAmount = (updated.amount * rate).toFixed(2);
    }

    setForm(updated);
  };

  const swapCurrencies = () => {
    const newForm = {
      ...form,
      from: form.to,
      to: form.from,
      amount: form.convertedAmount || "",
      convertedAmount: form.amount || "",
    };
    setForm(newForm);
  };

  const handleSubmit = async () => {
    if (!form.from || !form.to || !form.amount) {
      alert("Please fill in all fields");
      return;
    }

    if (parseFloat(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    onNext(form);
  };

  return (
    <div className="exchange-component converter-wrapper fade-in">
      <div className="currency-selector-wrapper">
        <div className="currency-cards">
          <div className={`currency-card ${form.from ? "active" : ""}`}>
            <div className="currency-header">
              <div className="currency-flag">
                {currencyInfo[form.from]?.flag || "🌍"}
              </div>
              <div className="currency-info">
                <h4>From Currency</h4>
                <p>{currencyInfo[form.from]?.name || "Select currency"}</p>
              </div>
            </div>
            <div className="currency-input">
              <span className="currency-symbol">
                {currencyInfo[form.from]?.symbol || "$"}
              </span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="1"
                step="0.01"
              />
            </div>
            <div className="currency-dropdown">
              <select name="from" value={form.from} onChange={handleChange}>
                <option value="">Select currency</option>
                <option value="NGN">Nigerian Naira (NGN)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>
          </div>

          <button className="currency-swap-btn" onClick={swapCurrencies}>
            ⇄
          </button>

          <div className={`currency-card ${form.to ? "active" : ""}`}>
            <div className="currency-header">
              <div className="currency-flag">
                {currencyInfo[form.to]?.flag || "🌍"}
              </div>
              <div className="currency-info">
                <h4>To Currency</h4>
                <p>{currencyInfo[form.to]?.name || "Select currency"}</p>
              </div>
            </div>
            <div className="currency-input">
              <span className="currency-symbol">
                {currencyInfo[form.to]?.symbol || "$"}
              </span>
              <input
                type="text"
                value={form.convertedAmount || "0.00"}
                readOnly
              />
            </div>
            <div className="currency-dropdown">
              <select name="to" value={form.to} onChange={handleChange}>
                <option value="">Select currency</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="NGN">Nigerian Naira (NGN)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {form.convertedAmount && (
        <div className="amount-display fade-in">
          <span className="amount-label">You will receive</span>
          <p className="amount-value">
            {currencyInfo[form.to]?.symbol}
            {parseFloat(form.convertedAmount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="exchange-details">
            <div className="detail-item">
              <span className="detail-label">Exchange Rate</span>
              <span className="detail-value">
                1 {form.from} ={" "}
                {rates[`${form.from}-${form.to}`]?.toFixed(4) || 1} {form.to}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Transaction Fee</span>
              <span className="detail-value">0.5%</span>
            </div>
          </div>
        </div>
      )}

      <button
        className="continue-btn"
        onClick={handleSubmit}
        disabled={!form.from || !form.to || !form.amount || loading}>
        {loading ? (
          <>
            <div className="loading-spinner" />
            Processing...
          </>
        ) : (
          "Continue to Payment"
        )}
      </button>
    </div>
  );
}
