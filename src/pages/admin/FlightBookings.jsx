import React, { useState, useEffect, useMemo } from "react";
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
  FiHome,
  FiTruck,
} from "react-icons/fi";
import styles from "./FlightBooking.module.css";

const KEYS = {
  BOOKINGS: "bookings",
  USERS: "users",
};

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const FlightBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  /* ------------------------------------------------------------------ */
  /* Load bookings + join with users                                     */
  /* ------------------------------------------------------------------ */

  const load = () => {
    const users = read(KEYS.USERS, []);
    const raw = read(KEYS.BOOKINGS, []);

    const enriched = raw
      .map((b) => {
        const user = users.find((u) => String(u.id) === String(b.userId));
        return {
          id: b.id,
          reference: b.reference || b.id,
          userId: b.userId,
          // User info (fallbacks in case user record is missing)
          user: user?.fullName || user?.email || b.user || "Unknown User",
          userEmail: user?.email || b.userEmail || "—",
          userPhone: user?.phone || b.userPhone || "—",
          // Booking identity
          type: b.type || "flight",
          status: b.status || "pending",
          amount: Number(b.price) || 0,
          currency: b.currency || "USD",
          bookingDate: b.bookingDate || b.createdAt || null,
          // Flight-specific
          destination: b.destination || "—",
          departure: b.departure || "",
          arrival: b.arrival || "",
          airline: b.airline || "",
          flightNo: b.flight || "",
          departureTime:
            b.date ?
              `${b.date} ${b.time || ""}`.trim()
            : b.departureTime || "—",
          arrivalTime: b.arrivalTime || "",
          seatClass: b.class || b.seatClass || "",
          baggage: b.baggage || "",
          passengers:
            Array.isArray(b.passengers) ?
              b.passengers.length
            : Number(b.passengers) || 1,
          passengerList: Array.isArray(b.passengers) ? b.passengers : [],
          // Hotel/tour/car
          package: b.package || b.hotel || b.tourName || b.carModel || "",
          duration: b.duration || "",
          travelers: Number(b.guests) || Number(b.participants) || 0,
          inclusions: b.amenities || [],
          // Payment
          paymentMethod: b.paymentMethod || b.bank || "—",
          // Cancellation
          cancelReason: b.cancelReason || b.cancellationReason || "",
        };
      })
      .sort((a, b) => {
        const av = new Date(a.bookingDate || 0).getTime();
        const bv = new Date(b.bookingDate || 0).getTime();
        return bv - av;
      });

    setBookings(enriched);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const onStorage = (e) => {
      if (["bookings", "users"].includes(e.key)) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Stats                                                               */
  /* ------------------------------------------------------------------ */

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      revenue: bookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum, b) => sum + b.amount, 0),
      today: bookings.filter(
        (b) => b.bookingDate && new Date(b.bookingDate) >= today,
      ).length,
    };
  }, [bookings]);

  /* ------------------------------------------------------------------ */
  /* Filtering                                                           */
  /* ------------------------------------------------------------------ */

  const filteredBookings = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return bookings.filter((b) => {
      const matchesSearch =
        !q ||
        b.user.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q) ||
        (b.airline || "").toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesType = typeFilter === "all" || b.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, searchTerm, statusFilter, typeFilter]);

  /* ------------------------------------------------------------------ */
  /* Persistence                                                         */
  /* ------------------------------------------------------------------ */

  const updateBooking = (id, patch) => {
    const all = read(KEYS.BOOKINGS, []);
    const next = all.map((b) =>
      String(b.id) === String(id) ? { ...b, ...patch } : b,
    );
    write(KEYS.BOOKINGS, next);
    load();
  };

  /* ------------------------------------------------------------------ */
  /* Modals                                                              */
  /* ------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------ */
  /* Actions                                                             */
  /* ------------------------------------------------------------------ */

  const handleExportReport = () => {
    const dataStr = JSON.stringify(filteredBookings, null, 2);
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
    if (!selectedBooking) return;
    updateBooking(selectedBooking.id, {
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
    });
    closeAllModals();
  };

  const handleCancelBooking = () => {
    if (!selectedBooking || !cancelReason.trim()) return;
    updateBooking(selectedBooking.id, {
      status: "cancelled",
      cancelReason: cancelReason.trim(),
      cancelledAt: new Date().toISOString(),
    });
    closeAllModals();
  };

  const handleSendReminder = (booking) => {
    const subject = `Reminder: your booking ${booking.reference}`;
    const body = `Hi ${booking.user},\n\nThis is a reminder about your booking ${booking.reference} for ${booking.destination}.\n\nThanks.`;
    window.open(
      `mailto:${booking.userEmail}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`,
      "_blank",
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  /* ------------------------------------------------------------------ */
  /* Display helpers                                                     */
  /* ------------------------------------------------------------------ */

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
    const colors = {
      flight: "#3b82f6",
      hotel: "#10b981",
      tour: "var(--orange)",
      car: "#8b5cf6",
    };
    return colors[type] || "#64748b";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "flight":
        return <FiAirplay />;
      case "hotel":
        return <FiHome />;
      case "car":
        return <FiTruck />;
      case "tour":
      default:
        return <FiPackage />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "flight":
        return "✈️ Flight";
      case "hotel":
        return "🏨 Hotel";
      case "car":
        return "🚗 Car";
      case "tour":
      default:
        return "🏖️ Tour";
    }
  };

  if (loading) {
    return (
      <div className={styles.allBookings}>
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            color: "#64748b",
          }}>
          Loading bookings...
        </div>
      </div>
    );
  }

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
            Manage and track all bookings across your platform
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
            <div className={styles.statSub}>All time</div>
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
              {stats.total === 0 ?
                "0% rate"
              : `${Math.round((stats.confirmed / stats.total) * 100)}% rate`}
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
            <div className={styles.statSub}>From confirmed</div>
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
              <option value="hotel">Hotels</option>
              <option value="tour">Tours</option>
              <option value="car">Car Rentals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderRow}>
            <div className={styles.tableCell}>Booking ID</div>
            <div className={styles.tableCell}>User</div>
            <div className={styles.tableCell}>Type</div>
            <div className={styles.tableCell}>Destination</div>
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
                  <div className={styles.bookingId}>{booking.reference}</div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      {booking.user.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className={styles.userName}>{booking.user}</div>
                      <div className={styles.bookingDate}>
                        Booked: {fmtDate(booking.bookingDate)}
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
                    {getTypeLabel(booking.type)}
                  </span>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.destinationInfo}>
                    <div className={styles.destinationMain}>
                      <FiMapPin className={styles.destinationIcon} />
                      {booking.destination}
                    </div>
                    {booking.type === "flight" && booking.airline && (
                      <div className={styles.flightDetails}>
                        <FiBriefcase className={styles.flightIcon} />
                        {booking.airline}
                        {booking.flightNo ? ` • ${booking.flightNo}` : ""}
                      </div>
                    )}
                    {booking.type !== "flight" && booking.package && (
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
                          <span className={styles.detailLabel}>Date:</span>
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
                        {booking.duration && (
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                              Duration:
                            </span>
                            <span className={styles.detailValue}>
                              {booking.duration}
                            </span>
                          </div>
                        )}
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            {booking.type === "hotel" ?
                              "Guests:"
                            : "Travelers:"}
                          </span>
                          <span className={styles.detailValue}>
                            {booking.travelers || booking.passengers || 1}
                          </span>
                        </div>
                      </>
                    }
                  </div>
                </div>

                <div className={styles.tableCell}>
                  <div className={styles.amountInfo}>
                    <div className={styles.amountValue}>
                      {booking.currency} {booking.amount.toLocaleString()}
                    </div>
                    <div className={styles.amountLabel}>
                      {booking.type === "flight" ? "Flight" : "Package"}
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
                  <div className={styles.dateInfo}>
                    {fmtDate(booking.bookingDate)}
                  </div>
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
                      <>
                        <button
                          className={styles.actionBtnConfirm}
                          title="Confirm"
                          onClick={() => openConfirmModal(booking)}>
                          <FiCheck />
                        </button>
                        <button
                          className={styles.actionBtnCancel}
                          title="Cancel"
                          onClick={() => openCancelModal(booking)}>
                          <FiX />
                        </button>
                      </>
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
                <h3>
                  {bookings.length === 0 ?
                    "No bookings yet"
                  : "No matching bookings"}
                </h3>
                <p>
                  {bookings.length === 0 ?
                    "Bookings made by users will appear here."
                  : "Try adjusting your search or filters."}
                </p>
                {bookings.length > 0 && (
                  <button
                    className={styles.clearFiltersBtn}
                    onClick={handleClearFilters}>
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          }
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {getTypeIcon(selectedBooking.type)}
                Booking Details - {selectedBooking.reference}
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
                    {getTypeIcon(selectedBooking.type)} Booking Information
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
                        {selectedBooking.type.charAt(0).toUpperCase() +
                          selectedBooking.type.slice(1)}
                      </span>
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span className={styles.detailValue}>
                      <span
                        className={styles.statusBadgeModal}
                        style={{
                          background: `${getStatusColor(
                            selectedBooking.status,
                          )}15`,
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
                      {fmtDate(selectedBooking.bookingDate)}
                    </span>
                  </div>
                </div>

                {selectedBooking.type === "flight" ?
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      <FiGlobe /> Flight Details
                    </h3>
                    {selectedBooking.airline && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Airline:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.airline}
                        </span>
                      </div>
                    )}
                    {selectedBooking.flightNo && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Flight No:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.flightNo}
                        </span>
                      </div>
                    )}
                    {selectedBooking.departure && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Departure:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.departure}
                        </span>
                      </div>
                    )}
                    {selectedBooking.destination && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Arrival:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.destination}
                        </span>
                      </div>
                    )}
                    {selectedBooking.departureTime && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Date/Time:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.departureTime}
                        </span>
                      </div>
                    )}
                    {selectedBooking.seatClass && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Class:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.seatClass}
                        </span>
                      </div>
                    )}
                    {selectedBooking.baggage && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Baggage:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.baggage}
                        </span>
                      </div>
                    )}
                  </div>
                : <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      {getTypeIcon(selectedBooking.type)} Booking Details
                    </h3>
                    {selectedBooking.package && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>
                          {selectedBooking.type === "hotel" ?
                            "Hotel:"
                          : selectedBooking.type === "car" ?
                            "Vehicle:"
                          : "Package:"}
                        </span>
                        <span className={styles.detailValue}>
                          {selectedBooking.package}
                        </span>
                      </div>
                    )}
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Destination:</span>
                      <span className={styles.detailValue}>
                        {selectedBooking.destination}
                      </span>
                    </div>
                    {selectedBooking.duration && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Duration:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.duration}
                        </span>
                      </div>
                    )}
                    {selectedBooking.inclusions.length > 0 && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Inclusions:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.inclusions.join(", ")}
                        </span>
                      </div>
                    )}
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
                        {selectedBooking.currency}{" "}
                        {selectedBooking.amount.toLocaleString()}
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
                      : selectedBooking.travelers ||
                        selectedBooking.passengers ||
                        1
                      }
                    </span>
                  </div>
                </div>

                {selectedBooking.passengerList.length > 0 && (
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      <FiUser /> Passenger Details
                    </h3>
                    {selectedBooking.passengerList.map((p, i) => (
                      <div key={i} className={styles.detailRow}>
                        <span className={styles.detailLabel}>
                          {p.title || "Mr"}:
                        </span>
                        <span className={styles.detailValue}>
                          {p.firstName} {p.lastName}
                          {p.passport ? ` • ${p.passport}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedBooking.cancelReason && (
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      <FiX /> Cancellation Information
                    </h3>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Reason:</span>
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
              {selectedBooking.status === "pending" && (
                <>
                  <button
                    className={styles.modalBtnSuccess}
                    onClick={() => {
                      updateBooking(selectedBooking.id, {
                        status: "confirmed",
                        confirmedAt: new Date().toISOString(),
                      });
                      closeAllModals();
                    }}>
                    Confirm
                  </button>
                  <button
                    className={styles.modalBtnDanger}
                    onClick={() => {
                      closeAllModals();
                      openCancelModal(selectedBooking);
                    }}>
                    Cancel Booking
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
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
                <strong>{selectedBooking.reference}</strong>?
              </p>

              <div className={styles.bookingPreview}>
                <div className={styles.previewItem}>
                  <span>Customer:</span>
                  <strong>{selectedBooking.user}</strong>
                </div>
                <div className={styles.previewItem}>
                  <span>Type:</span>
                  <strong>
                    {selectedBooking.type.charAt(0).toUpperCase() +
                      selectedBooking.type.slice(1)}
                  </strong>
                </div>
                <div className={styles.previewItem}>
                  <span>Amount:</span>
                  <strong style={{ color: "var(--green)" }}>
                    {selectedBooking.currency}{" "}
                    {selectedBooking.amount.toLocaleString()}
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

      {/* Cancel Modal */}
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
                <strong>{selectedBooking.reference}</strong>?
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
