import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./UserVisaRecords.module.css";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiFileText,
  FiDownload,
  FiEye,
  FiMessageSquare,
  FiCalendar,
  FiSearch,
  FiPlus,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiInfo,
  FiChevronRight,
  FiCheckSquare,
  FiAlertTriangle,
  FiGlobe,
} from "react-icons/fi";
import { authApi, visaApi } from "../../services/api";

function UserVisaRecords() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visaApplications, setVisaApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- Load this user's applications from the API ----
  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const load = async () => {
      const rows = await visaApi.listForUser(currentUser.id);
      setVisaApplications(rows);
      setLoading(false);
    };

    load();

    // Re-load when another tab writes to visaApplications
    const onStorage = (e) => {
      if (e.key === "visaApplications") load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [navigate]);

  // ---- Status helpers (unchanged) ----
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className={styles.statusIcon} />;
      case "rejected":
        return <FiXCircle className={styles.statusIcon} />;
      case "review":
        return <FiClock className={styles.statusIcon} />;
      case "pending":
        return <FiAlertCircle className={styles.statusIcon} />;
      default:
        return <FiClock className={styles.statusIcon} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return styles.statusApproved;
      case "rejected":
        return styles.statusRejected;
      case "review":
        return styles.statusReview;
      case "pending":
        return styles.statusPending;
      default:
        return styles.statusDefault;
    }
  };

  const getDocumentStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className={styles.docApproved} />;
      case "rejected":
        return <FiXCircle className={styles.docRejected} />;
      case "review":
        return <FiClock className={styles.docReview} />;
      default:
        return <FiAlertCircle className={styles.docPending} />;
    }
  };

  // ---- Derive display fields from a stored application ----
  // The wizard stores raw IDs; here we turn them into human labels.
  const friendlyStatus = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending Documents";
      case "review":
      case "processing":
      default:
        return "Under Review";
    }
  };

  const progressFor = (status) => {
    switch (status) {
      case "approved":
      case "rejected":
        return 100;
      case "pending":
        return 30;
      case "review":
      case "processing":
      default:
        return 60;
    }
  };

  const visaTypeFromDuration = (durationId) => {
    const id = String(durationId || "");
    if (id === "30") return "Short Stay Visa";
    if (id === "90") return "Tourist Visa";
    if (id === "180") return "Business Visa";
    if (id === "365") return "Long Term Visa";
    if (id === "730") return "Residence Visa";
    return "Visa";
  };

  const countryColor = (countryId) => {
    const colors = {
      uk: "#4f46e5",
      china: "#dc2626",
      umarah: "#059669",
      qatar: "#7c3aed",
      dubai: "#ea580c",
      algeria: "#0891b2",
    };
    return colors[countryId] || "#10b981";
  };

  const formatDate = (iso) => {
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

  // Build a view-model for each stored application so the JSX can stay
  // mostly the same as before.
  const viewApplications = visaApplications.map((app) => {
    const status =
      app.status === "processing" ? "review" : app.status || "review";
    const currency = app.countryCurrency || "$";
    const amount = app.amountPaid ?? 0;

    return {
      id: app.id,
      applicationId: app.applicationId,
      country: app.countryName || "—",
      countryCode: app.countryFlag || "🌐",
      countryId: app.countryId,
      color: countryColor(app.countryId),
      type: visaTypeFromDuration(app.durationId),
      status,
      statusText: friendlyStatus(status),
      submittedDate: formatDate(app.submittedAt),
      processingTime: app.departureLabel || "—",
      duration: app.durationLabel || "—",
      fees: `${currency}${amount}`,
      ref: app.applicationId,
      progress: progressFor(status),
      applicantName:
        `${app.firstName || ""} ${app.lastName || ""}`.trim() || "—",
      email: app.email || "—",
      passportNumber: app.passportNumber || "—",
      consulate: app.countryName ? `${app.countryName} Embassy` : "—",
      officer: "—", // filled in by admin later
      notes: "",
      nextSteps: [],
      documents:
        app.passportFile ?
          [
            {
              name: app.passportFile.name,
              status: "approved",
              uploaded: true,
            },
          ]
        : [],
      timeline: [
        {
          step: 1,
          name: "Application Submitted",
          date: formatDate(app.submittedAt),
          status: "completed",
        },
        {
          step: 2,
          name: "Under Review",
          date: "Current",
          status:
            status === "review" || status === "processing" ?
              "current"
            : "completed",
        },
        {
          step: 3,
          name: "Decision",
          date:
            status === "approved" || status === "rejected" ?
              "Complete"
            : "Pending",
          status:
            status === "approved" || status === "rejected" ?
              "completed"
            : "upcoming",
        },
      ],
    };
  });

  const handleViewDetails = (visa) => {
    setSelectedVisa(visa);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVisa(null);
  };

  const filteredApplications = viewApplications.filter((visa) => {
    if (filter !== "all" && visa.status !== filter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        visa.country.toLowerCase().includes(q) ||
        visa.type.toLowerCase().includes(q) ||
        visa.ref.toLowerCase().includes(q) ||
        visa.applicantName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: viewApplications.length,
    approved: viewApplications.filter((v) => v.status === "approved").length,
    review: viewApplications.filter((v) => v.status === "review").length,
    pending: viewApplications.filter((v) => v.status === "pending").length,
  };

  if (loading) {
    return (
      <div className={styles.visaProcessContainer}>
        <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
          Loading your applications...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.visaProcessContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Visa Process</h1>
          <p className={styles.subtitle}>
            Track your visa applications from {viewApplications.length}{" "}
            submitted application{viewApplications.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/dashboard/visa" className={styles.newVisaBtn}>
            <FiPlus />
            New Application
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{stats.total}</span>
          <span className={styles.statLabel}>Total Applications</span>
        </div>
        <div className={`${styles.statItem} ${styles.statApproved}`}>
          <span className={styles.statNumber}>{stats.approved}</span>
          <span className={styles.statLabel}>Approved</span>
        </div>
        <div className={`${styles.statItem} ${styles.statReview}`}>
          <span className={styles.statNumber}>{stats.review}</span>
          <span className={styles.statLabel}>In Review</span>
        </div>
        <div className={`${styles.statItem} ${styles.statPending}`}>
          <span className={styles.statNumber}>{stats.pending}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by country, visa type, reference, or applicant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}>
            All Applications
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "review" ? styles.active : ""}`}
            onClick={() => setFilter("review")}>
            In Review
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "pending" ? styles.active : ""}`}
            onClick={() => setFilter("pending")}>
            Pending
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "approved" ? styles.active : ""}`}
            onClick={() => setFilter("approved")}>
            Approved
          </button>
        </div>
      </div>

      {/* Applications Grid */}
      <div className={styles.applicationsGrid}>
        {filteredApplications.map((visa) => (
          <div key={visa.id} className={styles.applicationCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.countryBadge}
                style={{ backgroundColor: visa.color }}>
                {visa.countryCode}
              </div>
              <div className={styles.applicationInfo}>
                <h3 className={styles.countryName}>{visa.country}</h3>
                <div className={styles.applicationMeta}>
                  <span className={styles.visaType}>{visa.type}</span>
                  <span className={styles.refNumber}>#{visa.ref}</span>
                </div>
              </div>
              <div
                className={`${styles.status} ${getStatusColor(visa.status)}`}>
                {getStatusIcon(visa.status)}
                <span>{visa.statusText}</span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.applicantInfo}>
                <FiUser className={styles.applicantIcon} />
                <div className={styles.applicantDetails}>
                  <div className={styles.applicantName}>
                    {visa.applicantName}
                  </div>
                  <div className={styles.applicantEmail}>{visa.email}</div>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <FiCalendar className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Submitted</div>
                    <div className={styles.detailValue}>
                      {visa.submittedDate}
                    </div>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FiClock className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Processing</div>
                    <div className={styles.detailValue}>
                      {visa.processingTime}
                    </div>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FiDollarSign className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Fees</div>
                    <div className={styles.detailValue}>{visa.fees}</div>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FiGlobe className={styles.detailIcon} />
                  <div>
                    <div className={styles.detailLabel}>Duration</div>
                    <div className={styles.detailValue}>{visa.duration}</div>
                  </div>
                </div>
              </div>

              <div className={styles.progressContainer}>
                <div className={styles.progressLabel}>
                  <span>Progress</span>
                  <span>{visa.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${visa.progress}%`,
                      backgroundColor: visa.color,
                    }}
                  />
                </div>
              </div>

              <div className={styles.documentsPreview}>
                <div className={styles.documentsLabel}>Documents:</div>
                <div className={styles.documentsStatus}>
                  {visa.documents && visa.documents.length > 0 ?
                    visa.documents.map((doc, index) => (
                      <div
                        key={index}
                        className={styles.docBadge}
                        title={`${doc.name}: ${doc.status}`}>
                        {getDocumentStatusIcon(doc.status)}
                      </div>
                    ))
                  : <div className={styles.docBadge}>
                      <FiFileText />
                    </div>
                  }
                </div>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.actionBtn}
                onClick={() => handleViewDetails(visa)}>
                <FiEye />
                View Details
              </button>
              <button className={styles.actionBtn}>
                <FiMessageSquare />
                Support
              </button>
              {visa.status === "approved" && (
                <button className={styles.actionBtn}>
                  <FiDownload />
                  Download Visa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <div className={styles.emptyState}>
          <FiFileText className={styles.emptyIcon} />
          <h3>No visa applications found</h3>
          <p>
            {viewApplications.length === 0 ?
              "You haven't applied for any visa yet. Start a new application to get going."
            : "Try adjusting your search or filter."}
          </p>
          <Link to="/dashboard/visa" className={styles.emptyBtn}>
            {viewApplications.length === 0 ?
              "Apply for Visa"
            : "Start New Application"}
          </Link>
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedVisa && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <div
                  className={styles.modalCountryBadge}
                  style={{ backgroundColor: selectedVisa.color }}>
                  {selectedVisa.countryCode}
                </div>
                <div>
                  <h2>
                    {selectedVisa.country} - {selectedVisa.type}
                  </h2>
                  <p className={styles.modalRef}>#{selectedVisa.ref}</p>
                </div>
              </div>
              <button className={styles.modalClose} onClick={closeModal}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Status Overview */}
              <div className={styles.modalSection}>
                <div className={styles.statusOverview}>
                  <div
                    className={`${styles.modalStatus} ${getStatusColor(selectedVisa.status)}`}>
                    {getStatusIcon(selectedVisa.status)}
                    <span>{selectedVisa.statusText}</span>
                  </div>
                  <div className={styles.modalDates}>
                    <div className={styles.dateInfo}>
                      <FiCalendar />
                      <span>
                        <strong>Submitted:</strong> {selectedVisa.submittedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicant Info */}
              <div className={styles.modalSection}>
                <h3>
                  <FiUser />
                  Applicant Information
                </h3>
                <div className={styles.applicantGrid}>
                  <div className={styles.applicantField}>
                    <label>Name:</label>
                    <span>{selectedVisa.applicantName}</span>
                  </div>
                  <div className={styles.applicantField}>
                    <label>Email:</label>
                    <span>{selectedVisa.email}</span>
                  </div>
                  <div className={styles.applicantField}>
                    <label>Passport:</label>
                    <span>{selectedVisa.passportNumber}</span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className={styles.modalGrid}>
                <div className={styles.detailCard}>
                  <h3>
                    <FiInfo />
                    Application Details
                  </h3>
                  <div className={styles.detailList}>
                    <div className={styles.detailRow}>
                      <span>Processing Time:</span>
                      <span>{selectedVisa.processingTime}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Duration:</span>
                      <span>{selectedVisa.duration}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Fees Paid:</span>
                      <span>{selectedVisa.fees}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h3>
                    <FiMapPin />
                    Consulate Info
                  </h3>
                  <div className={styles.detailList}>
                    <div className={styles.detailRow}>
                      <span>Consulate:</span>
                      <span>{selectedVisa.consulate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedVisa.documents && selectedVisa.documents.length > 0 && (
                <div className={styles.modalSection}>
                  <h3>
                    <FiFileText />
                    Submitted Documents
                  </h3>
                  <div className={styles.documentsList}>
                    {selectedVisa.documents.map((doc, index) => (
                      <div key={index} className={styles.documentItem}>
                        <div className={styles.documentInfo}>
                          {getDocumentStatusIcon(doc.status)}
                          <span className={styles.documentName}>
                            {doc.name}
                          </span>
                        </div>
                        <div
                          className={`${styles.documentStatus} ${styles[`doc${doc.status}`]}`}>
                          {doc.status.charAt(0).toUpperCase() +
                            doc.status.slice(1)}
                          {doc.uploaded ? " ✓" : " ✗"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className={styles.modalSection}>
                <h3>
                  <FiClock />
                  Application Timeline
                </h3>
                <div className={styles.timeline}>
                  {selectedVisa.timeline.map((step) => (
                    <div
                      key={step.step}
                      className={`${styles.timelineStep} ${styles[step.status]}`}>
                      <div className={styles.timelineDot}></div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineTitle}>{step.name}</div>
                        <div className={styles.timelineDate}>{step.date}</div>
                      </div>
                      <FiChevronRight className={styles.timelineArrow} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalBtn}>
                <FiMessageSquare />
                Contact Support
              </button>
              <button className={styles.modalBtn}>
                <FiDownload />
                Download Documents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserVisaRecords;
