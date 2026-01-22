import React, { useState, useEffect } from "react";
import styles from "./Transactions.module.css";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiFilter,
  FiDownload,
  FiEye,
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiArrowUpRight,
  FiArrowDownRight,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiChevronRight,
  FiPrinter,
  FiMail,
  FiShare2,
} from "react-icons/fi";
import {
  MdFlight,
  MdHotel,
  MdCompareArrows,
  MdAccountBalance,
} from "react-icons/md";

function Transactions() {
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
    // Simulate API call
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 1,
          type: "exchange",
          direction: "in",
          amount: 1500.0,
          currency: "USD to EUR",
          date: "2024-12-01",
          time: "14:30",
          status: "completed",
          reference: "EX-789012",
          rate: "0.92",
          fee: 15.0,
          description: "Currency Exchange",
          category: "exchange",
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
          type: "flight",
          direction: "out",
          amount: 650.0,
          description: "Paris Flight Booking",
          date: "2024-11-28",
          time: "10:15",
          status: "completed",
          reference: "FLT-456789",
          category: "travel",
          airline: "Air France",
          flight: "AF123",
          passengers: 2,
          departure: "JFK",
          arrival: "CDG",
          bookingDate: "2024-11-25",
        },
        {
          id: 3,
          type: "hotel",
          direction: "out",
          amount: 1200.0,
          description: "Bali Resort Booking",
          date: "2024-11-25",
          time: "16:45",
          status: "completed",
          reference: "HTL-123456",
          category: "accommodation",
          hotel: "Grand Bali Resort",
          checkIn: "2024-12-20",
          checkOut: "2024-12-25",
          rooms: 1,
          guests: 2,
        },
        {
          id: 4,
          type: "deposit",
          direction: "in",
          amount: 2000.0,
          description: "Bank Transfer",
          date: "2024-11-20",
          time: "09:20",
          status: "completed",
          reference: "DEP-789123",
          category: "deposit",
          bank: "Chase Bank",
          account: "****7890",
          method: "Wire Transfer",
        },
        {
          id: 5,
          type: "exchange",
          direction: "out",
          amount: 500.0,
          currency: "USD to GBP",
          date: "2024-11-15",
          time: "11:30",
          status: "pending",
          reference: "EX-456123",
          rate: "0.79",
          fee: 10.0,
          description: "Currency Exchange",
          category: "exchange",
          bank: "Revolut",
          account: "****1234",
          exchangeRate: 0.79,
          fromAmount: 500,
          fromCurrency: "USD",
          toAmount: 395,
          toCurrency: "GBP",
        },
        {
          id: 6,
          type: "withdrawal",
          direction: "out",
          amount: 300.0,
          description: "ATM Withdrawal",
          date: "2024-11-10",
          time: "14:20",
          status: "completed",
          reference: "WDL-987654",
          category: "withdrawal",
          bank: "Bank of America",
          account: "****5678",
          location: "NYC ATM",
        },
        {
          id: 7,
          type: "refund",
          direction: "in",
          amount: 250.0,
          description: "Flight Cancellation Refund",
          date: "2024-11-05",
          time: "11:45",
          status: "completed",
          reference: "RFN-321654",
          category: "refund",
          reason: "Flight cancellation",
          originalBooking: "FLT-111111",
        },
        {
          id: 8,
          type: "tour",
          direction: "out",
          amount: 350.0,
          description: "Tokyo City Tour",
          date: "2024-10-30",
          time: "09:30",
          status: "completed",
          reference: "TR-159753",
          category: "activities",
          tour: "Tokyo City Tour",
          duration: "8 hours",
          participants: 4,
        },
      ];
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const transactionTypes = [
    { id: "all", label: "All Transactions", color: "#64748b" },
    { id: "exchange", label: "Currency Exchange", color: "#10b981" },
    { id: "flight", label: "Flights", color: "#3b82f6" },
    { id: "hotel", label: "Hotels", color: "#8b5cf6" },
    { id: "deposit", label: "Deposits", color: "#f59e0b" },
    { id: "withdrawal", label: "Withdrawals", color: "#ef4444" },
    { id: "refund", label: "Refunds", color: "#06b6d4" },
    { id: "tour", label: "Tours", color: "#ec4899" },
  ];

  const quickActions = [
    {
      id: 1,
      label: "Currency Exchange",
      icon: <MdCompareArrows />,
      path: "/dashboard/exchange",
      description: "Convert currencies instantly",
      color: "var(--green)",
    },
    {
      id: 2,
      label: "Travel Agency",
      icon: <FiArrowUpRight />,
      path: "/dashboard/flight",
      description: "hotels, tours, packages",
      color: "var(--orange)",
    },
    {
      id: 3,
      label: "Book Flight",
      icon: <FiTrendingUp />,
      path: "/dashboard/analytics",
      description: "domestic and international",
      color: "var(--dark-green)",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      activeFilter === "all" || transaction.type === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.currency &&
        transaction.currency.toLowerCase().includes(searchQuery.toLowerCase()));

    const transactionDate = new Date(transaction.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Include entire end date

    const matchesDateRange =
      transactionDate >= startDate && transactionDate <= endDate;

    return matchesFilter && matchesSearch && matchesDateRange;
  });

  const getTypeIcon = (type) => {
    const icons = {
      exchange: <MdCompareArrows />,
      flight: <MdFlight />,
      hotel: <MdHotel />,
      deposit: <FiArrowDownRight />,
      withdrawal: <FiArrowUpRight />,
      refund: <FiRefreshCw />,
      tour: <FiTrendingUp />,
    };
    return icons[type] || <FiDollarSign />;
  };

  const getTypeColor = (type) => {
    const colors = {
      exchange: "#10b981",
      flight: "#3b82f6",
      hotel: "#8b5cf6",
      deposit: "#f59e0b",
      withdrawal: "#ef4444",
      refund: "#06b6d4",
      tour: "#ec4899",
    };
    return colors[type] || "#64748b";
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
          <FiAlertCircle /> Failed
        </span>
      ),
      cancelled: (
        <span className={styles.statusBadgeCancelled}>
          <FiAlertCircle /> Cancelled
        </span>
      ),
    };
    return badges[status] || badges.pending;
  };

  const calculateTotals = () => {
    const totals = {
      income: 0,
      expense: 0,
      exchangeVolume: 0,
      transactionCount: transactions.length,
    };

    transactions.forEach((t) => {
      if (t.direction === "in") {
        totals.income += t.amount;
      } else {
        totals.expense += t.amount;
      }

      if (t.type === "exchange") {
        totals.exchangeVolume += t.amount;
      }
    });

    totals.net = totals.income - totals.expense;
    totals.savings = totals.income * 0.05; // Simulated savings from exchanges
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
    alert("Exporting transactions as CSV...");
  };

  const handleDownloadReceipt = (transaction) => {
    alert(`Downloading receipt for ${transaction.reference}...`);
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString, timeString) => {
    return `${formatDate(dateString)} • ${timeString}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className={styles.transactionsContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Transaction History</h1>
              <p className={styles.heroSubtitle}>
                Track all your financial activities across travel, currency
                exchange, and payments
              </p>
            </div>
            <button className={styles.exportButton} onClick={handleExportCSV}>
              <FiDownload /> Export Statement
            </button>
          </div>

          {/* Summary Cards */}
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <div
                className={styles.summaryIcon}
                style={{ background: "rgba(249, 115, 22, 0.1)" }}>
                <FiTrendingDown style={{ color: "#f97316" }} />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryLabel}>Total Expense</div>
                <div
                  className={styles.summaryAmount}
                  style={{ color: "#f97316" }}>
                  {formatCurrency(totals.expense)}
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div
                className={styles.summaryIcon}
                style={{ background: "rgba(6, 78, 59, 0.1)" }}>
                <MdCompareArrows style={{ color: "#064e3b" }} />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryLabel}>Exchange Volume</div>
                <div
                  className={styles.summaryAmount}
                  style={{ color: "#064e3b" }}>
                  {formatCurrency(totals.exchangeVolume)}
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div
                className={styles.summaryIcon}
                style={{ background: "rgba(100, 116, 139, 0.1)" }}>
                <FiCreditCard style={{ color: "#10b981" }} />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryLabel}>Transactions</div>
                <div
                  className={styles.summaryAmount}
                  style={{ color: "#10b981" }}>
                  {totals.transactionCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Search and Filters */}
            <div className={styles.searchFiltersCard}>
              <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                  <FiSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search transactions by description, reference, or amount..."
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

              {/* Filter Chips */}
              <div className={styles.filterChips}>
                {transactionTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`${styles.filterChip} ${
                      activeFilter === type.id ? styles.active : ""
                    }`}
                    onClick={() => setActiveFilter(type.id)}
                    style={{
                      borderColor: activeFilter === type.id ? type.color : "",
                      color: activeFilter === type.id ? type.color : "",
                    }}>
                    {getTypeIcon(type.id)}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            <div className={styles.transactionsList}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className={styles.transactionCard}>
                    <div className={styles.transactionHeader}>
                      <div className={styles.transactionType}>
                        <div
                          className={styles.typeIcon}
                          style={{ color: getTypeColor(transaction.type) }}>
                          {getTypeIcon(transaction.type)}
                        </div>
                        <div className={styles.typeInfo}>
                          <div className={styles.typeLabel}>
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                          </div>
                          <div className={styles.transactionReference}>
                            {transaction.reference}
                          </div>
                        </div>
                      </div>
                      <div className={styles.transactionDate}>
                        {formatDateTime(transaction.date, transaction.time)}
                      </div>
                    </div>

                    <div className={styles.transactionContent}>
                      <div className={styles.transactionInfo}>
                        <div className={styles.transactionDescription}>
                          <h3 className={styles.description}>
                            {transaction.description}
                          </h3>
                          {transaction.currency && (
                            <div className={styles.transactionDetail}>
                              {transaction.currency}
                            </div>
                          )}
                          {transaction.airline && (
                            <div className={styles.transactionDetail}>
                              {transaction.airline} ({transaction.flight})
                            </div>
                          )}
                          {transaction.hotel && (
                            <div className={styles.transactionDetail}>
                              {transaction.hotel}
                            </div>
                          )}
                          {transaction.bank && (
                            <div className={styles.transactionDetail}>
                              {transaction.bank} • {transaction.account}
                            </div>
                          )}
                        </div>

                        <div className={styles.transactionMeta}>
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Status:</span>
                            <div className={styles.metaValue}>
                              {getStatusBadge(transaction.status)}
                            </div>
                          </div>
                          {transaction.fee > 0 && (
                            <div className={styles.metaItem}>
                              <span className={styles.metaLabel}>Fee:</span>
                              <span className={styles.metaValue}>
                                {formatCurrency(transaction.fee)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.transactionActions}>
                        <div className={styles.amountSection}>
                          <div
                            className={`${styles.amount} ${
                              transaction.direction === "in"
                                ? styles.amountIn
                                : styles.amountOut
                            }`}>
                            {transaction.direction === "in" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </div>
                          {transaction.direction === "out" &&
                            transaction.type === "exchange" && (
                              <div className={styles.exchangeInfo}>
                                <span className={styles.exchangeRate}>
                                  Rate: {transaction.rate}
                                </span>
                                <span className={styles.receivedAmount}>
                                  Received:{" "}
                                  {formatCurrency(
                                    transaction.toAmount,
                                    transaction.toCurrency
                                  )}
                                </span>
                              </div>
                            )}
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
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <FiCreditCard className={styles.emptyIcon} />
                  <h3>No transactions found</h3>
                  <p>
                    {searchQuery || activeFilter !== "all"
                      ? "No transactions match your search criteria"
                      : "You don't have any transactions yet"}
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
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Quick Actions</h3>
              <div className={styles.quickActions}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className={styles.quickAction}
                    style={{ borderLeftColor: action.color }}>
                    <div
                      className={styles.quickActionIcon}
                      style={{ color: action.color }}>
                      {action.icon}
                    </div>
                    <div className={styles.quickActionContent}>
                      <div className={styles.quickActionTitle}>
                        {action.label}
                      </div>
                      <div className={styles.quickActionDescription}>
                        {action.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Spending Summary */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Spending Summary</h3>
              <div className={styles.spendingSummary}>
                <div className={styles.spendingItem}>
                  <div className={styles.spendingLabel}>Travel</div>
                  <div className={styles.spendingAmount}>
                    {formatCurrency(
                      transactions
                        .filter((t) =>
                          ["flight", "hotel", "tour"].includes(t.type)
                        )
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </div>
                  <div className={styles.spendingProgress}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: "65%",
                        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                      }}></div>
                  </div>
                </div>
                <div className={styles.spendingItem}>
                  <div className={styles.spendingLabel}>Currency Exchange</div>
                  <div className={styles.spendingAmount}>
                    {formatCurrency(totals.exchangeVolume)}
                  </div>
                  <div className={styles.spendingProgress}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: "45%",
                        background: "linear-gradient(90deg, #10b981, #0d9488)",
                      }}></div>
                  </div>
                </div>
                <div className={styles.spendingItem}>
                  <div className={styles.spendingLabel}>Bookings</div>
                  <div className={styles.spendingAmount}>
                    {formatCurrency(
                      transactions
                        .filter((t) =>
                          ["deposit", "withdrawal"].includes(t.type)
                        )
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </div>
                  <div className={styles.spendingProgress}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: "30%",
                        background: "linear-gradient(90deg, #f59e0b, #ea580c)",
                      }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiClock /> Recent Activity
              </h3>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div
                    className={styles.activityIcon}
                    style={{ color: "#10b981" }}>
                    <MdCompareArrows />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Currency exchange completed
                    </div>
                    <div className={styles.activityTime}>Today, 14:30</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div
                    className={styles.activityIcon}
                    style={{ color: "#3b82f6" }}>
                    <MdFlight />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Flight booking confirmed
                    </div>
                    <div className={styles.activityTime}>Yesterday, 10:15</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div
                    className={styles.activityIcon}
                    style={{ color: "#f59e0b" }}>
                    <FiArrowDownRight />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>Deposit received</div>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Transaction Details</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseDetails}>
                <FiChevronRight />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.transactionSummary}>
                <div className={styles.summaryHeader}>
                  <div
                    className={styles.summaryIcon}
                    style={{ color: getTypeColor(selectedTransaction.type) }}>
                    {getTypeIcon(selectedTransaction.type)}
                  </div>
                  <div className={styles.summaryInfo}>
                    <h3 className={styles.summaryTitle}>
                      {selectedTransaction.description}
                    </h3>
                    <div className={styles.summaryReference}>
                      Reference: {selectedTransaction.reference}
                    </div>
                  </div>
                  <div className={styles.summaryAmount}>
                    <div
                      className={`${styles.amount} ${
                        selectedTransaction.direction === "in"
                          ? styles.amountIn
                          : styles.amountOut
                      }`}>
                      {selectedTransaction.direction === "in" ? "+" : "-"}
                      {formatCurrency(selectedTransaction.amount)}
                    </div>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>

                <div className={styles.summaryDetails}>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>
                      Transaction Information
                    </h4>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Date & Time:</span>
                        <span className={styles.detailValue}>
                          {formatDateTime(
                            selectedTransaction.date,
                            selectedTransaction.time
                          )}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Type:</span>
                        <span className={styles.detailValue}>
                          {selectedTransaction.type.charAt(0).toUpperCase() +
                            selectedTransaction.type.slice(1)}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Direction:</span>
                        <span className={styles.detailValue}>
                          {selectedTransaction.direction === "in"
                            ? "Incoming"
                            : "Outgoing"}
                        </span>
                      </div>
                      {selectedTransaction.category && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Category:</span>
                          <span className={styles.detailValue}>
                            {selectedTransaction.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedTransaction.type === "exchange" && (
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailTitle}>Exchange Details</h4>
                      <div className={styles.exchangeDetails}>
                        <div className={styles.exchangeRow}>
                          <div className={styles.exchangeFrom}>
                            <div className={styles.exchangeAmount}>
                              {formatCurrency(
                                selectedTransaction.fromAmount,
                                selectedTransaction.fromCurrency
                              )}
                            </div>
                            <div className={styles.exchangeCurrency}>
                              {selectedTransaction.fromCurrency}
                            </div>
                          </div>
                          <div className={styles.exchangeArrow}>→</div>
                          <div className={styles.exchangeTo}>
                            <div className={styles.exchangeAmount}>
                              {formatCurrency(
                                selectedTransaction.toAmount,
                                selectedTransaction.toCurrency
                              )}
                            </div>
                            <div className={styles.exchangeCurrency}>
                              {selectedTransaction.toCurrency}
                            </div>
                          </div>
                        </div>
                        <div className={styles.exchangeInfo}>
                          <div className={styles.exchangeRate}>
                            Exchange Rate: {selectedTransaction.exchangeRate}
                          </div>
                          <div className={styles.exchangeFee}>
                            Fee: {formatCurrency(selectedTransaction.fee)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>Payment Information</h4>
                    <div className={styles.detailGrid}>
                      {selectedTransaction.bank && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Bank:</span>
                          <span className={styles.detailValue}>
                            {selectedTransaction.bank}
                          </span>
                        </div>
                      )}
                      {selectedTransaction.account && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Account:</span>
                          <span className={styles.detailValue}>
                            {selectedTransaction.account}
                          </span>
                        </div>
                      )}
                      {selectedTransaction.method && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Method:</span>
                          <span className={styles.detailValue}>
                            {selectedTransaction.method}
                          </span>
                        </div>
                      )}
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
