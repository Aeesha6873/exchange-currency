/* components/admin/dashboard/Dashboard.jsx */
import React, { useState, useEffect, useMemo } from "react";
import {
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiPackage,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiGlobe,
} from "react-icons/fi";
import styles from "./AdminDashboard.module.css";

/* ------------------------------------------------------------------ */
/*  Card components (unchanged)                                        */
/* ------------------------------------------------------------------ */

const BalanceCard = ({ title, amount, change, trend, icon, color }) => (
  <div className={styles.balanceCard}>
    <div className={styles.balanceIcon} style={{ color }}>
      {icon}
    </div>
    <div className={styles.balanceContent}>
      <div className={styles.balanceTitle}>{title}</div>
      <div className={styles.balanceAmount}>{amount}</div>
      {change && (
        <div
          className={`${styles.balanceChange} ${
            trend === "up" ? styles.up : styles.down
          }`}>
          {trend === "up" ?
            <FiTrendingUp />
          : <FiTrendingDown />}
          {change}
        </div>
      )}
    </div>
  </div>
);

const MetricCard = ({ title, value, change, icon, color }) => {
  const isPositive = (change || "").startsWith("+");
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon} style={{ color }}>
        {icon}
      </div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricTitle}>{title}</div>
      {change && (
        <div
          className={`${styles.metricChange} ${
            isPositive ? styles.positive : styles.negative
          }`}>
          {isPositive ?
            <FiTrendingUp />
          : <FiTrendingDown />}
          {change}
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ name, metric, progress, icon, color }) => (
  <div className={styles.serviceCard}>
    <div className={styles.serviceIcon} style={{ color }}>
      {icon}
    </div>
    <div className={styles.serviceContent}>
      <div className={styles.serviceName}>{name}</div>
      <div className={styles.serviceMetric}>{metric}</div>
      <div className={styles.serviceProgress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%`, background: color }}
          />
        </div>
        <span className={styles.progressText}>{progress}%</span>
      </div>
    </div>
  </div>
);

const ActivityCard = ({ user, action, time, status }) => (
  <div className={styles.activityCard}>
    <div className={styles.activityAvatar}>
      {(user || "?").charAt(0).toUpperCase()}
    </div>
    <div className={styles.activityContent}>
      <div className={styles.activityUser}>{user}</div>
      <div className={styles.activityAction}>{action}</div>
      <div className={styles.activityTime}>{time}</div>
    </div>
    <div className={styles.activityStatus}>{status}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const currencyFmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

// Bookings store "price" + "currency" — convert to a USD-ish number for
// the totals. If a booking has no price, treat it as 0.
const bookingValue = (b) => Number(b.price) || 0;

// Transaction amount — uses the "amount" field (the source-side amount).
const txnValue = (t) => Number(t.amount) || 0;

const formatRelative = (iso) => {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Math.max(0, Date.now() - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const withinRange = (iso, range) => {
  if (!iso) return true;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return true;
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  if (range === "today") return now - then <= day;
  if (range === "week") return now - then <= 7 * day;
  if (range === "month") return now - then <= 30 * day;
  return true;
};

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    users: [],
    bookings: [],
    transactions: [],
    visaApplications: [],
  });

  const loadAll = () => {
    setData({
      users: read("users", []),
      bookings: read("bookings", []),
      transactions: read("transactions", []),
      visaApplications: read("visaApplications", []),
    });
  };

  useEffect(() => {
    loadAll();

    // Live-update if any other tab writes to storage
    const onStorage = (e) => {
      if (
        ["users", "bookings", "transactions", "visaApplications"].includes(
          e.key,
        )
      ) {
        loadAll();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    loadAll();
    setTimeout(() => setIsLoading(false), 600);
  };

  /* ---------- derived data ---------- */

  const { users, bookings, transactions, visaApplications } = data;

  const stats = useMemo(() => {
    const inRangeBookings = bookings.filter((b) =>
      withinRange(b.createdAt || b.bookingDate || b.date, timeRange),
    );
    const inRangeTxns = transactions.filter((t) =>
      withinRange(t.createdAt || t.date, timeRange),
    );
    const inRangeVisas = visaApplications.filter((v) =>
      withinRange(v.submittedAt, timeRange),
    );
    const inRangeUsers = users.filter((u) =>
      withinRange(u.createdAt || u.joinDate, timeRange),
    );

    // Revenue by vertical
    const exchangeRevenue = inRangeTxns
      .filter((t) => t.status === "completed")
      .reduce((s, t) => s + txnValue(t), 0);

    const flightRevenue = inRangeBookings
      .filter((b) => b.type === "flight" && b.status !== "cancelled")
      .reduce((s, b) => s + bookingValue(b), 0);

    const hotelRevenue = inRangeBookings
      .filter((b) => b.type === "hotel" && b.status !== "cancelled")
      .reduce((s, b) => s + bookingValue(b), 0);

    const visaRevenue = inRangeVisas
      .filter((v) => v.status !== "rejected")
      .reduce((s, v) => s + (Number(v.amountPaid) || 0), 0);

    const totalRevenue =
      exchangeRevenue + flightRevenue + hotelRevenue + visaRevenue;

    const completedTxns = inRangeTxns.filter(
      (t) => t.status === "completed",
    ).length;
    const successRate =
      inRangeTxns.length === 0 ? 0 : (completedTxns / inRangeTxns.length) * 100;

    return {
      exchangeRevenue,
      flightRevenue,
      hotelRevenue,
      visaRevenue,
      totalRevenue,
      totalUsers: users.length,
      activeUsers: inRangeUsers.length,
      totalBookings: inRangeBookings.length,
      totalVisaApps: inRangeVisas.length,
      successRate,
    };
  }, [users, bookings, transactions, visaApplications, timeRange]);

  const activities = useMemo(() => {
    const feed = [];

    // Users
    users.forEach((u) => {
      feed.push({
        id: `u-${u.id}`,
        user: u.fullName || u.email || "User",
        action: "New account registered",
        time: formatRelative(u.createdAt || u.joinDate),
        status: "New",
        timestamp: new Date(u.createdAt || u.joinDate || 0).getTime(),
      });
    });

    // Bookings
    bookings.forEach((b) => {
      const label =
        b.type === "flight" ? `Flight booked to ${b.destination || "—"}`
        : b.type === "hotel" ? `Hotel booked in ${b.destination || "—"}`
        : b.type === "car" ? `Car rental in ${b.destination || "—"}`
        : b.type === "tour" ?
          `Tour booked: ${b.tourName || b.destination || "—"}`
        : `Booking: ${b.destination || "—"}`;
      feed.push({
        id: `b-${b.id}`,
        user: userName(users, b.userId),
        action: label,
        time: formatRelative(b.createdAt || b.bookingDate || b.date),
        status:
          b.status === "confirmed" ? "Active"
          : b.status === "pending" ? "Pending"
          : b.status === "cancelled" ? "Cancelled"
          : "Completed",
        timestamp: new Date(
          b.createdAt || b.bookingDate || b.date || 0,
        ).getTime(),
      });
    });

    // Transactions
    transactions.forEach((t) => {
      feed.push({
        id: `t-${t.id}`,
        user: userName(users, t.userId),
        action: `Currency exchange ${t.fromCurrency} → ${t.toCurrency}`,
        time: formatRelative(t.createdAt || t.date),
        status: t.status === "completed" ? "Active" : "Pending",
        timestamp: new Date(t.createdAt || t.date || 0).getTime(),
      });
    });

    // Visa
    visaApplications.forEach((v) => {
      feed.push({
        id: `v-${v.id}`,
        user:
          `${v.firstName || ""} ${v.lastName || ""}`.trim() ||
          userName(users, v.userId),
        action: `Visa application — ${v.countryName || "—"}`,
        time: formatRelative(v.submittedAt),
        status:
          v.status === "approved" ? "Approved"
          : v.status === "rejected" ? "Rejected"
          : "Pending",
        timestamp: new Date(v.submittedAt || 0).getTime(),
      });
    });

    return feed.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  }, [users, bookings, transactions, visaApplications]);

  /* ---------- service progress (0-100 scale, computed) ---------- */

  const totalCount =
    users.length +
      bookings.length +
      transactions.length +
      visaApplications.length || 1;

  const pct = (n) => Math.round((n / totalCount) * 100);

  const services = [
    {
      name: "Users",
      metric: `${users.length} total`,
      progress: pct(users.length),
      icon: <FiUsers />,
      color: "#10b981",
    },
    {
      name: "Exchange",
      metric: currencyFmt(stats.exchangeRevenue),
      progress: pct(transactions.length),
      icon: <FiDollarSign />,
      color: "#3b82f6",
    },
    {
      name: "Flights",
      metric: `${bookings.filter((b) => b.type === "flight").length} bookings`,
      progress: pct(bookings.filter((b) => b.type === "flight").length),
      icon: <FiCalendar />,
      color: "#8b5cf6",
    },
    {
      name: "Travel",
      metric: `${bookings.filter((b) => ["hotel", "tour"].includes(b.type)).length} packages`,
      progress: pct(
        bookings.filter((b) => ["hotel", "tour"].includes(b.type)).length,
      ),
      icon: <FiPackage />,
      color: "#f59e0b",
    },
    {
      name: "Visa",
      metric: `${visaApplications.length} apps`,
      progress: pct(visaApplications.length),
      icon: <FiGlobe />,
      color: "#ec4899",
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Business Overview</p>
        </div>
        <div className={styles.headerActions}>
          <select
            className={styles.select}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <button
            className={`${styles.refreshBtn} ${
              isLoading ? styles.loading : ""
            }`}
            onClick={refreshData}>
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </div>

      {/* Revenue */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Revenue</h2>
        <div className={styles.balanceGrid}>
          <BalanceCard
            title="Exchange"
            amount={currencyFmt(stats.exchangeRevenue)}
            icon={<FiDollarSign />}
            color="#10b981"
          />
          <BalanceCard
            title="Flights"
            amount={currencyFmt(stats.flightRevenue)}
            icon={<FiCalendar />}
            color="#3b82f6"
          />
          <BalanceCard
            title="Travel"
            amount={currencyFmt(stats.hotelRevenue)}
            icon={<FiPackage />}
            color="#f59e0b"
          />
          <BalanceCard
            title="Visa"
            amount={currencyFmt(stats.visaRevenue)}
            icon={<FiGlobe />}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Metrics</h2>
        <div className={styles.metricsGrid}>
          <MetricCard
            title="Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<FiUsers />}
            color="#10b981"
          />
          <MetricCard
            title="Revenue"
            value={currencyFmt(stats.totalRevenue)}
            icon={<FiDollarSign />}
            color="#3b82f6"
          />
          <MetricCard
            title="Success"
            value={`${stats.successRate.toFixed(1)}%`}
            icon={<FiCheckCircle />}
            color="#f59e0b"
          />
          <MetricCard
            title="Bookings"
            value={stats.totalBookings.toLocaleString()}
            icon={<FiClock />}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Services */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Services</h2>
        <div className={styles.servicesGrid}>
          {services.map((s) => (
            <ServiceCard key={s.name} {...s} />
          ))}
        </div>
      </div>

      {/* Activities + Summary */}
      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Activities</h2>
              <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.activitiesList}>
              {activities.length === 0 ?
                <p
                  style={{
                    color: "#64748b",
                    padding: "16px",
                    fontSize: "14px",
                  }}>
                  No activity yet.
                </p>
              : activities.map((a) => (
                  <ActivityCard
                    key={a.id}
                    user={a.user}
                    action={a.action}
                    time={a.time}
                    status={a.status}
                  />
                ))
              }
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <div className={styles.summaryCard}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Total Revenue</div>
                <div className={styles.summaryValue}>
                  {currencyFmt(stats.totalRevenue)}
                </div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Total Users</div>
                <div className={styles.summaryValue}>
                  {stats.totalUsers.toLocaleString()}
                </div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Bookings</div>
                <div className={styles.summaryValue}>
                  {stats.totalBookings.toLocaleString()}
                </div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Visa Applications</div>
                <div className={styles.summaryValue}>
                  {stats.totalVisaApps.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small helper used above so userName isn't recomputed inline */
function userName(users, userId) {
  const u = users.find((x) => x.id === userId);
  if (!u) return "Unknown user";
  return u.fullName || u.email || "Unknown user";
}

export default AdminDashboard;
