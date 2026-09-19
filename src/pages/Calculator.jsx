import React, { useState, useEffect, useMemo } from "react";
import {
  FiArrowRight,
  FiRefreshCw,
  FiTrendingUp,
  FiRepeat,
} from "react-icons/fi";
import styles from "./Calculator.module.css";

const RATES_KEY = "exchangeRates";

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const Calculator = () => {
  const [rates, setRates] = useState([]);
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [loading, setLoading] = useState(true);

  const load = () => {
    const stored = read(RATES_KEY, []);
    setRates(stored);
    if (stored.length > 0) {
      const nonUSD = stored.find((r) => r.code !== "USD");
      if (nonUSD && to === "EUR" && !stored.some((r) => r.code === "EUR")) {
        setTo(nonUSD.code);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const onStorage = (e) => {
      if (e.key === RATES_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allRates = useMemo(
    () => [
      {
        code: "USD",
        name: "US Dollar",
        flag: "🇺🇸",
        buyRate: 1,
        sellRate: 1,
      },
      ...rates.filter((r) => r.code !== "USD"),
    ],
    [rates],
  );

  const fromRate = allRates.find((r) => r.code === from);
  const toRate = allRates.find((r) => r.code === to);

  const result = useMemo(() => {
    if (!fromRate || !toRate || !amount) return null;
    const n = Number(amount);
    if (Number.isNaN(n)) return null;
    const inUSD = n / fromRate.sellRate;
    return inUSD * toRate.buyRate;
  }, [amount, fromRate, toRate]);

  const rate = useMemo(() => {
    if (!fromRate || !toRate) return null;
    return toRate.buyRate / fromRate.sellRate;
  }, [fromRate, toRate]);

  const format = (n) =>
    Number(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className={styles.calculator}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <FiRepeat /> Convert any currency
        </div>
        <h1 className={styles.heroTitle}>Currency calculator</h1>
        <p className={styles.heroSubtitle}>
          Check what your money is worth using our live rates. Conversions use
          the same rates shown on the rates page.
        </p>
      </section>

      {loading ?
        <div className={styles.stateBox}>Loading calculator...</div>
      : <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Convert now</h2>
            <button className={styles.refreshBtn} onClick={load}>
              <FiRefreshCw />
            </button>
          </div>

          <div className={styles.field}>
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className={styles.input}
              placeholder="0.00"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="from">From</label>
              <select
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className={styles.select}>
                {allRates.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.flag} {r.code} — {r.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={styles.swapBtn}
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              aria-label="Swap currencies"
              title="Swap currencies">
              <FiRepeat />
            </button>

            <div className={styles.field}>
              <label htmlFor="to">To</label>
              <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={styles.select}>
                {allRates.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.flag} {r.code} — {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.resultCard}>
            <div className={styles.resultLabel}>You get</div>
            <div className={styles.resultValue}>
              {result !== null ? format(result) : "—"}
              <span className={styles.resultCode}>{to}</span>
            </div>
            {rate !== null && (
              <div className={styles.rateLine}>
                <FiTrendingUp /> 1 {from} = {format(rate)} {to}
              </div>
            )}
          </div>

          <p className={styles.disclaimer}>
            Rates are indicative and may vary slightly at the moment of
            exchange. Review the final rate on the confirmation step.
          </p>
        </div>
      }

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Like this rate?</h2>
          <p>Lock it in and start your exchange in under a minute.</p>
          <a href="/exchange" className={styles.ctaButton}>
            Start an exchange <FiArrowRight />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Calculator;
