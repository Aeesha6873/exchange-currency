import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Bookings.module.css";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiDownload,
  FiEye,
  FiSearch,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit2,
  FiPrinter,
  FiMail,
  FiChevronRight,
} from "react-icons/fi";
import {
  MdFlight,
  MdHotel,
  MdDirectionsCar,
  MdLocalActivity,
} from "react-icons/md";
import { authApi, bookingsApi } from "../../services/api";

function Bookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    (async () => {
      const rows = await bookingsApi.list(currentUser.id);
      setBookings(rows);
      setLoading(false);
    })();
  }, [navigate]);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const stats = {
    totalBookings: bookings.length,
    flights: bookings.filter((b) => b.type === "flight").length,
    hotels: bookings.filter((b) => b.type === "hotel").length,
    totalSpent:
      "$" +
      bookings
        .reduce((sum, b) => sum + (b.currency === "USD" ? b.price : 0), 0)
        .toLocaleString(),
  };

  const bookingTabs = [
    {
      id: "upcoming",
      label: "Upcoming",
      count: bookings.filter(
        (b) => b.status === "confirmed" && new Date(b.date) > now,
      ).length,
    },
    {
      id: "completed",
      label: "Completed",
      count: bookings.filter((b) => b.status === "completed").length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: bookings.filter((b) => b.status === "cancelled").length,
    },
    {
      id: "pending",
      label: "Pending",
      count: bookings.filter((b) => b.status === "pending").length,
    },
  ];

  const statusFilters = [
    { id: "all", label: "All" },
    { id: "confirmed", label: "Confirmed" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const quickActions = [
    {
      id: 1,
      label: "Book Flight",
      icon: <MdFlight />,
      path: "/dashboard/flight",
      description: "Find best flight deals",
    },
    {
      id: 2,
      label: "Find Hotel",
      icon: <MdHotel />,
      path: "/dashboard/hotel",
      description: "Best hotels worldwide",
    },
    {
      id: 3,
      label: "Plan Tour",
      icon: <MdLocalActivity />,
      path: "/dashboard/tours",
      description: "Curated experiences",
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: (
        <span className={styles.statusBadgeConfirmed}>
          <FiCheckCircle /> Confirmed
        </span>
      ),
      pending: (
        <span className={styles.statusBadgePending}>
          <FiAlertCircle /> Pending
        </span>
      ),
      completed: (
        <span className={styles.statusBadgeCompleted}>
          <FiCheckCircle /> Completed
        </span>
      ),
      cancelled: (
        <span className={styles.statusBadgeCancelled}>
          <FiX /> Cancelled
        </span>
      ),
    };
    return badges[status] || badges.pending;
  };

  const getTypeIcon = (type) => {
    const icons = {
      flight: <MdFlight />,
      hotel: <MdHotel />,
      tour: <MdLocalActivity />,
      car: <MdDirectionsCar />,
    };
    return icons[type] || <FiCalendar />;
  };

  const getTypeColor = (type) => {
    const colors = {
      flight: "#3b82f6",
      hotel: "#10b981",
      tour: "#8b5cf6",
      car: "#f59e0b",
    };
    return colors[type] || "#64748b";
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesTab =
      activeTab === "upcoming" ?
        booking.status === "confirmed" && new Date(booking.date) >= now
      : activeTab === "completed" ? booking.status === "completed"
      : activeTab === "cancelled" ? booking.status === "cancelled"
      : activeTab === "pending" ? booking.status === "pending"
      : true;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      booking.destination?.toLowerCase().includes(q) ||
      booking.reference?.toLowerCase().includes(q) ||
      booking.airline?.toLowerCase().includes(q) ||
      booking.hotel?.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;

    return matchesTab && matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking) => setSelectedBooking(booking);
  const handleCloseDetails = () => setSelectedBooking(null);

  const handleDownloadInvoice = (booking) =>
    alert(`Downloading invoice for ${booking.reference}`);

  const handleCancelBooking = async (booking) => {
    if (
      !window.confirm(`Are you sure you want to cancel ${booking.reference}?`)
    )
      return;
    const updated = await bookingsApi.cancel(booking.id);
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
    alert(`Booking ${booking.reference} cancelled successfully.`);
  };

  const handleModifyBooking = (booking) =>
    alert(`Modify booking ${booking.reference}`);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className={styles.bookingsContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Bookings</h1>
          <p className={styles.subtitle}>
            Track your travel bookings and reservations
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.newBookingButton}
            onClick={() => navigate("/dashboard/flight")}>
            <MdFlight />
            New Booking
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{stats.totalBookings}</span>
          <span className={styles.statLabel}>Total Bookings</span>
        </div>
        <div className={`${styles.statItem} ${styles.statFlight}`}>
          <span className={styles.statNumber}>{stats.flights}</span>
          <span className={styles.statLabel}>Flights</span>
        </div>
        <div className={`${styles.statItem} ${styles.statHotel}`}>
          <span className={styles.statNumber}>{stats.hotels}</span>
          <span className={styles.statLabel}>Hotels</span>
        </div>
        <div className={`${styles.statItem} ${styles.statMoney}`}>
          <span className={styles.statNumber}>{stats.totalSpent}</span>
          <span className={styles.statLabel}>Total Spent</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search bookings by destination, reference, or airline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              className={`${styles.filterBtn} ${
                filterStatus === filter.id ? styles.active : ""
              }`}
              onClick={() => setFilterStatus(filter.id)}>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.bookingTabs}>
          {bookingTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${
                activeTab === tab.id ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.id)}>
              <div className={styles.tabContent}>
                <div className={styles.tabLabel}>{tab.label}</div>
                <div className={styles.tabBadge}>{tab.count}</div>
              </div>
            </button>
          ))}
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            <div className={styles.bookingsList}>
              {filteredBookings.length > 0 ?
                filteredBookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.bookingType}>
                        <div
                          className={styles.typeIcon}
                          style={{ color: getTypeColor(booking.type) }}>
                          {getTypeIcon(booking.type)}
                        </div>
                        <div className={styles.bookingInfo}>
                          <div className={styles.typeLabel}>
                            {booking.type.charAt(0).toUpperCase() +
                              booking.type.slice(1)}
                          </div>
                          <div className={styles.bookingReference}>
                            #{booking.reference}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${styles.status} ${
                          styles[`status${booking.status}`]
                        }`}>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.destinationRow}>
                        <FiMapPin className={styles.destinationIcon} />
                        <h3 className={styles.destination}>
                          {booking.destination}
                        </h3>
                      </div>

                      <div className={styles.bookingDetails}>
                        <div className={styles.detailItem}>
                          <FiCalendar className={styles.detailIcon} />
                          <div>
                            <div className={styles.detailLabel}>Date</div>
                            <div className={styles.detailValue}>
                              {formatDate(booking.date)}
                            </div>
                          </div>
                        </div>
                        {booking.time && (
                          <div className={styles.detailItem}>
                            <FiClock className={styles.detailIcon} />
                            <div>
                              <div className={styles.detailLabel}>Time</div>
                              <div className={styles.detailValue}>
                                {booking.time}
                              </div>
                            </div>
                          </div>
                        )}
                        {booking.duration && (
                          <div className={styles.detailItem}>
                            <FiClock className={styles.detailIcon} />
                            <div>
                              <div className={styles.detailLabel}>Duration</div>
                              <div className={styles.detailValue}>
                                {booking.duration}
                              </div>
                            </div>
                          </div>
                        )}
                        {booking.passengers && (
                          <div className={styles.detailItem}>
                            <FiUsers className={styles.detailIcon} />
                            <div>
                              <div className={styles.detailLabel}>
                                Passengers
                              </div>
                              <div className={styles.detailValue}>
                                {Array.isArray(booking.passengers) ?
                                  booking.passengers.length
                                : booking.passengers}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {booking.amenities && booking.amenities.length > 0 && (
                        <div className={styles.amenities}>
                          {booking.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className={styles.amenity}>
                              <FiCheck /> {amenity}
                            </span>
                          ))}
                          {booking.amenities.length > 3 && (
                            <span className={styles.amenityMore}>
                              +{booking.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.priceSection}>
                        <div className={styles.bookingPrice}>
                          {booking.currency} {booking.price}
                        </div>
                        <div className={styles.bookingDate}>
                          Booked: {formatDate(booking.bookingDate)}
                        </div>
                      </div>

                      <div className={styles.actionButtons}>
                        <button
                          className={styles.viewButton}
                          onClick={() => handleViewDetails(booking)}>
                          <FiEye />
                          Details
                        </button>
                        <button
                          className={styles.downloadButton}
                          onClick={() => handleDownloadInvoice(booking)}>
                          <FiDownload />
                          Invoice
                        </button>
                        {booking.status === "confirmed" && (
                          <>
                            <button
                              className={styles.modifyButton}
                              onClick={() => handleModifyBooking(booking)}>
                              <FiEdit2 />
                              Modify
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={() => handleCancelBooking(booking)}>
                              <FiX />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : <div className={styles.emptyState}>
                  <FiCalendar className={styles.emptyIcon} />
                  <h3>No bookings found</h3>
                  <p>
                    {searchQuery ?
                      "No bookings match your search criteria"
                    : `You don't have any ${activeTab} bookings at the moment.`}
                  </p>
                  {activeTab === "upcoming" && (
                    <button
                      className={styles.newBookingAction}
                      onClick={() => navigate("/dashboard/flight")}>
                      <MdFlight /> Book Your Next Trip
                    </button>
                  )}
                </div>
              }
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Quick Actions</h3>
              <div className={styles.quickActions}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className={styles.quickAction}
                    onClick={() => navigate(action.path)}>
                    <div className={styles.quickActionIcon}>{action.icon}</div>
                    <div className={styles.quickActionContent}>
                      <div className={styles.quickActionTitle}>
                        {action.label}
                      </div>
                      <div className={styles.quickActionDescription}>
                        {action.description}
                      </div>
                    </div>
                    <FiChevronRight className={styles.quickActionArrow} />
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Booking Tips</h3>
              <div className={styles.tipsList}>
                {[
                  "Check-in online 24h before flight",
                  "Download boarding passes",
                  "Review cancellation policies",
                  "Keep travel documents handy",
                ].map((tip, i) => (
                  <div key={i} className={styles.tipItem}>
                    <FiCheckCircle className={styles.tipIcon} />
                    <div className={styles.tipContent}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <div className={styles.modalOverlay} onClick={handleCloseDetails}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <div
                  className={styles.modalTypeIcon}
                  style={{ color: getTypeColor(selectedBooking.type) }}>
                  {getTypeIcon(selectedBooking.type)}
                </div>
                <div>
                  <h2>{selectedBooking.destination}</h2>
                  <p className={styles.modalReference}>
                    #{selectedBooking.reference}
                  </p>
                </div>
              </div>
              <button
                className={styles.modalClose}
                onClick={handleCloseDetails}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <div className={styles.modalStatus}>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div className={styles.modalDates}>
                  <div className={styles.dateInfo}>
                    <FiCalendar />
                    <span>
                      <strong>Travel Date:</strong>{" "}
                      {formatDate(selectedBooking.date)}
                    </span>
                  </div>
                  {selectedBooking.time && (
                    <div className={styles.dateInfo}>
                      <FiClock />
                      <span>
                        <strong>Time:</strong> {selectedBooking.time}
                      </span>
                    </div>
                  )}
                  <div className={styles.dateInfo}>
                    <FiCalendar />
                    <span>
                      <strong>Booked On:</strong>{" "}
                      {formatDate(selectedBooking.bookingDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.modalGrid}>
                <div className={styles.detailCard}>
                  <h3>Booking Details</h3>
                  <div className={styles.detailList}>
                    {selectedBooking.airline && (
                      <div className={styles.detailRow}>
                        <span>Airline:</span>
                        <span>
                          {selectedBooking.airline} ({selectedBooking.flight})
                        </span>
                      </div>
                    )}
                    {selectedBooking.hotel && (
                      <div className={styles.detailRow}>
                        <span>Hotel:</span>
                        <span>{selectedBooking.hotel}</span>
                      </div>
                    )}
                    {selectedBooking.tourName && (
                      <div className={styles.detailRow}>
                        <span>Tour:</span>
                        <span>{selectedBooking.tourName}</span>
                      </div>
                    )}
                    {selectedBooking.carModel && (
                      <div className={styles.detailRow}>
                        <span>Car:</span>
                        <span>{selectedBooking.carModel}</span>
                      </div>
                    )}
                    <div className={styles.detailRow}>
                      <span>Class/Type:</span>
                      <span>
                        {selectedBooking.class ||
                          selectedBooking.roomType ||
                          "Standard"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h3>Payment Details</h3>
                  <div className={styles.paymentSummary}>
                    <div className={styles.paymentRow}>
                      <span>Amount:</span>
                      <span className={styles.paymentAmount}>
                        {selectedBooking.currency} {selectedBooking.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.amenities &&
                selectedBooking.amenities.length > 0 && (
                  <div className={styles.modalSection}>
                    <h3>Amenities & Services</h3>
                    <div className={styles.modalAmenities}>
                      {selectedBooking.amenities.map((amenity, i) => (
                        <div key={i} className={styles.modalAmenity}>
                          <FiCheck />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalActions}>
                <button
                  className={styles.modalButton}
                  onClick={() => handleDownloadInvoice(selectedBooking)}>
                  <FiDownload />
                  Download Invoice
                </button>
                <button className={styles.modalButtonSecondary}>
                  <FiPrinter />
                  Print
                </button>
                <button className={styles.modalButtonSecondary}>
                  <FiMail />
                  Email
                </button>
                {selectedBooking.status === "confirmed" && (
                  <button
                    className={styles.modalButtonDanger}
                    onClick={() => {
                      handleCancelBooking(selectedBooking);
                      handleCloseDetails();
                    }}>
                    <FiX />
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
