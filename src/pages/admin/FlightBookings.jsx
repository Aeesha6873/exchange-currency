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
  FiMail,
  FiPhone,
  FiGlobe,
  FiUsers,
  FiAirplay,
  FiPackage,
} from "react-icons/fi";
import styles from "./FlightBooking.module.css";

const FlightBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const bookings = [
    {
      id: "BK-001",
      user: "John Smith",
      userEmail: "john@example.com",
      userPhone: "+1 (555) 123-4567",
      type: "flight",
      destination: "New York (JFK)",
      departure: "New Delhi (DEL)",
      airline: "Delta Airlines",
      flightNo: "DL123",
      departureTime: "2024-01-20 08:30",
      arrivalTime: "2024-01-20 11:45",
      status: "confirmed",
      amount: 850,
      passengers: 1,
      bookingDate: "2024-01-15",
      paymentMethod: "Credit Card",
      seatClass: "Business",
      baggage: "2 x 23kg",
    },
    {
      id: "BK-002",
      user: "Emma Wilson",
      userEmail: "emma@example.com",
      userPhone: "+44 7911 123456",
      type: "tour",
      destination: "Bali, Indonesia",
      package: "7-Day Luxury Tour",
      duration: "7 days",
      status: "confirmed",
      amount: 3200,
      travelers: 2,
      bookingDate: "2024-01-14",
      paymentMethod: "Bank Transfer",
      inclusions: ["Hotel", "Meals", "Transport", "Guide"],
    },
    {
      id: "BK-003",
      user: "David Chen",
      userEmail: "david@example.com",
      userPhone: "+86 138 0013 8000",
      type: "flight",
      destination: "London (LHR)",
      departure: "Shanghai (PVG)",
      airline: "British Airways",
      flightNo: "BA456",
      departureTime: "2024-01-25 14:00",
      arrivalTime: "2024-01-25 18:30",
      status: "pending",
      amount: 1200,
      passengers: 2,
      bookingDate: "2024-01-14",
      paymentMethod: "PayPal",
      seatClass: "Economy",
      baggage: "1 x 20kg",
    },
    {
      id: "BK-004",
      user: "Sarah Johnson",
      userEmail: "sarah@example.com",
      userPhone: "+1 (555) 987-6543",
      type: "tour",
      destination: "Paris, France",
      package: "Romantic Weekend",
      duration: "3 days",
      status: "confirmed",
      amount: 1800,
      travelers: 2,
      bookingDate: "2024-01-13",
      paymentMethod: "Credit Card",
      inclusions: ["Hotel", "Breakfast", "City Tour"],
    },
    {
      id: "BK-005",
      user: "Michael Brown",
      userEmail: "michael@example.com",
      userPhone: "+61 412 345 678",
      type: "flight",
      destination: "Tokyo (NRT)",
      departure: "Sydney (SYD)",
      airline: "Japan Airlines",
      flightNo: "JL789",
      departureTime: "2024-02-01 10:30",
      arrivalTime: "2024-02-01 20:15",
      status: "cancelled",
      amount: 1500,
      passengers: 1,
      bookingDate: "2024-01-12",
      paymentMethod: "Credit Card",
      seatClass: "Premium Economy",
      baggage: "2 x 23kg",
      cancelReason: "Schedule change",
    },
    {
      id: "BK-006",
      user: "Lisa Wang",
      userEmail: "lisa@example.com",
      userPhone: "+65 8123 4567",
      type: "tour",
      destination: "Swiss Alps",
      package: "Ski Adventure",
      duration: "5 days",
      status: "confirmed",
      amount: 2500,
      travelers: 4,
      bookingDate: "2024-01-11",
      paymentMethod: "Bank Transfer",
      inclusions: ["Hotel", "Ski Pass", "Equipment", "Transport"],
    },
    {
      id: "BK-007",
      user: "Robert Garcia",
      userEmail: "robert@example.com",
      userPhone: "+34 612 345 678",
      type: "flight",
      destination: "Dubai (DXB)",
      departure: "Madrid (MAD)",
      airline: "Emirates",
      flightNo: "EK101",
      departureTime: "2024-01-28 22:15",
      arrivalTime: "2024-01-29 07:30",
      status: "confirmed",
      amount: 950,
      passengers: 1,
      bookingDate: "2024-01-10",
      paymentMethod: "Credit Card",
      seatClass: "Economy",
      baggage: "1 x 20kg",
    },
    {
      id: "BK-008",
      user: "Maria Rodriguez",
      userEmail: "maria@example.com",
      userPhone: "+52 55 1234 5678",
      type: "tour",
      destination: "Greek Islands",
      package: "Island Hopping",
      duration: "10 days",
      status: "pending",
      amount: 4200,
      travelers: 3,
      bookingDate: "2024-01-09",
      paymentMethod: "Bank Transfer",
      inclusions: ["Hotels", "Ferries", "Meals", "Guided Tours"],
    },
  ];

  // Calculate stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.amount, 0),
    today: 4,
    pending: bookings.filter((b) => b.status === "pending").length,
  };

  // Modal functions
  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const openConfirmModal = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmModal(true);
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const closeAllModals = () => {
    setShowDetailsModal(false);
    setShowConfirmModal(false);
    setShowCancelModal(false);
    setSelectedBooking(null);
    setCancelReason("");
  };

  // Action functions
  const handleExportReport = () => {
    const dataStr = JSON.stringify(bookings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute(
      "download",
      `bookings_report_${new Date().toISOString().split("T")[0]}.json`,
    );
    link.click();
  };

  const handleConfirmBooking = () => {
    // In real app, you would update the booking status via API
    console.log(`Confirmed booking: ${selectedBooking?.id}`);
    closeAllModals();
  };

  const handleCancelBooking = () => {
    if (!cancelReason.trim()) {
      alert("Please enter a cancellation reason.");
      return;
    }
    // In real app, you would update the booking status via API
    console.log(
      `Cancelled booking: ${selectedBooking?.id}, Reason: ${cancelReason}`,
    );
    closeAllModals();
  };

  const handleSendReminder = (booking) => {
    console.log(`Sent reminder for booking: ${booking.id}`);
    alert(`Reminder sent to ${booking.userEmail} about booking ${booking.id}`);
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

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesType = typeFilter === "all" || booking.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

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
          <button className={styles.exportBtn} onClick={handleExportReport}>
            <FiDownload />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiCalendar style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Bookings</div>
            <div className={styles.statSub}>This month</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
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
          <div className={styles.statIcon}>
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
          <div className={styles.statIcon}>
            <FiClock style={{ color: "var(--orange)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pending}</div>
            <div className={styles.statLabel}>Pending</div>
            <div className={styles.statSub}>Awaiting confirmation</div>
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
          {filteredBookings.length > 0 ?
            filteredBookings.map((booking) => (
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
                      <div className={styles.tourDetails}>
                        {booking.package}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.bookingDetails}>
                    {booking.type === "flight" ?
                      <>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Departure:</span>
                          <span className={styles.detailValue}>
                            {booking.departureTime}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Passengers:
                          </span>
                          <span className={styles.detailValue}>
                            {booking.passengers}
                          </span>
                        </div>
                      </>
                    : <>
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
                    }
                  </div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.amountInfo}>
                    <div className={styles.amountValue}>${booking.amount}</div>
                    <div className={styles.amountLabel}>
                      {booking.type === "flight" ?
                        "Flight Fare"
                      : "Tour Package"}
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
                    <button
                      className={styles.actionBtn}
                      title="View Details"
                      onClick={() => openDetailsModal(booking)}>
                      <FiEye />
                    </button>

                    {booking.status === "pending" && (
                      <button
                        className={styles.actionBtnConfirm}
                        title="Confirm"
                        onClick={() => openConfirmModal(booking)}>
                        <FiCheck />
                      </button>
                    )}

                    {booking.status === "pending" && (
                      <button
                        className={styles.actionBtnCancel}
                        title="Cancel"
                        onClick={() => openCancelModal(booking)}>
                        <FiX />
                      </button>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        className={styles.actionBtn}
                        title="Send Reminder"
                        onClick={() => handleSendReminder(booking)}>
                        <FiMail />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          : <div className={styles.noResults}>
              <div className={styles.noResultsContent}>
                <FiCalendar className={styles.noResultsIcon} />
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
            </div>
          }
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {selectedBooking.type === "flight" ?
                  <FiAirplay />
                : <FiPackage />}
                Booking Details - {selectedBooking.id}
              </h2>
              <button className={styles.modalClose} onClick={closeAllModals}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.modalGrid}>
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>
                    <FiUser /> Customer Information
                  </h3>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Name:</span>
                    <span className={styles.detailValue}>
                      {selectedBooking.user}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>
                      {selectedBooking.userEmail}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Phone:</span>
                    <span className={styles.detailValue}>
                      {selectedBooking.userPhone}
                    </span>
                  </div>
                </div>

                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>
                    {selectedBooking.type === "flight" ?
                      <FiAirplay />
                    : <FiPackage />}
                    Booking Information
                  </h3>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Type:</span>
                    <span className={styles.detailValue}>
                      <span
                        className={styles.typeBadgeModal}
                        style={{
                          background: `${getTypeColor(selectedBooking.type)}15`,
                          color: getTypeColor(selectedBooking.type),
                        }}>
                        {selectedBooking.type === "flight" ? "Flight" : "Tour"}
                      </span>
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span className={styles.detailValue}>
                      <span
                        className={styles.statusBadgeModal}
                        style={{
                          background: `${getStatusColor(selectedBooking.status)}15`,
                          color: getStatusColor(selectedBooking.status),
                        }}>
                        {selectedBooking.status.charAt(0).toUpperCase() +
                          selectedBooking.status.slice(1)}
                      </span>
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Booking Date:</span>
                    <span className={styles.detailValue}>
                      {selectedBooking.bookingDate}
                    </span>
                  </div>
                </div>

                {selectedBooking.type === "flight" ?
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      <FiGlobe /> Flight Details
                    </h3>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Airline:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.airline}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Flight No:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.flightNo}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Departure:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.departure} at{" "}
                        {selectedBooking.departureTime}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Arrival:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.destination} at{" "}
                        {selectedBooking.arrivalTime}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Class:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.seatClass}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Baggage:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.baggage}
                      </span>
                    </div>
                  </div>
                : <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      <FiPackage /> Tour Details
                    </h3>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Package:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.package}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Destination:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.destination}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Duration:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.duration}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Inclusions:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.inclusions?.join(", ")}
                      </span>
                    </div>
                  </div>
                }

                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>
                    <FiDollarSign /> Payment Information
                  </h3>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Amount:</span>
                    <span className={styles.detailValue}>
                      <strong style={{ color: "var(--green)" }}>
                        ${selectedBooking.amount}
                      </strong>
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Payment Method:</span>
                    <span className={styles.detailValue}>
                      {selectedBooking.paymentMethod}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      {selectedBooking.type === "flight" ?
                        "Passengers:"
                      : "Travelers:"}
                    </span>
                    <span className={styles.detailValue}>
                      <FiUsers style={{ marginRight: "4px" }} />
                      {selectedBooking.type === "flight" ?
                        selectedBooking.passengers
                      : selectedBooking.travelers}
                    </span>
                  </div>
                </div>

                {selectedBooking.cancelReason && (
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      <FiX /> Cancellation Information
                    </h3>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        Cancellation Reason:
                      </span>
                      <span className={styles.detailValue}>
                        {selectedBooking.cancelReason}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnSecondary}
                onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Booking Modal */}
      {showConfirmModal && selectedBooking && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FiCheck /> Confirm Booking
              </h2>
              <button className={styles.modalClose} onClick={closeAllModals}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <p className={styles.modalText}>
                Are you sure you want to confirm booking{" "}
                <strong>{selectedBooking.id}</strong>?
              </p>

              <div className={styles.bookingPreview}>
                <div className={styles.previewItem}>
                  <span>Customer:</span>
                  <strong>{selectedBooking.user}</strong>
                </div>
                <div className={styles.previewItem}>
                  <span>Type:</span>
                  <strong>
                    {selectedBooking.type === "flight" ? "Flight" : "Tour"}
                  </strong>
                </div>
                <div className={styles.previewItem}>
                  <span>Amount:</span>
                  <strong style={{ color: "var(--green)" }}>
                    ${selectedBooking.amount}
                  </strong>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnSecondary}
                onClick={closeAllModals}>
                Cancel
              </button>
              <button
                className={styles.modalBtnSuccess}
                onClick={handleConfirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FiX /> Cancel Booking
              </h2>
              <button className={styles.modalClose} onClick={closeAllModals}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalContent}>
              <p className={styles.modalText}>
                Are you sure you want to cancel booking{" "}
                <strong>{selectedBooking.id}</strong>?
              </p>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Cancellation Reason <span className={styles.required}>*</span>
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                  rows={3}
                  required
                />
              </div>

              <div className={styles.warningBox}>
                <FiX className={styles.warningIcon} />
                <p>
                  This action cannot be undone. The customer will be notified.
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnSecondary}
                onClick={closeAllModals}>
                Cancel
              </button>
              <button
                className={styles.modalBtnDanger}
                onClick={handleCancelBooking}
                disabled={!cancelReason.trim()}>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightBookings;
