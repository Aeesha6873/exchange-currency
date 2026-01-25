import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FiFilter,
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
  FiCreditCard,
} from "react-icons/fi";

function UserVisaRecords() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get visa applications from localStorage (from your VisaService)
  const [visaApplications, setVisaApplications] = useState([]);

  useEffect(() => {
    // Load visa applications from localStorage
    const loadVisaApplications = () => {
      try {
        const savedApplications =
          JSON.parse(localStorage.getItem("visaApplications")) || [];
        const sampleApplications = getSampleApplications(); // Fallback if none exist

        if (savedApplications.length > 0) {
          setVisaApplications(savedApplications);
        } else {
          setVisaApplications(sampleApplications);
          // Save sample applications for demo
          localStorage.setItem(
            "visaApplications",
            JSON.stringify(sampleApplications),
          );
        }
      } catch (error) {
        console.error("Error loading visa applications:", error);
        setVisaApplications(getSampleApplications());
      }
    };

    loadVisaApplications();

    // Listen for new applications from VisaService
    const handleStorageChange = () => {
      loadVisaApplications();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Helper function to create sample applications matching your VisaService
  const getSampleApplications = () => {
    const countries = [
      { id: "uk", name: "United Kingdom", flag: "🇬🇧", currency: "£" },
      { id: "china", name: "China", flag: "🇨🇳", currency: "¥" },
      { id: "umarah", name: "Umarah", flag: "🇸🇦", currency: "SAR" },
      { id: "qatar", name: "Qatar", flag: "🇶🇦", currency: "QAR" },
      { id: "dubai", name: "Dubai", flag: "🇦🇪", currency: "AED" },
      { id: "algeria", name: "Algeria", flag: "🇩🇿", currency: "DZD" },
    ];

    const processingTimes = [
      { id: "urgent", label: "Urgent", time: "24-48 hours" },
      { id: "express", label: "Express", time: "3-5 days" },
      { id: "standard", label: "Standard", time: "7-10 days" },
      { id: "regular", label: "Regular", time: "15-20 days" },
    ];

    const durations = [
      { id: "30", label: "Short Stay", time: "1 month" },
      { id: "90", label: "Tourist", time: "3 months" },
      { id: "180", label: "Business", time: "6 months" },
      { id: "365", label: "Long Term", time: "1 year" },
      { id: "730", label: "Residence", time: "2 years" },
    ];

    const statuses = ["review", "approved", "pending", "rejected"];
    const statusTexts = {
      review: "Under Review",
      approved: "Approved",
      pending: "Pending Documents",
      rejected: "Rejected",
    };

    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];
    const getRandomDate = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().split("T")[0];
    };

    return Array.from({ length: 6 }, (_, i) => {
      const country = getRandomElement(countries);
      const processingTime = getRandomElement(processingTimes);
      const duration = getRandomElement(durations);
      const status = statuses[i % statuses.length];
      const submittedDate = getRandomDate(Math.floor(Math.random() * 30) + 1);

      // Calculate progress based on status
      let progress = 0;
      switch (status) {
        case "review":
          progress = 60;
          break;
        case "approved":
          progress = 100;
          break;
        case "pending":
          progress = 30;
          break;
        case "rejected":
          progress = 100;
          break;
      }

      // Color based on country ID
      const colors = {
        uk: "#4f46e5",
        china: "#dc2626",
        umarah: "#059669",
        qatar: "#7c3aed",
        dubai: "#ea580c",
        algeria: "#0891b2",
      };

      return {
        id: `VISA-${Date.now().toString().slice(-8)}-${i}`,
        country: country.name,
        countryCode: country.flag,
        countryId: country.id,
        type:
          duration.id <= "90" ? "Tourist Visa"
          : duration.id <= "180" ? "Business Visa"
          : duration.id <= "365" ? "Student Visa"
          : "Work Visa",
        status: status,
        statusText: statusTexts[status],
        submittedDate: submittedDate,
        processingTime: processingTime.time,
        duration: duration.time,
        fees: `${country.currency}${Math.floor(Math.random() * 200) + 200}`,
        ref: `VISA-${country.id.toUpperCase()}-${new Date().getFullYear()}-${String(i + 1).padStart(4, "0")}`,
        color: colors[country.id] || "#4f46e5",
        progress: progress,
        applicantName: `Applicant ${i + 1}`,
        email: `applicant${i + 1}@example.com`,
        passportNumber: `P${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`,
        documents: [
          {
            name: "Passport Copy",
            status: Math.random() > 0.2 ? "approved" : "pending",
            uploaded: true,
          },
          {
            name: "Photograph",
            status: Math.random() > 0.3 ? "approved" : "pending",
            uploaded: true,
          },
          {
            name: "Supporting Documents",
            status: status === "pending" ? "pending" : "approved",
            uploaded: status !== "pending",
          },
        ],
        timeline: generateTimeline(status, submittedDate),
        consulate: `${country.name} Embassy`,
        officer: ["John Davis", "Sarah Miller", "Michael Brown", "Emma Wilson"][
          i % 4
        ],
        notes: getStatusNotes(status, country.name),
        nextSteps: getNextSteps(status),
      };
    });
  };

  const generateTimeline = (status, submittedDate) => {
    const baseSteps = [
      {
        step: 1,
        name: "Application Submitted",
        date: submittedDate,
        status: "completed",
      },
      {
        step: 2,
        name: "Document Verification",
        date: addDays(submittedDate, 2),
        status: "completed",
      },
    ];

    switch (status) {
      case "approved":
        return [
          ...baseSteps,
          {
            step: 3,
            name: "Under Review",
            date: addDays(submittedDate, 5),
            status: "completed",
          },
          {
            step: 4,
            name: "Approval",
            date: addDays(submittedDate, 7),
            status: "completed",
          },
          {
            step: 5,
            name: "Visa Issued",
            date: addDays(submittedDate, 8),
            status: "completed",
          },
        ];
      case "review":
        return [
          ...baseSteps,
          { step: 3, name: "Under Review", date: "Current", status: "current" },
          {
            step: 4,
            name: "Processing",
            date: addDays(submittedDate, 10),
            status: "upcoming",
          },
          {
            step: 5,
            name: "Decision",
            date: addDays(submittedDate, 14),
            status: "upcoming",
          },
        ];
      case "pending":
        return [
          ...baseSteps,
          {
            step: 3,
            name: "Awaiting Documents",
            date: "Current",
            status: "current",
          },
          {
            step: 4,
            name: "Document Review",
            date: "Pending",
            status: "upcoming",
          },
          { step: 5, name: "Processing", date: "Pending", status: "upcoming" },
        ];
      case "rejected":
        return [
          ...baseSteps,
          {
            step: 3,
            name: "Under Review",
            date: addDays(submittedDate, 5),
            status: "completed",
          },
          {
            step: 4,
            name: "Additional Review",
            date: addDays(submittedDate, 7),
            status: "completed",
          },
          {
            step: 5,
            name: "Application Rejected",
            date: addDays(submittedDate, 10),
            status: "completed",
          },
        ];
      default:
        return baseSteps;
    }
  };

  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const getStatusNotes = (status, country) => {
    switch (status) {
      case "approved":
        return `Visa for ${country} has been approved. Your passport is ready for collection.`;
      case "review":
        return `Your application for ${country} is currently under review. We will notify you once a decision is made.`;
      case "pending":
        return `Additional documents required for your ${country} visa application. Please check the required documents list.`;
      case "rejected":
        return `Your application for ${country} was rejected due to incomplete documentation. You may reapply after addressing the issues.`;
      default:
        return "Application submitted successfully.";
    }
  };

  const getNextSteps = (status) => {
    switch (status) {
      case "approved":
        return ["Collect passport from visa center", "Review visa conditions"];
      case "review":
        return ["Monitor application status", "Prepare for possible interview"];
      case "pending":
        return [
          "Upload required documents",
          "Complete biometric appointment",
          "Submit additional information",
        ];
      case "rejected":
        return [
          "Review rejection reasons",
          "Gather required documents",
          "Reapply after 30 days",
        ];
      default:
        return ["Check application status", "Contact support if needed"];
    }
  };

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
      case "pending":
        return <FiAlertCircle className={styles.docPending} />;
      default:
        return <FiAlertCircle className={styles.docPending} />;
    }
  };

  const handleViewDetails = (visa) => {
    setSelectedVisa(visa);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVisa(null);
  };

  const filteredApplications = visaApplications.filter((visa) => {
    if (filter !== "all" && visa.status !== filter) return false;
    if (searchTerm) {
      return (
        visa.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visa.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visa.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visa.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const stats = {
    total: visaApplications.length,
    approved: visaApplications.filter((v) => v.status === "approved").length,
    review: visaApplications.filter((v) => v.status === "review").length,
    pending: visaApplications.filter((v) => v.status === "pending").length,
  };

  const addNewApplication = () => {
    // This would be called when a new application is submitted via VisaService
    const newApp = {
      id: `VISA-${Date.now().toString().slice(-8)}-${visaApplications.length}`,
      country: "New Country",
      countryCode: "🇺🇸",
      type: "Tourist Visa",
      status: "review",
      statusText: "Under Review",
      submittedDate: new Date().toISOString().split("T")[0],
      processingTime: "7-10 days",
      duration: "3 months",
      fees: "$250",
      ref: `VISA-NEW-${new Date().getFullYear()}-${String(visaApplications.length + 1).padStart(4, "0")}`,
      color: "#4f46e5",
      progress: 10,
      applicantName: "New Applicant",
      email: "new@example.com",
      passportNumber: "P123456",
    };

    const updatedApplications = [newApp, ...visaApplications];
    setVisaApplications(updatedApplications);
    localStorage.setItem(
      "visaApplications",
      JSON.stringify(updatedApplications),
    );
  };

  return (
    <div className={styles.visaProcessContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Visa Process</h1>
          <p className={styles.subtitle}>
            Track your visa applications from {visaApplications.length}{" "}
            submitted applications
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/dashboard/my-visa" className={styles.newVisaBtn}>
            <FiPlus />
            New Application
          </Link>
          <button
            onClick={addNewApplication}
            className={styles.refreshBtn}
            title="Add Test Application"></button>
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
                  {visa.documents ?
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
          <p>Try adjusting your search or start a new application</p>
          <Link to="/dashboard/visa" className={styles.emptyBtn}>
            Apply for Visa
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
                    {selectedVisa.approvedDate && (
                      <div className={styles.dateInfo}>
                        <FiCheckCircle />
                        <span>
                          <strong>Approved:</strong> {selectedVisa.approvedDate}
                        </span>
                      </div>
                    )}
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
                    <div className={styles.detailRow}>
                      <span>Visa Officer:</span>
                      <span>{selectedVisa.officer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedVisa.documents && (
                <div className={styles.modalSection}>
                  <h3>
                    <FiFileText />
                    Required Documents
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
              {selectedVisa.timeline && (
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
                          <div className={styles.timelineTitle}>
                            {step.name}
                          </div>
                          <div className={styles.timelineDate}>{step.date}</div>
                        </div>
                        <FiChevronRight className={styles.timelineArrow} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes & Next Steps */}
              <div className={styles.modalGrid}>
                <div className={styles.detailCard}>
                  <h3>
                    <FiAlertTriangle />
                    Notes
                  </h3>
                  <p className={styles.notesText}>{selectedVisa.notes}</p>
                </div>

                <div className={styles.detailCard}>
                  <h3>
                    <FiCheckSquare />
                    Next Steps
                  </h3>
                  <ul className={styles.nextStepsList}>
                    {selectedVisa.nextSteps &&
                      selectedVisa.nextSteps.map((step, index) => (
                        <li key={index}>
                          <FiChevronRight />
                          {step}
                        </li>
                      ))}
                  </ul>
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
              {selectedVisa.status === "pending" && (
                <button className={`${styles.modalBtn} ${styles.primaryBtn}`}>
                  <FiPlus />
                  Upload Documents
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserVisaRecords;
