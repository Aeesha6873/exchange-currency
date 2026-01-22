// components/admin/dashboard/Dashboard.jsx
import React, { useState } from "react";
import {
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiPackage,
  FiGlobe,
  FiActivity,
  FiArrowUpRight,
  FiArrowDownRight,
  FiRefreshCw,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiBriefcase,
  FiBarChart2,
  FiMapPin,
} from "react-icons/fi";
import styles from "./AdminDashboard.module.css";

// Custom radial progress component
const RadialProgress = ({ percentage, color, size = 80, label, subLabel }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.radialProgress}>
      <div
        className={styles.radialContainer}
        style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(16, 185, 129, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className={styles.radialCircle}
          />
        </svg>
        <div className={styles.radialContent}>
          <div className={styles.radialValue} style={{ color }}>
            {percentage}%
          </div>
          {label && <div className={styles.radialLabel}>{label}</div>}
        </div>
      </div>
      {subLabel && <div className={styles.radialSubLabel}>{subLabel}</div>}
    </div>
  );
};

// Service card for each business line
const ServiceCard = ({ service }) => {
  const getServiceColor = (type) => {
    switch (type) {
      case "users":
        return "var(--dark-green)";
      case "exchange":
        return "var(--green)";
      case "flight":
        return "#3b82f6";
      case "travel":
        return "var(--orange)";
      default:
        return "var(--green)";
    }
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case "users":
        return <FiUsers />;
      case "exchange":
        return <FiDollarSign />;
      case "flight":
        return <FiCalendar />;
      case "travel":
        return <FiPackage />;
      default:
        return <FiGlobe />;
    }
  };

  const color = getServiceColor(service.type);

  return (
    <div className={styles.serviceCard}>
      <div className={styles.serviceCardHeader}>
        <div
          className={styles.serviceIconContainer}
          style={{ background: `${color}15` }}>
          {getServiceIcon(service.type)}
        </div>
        <div className={styles.serviceInfo}>
          <h4 className={styles.serviceName}>{service.name}</h4>
          <div className={styles.serviceMetric}>{service.metric}</div>
        </div>
        <div
          className={`${styles.serviceChange} ${
            service.positive ? styles.positive : styles.negative
          }`}>
          {service.positive ? <FiTrendingUp /> : <FiTrendingDown />}
          {service.change}
        </div>
      </div>

      <div className={styles.serviceStats}>
        {service.stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.serviceProgress}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{
              width: `${service.performance}%`,
              background: color,
            }}
          />
        </div>
        <div className={styles.progressLabel}>
          <span>Performance</span>
          <span style={{ color }}>{service.performance}%</span>
        </div>
      </div>
    </div>
  );
};

