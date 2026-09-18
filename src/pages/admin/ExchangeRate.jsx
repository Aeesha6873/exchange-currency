import React, { useState, useEffect, useMemo } from "react";
import {
  FiDollarSign,
  FiSearch,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiGlobe,
  FiClock,
  FiEdit2,
  FiSave,
  FiX,
  FiPercent,
  FiActivity,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import styles from "./ExchangeRate.module.css";

const RATES_KEY = "exchangeRates";

const read = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seed only if storage is empty
const DEFAULT_RATES = [
  {
    code: "USD",
    name: "US Dollar",
    flag: "🇺🇸",
    buyRate: 1.0,
    sellRate: 1.0,
    status: "stable",
  },
  {
    code: "EUR",
    name: "Euro",
    flag: "🇪🇺",
    buyRate: 0.92,
    sellRate: 0.915,
    status: "down",
  },
  {
    code: "GBP",
    name: "British Pound",
    flag: "🇬🇧",
    buyRate: 0.79,
    sellRate: 0.785,
    status: "up",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    flag: "🇯🇵",
    buyRate: 148.5,
    sellRate: 148.0,
    status: "up",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    flag: "🇨🇦",
    buyRate: 1.35,
    sellRate: 1.345,
    status: "down",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    flag: "🇦🇺",
    buyRate: 1.52,
    sellRate: 1.515,
    status: "up",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    flag: "🇨🇭",
    buyRate: 0.88,
    sellRate: 0.875,
    status: "stable",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    flag: "🇨🇳",
    buyRate: 7.18,
    sellRate: 7.15,
    status: "up",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    flag: "🇮🇳",
    buyRate: 83.0,
    sellRate: 82.8,
    status: "down",
  },
  {
    code: "NGN",
    name: "Nigerian Naira",
    flag: "🇳🇬",
    buyRate: 1500,
    sellRate: 1490,
    status: "stable",
  },
];

const ExchangeRates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRate, setEditingRate] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [rates, setRates] = useState([]);
  const [newCurrency, setNewCurrency] = useState({
    code: "",
    name: "",
    flag: "",
    buyRate: "",
    sellRate: "",
  });

  // Load on mount + seed once
  useEffect(() => {
    let stored = read(RATES_KEY, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      write(RATES_KEY, DEFAULT_RATES);
      stored = DEFAULT_RATES;
    }
    setRates(stored);

    const onStorage = (e) => {
      if (e.key === RATES_KEY) setRates(read(RATES_KEY, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (next) => {
    setRates(next);
    write(RATES_KEY, next);
  };

  const filteredCurrencies = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return rates;
    return rates.filter(
      (c) =>
        c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [rates, searchTerm]);

  const stats = useMemo(() => {
    const total = rates.length;
    const mostVolatile =
      rates.length === 0 ?
        "—"
      : rates.reduce((best, r) => {
          const spread = Math.abs(r.sellRate - r.buyRate);
          const bestSpread = Math.abs(best.sellRate - best.buyRate);
          return spread > bestSpread ? r : best;
        }).code;

    const avgSpread =
      rates.length === 0 ?
        "0%"
      : (
          rates.reduce((sum, r) => {
            const s = ((r.sellRate - r.buyRate) / r.buyRate) * 100;
            return sum + Math.abs(s);
          }, 0) / rates.length
        ).toFixed(2) + "%";

    return {
      totalCurrencies: total,
      lastUpdated: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avgSpread,
      mostVolatile,
    };
  }, [rates]);

  /* ---------------- editing ---------------- */

  const handleEditRate = (currency, type) => {
    setEditingRate({ currency: currency.code, type });
    setEditedValue(currency[type === "buy" ? "buyRate" : "sellRate"]);
  };

  const handleSaveRate = () => {
    if (!editingRate) return;
    const numeric = parseFloat(editedValue);
    if (Number.isNaN(numeric) || numeric <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    const next = rates.map((c) => {
      if (c.code !== editingRate.currency) return c;
      const patch =
        editingRate.type === "buy" ?
          { buyRate: numeric }
        : { sellRate: numeric };
      // Recompute status from the direction of change vs previous value
      const prev = c[editingRate.type === "buy" ? "buyRate" : "sellRate"];
      const status =
        numeric > prev ? "up"
        : numeric < prev ? "down"
        : "stable";
      return { ...c, ...patch, status, updatedAt: new Date().toISOString() };
    });

    persist(next);
    setEditingRate(null);
    setEditedValue("");
  };

  const handleCancelEdit = () => {
    setEditingRate(null);
    setEditedValue("");
  };

  /* ---------------- delete / add ---------------- */

  const handleDeleteCurrency = (code) => {
    if (!window.confirm(`Remove ${code} from exchange rates?`)) return;
    persist(rates.filter((c) => c.code !== code));
  };

  const handleAddCurrency = () => {
    const code = newCurrency.code.trim().toUpperCase();
    const name = newCurrency.name.trim();
    const buy = parseFloat(newCurrency.buyRate);
    const sell = parseFloat(newCurrency.sellRate);

    if (!code || code.length < 2) {
      alert("Enter a valid currency code (e.g. BRL)");
      return;
    }
    if (!name) {
      alert("Enter a currency name");
      return;
    }
    if (Number.isNaN(buy) || buy <= 0 || Number.isNaN(sell) || sell <= 0) {
      alert("Buy and sell rates must be positive numbers");
      return;
    }
    if (rates.some((r) => r.code === code)) {
      alert(`${code} already exists`);
      return;
    }

    persist([
      ...rates,
      {
        code,
        name,
        flag: newCurrency.flag.trim() || "🏳️",
        buyRate: buy,
        sellRate: sell,
        status: "stable",
        updatedAt: new Date().toISOString(),
      },
    ]);

    setNewCurrency({ code: "", name: "", flag: "", buyRate: "", sellRate: "" });
  };

  /* ---------------- refresh ---------------- */

  const refreshRates = () => {
    // In a real app this would fetch live rates. Here we just re-read storage
    // (in case another tab changed them) and nudge the timestamp.
    const stored = read(RATES_KEY, rates);
    persist(stored);
    alert("Rates reloaded from storage.");
  };

  return (
    <div className={styles.exchangeRates}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <div className={styles.titleIcon}>
              <FiDollarSign />
            </div>
            Exchange Rates
          </h1>
          <p className={styles.subtitle}>
            Manage the rates your users see during exchange
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.refreshBtn} onClick={refreshRates}>
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiGlobe />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalCurrencies}</div>
            <div className={styles.statLabel}>Currencies</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiClock />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.lastUpdated}</div>
            <div className={styles.statLabel}>Last Updated</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiPercent />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.avgSpread}</div>
            <div className={styles.statLabel}>Avg Spread</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiActivity />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.mostVolatile}</div>
            <div className={styles.statLabel}>Most Volatile</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={styles.controlsSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search currencies by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.infoBox}>
          <FiAlertCircle className={styles.infoIcon} />
          <div className={styles.infoText}>
            Changes you save here apply to user exchanges immediately
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderRow}>
            <div className={styles.tableCell}>Currency</div>
            <div className={styles.tableCell}>Buy Rate (USD)</div>
            <div className={styles.tableCell}>Sell Rate (USD)</div>
            <div className={styles.tableCell}>Spread</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCellActions}>Actions</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {filteredCurrencies.length === 0 ?
            <div className={styles.emptyRow}>
              <FiDollarSign size={24} />
              <p>
                {rates.length === 0 ?
                  "No currencies yet. Add one below."
                : "No currencies match your search."}
              </p>
            </div>
          : filteredCurrencies.map((currency) => {
              const spread = (
                ((currency.sellRate - currency.buyRate) / currency.buyRate) *
                100
              ).toFixed(2);

              const statusColor =
                currency.status === "up" ?
                  { bg: "rgba(16,185,129,0.1)", fg: "#059669" }
                : currency.status === "down" ?
                  { bg: "rgba(239,68,68,0.1)", fg: "#dc2626" }
                : { bg: "rgba(107,114,128,0.1)", fg: "#6b7280" };

              return (
                <div key={currency.code} className={styles.tableRow}>
                  {/* Currency */}
                  <div className={styles.currencyInfo}>
                    <div className={styles.currencyFlag}>{currency.flag}</div>
                    <div>
                      <div className={styles.currencyCode}>{currency.code}</div>
                      <div className={styles.currencyName}>{currency.name}</div>
                    </div>
                  </div>

                  {/* Buy */}
                  <div>
                    {(
                      editingRate?.currency === currency.code &&
                      editingRate?.type === "buy"
                    ) ?
                      <div className={styles.editContainer}>
                        <input
                          type="number"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className={styles.editInput}
                          step="0.0001"
                          autoFocus
                        />
                        <div className={styles.editActions}>
                          <button
                            onClick={handleSaveRate}
                            className={styles.saveBtn}
                            title="Save">
                            <FiSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={styles.cancelBtn}
                            title="Cancel">
                            <FiX />
                          </button>
                        </div>
                      </div>
                    : <div
                        className={styles.rateValue}
                        onClick={() => handleEditRate(currency, "buy")}
                        title="Click to edit">
                        {Number(currency.buyRate).toFixed(4)}
                        <FiEdit2 className={styles.editIcon} />
                      </div>
                    }
                  </div>

                  {/* Sell */}
                  <div>
                    {(
                      editingRate?.currency === currency.code &&
                      editingRate?.type === "sell"
                    ) ?
                      <div className={styles.editContainer}>
                        <input
                          type="number"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className={styles.editInput}
                          step="0.0001"
                          autoFocus
                        />
                        <div className={styles.editActions}>
                          <button
                            onClick={handleSaveRate}
                            className={styles.saveBtn}
                            title="Save">
                            <FiSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={styles.cancelBtn}
                            title="Cancel">
                            <FiX />
                          </button>
                        </div>
                      </div>
                    : <div
                        className={styles.rateValue}
                        onClick={() => handleEditRate(currency, "sell")}
                        title="Click to edit">
                        {Number(currency.sellRate).toFixed(4)}
                        <FiEdit2 className={styles.editIcon} />
                      </div>
                    }
                  </div>

                  {/* Spread */}
                  <div
                    className={`${styles.spreadValue} ${
                      parseFloat(spread) > 0.5 ? styles.highSpread : ""
                    }`}>
                    {spread}%
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={styles.statusBadge}
                      style={{
                        background: statusColor.bg,
                        color: statusColor.fg,
                      }}>
                      {currency.status.charAt(0).toUpperCase() +
                        currency.status.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.actionBtn} ${styles.buyEdit}`}
                      onClick={() => handleEditRate(currency, "buy")}
                      title="Edit Buy Rate">
                      <FiEdit2 /> Buy
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.sellEdit}`}
                      onClick={() => handleEditRate(currency, "sell")}
                      title="Edit Sell Rate">
                      <FiEdit2 /> Sell
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteCurrency(currency.code)}
                      title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Add currency */}
      <div className={styles.addCurrencySection}>
        <h3 className={styles.addCurrencyTitle}>
          <FiPlus />
          Add New Currency
        </h3>
        <div className={styles.addCurrencyForm}>
          <input
            type="text"
            placeholder="Code (BRL)"
            value={newCurrency.code}
            onChange={(e) =>
              setNewCurrency({ ...newCurrency, code: e.target.value })
            }
            className={styles.addInput}
            maxLength={4}
          />
          <input
            type="text"
            placeholder="Name"
            value={newCurrency.name}
            onChange={(e) =>
              setNewCurrency({ ...newCurrency, name: e.target.value })
            }
            className={styles.addInput}
          />
          <input
            type="text"
            placeholder="Flag (emoji)"
            value={newCurrency.flag}
            onChange={(e) =>
              setNewCurrency({ ...newCurrency, flag: e.target.value })
            }
            className={styles.addInput}
          />
          <input
            type="number"
            placeholder="Buy Rate"
            step="0.0001"
            value={newCurrency.buyRate}
            onChange={(e) =>
              setNewCurrency({ ...newCurrency, buyRate: e.target.value })
            }
            className={styles.addInput}
          />
          <input
            type="number"
            placeholder="Sell Rate"
            step="0.0001"
            value={newCurrency.sellRate}
            onChange={(e) =>
              setNewCurrency({ ...newCurrency, sellRate: e.target.value })
            }
            className={styles.addInput}
          />
          <button className={styles.addBtn} onClick={handleAddCurrency}>
            Add Currency
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRates;
