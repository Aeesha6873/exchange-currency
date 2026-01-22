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
  FiFilter,
  FiSearch,
  FiChevronRight,
  FiUser,
  FiUsers,
  FiTag,
  FiNavigation,
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
  FiStar,
  FiShare2,
  FiMessageSquare,
  FiPrinter,
  FiMail,
} from "react-icons/fi";
import {
  MdFlight,
  MdHotel,
  MdDirectionsCar,
  MdRestaurant,
  MdLocalActivity,
} from "react-icons/md";

function Bookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBookings = [
        {
          id: 1,
          type: "flight",
          reference: "FLT-789012",
          destination: "Paris, France",
          date: "2024-12-15",
          time: "14:30",
          status: "confirmed",
          airline: "Air France",
          flight: "AF123",
          price: 650,
          currency: "USD",
          passengers: 2,
          class: "Economy",
          departure: "JFK",
          arrival: "CDG",
          duration: "7h 30m",
          bookingDate: "2024-11-10",
          amenities: ["Meal", "Entertainment", "Wi-Fi"],
        },
        {
          id: 2,
          type: "hotel",
          reference: "HTL-345678",
          destination: "Bali, Indonesia",
          date: "2024-12-20",
          checkIn: "2024-12-20",
          checkOut: "2024-12-25",
          duration: "5 nights",
          status: "confirmed",
          hotel: "Grand Bali Resort",
          price: 1200,
          currency: "USD",
          rooms: 1,
          roomType: "Deluxe Suite",
          guests: 2,
          bookingDate: "2024-11-05",
          amenities: ["Pool", "Spa", "Breakfast", "Beach Access"],
        },
        {
          id: 3,
          type: "tour",
          reference: "TR-456789",
          destination: "Tokyo, Japan",
          date: "2024-12-05",
          time: "09:00",
          status: "completed",
          tourName: "Tokyo City Tour",
          price: 350,
          currency: "USD",
          duration: "8 hours",
          participants: 4,
          bookingDate: "2024-10-15",
          amenities: ["Guide", "Transport", "Lunch"],
        },
        {
          id: 4,
          type: "car",
          reference: "CAR-123456",
          destination: "Los Angeles, USA",
          date: "2024-12-01",
          status: "pending",
          carModel: "Tesla Model 3",
          price: 450,
          currency: "USD",
          duration: "7 days",
          pickup: "LAX Airport",
          dropoff: "LAX Airport",
          bookingDate: "2024-11-20",
          amenities: ["GPS", "Insurance", "Unlimited Miles"],
        },
        {
          id: 5,
          type: "flight",
          reference: "FLT-987654",
          destination: "Dubai, UAE",
          date: "2024-11-28",
          time: "22:15",
          status: "cancelled",
          airline: "Emirates",
          flight: "EK202",
          price: 950,
          currency: "USD",
          passengers: 1,
          class: "Business",
          departure: "DXB",
          arrival: "JFK",
          duration: "14h",
          bookingDate: "2024-10-01",
          cancellationDate: "2024-10-15",
          refundAmount: 855,
        },
      ];
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const [stats] = useState({
    totalBookings: 5,
    flights: 2,
    hotels: 1,
    tours: 1,
    cars: 1,
    totalSpent: "$3,600",
    upcomingTrips: 2,
    savings: "$150",
  });

  const bookingTabs = [
    { id: "upcoming", label: "Upcoming", count: 2, color: "#10b981" },
    { id: "completed", label: "Completed", count: 1, color: "#3b82f6" },
    { id: "cancelled", label: "Cancelled", count: 1, color: "#ef4444" },
    { id: "pending", label: "Pending", count: 1, color: "#f59e0b" },
  ];

  const statusFilters = [
    { id: "all", label: "All Status" },
    { id: "confirmed", label: "Confirmed" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const typeFilters = [
    { id: "all", label: "All Types", icon: "📅" },
    { id: "flight", label: "Flights", icon: "✈️" },
    { id: "hotel", label: "Hotels", icon: "🏨" },
    { id: "tour", label: "Tours", icon: "🗺️" },
    { id: "car", label: "Cars", icon: "🚗" },
  ];

  const quickActions = [
    {
      id: 1,
      label: "Book Flight",
      icon: <MdFlight />,
      path: "/dashboard/flight",
      description: "Find best flight deals",
      color: "var(--green)",
    },
    {
      id: 2,
      label: "Find Hotel",
      icon: <MdHotel />,
      path: "/dashboard/hotel",
      description: "Best hotels worldwide",
      color: "var(--orange)",
    },
    {
      id: 3,
      label: "Plan Tour",
      icon: <MdLocalActivity />,
      path: "/dashboard/tours",
      description: "Curated experiences",
      color: "var(--dark-green)",
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
          <FiClock /> Pending
        </span>
      ),
      completed: (
        <span className={styles.statusBadgeCompleted}>
          <FiCheck /> Completed
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
      restaurant: <MdRestaurant />,
    };
    return icons[type] || <FiCalendar />;
  };

  const getTypeColor = (type) => {
    const colors = {
      flight: "#3b82f6",
      hotel: "#10b981",
      tour: "#8b5cf6",
      car: "#f59e0b",
      restaurant: "#ef4444",
    };
    return colors[type] || "#64748b";
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesTab =
      activeTab === "upcoming"
        ? booking.status === "confirmed" && new Date(booking.date) > new Date()
        : activeTab === "completed"
        ? booking.status === "completed"
        : activeTab === "cancelled"
        ? booking.status === "cancelled"
        : activeTab === "pending"
        ? booking.status === "pending"
        : true;

    const matchesSearch =
      searchQuery === "" ||
      booking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.airline &&
        booking.airline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.hotel &&
        booking.hotel.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;

    return matchesTab && matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
  };

  const handleDownloadInvoice = (booking) => {
    alert(`Downloading invoice for ${booking.reference}`);
  };

  const handleCancelBooking = (booking) => {
    if (
      window.confirm(
        `Are you sure you want to cancel booking ${booking.reference}?`
      )
    ) {
      alert(`Booking ${booking.reference} cancelled successfully.`);
    }
  };

  const handleModifyBooking = (booking) => {
    alert(`Modify booking ${booking.reference}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>My Bookings</h1>
              <p className={styles.heroSubtitle}>
                Manage your travel bookings, reservations, and itineraries
              </p>
            </div>
            <button
              className={styles.newBookingButton}
              onClick={() => navigate("/dashboard/flight")}>
              <MdFlight /> New Booking
            </button>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: "#10b981" }}>
                <FiCalendar />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stats.totalBookings}</div>
                <div className={styles.statLabel}>Total Bookings</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: "#3b82f6" }}>
                <MdFlight />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stats.flights}</div>
                <div className={styles.statLabel}>Flights</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: "#10b981" }}>
                <MdHotel />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stats.hotels}</div>
                <div className={styles.statLabel}>Hotels</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: "#f59e0b" }}>
                <FiCreditCard />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stats.totalSpent}</div>
                <div className={styles.statLabel}>Total Spent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Search and Filters */}
            <div className={styles.searchFiltersCard}>
              <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                  <FiSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search bookings by destination, reference, or airline..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                <button className={styles.filterButton}>
                  <FiFilter /> Filters
                </button>
              </div>

              <div className={styles.filterChips}>
                {statusFilters.map((filter) => (
                  <button
                    key={filter.id}
                    className={`${styles.filterChip} ${
                      filterStatus === filter.id ? styles.active : ""
                    }`}
                    onClick={() => setFilterStatus(filter.id)}>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Tabs */}
            <div className={styles.bookingTabs}>
              {bookingTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabButton} ${
                    activeTab === tab.id ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    borderBottomColor: activeTab === tab.id ? tab.color : "",
                  }}>
                  <div className={styles.tabContent}>
                    <div className={styles.tabLabel}>{tab.label}</div>
                    <div
                      className={styles.tabBadge}
                      style={{ backgroundColor: tab.color }}>
                      {tab.count}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className={styles.bookingsList}>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.bookingHeader}>
                      <div className={styles.bookingType}>
                        <div
                          className={styles.typeIcon}
                          style={{ color: getTypeColor(booking.type) }}>
                          {getTypeIcon(booking.type)}
                        </div>
                        <div className={styles.typeInfo}>
                          <div className={styles.typeLabel}>
                            {booking.type.charAt(0).toUpperCase() +
                              booking.type.slice(1)}
                          </div>
                          <div className={styles.bookingReference}>
                            {booking.reference}
                          </div>
                        </div>
                      </div>
                      <div className={styles.bookingDate}>
                        {formatDate(booking.date)}
                      </div>
                    </div>

                    <div className={styles.bookingContent}>
                      <div className={styles.bookingInfo}>
                        <div className={styles.destinationRow}>
                          <FiMapPin className={styles.infoIcon} />
                          <h3 className={styles.destination}>
                            {booking.destination}
                          </h3>
                        </div>

                        <div className={styles.detailsGrid}>
                          {booking.airline && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>
                                Airline:
                              </span>
                              <span className={styles.detailValue}>
                                {booking.airline} ({booking.flight})
                              </span>
                            </div>
                          )}

                          {booking.hotel && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Hotel:</span>
                              <span className={styles.detailValue}>
                                {booking.hotel}
                              </span>
                            </div>
                          )}

                          {booking.tourName && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Tour:</span>
                              <span className={styles.detailValue}>
                                {booking.tourName}
                              </span>
                            </div>
                          )}

                          {booking.carModel && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Car:</span>
                              <span className={styles.detailValue}>
                                {booking.carModel}
                              </span>
                            </div>
                          )}

                          {booking.time && (
                            <div className={styles.detailItem}>
                              <FiClock className={styles.infoIcon} />
                              <span className={styles.detailValue}>
                                {booking.time}
                              </span>
                            </div>
                          )}

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

                          {booking.passengers && (
                            <div className={styles.detailItem}>
                              <FiUsers className={styles.infoIcon} />
                              <span className={styles.detailValue}>
                                {booking.passengers} passenger
                                {booking.passengers > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>

                        {booking.amenities && booking.amenities.length > 0 && (
                          <div className={styles.amenities}>
                            {booking.amenities.map((amenity, index) => (
                              <span key={index} className={styles.amenity}>
                                <FiCheck /> {amenity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={styles.bookingActions}>
                        <div className={styles.actionStatus}>
                          {getStatusBadge(booking.status)}
                          <div className={styles.bookingPrice}>
                            {booking.currency} {booking.price}
                          </div>
                        </div>

                        <div className={styles.actionButtons}>
                          <button
                            className={styles.viewButton}
                            onClick={() => handleViewDetails(booking)}>
                            <FiEye /> Details
                          </button>
                          <button
                            className={styles.downloadButton}
                            onClick={() => handleDownloadInvoice(booking)}>
                            <FiDownload /> Invoice
                          </button>
                          {booking.status === "confirmed" && (
                            <>
                              <button
                                className={styles.modifyButton}
                                onClick={() => handleModifyBooking(booking)}>
                                <FiEdit2 /> Modify
                              </button>
                              <button
                                className={styles.cancelButton}
                                onClick={() => handleCancelBooking(booking)}>
                                <FiX /> Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <FiCalendar className={styles.emptyIcon} />
                  <h3>No bookings found</h3>
                  <p>
                    {searchQuery
                      ? "No bookings match your search criteria"
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
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Quick Actions</h3>
              <div className={styles.quickActions}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className={styles.quickAction}
                    onClick={() => navigate(action.path)}
                    style={{ borderLeftColor: action.color }}>
                    <div
                      className={styles.quickActionIcon}
                      style={{ color: action.color }}>
                      {action.icon}
                    </div>
                    <div className={styles.quickActionContent}>
                      <div className={styles.quickActionTitle}>
                        {action.label}
                      </div>
                      <div className={styles.quickActionDescription}>
                        {action.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Tips */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Booking Tips</h3>
              <div className={styles.tipsList}>
                <div className={styles.tipItem}>
                  <FiCheckCircle className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Check-in online 24h before flight
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheckCircle className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Download boarding passes
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheckCircle className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Review cancellation policies
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheckCircle className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Keep travel documents handy
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiCalendar /> Recent Activity
              </h3>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div
                    className={styles.activityIcon}
                    style={{ color: "#10b981" }}>
                    <FiCheck />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Flight to Paris confirmed
                    </div>
                    <div className={styles.activityTime}>Today, 10:30 AM</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div
                    className={styles.activityIcon}
                    style={{ color: "#3b82f6" }}>
                    <FiDownload />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Downloaded Tokyo tour invoice
                    </div>
                    <div className={styles.activityTime}>Yesterday</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div
                    className={styles.activityIcon}
                    style={{ color: "#f59e0b" }}>
                    <FiClock />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Hotel booking pending payment
                    </div>
                    <div className={styles.activityTime}>2 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Booking Details</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseDetails}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.bookingSummary}>
                <div className={styles.summaryHeader}>
                  <div
                    className={styles.summaryTypeIcon}
                    style={{ color: getTypeColor(selectedBooking.type) }}>
                    {getTypeIcon(selectedBooking.type)}
                  </div>
                  <div className={styles.summaryInfo}>
                    <h3 className={styles.summaryTitle}>
                      {selectedBooking.destination}
                    </h3>
                    <div className={styles.summaryReference}>
                      Reference: {selectedBooking.reference}
                    </div>
                  </div>
                  {getStatusBadge(selectedBooking.status)}
                </div>

                <div className={styles.summaryDetails}>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>Booking Information</h4>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Date:</span>
                        <span className={styles.detailValue}>
                          {formatDate(selectedBooking.date)}
                        </span>
                      </div>
                      {selectedBooking.time && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Time:</span>
                          <span className={styles.detailValue}>
                            {selectedBooking.time}
                          </span>
                        </div>
                      )}
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Booked On:</span>
                        <span className={styles.detailValue}>
                          {formatDate(selectedBooking.bookingDate)}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Status:</span>
                        <span className={styles.detailValue}>
                          {selectedBooking.status.charAt(0).toUpperCase() +
                            selectedBooking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>Payment Details</h4>
                    <div className={styles.paymentSummary}>
                      <div className={styles.paymentRow}>
                        <span>Amount:</span>
                        <span className={styles.paymentAmount}>
                          {selectedBooking.currency} {selectedBooking.price}
                        </span>
                      </div>
                      {selectedBooking.cancellationDate && (
                        <div className={styles.paymentRow}>
                          <span>Cancelled On:</span>
                          <span>
                            {formatDate(selectedBooking.cancellationDate)}
                          </span>
                        </div>
                      )}
                      {selectedBooking.refundAmount && (
                        <div className={styles.paymentRow}>
                          <span>Refund Amount:</span>
                          <span className={styles.refundAmount}>
                            {selectedBooking.currency}{" "}
                            {selectedBooking.refundAmount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalActions}>
                <button
                  className={styles.modalButton}
                  onClick={() => handleDownloadInvoice(selectedBooking)}>
                  <FiDownload /> Download Invoice
                </button>
                <button className={styles.modalButtonSecondary}>
                  <FiPrinter /> Print
                </button>
                <button className={styles.modalButtonSecondary}>
                  <FiMail /> Email
                </button>
                {selectedBooking.status === "confirmed" && (
                  <button
                    className={styles.modalButtonDanger}
                    onClick={() => {
                      handleCancelBooking(selectedBooking);
                      handleCloseDetails();
                    }}>
                    <FiX /> Cancel Booking
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
