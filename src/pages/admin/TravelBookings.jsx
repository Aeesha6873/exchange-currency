import React, { useState } from "react";
import {
  FiGlobe,
  FiSearch,
  FiDownload,
  FiEye,
  FiCheck,
  FiClock,
  FiX,
  FiMapPin,
  FiUsers,
  FiCalendar,
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
      startDate: "Feb 15, 2024",
      endDate: "Feb 22, 2024",
      duration: "7 days",
      travelers: 2,
      totalAmount: 5600,
      paidAmount: 5600,
      status: "confirmed",
      bookingDate: "Jan 15, 2024",
      guide: "Wayan S.",
      contact: "+1234567890",
      type: "luxury",
    },
    {
      id: "TB-002",
      user: "Emma Wilson",
      tour: "Swiss Alps Adventure",
      destination: "Swiss Alps",
      startDate: "Feb 20, 2024",
      endDate: "Feb 25, 2024",
      duration: "5 days",
      travelers: 4,
      totalAmount: 10000,
      paidAmount: 5000,
      status: "pending",
      bookingDate: "Jan 14, 2024",
      guide: "Hans M.",
      contact: "+1234567891",
      type: "adventure",
    },
    {
      id: "TB-003",
      user: "David Chen",
      tour: "Greek Island Hopping",
      destination: "Greek Islands",
      startDate: "Mar 5, 2024",
      endDate: "Mar 15, 2024",
      duration: "10 days",
      travelers: 3,
      totalAmount: 11400,
      paidAmount: 11400,
      status: "confirmed",
      bookingDate: "Jan 13, 2024",
      guide: "Maria K.",
      contact: "+1234567892",
      type: "cultural",
    },
    {
      id: "TB-004",
      user: "Sarah Johnson",
      tour: "Japanese Cherry Blossom",
      destination: "Japan",
      startDate: "Apr 1, 2024",
      endDate: "Apr 9, 2024",
      duration: "8 days",
      travelers: 2,
      totalAmount: 7000,
      paidAmount: 3500,
      status: "pending",
      bookingDate: "Jan 12, 2024",
      guide: "Takashi Y.",
      contact: "+1234567893",
      type: "cultural",
    },
    {
      id: "TB-005",
      user: "Michael Brown",
      tour: "Safari Expedition",
      destination: "Kenya",
      startDate: "Mar 10, 2024",
      endDate: "Mar 16, 2024",
      duration: "6 days",
      travelers: 2,
      totalAmount: 5400,
      paidAmount: 5400,
      status: "completed",
      bookingDate: "Dec 15, 2023",
      guide: "Joseph K.",
      contact: "+1234567894",
      type: "adventure",
    },
    {
      id: "TB-006",
      user: "Lisa Wang",
      tour: "Romantic Paris Getaway",
      destination: "Paris, France",
      startDate: "Feb 14, 2024",
      endDate: "Feb 17, 2024",
      duration: "3 days",
      travelers: 2,
      totalAmount: 3000,
      paidAmount: 3000,
      status: "confirmed",
      bookingDate: "Jan 10, 2024",
      guide: "Pierre L.",
      contact: "+1234567895",
      type: "luxury",
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesType = typeFilter === "all" || booking.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getPaymentStatus = (booking) => {
    if (booking.paidAmount === 0) return { status: "unpaid", label: "Unpaid" };
    if (booking.paidAmount < booking.totalAmount)
      return { status: "partial", label: "Partial" };
    return { status: "paid", label: "Paid" };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (booking) => {
    alert(`Viewing details for booking ${booking.id}`);
  };

  const handleConfirm = (booking) => {
    if (window.confirm(`Confirm booking ${booking.id}?`)) {
      alert(`Booking ${booking.id} confirmed!`);
    }
  };

  const handleCancel = (booking) => {
    if (window.confirm(`Cancel booking ${booking.id}?`)) {
      alert(`Booking ${booking.id} cancelled!`);
    }
  };

  const handleExport = () => {
    alert("Exporting bookings data...");
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
        <button className={styles.exportBtn} onClick={handleExport}>
          <FiDownload />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Bookings</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.confirmed}</div>
            <div className={styles.statLabel}>Confirmed</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pending}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
        </div>
        <div className={styles.statCard}>
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
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterGroup}>
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterGroup}>
            <option value="all">All Tours</option>
            <option value="luxury">Luxury</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>
      </div>

      {/* Bookings Table - PERFECTLY BALANCED */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          {/* Table Header */}
          <thead className={styles.tableHeader}>
            <div className={styles.tableHeaderRow}>
              <div className={styles.tableHeaderCell}>Booking ID</div>
              <div className={styles.tableHeaderCell}>User</div>
              <div className={styles.tableHeaderCell}>Tour Details</div>
              <div className={styles.tableHeaderCell}>Travel Dates</div>
              <div className={styles.tableHeaderCell}>Amount</div>
              <div className={styles.tableHeaderCell}>Status & Actions</div>
            </div>
          </thead>

          {/* Table Body */}
          <tbody className={styles.tableBody}>
            {filteredBookings.map((booking) => {
              const payment = getPaymentStatus(booking);

              return (
                <div key={booking.id} className={styles.tableRow}>
                  {/* Column 1: Booking ID */}
                  <div className={styles.bookingIdCell}>
                    <div className={styles.bookingId}>{booking.id}</div>
                  </div>

                  {/* Column 2: User Info */}
                  <div className={styles.userCell}>
                    <div className={styles.userInfo}>
                      <div className={styles.userAvatar}>
                        {booking.user.charAt(0)}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{booking.user}</div>
                        <div className={styles.userContact}>
                          {booking.contact}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Tour Details */}
                  <div className={styles.tourCell}>
                    <div className={styles.tourDetails}>
                      <div className={styles.tourName}>{booking.tour}</div>
                      <div className={styles.tourMeta}>
                        <FiMapPin size={12} />
                        {booking.destination}
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Dates */}
                  <div className={styles.datesCell}>
                    <div className={styles.datesInfo}>
                      <div className={styles.dateRange}>
                        {booking.startDate} - {booking.endDate}
                      </div>
                      <div className={styles.dateMeta}>
                        <span>
                          <FiUsers size={12} />
                          {booking.travelers}
                        </span>
                        <span>
                          <FiCalendar size={12} />
                          {booking.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 5: Amount */}
                  <div className={styles.amountCell}>
                    <div className={styles.amountInfo}>
                      <div className={styles.amount}>
                        {formatCurrency(booking.totalAmount)}
                      </div>
                      <div
                        className={`${styles.paymentStatus} ${styles[payment.status]}`}>
                        {payment.label} • {formatCurrency(booking.paidAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Column 6: Status & Actions - PERFECTLY BALANCED */}
                  <div className={styles.statusActionsCell}>
                    <div className={styles.statusBadgeWrapper}>
                      <span
                        className={`${styles.statusBadge} ${styles[booking.status]}`}>
                        {booking.status === "confirmed" && (
                          <FiCheck size={12} />
                        )}
                        {booking.status === "pending" && <FiClock size={12} />}
                        {booking.status === "completed" && (
                          <FiCheck size={12} />
                        )}
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>

                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleViewDetails(booking)}
                        title="View Details">
                        <FiEye />
                      </button>

                      {booking.status === "pending" && (
                        <>
                          <button
                            className={`${styles.actionBtn} ${styles.primary}`}
                            onClick={() => handleConfirm(booking)}
                            title="Confirm">
                            <FiCheck />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.danger}`}
                            onClick={() => handleCancel(booking)}
                            title="Cancel">
                            <FiX />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredBookings.length === 0 && (
              <div className={styles.emptyState}>
                <FiSearch className={styles.emptyIcon} />
                <h3>No bookings found</h3>
                <p>Try adjusting your search or filters</p>
                <button
                  className={styles.clearFiltersBtn}
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}>
                  Clear All Filters
                </button>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelBookings;
