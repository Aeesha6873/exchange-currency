import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FiX,
  FiSave,
} from "react-icons/fi";
import { travelApi } from "../../services/api";
import styles from "./ToursPackages.module.css";

const emptyPackage = () => ({
  id: "",
  destinationId: "",
  name: "",
  category: "cultural",
  duration: "",
  durationDays: 0,
  price: 0,
  discountPrice: null,
  currency: "USD",
  travelers: 2,
  rating: 0,
  reviews: 0,
  description: "",
  inclusions: [],
  highlights: [],
  isActive: true,
});

const ToursPackages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState(emptyPackage());

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");

  /* ------------------------------------------------------------------ */
  /* Load everything from storage                                        */
  /* ------------------------------------------------------------------ */

  const load = async () => {
    const [pkgList, destList] = await Promise.all([
      travelApi.getPackages(),
      travelApi.getDestinations(),
    ]);
    // Bookings come straight from localStorage (bookingsApi would also work)
    const raw = JSON.parse(localStorage.getItem("bookings") || "[]");
    setPackages(pkgList);
    setDestinations(destList);
    setBookings(raw.filter((b) => b.type === "tour"));
    setLoading(false);
  };

  useEffect(() => {
    load();
    const onStorage = (e) => {
      if (
        ["travelPackages", "travelDestinations", "bookings"].includes(e.key)
      ) {
        load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Per-package stats from real bookings                                */
  /* ------------------------------------------------------------------ */

  const getPackageBookings = (packageId) =>
    bookings.filter((b) => b.packageId === packageId);

  const getPackageRevenue = (packageId) => {
    return getPackageBookings(packageId)
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  };

  /* ------------------------------------------------------------------ */
  /* Stats (page-level)                                                  */
  /* ------------------------------------------------------------------ */

  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.isActive !== false).length;
    const totalRevenue = packages.reduce(
      (sum, p) => sum + getPackageRevenue(p.id),
      0,
    );
    const withRating = packages.filter((p) => (Number(p.rating) || 0) > 0);
    const avgRating =
      withRating.length === 0 ?
        "—"
      : (
          withRating.reduce((s, p) => s + Number(p.rating), 0) /
          withRating.length
        ).toFixed(1);
    return { total, active, totalRevenue, avgRating };
  }, [packages, bookings]);

  /* ------------------------------------------------------------------ */
  /* Category helpers                                                    */
  /* ------------------------------------------------------------------ */

  const CATEGORIES = ["luxury", "adventure", "cultural", "seasonal", "budget"];

  const getCategoryColor = (category) => {
    const colors = {
      luxury: "#8b5cf6",
      adventure: "var(--green)",
      cultural: "var(--orange)",
      seasonal: "#3b82f6",
      budget: "#ef4444",
    };
    return colors[category] || "#8b5cf6";
  };

  /* ------------------------------------------------------------------ */
  /* Filtering                                                           */
  /* ------------------------------------------------------------------ */

  const filteredPackages = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return packages.filter((p) => {
      const dest = destinations.find((d) => d.id === p.destinationId);
      const destLabel = dest ? `${dest.name}, ${dest.country}` : "";

      const matchesSearch =
        !q ||
        (p.name || "").toLowerCase().includes(q) ||
        destLabel.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [packages, destinations, searchTerm, categoryFilter]);

  /* ------------------------------------------------------------------ */
  /* Form handlers                                                       */
  /* ------------------------------------------------------------------ */

  const openAddModal = () => {
    setFormData({ ...emptyPackage(), id: `pkg-${Date.now()}` });
    setEditingPackage(null);
    setNewHighlight("");
    setNewInclusion("");
    setShowFormModal(true);
  };

  const openEditModal = (pkg) => {
    setFormData({
      ...pkg,
      highlights: [...(pkg.highlights || [])],
      inclusions: [...(pkg.inclusions || [])],
    });
    setEditingPackage(pkg);
    setNewHighlight("");
    setNewInclusion("");
    setShowFormModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight.trim()],
    }));
    setNewHighlight("");
  };

  const handleRemoveHighlight = (i) => {
    setFormData((prev) => {
      const arr = [...prev.highlights];
      arr.splice(i, 1);
      return { ...prev, highlights: arr };
    });
  };

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    setFormData((prev) => ({
      ...prev,
      inclusions: [...prev.inclusions, newInclusion.trim()],
    }));
    setNewInclusion("");
  };

  const handleRemoveInclusion = (i) => {
    setFormData((prev) => {
      const arr = [...prev.inclusions];
      arr.splice(i, 1);
      return { ...prev, inclusions: arr };
    });
  };

  const handleSavePackage = async () => {
    if (!formData.name.trim() || !formData.destinationId) {
      alert("Package name and destination are required.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    // Prepare the clean object
    const cleaned = {
      ...formData,
      price: Number(formData.price) || 0,
      discountPrice:
        formData.discountPrice && Number(formData.discountPrice) > 0 ?
          Number(formData.discountPrice)
        : null,
      durationDays: Number(formData.durationDays) || 0,
      travelers: Number(formData.travelers) || 2,
      rating: Number(formData.rating) || 0,
      reviews: Number(formData.reviews) || 0,
    };

    let next;
    if (editingPackage) {
      next = packages.map((p) => (p.id === editingPackage.id ? cleaned : p));
    } else {
      if (packages.some((p) => p.id === cleaned.id)) {
        alert("A package with this ID already exists.");
        return;
      }
      next = [...packages, cleaned];
    }

    travelApi.savePackages(next);
    setPackages(next);
    setShowFormModal(false);
    setEditingPackage(null);
    setFormData(emptyPackage());
  };

  const handleDeletePackage = (pkg) => {
    if (
      !window.confirm(
        `Delete "${pkg.name}"? This does not remove existing bookings for this package.`,
      )
    ) {
      return;
    }
    const next = packages.filter((p) => p.id !== pkg.id);
    travelApi.savePackages(next);
    setPackages(next);
  };

  const handleToggleActive = (pkg) => {
    const next = packages.map((p) =>
      p.id === pkg.id ? { ...p, isActive: !p.isActive } : p,
    );
    travelApi.savePackages(next);
    setPackages(next);
  };

  /* ------------------------------------------------------------------ */
  /* Details modal                                                       */
  /* ------------------------------------------------------------------ */

  const openDetails = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  const closeDetails = () => {
    setSelectedPackage(null);
    setShowDetailsModal(false);
  };

  const getDestinationLabel = (destinationId) => {
    const d = destinations.find((x) => x.id === destinationId);
    return d ? `${d.flag} ${d.name}, ${d.country}` : "—";
  };

  if (loading) {
    return (
      <div className={styles.toursPackages}>
        <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
          Loading packages...
        </div>
      </div>
    );
  }

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
          <button className={styles.addBtn} onClick={openAddModal}>
            <FiPlus />
            Add Package
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
            <div className={styles.statLabel}>Total Packages</div>
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
            <div className={styles.statLabel}>Active</div>
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
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Revenue</div>
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
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search packages by name, destination, or category..."
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
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredPackages.length === 0 ?
        <div className={styles.emptyState}>
          <FiPackage className={styles.emptyIcon} />
          <h3>
            {packages.length === 0 ?
              "No packages yet"
            : "No packages match your filters"}
          </h3>
          <p>
            {packages.length === 0 ?
              "Click 'Add Package' to create your first travel package."
            : "Try clearing the search or filters."}
          </p>
          {packages.length === 0 && (
            <button className={styles.addBtn} onClick={openAddModal}>
              <FiPlus /> Add Package
            </button>
          )}
        </div>
      : <div className={styles.toursGrid}>
          {filteredPackages.map((pkg) => {
            const pkgBookings = getPackageBookings(pkg.id);
            const pkgRevenue = getPackageRevenue(pkg.id);
            return (
              <div key={pkg.id} className={styles.tourCard}>
                <div className={styles.tourHeader}>
                  <div className={styles.tourImage}>
                    {getDestinationLabel(pkg.destinationId).split(" ")[0] ||
                      "🌍"}
                  </div>
                  <div className={styles.tourInfo}>
                    <div className={styles.tourName}>{pkg.name}</div>
                    <div className={styles.tourDestination}>
                      <FiMapPin />
                      {getDestinationLabel(pkg.destinationId)}
                    </div>
                    <span
                      className={styles.categoryBadge}
                      style={{
                        background: `${getCategoryColor(pkg.category)}15`,
                        color: getCategoryColor(pkg.category),
                      }}>
                      {pkg.category || "package"}
                    </span>
                  </div>
                  <span
                    className={styles.statusBadge}
                    style={{
                      background:
                        pkg.isActive !== false ?
                          "rgba(16, 185, 129, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                      color:
                        pkg.isActive !== false ? "var(--green)" : "#ef4444",
                    }}>
                    {pkg.isActive !== false ? "active" : "inactive"}
                  </span>
                </div>

                <div className={styles.tourDetails}>
                  <div className={styles.detailRow}>
                    <div className={styles.detailItem}>
                      <FiCalendar className={styles.detailIcon} />
                      <div>
                        <div className={styles.detailLabel}>Duration</div>
                        <div className={styles.detailValue}>
                          {pkg.duration || "—"}
                        </div>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <FiUsers className={styles.detailIcon} />
                      <div>
                        <div className={styles.detailLabel}>Bookings</div>
                        <div className={styles.detailValue}>
                          {pkgBookings.length}
                        </div>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <FiStar className={styles.detailIcon} />
                      <div>
                        <div className={styles.detailLabel}>Rating</div>
                        <div className={styles.detailValue}>
                          {pkg.rating || "—"}{" "}
                          {pkg.reviews > 0 && (
                            <span className={styles.reviews}>
                              ({pkg.reviews})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {pkg.highlights?.length > 0 && (
                  <div className={styles.highlightsSection}>
                    <div className={styles.highlightsLabel}>Highlights:</div>
                    <div className={styles.highlightsList}>
                      {pkg.highlights.map((h, i) => (
                        <span key={i} className={styles.highlightTag}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.priceSection}>
                  <div className={styles.priceInfo}>
                    {pkg.discountPrice ?
                      <>
                        <div className={styles.originalPrice}>${pkg.price}</div>
                        <div className={styles.discountPrice}>
                          ${pkg.discountPrice}
                        </div>
                      </>
                    : <div className={styles.currentPrice}>${pkg.price}</div>}
                    <div className={styles.availability}>
                      {pkgBookings.length > 0 ?
                        `${pkgBookings.length} booking${
                          pkgBookings.length === 1 ? "" : "s"
                        } • $${pkgRevenue.toLocaleString()}`
                      : "No bookings yet"}
                    </div>
                  </div>
                  <div className={styles.tourActions}>
                    <button
                      className={styles.actionBtn}
                      title="View"
                      onClick={() => openDetails(pkg)}>
                      <FiEye />
                    </button>
                    <button
                      className={styles.actionBtnEdit}
                      title="Edit"
                      onClick={() => openEditModal(pkg)}>
                      <FiEdit2 />
                    </button>
                    <button
                      className={styles.actionBtnDelete}
                      title="Delete"
                      onClick={() => handleDeletePackage(pkg)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }

      {/* ---- Form Modal ---- */}
      <AnimatePresence>
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowFormModal(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingPackage ? "Edit Package" : "Add Package"}
                </h2>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowFormModal(false)}>
                  <FiX />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Package Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      placeholder="e.g. 7-Day Luxury Escape"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Destination *</label>
                    <select
                      value={formData.destinationId}
                      onChange={(e) =>
                        handleFormChange("destinationId", e.target.value)
                      }>
                      <option value="">Select a destination</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.flag} {d.name}, {d.country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleFormChange("category", e.target.value)
                      }>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Duration (label)</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        handleFormChange("duration", e.target.value)
                      }
                      placeholder="e.g. 7 days"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Duration (days)</label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) =>
                        handleFormChange("durationDays", Number(e.target.value))
                      }
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Price (USD) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleFormChange("price", Number(e.target.value))
                      }
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Discount Price (optional)</label>
                    <input
                      type="number"
                      value={formData.discountPrice ?? ""}
                      onChange={(e) =>
                        handleFormChange(
                          "discountPrice",
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Travelers</label>
                    <input
                      type="number"
                      value={formData.travelers}
                      onChange={(e) =>
                        handleFormChange("travelers", Number(e.target.value))
                      }
                      min="1"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Rating (0-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) =>
                        handleFormChange("rating", Number(e.target.value))
                      }
                      min="0"
                      max="5"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Reviews</label>
                    <input
                      type="number"
                      value={formData.reviews}
                      onChange={(e) =>
                        handleFormChange("reviews", Number(e.target.value))
                      }
                      min="0"
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleFormChange("description", e.target.value)
                      }
                      rows={3}
                      placeholder="Short description of the package"
                    />
                  </div>

                  {/* Highlights */}
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Highlights</label>
                    <div className={styles.tagInput}>
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddHighlight();
                          }
                        }}
                        placeholder="e.g. Private Villas"
                      />
                      <button
                        type="button"
                        className={styles.tagAddBtn}
                        onClick={handleAddHighlight}>
                        <FiPlus />
                      </button>
                    </div>
                    <div className={styles.tagsWrap}>
                      {formData.highlights.map((h, i) => (
                        <span key={i} className={styles.tag}>
                          {h}
                          <button
                            type="button"
                            className={styles.tagRemove}
                            onClick={() => handleRemoveHighlight(i)}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Inclusions</label>
                    <div className={styles.tagInput}>
                      <input
                        type="text"
                        value={newInclusion}
                        onChange={(e) => setNewInclusion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddInclusion();
                          }
                        }}
                        placeholder="e.g. Hotel"
                      />
                      <button
                        type="button"
                        className={styles.tagAddBtn}
                        onClick={handleAddInclusion}>
                        <FiPlus />
                      </button>
                    </div>
                    <div className={styles.tagsWrap}>
                      {formData.inclusions.map((inc, i) => (
                        <span key={i} className={styles.tag}>
                          {inc}
                          <button
                            type="button"
                            className={styles.tagRemove}
                            onClick={() => handleRemoveInclusion(i)}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.isActive !== false}
                        onChange={(e) =>
                          handleFormChange("isActive", e.target.checked)
                        }
                      />
                      <span>Active (visible to users)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setShowFormModal(false)}>
                  Cancel
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={handleSavePackage}>
                  <FiSave /> {editingPackage ? "Update" : "Create"} Package
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Details Modal ---- */}
      <AnimatePresence>
        {showDetailsModal && selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={closeDetails}>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  <FiPackage /> {selectedPackage.name}
                </h2>
                <button className={styles.modalClose} onClick={closeDetails}>
                  <FiX />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRowItem}>
                    <span>Destination</span>
                    <strong>
                      {getDestinationLabel(selectedPackage.destinationId)}
                    </strong>
                  </div>
                  <div className={styles.detailRowItem}>
                    <span>Duration</span>
                    <strong>{selectedPackage.duration || "—"}</strong>
                  </div>
                  <div className={styles.detailRowItem}>
                    <span>Price</span>
                    <strong>${selectedPackage.price}</strong>
                  </div>
                  <div className={styles.detailRowItem}>
                    <span>Rating</span>
                    <strong>
                      {selectedPackage.rating || "—"}{" "}
                      {selectedPackage.reviews > 0 &&
                        `(${selectedPackage.reviews})`}
                    </strong>
                  </div>
                  <div className={styles.detailRowItem}>
                    <span>Bookings</span>
                    <strong>
                      {getPackageBookings(selectedPackage.id).length}
                    </strong>
                  </div>
                  <div className={styles.detailRowItem}>
                    <span>Revenue</span>
                    <strong>
                      ${getPackageRevenue(selectedPackage.id).toLocaleString()}
                    </strong>
                  </div>
                  <div className={styles.detailRowItem}>
                    <span>Status</span>
                    <strong>
                      {selectedPackage.isActive !== false ?
                        "Active"
                      : "Inactive"}
                    </strong>
                  </div>
                </div>

                {selectedPackage.description && (
                  <div className={styles.detailsBlock}>
                    <h4>Description</h4>
                    <p>{selectedPackage.description}</p>
                  </div>
                )}

                {selectedPackage.highlights?.length > 0 && (
                  <div className={styles.detailsBlock}>
                    <h4>Highlights</h4>
                    <div className={styles.tagsWrap}>
                      {selectedPackage.highlights.map((h, i) => (
                        <span key={i} className={styles.tag}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPackage.inclusions?.length > 0 && (
                  <div className={styles.detailsBlock}>
                    <h4>Inclusions</h4>
                    <div className={styles.tagsWrap}>
                      {selectedPackage.inclusions.map((inc, i) => (
                        <span key={i} className={styles.tag}>
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.btnSecondary} onClick={closeDetails}>
                  Close
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    closeDetails();
                    openEditModal(selectedPackage);
                  }}>
                  <FiEdit2 /> Edit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToursPackages;
