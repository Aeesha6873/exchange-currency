import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Transactions.module.css";
import {
  FiTrendingUp,
  FiFilter,
  FiDownload,
  FiEye,
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCheckCircle,
  FiClock,
  FiChevronRight,
  FiPrinter,
  FiMail,
  FiShare2,
  FiX,
} from "react-icons/fi";
import { MdCompareArrows, MdAccountBalance } from "react-icons/md";

function Transactions() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-12-31",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 1,
          type: "exchange",
          direction: "in",
          amount: 1500.0,
          date: "2024-12-01",
          time: "14:30",
          status: "completed",
          reference: "EX-789012",
          rate: "0.92",
          fee: 15.0,
          description: "USD to EUR Exchange",
          bank: "Wise",
          account: "****4523",
          exchangeRate: 0.92,
          fromAmount: 1500,
          fromCurrency: "USD",
          toAmount: 1380,
          toCurrency: "EUR",
        },
        {
          id: 2,
          type: "exchange",
          direction: "out",
          amount: 500.0,
          date: "2024-11-15",
          time: "11:30",
          status: "pending",
          reference: "EX-456123",
          rate: "0.79",
          fee: 10.0,
          description: "USD to GBP Exchange",
          bank: "Revolut",
          account: "****1234",
          exchangeRate: 0.79,
          fromAmount: 500,
          fromCurrency: "USD",
          toAmount: 395,
          toCurrency: "GBP",
        },
        {
          id: 3,
          type: "exchange",
          direction: "in",
          amount: 1200.0,
          date: "2024-11-10",
          time: "09:45",
          status: "completed",
          reference: "EX-789456",
          rate: "1.35",
          fee: 12.0,
          description: "EUR to USD Exchange",
          bank: "TransferWise",
          account: "****7890",
          exchangeRate: 1.35,
          fromAmount: 1200,
          fromCurrency: "EUR",
          toAmount: 1620,
          toCurrency: "USD",
        },
        {
          id: 4,
          type: "exchange",
          direction: "out",
          amount: 800.0,
          date: "2024-11-05",
          time: "16:20",
          status: "completed",
          reference: "EX-123789",
          rate: "110.5",
          fee: 8.0,
          description: "USD to JPY Exchange",
          bank: "Revolut",
          account: "****4567",
          exchangeRate: 110.5,
          fromAmount: 800,
          fromCurrency: "USD",
          toAmount: 88400,
          toCurrency: "JPY",
        },
        {
          id: 5,
          type: "exchange",
          direction: "in",
          amount: 2500.0,
          date: "2024-10-28",
          time: "13:15",
          status: "completed",
          reference: "EX-987654",
          rate: "1.12",
          fee: 25.0,
          description: "GBP to EUR Exchange",
          bank: "Wise",
          account: "****8910",
          exchangeRate: 1.12,
          fromAmount: 2500,
          fromCurrency: "GBP",
          toAmount: 2800,
          toCurrency: "EUR",
        },
        {
          id: 6,
          type: "exchange",
          direction: "out",
          amount: 300.0,
          date: "2024-10-20",
          time: "10:45",
          status: "failed",
          reference: "EX-654321",
          rate: "0.85",
          fee: 0.0,
          description: "EUR to CHF Exchange",
          bank: "Revolut",
          account: "****2345",
          exchangeRate: 0.85,
          fromAmount: 300,
          fromCurrency: "EUR",
          toAmount: 255,
          toCurrency: "CHF",
        },
      ];
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      activeFilter === "all" || transaction.status === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.fromCurrency
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.toCurrency.toLowerCase().includes(searchQuery.toLowerCase());

    const transactionDate = new Date(transaction.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    const matchesDateRange =
      transactionDate >= startDate && transactionDate <= endDate;

    return matchesFilter && matchesSearch && matchesDateRange;
  });

  const getTypeIcon = () => {
    return <MdCompareArrows />;
  };

  const getTypeColor = () => {
    return "#10b981";
  };

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
      if (t.status === "completed") {
        totals.profit += t.amount * 0.005;
      }
    });

    return totals;
  };

  const totals = calculateTotals();

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };

  const handleExportCSV = () => {
    alert("Exporting exchange history as CSV...");
  };

  const handleDownloadReceipt = (transaction) => {
    alert(`Downloading receipt for ${transaction.reference}...`);
  };

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
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString, timeString) => {
    return `${formatDate(dateString)} • ${timeString}`;
  };

  const getTopCurrencies = () => {
    const currencyCount = {};
    transactions.forEach((t) => {
      currencyCount[t.fromCurrency] = (currencyCount[t.fromCurrency] || 0) + 1;
      currencyCount[t.toCurrency] = (currencyCount[t.toCurrency] || 0) + 1;
    });

    return Object.entries(currencyCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([currency]) => currency);
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
      {/* Header */}
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

      {/* Stats */}
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

      {/* Controls */}
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

        {/* Filters */}
        <div className={styles.filters}>
          {transactionTypes.map((type) => (
            <button
              key={type.id}
              className={`${styles.filterBtn} ${activeFilter === type.id ? styles.active : ""}`}
              onClick={() => setActiveFilter(type.id)}>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column - Transactions List */}
          <div className={styles.leftColumn}>
            <div className={styles.transactionsList}>
              {filteredTransactions.length > 0 ?
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className={styles.transactionCard}>
                    {/* Card Header */}
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

                    {/* Card Content */}
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

                    {/* Card Footer */}
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

          {/* Right Column - Sidebar */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
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

            {/* Top Currencies */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Top Currencies</h3>
              <div className={styles.currencyChart}>
                {topCurrencies.map((currency, index) => {
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
                            style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiClock /> Recent Activity
              </h3>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <MdCompareArrows />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      USD to EUR exchange completed
                    </div>
                    <div className={styles.activityTime}>Today, 14:30</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <FiArrowDownRight />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Exchange fee updated
                    </div>
                    <div className={styles.activityTime}>Yesterday, 10:15</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <FiTrendingUp />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      EUR rates improved
                    </div>
                    <div className={styles.activityTime}>2 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
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
