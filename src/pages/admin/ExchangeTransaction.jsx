import React, { useState } from "react";
import {
  FiDollarSign,
  FiSearch,
  FiDownload,
  FiEye,
  FiCheck,
  FiClock,
  FiX,
} from "react-icons/fi";
import styles from "./ExchangeTransaction.module.css";

const ExchangeTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const transactions = [
    {
      id: "EXC-001",
      user: "John Smith",
      fromCurrency: "USD",
      toCurrency: "EUR",
      amount: 2500,
      received: 2300,
      fee: 25,
      status: "completed",
      date: "Jan 15",
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
      date: "Jan 15",
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
      date: "Jan 14",
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
      date: "Jan 14",
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
      date: "Jan 13",
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
      date: "Jan 13",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>
          <FiDollarSign /> Exchange Transactions
        </h1>
        <button className={styles.exportBtn}>
          <FiDownload /> Export
        </button>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            $
            {transactions
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </div>
          <div className={styles.statLabel}>Total Volume</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{transactions.length}</div>
          <div className={styles.statLabel}>Transactions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {transactions.filter((t) => t.status === "completed").length}
          </div>
          <div className={styles.statLabel}>Completed</div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.search}>
          <FiSearch />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filter}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
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
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className={styles.id}>{t.id}</div>
                </td>
                <td>
                  <div className={styles.user}>
                    <div className={styles.userInitial}>{t.user.charAt(0)}</div>
                    <div className={styles.userName}>{t.user}</div>
                  </div>
                </td>
                <td>
                  <div className={styles.exchange}>
                    <div className={styles.currencies}>
                      {t.fromCurrency} → {t.toCurrency}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.amounts}>
                    <div className={styles.sent}>
                      ${t.amount.toLocaleString()}
                    </div>
                    <div className={styles.received}>
                      ${t.received.toLocaleString()}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.fee}>${t.fee}</div>
                </td>
                <td>
                  <div className={`${styles.status} ${styles[t.status]}`}>
                    {t.status === "completed" && <FiCheck />}
                    {t.status === "processing" && <FiClock />}
                    {t.status === "pending" && <FiClock />}
                    {t.status === "failed" && <FiX />}
                    {t.status}
                  </div>
                </td>
                <td>
                  <div className={styles.date}>{t.date}</div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.viewBtn} title="View">
                      <FiEye />
                    </button>
                    {t.status === "pending" && (
                      <>
                        <button className={styles.approveBtn} title="Approve">
                          <FiCheck />
                        </button>
                        <button className={styles.rejectBtn} title="Reject">
                          <FiX />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExchangeTransactions;