// User activity card
const UserActivityCard = ({ activity }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: "var(--green)",
      pending: "var(--orange)",
      new: "var(--dark-green)",
      inactive: "#6b7280",
    };
    return colors[status] || colors.active;
  };

  const getServiceIcon = (service) => {
    const icons = {
      exchange: <FiDollarSign />,
      flight: <FiCalendar />,
      travel: <FiPackage />,
      all: <FiGlobe />,
    };
    return icons[service] || <FiGlobe />;
  };

  const color = getStatusColor(activity.status);

  return (
    <div className={styles.userActivityCard}>
      <div className={styles.userHeader}>
        <div className={styles.userAvatar}>
          <span style={{ color: "white" }}>{activity.user.charAt(0)}</span>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{activity.user}</div>
          <div className={styles.userEmail}>{activity.email}</div>
        </div>
        <div
          className={styles.userStatus}
          style={{ background: `${color}15`, color }}>
          {activity.status}
        </div>
      </div>

      <div className={styles.userActivity}>
        <div className={styles.activityService}>
          <span className={styles.serviceIcon} style={{ color }}>
            {getServiceIcon(activity.service)}
          </span>
          <span className={styles.serviceName}>
            {activity.service.charAt(0).toUpperCase() +
              activity.service.slice(1)}
          </span>
        </div>
        <div className={styles.activityDetails}>
          <div className={styles.activityAction}>{activity.action}</div>
          <div className={styles.activityTime}>{activity.time}</div>
        </div>
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today");
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard data aligned with sidebar structure
  const dashboardData = {
    overviewMetrics: [
      {
        id: 1,
        title: "Total Users",
        value: "1,248",
        change: "+8.3%",
        positive: true,
        icon: <FiUsers />,
        color: "var(--dark-green)",
        trend: "up",
        description: "Active users across all services",
      },
      {
        id: 2,
        title: "Total Revenue",
        value: "$42,580",
        change: "+12.5%",
        positive: true,
        icon: <FiDollarSign />,
        color: "var(--green)",
        trend: "up",
        description: "Combined revenue this month",
      },
      {
        id: 3,
        title: "Success Rate",
        value: "98.2%",
        change: "+1.8%",
        positive: true,
        icon: <FiCheckCircle />,
        color: "var(--orange)",
        trend: "up",
        description: "Overall transaction success",
      },
      {
        id: 4,
        title: "Avg. Response Time",
        value: "12m",
        change: "-15%",
        positive: true,
        icon: <FiClock />,
        color: "#8b5cf6",
        trend: "down",
        description: "Average support response",
      },
    ],

    services: [
      {
        id: 1,
        type: "users",
        name: "User Management",
        metric: "1,248 users",
        change: "+8.3%",
        positive: true,
        performance: 92,
        stats: [
          { label: "Active", value: "1,042" },
          { label: "New Today", value: "24" },
          { label: "VIP Users", value: "56" },
        ],
      },
      {
        id: 2,
        type: "exchange",
        name: "Currency Exchange",
        metric: "$18,420",
        change: "+8.3%",
        positive: true,
        performance: 88,
        stats: [
          { label: "Transactions", value: "124" },
          { label: "Success Rate", value: "98.5%" },
          { label: "Avg. Time", value: "15m" },
        ],
      },
      {
        id: 3,
        type: "flight",
        name: "Flight Bookings",
        metric: "42 bookings",
        change: "+15.2%",
        positive: true,
        performance: 85,
        stats: [
          { label: "Today", value: "18" },
          { label: "Success Rate", value: "94.8%" },
          { label: "Avg. Value", value: "$850" },
        ],
      },
      {
        id: 4,
        type: "travel",
        name: "Travel Agency",
        metric: "18 packages",
        change: "+3.1%",
        positive: true,
        performance: 76,
        stats: [
          { label: "Active Tours", value: "24" },
          { label: "Bookings", value: "18" },
          { label: "Avg. Value", value: "$3,200" },
        ],
      },
    ],

    recentActivities: [
      {
        id: 1,
        user: "John Smith",
        email: "john@email.com",
        action: "Completed currency exchange",
        service: "exchange",
        time: "Just now",
        status: "active",
      },
      {
        id: 2,
        user: "Emma Wilson",
        email: "emma@email.com",
        action: "Booked flight to London",
        service: "flight",
        time: "2 min ago",
        status: "active",
      },
      {
        id: 3,
        user: "David Chen",
        email: "david@email.com",
        action: "Purchased Bali tour package",
        service: "travel",
        time: "5 min ago",
        status: "active",
      },
      {
        id: 4,
        user: "Sarah Johnson",
        email: "sarah@email.com",
        action: "Registered new account",
        service: "all",
        time: "10 min ago",
        status: "new",
      },
      {
        id: 5,
        user: "Michael Brown",
        email: "michael@email.com",
        action: "Updated profile information",
        service: "all",
        time: "15 min ago",
        status: "active",
      },
    ],

    quickStats: [
      {
        icon: <FiGlobe />,
        label: "Countries Served",
        value: "24",
        color: "var(--green)",
        change: "+2 this month",
      },
      {
        icon: <FiCalendar />,
        label: "Today's Bookings",
        value: "42",
        color: "#3b82f6",
        change: "+8 from yesterday",
      },
      {
        icon: <FiCreditCard />,
        label: "Exchange Volume",
        value: "$1.2M",
        color: "var(--dark-green)",
        change: "+12.5% growth",
      },
      {
        icon: <FiBarChart2 />,
        label: "Monthly Growth",
        value: "+15%",
        color: "var(--orange)",
        change: "On track for target",
      },
    ],

    servicePerformance: [
      {
        title: "User Satisfaction",
        value: "4.8/5",
        change: "+0.2",
        target: 4.5,
        actual: 4.8,
        color: "var(--dark-green)",
      },
      {
        title: "Exchange Success",
        value: "98.5%",
        change: "+1.2%",
        target: 95,
        actual: 98.5,
        color: "var(--green)",
      },
      {
        title: "Booking Accuracy",
        value: "99.1%",
        change: "+0.8%",
        target: 98,
        actual: 99.1,
        color: "#3b82f6",
      },
    ],
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.dashboardTitle}>
            <span className={styles.titleMain}>Admin Dashboard</span>
            <span className={styles.titleSub}>Complete Business Overview</span>
          </h1>
          <div className={styles.dateRange}>
            <FiCalendar />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={styles.rangeSelect}>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            className={`${styles.refreshBtn} ${
              isLoading ? styles.loading : ""
            }`}
            onClick={refreshData}>
            <FiRefreshCw />
            {isLoading ? "Updating..." : "Refresh Data"}
          </button>
          <button className={styles.exportBtn}>
            <FiEye />
            View Reports
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className={styles.metricsGrid}>
        {dashboardData.overviewMetrics.map((metric) => (
          <div key={metric.id} className={styles.metricCard}>
            <div className={styles.metricContent}>
              <div className={styles.metricHeader}>
                <div
                  className={styles.metricIcon}
                  style={{
                    background: `${metric.color}15`,
                    color: metric.color,
                  }}>
                  {metric.icon}
                </div>
                <div
                  className={`${styles.trendBadge} ${
                    metric.positive ? styles.trendUp : styles.trendDown
                  }`}>
                  {metric.change}
                </div>
              </div>

              <div className={styles.metricBody}>
                <h3 className={styles.metricValue}>{metric.value}</h3>
                <p className={styles.metricTitle}>{metric.title}</p>
                <p className={styles.metricDescription}>{metric.description}</p>
              </div>

              <div className={styles.metricTrend}>
                <div
                  className={`${styles.trendIndicator} ${
                    metric.positive ? styles.up : styles.down
                  }`}>
                  {metric.positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                  {metric.trend === "up" ? "Growing" : "Improving"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.contentColumn}>
          {/* Services Overview */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <FiActivity className={styles.titleIcon} />
                Services Overview
              </h3>
              <div className={styles.sectionActions}>
                <span className={styles.sectionSubtitle}>
                  All business lines at a glance
                </span>
              </div>
            </div>

            <div className={styles.servicesGrid}>
              {dashboardData.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={styles.statsGrid}>
            {dashboardData.quickStats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div
                  className={styles.statIcon}
                  style={{
                    background: `${stat.color}15`,
                    color: stat.color,
                  }}>
                  {stat.icon}
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div className={styles.statChange}>{stat.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.contentColumn}>
          {/* Recent User Activities */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <FiUsers className={styles.titleIcon} />
                Recent User Activities
              </h3>
              <div className={styles.sectionActions}>
                <span className={styles.sectionSubtitle}>
                  Latest actions across all services
                </span>
              </div>
            </div>

            <div className={styles.activitiesContainer}>
              {dashboardData.recentActivities.map((activity) => (
                <UserActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <FiBarChart2 className={styles.titleIcon} />
                Performance Insights
              </h3>
            </div>

            <div className={styles.insightsGrid}>
              {dashboardData.servicePerformance.map((insight, index) => (
                <div key={index} className={styles.insightCard}>
                  <div className={styles.insightHeader}>
                    <h4 className={styles.insightTitle}>{insight.title}</h4>
                    <div className={styles.insightValue}>{insight.value}</div>
                  </div>

                  <div className={styles.insightProgress}>
                    <RadialProgress
                      percentage={insight.actual}
                      color={insight.color}
                      size={70}
                      label="Actual"
                      subLabel={`Target: ${insight.target}%`}
                    />
                  </div>

                  <div className={styles.insightFooter}>
                    <div
                      className={`${styles.insightChange} ${
                        insight.change.startsWith("+")
                          ? styles.positive
                          : styles.negative
                      }`}>
                      {insight.change}
                    </div>
                    <div className={styles.insightPeriod}>vs target</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
