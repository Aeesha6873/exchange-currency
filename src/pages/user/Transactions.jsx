import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Transactions.module.css";
import {
  FiTrendingUp,
  FiDownload,
  FiEye,
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiChevronRight,
  FiPrinter,
  FiMail,
  FiShare2,
  FiX,
  FiArrowDownRight,
} from "react-icons/fi";
import { MdCompareArrows, MdAccountBalance } from "react-icons/md";
import { authApi, transactionsApi } from "../../services/api";

function Transactions() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2026-12-31",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    (async () => {
      const rows = await transactionsApi.list(currentUser.id);
      setTransactions(rows);
      setLoading(false);
    })();
  }, [navigate]);

  const transactionTypes = [
    { id: "all", label: "All Exchanges" },
    { id: "completed", label: "Completed" },
    { id: "pending", label: "Pending" },
    { id: "failed", label: "Failed" },
  ];

  const quickActions = [
    {
      id: 1,
      label: "New Exchange",
      icon: <MdCompareArrows />,
      path: "/dashboard/exchange",
      description: "Convert currencies instantly",
    },
    {
      id: 2,
      label: "Exchange Rates",
      icon: <FiTrendingUp />,
      path: "/dashboard/rates",
      description: "Live currency rates",
    },
    {
      id: 3,
      label: "History",
      icon: <FiClock />,
      path: "/dashboard/history",
      description: "View past exchanges",
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = activeFilter === "all" || t.status === activeFilter;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      t.description?.toLowerCase().includes(q) ||
      t.reference?.toLowerCase().includes(q) ||
      t.fromCurrency?.toLowerCase().includes(q) ||
      t.toCurrency?.toLowerCase().includes(q);

    const tDate = new Date(t.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);
    const matchesDateRange = tDate >= startDate && tDate <= endDate;

    return matchesFilter && matchesSearch && matchesDateRange;
  });

  const getTypeIcon = () => <MdCompareArrows />;
  const getTypeColor = () => "#10b981";

  const getStatusBadge = (status) => {
    const badges = {
      completed: (
        <span className={styles.statusBadgeCompleted}>
          <FiCheckCircle /> Completed
        </span>
      ),
      pending: (
        <span className={styles.statusBadgePending}>
          <FiClock /> Pending
        </span>
      ),
      failed: (
        <span className={styles.statusBadgeFailed}>
          <FiX /> Failed
        </span>
      ),
    };
    return badges[status] || badges.pending;
  };

  const calculateTotals = () => {
    const totals = {
      volume: 0,
      fees: 0,
      profit: 0,
      transactionCount: transactions.length,
    };
    transactions.forEach((t) => {
      totals.volume += t.amount;
      totals.fees += t.fee || 0;
      if (t.status === "completed") totals.profit += t.amount * 0.005;
    });
    return totals;
  };

  const totals = calculateTotals();

  const handleViewDetails = (t) => setSelectedTransaction(t);
  const handleCloseDetails = () => setSelectedTransaction(null);
  const handleExportCSV = () => alert("Exporting exchange history as CSV...");
  const handleDownloadReceipt = (t) =>
    alert(`Downloading receipt for ${t.reference}...`);

  const formatCurrency = (amount, currency = "USD") => {
    if (currency === "JPY") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "JPY",
        minimumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatDateTime = (dateString, timeString) =>
    `${formatDate(dateString)} • ${timeString}`;

  const getTopCurrencies = () => {
    const counts = {};
    transactions.forEach((t) => {
      counts[t.fromCurrency] = (counts[t.fromCurrency] || 0) + 1;
      counts[t.toCurrency] = (counts[t.toCurrency] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([c]) => c);
  };

  const topCurrencies = getTopCurrencies();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading exchange history...</p>
      </div>
    );
  }

  return (
    <div className={styles.transactionsContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Exchange History</h1>
          <p className={styles.subtitle}>
            Track all your currency exchange transactions
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportButton} onClick={handleExportCSV}>
            <FiDownload /> Export History
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={`${styles.statItem} ${styles.statVolume}`}>
          <span className={styles.statNumber}>
            {formatCurrency(totals.volume)}
          </span>
          <span className={styles.statLabel}>Exchange Volume</span>
        </div>
        <div className={`${styles.statItem} ${styles.statFees}`}>
          <span className={styles.statNumber}>
            {formatCurrency(totals.fees)}
          </span>
          <span className={styles.statLabel}>Total Fees</span>
        </div>
        <div className={`${styles.statItem} ${styles.statProfit}`}>
          <span className={styles.statNumber}>
            {formatCurrency(totals.profit)}
          </span>
          <span className={styles.statLabel}>Estimated Profit</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{totals.transactionCount}</span>
          <span className={styles.statLabel}>Total Exchanges</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by currency, reference, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.dateFilter}>
            <FiCalendar className={styles.dateIcon} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className={styles.dateInput}
            />
            <span className={styles.dateSeparator}>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className={styles.dateInput}
            />
          </div>
        </div>

        <div className={styles.filters}>
          {transactionTypes.map((type) => (
            <button
              key={type.id}
              className={`${styles.filterBtn} ${
                activeFilter === type.id ? styles.active : ""
              }`}
              onClick={() => setActiveFilter(type.id)}>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            <div className={styles.transactionsList}>
              {filteredTransactions.length > 0 ?
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className={styles.transactionCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.transactionType}>
                        <div
                          className={styles.typeIcon}
                          style={{ color: getTypeColor(transaction.type) }}>
                          {getTypeIcon(transaction.type)}
                        </div>
                        <div className={styles.typeInfo}>
                          <div className={styles.typeLabel}>
                            Currency Exchange
                          </div>
                          <div className={styles.transactionReference}>
                            #{transaction.reference}
                          </div>
                        </div>
                      </div>
                      <div className={styles.transactionDate}>
                        {formatDateTime(transaction.date, transaction.time)}
                      </div>
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.exchangeRow}>
                        <div className={styles.exchangeFrom}>
                          <div className={styles.currencyAmount}>
                            {formatCurrency(
                              transaction.fromAmount,
                              transaction.fromCurrency,
                            )}
                          </div>
                          <div className={styles.currencyCode}>
                            {transaction.fromCurrency}
                          </div>
                        </div>
                        <div className={styles.exchangeArrow}>→</div>
                        <div className={styles.exchangeTo}>
                          <div className={styles.currencyAmount}>
                            {formatCurrency(
                              transaction.toAmount,
                              transaction.toCurrency,
                            )}
                          </div>
                          <div className={styles.currencyCode}>
                            {transaction.toCurrency}
                          </div>
                        </div>
                      </div>

                      <div className={styles.exchangeDetails}>
                        <div className={styles.detailItem}>
                          <FiDollarSign className={styles.detailIcon} />
                          <div>
                            <div className={styles.detailLabel}>
                              Exchange Rate
                            </div>
                            <div className={styles.detailValue}>
                              1 {transaction.fromCurrency} ={" "}
                              {transaction.exchangeRate}{" "}
                              {transaction.toCurrency}
                            </div>
                          </div>
                        </div>

                        <div className={styles.detailItem}>
                          <MdAccountBalance className={styles.detailIcon} />
                          <div>
                            <div className={styles.detailLabel}>Platform</div>
                            <div className={styles.detailValue}>
                              {transaction.bank} • {transaction.account}
                            </div>
                          </div>
                        </div>

                        <div className={styles.detailItem}>
                          <FiCheckCircle className={styles.detailIcon} />
                          <div>
                            <div className={styles.detailLabel}>Status</div>
                            <div className={styles.detailValue}>
                              {getStatusBadge(transaction.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.amountSection}>
                        <div
                          className={`${styles.transactionAmount} ${
                            transaction.direction === "in" ?
                              styles.amountIn
                            : styles.amountOut
                          }`}>
                          {transaction.direction === "in" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className={styles.transactionDateSmall}>
                          Fee: {formatCurrency(transaction.fee || 0)}
                        </div>
                      </div>

                      <div className={styles.actionButtons}>
                        <button
                          className={styles.viewButton}
                          onClick={() => handleViewDetails(transaction)}>
                          <FiEye /> Details
                        </button>
                        <button
                          className={styles.downloadButton}
                          onClick={() => handleDownloadReceipt(transaction)}>
                          <FiDownload /> Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : <div className={styles.emptyState}>
                  <MdCompareArrows className={styles.emptyIcon} />
                  <h3>No exchange transactions found</h3>
                  <p>
                    {searchQuery || activeFilter !== "all" ?
                      "No transactions match your search criteria"
                    : "You haven't made any currency exchanges yet"}
                  </p>
                  {activeFilter !== "all" && (
                    <button
                      className={styles.clearFiltersButton}
                      onClick={() => {
                        setActiveFilter("all");
                        setSearchQuery("");
                      }}>
                      Clear Filters
                    </button>
                  )}
                </div>
              }
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Quick Actions</h3>
              <div className={styles.quickActions}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className={styles.quickAction}
                    onClick={() => navigate(action.path)}>
                    <div className={styles.quickActionIcon}>{action.icon}</div>
                    <div className={styles.quickActionContent}>
                      <div className={styles.quickActionTitle}>
                        {action.label}
                      </div>
                      <div className={styles.quickActionDescription}>
                        {action.description}
                      </div>
                    </div>
                    <FiChevronRight className={styles.quickActionArrow} />
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Top Currencies</h3>
              <div className={styles.currencyChart}>
                {topCurrencies.length === 0 ?
                  <p style={{ color: "#64748b", fontSize: 14 }}>
                    No exchanges yet.
                  </p>
                : topCurrencies.map((currency, index) => {
                    const percentage = [40, 65, 85][index] || 30;
                    return (
                      <div key={currency} className={styles.chartItem}>
                        <div className={styles.chartIcon}>
                          <FiDollarSign />
                        </div>
                        <div className={styles.chartContent}>
                          <div className={styles.chartLabel}>{currency}</div>
                          <div className={styles.chartBar}>
                            <div
                              className={styles.chartFill}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiClock /> Recent Activity
              </h3>
              <div className={styles.activityList}>
                {transactions.slice(0, 3).map((t) => (
                  <div key={t.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <FiArrowDownRight />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityText}>
                        {t.fromCurrency} to {t.toCurrency} exchange {t.status}
                      </div>
                      <div className={styles.activityTime}>
                        {formatDate(t.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTransaction && (
        <div className={styles.modalOverlay} onClick={handleCloseDetails}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <div
                  className={styles.modalTypeIcon}
                  style={{ color: getTypeColor(selectedTransaction.type) }}>
                  {getTypeIcon(selectedTransaction.type)}
                </div>
                <div>
                  <h2>Currency Exchange Details</h2>
                  <p className={styles.modalReference}>
                    #{selectedTransaction.reference}
                  </p>
                </div>
              </div>
              <button
                className={styles.modalClose}
                onClick={handleCloseDetails}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <div className={styles.modalStatus}>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div className={styles.modalDates}>
                  <div className={styles.dateInfo}>
                    <FiCalendar />
                    <span>
                      <strong>Date:</strong>{" "}
                      {formatDate(selectedTransaction.date)}
                    </span>
                  </div>
                  <div className={styles.dateInfo}>
                    <FiClock />
                    <span>
                      <strong>Time:</strong> {selectedTransaction.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.modalExchange}>
                <div className={styles.exchangeDisplay}>
                  <div className={styles.exchangeFromLarge}>
                    <div className={styles.amountLarge}>
                      {formatCurrency(
                        selectedTransaction.fromAmount,
                        selectedTransaction.fromCurrency,
                      )}
                    </div>
                    <div className={styles.currencyLarge}>
                      {selectedTransaction.fromCurrency}
                    </div>
                  </div>
                  <div className={styles.exchangeArrowLarge}>→</div>
                  <div className={styles.exchangeToLarge}>
                    <div className={styles.amountLarge}>
                      {formatCurrency(
                        selectedTransaction.toAmount,
                        selectedTransaction.toCurrency,
                      )}
                    </div>
                    <div className={styles.currencyLarge}>
                      {selectedTransaction.toCurrency}
                    </div>
                  </div>
                </div>
                <div className={styles.exchangeInfo}>
                  <div className={styles.exchangeRate}>
                    Exchange Rate: 1 {selectedTransaction.fromCurrency} ={" "}
                    {selectedTransaction.exchangeRate}{" "}
                    {selectedTransaction.toCurrency}
                  </div>
                  <div className={styles.exchangeFee}>
                    Fee: {formatCurrency(selectedTransaction.fee)}
                  </div>
                </div>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailCard}>
                  <h3>Transaction Details</h3>
                  <div className={styles.detailList}>
                    <div className={styles.detailRow}>
                      <span>Reference:</span>
                      <span>#{selectedTransaction.reference}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Direction:</span>
                      <span>
                        {selectedTransaction.direction === "in" ?
                          "Incoming"
                        : "Outgoing"}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Platform:</span>
                      <span>{selectedTransaction.bank}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Account:</span>
                      <span>{selectedTransaction.account}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h3>Financial Details</h3>
                  <div className={styles.detailList}>
                    <div className={styles.detailRow}>
                      <span>Amount:</span>
                      <span className={styles.transactionAmount}>
                        {selectedTransaction.direction === "in" ? "+" : "-"}
                        {formatCurrency(selectedTransaction.amount)}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Fee:</span>
                      <span>{formatCurrency(selectedTransaction.fee)}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Net Amount:</span>
                      <span className={styles.transactionAmount}>
                        {formatCurrency(
                          selectedTransaction.direction === "in" ?
                            selectedTransaction.amount - selectedTransaction.fee
                          : selectedTransaction.amount +
                              selectedTransaction.fee,
                        )}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Rate Applied:</span>
                      <span>{selectedTransaction.rate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalActions}>
                <button
                  className={styles.modalButton}
                  onClick={() => handleDownloadReceipt(selectedTransaction)}>
                  <FiDownload /> Download Receipt
                </button>
                <button className={styles.modalButtonSecondary}>
                  <FiPrinter /> Print
                </button>
                <button className={styles.modalButtonSecondary}>
                  <FiMail /> Email Receipt
                </button>
                <button className={styles.modalButtonSecondary}>
                  <FiShare2 /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
