import React, { useState } from "react";
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
} from "react-icons/fi";
import styles from "./ExchangeRate.module.css";

const ExchangeRates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRate, setEditingRate] = useState(null);
  const [editedValue, setEditedValue] = useState("");

  const currencies = [
    {
      code: "USD",
      name: "US Dollar",
      flag: "🇺🇸",
      buyRate: 1.0,
      sellRate: 1.0,
      change: 0.0,
      status: "stable",
    },
    {
      code: "EUR",
      name: "Euro",
      flag: "🇪🇺",
      buyRate: 0.92,
      sellRate: 0.915,
      change: -0.25,
      status: "down",
    },
    {
      code: "GBP",
      name: "British Pound",
      flag: "🇬🇧",
      buyRate: 0.79,
      sellRate: 0.785,
      change: 0.15,
      status: "up",
    },
    {
      code: "JPY",
      name: "Japanese Yen",
      flag: "🇯🇵",
      buyRate: 148.5,
      sellRate: 148.0,
      change: 0.35,
      status: "up",
    },
    {
      code: "CAD",
      name: "Canadian Dollar",
      flag: "🇨🇦",
      buyRate: 1.35,
      sellRate: 1.345,
      change: -0.1,
      status: "down",
    },
    {
      code: "AUD",
      name: "Australian Dollar",
      flag: "🇦🇺",
      buyRate: 1.52,
      sellRate: 1.515,
      change: 0.2,
      status: "up",
    },
    {
      code: "CHF",
      name: "Swiss Franc",
      flag: "🇨🇭",
      buyRate: 0.88,
      sellRate: 0.875,
      change: -0.05,
      status: "stable",
    },
    {
      code: "CNY",
      name: "Chinese Yuan",
      flag: "🇨🇳",
      buyRate: 7.18,
      sellRate: 7.15,
      change: 0.08,
      status: "up",
    },
    {
      code: "INR",
      name: "Indian Rupee",
      flag: "🇮🇳",
      buyRate: 83.0,
      sellRate: 82.8,
      change: -0.12,
      status: "down",
    },
    {
      code: "MXN",
      name: "Mexican Peso",
      flag: "🇲🇽",
      buyRate: 17.2,
      sellRate: 17.1,
      change: 0.25,
      status: "up",
    },
    {
      code: "SGD",
      name: "Singapore Dollar",
      flag: "🇸🇬",
      buyRate: 1.34,
      sellRate: 1.335,
      change: -0.03,
      status: "stable",
    },
    {
      code: "NZD",
      name: "New Zealand Dollar",
      flag: "🇳🇿",
      buyRate: 1.63,
      sellRate: 1.625,
      change: 0.18,
      status: "up",
    },
  ];

  const filteredCurrencies = currencies.filter((currency) => {
    return (
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const stats = {
    totalCurrencies: currencies.length,
    lastUpdated: "2 min ago",
    avgSpread: "0.5%",
    mostVolatile: "JPY",
  };

  const handleEditRate = (currency, type) => {
    setEditingRate({ currency: currency.code, type });
    setEditedValue(currency[type === "buy" ? "buyRate" : "sellRate"]);
  };

  const handleSaveRate = () => {
    console.log(
      `Updated ${editingRate.currency} ${editingRate.type} rate to ${editedValue}`
    );
    setEditingRate(null);
    setEditedValue("");
  };

  const handleCancelEdit = () => {
    setEditingRate(null);
    setEditedValue("");
  };

  const refreshRates = () => {
    console.log("Refreshing exchange rates...");
  };

  return (
    <div className={styles.exchangeRates}>
      {/* Header - Matching User Management Style */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <div className={styles.titleIcon}>
              <FiDollarSign />
            </div>
            Exchange Rates
          </h1>
          <p className={styles.subtitle}>
            Live currency exchange rates and management
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.refreshBtn} onClick={refreshRates}>
            <FiRefreshCw />
            Refresh Rates
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

      {/* Search and Info */}
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
          <div className={styles.infoText}>Rates update every 15 minutes</div>
        </div>
      </div>

      {/* Rates Table with Balanced Columns */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderRow}>
            <div className={styles.tableCell}>Currency</div>
            <div className={styles.tableCell}>Buy Rate (USD)</div>
            <div className={styles.tableCell}>Sell Rate (USD)</div>
            <div className={styles.tableCell}>Spread</div>
            <div className={styles.tableCell}>24h Change</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCellActions}>Actions</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {filteredCurrencies.map((currency) => {
            const spread = (
              ((currency.sellRate - currency.buyRate) / currency.buyRate) *
              100
            ).toFixed(2);

            return (
              <div key={currency.code} className={styles.tableRow}>
                <div>
                  <div className={styles.currencyInfo}>
                    <div className={styles.currencyFlag}>{currency.flag}</div>
                    <div>
                      <div className={styles.currencyCode}>{currency.code}</div>
                      <div className={styles.currencyName}>{currency.name}</div>
                    </div>
                  </div>
                </div>

                <div>
                  {editingRate?.currency === currency.code &&
                  editingRate?.type === "buy" ? (
                    <div className={styles.editContainer}>
                      <input
                        type="number"
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        className={styles.editInput}
                        step="0.0001"
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
                  ) : (
                    <div
                      className={styles.rateValue}
                      onClick={() => handleEditRate(currency, "buy")}
                      title="Click to edit">
                      {currency.buyRate.toFixed(4)}
                      <FiEdit2 className={styles.editIcon} />
                    </div>
                  )}
                </div>

                <div>
                  {editingRate?.currency === currency.code &&
                  editingRate?.type === "sell" ? (
                    <div className={styles.editContainer}>
                      <input
                        type="number"
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        className={styles.editInput}
                        step="0.0001"
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
                  ) : (
                    <div
                      className={styles.rateValue}
                      onClick={() => handleEditRate(currency, "sell")}
                      title="Click to edit">
                      {currency.sellRate.toFixed(4)}
                      <FiEdit2 className={styles.editIcon} />
                    </div>
                  )}
                </div>

                <div>
                  <div
                    className={`${styles.spreadValue} ${
                      parseFloat(spread) > 0.5 ? styles.highSpread : ""
                    }`}>
                    {spread}%
                  </div>
                </div>

                <div>
                  <div className={styles.changeIndicator}>
                    {currency.change > 0 ? (
                      <>
                        <FiTrendingUp className={styles.changeIconUp} />
                        <span className={styles.changePositive}>
                          +{currency.change.toFixed(2)}%
                        </span>
                      </>
                    ) : currency.change < 0 ? (
                      <>
                        <FiTrendingDown className={styles.changeIconDown} />
                        <span className={styles.changeNegative}>
                          {currency.change.toFixed(2)}%
                        </span>
                      </>
                    ) : (
                      <span className={styles.changeNeutral}>
                        {currency.change.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span
                    className={styles.statusBadge}
                    style={{
                      background:
                        currency.status === "up"
                          ? "rgba(16, 185, 129, 0.1)"
                          : currency.status === "down"
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(107, 114, 128, 0.1)",
                      color:
                        currency.status === "up"
                          ? "var(--green)"
                          : currency.status === "down"
                          ? "#ef4444"
                          : "var(--gray)",
                    }}>
                    {currency.status.charAt(0).toUpperCase() +
                      currency.status.slice(1)}
                  </span>
                </div>

                <div>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.actionBtn} ${styles.buyEdit}`}
                      onClick={() => handleEditRate(currency, "buy")}
                      title="Edit Buy Rate">
                      <FiEdit2 /> Edit Buy
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.sellEdit}`}
                      onClick={() => handleEditRate(currency, "sell")}
                      title="Edit Sell Rate">
                      <FiEdit2 /> Edit Sell
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Currency Section */}
      <div className={styles.addCurrencySection}>
        <h3 className={styles.addCurrencyTitle}>
          <FiDollarSign />
          Add New Currency
        </h3>
        <div className={styles.addCurrencyForm}>
          <input
            type="text"
            placeholder="Currency Code (e.g., BRL)"
            className={styles.addInput}
          />
          <input
            type="text"
            placeholder="Currency Name"
            className={styles.addInput}
          />
          <input
            type="number"
            placeholder="Buy Rate"
            step="0.0001"
            className={styles.addInput}
          />
          <input
            type="number"
            placeholder="Sell Rate"
            step="0.0001"
            className={styles.addInput}
          />
          <button className={styles.addBtn}>Add Currency</button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRates;
