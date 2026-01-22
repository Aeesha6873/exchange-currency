import React, { useState } from "react";
import {
  FiAirplay,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiBriefcase,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import styles from "./ManageFlight.module.css";

const ManageFlights = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const flights = [
    {
      id: "FL-001",
      flightNo: "DL123",
      airline: "Delta Airlines",
      logo: "DL",
      from: "New York (JFK)",
      to: "Los Angeles (LAX)",
      departure: "2024-01-20 08:30",
      arrival: "2024-01-20 11:45",
      duration: "6h 15m",
      seats: { total: 180, available: 45, booked: 135 },
      status: "active",
      price: 450,
      aircraft: "Boeing 737",
    },
    {
      id: "FL-002",
      flightNo: "BA456",
      airline: "British Airways",
      logo: "BA",
      from: "London (LHR)",
      to: "Paris (CDG)",
      departure: "2024-01-21 14:00",
      arrival: "2024-01-21 15:30",
      duration: "1h 30m",
      seats: { total: 150, available: 28, booked: 122 },
      status: "active",
      price: 280,
      aircraft: "Airbus A320",
    },
    {
      id: "FL-003",
      flightNo: "JL789",
      airline: "Japan Airlines",
      logo: "JL",
      from: "Tokyo (NRT)",
      to: "Seoul (ICN)",
      departure: "2024-01-22 10:30",
      arrival: "2024-01-22 12:45",
      duration: "2h 15m",
      seats: { total: 210, available: 85, booked: 125 },
      status: "scheduled",
      price: 320,
      aircraft: "Boeing 777",
    },
    {
      id: "FL-004",
      flightNo: "EK101",
      airline: "Emirates",
      logo: "EK",
      from: "Dubai (DXB)",
      to: "Singapore (SIN)",
      departure: "2024-01-23 22:15",
      arrival: "2024-01-24 06:30",
      duration: "7h 15m",
      seats: { total: 350, available: 120, booked: 230 },
      status: "active",
      price: 850,
      aircraft: "Airbus A380",
    },
    {
      id: "FL-005",
      flightNo: "AA202",
      airline: "American Airlines",
      logo: "AA",
      from: "Chicago (ORD)",
      to: "Miami (MIA)",
      departure: "2024-01-24 16:45",
      arrival: "2024-01-24 20:00",
      duration: "3h 15m",
      seats: { total: 160, available: 15, booked: 145 },
      status: "cancelled",
      price: 380,
      aircraft: "Boeing 737",
    },
    {
      id: "FL-006",
      flightNo: "LH303",
      airline: "Lufthansa",
      logo: "LH",
      from: "Frankfurt (FRA)",
      to: "Rome (FCO)",
      departure: "2024-01-25 09:15",
      arrival: "2024-01-25 10:45",
      duration: "1h 30m",
      seats: { total: 180, available: 65, booked: 115 },
      status: "active",
      price: 290,
      aircraft: "Airbus A320",
    },
  ];

  const stats = {
    total: flights.length,
    active: flights.filter((f) => f.status === "active").length,
    seatsAvailable: flights.reduce((sum, f) => sum + f.seats.available, 0),
    avgOccupancy: Math.round(
      flights.reduce(
        (sum, f) => sum + (f.seats.booked / f.seats.total) * 100,
        0
      ) / flights.length
    ),
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "var(--green)",
      scheduled: "#3b82f6",
      cancelled: "#ef4444",
      completed: "#8b5cf6",
    };
    return colors[status] || colors.active;
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return "#ef4444";
    if (percentage >= 70) return "var(--orange)";
    return "var(--green)";
  };

  return (
    <div className={styles.manageFlights}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiAirplay className={styles.titleIcon} />
            Manage Flights
          </h1>
          <p className={styles.subtitle}>
            Add, edit, and manage flight schedules and details
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}>
            <FiPlus />
            Add Flight
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiAirplay style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Flights</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> +12.5%
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiCheck style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Active Flights</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> +8.3%
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiUsers style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.seatsAvailable}</div>
            <div className={styles.statLabel}>Seats Available</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> +15.2%
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiUsers style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.avgOccupancy}%</div>
            <div className={styles.statLabel}>Avg Occupancy</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> +5.8%
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by flight number, airline, or route..."
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
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flights Grid */}
      <div className={styles.flightsGrid}>
        {flights.map((flight) => {
          const occupancy = (
            (flight.seats.booked / flight.seats.total) *
            100
          ).toFixed(0);

          return (
            <div key={flight.id} className={styles.flightCard}>
              <div className={styles.flightHeader}>
                <div className={styles.airlineInfo}>
                  <div className={styles.airlineLogo}>{flight.logo}</div>
                  <div className={styles.flightDetails}>
                    <div className={styles.flightNumber}>{flight.flightNo}</div>
                    <div className={styles.airlineName}>{flight.airline}</div>
                  </div>
                </div>
                <span
                  className={styles.statusBadge}
                  style={{
                    background: `${getStatusColor(flight.status)}15`,
                    color: getStatusColor(flight.status),
                  }}>
                  {flight.status.charAt(0).toUpperCase() +
                    flight.status.slice(1)}
                </span>
              </div>

              <div className={styles.routeSection}>
                <div className={styles.routeInfo}>
                  <div className={styles.airportInfo}>
                    <div className={styles.airportCode}>JFK</div>
                    <div className={styles.airportName}>{flight.from}</div>
                    <div className={styles.time}>
                      {flight.departure.split(" ")[1]}
                    </div>
                  </div>

                  <div className={styles.routeCenter}>
                    <div className={styles.duration}>
                      <FiClock />
                      {flight.duration}
                    </div>
                    <div className={styles.routeLine}>
                      <div className={styles.line}></div>
                      <div className={styles.planeIcon}>✈️</div>
                    </div>
                  </div>

                  <div className={styles.airportInfo}>
                    <div className={styles.airportCode}>LAX</div>
                    <div className={styles.airportName}>{flight.to}</div>
                    <div className={styles.time}>
                      {flight.arrival.split(" ")[1]}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.flightDetailsSection}>
                <div className={styles.detailRow}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Aircraft:</span>
                    <span className={styles.detailValue}>
                      {flight.aircraft}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Price:</span>
                    <span className={styles.detailValue}>${flight.price}</span>
                  </div>
                </div>

                <div className={styles.seatsSection}>
                  <div className={styles.seatsInfo}>
                    <span className={styles.seatsLabel}>Seats:</span>
                    <span className={styles.seatsValue}>
                      {flight.seats.booked}/{flight.seats.total} booked
                    </span>
                  </div>
                  <div className={styles.occupancyBar}>
                    <div
                      className={styles.occupancyFill}
                      style={{
                        width: `${occupancy}%`,
                        background: getOccupancyColor(occupancy),
                      }}
                    />
                  </div>
                  <div className={styles.occupancyInfo}>
                    <span className={styles.occupancyLabel}>Occupancy:</span>
                    <span
                      className={styles.occupancyValue}
                      style={{ color: getOccupancyColor(occupancy) }}>
                      {occupancy}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.flightActions}>
                <button className={styles.actionBtn} title="View Details">
                  <FiEye />
                </button>
                <button className={styles.actionBtnEdit} title="Edit Flight">
                  <FiEdit2 />
                </button>
                {flight.status === "active" && (
                  <button
                    className={styles.actionBtnCancel}
                    title="Cancel Flight">
                    <FiX />
                  </button>
                )}
                <button
                  className={styles.actionBtnDelete}
                  title="Delete Flight">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageFlights;
