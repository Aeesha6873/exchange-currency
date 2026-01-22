import React, { useState } from "react";
import {
  FiCalendar,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCheck,
  FiClock,
  FiX,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
} from "react-icons/fi";
import styles from "./FlightBooking.module.css";

const FlightBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const bookings = [
    {
      id: "BK-001",
      user: "John Smith",
      type: "flight",
      destination: "New York (JFK)",
      airline: "Delta Airlines",
      flightNo: "DL123",
      departure: "2024-01-20 08:30",
      status: "confirmed",
      amount: 850,
      passengers: 1,
      bookingDate: "2024-01-15",
    },
    {
      id: "BK-002",
      user: "Emma Wilson",
      type: "tour",
      destination: "Bali, Indonesia",
      package: "7-Day Luxury Tour",
      duration: "7 days",
      status: "confirmed",
      amount: 3200,
      travelers: 2,
      bookingDate: "2024-01-14",
    },
    {
      id: "BK-003",
      user: "David Chen",
      type: "flight",
      destination: "London (LHR)",
      airline: "British Airways",
      flightNo: "BA456",
      departure: "2024-01-25 14:00",
      status: "pending",
      amount: 1200,
      passengers: 2,
      bookingDate: "2024-01-14",
    },
    {
      id: "BK-004",
      user: "Sarah Johnson",
      type: "tour",
      destination: "Paris, France",
      package: "Romantic Weekend",
      duration: "3 days",
      status: "confirmed",
      amount: 1800,
      travelers: 2,
      bookingDate: "2024-01-13",
    },
    {
      id: "BK-005",
      user: "Michael Brown",
      type: "flight",
      destination: "Tokyo (NRT)",
      airline: "Japan Airlines",
      flightNo: "JL789",
      departure: "2024-02-01 10:30",
      status: "cancelled",
      amount: 1500,
      passengers: 1,
      bookingDate: "2024-01-12",
    },
    {
      id: "BK-006",
      user: "Lisa Wang",
      type: "tour",
      destination: "Swiss Alps",
      package: "Ski Adventure",
      duration: "5 days",
      status: "confirmed",
      amount: 2500,
      travelers: 4,
      bookingDate: "2024-01-11",
    },
    {
      id: "BK-007",
      user: "Robert Garcia",
      type: "flight",
      destination: "Dubai (DXB)",
      airline: "Emirates",
      flightNo: "EK101",
      departure: "2024-01-28 22:15",
      status: "confirmed",
      amount: 950,
      passengers: 1,
      bookingDate: "2024-01-10",
    },
    {
      id: "BK-008",
      user: "Maria Rodriguez",
      type: "tour",
      destination: "Greek Islands",
      package: "Island Hopping",
      duration: "10 days",
      status: "pending",
      amount: 4200,
      travelers: 3,
      bookingDate: "2024-01-09",
    },
  ];

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.amount, 0),
    today: 4,
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "var(--green)",
      pending: "var(--orange)",
      cancelled: "#ef4444",
      completed: "#3b82f6",
    };
    return colors[status] || colors.confirmed;
  };

  const getTypeColor = (type) => {
    return type === "flight" ? "#3b82f6" : "var(--orange)";
  };

  return (
    <div className={styles.allBookings}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiCalendar className={styles.titleIcon} />
            All Bookings
          </h1>
          <p className={styles.subtitle}>
            Manage and track all flight and tour bookings
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
            <FiCalendar style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Bookings</div>
            <div className={styles.statSub}>This month</div>
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
            <div className={styles.statSub}>
              {((stats.confirmed / stats.total) * 100).toFixed(0)}% rate
            </div>
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
              ${stats.revenue.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Revenue</div>
            <div className={styles.statSub}>From bookings</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiCalendar style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.today}</div>
            <div className={styles.statLabel}>Today</div>
            <div className={styles.statSub}>New bookings</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by user, destination, or booking ID..."
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
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.filterSelect}>
              <option value="all">All Types</option>
              <option value="flight">Flights</option>
              <option value="tour">Tours</option>
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
            <div className={styles.tableCell}>Type</div>
            <div className={styles.tableCell}>Destination / Flight</div>
            <div className={styles.tableCell}>Details</div>
            <div className={styles.tableCell}>Amount</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCell}>Date</div>
            <div className={styles.tableCellActions}>Actions</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {bookings.map((booking) => (
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
                    <div className={styles.bookingDate}>
                      Booked: {booking.bookingDate}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.tableCell}>
                <span
                  className={styles.typeBadge}
                  style={{
                    background: `${getTypeColor(booking.type)}15`,
                    color: getTypeColor(booking.type),
                  }}>
                  {booking.type === "flight" ? "✈️ Flight" : "🏖️ Tour"}
                </span>
              </div>

              <div className={styles.tableCell}>
                <div className={styles.destinationInfo}>
                  <div className={styles.destinationMain}>
                    <FiMapPin className={styles.destinationIcon} />
                    {booking.destination}
                  </div>
                  {booking.type === "flight" && (
                    <div className={styles.flightDetails}>
                      <FiBriefcase className={styles.flightIcon} />
                      {booking.airline} • {booking.flightNo}
                    </div>
                  )}
                  {booking.type === "tour" && (
                    <div className={styles.tourDetails}>{booking.package}</div>
                  )}
                </div>
              </div>

              <div className={styles.tableCell}>
                <div className={styles.bookingDetails}>
                  {booking.type === "flight" ? (
                    <>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Departure:</span>
                        <span className={styles.detailValue}>
                          {booking.departure}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Passengers:</span>
                        <span className={styles.detailValue}>
                          {booking.passengers}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Duration:</span>
                        <span className={styles.detailValue}>
                          {booking.duration}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Travelers:</span>
                        <span className={styles.detailValue}>
                          {booking.travelers}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.tableCell}>
                <div className={styles.amountInfo}>
                  <div className={styles.amountValue}>${booking.amount}</div>
                  <div className={styles.amountLabel}>
                    {booking.type === "flight" ? "Flight Fare" : "Tour Package"}
                  </div>
                </div>
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
                  {booking.status === "cancelled" && <FiX />}
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
              </div>

              <div className={styles.tableCell}>
                <div className={styles.dateInfo}>{booking.bookingDate}</div>
              </div>

              <div className={styles.tableCellActions}>
                <div className={styles.actionButtons}>
                  <button className={styles.actionBtn} title="View Details">
                    <FiEye />
                  </button>
                  {booking.status === "pending" && (
                    <button className={styles.actionBtnConfirm} title="Confirm">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightBookings;
