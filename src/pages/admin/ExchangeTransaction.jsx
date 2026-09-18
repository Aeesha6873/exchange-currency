import React, { useState, useEffect, useMemo } from "react";
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

const read = (key, fallback = []) => {
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

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const ExchangeTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  /* ---------------------------------------------------------------- */
  /* Load + join with users                                            */
  /* ---------------------------------------------------------------- */

  const load = () => {
    const users = read("users", []);
    const raw = read("transactions", []);

    const enriched = raw
      .map((t) => {
        const user = users.find((u) => String(u.id) === String(t.userId));
        const userName =
          user?.fullName || user?.email || t.userName || "Unknown User";
        const userEmail = user?.email || t.userEmail || "—";

        const fromAmount = Number(t.fromAmount ?? t.amount) || 0;
        const toAmount = Number(t.toAmount) || 0;
        const rate =
          Number(t.exchangeRate ?? t.rate) ||
          (fromAmount > 0 ? toAmount / fromAmount : 0);
        const fee = Number(t.fee) || 0;

        return {
          id: t.id,
          reference: t.reference || t.id,
          userId: t.userId,
          user: userName,
          userEmail,
          fromCurrency: t.fromCurrency || "—",
          toCurrency: t.toCurrency || "—",
          amount: fromAmount,
          received: toAmount,
          fee,
          status: t.status || "pending",
          date: t.createdAt || t.date || null,
          dateDisplay: formatDate(t.createdAt || t.date),
          exchangeRate: rate,
          paymentMethod: t.bank || t.paymentMethod || "—",
          direction: t.direction,
          account: t.account,
          failureReason: t.failureReason || "",
        };
      })
      .sort(
        (a, b) =>
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
      );

    setTransactions(enriched);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const onStorage = (e) => {
      if (["transactions", "users"].includes(e.key)) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ---------------------------------------------------------------- */
  /* Stats                                                             */
  /* ---------------------------------------------------------------- */

  const stats = useMemo(() => {
    return {
      totalVolume: transactions.reduce((s, t) => s + t.amount, 0),
      totalTransactions: transactions.length,
      completed: transactions.filter((t) => t.status === "completed").length,
      totalFees: transactions.reduce((s, t) => s + t.fee, 0),
    };
  }, [transactions]);

  /* ---------------------------------------------------------------- */
  /* Filtering                                                         */
  /* ---------------------------------------------------------------- */

  const filteredTransactions = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return transactions.filter((t) => {
      const matchesSearch =
        !q ||
        t.user.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  /* ---------------------------------------------------------------- */
  /* Persistence helpers                                               */
  /* ---------------------------------------------------------------- */

  const updateTransactionInStorage = (id, patch) => {
    const all = read("transactions", []);
    const updated = all.map((t) =>
      String(t.id) === String(id) ? { ...t, ...patch } : t,
    );
    write("transactions", updated);
    load();
  };

  /* ---------------------------------------------------------------- */
  /* Modals                                                            */
  /* ---------------------------------------------------------------- */

  const openDetailsModal = (t) => {
    setSelectedTransaction(t);
    setShowDetailsModal(true);
  };

  const openRejectModal = (t) => {
    setSelectedTransaction(t);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const openSuccessModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const openConfirmModal = (t, action) => {
    setSelectedTransaction(t);
    setModalTitle(`Confirm ${action}`);
    setModalMessage(
      `Are you sure you want to ${action.toLowerCase()} transaction ${t.reference}?`,
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

  /* ---------------------------------------------------------------- */
  /* Actions                                                           */
  /* ---------------------------------------------------------------- */

  const handleExportData = () => {
    const exportData = filteredTransactions.map((t) => ({
      reference: t.reference,
      user: t.user,
      userEmail: t.userEmail,
      fromCurrency: t.fromCurrency,
      toCurrency: t.toCurrency,
      amount: t.amount,
      received: t.received,
      fee: t.fee,
      exchangeRate: t.exchangeRate,
      status: t.status,
      date: t.date,
      paymentMethod: t.paymentMethod,
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
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
    updateTransactionInStorage(selectedTransaction.id, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    const ref = selectedTransaction.reference;
    closeAllModals();
    openSuccessModal(
      "Transaction Approved",
      `Transaction ${ref} has been approved successfully.`,
    );
  };

  const handleRejectTransaction = () => {
    if (!selectedTransaction || !rejectReason.trim()) return;
    updateTransactionInStorage(selectedTransaction.id, {
      status: "failed",
      failureReason: rejectReason,
      rejectedAt: new Date().toISOString(),
    });
    const ref = selectedTransaction.reference;
    const reason = rejectReason;
    closeAllModals();
    openSuccessModal(
      "Transaction Rejected",
      `Transaction ${ref} has been rejected. Reason: ${reason}`,
    );
  };

  const handleResendNotification = (t) => {
    openSuccessModal(
      "Notification Sent",
      `Notification has been sent to ${t.userEmail} about transaction ${t.reference}.`,
    );
  };

  const handleRefreshData = () => {
    load();
    openSuccessModal(
      "Data Refreshed",
      "Transaction data has been refreshed successfully.",
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  /* ---------------------------------------------------------------- */
  /* Formatting                                                        */
  /* ---------------------------------------------------------------- */

  const formatCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: currency === "JPY" ? 0 : 2,
      }).format(amount);
    } catch {
      return `${amount} ${currency || ""}`;
    }
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className={styles.container}>
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            color: "#64748b",
          }}>
          Loading transactions...
        </div>
      </div>
    );
  }

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

      {/* Stats */}
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
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button className={styles.clearBtn} onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Table */}
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
                        <span className={styles.id}>
                          {transaction.reference}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          {transaction.user.charAt(0).toUpperCase()}
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
                          {transaction.exchangeRate.toFixed(4)}{" "}
                          {transaction.toCurrency}
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
                        {transaction.received > 0 && (
                          <div className={styles.amountReceived}>
                            {formatCurrency(
                              transaction.received,
                              transaction.toCurrency,
                            )}
                          </div>
                        )}
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
                        className={`${styles.status} ${
                          styles[transaction.status]
                        }`}>
                        {transaction.status === "completed" && <FiCheck />}
                        {transaction.status === "pending" && <FiClock />}
                        {transaction.status === "processing" && <FiClock />}
                        {transaction.status === "failed" && <FiX />}
                        <span className={styles.statusText}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.dateCell}>
                        {transaction.dateDisplay}
                      </div>
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
                      <h3>
                        {transactions.length === 0 ?
                          "No transactions yet"
                        : "No transactions found"}
                      </h3>
                      <p>
                        {transactions.length === 0 ?
                          "No users have made any exchanges yet."
                        : "Try adjusting your search or filters."}
                      </p>
                      {transactions.length > 0 && (
                        <button
                          className={styles.clearBtn}
                          onClick={handleClearFilters}>
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
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
                    <FiCreditCard /> Reference
                  </span>
                  <span className={styles.detailValue}>
                    {selectedTransaction.reference}
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
                    {selectedTransaction.exchangeRate.toFixed(4)}{" "}
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

                {selectedTransaction.received > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Amount Received</span>
                    <span className={styles.detailValue}>
                      {formatCurrency(
                        selectedTransaction.received,
                        selectedTransaction.toCurrency,
                      )}
                    </span>
                  </div>
                )}

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fee</span>
                  <span className={styles.detailValue}>
                    {formatCurrency(
                      selectedTransaction.fee,
                      selectedTransaction.fromCurrency,
                    )}
                  </span>
                </div>

                {selectedTransaction.paymentMethod !== "—" && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Platform</span>
                    <span className={styles.detailValue}>
                      {selectedTransaction.paymentMethod}
                    </span>
                  </div>
                )}

                {selectedTransaction.account && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Account</span>
                    <span className={styles.detailValue}>
                      {selectedTransaction.account}
                    </span>
                  </div>
                )}

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status</span>
                  <span
                    className={`${styles.detailValue} ${
                      styles[selectedTransaction.status]
                    }`}>
                    {selectedTransaction.status}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FiCalendar /> Date
                  </span>
                  <span className={styles.detailValue}>
                    {selectedTransaction.dateDisplay}
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

      {/* Reject Modal */}
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
                <strong>{selectedTransaction.reference}</strong>?
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

      {/* Confirm Modal */}
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
                    className={`${styles.previewStatus} ${
                      styles[selectedTransaction.status]
                    }`}>
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
