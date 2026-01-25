/* components/admin/dashboard/Dashboard.jsx */
import React, { useState } from "react";
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
  FiCreditCard,
} from "react-icons/fi";
import styles from "./AdminDashboard.module.css";

const BalanceCard = ({ title, amount, change, trend, icon, color }) => {
  return (
    <div className={styles.balanceCard}>
      <div className={styles.balanceIcon} style={{ color }}>
        {icon}
      </div>
      <div className={styles.balanceContent}>
        <div className={styles.balanceTitle}>{title}</div>
        <div className={styles.balanceAmount}>{amount}</div>
        <div
          className={`${styles.balanceChange} ${trend === "up" ? styles.up : styles.down}`}>
          {trend === "up" ?
            <FiTrendingUp />
          : <FiTrendingDown />}
          {change}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon, color }) => {
  const isPositive = change.startsWith("+");

  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon} style={{ color }}>
        {icon}
      </div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricTitle}>{title}</div>
      <div
        className={`${styles.metricChange} ${isPositive ? styles.positive : styles.negative}`}>
        {isPositive ?
          <FiTrendingUp />
        : <FiTrendingDown />}
        {change}
      </div>
    </div>
  );
};

const ServiceCard = ({ name, metric, progress, icon, color }) => {
  return (
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
};

const ActivityCard = ({ user, action, time, status }) => {
  return (
    <div className={styles.activityCard}>
      <div className={styles.activityAvatar}>{user.charAt(0)}</div>
      <div className={styles.activityContent}>
        <div className={styles.activityUser}>{user}</div>
        <div className={styles.activityAction}>{action}</div>
        <div className={styles.activityTime}>{time}</div>
      </div>
      <div className={styles.activityStatus}>{status}</div>
    </div>
  );
};

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today");
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

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
            className={`${styles.refreshBtn} ${isLoading ? styles.loading : ""}`}
            onClick={refreshData}>
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </div>

      {/* Balance Cards - Mobile optimized */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Revenue</h2>
        <div className={styles.balanceGrid}>
          <BalanceCard
            title="Exchange"
            amount="$18,420"
            change="+8.3%"
            trend="up"
            icon={<FiDollarSign />}
            color="#10b981"
          />
          <BalanceCard
            title="Flights"
            amount="$24,850"
            change="+15.2%"
            trend="up"
            icon={<FiCalendar />}
            color="#3b82f6"
          />
          <BalanceCard
            title="Travel"
            amount="$12,650"
            change="+3.1%"
            trend="up"
            icon={<FiPackage />}
            color="#f59e0b"
          />
          <BalanceCard
            title="Visa"
            amount="$8,950"
            change="+18.5%"
            trend="up"
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
            value="1,248"
            change="+8.3%"
            icon={<FiUsers />}
            color="#10b981"
          />
          <MetricCard
            title="Revenue"
            value="$64,870"
            change="+22.5%"
            icon={<FiDollarSign />}
            color="#3b82f6"
          />
          <MetricCard
            title="Success"
            value="98.2%"
            change="+1.8%"
            icon={<FiCheckCircle />}
            color="#f59e0b"
          />
          <MetricCard
            title="Bookings"
            value="156"
            change="+12.3%"
            icon={<FiClock />}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Services */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Services</h2>
        <div className={styles.servicesGrid}>
          <ServiceCard
            name="Users"
            metric="1,248 active"
            progress={92}
            icon={<FiUsers />}
            color="#10b981"
          />
          <ServiceCard
            name="Exchange"
            metric="$18,420"
            progress={88}
            icon={<FiDollarSign />}
            color="#3b82f6"
          />
          <ServiceCard
            name="Flights"
            metric="42 bookings"
            progress={85}
            icon={<FiCalendar />}
            color="#8b5cf6"
          />
          <ServiceCard
            name="Travel"
            metric="18 packages"
            progress={76}
            icon={<FiPackage />}
            color="#f59e0b"
          />
          <ServiceCard
            name="Visa"
            metric="32 apps"
            progress={82}
            icon={<FiGlobe />}
            color="#ec4899"
          />
        </div>
      </div>

      {/* Activities & Summary */}
      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Activities</h2>
              <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.activitiesList}>
              <ActivityCard
                user="John Smith"
                action="Currency exchange completed"
                time="Just now"
                status="Active"
              />
              <ActivityCard
                user="Emma Wilson"
                action="Flight booked to London"
                time="2 min ago"
                status="Active"
              />
              <ActivityCard
                user="David Chen"
                action="Visa application"
                time="5 min ago"
                status="Pending"
              />
              <ActivityCard
                user="Sarah Johnson"
                action="Bali tour purchased"
                time="10 min ago"
                status="Active"
              />
              <ActivityCard
                user="Michael Brown"
                action="New account registered"
                time="15 min ago"
                status="New"
              />
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <div className={styles.summaryCard}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Total Revenue</div>
                <div className={styles.summaryValue}>$64,870</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Active Users</div>
                <div className={styles.summaryValue}>1,248</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Today's Bookings</div>
                <div className={styles.summaryValue}>42</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Visa Applications</div>
                <div className={styles.summaryValue}>32</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
