import React, { useState } from "react";
import {
  FiDollarSign,
  FiSearch,
  FiDownload,
  FiEye,
  FiCheck,
  FiClock,
  FiX,
  FiFilter,
  FiUser,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiInfo,
} from "react-icons/fi";
import styles from "./ExchangeTransaction.module.css";

const ExchangeTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState([
    {
      id: "EXC-001",
      user: "John Smith",
      fromCurrency: "USD",
      toCurrency: "EUR",
      amount: 2500,
      received: 2300,
      fee: 25,
      status: "completed",
      date: "Jan 15, 2024",
      userEmail: "john@example.com",
      exchangeRate: 0.92,
      paymentMethod: "Bank Transfer",
    },
    {
      id: "EXC-002",
      user: "Emma Wilson",
      fromCurrency: "GBP",
      toCurrency: "USD",
      amount: 1800,
      received: 2286,
      fee: 18,
      status: "processing",
      date: "Jan 15, 2024",
      userEmail: "emma@example.com",
      exchangeRate: 1.27,
      paymentMethod: "Credit Card",
    },
    {
      id: "EXC-003",
      user: "David Chen",
      fromCurrency: "CAD",
      toCurrency: "GBP",
      amount: 3500,
      received: 2030,
      fee: 35,
      status: "pending",
      date: "Jan 14, 2024",
      userEmail: "david@example.com",
      exchangeRate: 0.58,
      paymentMethod: "Bank Transfer",
    },
    {
      id: "EXC-004",
      user: "Sarah Johnson",
      fromCurrency: "EUR",
      toCurrency: "JPY",
      amount: 1200,
      received: 190200,
      fee: 12,
      status: "completed",
      date: "Jan 14, 2024",
      userEmail: "sarah@example.com",
      exchangeRate: 158.5,
      paymentMethod: "PayPal",
    },
    {
      id: "EXC-005",
      user: "Michael Brown",
      fromCurrency: "AUD",
      toCurrency: "USD",
      amount: 800,
      received: 536,
      fee: 8,
      status: "failed",
      date: "Jan 13, 2024",
      userEmail: "michael@example.com",
      exchangeRate: 0.67,
      paymentMethod: "Credit Card",
      failureReason: "Bank account verification failed",
    },
    {
      id: "EXC-006",
      user: "Lisa Wang",
      fromCurrency: "USD",
      toCurrency: "CNY",
      amount: 5000,
      received: 35900,
      fee: 50,
      status: "completed",
      date: "Jan 13, 2024",
      userEmail: "lisa@example.com",
      exchangeRate: 7.18,
      paymentMethod: "Bank Transfer",
    },
  ]);

  // Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // Calculate stats
  const stats = {
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: transactions.length,
    completed: transactions.filter((t) => t.status === "completed").length,
    totalFees: transactions.reduce((sum, t) => sum + t.fee, 0),
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Modal Functions
  const openDetailsModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const openRejectModal = (transaction) => {
    setSelectedTransaction(transaction);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const openSuccessModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const openConfirmModal = (transaction, action) => {
    setSelectedTransaction(transaction);
    setModalTitle(`Confirm ${action}`);
    setModalMessage(
      `Are you sure you want to ${action.toLowerCase()} transaction ${transaction.id}?`,
    );
    setShowConfirmModal(true);
  };

  const closeAllModals = () => {
    setShowDetailsModal(false);
    setShowRejectModal(false);
    setShowSuccessModal(false);
    setShowConfirmModal(false);
    setSelectedTransaction(null);
    setRejectReason("");
  };

  // Action Functions
  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute(
      "download",
      `exchange_transactions_${new Date().toISOString().split("T")[0]}.json`,
    );
    link.click();

    openSuccessModal(
      "Export Successful",
      "Transaction data has been exported successfully.",
    );
  };

  const handleApproveTransaction = () => {
    if (!selectedTransaction) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTransaction.id ? { ...t, status: "completed" } : t,
      ),
    );

    closeAllModals();
    openSuccessModal(
      "Transaction Approved",
      `Transaction ${selectedTransaction.id} has been approved successfully.`,
    );
  };

  const handleRejectTransaction = () => {
    if (!selectedTransaction || !rejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTransaction.id ?
          {
            ...t,
            status: "failed",
            failureReason: rejectReason,
          }
        : t,
      ),
    );

    closeAllModals();
    openSuccessModal(
      "Transaction Rejected",
      `Transaction ${selectedTransaction.id} has been rejected. Reason: ${rejectReason}`,
    );
  };

  const handleResendNotification = (transaction) => {
    openSuccessModal(
      "Notification Sent",
      `Notification has been sent to ${transaction.userEmail} about transaction ${transaction.id}.`,
    );
  };

  const handleRefreshData = () => {
    openSuccessModal(
      "Data Refreshed",
      "Transaction data has been refreshed successfully.",
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  // Calculate received amount
  const calculateReceived = (transaction) => {
    return transaction.amount * transaction.exchangeRate - transaction.fee;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiDollarSign className={styles.titleIcon} />
            Exchange Transactions
            <span className={styles.badge}>{transactions.length}</span>
          </h1>
          <p className={styles.subtitle}>
            Manage all currency exchange transactions
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.refreshBtn}
            onClick={handleRefreshData}
            title="Refresh data">
            <FiClock /> Refresh
          </button>
          <button className={styles.exportBtn} onClick={handleExportData}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiDollarSign />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ${stats.totalVolume.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Total Volume</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiDollarSign />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalTransactions}</div>
            <div className={styles.statLabel}>Transactions</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiCheck />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiDollarSign />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ${stats.totalFees.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Total Fees</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search transactions, users, or IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchTerm("")}
              title="Clear search">
              ×
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <FiFilter /> Status
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusSelect}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button className={styles.clearBtn} onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Transactions Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>
            Transactions ({filteredTransactions.length})
          </h3>
          <div className={styles.tableInfo}>
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Exchange</th>
                <th>Amount</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ?
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.idCell}>
                        <span className={styles.id}>{transaction.id}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          {transaction.user.charAt(0)}
                        </div>
                        <div className={styles.userInfo}>
                          <div className={styles.userName}>
                            {transaction.user}
                          </div>
                          <div className={styles.userEmail}>
                            {transaction.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.exchangeCell}>
                        <div className={styles.currencies}>
                          <span className={styles.fromCurrency}>
                            {transaction.fromCurrency}
                          </span>
                          <span className={styles.arrow}>→</span>
                          <span className={styles.toCurrency}>
                            {transaction.toCurrency}
                          </span>
                        </div>
                        <div className={styles.exchangeRate}>
                          1 {transaction.fromCurrency} ={" "}
                          {transaction.exchangeRate} {transaction.toCurrency}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.amountCell}>
                        <div className={styles.amountSent}>
                          {formatCurrency(
                            transaction.amount,
                            transaction.fromCurrency,
                          )}
                        </div>
                        <div className={styles.amountReceived}>
                          {formatCurrency(
                            transaction.received,
                            transaction.toCurrency,
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.feeCell}>
                        <span className={styles.fee}>
                          {formatCurrency(
                            transaction.fee,
                            transaction.fromCurrency,
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`${styles.status} ${styles[transaction.status]}`}>
                        {transaction.status === "completed" && <FiCheck />}
                        {transaction.status === "processing" && <FiClock />}
                        {transaction.status === "pending" && <FiClock />}
                        {transaction.status === "failed" && <FiX />}
                        <span className={styles.statusText}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.dateCell}>{transaction.date}</div>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <div className={styles.actionsGroup}>
                          <button
                            className={styles.viewBtn}
                            onClick={() => openDetailsModal(transaction)}
                            title="View Details">
                            <FiEye />
                          </button>

                          {transaction.status === "pending" && (
                            <>
                              <button
                                className={styles.approveBtn}
                                onClick={() =>
                                  openConfirmModal(transaction, "Approve")
                                }
                                title="Approve">
                                <FiCheck />
                              </button>
                              <button
                                className={styles.rejectBtn}
                                onClick={() => openRejectModal(transaction)}
                                title="Reject">
                                <FiX />
                              </button>
                            </>
                          )}

                          {transaction.status === "processing" && (
                            <button
                              className={styles.notifyBtn}
                              onClick={() =>
                                handleResendNotification(transaction)
                              }
                              title="Resend Notification">
                              <FiClock />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              : <tr>
                  <td colSpan="8" className={styles.emptyState}>
                    <div className={styles.emptyContent}>
                      <FiDollarSign className={styles.emptyIcon} />
                      <h3>No transactions found</h3>
                      <p>Try adjusting your search or filters</p>
                      <button
                        className={styles.clearBtn}
                        onClick={handleClearFilters}>
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FiInfo /> Transaction Details
              </h2>
              <button className={styles.modalClose} onClick={closeAllModals}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FiCreditCard /> Transaction ID
                  </span>
                  <span className={styles.detailValue}>
                    {selectedTransaction.id}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FiUser /> User
                  </span>
                  <span className={styles.detailValue}>
                    {selectedTransaction.user}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FiMail /> Email
                  </span>
                  <span className={styles.detailValue}>
                    {selectedTransaction.userEmail}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FiDollarSign /> Exchange
                  </span>
                  <span className={styles.detailValue}>
                    {selectedTransaction.fromCurrency} →{" "}
                    {selectedTransaction.toCurrency}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Exchange Rate</span>
                  <span className={styles.detailValue}>
                    1 {selectedTransaction.fromCurrency} ={" "}
                    {selectedTransaction.exchangeRate}{" "}
                    {selectedTransaction.toCurrency}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Amount Sent</span>
                  <span className={styles.detailValue}>
                    {formatCurrency(
                      selectedTransaction.amount,
                      selectedTransaction.fromCurrency,
                    )}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Amount Received</span>
                  <span className={styles.detailValue}>
                    {formatCurrency(
                      selectedTransaction.received,
                      selectedTransaction.toCurrency,
                    )}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fee</span>
                  <span className={styles.detailValue}>
                    {formatCurrency(
                      selectedTransaction.fee,
                      selectedTransaction.fromCurrency,
                    )}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Payment Method</span>
                  <span className={styles.detailValue}>
                    {selectedTransaction.paymentMethod}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status</span>
                  <span
                    className={`${styles.detailValue} ${styles[selectedTransaction.status]}`}>
                    {selectedTransaction.status}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FiCalendar /> Date
                  </span>
                  <span className={styles.detailValue}>
                    {selectedTransaction.date}
                  </span>
                </div>

                {selectedTransaction.failureReason && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Failure Reason</span>
                    <span className={styles.detailValue}>
                      {selectedTransaction.failureReason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnSecondary}
                onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Transaction Modal */}
      {showRejectModal && selectedTransaction && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FiX /> Reject Transaction
              </h2>
              <button className={styles.modalClose} onClick={closeAllModals}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <p className={styles.modalText}>
                Are you sure you want to reject transaction{" "}
                <strong>{selectedTransaction.id}</strong>?
              </p>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Rejection Reason <span className={styles.required}>*</span>
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnSecondary}
                onClick={closeAllModals}>
                Cancel
              </button>
              <button
                className={styles.modalBtnDanger}
                onClick={handleRejectTransaction}
                disabled={!rejectReason.trim()}>
                Reject Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {showConfirmModal && selectedTransaction && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FiCheck /> {modalTitle}
              </h2>
              <button className={styles.modalClose} onClick={closeAllModals}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <p className={styles.modalText}>{modalMessage}</p>

              <div className={styles.transactionPreview}>
                <div className={styles.previewItem}>
                  <span>User:</span>
                  <strong>{selectedTransaction.user}</strong>
                </div>
                <div className={styles.previewItem}>
                  <span>Amount:</span>
                  <strong>
                    {formatCurrency(
                      selectedTransaction.amount,
                      selectedTransaction.fromCurrency,
                    )}
                  </strong>
                </div>
                <div className={styles.previewItem}>
                  <span>Current Status:</span>
                  <span
                    className={`${styles.previewStatus} ${styles[selectedTransaction.status]}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnSecondary}
                onClick={closeAllModals}>
                Cancel
              </button>
              <button
                className={styles.modalBtnSuccess}
                onClick={handleApproveTransaction}>
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FiCheck /> {modalTitle}
              </h2>
              <button className={styles.modalClose} onClick={closeAllModals}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.successContent}>
                <FiCheck className={styles.successIcon} />
                <p className={styles.modalText}>{modalMessage}</p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnPrimary}
                onClick={closeAllModals}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeTransactions;
