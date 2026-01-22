import React, { useState } from "react";
import {
  FiPackage,
  FiCheck,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiStar,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import styles from "./ToursPackages.module.css";

const ToursPackages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const tours = [
    {
      id: "TR-001",
      name: "Bali Luxury Retreat",
      category: "luxury",
      destination: "Bali, Indonesia",
      duration: "7 days",
      price: 3200,
      discountPrice: 2800,
      rating: 4.9,
      reviews: 128,
      bookings: 45,
      availability: 12,
      status: "active",
      image: "🏝️",
      highlights: ["Private Villas", "Spa", "Cultural Tours"],
    },
    {
      id: "TR-002",
      name: "Swiss Alps Adventure",
      category: "adventure",
      destination: "Swiss Alps",
      duration: "5 days",
      price: 2500,
      discountPrice: null,
      rating: 4.8,
      reviews: 96,
      bookings: 32,
      availability: 8,
      status: "active",
      image: "🏔️",
      highlights: ["Skiing", "Hiking", "Mountain Lodges"],
    },
    {
      id: "TR-003",
      name: "Greek Island Hopping",
      category: "cultural",
      destination: "Greek Islands",
      duration: "10 days",
      price: 4200,
      discountPrice: 3800,
      rating: 4.7,
      reviews: 156,
      bookings: 28,
      availability: 15,
      status: "active",
      image: "🏖️",
      highlights: ["Island Tours", "Cruise", "Ancient Ruins"],
    },
    {
      id: "TR-004",
      name: "Japanese Cherry Blossom Tour",
      category: "seasonal",
      destination: "Japan",
      duration: "8 days",
      price: 3800,
      discountPrice: 3500,
      rating: 4.9,
      reviews: 89,
      bookings: 24,
      availability: 6,
      status: "active",
      image: "🌸",
      highlights: ["Cherry Blossoms", "Temples", "Cultural Shows"],
    },
    {
      id: "TR-005",
      name: "Safari Expedition",
      category: "adventure",
      destination: "Kenya",
      duration: "6 days",
      price: 2900,
      discountPrice: 2700,
      rating: 4.6,
      reviews: 72,
      bookings: 18,
      availability: 10,
      status: "inactive",
      image: "🦁",
      highlights: ["Wildlife Safari", "Lodges", "Guided Tours"],
    },
    {
      id: "TR-006",
      name: "Romantic Paris Getaway",
      category: "luxury",
      destination: "Paris, France",
      duration: "3 days",
      price: 1800,
      discountPrice: 1500,
      rating: 4.8,
      reviews: 104,
      bookings: 56,
      availability: 20,
      status: "active",
      image: "🗼",
      highlights: ["Fine Dining", "River Cruise", "Shopping"],
    },
  ];

  const stats = {
    total: tours.length,
    active: tours.filter((t) => t.status === "active").length,
    totalRevenue: tours.reduce(
      (sum, t) => sum + t.bookings * (t.discountPrice || t.price),
      0
    ),
    avgRating: (
      tours.reduce((sum, t) => sum + t.rating, 0) / tours.length
    ).toFixed(1),
  };

  const getCategoryColor = (category) => {
    const colors = {
      luxury: "#8b5cf6",
      adventure: "var(--green)",
      cultural: "var(--orange)",
      seasonal: "#3b82f6",
      budget: "#ef4444",
    };
    return colors[category] || colors.luxury;
  };

  const getStatusColor = (status) => {
    return status === "active" ? "var(--green)" : "#ef4444";
  };

  return (
    <div className={styles.toursPackages}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiPackage className={styles.titleIcon} />
            Tours & Packages
          </h1>
          <p className={styles.subtitle}>
            Manage travel packages and tour offerings
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}>
            <FiPlus />
            Add Tour
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiPackage style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Tours</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> +15.2%
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
            <div className={styles.statLabel}>Active Tours</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> +8.7%
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
              ${(stats.totalRevenue / 1000).toFixed(1)}k
            </div>
            <div className={styles.statLabel}>Revenue</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> +22.4%
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <FiStar style={{ color: "var(--green)" }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.avgRating}</div>
            <div className={styles.statLabel}>Avg Rating</div>
            <div className={styles.statChange}>
              <FiTrendingUp /> +0.2
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
            placeholder="Search tours by name, destination, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.filterSelect}>
              <option value="all">All Categories</option>
              <option value="luxury">Luxury</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="seasonal">Seasonal</option>
              <option value="budget">Budget</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className={styles.toursGrid}>
        {tours.map((tour) => (
          <div key={tour.id} className={styles.tourCard}>
            <div className={styles.tourHeader}>
              <div className={styles.tourImage}>{tour.image}</div>
              <div className={styles.tourInfo}>
                <div className={styles.tourName}>{tour.name}</div>
                <div className={styles.tourDestination}>
                  <FiMapPin />
                  {tour.destination}
                </div>
                <span
                  className={styles.categoryBadge}
                  style={{
                    background: `${getCategoryColor(tour.category)}15`,
                    color: getCategoryColor(tour.category),
                  }}>
                  {tour.category}
                </span>
              </div>
              <span
                className={styles.statusBadge}
                style={{
                  background: `${getStatusColor(tour.status)}15`,
                  color: getStatusColor(tour.status),
                }}>
                {tour.status}
              </span>
            </div>

            <div className={styles.tourDetails}>
              <div className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <FiCalendar className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Duration</div>
                    <div className={styles.detailValue}>{tour.duration}</div>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FiUsers className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Bookings</div>
                    <div className={styles.detailValue}>{tour.bookings}</div>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FiStar className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Rating</div>
                    <div className={styles.detailValue}>
                      {tour.rating}{" "}
                      <span className={styles.reviews}>({tour.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.highlightsSection}>
              <div className={styles.highlightsLabel}>Highlights:</div>
              <div className={styles.highlightsList}>
                {tour.highlights.map((highlight, index) => (
                  <span key={index} className={styles.highlightTag}>
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.priceSection}>
              <div className={styles.priceInfo}>
                {tour.discountPrice ? (
                  <>
                    <div className={styles.originalPrice}>${tour.price}</div>
                    <div className={styles.discountPrice}>
                      ${tour.discountPrice}
                    </div>
                  </>
                ) : (
                  <div className={styles.currentPrice}>${tour.price}</div>
                )}
                <div className={styles.availability}>
                  {tour.availability} spots left
                </div>
              </div>
              <div className={styles.tourActions}>
                <button className={styles.actionBtn} title="View Details">
                  <FiEye />
                </button>
                <button className={styles.actionBtnEdit} title="Edit Tour">
                  <FiEdit2 />
                </button>
                <button className={styles.actionBtnDelete} title="Delete Tour">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToursPackages;
