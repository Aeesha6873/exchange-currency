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
  FiCheckCircle,
  FiClock,
  FiArrowUpRight,
  FiPackage,
  FiUsers,
  FiSmile,
  FiCreditCard,
  FiList,
  FiNavigation,
  FiActivity,
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
    visaApplications: 2,
    totalTransactions: 20,
    completedTransactions: 18,
    inProgress: 2,
    successRate: "94%",
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
      description: "USD to EUR Exchange",
      amount: "$500 → €460",
      date: "Today, 10:30 AM",
      status: "completed",
      icon: <FiDollarSign />,
      color: "#10b981",
      processStep: "Completed",
      category: "currency",
    },
    {
      id: 2,
      type: "flight",
      description: "Paris Flight Booking",
      amount: "$850",
      date: "Yesterday, 2:45 PM",
      status: "confirmed",
      icon: <FiSend />,
      color: "#f97316",
      processStep: "Ticket Issued",
      category: "travel",
    },
    {
      id: 3,
      type: "visa",
      description: "UK Tourist Visa",
      amount: "£450",
      date: "2 days ago, 9:15 AM",
      status: "processing",
      icon: <FiGlobe />,
      color: "#3b82f6",
      processStep: "Document Review",
      category: "visa",
    },
    {
      id: 4,
      type: "travel",
      description: "Bali Resort Package",
      amount: "$1,200",
      date: "3 days ago, 4:30 PM",
      status: "confirmed",
      icon: <FiMap />,
      color: "#8b5cf6",
      processStep: "Confirmed",
      category: "travel",
    },
    {
      id: 5,
      type: "exchange",
      description: "GBP to JPY Exchange",
      amount: "£800 → ¥148,000",
      date: "1 week ago, 11:20 AM",
      status: "completed",
      icon: <FiDollarSign />,
      color: "#10b981",
      processStep: "Completed",
      category: "currency",
    },
  ];

  const processStatus = [
    {
      id: 1,
      type: "exchange",
      title: "Currency Exchange",
      status: "active",
      icon: <FiDollarSign />,
      color: "#10b981",
      count: 2,
      statusText: "2 Active",
    },
    {
      id: 2,
      type: "flight",
      title: "Flight Bookings",
      status: "upcoming",
      icon: <FiSend />,
      color: "#f97316",
      count: 1,
      statusText: "1 Upcoming",
    },
    {
      id: 3,
      type: "visa",
      title: "Visa Applications",
      status: "processing",
      icon: <FiGlobe />,
      color: "#3b82f6",
      count: 1,
      statusText: "In Review",
    },
    {
      id: 4,
      type: "travel",
      title: "Travel Packages",
      status: "completed",
      icon: <FiMap />,
      color: "#8b5cf6",
      count: 0,
      statusText: "All Complete",
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
        return "#10b981";
      case "confirmed":
        return "#f97316";
      case "processing":
        return "#3b82f6";
      case "upcoming":
        return "#8b5cf6";
      default:
        return "#64748b";
    }
  };

  if (!user) {
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
        {/* Header Section */}
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

        {/* Stats Cards Grid */}
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
                <FiTrendingUp /> <span>+12% this month</span>
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
                <FiCalendar /> <span>2 upcoming trips</span>
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
                <FiClock /> <span>1 in review</span>
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
                <FiPackage /> <span>3 active packages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Left Column - Recent Activities */}
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
                {recentActivities.map((activity) => (
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
                        <span className={styles.amount}>{activity.amount}</span>
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
                ))}
              </div>
            </div>

            {/* Process Status */}
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

          {/* Right Column - Quick Actions & Links */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
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

            {/* Quick Links */}
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

            {/* Upcoming Trips */}
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

              <div className={styles.tripCard}>
                <div className={styles.tripContent}>
                  <div className={styles.tripIcon}>
                    <FiSend />
                  </div>
                  <div className={styles.tripInfo}>
                    <h4>Paris, France</h4>
                    <p>Dec 15-22, 2023 • Flight & Hotel</p>
                  </div>
                </div>
                <div className={styles.tripActions}>
                  <span className={styles.tripPrice}>$1,250</span>
                  <button className={styles.tripButton}>Details</button>
                </div>
              </div>

              <div className={styles.tripCard}>
                <div className={styles.tripContent}>
                  <div className={styles.tripIcon}>
                    <FiMap />
                  </div>
                  <div className={styles.tripInfo}>
                    <h4>Bali, Indonesia</h4>
                    <p>Jan 10-20, 2024 • All-inclusive</p>
                  </div>
                </div>
                <div className={styles.tripActions}>
                  <span className={styles.tripPrice}>$1,800</span>
                  <button className={styles.tripButton}>Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
