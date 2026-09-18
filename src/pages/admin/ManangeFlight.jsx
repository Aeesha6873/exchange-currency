import React, { useState, useEffect, useMemo } from "react";
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
  FiUsers,
  FiSave,
} from "react-icons/fi";
import styles from "./ManageFlight.module.css";

const KEYS = {
  FLIGHTS: "flights",
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

const uid = (prefix = "fl") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const emptyFlight = () => ({
  id: "",
  flightNo: "",
  airline: "",
  logo: "",
  from: "",
  to: "",
  departure: "",
  arrival: "",
  duration: "",
  seats: { total: 180, available: 180, booked: 0 },
  status: "active",
  price: 0,
  aircraft: "",
});

const ManageFlights = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [draft, setDraft] = useState(emptyFlight());

  /* ---------- load ---------- */
  const load = () => {
    setFlights(read(KEYS.FLIGHTS, []));
    setLoading(false);
  };

  useEffect(() => {
    load();
    const onStorage = (e) => {
      if (e.key === KEYS.FLIGHTS) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (rows) => {
    write(KEYS.FLIGHTS, rows);
    setFlights(rows);
  };

  /* ---------- stats ---------- */
  const stats = useMemo(() => {
    const totalSeats = flights.reduce((s, f) => s + (f.seats?.total || 0), 0);
    const bookedSeats = flights.reduce((s, f) => s + (f.seats?.booked || 0), 0);
    return {
      total: flights.length,
      active: flights.filter((f) => f.status === "active").length,
      seatsAvailable: flights.reduce(
        (s, f) => s + (f.seats?.available || 0),
        0,
      ),
      avgOccupancy:
        totalSeats === 0 ? 0 : Math.round((bookedSeats / totalSeats) * 100),
    };
  }, [flights]);

  /* ---------- filter ---------- */
  const filteredFlights = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return flights.filter((f) => {
      const matchesSearch =
        !q ||
        (f.flightNo || "").toLowerCase().includes(q) ||
        (f.airline || "").toLowerCase().includes(q) ||
        (f.from || "").toLowerCase().includes(q) ||
        (f.to || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [flights, searchTerm, statusFilter]);

  /* ---------- modal ---------- */
  const openAddModal = () => {
    setEditingFlight(null);
    setDraft(emptyFlight());
    setShowModal(true);
  };

  const openEditModal = (flight) => {
    setEditingFlight(flight);
    setDraft({ ...flight, seats: { ...flight.seats } });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFlight(null);
    setDraft(emptyFlight());
  };

  const updateDraft = (field, value) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const updateSeat = (field, value) => {
    const seats = { ...draft.seats, [field]: Number(value) || 0 };
    seats.booked = Math.max(0, seats.total - seats.available);
    setDraft((prev) => ({ ...prev, seats }));
  };

  const handleSave = () => {
    if (!draft.flightNo.trim() || !draft.airline.trim()) {
      alert("Flight number and airline are required");
      return;
    }
    if (!draft.from.trim() || !draft.to.trim()) {
      alert("Departure and arrival are required");
      return;
    }

    if (editingFlight) {
      persist(
        flights.map((f) =>
          f.id === editingFlight.id ? { ...draft, id: f.id } : f,
        ),
      );
    } else {
      persist([
        ...flights,
        { ...draft, id: uid("fl"), createdAt: new Date().toISOString() },
      ]);
    }
    closeModal();
  };

  const handleCancelFlight = (flight) => {
    if (!window.confirm(`Cancel flight ${flight.flightNo}?`)) return;
    persist(
      flights.map((f) =>
        f.id === flight.id ?
          { ...f, status: "cancelled", cancelledAt: new Date().toISOString() }
        : f,
      ),
    );
  };

  const handleDeleteFlight = (flight) => {
    if (
      !window.confirm(
        `Delete flight ${flight.flightNo}? This cannot be undone.`,
      )
    )
      return;
    persist(flights.filter((f) => f.id !== flight.id));
  };

  const handleToggleStatus = (flight) => {
    const next =
      flight.status === "active" ? "scheduled"
      : flight.status === "scheduled" ? "active"
      : "active";
    persist(
      flights.map((f) => (f.id === flight.id ? { ...f, status: next } : f)),
    );
  };

  /* ---------- display helpers ---------- */
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

  const getAirportCode = (text) => {
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1] : text.slice(0, 3).toUpperCase();
  };

  const getAirportCity = (text) => text.replace(/\s*\([^)]*\)\s*/, "").trim();

  if (loading) {
    return (
      <div className={styles.manageFlights}>
        <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
          Loading flights...
        </div>
      </div>
    );
  }

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
          <button className={styles.addBtn} onClick={openAddModal}>
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

      {/* Grid */}
      {filteredFlights.length === 0 ?
        <div
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            color: "#64748b",
          }}>
          <FiAirplay style={{ fontSize: "2.5rem", marginBottom: 12 }} />
          <h3 style={{ color: "#064e3b", margin: "0 0 6px 0" }}>
            {flights.length === 0 ? "No flights yet" : "No matching flights"}
          </h3>
          <p style={{ margin: "0 0 16px 0", fontSize: 14 }}>
            {flights.length === 0 ?
              "Add your first flight to get started."
            : "Try adjusting your search or filters."}
          </p>
          {flights.length === 0 ?
            <button className={styles.addBtn} onClick={openAddModal}>
              <FiPlus /> Add Flight
            </button>
          : <button
              className={styles.addBtn}
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}>
              Clear Filters
            </button>
          }
        </div>
      : <div className={styles.flightsGrid}>
          {filteredFlights.map((flight) => {
            const occupancy =
              flight.seats?.total > 0 ?
                Math.round((flight.seats.booked / flight.seats.total) * 100)
              : 0;

            return (
              <div key={flight.id} className={styles.flightCard}>
                <div className={styles.flightHeader}>
                  <div className={styles.airlineInfo}>
                    <div className={styles.airlineLogo}>
                      {flight.logo || flight.airline.slice(0, 2).toUpperCase()}
                    </div>
                    <div className={styles.flightDetails}>
                      <div className={styles.flightNumber}>
                        {flight.flightNo}
                      </div>
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
                      <div className={styles.airportCode}>
                        {getAirportCode(flight.from)}
                      </div>
                      <div className={styles.airportName}>
                        {getAirportCity(flight.from)}
                      </div>
                      {flight.departure && (
                        <div className={styles.time}>
                          {flight.departure.split(" ")[1] || flight.departure}
                        </div>
                      )}
                    </div>

                    <div className={styles.routeCenter}>
                      {flight.duration && (
                        <div className={styles.duration}>
                          <FiClock />
                          {flight.duration}
                        </div>
                      )}
                      <div className={styles.routeLine}>
                        <div className={styles.line}></div>
                        <div className={styles.planeIcon}>✈️</div>
                      </div>
                    </div>

                    <div className={styles.airportInfo}>
                      <div className={styles.airportCode}>
                        {getAirportCode(flight.to)}
                      </div>
                      <div className={styles.airportName}>
                        {getAirportCity(flight.to)}
                      </div>
                      {flight.arrival && (
                        <div className={styles.time}>
                          {flight.arrival.split(" ")[1] || flight.arrival}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.flightDetailsSection}>
                  <div className={styles.detailRow}>
                    {flight.aircraft && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Aircraft:</span>
                        <span className={styles.detailValue}>
                          {flight.aircraft}
                        </span>
                      </div>
                    )}
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Price:</span>
                      <span className={styles.detailValue}>
                        ${flight.price}
                      </span>
                    </div>
                  </div>

                  <div className={styles.seatsSection}>
                    <div className={styles.seatsInfo}>
                      <span className={styles.seatsLabel}>Seats:</span>
                      <span className={styles.seatsValue}>
                        {flight.seats?.booked || 0}/{flight.seats?.total || 0}{" "}
                        booked
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
                  <button
                    className={styles.actionBtn}
                    title="Toggle Status"
                    onClick={() => handleToggleStatus(flight)}>
                    <FiEye />
                  </button>
                  <button
                    className={styles.actionBtnEdit}
                    title="Edit Flight"
                    onClick={() => openEditModal(flight)}>
                    <FiEdit2 />
                  </button>
                  {flight.status === "active" && (
                    <button
                      className={styles.actionBtnCancel}
                      title="Cancel Flight"
                      onClick={() => handleCancelFlight(flight)}>
                      <FiX />
                    </button>
                  )}
                  <button
                    className={styles.actionBtnDelete}
                    title="Delete Flight"
                    onClick={() => handleDeleteFlight(flight)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      }

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingFlight ? "Edit Flight" : "Add Flight"}
              </h2>
              <button className={styles.modalClose} onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Flight Number *</label>
                  <input
                    type="text"
                    value={draft.flightNo}
                    onChange={(e) => updateDraft("flightNo", e.target.value)}
                    placeholder="DL123"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Airline *</label>
                  <input
                    type="text"
                    value={draft.airline}
                    onChange={(e) => updateDraft("airline", e.target.value)}
                    placeholder="Delta Airlines"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Logo (2 letters)</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={draft.logo}
                    onChange={(e) => updateDraft("logo", e.target.value)}
                    placeholder="DL"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Aircraft</label>
                  <input
                    type="text"
                    value={draft.aircraft}
                    onChange={(e) => updateDraft("aircraft", e.target.value)}
                    placeholder="Boeing 737"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>From *</label>
                  <input
                    type="text"
                    value={draft.from}
                    onChange={(e) => updateDraft("from", e.target.value)}
                    placeholder="New York (JFK)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>To *</label>
                  <input
                    type="text"
                    value={draft.to}
                    onChange={(e) => updateDraft("to", e.target.value)}
                    placeholder="Los Angeles (LAX)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Departure</label>
                  <input
                    type="text"
                    value={draft.departure}
                    onChange={(e) => updateDraft("departure", e.target.value)}
                    placeholder="2025-12-15 08:30"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Arrival</label>
                  <input
                    type="text"
                    value={draft.arrival}
                    onChange={(e) => updateDraft("arrival", e.target.value)}
                    placeholder="2025-12-15 11:45"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Duration</label>
                  <input
                    type="text"
                    value={draft.duration}
                    onChange={(e) => updateDraft("duration", e.target.value)}
                    placeholder="6h 15m"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Price ($)</label>
                  <input
                    type="number"
                    value={draft.price}
                    onChange={(e) =>
                      updateDraft("price", Number(e.target.value))
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Total Seats</label>
                  <input
                    type="number"
                    value={draft.seats.total}
                    onChange={(e) => updateSeat("total", e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Available Seats</label>
                  <input
                    type="number"
                    value={draft.seats.available}
                    onChange={(e) => updateSeat("available", e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={draft.status}
                    onChange={(e) => updateDraft("status", e.target.value)}>
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalBtnSecondary} onClick={closeModal}>
                Cancel
              </button>
              <button className={styles.modalBtnPrimary} onClick={handleSave}>
                <FiSave /> {editingFlight ? "Save Changes" : "Add Flight"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFlights;
