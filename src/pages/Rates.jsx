import React, { useState, useEffect, useMemo } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiSearch,
  FiRefreshCw,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import styles from "./Rates.module.css";

const RATES_KEY = "exchangeRates";

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const Rates = () => {
  const [rates, setRates] = useState([]);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setRates(read(RATES_KEY, []));
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load();
    const onStorage = (e) => {
      if (e.key === RATES_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rates.filter(
      (r) =>
        !q ||
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q),
    );
  }, [rates, search]);

  const stats = useMemo(() => {
    if (rates.length === 0) return { total: 0, up: 0, down: 0 };
    return {
      total: rates.length,
      up: rates.filter((r) => r.status === "up").length,
      down: rates.filter((r) => r.status === "down").length,
    };
  }, [rates]);

  const formatRate = (n) =>
    Number(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });

  return (
    <div className={styles.rates}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <FiTrendingUp /> Live market data
        </div>
        <h1 className={styles.heroTitle}>Today's exchange rates</h1>
        <p className={styles.heroSubtitle}>
          Rates are managed by our team and update in real time. All values
          shown against the US Dollar.
        </p>
      </section>

      {/* STATS STRIP */}
      <div className={styles.statsStrip}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiDollarSign />
          </div>
          <div>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Currencies tracked</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.up}`}>
            <FiTrendingUp />
          </div>
          <div>
            <div className={styles.statValue}>{stats.up}</div>
            <div className={styles.statLabel}>Trending up</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.down}`}>
            <FiTrendingDown />
          </div>
          <div>
            <div className={styles.statValue}>{stats.down}</div>
            <div className={styles.statLabel}>Trending down</div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search currencies by code or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.refreshBtn} onClick={load}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* CONTENT */}
      {loading ?
        <div className={styles.stateBox}>Loading rates...</div>
      : filtered.length === 0 ?
        <div className={styles.stateBox}>
          <div className={styles.stateIcon}>
            <FiDollarSign />
          </div>
          <h3>
            {rates.length === 0 ?
              "No rates published yet"
            : "No currencies match your search"}
          </h3>
          <p>
            {rates.length === 0 ?
              "Our team is setting up exchange rates. Please check back shortly."
            : "Try a different search term."}
          </p>
        </div>
      : <div className={styles.tableWrapper}>
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Currency</span>
              <span>Buy rate</span>
              <span>Sell rate</span>
              <span>Trend</span>
            </div>
            {filtered.map((r) => (
              <div key={r.code} className={styles.tableRow}>
                <div className={styles.currencyCell}>
                  <span className={styles.flag}>{r.flag || "🌐"}</span>
                  <div>
                    <div className={styles.code}>{r.code}</div>
                    <div className={styles.name}>{r.name}</div>
                  </div>
                </div>
                <div className={styles.rateCell}>
                  <span className={styles.rateValue}>
                    {formatRate(r.buyRate)}
                  </span>
                  <span className={styles.rateLabel}>Buy</span>
                </div>
                <div className={styles.rateCell}>
                  <span className={styles.rateValue}>
                    {formatRate(r.sellRate)}
                  </span>
                  <span className={styles.rateLabel}>Sell</span>
                </div>
                <div className={styles.statusCell}>
                  <span
                    className={`${styles.status} ${
                      styles[r.status] || styles.stable
                    }`}>
                    {r.status === "up" && <FiTrendingUp />}
                    {r.status === "down" && <FiTrendingDown />}
                    {r.status === "up" ?
                      "Up"
                    : r.status === "down" ?
                      "Down"
                    : "Stable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {lastUpdated && (
            <div className={styles.updatedAt}>
              <FiClock /> Last updated{" "}
              {lastUpdated.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      }

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to exchange?</h2>
          <p>Lock in today's rate and send money worldwide.</p>
          <a href="/exchange" className={styles.ctaButton}>
            Start an exchange →
          </a>
        </div>
      </section>
    </div>
  );
};

export default Rates;
