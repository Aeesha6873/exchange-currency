import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaSearch,
  FaSync,
  FaFileExport,
  FaGlobe,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaPlus,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPassport,
  FaUserCircle,
  FaSave,
} from "react-icons/fa";
import "./AdminVisa.css";

const KEYS = {
  APPLICATIONS: "visaApplications",
  COUNTRIES: "visaCountries",
  PRICING: "visaPricing",
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

/* Download a data URL as a file */
const downloadDataUrl = (dataUrl, filename) => {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename || "file";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/* Read a File into a base64 data URL */
const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

const STATUSES = ["pending", "processing", "approved", "rejected"];

const AdminVisa = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [countries, setCountries] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null);

  const [sortField, setSortField] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [newCountry, setNewCountry] = useState(emptyCountry());
  const [newPricing, setNewPricing] = useState(emptyPricing());
  const [newVisaType, setNewVisaType] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  function emptyCountry() {
    return {
      id: "",
      name: "",
      flag: "",
      basePrice: 0,
      currency: "$",
      processing: "7-14 days",
      isActive: true,
      visaTypes: [],
      requirements: [],
    };
  }

  function emptyPricing() {
    return {
      id: "",
      countryId: "",
      visaType: "tourist",
      duration: "30",
      price: 0,
      processingFee: 0,
      expressFee: 0,
      urgentFee: 0,
    };
  }

  /* ---------- load + live updates ---------- */

  const load = () => {
    setApplications(read(KEYS.APPLICATIONS, []));
    setCountries(read(KEYS.COUNTRIES, []));
    setPricing(read(KEYS.PRICING, []));
    setLoading(false);
  };

  useEffect(() => {
    load();
    const onStorage = (e) => {
      if (Object.values(KEYS).includes(e.key)) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ---------- derived stats ---------- */

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const processing = applications.filter(
      (a) => a.status === "processing",
    ).length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const totalRevenue = applications
      .filter((a) => a.paymentStatus === "paid" || a.status === "approved")
      .reduce((sum, a) => sum + (Number(a.amountPaid) || 0), 0);
    return { total, pending, processing, approved, rejected, totalRevenue };
  }, [applications]);

  /* ---------- filtering + sorting ---------- */

  const filteredApplications = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return applications
      .filter((app) => {
        const matchesSearch =
          !q ||
          (app.firstName || "").toLowerCase().includes(q) ||
          (app.lastName || "").toLowerCase().includes(q) ||
          (app.email || "").toLowerCase().includes(q) ||
          (app.applicationId || "").toLowerCase().includes(q) ||
          (app.passportNumber || "").toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "all" || app.status === statusFilter;
        const matchesCountry =
          countryFilter === "all" || app.countryId === countryFilter;

        return matchesSearch && matchesStatus && matchesCountry;
      })
      .sort((a, b) => {
        const mod = sortOrder === "asc" ? 1 : -1;
        const av = a[sortField];
        const bv = b[sortField];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return -1 * mod;
        if (av > bv) return 1 * mod;
        return 0;
      });
  }, [
    applications,
    searchTerm,
    statusFilter,
    countryFilter,
    sortField,
    sortOrder,
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  /* ---------- applications actions ---------- */

  const updateApplication = (id, patch) => {
    const all = read(KEYS.APPLICATIONS, []);
    const next = all.map((a) =>
      String(a.id) === String(id) ? { ...a, ...patch } : a,
    );
    write(KEYS.APPLICATIONS, next);
    setApplications(next);
  };

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setShowApplicationModal(true);
  };

  const handleUpdateStatus = (appId, newStatus, extra = {}) => {
    updateApplication(appId, {
      status: newStatus,
      ...extra,
      lastUpdated: new Date().toISOString(),
    });
    setSelectedApplication((prev) =>
      prev && String(prev.id) === String(appId) ?
        { ...prev, status: newStatus, ...extra }
      : prev,
    );
  };

  const handleAssignOfficer = (appId) => {
    const officerName = prompt("Enter officer name to assign:");
    if (officerName) {
      updateApplication(appId, { assignedOfficer: officerName });
    }
  };

  const handleSendEmail = (application) => {
    const subject = `Update on your visa application ${application.applicationId}`;
    const body = `Dear ${application.firstName || "Applicant"},\n\n`;
    window.open(
      `mailto:${application.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`,
      "_blank",
    );
  };

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(filteredApplications, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visa_applications_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- passport + approval handlers ---------- */

  const handleDownloadPassport = (app) => {
    if (!app.passportFile?.dataUrl) {
      alert(
        "The passport file was not saved with content. Ask the applicant to re-upload.",
      );
      return;
    }
    downloadDataUrl(
      app.passportFile.dataUrl,
      `passport-${app.applicationId || app.id}-${app.passportFile.name}`,
    );
  };

  const handleUploadApproval = async (app, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    const approvalFile = {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type,
      dataUrl,
      uploadedAt: new Date().toISOString(),
    };
    updateApplication(app.id, {
      approvalFile,
      status: "approved",
      approvedAt: new Date().toISOString(),
    });
    setSelectedApplication((prev) =>
      prev && String(prev.id) === String(app.id) ?
        { ...prev, approvalFile, status: "approved" }
      : prev,
    );
  };

  const handleRemoveApproval = (app) => {
    if (!window.confirm("Remove the approval document?")) return;
    updateApplication(app.id, { approvalFile: null });
    setSelectedApplication((prev) =>
      prev && String(prev.id) === String(app.id) ?
        { ...prev, approvalFile: null }
      : prev,
    );
  };

  /* ---------- country CRUD ---------- */

  const persistCountries = (rows) => {
    write(KEYS.COUNTRIES, rows);
    setCountries(rows);
  };

  const handleAddCountry = () => {
    setNewCountry(emptyCountry());
    setEditingCountry(null);
    setNewVisaType("");
    setNewRequirement("");
    setShowCountryModal(true);
  };

  const handleEditCountry = (country) => {
    setNewCountry({
      ...country,
      visaTypes: [...(country.visaTypes || [])],
      requirements: [...(country.requirements || [])],
    });
    setEditingCountry(country);
    setNewVisaType("");
    setNewRequirement("");
    setShowCountryModal(true);
  };

  const handleSaveCountry = () => {
    if (!newCountry.name.trim() || !newCountry.id.trim()) {
      alert("Country name and ID are required");
      return;
    }

    if (editingCountry) {
      persistCountries(
        countries.map((c) =>
          c.id === editingCountry.id ? { ...newCountry } : c,
        ),
      );
    } else {
      if (countries.some((c) => c.id === newCountry.id)) {
        alert("Country ID already exists");
        return;
      }
      persistCountries([...countries, newCountry]);
    }

    setShowCountryModal(false);
    setEditingCountry(null);
    setNewCountry(emptyCountry());
  };

  const handleDeleteCountry = (countryId) => {
    if (
      !window.confirm(
        "Delete this country? This also removes its pricing rules and (visually) hides related applications.",
      )
    ) {
      return;
    }
    persistCountries(countries.filter((c) => c.id !== countryId));
    write(
      KEYS.PRICING,
      pricing.filter((p) => p.countryId !== countryId),
    );
    setPricing(pricing.filter((p) => p.countryId !== countryId));
  };

  const handleToggleCountryActive = (countryId) => {
    persistCountries(
      countries.map((c) =>
        c.id === countryId ? { ...c, isActive: !c.isActive } : c,
      ),
    );
  };

  const handleAddVisaType = () => {
    if (!newVisaType.trim()) return;
    setNewCountry({
      ...newCountry,
      visaTypes: [...newCountry.visaTypes, newVisaType.trim()],
    });
    setNewVisaType("");
  };

  const handleRemoveVisaType = (index) => {
    const arr = [...newCountry.visaTypes];
    arr.splice(index, 1);
    setNewCountry({ ...newCountry, visaTypes: arr });
  };

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    setNewCountry({
      ...newCountry,
      requirements: [...newCountry.requirements, newRequirement.trim()],
    });
    setNewRequirement("");
  };

  const handleRemoveRequirement = (index) => {
    const arr = [...newCountry.requirements];
    arr.splice(index, 1);
    setNewCountry({ ...newCountry, requirements: arr });
  };

  /* ---------- pricing CRUD ---------- */

  const persistPricing = (rows) => {
    write(KEYS.PRICING, rows);
    setPricing(rows);
  };

  const handleAddPricing = () => {
    setNewPricing({ ...emptyPricing(), id: `pr-${Date.now()}` });
    setEditingPrice(null);
    setShowPricingModal(true);
  };

  const handleEditPricing = (price) => {
    setNewPricing({ ...price });
    setEditingPrice(price);
    setShowPricingModal(true);
  };

  const handleSavePricing = () => {
    if (!newPricing.countryId || !newPricing.visaType) {
      alert("Please select a country and visa type");
      return;
    }

    if (editingPrice) {
      persistPricing(
        pricing.map((p) => (p.id === editingPrice.id ? { ...newPricing } : p)),
      );
    } else {
      persistPricing([...pricing, newPricing]);
    }

    setShowPricingModal(false);
    setEditingPrice(null);
    setNewPricing(emptyPricing());
  };

  const handleDeletePricing = (priceId) => {
    if (!window.confirm("Delete this pricing rule?")) return;
    persistPricing(pricing.filter((p) => p.id !== priceId));
  };

  /* ---------- display helpers ---------- */

  const fullName = (app) =>
    `${app.firstName || ""} ${app.lastName || ""}`.trim() || "Unnamed";

  const formatCurrency = (amount, currency = "$") =>
    `${currency}${Number(amount || 0).toLocaleString()}`;

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-visa-manager">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">
          <FaPassport /> Visa Management
        </h1>
        <p className="admin-subtitle">
          Applications, countries, and pricing — all synced to what users see
        </p>
        <div className="admin-header-actions">
          <button className="btn-refresh" onClick={load}>
            <FaSync /> Refresh
          </button>
          <button className="btn-export" onClick={handleExportData}>
            <FaFileExport /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: "Total", value: stats.total },
          { label: "Pending", value: stats.pending },
          { label: "Processing", value: stats.processing },
          { label: "Approved", value: stats.approved },
          { label: "Rejected", value: stats.rejected },
          {
            label: "Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
          },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-content">
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="admin-main-content">
        {/* Tabs */}
        <div className="admin-tabs">
          {[
            {
              id: "applications",
              label: "Applications",
              icon: <FaUsers />,
              count: applications.length,
            },
            {
              id: "countries",
              label: "Countries",
              icon: <FaGlobe />,
              count: countries.length,
            },
            {
              id: "pricing",
              label: "Pricing",
              icon: <FaMoneyBillWave />,
              count: pricing.length,
            },
            { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}>
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="tab-badge">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        {activeTab === "applications" && (
          <div className="search-filters">
            <div className="search-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, email, reference, or passport..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filter-container">
              <div className="filter-chips">
                <button
                  className={`filter-chip ${
                    statusFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter("all")}>
                  All Status
                </button>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`filter-chip ${
                      statusFilter === s ? "active" : ""
                    }`}
                    onClick={() => setStatusFilter(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {countries.length > 0 && (
                <div className="filter-chips" style={{ marginTop: "0.75rem" }}>
                  <button
                    className={`filter-chip ${
                      countryFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => setCountryFilter("all")}>
                    All Countries
                  </button>
                  {countries.map((c) => (
                    <button
                      key={c.id}
                      className={`filter-chip ${
                        countryFilter === c.id ? "active" : ""
                      }`}
                      onClick={() => setCountryFilter(c.id)}>
                      <span className="country-flag-small">{c.flag}</span>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="content-area">
          {/* APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("firstName")}>
                      <div className="sort-header">
                        Applicant {getSortIcon("firstName")}
                      </div>
                    </th>
                    <th onClick={() => handleSort("countryName")}>
                      <div className="sort-header">
                        Destination {getSortIcon("countryName")}
                      </div>
                    </th>
                    <th onClick={() => handleSort("status")}>
                      <div className="sort-header">
                        Status {getSortIcon("status")}
                      </div>
                    </th>
                    <th onClick={() => handleSort("submittedAt")}>
                      <div className="sort-header">
                        Date {getSortIcon("submittedAt")}
                      </div>
                    </th>
                    <th onClick={() => handleSort("amountPaid")}>
                      <div className="sort-header">
                        Amount {getSortIcon("amountPaid")}
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const country = countries.find(
                      (c) => c.id === app.countryId,
                    );
                    return (
                      <tr key={app.id}>
                        <td className="applicant-cell">
                          <strong className="applicant-name">
                            {fullName(app)}
                          </strong>
                          <div className="applicant-details">
                            <span className="applicant-email">
                              <FaEnvelope size={10} /> {app.email || "—"}
                            </span>
                          </div>
                          <div className="applicant-reference">
                            <FaPassport size={10} /> {app.applicationId}
                          </div>
                        </td>

                        <td className="destination-cell">
                          <div className="destination-info">
                            <div className="destination-flag">
                              {app.countryFlag || country?.flag || "🌍"}
                            </div>
                            <div className="destination-details">
                              <div className="destination-name">
                                {app.countryName || country?.name || "—"}
                              </div>
                              <div className="visa-type">
                                {app.durationLabel || ""}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="status-cell">
                          <span className={`status-badge ${app.status}`}>
                            {app.status === "pending" && <FaClock size={10} />}
                            {app.status === "processing" && (
                              <FaClock size={10} />
                            )}
                            {app.status === "approved" && (
                              <FaCheckCircle size={10} />
                            )}
                            {app.status === "rejected" && (
                              <FaTimesCircle size={10} />
                            )}
                            {(app.status || "pending").charAt(0).toUpperCase() +
                              (app.status || "pending").slice(1)}
                          </span>
                        </td>

                        <td className="date-cell">
                          <div className="date-info">
                            <div className="date-item">
                              <span className="date-label">Applied</span>
                              <span className="date-value">
                                {fmtDate(app.submittedAt)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="amount-cell">
                          <div className="amount-info">
                            <div className="amount">
                              {formatCurrency(
                                app.amountPaid,
                                app.countryCurrency,
                              )}
                            </div>
                            <div
                              className={`payment-status ${
                                app.paymentStatus === "pending" ? "pending"
                                : app.status === "approved" ? "paid"
                                : "pending"
                              }`}>
                              {app.paymentStatus === "pending" ?
                                "Payment pending"
                              : app.status === "approved" ?
                                "Paid"
                              : "Pending"}
                            </div>
                          </div>
                        </td>

                        <td className="actions-cell">
                          <div className="action-buttons">
                            <button
                              className="action-btn view"
                              onClick={() => handleViewApplication(app)}
                              title="View">
                              <FaEye />
                            </button>
                            <button
                              className="action-btn email"
                              onClick={() => handleSendEmail(app)}
                              title="Email">
                              <FaEnvelope />
                            </button>
                            {app.passportFile?.dataUrl && (
                              <button
                                className="action-btn download"
                                onClick={() => handleDownloadPassport(app)}
                                title="Download passport">
                                <FaFileExport />
                              </button>
                            )}
                            <button
                              className="action-btn edit"
                              onClick={() => handleAssignOfficer(app.id)}
                              title="Assign Officer">
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredApplications.length === 0 && (
                <div className="empty-state">
                  <FaSearch className="empty-icon" />
                  <h3>
                    {applications.length === 0 ?
                      "No applications yet"
                    : "No matching applications"}
                  </h3>
                  <p>
                    {applications.length === 0 ?
                      "Applications submitted by users will appear here."
                    : "Try adjusting your search or filters."}
                  </p>
                  {applications.length > 0 && (
                    <button
                      className="clear-filters-btn"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setCountryFilter("all");
                      }}>
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* COUNTRIES */}
          {activeTab === "countries" && (
            <div className="countries-section">
              <div className="section-header">
                <h2>Destination Countries</h2>
                <button className="btn-add-country" onClick={handleAddCountry}>
                  <FaPlus /> Add Country
                </button>
              </div>

              {countries.length === 0 ?
                <div className="empty-state">
                  <FaGlobe className="empty-icon" />
                  <h3>No countries yet</h3>
                  <p>
                    Add countries users can apply for. They appear immediately
                    on the user visa page.
                  </p>
                </div>
              : <div className="countries-grid">
                  {countries.map((c) => (
                    <div key={c.id} className="country-card">
                      <div className="country-card-header">
                        <div className="country-flag">{c.flag}</div>
                        <div className="country-name">{c.name}</div>
                        <div className="country-status">
                          <span
                            className={`status-dot ${
                              c.isActive ? "active" : "inactive"
                            }`}
                          />
                          {c.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>

                      <div className="country-card-body">
                        <div className="country-price">
                          <span className="price-currency">{c.currency}</span>
                          <span className="price-amount">{c.basePrice}</span>
                        </div>
                        <div className="country-processing">
                          <FaClock /> {c.processing || "—"} processing
                        </div>
                        <div className="country-visa-types">
                          {(c.visaTypes || []).map((t, i) => (
                            <span key={i} className="visa-type-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="country-card-footer">
                        <button
                          className="btn-edit-country"
                          onClick={() => handleEditCountry(c)}>
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn-delete-country"
                          onClick={() => handleDeleteCountry(c.id)}
                          title="Delete">
                          <FaTrash />
                        </button>
                        <button
                          className={`btn-toggle-status ${
                            c.isActive ? "deactivate" : ""
                          }`}
                          onClick={() => handleToggleCountryActive(c.id)}>
                          {c.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}

          {/* PRICING */}
          {activeTab === "pricing" && (
            <div className="pricing-section">
              <div className="section-header">
                <h2>Visa Pricing</h2>
                <button className="btn-add-pricing" onClick={handleAddPricing}>
                  <FaPlus /> Add Pricing
                </button>
              </div>

              {pricing.length === 0 ?
                <div className="empty-state">
                  <FaMoneyBillWave className="empty-icon" />
                  <h3>No pricing configured</h3>
                  <p>Click "Add Pricing" to create your first rule.</p>
                </div>
              : <div className="pricing-table-container">
                  <table className="pricing-table">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Visa Type</th>
                        <th>Duration</th>
                        <th>Base</th>
                        <th>Processing</th>
                        <th>Express</th>
                        <th>Urgent</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricing.map((p) => {
                        const c = countries.find((x) => x.id === p.countryId);
                        const total = p.price + p.processingFee;
                        const cur = c?.currency || "$";
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="price-country">
                                <span className="price-flag">
                                  {c?.flag || "🌍"}
                                </span>
                                <span>{c?.name || "Unknown"}</span>
                              </div>
                            </td>
                            <td>
                              <span className="visa-type-badge">
                                {p.visaType}
                              </span>
                            </td>
                            <td>{p.duration} days</td>
                            <td>
                              <span className="price-value">
                                {cur}
                                {p.price}
                              </span>
                            </td>
                            <td>
                              <span className="price-value">
                                {cur}
                                {p.processingFee}
                              </span>
                            </td>
                            <td>
                              <span className="price-value">
                                {cur}
                                {p.expressFee}
                              </span>
                            </td>
                            <td>
                              <span className="price-value">
                                {cur}
                                {p.urgentFee}
                              </span>
                            </td>
                            <td>
                              <strong className="total-price">
                                {cur}
                                {total}
                              </strong>
                            </td>
                            <td>
                              <div className="price-actions">
                                <button
                                  className="btn-edit-price"
                                  onClick={() => handleEditPricing(p)}>
                                  <FaEdit />
                                </button>
                                <button
                                  className="btn-delete-price"
                                  onClick={() => handleDeletePricing(p.id)}>
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              }
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="analytics-section">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Top Countries</h3>
                  <div className="country-stats">
                    {countries.slice(0, 5).map((c) => {
                      const apps = applications.filter(
                        (a) => a.countryId === c.id,
                      );
                      const rev = apps
                        .filter((a) => a.status === "approved")
                        .reduce((s, a) => s + (Number(a.amountPaid) || 0), 0);
                      return (
                        <div key={c.id} className="country-stat">
                          <div className="country-stat-header">
                            <span className="country-flag">{c.flag}</span>
                            <span className="country-name">{c.name}</span>
                          </div>
                          <div className="country-stat-numbers">
                            <div className="stat-number">
                              {apps.length}{" "}
                              <span className="stat-label">Apps</span>
                            </div>
                            <div className="stat-number">
                              ${rev.toLocaleString()}{" "}
                              <span className="stat-label">Revenue</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    {applications.slice(0, 6).map((a) => (
                      <div key={a.id} className="activity-item">
                        <div className="activity-icon">
                          {a.status === "approved" ?
                            <FaCheckCircle style={{ color: "#10b981" }} />
                          : a.status === "rejected" ?
                            <FaTimesCircle style={{ color: "#ef4444" }} />
                          : <FaClock style={{ color: "#f59e0b" }} />}
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">{fullName(a)}</div>
                          <div className="activity-subtitle">
                            {a.countryName} • {fmtDate(a.submittedAt)}
                          </div>
                        </div>
                        <div className="activity-amount">
                          {formatCurrency(a.amountPaid, a.countryCurrency)}
                        </div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p style={{ color: "#64748b", fontSize: 14 }}>
                        No applications yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Application Details Modal ---- */}
      <AnimatePresence>
        {showApplicationModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowApplicationModal(false)}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  Application Details
                  <span className="modal-reference">
                    {selectedApplication.applicationId}
                  </span>
                </h2>
                <button
                  className="modal-close"
                  onClick={() => setShowApplicationModal(false)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-grid">
                  <div className="modal-section">
                    <h3 className="section-title">
                      <FaUserCircle /> Applicant
                    </h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Full Name</span>
                        <span className="detail-value">
                          {fullName(selectedApplication)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">
                          {selectedApplication.email || "—"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">
                          {selectedApplication.phone || "—"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Passport</span>
                        <span className="detail-value">
                          {selectedApplication.passportNumber || "—"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Nationality</span>
                        <span className="detail-value">
                          {selectedApplication.nationality || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3 className="section-title">
                      <FaPassport /> Visa
                    </h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Destination</span>
                        <span className="detail-value">
                          {selectedApplication.countryFlag}{" "}
                          {selectedApplication.countryName}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Processing</span>
                        <span className="detail-value">
                          {selectedApplication.departureLabel || "—"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Duration</span>
                        <span className="detail-value">
                          {selectedApplication.durationLabel || "—"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Amount Paid</span>
                        <span className="detail-value">
                          {formatCurrency(
                            selectedApplication.amountPaid,
                            selectedApplication.countryCurrency,
                          )}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span className="detail-value">
                          {selectedApplication.status}
                        </span>
                      </div>
                      {selectedApplication.assignedOfficer && (
                        <div className="detail-item">
                          <span className="detail-label">Officer</span>
                          <span className="detail-value">
                            {selectedApplication.assignedOfficer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Passport file */}
                  <div className="modal-section">
                    <h3 className="section-title">
                      <FaPassport /> Passport Document
                    </h3>
                    {selectedApplication.passportFile ?
                      <div className="fileRow">
                        <div className="fileMeta">
                          <div className="fileName">
                            {selectedApplication.passportFile.name}
                          </div>
                          <div className="fileSub">
                            {selectedApplication.passportFile.size} •{" "}
                            {selectedApplication.passportFile.type
                              ?.split("/")[1]
                              ?.toUpperCase()}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() =>
                            handleDownloadPassport(selectedApplication)
                          }>
                          <FaFileExport /> Download
                        </button>
                      </div>
                    : <p className="mutedText">No passport uploaded.</p>}
                  </div>

                  {/* Approval document */}
                  <div className="modal-section">
                    <h3 className="section-title">
                      <FaCheckCircle /> Approval Document
                    </h3>

                    {selectedApplication.approvalFile ?
                      <div className="fileRow">
                        <div className="fileMeta">
                          <div className="fileName">
                            {selectedApplication.approvalFile.name}
                          </div>
                          <div className="fileSub">
                            Uploaded{" "}
                            {fmtDate(
                              selectedApplication.approvalFile.uploadedAt,
                            )}
                          </div>
                        </div>
                        <div className="fileActions">
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                              downloadDataUrl(
                                selectedApplication.approvalFile.dataUrl,
                                selectedApplication.approvalFile.name,
                              )
                            }>
                            <FaFileExport /> Download
                          </button>
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() =>
                              handleRemoveApproval(selectedApplication)
                            }>
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    : <div className="uploadApproval">
                        <p className="mutedText">
                          Upload the visa approval (grant letter, PDF or image).
                          The applicant can download it from their dashboard.
                        </p>
                        <label className="uploadBtn">
                          <FaFileExport /> Choose file
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f)
                                handleUploadApproval(selectedApplication, f);
                              e.target.value = "";
                            }}
                            hidden
                          />
                        </label>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowApplicationModal(false)}>
                  Close
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleSendEmail(selectedApplication)}>
                  <FaEnvelope /> Send Email
                </button>

                {selectedApplication.status !== "approved" && (
                  <button
                    className="btn-success"
                    onClick={() => {
                      handleUpdateStatus(selectedApplication.id, "approved");
                      setShowApplicationModal(false);
                    }}>
                    Approve
                  </button>
                )}

                {selectedApplication.status !== "rejected" && (
                  <button
                    className="btn-danger"
                    onClick={() => {
                      const reason = prompt("Enter rejection reason:");
                      if (reason) {
                        handleUpdateStatus(selectedApplication.id, "rejected", {
                          rejectionReason: reason,
                        });
                        setShowApplicationModal(false);
                      }
                    }}>
                    Reject
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Country Modal ---- */}
      <AnimatePresence>
        {showCountryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowCountryModal(false)}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-content country-modal"
              onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingCountry ? "Edit Country" : "Add Country"}
                </h2>
                <button
                  className="modal-close"
                  onClick={() => setShowCountryModal(false)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Country ID *</label>
                    <input
                      type="text"
                      value={newCountry.id}
                      onChange={(e) =>
                        setNewCountry({ ...newCountry, id: e.target.value })
                      }
                      placeholder="e.g., uk"
                      disabled={!!editingCountry}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country Name *</label>
                    <input
                      type="text"
                      value={newCountry.name}
                      onChange={(e) =>
                        setNewCountry({ ...newCountry, name: e.target.value })
                      }
                      placeholder="e.g., United Kingdom"
                    />
                  </div>
                  <div className="form-group">
                    <label>Flag</label>
                    <input
                      type="text"
                      value={newCountry.flag}
                      onChange={(e) =>
                        setNewCountry({ ...newCountry, flag: e.target.value })
                      }
                      placeholder="🇬🇧"
                    />
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <input
                      type="text"
                      value={newCountry.currency}
                      onChange={(e) =>
                        setNewCountry({
                          ...newCountry,
                          currency: e.target.value,
                        })
                      }
                      placeholder="£ / $ / €"
                    />
                  </div>
                  <div className="form-group">
                    <label>Base Price</label>
                    <input
                      type="number"
                      value={newCountry.basePrice}
                      onChange={(e) =>
                        setNewCountry({
                          ...newCountry,
                          basePrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Processing Time</label>
                    <input
                      type="text"
                      value={newCountry.processing}
                      onChange={(e) =>
                        setNewCountry({
                          ...newCountry,
                          processing: e.target.value,
                        })
                      }
                      placeholder="5-7 days"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Visa Types</label>
                    <div className="tag-input-group">
                      <input
                        type="text"
                        value={newVisaType}
                        onChange={(e) => setNewVisaType(e.target.value)}
                        placeholder="e.g., tourist, business"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddVisaType();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn-add-tag"
                        onClick={handleAddVisaType}>
                        <FaPlus />
                      </button>
                    </div>
                    <div className="tags-container">
                      {newCountry.visaTypes.map((t, i) => (
                        <span key={i} className="tag">
                          {t}
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => handleRemoveVisaType(i)}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Requirements</label>
                    <div className="tag-input-group">
                      <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="e.g., Valid passport"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddRequirement();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn-add-tag"
                        onClick={handleAddRequirement}>
                        <FaPlus />
                      </button>
                    </div>
                    <div className="tags-container">
                      {newCountry.requirements.map((r, i) => (
                        <span key={i} className="tag">
                          {r}
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => handleRemoveRequirement(i)}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newCountry.isActive}
                        onChange={(e) =>
                          setNewCountry({
                            ...newCountry,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      <span>Active (visible to users)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowCountryModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveCountry}>
                  <FaSave /> {editingCountry ? "Update Country" : "Add Country"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Pricing Modal ---- */}
      <AnimatePresence>
        {showPricingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowPricingModal(false)}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-content pricing-modal"
              onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingPrice ? "Edit Pricing" : "Add Pricing"}
                </h2>
                <button
                  className="modal-close"
                  onClick={() => setShowPricingModal(false)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Country *</label>
                    <select
                      value={newPricing.countryId}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          countryId: e.target.value,
                        })
                      }>
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Visa Type *</label>
                    <select
                      value={newPricing.visaType}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          visaType: e.target.value,
                        })
                      }>
                      {[
                        "tourist",
                        "business",
                        "student",
                        "work",
                        "transit",
                        "religious",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration (days)</label>
                    <select
                      value={newPricing.duration}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          duration: e.target.value,
                        })
                      }>
                      {["30", "60", "90", "180", "365"].map((d) => (
                        <option key={d} value={d}>
                          {d} days
                        </option>
                      ))}
                    </select>
                  </div>
                  {[
                    ["price", "Base Price"],
                    ["processingFee", "Processing Fee"],
                    ["expressFee", "Express Fee"],
                    ["urgentFee", "Urgent Fee"],
                  ].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      <input
                        type="number"
                        value={newPricing[field]}
                        onChange={(e) =>
                          setNewPricing({
                            ...newPricing,
                            [field]: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  ))}

                  <div className="form-group full-width">
                    <div className="price-summary">
                      <h4>Summary</h4>
                      <div className="summary-row">
                        <span>Base + Processing</span>
                        <strong>
                          $
                          {Number(newPricing.price) +
                            Number(newPricing.processingFee)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowPricingModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSavePricing}>
                  <FaSave /> {editingPrice ? "Update Pricing" : "Add Pricing"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVisa;
