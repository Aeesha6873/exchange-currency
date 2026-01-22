import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCheck,
  FiClock,
  FiX,
  FiCreditCard,
  FiTrendingUp,
  FiArrowRight,
  FiPercent,
  FiUsers,
  FiActivity,
} from "react-icons/fi";
import styles from "./ExchangeTransaction.module.css";

const ExchangeTransactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  const transactions = [
    {
      id: "EXC-001",
      user: "John Smith",
      email: "john@email.com",
      fromCurrency: "USD",
      toCurrency: "EUR",
      amount: 2500,
      rate: 0.92,
      received: 2300,
      fee: 25,
      status: "completed",
      date: "Jan 15, 10:30 AM",
      method: "Bank Transfer",
      transactionId: "TXN123456",
      userInitial: "J",
    },
    {
      id: "EXC-002",
      user: "Emma Wilson",
      email: "emma@email.com",
      fromCurrency: "GBP",
      toCurrency: "USD",
      amount: 1800,
      rate: 1.27,
      received: 2286,
      fee: 18,
      status: "processing",
      date: "Jan 15, 09:15 AM",
      method: "Credit Card",
      transactionId: "TXN123457",
      userInitial: "E",
    },
    {
      id: "EXC-003",
      user: "David Chen",
      email: "david@email.com",
      fromCurrency: "CAD",
      toCurrency: "GBP",
      amount: 3500,
      rate: 0.58,
      received: 2030,
      fee: 35,
      status: "pending",
      date: "Jan 14, 02:20 PM",
      method: "Bank Transfer",
      transactionId: "TXN123458",
      userInitial: "D",
    },
    {
      id: "EXC-004",
      user: "Sarah Johnson",
      email: "sarah@email.com",
      fromCurrency: "EUR",
      toCurrency: "JPY",
      amount: 1200,
      rate: 158.5,
      received: 190200,
      fee: 12,
      status: "completed",
      date: "Jan 14, 11:45 AM",
      method: "Digital Wallet",
      transactionId: "TXN123459",
      userInitial: "S",
    },
    {
      id: "EXC-005",
      user: "Michael Brown",
      email: "michael@email.com",
      fromCurrency: "AUD",
      toCurrency: "USD",
      amount: 800,
      rate: 0.67,
      received: 536,
      fee: 8,
      status: "failed",
      date: "Jan 13, 04:30 PM",
      method: "Credit Card",
      transactionId: "TXN123460",
      userInitial: "M",
    },
    {
      id: "EXC-006",
      user: "Lisa Wang",
      email: "lisa@email.com",
      fromCurrency: "USD",
      toCurrency: "CNY",
      amount: 5000,
      rate: 7.18,
      received: 35900,
      fee: 50,
      status: "completed",
      date: "Jan 13, 01:15 PM",
      method: "Bank Transfer",
      transactionId: "TXN123461",
      userInitial: "L",
    },
    {
      id: "EXC-007",
      user: "Robert Garcia",
      email: "robert@email.com",
      fromCurrency: "MXN",
      toCurrency: "USD",
      amount: 10000,
      rate: 0.058,
      received: 580,
      fee: 10,
      status: "processing",
      date: "Jan 12, 10:00 AM",
      method: "Digital Wallet",
      transactionId: "TXN123462",
      userInitial: "R",
    },
    {
      id: "EXC-008",
      user: "Maria Rodriguez",
      email: "maria@email.com",
      fromCurrency: "USD",
      toCurrency: "MXN",
      amount: 1500,
      rate: 17.24,
      received: 25860,
      fee: 15,
      status: "completed",
      date: "Jan 12, 09:30 AM",
      method: "Bank Transfer",
      transactionId: "TXN123463",
      userInitial: "M",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === "completed").length,
    volume: transactions.reduce((sum, t) => sum + t.amount, 0),
    revenue: transactions.reduce((sum, t) => sum + t.fee, 0),
    volumeChange: "+12.5%",
    transactionChange: "+8.3%",
    completedChange: "+15.2%",
    revenueChange: "+18.7%",
  };

  const handleViewTransaction = (transactionId) => {
    navigate(`/exchange/transactions/${transactionId}`);
  };

  const handleApproveTransaction = (transactionId) => {
    if (window.confirm("Approve this exchange transaction?")) {
      console.log(`Approving transaction ${transactionId}`);
    }
  };

  const handleRejectTransaction = (transactionId) => {
    if (window.confirm("Reject this exchange transaction?")) {
      console.log(`Rejecting transaction ${transactionId}`);
    }
  };

  const handleExportReport = () => {
    navigate("/reports/exchange");
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: <FiCheck />,
      processing: <FiClock />,
      pending: <FiClock />,
      failed: <FiX />,
    };
    return icons[status] || <FiCheck />;
  };

  return (
    <div className={styles.exchangeTransactions}>
      {/* Header - Matching User Management Style */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <div className={styles.titleIcon}>
              <FiDollarSign />
            </div>
            Exchange Transactions
          </h1>
          <p className={styles.subtitle}>
            Monitor and manage all currency exchange transactions
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.exportBtn} onClick={handleExportReport}>
            <FiDownload />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiDollarSign />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ${stats.volume.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Total Volume</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> {stats.volumeChange}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUsers />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Transactions</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> {stats.transactionChange}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiCheck />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Completed</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> {stats.completedChange}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiActivity />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>${stats.revenue}</div>
            <div className={styles.statLabel}>Revenue</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> {stats.revenueChange}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by user, transaction ID, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={styles.dateSelect}>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table with Balanced Columns */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderRow}>
            <div className={styles.tableCell}>Transaction ID</div>
            <div className={styles.tableCell}>User</div>
            <div className={styles.tableCell}>Exchange Details</div>
            <div className={styles.tableCell}>Amount</div>
            <div className={styles.tableCell}>Fee</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCell}>Date</div>
            <div className={styles.tableCellActions}>Actions</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.tableRow}>
              <div>
                <div className={styles.transactionId}>
                  {transaction.id}
                  <div className={styles.transactionSub}>
                    {transaction.transactionId}
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {transaction.userInitial}
                  </div>
                  <div className={styles.userDetails}>
                    <div className={styles.userName}>{transaction.user}</div>
                    <div className={styles.userEmail}>{transaction.email}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.exchangeDetails}>
                  <div className={styles.currencyPair}>
                    <span className={styles.currencyFrom}>
                      {transaction.amount.toLocaleString()}{" "}
                      {transaction.fromCurrency}
                    </span>
                    <FiArrowRight className={styles.arrow} />
                    <span className={styles.currencyTo}>
                      {transaction.received.toLocaleString()}{" "}
                      {transaction.toCurrency}
                    </span>
                  </div>
                  <div className={styles.exchangeRate}>
                    Rate: {transaction.rate} {transaction.toCurrency}/
                    {transaction.fromCurrency}
                  </div>
                  <div className={styles.paymentMethod}>
                    <FiCreditCard /> {transaction.method}
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.amountInfo}>
                  <div className={styles.amountMain}>
                    ${transaction.amount.toLocaleString()}
                  </div>
                  <div className={styles.amountSub}>
                    ${transaction.received.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.feeAmount}>${transaction.fee}</div>
              </div>

              <div>
                <span
                  className={`${styles.statusBadge} ${
                    styles[transaction.status]
                  }`}>
                  {getStatusIcon(transaction.status)}
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </span>
              </div>

              <div>
                <div className={styles.dateInfo}>{transaction.date}</div>
              </div>

              <div>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleViewTransaction(transaction.id)}
                    title="View Details">
                    <FiEye /> View
                  </button>
                  {transaction.status === "pending" && (
                    <>
                      <button
                        className={styles.actionBtnApprove}
                        onClick={() => handleApproveTransaction(transaction.id)}
                        title="Approve Transaction">
                        <FiCheck /> Approve
                      </button>
                      <button
                        className={styles.actionBtnReject}
                        onClick={() => handleRejectTransaction(transaction.id)}
                        title="Reject Transaction">
                        <FiX /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExchangeTransactions;
