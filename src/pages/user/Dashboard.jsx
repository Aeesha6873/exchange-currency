import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiMap,
  FiSend,
  FiCreditCard,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiArrowUpRight,
  FiUsers,
  FiPackage,
  FiPercent,
  FiSmile,
} from "react-icons/fi";

import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [navigate]);

  const [stats] = useState({
    exchangeCount: 12,
    flightBookings: 5,
    travelBookings: 3,
    savedAmount: 125.5,
    walletBalance: 2450.8,
    exchangeSavings: 45.2,
    totalTransactions: 20,
  });

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const recentActivities = [
    {
      id: 1,
      type: "exchange",
      description: "USD to EUR exchange",
      amount: "$500 → €460",
      date: "2 hours ago",
      status: "completed",
      icon: <FiDollarSign />,
      color: "#10b981",
      savings: "$12.50",
    },
    {
      id: 2,
      type: "flight",
      description: "Flight to Paris booked",
      amount: "$850",
      date: "Yesterday",
      status: "confirmed",
      icon: <FiSend />,
      color: "#f97316",
      savings: "$25.00",
    },
    {
      id: 3,
      type: "travel",
      description: "Hotel reservation in Bali",
      amount: "$320/night",
      date: "3 days ago",
      status: "confirmed",
      icon: <FiMap />,
      color: "#064e3b",
      savings: "$18.40",
    },
    {
      id: 4,
      type: "exchange",
      description: "GBP to JPY exchange",
      amount: "£800 → ¥148,000",
      date: "1 week ago",
      status: "completed",
      icon: <FiDollarSign />,
      color: "#10b981",
      savings: "$19.80",
    },
  ];

  const upcomingTrips = [
    {
      id: 1,
      destination: "Paris, France",
      date: "Dec 15-22, 2023",
      type: "Flight & Hotel",
      price: "$1,250",
      status: "confirmed",
      icon: <FiSend />,
    },
    {
      id: 2,
      destination: "Bali, Indonesia",
      date: "Jan 10-20, 2024",
      type: "All-inclusive",
      price: "$1,800",
      status: "upcoming",
      icon: <FiMap />,
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Header Section - IMPROVED */}
          <div className={styles.headerSection}>
            <div className={styles.headerInfo}>
              <h1 className={styles.greeting}>
                {getGreeting()}, {user.fullName?.split(" ")[0]}
              </h1>
              <p className={styles.dateTime}>
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </p>
              <div className={styles.welcomeMessage}>
                <FiSmile className={styles.welcomeIcon} />
                Welcome back to your dashboard
              </div>
            </div>

            <div className={styles.walletCard}>
              <div className={styles.walletHeader}>
                <FiCreditCard className={styles.walletIcon} />
                <span>Wallet Balance</span>
              </div>
              <h2 className={styles.walletAmount}>
                ${stats.walletBalance.toLocaleString()}
              </h2>
              <button
                className={styles.walletAction}
                onClick={() => navigate("/dashboard/wallet")}>
                <FiChevronRight />
                Manage Wallet
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{ background: "#10b981" }}>
                <FiDollarSign />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.exchangeCount}</h3>
                <p>Currency Exchanges</p>
                <div className={styles.statSub}>
                  <FiTrendingUp />
                  <span>+12% this month</span>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{ background: "#f97316" }}>
                <FiSend />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.flightBookings}</h3>
                <p>Flight Bookings</p>
                <div className={styles.statSub}>
                  <FiCalendar />
                  <span>2 upcoming trips</span>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{ background: "#064e3b" }}>
                <FiMap />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.travelBookings}</h3>
                <p>Travel Packages</p>
                <div className={styles.statSub}>
                  <FiPercent />
                  <span>Saved ${stats.savedAmount}</span>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{ background: "#8b5cf6" }}>
                <FiPackage />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.totalTransactions}</h3>
                <p>Total Transactions</p>
                <div className={styles.statSub}>
                  <FiCalendar />
                  <span>Last 30 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={styles.mainGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Quick Actions */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3>Quick Actions</h3>
                    <p>Start a new transaction</p>
                  </div>
                </div>
                <div className={styles.actionsGrid}>
                  <button
                    className={styles.actionButton}
                    onClick={() => navigate("/dashboard/exchange")}>
                    <div className={styles.actionIcon}>
                      <FiDollarSign />
                    </div>
                    <div className={styles.actionContent}>
                      <span className={styles.actionTitle}>
                        Exchange Currency
                      </span>
                      <span className={styles.actionDesc}>
                        Get best rates instantly
                      </span>
                    </div>
                    <FiArrowUpRight className={styles.actionArrow} />
                  </button>

                  <button
                    className={styles.actionButton}
                    onClick={() => navigate("/dashboard/flight")}>
                    <div className={styles.actionIcon}>
                      <FiSend />
                    </div>
                    <div className={styles.actionContent}>
                      <span className={styles.actionTitle}>Book Flight</span>
                      <span className={styles.actionDesc}>
                        Find cheap flights
                      </span>
                    </div>
                    <FiArrowUpRight className={styles.actionArrow} />
                  </button>

                  <button
                    className={styles.actionButton}
                    onClick={() => navigate("/dashboard/travel-agency")}>
                    <div className={styles.actionIcon}>
                      <FiMap />
                    </div>
                    <div className={styles.actionContent}>
                      <span className={styles.actionTitle}>Travel Package</span>
                      <span className={styles.actionDesc}>
                        Hotels & activities
                      </span>
                    </div>
                    <FiArrowUpRight className={styles.actionArrow} />
                  </button>

                  <button
                    className={styles.actionButton}
                    onClick={() => navigate("/dashboard/bookings")}>
                    <div className={styles.actionIcon}>
                      <FiCalendar />
                    </div>
                    <div className={styles.actionContent}>
                      <span className={styles.actionTitle}>My Bookings</span>
                      <span className={styles.actionDesc}>
                        View all bookings
                      </span>
                    </div>
                    <FiArrowUpRight className={styles.actionArrow} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Recent Activities */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3>Recent Activities</h3>
                    <p>Your latest transactions</p>
                  </div>
                  <button
                    className={styles.viewAllButton}
                    onClick={() => navigate("/dashboard/transactions")}>
                    View All
                  </button>
                </div>
                <div className={styles.activitiesList}>
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className={styles.activityItem}>
                      <div
                        className={styles.activityIcon}
                        style={{ background: activity.color }}>
                        {activity.icon}
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityHeader}>
                          <h4>{activity.description}</h4>
                          <span className={styles.activityAmount}>
                            {activity.amount}
                          </span>
                        </div>
                        <div className={styles.activityFooter}>
                          <div className={styles.activityMeta}>
                            <FiClock />
                            <span>{activity.date}</span>
                            <span className={styles.activitySavings}>
                              Saved {activity.savings}
                            </span>
                          </div>
                          <span
                            className={`${styles.activityStatus} ${
                              activity.status === "completed"
                                ? styles.completed
                                : styles.confirmed
                            }`}>
                            <FiCheckCircle />
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={styles.bottomSection}>
            {/* Upcoming Trips */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>Upcoming Trips</h3>
                  <p>{upcomingTrips.length} trips scheduled</p>
                </div>
              </div>
              <div className={styles.tripsGrid}>
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className={styles.tripCard}>
                    <div className={styles.tripHeader}>
                      <div className={styles.tripIcon}>{trip.icon}</div>
                      <div className={styles.tripInfo}>
                        <h4>{trip.destination}</h4>
                        <p>{trip.date}</p>
                      </div>
                    </div>
                    <div className={styles.tripDetails}>
                      <span className={styles.tripType}>{trip.type}</span>
                      <span className={styles.tripPrice}>{trip.price}</span>
                    </div>
                    <div className={styles.tripFooter}>
                      <span
                        className={`${styles.tripStatus} ${
                          trip.status === "confirmed"
                            ? styles.confirmed
                            : styles.upcoming
                        }`}>
                        {trip.status}
                      </span>
                      <button
                        className={styles.tripButton}
                        onClick={() => navigate("/dashboard/bookings")}>
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Banner */}
            <div className={styles.promoCard}>
              <div className={styles.promoContent}>
                <FiUsers className={styles.promoIcon} />
                <h3>Refer & Earn Rewards</h3>
                <p>
                  Get $25 for each friend who joins and completes a transaction
                </p>
              </div>
              <button className={styles.promoButton}>
                Invite Friends
                <FiArrowUpRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
