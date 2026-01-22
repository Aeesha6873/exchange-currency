import React, { useState } from "react";
import {
  FiGlobe,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCheck,
  FiClock,
  FiX,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";
import styles from "./TravelBookings.module.css";

const TravelBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const bookings = [
    {
      id: "TB-001",
      user: "John Smith",
      tour: "Bali Luxury Retreat",
      destination: "Bali, Indonesia",
      startDate: "2024-02-15",
      endDate: "2024-02-22",
      travelers: 2,
      totalAmount: 5600,
      paidAmount: 5600,
      status: "confirmed",
      bookingDate: "2024-01-15",
      guide: "Wayan S.",
      contact: "+1234567890",
    },
    {
      id: "TB-002",
      user: "Emma Wilson",
      tour: "Swiss Alps Adventure",
      destination: "Swiss Alps",
      startDate: "2024-02-20",
      endDate: "2024-02-25",
      travelers: 4,
      totalAmount: 10000,
      paidAmount: 5000,
      status: "pending",
      bookingDate: "2024-01-14",
      guide: "Hans M.",
      contact: "+1234567891",
    },
    {
      id: "TB-003",
      user: "David Chen",
      tour: "Greek Island Hopping",
      destination: "Greek Islands",
      startDate: "2024-03-05",
      endDate: "2024-03-15",
      travelers: 3,
      totalAmount: 11400,
      paidAmount: 11400,
      status: "confirmed",
      bookingDate: "2024-01-13",
      guide: "Maria K.",
      contact: "+1234567892",
    },
    {
      id: "TB-004",
      user: "Sarah Johnson",
      tour: "Japanese Cherry Blossom",
      destination: "Japan",
      startDate: "2024-04-01",
      endDate: "2024-04-09",
      travelers: 2,
      totalAmount: 7000,
      paidAmount: 3500,
      status: "pending",
      bookingDate: "2024-01-12",
      guide: "Takashi Y.",
      contact: "+1234567893",
    },
    {
      id: "TB-005",
      user: "Michael Brown",
      tour: "Safari Expedition",
      destination: "Kenya",
      startDate: "2024-03-10",
      endDate: "2024-03-16",
      travelers: 2,
      totalAmount: 5400,
      paidAmount: 5400,
      status: "completed",
      bookingDate: "2023-12-15",
      guide: "Joseph K.",
      contact: "+1234567894",
    },
    {
      id: "TB-006",
      user: "Lisa Wang",
      tour: "Romantic Paris Getaway",
      destination: "Paris, France",
      startDate: "2024-02-14",
      endDate: "2024-02-17",
      travelers: 2,
      totalAmount: 3000,
      paidAmount: 3000,
      status: "confirmed",
      bookingDate: "2024-01-10",
      guide: "Pierre L.",
      contact: "+1234567895",
    },
  ];

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + b.paidAmount, 0),
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "var(--green)",
      pending: "var(--orange)",
      completed: "#3b82f6",
      cancelled: "#ef4444",
    };
    return colors[status] || colors.confirmed;
  };

  const getPaymentStatus = (booking) => {
    if (booking.paidAmount === 0) return { status: "unpaid", color: "#ef4444" };
    if (booking.paidAmount < booking.totalAmount)
      return { status: "partial", color: "var(--orange)" };
    return { status: "paid", color: "var(--green)" };
  };

  return (
    <div className={styles.travelBookings}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiGlobe className={styles.titleIcon} />
            Travel Bookings
          </h1>
          <p className={styles.subtitle}>
            Manage and track all tour and travel package bookings
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.exportBtn}>
            <FiDownload />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiGlobe style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Bookings</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiCheck style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.confirmed}</div>
            <div className={styles.statLabel}>Confirmed</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(245, 158, 11, 0.1)" }}>
            <FiClock style={{ color: "var(--orange)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pending}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiDollarSign style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              ${(stats.revenue / 1000).toFixed(1)}k
            </div>
            <div className={styles.statLabel}>Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by user, tour, or destination..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.filterSelect}>
              <option value="all">All Tours</option>
              <option value="luxury">Luxury</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderRow}>
            <div className={styles.tableCell}>Booking ID</div>
            <div className={styles.tableCell}>User</div>
            <div className={styles.tableCell}>Tour Details</div>
            <div className={styles.tableCell}>Travel Dates</div>
            <div className={styles.tableCell}>Travelers</div>
            <div className={styles.tableCell}>Amount</div>
            <div className={styles.tableCell}>Payment</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCellActions}>Actions</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {bookings.map((booking) => {
            const payment = getPaymentStatus(booking);

            return (
              <div key={booking.id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.bookingId}>{booking.id}</div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      {booking.user.charAt(0)}
                    </div>
                    <div>
                      <div className={styles.userName}>{booking.user}</div>
                      <div className={styles.userContact}>
                        {booking.contact}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.tourDetails}>
                    <div className={styles.tourName}>{booking.tour}</div>
                    <div className={styles.tourDestination}>
                      <FiMapPin />
                      {booking.destination}
                    </div>
                    <div className={styles.tourGuide}>
                      Guide: {booking.guide}
                    </div>
                  </div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.dateInfo}>
                    <div className={styles.dateRange}>
                      <FiCalendar />
                      {booking.startDate} to {booking.endDate}
                    </div>
                    <div className={styles.bookingDate}>
                      Booked: {booking.bookingDate}
                    </div>
                  </div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.travelersInfo}>
                    <div className={styles.travelersCount}>
                      {booking.travelers} traveler
                      {booking.travelers > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.amountInfo}>
                    <div className={styles.totalAmount}>
                      ${booking.totalAmount}
                    </div>
                    <div className={styles.paidAmount}>
                      Paid: ${booking.paidAmount}
                    </div>
                  </div>
                </div>

                <div className={styles.tableCell}>
                  <span
                    className={styles.paymentBadge}
                    style={{
                      background: `${payment.color}15`,
                      color: payment.color,
                    }}>
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                </div>

                <div className={styles.tableCell}>
                  <span
                    className={styles.statusBadge}
                    style={{
                      background: `${getStatusColor(booking.status)}15`,
                      color: getStatusColor(booking.status),
                    }}>
                    {booking.status === "confirmed" && <FiCheck />}
                    {booking.status === "pending" && <FiClock />}
                    {booking.status === "completed" && <FiCheck />}
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>

                <div className={styles.tableCellActions}>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionBtn} title="View Details">
                      <FiEye />
                    </button>
                    {booking.status === "pending" && (
                      <button
                        className={styles.actionBtnConfirm}
                        title="Confirm">
                        <FiCheck />
                      </button>
                    )}
                    {booking.status === "pending" && (
                      <button className={styles.actionBtnCancel} title="Cancel">
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TravelBookings;
