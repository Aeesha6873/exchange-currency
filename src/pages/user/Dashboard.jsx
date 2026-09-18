import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiMap,
  FiSend,
  FiGlobe,
  FiChevronRight,
  FiClock,
  FiArrowUpRight,
  FiPackage,
  FiUsers,
  FiSmile,
  FiList,
  FiNavigation,
  FiActivity,
} from "react-icons/fi";

import styles from "./Dashboard.module.css";
import { authApi, bookingsApi, transactionsApi } from "../../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    (async () => {
      const [bookings, transactions] = await Promise.all([
        bookingsApi.list(currentUser.id),
        transactionsApi.list(currentUser.id),
      ]);

      const completedTxns = transactions.filter(
        (t) => t.status === "completed",
      ).length;
      const inProgress =
        bookings.filter((b) => b.status === "pending").length +
        transactions.filter((t) => t.status === "pending").length;

      setStats({
        exchangeCount: transactions.length,
        flightBookings: bookings.filter((b) => b.type === "flight").length,
        travelBookings: bookings.filter((b) => b.type === "hotel").length,
        visaApplications: 0,
        totalTransactions: bookings.length + transactions.length,
        completedTransactions: completedTxns,
        inProgress,
        successRate:
          transactions.length === 0 ?
            "—"
          : `${Math.round((completedTxns / transactions.length) * 100)}%`,
      });

      const feed = [
        ...transactions.map((t) => ({
          id: t.id,
          type: "exchange",
          description: `${t.fromCurrency} to ${t.toCurrency} Exchange`,
          amount: `${t.fromAmount} ${t.fromCurrency} → ${t.toAmount} ${t.toCurrency}`,
          date: t.date,
          status: t.status,
          icon: <FiDollarSign />,
          color: "#10b981",
          processStep: t.status.charAt(0).toUpperCase() + t.status.slice(1),
          category: "transactions",
        })),
        ...bookings.map((b) => ({
          id: b.id,
          type: b.type,
          description: b.destination,
          amount: `${b.currency} ${b.price}`,
          date: b.date,
          status: b.status,
          icon: b.type === "flight" ? <FiSend /> : <FiMap />,
          color: b.type === "flight" ? "#f97316" : "#8b5cf6",
          processStep: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          category: "bookings",
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setRecentActivities(feed.slice(0, 5));
      setLoading(false);
    })();

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const processStatus = [
    {
      id: 1,
      type: "exchange",
      title: "Currency Exchange",
      status: "active",
      icon: <FiDollarSign />,
      color: "#10b981",
      count: stats?.exchangeCount ?? 0,
      statusText: `${stats?.exchangeCount ?? 0} total`,
    },
    {
      id: 2,
      type: "flight",
      title: "Flight Bookings",
      status: "upcoming",
      icon: <FiSend />,
      color: "#f97316",
      count: stats?.flightBookings ?? 0,
      statusText: `${stats?.flightBookings ?? 0} total`,
    },
    {
      id: 3,
      type: "visa",
      title: "Visa Applications",
      status: "processing",
      icon: <FiGlobe />,
      color: "#3b82f6",
      count: stats?.visaApplications ?? 0,
      statusText: "In review",
    },
    {
      id: 4,
      type: "travel",
      title: "Travel Packages",
      status: "completed",
      icon: <FiMap />,
      color: "#8b5cf6",
      count: stats?.travelBookings ?? 0,
      statusText: "Booked",
    },
  ];

  const quickLinks = [
    {
      id: 1,
      title: "Transaction History",
      description: "View all transactions",
      icon: <FiActivity />,
      color: "#10b981",
      path: "/dashboard/transactions",
    },
    {
      id: 2,
      title: "Manage Bookings",
      description: "Check reservations",
      icon: <FiCalendar />,
      color: "#3b82f6",
      path: "/dashboard/bookings",
    },
    {
      id: 3,
      title: "Visa Applications",
      description: "Track visa status",
      icon: <FiGlobe />,
      color: "#f97316",
      path: "/dashboard/visa",
    },
    {
      id: 4,
      title: "Support Center",
      description: "Get help & support",
      icon: <FiUsers />,
      color: "#8b5cf6",
      path: "/dashboard/support",
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "confirmed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "processing":
        return "#3b82f6";
      case "cancelled":
      case "failed":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  if (loading || !user || !stats) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardWrapper}>
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <div className={styles.userGreeting}>
              <div className={styles.greetingContent}>
                <h1>
                  {getGreeting()}, {user.fullName?.split(" ")[0]}!
                </h1>
                <p className={styles.welcomeText}>
                  <FiSmile /> Welcome to your travel & finance dashboard
                </p>
              </div>
              <div className={styles.timeDisplay}>
                <span className={styles.date}>{formatDate(currentTime)}</span>
                <span className={styles.time}>{formatTime(currentTime)}</span>
              </div>
            </div>

            <div className={styles.performanceStats}>
              <div className={styles.performanceStat}>
                <span className={styles.statNumber}>{stats.successRate}</span>
                <span className={styles.statLabel}>Success Rate</span>
              </div>
              <div className={styles.performanceStat}>
                <span className={styles.statNumber}>
                  {stats.totalTransactions}
                </span>
                <span className={styles.statLabel}>Total Activities</span>
              </div>
              <div className={styles.performanceStat}>
                <span className={styles.statNumber}>{stats.inProgress}</span>
                <span className={styles.statLabel}>In Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div
            className={styles.statCard}
            style={{ borderLeftColor: "#10b981" }}>
            <div className={styles.statIconWrapper}>
              <FiDollarSign
                className={styles.statIcon}
                style={{ color: "#10b981" }}
              />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.exchangeCount}</h3>
              <p>Currency Exchanges</p>
              <div className={styles.statTrend}>
                <FiTrendingUp /> <span>Updated live</span>
              </div>
            </div>
          </div>

          <div
            className={styles.statCard}
            style={{ borderLeftColor: "#f97316" }}>
            <div className={styles.statIconWrapper}>
              <FiSend
                className={styles.statIcon}
                style={{ color: "#f97316" }}
              />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.flightBookings}</h3>
              <p>Flight Bookings</p>
              <div className={styles.statTrend}>
                <FiCalendar /> <span>From your bookings</span>
              </div>
            </div>
          </div>

          <div
            className={styles.statCard}
            style={{ borderLeftColor: "#3b82f6" }}>
            <div className={styles.statIconWrapper}>
              <FiGlobe
                className={styles.statIcon}
                style={{ color: "#3b82f6" }}
              />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.visaApplications}</h3>
              <p>Visa Applications</p>
              <div className={styles.statTrend}>
                <FiClock /> <span>Coming soon</span>
              </div>
            </div>
          </div>

          <div
            className={styles.statCard}
            style={{ borderLeftColor: "#8b5cf6" }}>
            <div className={styles.statIconWrapper}>
              <FiMap className={styles.statIcon} style={{ color: "#8b5cf6" }} />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.travelBookings}</h3>
              <p>Travel Packages</p>
              <div className={styles.statTrend}>
                <FiPackage /> <span>Hotel bookings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Recent Activities</h2>
                  <p>Latest transactions across all services</p>
                </div>
                <button
                  className={styles.viewAllButton}
                  onClick={() => navigate("/dashboard/transactions")}>
                  View All <FiChevronRight />
                </button>
              </div>

              <div className={styles.activitiesList}>
                {recentActivities.length === 0 ?
                  <p style={{ padding: "1rem", color: "#64748b" }}>
                    No recent activity yet. Start by making a booking or an
                    exchange.
                  </p>
                : recentActivities.map((activity) => (
                    <div key={activity.id} className={styles.activityCard}>
                      <div className={styles.activityHeader}>
                        <div
                          className={styles.activityType}
                          style={{ color: activity.color }}>
                          <div
                            className={styles.typeIcon}
                            style={{ backgroundColor: activity.color }}>
                            {activity.icon}
                          </div>
                          <span className={styles.typeName}>
                            {activity.type.toUpperCase()}
                          </span>
                        </div>
                        <span className={styles.activityDate}>
                          {activity.date}
                        </span>
                      </div>

                      <div className={styles.activityContent}>
                        <h4>{activity.description}</h4>
                        <div className={styles.activityDetails}>
                          <span className={styles.amount}>
                            {activity.amount}
                          </span>
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: getStatusColor(activity.status),
                            }}>
                            {activity.status}
                          </span>
                        </div>
                      </div>

                      <div className={styles.activityFooter}>
                        <div className={styles.processInfo}>
                          <FiNavigation />{" "}
                          <span>Process: {activity.processStep}</span>
                        </div>
                        <button
                          className={styles.detailsButton}
                          onClick={() =>
                            navigate(`/dashboard/${activity.category}`)
                          }>
                          View Details <FiArrowUpRight />
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Process Status</h2>
                  <p>Current status across all services</p>
                </div>
              </div>

              <div className={styles.processGrid}>
                {processStatus.map((process) => (
                  <div key={process.id} className={styles.processCard}>
                    <div
                      className={styles.processIconWrapper}
                      style={{ backgroundColor: `${process.color}15` }}>
                      {process.icon}
                    </div>
                    <div className={styles.processInfo}>
                      <h4>{process.title}</h4>
                      <div className={styles.processStatus}>
                        <span
                          className={styles.statusDot}
                          style={{ backgroundColor: process.color }}
                        />
                        <span className={styles.statusText}>
                          {process.statusText}
                        </span>
                      </div>
                    </div>
                    <div className={styles.processCount}>
                      <span>{process.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Quick Actions</h2>
                  <p>Start a new transaction</p>
                </div>
              </div>

              <div className={styles.actionsGrid}>
                <button
                  className={styles.actionButton}
                  onClick={() => navigate("/dashboard/exchange")}
                  style={{ borderColor: "#10b981" }}>
                  <div
                    className={styles.actionIcon}
                    style={{ backgroundColor: "#10b981" }}>
                    <FiDollarSign />
                  </div>
                  <div className={styles.actionContent}>
                    <span>Exchange Currency</span>
                    <p>Best rates, fast transfer</p>
                  </div>
                  <FiArrowUpRight className={styles.actionArrow} />
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => navigate("/dashboard/flight")}
                  style={{ borderColor: "#f97316" }}>
                  <div
                    className={styles.actionIcon}
                    style={{ backgroundColor: "#f97316" }}>
                    <FiSend />
                  </div>
                  <div className={styles.actionContent}>
                    <span>Book Flight</span>
                    <p>Domestic & international</p>
                  </div>
                  <FiArrowUpRight className={styles.actionArrow} />
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => navigate("/dashboard/visa")}
                  style={{ borderColor: "#3b82f6" }}>
                  <div
                    className={styles.actionIcon}
                    style={{ backgroundColor: "#3b82f6" }}>
                    <FiGlobe />
                  </div>
                  <div className={styles.actionContent}>
                    <span>Apply for Visa</span>
                    <p>Worldwide visa services</p>
                  </div>
                  <FiArrowUpRight className={styles.actionArrow} />
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => navigate("/dashboard/travel-agency")}
                  style={{ borderColor: "#8b5cf6" }}>
                  <div
                    className={styles.actionIcon}
                    style={{ backgroundColor: "#8b5cf6" }}>
                    <FiMap />
                  </div>
                  <div className={styles.actionContent}>
                    <span>Travel Package</span>
                    <p>Hotels & activities</p>
                  </div>
                  <FiArrowUpRight className={styles.actionArrow} />
                </button>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Quick Links</h2>
                  <p>Navigate quickly</p>
                </div>
              </div>

              <div className={styles.linksGrid}>
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    className={styles.linkCard}
                    onClick={() => navigate(link.path)}>
                    <div
                      className={styles.linkIcon}
                      style={{ color: link.color }}>
                      {link.icon}
                    </div>
                    <div className={styles.linkContent}>
                      <h4>{link.title}</h4>
                      <p>{link.description}</p>
                    </div>
                    <FiChevronRight className={styles.linkArrow} />
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Upcoming Trips</h2>
                  <p>Your confirmed travels</p>
                </div>
                <button
                  className={styles.viewAllButton}
                  onClick={() => navigate("/dashboard/bookings")}>
                  All Trips <FiChevronRight />
                </button>
              </div>

              {(
                recentActivities.filter((a) => a.category === "bookings")
                  .length === 0
              ) ?
                <p style={{ padding: "1rem", color: "#64748b" }}>
                  No upcoming trips.
                </p>
              : recentActivities
                  .filter((a) => a.category === "bookings")
                  .slice(0, 2)
                  .map((b) => (
                    <div key={b.id} className={styles.tripCard}>
                      <div className={styles.tripContent}>
                        <div className={styles.tripIcon}>{b.icon}</div>
                        <div className={styles.tripInfo}>
                          <h4>{b.description}</h4>
                          <p>
                            {b.date} • {b.status}
                          </p>
                        </div>
                      </div>
                      <div className={styles.tripActions}>
                        <span className={styles.tripPrice}>{b.amount}</span>
                        <button
                          className={styles.tripButton}
                          onClick={() => navigate("/dashboard/bookings")}>
                          Details
                        </button>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
