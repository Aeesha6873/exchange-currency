import React, { useState, useEffect, useMemo } from "react";
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

const TravelBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------ */
  /* Load + enrich                                                       */
  /* ------------------------------------------------------------------ */

  const load = () => {
    const users = read("users", []);
    const raw = read("bookings", []);

    const enriched = raw
      .filter((b) => b.type === "tour")
      .map((b) => {
        const user = users.find((u) => String(u.id) === String(b.userId));
        const total = Number(b.price) || 0;
        const paid =
          b.paidAmount !== undefined ? Number(b.paidAmount)
          : b.status === "confirmed" || b.status === "completed" ? total
          : 0;

        return {
          id: b.id,
          reference: b.reference || b.id,
          userId: b.userId,
          user: user?.fullName || user?.email || "Unknown User",
          contact: user?.phone || user?.email || "—",
          userEmail: user?.email || "—",
          tour: b.package || b.tourName || b.hotel || "Tour Package",
          destination: b.destination || "—",
          duration: b.duration || "—",
          travelers: Number(b.travelers) || Number(b.guests) || 1,
          startDate: b.startDate || b.date || null,
          endDate: b.endDate || null,
          totalAmount: total,
          paidAmount: paid,
          currency: b.currency || "USD",
          status: b.status || "pending",
          bookingDate: b.bookingDate || b.createdAt || null,
          type: b.category || "luxury",
          guide: b.guide || "",
          customised: b.customised || false,
          inclusions: b.inclusions || [],
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

  const stats = useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      revenue: bookings
        .filter((b) => b.status === "confirmed" || b.status === "completed")
        .reduce((sum, b) => sum + b.paidAmount, 0),
    }),
    [bookings],
  );

  /* ------------------------------------------------------------------ */
  /* Filtering                                                           */
  /* ------------------------------------------------------------------ */

  const filteredBookings = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return bookings.filter((b) => {
      const matchesSearch =
        !q ||
        b.user.toLowerCase().includes(q) ||
        b.tour.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesType = typeFilter === "all" || b.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, searchTerm, statusFilter, typeFilter]);

  /* ------------------------------------------------------------------ */
  /* Actions                                                             */
  /* ------------------------------------------------------------------ */

  const updateBooking = (id, patch) => {
    const all = read("bookings", []);
    const next = all.map((b) =>
      String(b.id) === String(id) ? { ...b, ...patch } : b,
    );
    write("bookings", next);
    load();
  };

  const handleViewDetails = (booking) => {
    alert(
      `Booking ${booking.reference}\n\n` +
        `Customer: ${booking.user}\n` +
        `Tour: ${booking.tour}\n` +
        `Destination: ${booking.destination}\n` +
        `Duration: ${booking.duration}\n` +
        `Travelers: ${booking.travelers}\n` +
        `Total: $${booking.totalAmount}\n` +
        `Paid: $${booking.paidAmount}\n` +
        `Status: ${booking.status}`,
    );
  };

  const handleConfirm = (booking) => {
    if (!window.confirm(`Confirm booking ${booking.reference}?`)) return;
    updateBooking(booking.id, {
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
      paidAmount: booking.totalAmount,
    });
  };

  const handleCancel = (booking) => {
    if (!window.confirm(`Cancel booking ${booking.reference}?`)) return;
    updateBooking(booking.id, {
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredBookings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute(
      "download",
      `travel_bookings_${new Date().toISOString().split("T")[0]}.json`,
    );
    link.click();
  };

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  const getPaymentStatus = (b) => {
    if (b.paidAmount === 0) return { status: "unpaid", label: "Unpaid" };
    if (b.paidAmount < b.totalAmount)
      return { status: "partial", label: "Partial" };
    return { status: "paid", label: "Paid" };
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(Number(n) || 0);

  const formatDateRange = (b) => {
    if (!b.startDate) return "—";
    if (!b.endDate) return fmtDate(b.startDate);
    return `${fmtDate(b.startDate)} - ${fmtDate(b.endDate)}`;
  };

  if (loading) {
    return (
      <div className={styles.travelBookings}>
        <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
          Loading travel bookings...
        </div>
      </div>
    );
  }

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
              ${stats.revenue.toLocaleString()}
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
            <option value="all">All Types</option>
            <option value="luxury">Luxury</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="seasonal">Seasonal</option>
            <option value="budget">Budget</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderRow}>
              <div className={styles.tableHeaderCell}>Booking ID</div>
              <div className={styles.tableHeaderCell}>User</div>
              <div className={styles.tableHeaderCell}>Tour Details</div>
              <div className={styles.tableHeaderCell}>Travel Dates</div>
              <div className={styles.tableHeaderCell}>Amount</div>
              <div className={styles.tableHeaderCell}>Status & Actions</div>
            </div>
          </div>

          <div className={styles.tableBody}>
            {filteredBookings.length > 0 ?
              filteredBookings.map((booking) => {
                const payment = getPaymentStatus(booking);
                return (
                  <div key={booking.id} className={styles.tableRow}>
                    <div className={styles.bookingIdCell}>
                      <div className={styles.bookingId}>
                        {booking.reference}
                      </div>
                    </div>

                    <div className={styles.userCell}>
                      <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                          {booking.user.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userDetails}>
                          <div className={styles.userName}>{booking.user}</div>
                          <div className={styles.userContact}>
                            {booking.contact}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.tourCell}>
                      <div className={styles.tourDetails}>
                        <div className={styles.tourName}>{booking.tour}</div>
                        <div className={styles.tourMeta}>
                          <FiMapPin size={12} />
                          {booking.destination}
                        </div>
                      </div>
                    </div>

                    <div className={styles.datesCell}>
                      <div className={styles.datesInfo}>
                        <div className={styles.dateRange}>
                          {formatDateRange(booking)}
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

                    <div className={styles.statusActionsCell}>
                      <div className={styles.statusBadgeWrapper}>
                        <span
                          className={`${styles.statusBadge} ${styles[booking.status]}`}>
                          {booking.status === "confirmed" && (
                            <FiCheck size={12} />
                          )}
                          {booking.status === "pending" && (
                            <FiClock size={12} />
                          )}
                          {booking.status === "completed" && (
                            <FiCheck size={12} />
                          )}
                          {booking.status === "cancelled" && <FiX size={12} />}
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
              })
            : <div className={styles.emptyState}>
                <FiSearch className={styles.emptyIcon} />
                <h3>
                  {bookings.length === 0 ?
                    "No travel bookings yet"
                  : "No bookings match your filters"}
                </h3>
                <p>
                  {bookings.length === 0 ?
                    "Bookings made through the travel agency flow will appear here."
                  : "Try adjusting your search or filters."}
                </p>
                {bookings.length > 0 && (
                  <button
                    className={styles.clearFiltersBtn}
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setTypeFilter("all");
                    }}>
                    Clear All Filters
                  </button>
                )}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelBookings;
