import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserVisaRecords.module.css";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiDownload,
  FiEye,
  FiFilter,
  FiSearch,
  FiCreditCard,
  FiFileText,
  FiGlobe,
  FiFlag,
  FiEdit2,
  FiPrinter,
  FiShare2,
  FiMessageSquare,
  FiStar,
  FiSettings,
  FiBell,
  FiLock,
  FiHeart,
  FiHelpCircle,
  FiLogOut,
  FiUpload,
  FiZap,
  FiRefreshCw,
  FiBriefcase,
  FiBook,
  FiHome,
  FiActivity,
  FiAward,
} from "react-icons/fi";
import {
  MdFlight,
  MdHotel,
  MdDirectionsCar,
  MdRestaurant,
  MdLocalActivity,
  MdOutlineVerifiedUser,
  MdOutlineSecurity,
  MdOutlinePayment,
} from "react-icons/md";
import { FaRegHospital } from "react-icons/fa";

function UserVisaRecords() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      // Mock user profile data
      const mockProfile = {
        id: 1,
        fullName: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        nationality: "Nigerian",
        passportNumber: "A12345678",
        dob: "1990-05-15",
        address: "123 Main Street, Lagos, Nigeria",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        membership: "Premium",
        memberSince: "2023-01-15",
        points: 2450,
        verification: "verified",
      };

      // Mock visa applications
      const mockApplications = [
        {
          id: 1,
          type: "tourist",
          destination: "United Kingdom",
          destinationCode: "GB",
          reference: "VISA-UK-789012",
          applicationDate: "2024-11-10",
          departureDate: "2024-12-15",
          processingDate: "2024-11-20",
          estimatedCompletion: "2024-11-30",
          status: "approved",
          visaNumber: "GBV7890123456",
          duration: "90 days",
          purpose: "Tourism",
          fee: 450,
          currency: "£",
          processingFee: 50,
          totalPaid: 500,
          documents: ["passport", "photo", "financial"],
          lastUpdated: "2024-11-25",
          officer: "Emma Wilson",
          priority: "standard",
        },
        {
          id: 2,
          type: "business",
          destination: "China",
          destinationCode: "CN",
          reference: "VISA-CN-345678",
          applicationDate: "2024-11-15",
          departureDate: "2024-12-20",
          processingDate: "2024-11-25",
          estimatedCompletion: "2024-12-05",
          status: "processing",
          duration: "30 days",
          purpose: "Business Meeting",
          fee: 350,
          currency: "¥",
          processingFee: 75,
          totalPaid: 425,
          documents: ["passport", "invitation", "business"],
          lastUpdated: "2024-11-28",
          officer: "Zhang Wei",
          priority: "express",
        },
        {
          id: 3,
          type: "student",
          destination: "Umarah",
          destinationCode: "SA",
          reference: "VISA-SA-456789",
          applicationDate: "2024-10-05",
          departureDate: "2024-11-01",
          processingDate: "2024-10-15",
          estimatedCompletion: "2024-10-25",
          status: "approved",
          visaNumber: "SAV4567890123",
          duration: "1 year",
          purpose: "University Studies",
          fee: 300,
          currency: "SAR",
          processingFee: 100,
          totalPaid: 400,
          documents: ["passport", "admission", "financial"],
          lastUpdated: "2024-10-20",
          officer: "Ahmed Al-Saud",
          priority: "standard",
        },
        {
          id: 4,
          type: "tourist",
          destination: "Dubai",
          destinationCode: "AE",
          reference: "VISA-AE-123456",
          applicationDate: "2024-11-01",
          departureDate: "2024-12-01",
          processingDate: null,
          estimatedCompletion: "2024-11-21",
          status: "pending",
          duration: "30 days",
          purpose: "Vacation",
          fee: 380,
          currency: "AED",
          processingFee: 45,
          totalPaid: 425,
          documents: ["passport", "photo"],
          lastUpdated: "2024-11-01",
          priority: "regular",
        },
        {
          id: 5,
          type: "work",
          destination: "Qatar",
          destinationCode: "QA",
          reference: "VISA-QA-987654",
          applicationDate: "2024-10-20",
          departureDate: "2024-11-15",
          processingDate: "2024-10-25",
          estimatedCompletion: "2024-11-10",
          status: "rejected",
          duration: "2 years",
          purpose: "Employment",
          fee: 400,
          currency: "QAR",
          processingFee: 150,
          totalPaid: 550,
          documents: ["passport", "contract", "medical"],
          lastUpdated: "2024-11-05",
          officer: "Mohammed Al-Thani",
          reason: "Incomplete documentation",
          priority: "standard",
        },
        {
          id: 6,
          type: "medical",
          destination: "Algeria",
          destinationCode: "DZ",
          reference: "VISA-DZ-654321",
          applicationDate: "2024-09-15",
          departureDate: "2024-10-01",
          processingDate: "2024-09-25",
          estimatedCompletion: "2024-10-05",
          status: "completed",
          visaNumber: "DZV6543210987",
          duration: "60 days",
          purpose: "Medical Treatment",
          fee: 250,
          currency: "DZD",
          processingFee: 75,
          totalPaid: 325,
          documents: ["passport", "medical", "appointment"],
          lastUpdated: "2024-10-10",
          officer: "Fatima Zohra",
          priority: "urgent",
        },
      ];

      setUserProfile(mockProfile);
      setApplications(mockApplications);
      setLoading(false);
    }, 1500);
  }, []);

  const [stats] = useState({
    totalApplications: 6,
    approved: 2,
    processing: 1,
    pending: 1,
    rejected: 1,
    completed: 1,
    totalSpent: "£2,125",
    upcomingDepartures: 2,
    successRate: "67%",
  });

  const profileTabs = [
    {
      id: "applications",
      label: "Visa Applications",
      icon: <FiFileText />,
      count: 6,
      color: "#10b981",
    },
    {
      id: "profile",
      label: "Profile Info",
      icon: <FiUser />,
      color: "#3b82f6",
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FiFileText />,
      color: "#8b5cf6",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings />,
      color: "#f59e0b",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiBell />,
      color: "#ef4444",
    },
  ];

  const statusFilters = [
    { id: "all", label: "All Status" },
    { id: "approved", label: "Approved" },
    { id: "processing", label: "Processing" },
    { id: "pending", label: "Pending" },
    { id: "rejected", label: "Rejected" },
    { id: "completed", label: "Completed" },
  ];

  const typeFilters = [
    { id: "all", label: "All Types", icon: "📋" },
    { id: "tourist", label: "Tourist Visa", icon: "🏖️" },
    { id: "business", label: "Business Visa", icon: "💼" },
    { id: "student", label: "Student Visa", icon: "🎓" },
    { id: "work", label: "Work Visa", icon: "👨‍💼" },
    { id: "medical", label: "Medical Visa", icon: "🏥" },
  ];

  const quickActions = [
    {
      id: 1,
      label: "New Visa Application",
      icon: <FiGlobe />,
      path: "/dashboard/visa",
      description: "Apply for a new visa",
      color: "var(--green)",
    },
    {
      id: 2,
      label: "Upload Documents",
      icon: <FiUpload />,
      path: "/dashboard/documents",
      description: "Upload supporting documents",
      color: "var(--orange)",
    },
    {
      id: 3,
      label: "Track Application",
      icon: <FiSearch />,
      path: "/dashboard/track",
      description: "Check application status",
      color: "var(--blue)",
    },
  ];

  const securityFeatures = [
    {
      id: 1,
      label: "Two-Factor Authentication",
      icon: <MdOutlineSecurity />,
      status: "Enabled",
      action: "Manage",
      color: "#10b981",
    },
    {
      id: 2,
      label: "Login Activity",
      icon: <FiUser />,
      status: "Active",
      action: "View",
      color: "#3b82f6",
    },
    {
      id: 3,
      label: "Payment Methods",
      icon: <MdOutlinePayment />,
      status: "2 Cards",
      action: "Manage",
      color: "#8b5cf6",
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      approved: (
        <span className={styles.statusBadgeApproved}>
          <FiCheckCircle /> Approved
        </span>
      ),
      processing: (
        <span className={styles.statusBadgeProcessing}>
          <FiClock /> Processing
        </span>
      ),
      pending: (
        <span className={styles.statusBadgePending}>
          <FiClock /> Pending
        </span>
      ),
      rejected: (
        <span className={styles.statusBadgeRejected}>
          <FiAlertCircle /> Rejected
        </span>
      ),
      completed: (
        <span className={styles.statusBadgeCompleted}>
          <FiCheckCircle /> Completed
        </span>
      ),
    };
    return badges[status] || badges.pending;
  };

  const getTypeIcon = (type) => {
    const icons = {
      tourist: "🏖️",
      business: "💼",
      student: "🎓",
      work: "👨‍💼",
      medical: "🏥",
    };
    return icons[type] || "📋";
  };

  const getTypeColor = (type) => {
    const colors = {
      tourist: "#10b981",
      business: "#3b82f6",
      student: "#8b5cf6",
      work: "#f59e0b",
      medical: "#ef4444",
    };
    return colors[type] || "#64748b";
  };

  const getCountryFlag = (code) => {
    const flagMap = {
      GB: "🇬🇧",
      CN: "🇨🇳",
      SA: "🇸🇦",
      AE: "🇦🇪",
      QA: "🇶🇦",
      DZ: "🇩🇿",
    };
    return flagMap[code] || "🌍";
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: <span className={styles.priorityBadgeUrgent}>Urgent</span>,
      express: <span className={styles.priorityBadgeExpress}>Express</span>,
      standard: <span className={styles.priorityBadgeStandard}>Standard</span>,
      regular: <span className={styles.priorityBadgeRegular}>Regular</span>,
    };
    return badges[priority] || badges.standard;
  };

  const filteredApplications = applications.filter((app) => {
    const matchesTab =
      activeTab === "applications" ||
      activeTab === "profile" ||
      activeTab === "documents" ||
      activeTab === "settings" ||
      activeTab === "notifications";

    const matchesSearch =
      searchQuery === "" ||
      app.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || app.status === filterStatus;

    return matchesTab && matchesSearch && matchesStatus;
  });

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
  };

  const handleDownloadVisa = (application) => {
    if (application.visaNumber) {
      alert(`Downloading visa document for ${application.reference}`);
    } else {
      alert("Visa not yet approved for download");
    }
  };

  const handleTrackApplication = (application) => {
    navigate(`/dashboard/visa/track/${application.id}`);
  };

  const handleRenewApplication = (application) => {
    alert(`Starting renewal for ${application.reference}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency) => {
    return `${currency}${amount.toLocaleString()}`;
  };

  const calculateProcessingProgress = (app) => {
    if (app.status === "approved" || app.status === "completed") return 100;
    if (app.status === "rejected") return 100;

    if (app.applicationDate && app.estimatedCompletion) {
      const start = new Date(app.applicationDate).getTime();
      const end = new Date(app.estimatedCompletion).getTime();
      const now = new Date().getTime();

      if (now >= end) return 100;
      if (now <= start) return 0;

      const progress = ((now - start) / (end - start)) * 100;
      return Math.min(100, Math.max(0, Math.round(progress)));
    }
    return 50; // Default progress
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your visa records...</p>
      </div>
    );
  }

  return (
    <div className={styles.visaRecordsContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Visa Records & Profile</h1>
              <p className={styles.heroSubtitle}>
                Manage your visa applications, profile, and security settings
              </p>
            </div>
            <div className={styles.userQuickActions}>
              <button
                className={styles.newVisaButton}
                onClick={() => navigate("/dashboard/visa")}>
                <FiGlobe /> New Visa Application
              </button>
              <button
                className={styles.profileButton}
                onClick={() => setActiveTab("profile")}>
                <FiUser /> Edit Profile
              </button>
            </div>
          </div>

          {/* User Profile Summary */}
          <div className={styles.profileSummaryCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileImage}>
                <img
                  src={userProfile.profileImage}
                  alt={userProfile.fullName}
                />
                {userProfile.verification === "verified" && (
                  <span className={styles.verifiedBadge}>
                    <MdOutlineVerifiedUser />
                  </span>
                )}
              </div>
              <div className={styles.profileInfo}>
                <h2 className={styles.userName}>{userProfile.fullName}</h2>
                <div className={styles.userDetails}>
                  <span className={styles.userDetail}>
                    <FiMail /> {userProfile.email}
                  </span>
                  <span className={styles.userDetail}>
                    <FiPhone /> {userProfile.phone}
                  </span>
                  <span className={styles.userDetail}>
                    <FiFlag /> {userProfile.nationality}
                  </span>
                </div>
                <div className={styles.userStats}>
                  <span className={styles.userStat}>
                    <span className={styles.statValue}>
                      {stats.totalApplications}
                    </span>
                    <span className={styles.statLabel}>Total Applications</span>
                  </span>
                  <span className={styles.userStat}>
                    <span className={styles.statValue}>
                      {stats.successRate}
                    </span>
                    <span className={styles.statLabel}>Success Rate</span>
                  </span>
                  <span className={styles.userStat}>
                    <span className={styles.statValue}>
                      {userProfile.points}
                    </span>
                    <span className={styles.statLabel}>Reward Points</span>
                  </span>
                </div>
              </div>
              <div className={styles.membershipBadge}>
                <FiStar /> {userProfile.membership} Member
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: "#10b981" }}>
                <FiFileText />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>
                  {stats.totalApplications}
                </div>
                <div className={styles.statLabel}>Total Applications</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: "#3b82f6" }}>
                <FiCheckCircle />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stats.approved}</div>
                <div className={styles.statLabel}>Approved</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: "#f59e0b" }}>
                <FiClock />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>{stats.processing}</div>
                <div className={styles.statLabel}>Processing</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: "#ef4444" }}>
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
            {/* Profile Tabs */}
            <div className={styles.profileTabs}>
              {profileTabs.map((tab) => (
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
                    <div className={styles.tabIcon}>{tab.icon}</div>
                    <div className={styles.tabLabel}>{tab.label}</div>
                    {tab.count && (
                      <div
                        className={styles.tabBadge}
                        style={{ backgroundColor: tab.color }}>
                        {tab.count}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Content based on active tab */}
            {activeTab === "applications" && (
              <>
                {/* Search and Filters */}
                <div className={styles.searchFiltersCard}>
                  <div className={styles.searchContainer}>
                    <div className={styles.searchBox}>
                      <FiSearch className={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder="Search applications by destination, reference, or type..."
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

                {/* Applications List */}
                <div className={styles.applicationsList}>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <div key={app.id} className={styles.applicationCard}>
                        <div className={styles.applicationHeader}>
                          <div className={styles.applicationType}>
                            <div
                              className={styles.typeIcon}
                              style={{
                                backgroundColor: getTypeColor(app.type),
                              }}>
                              {getTypeIcon(app.type)}
                            </div>
                            <div className={styles.typeInfo}>
                              <div className={styles.typeLabel}>
                                {app.type.charAt(0).toUpperCase() +
                                  app.type.slice(1)}{" "}
                                Visa
                              </div>
                              <div className={styles.applicationReference}>
                                {app.reference}
                              </div>
                            </div>
                          </div>
                          <div className={styles.applicationPriority}>
                            {getPriorityBadge(app.priority)}
                            <div className={styles.applicationDate}>
                              Applied: {formatDate(app.applicationDate)}
                            </div>
                          </div>
                        </div>

                        <div className={styles.applicationContent}>
                          <div className={styles.applicationInfo}>
                            <div className={styles.destinationRow}>
                              <div className={styles.destinationFlag}>
                                {getCountryFlag(app.destinationCode)}
                              </div>
                              <h3 className={styles.destination}>
                                {app.destination}
                              </h3>
                            </div>

                            <div className={styles.processingProgress}>
                              <div className={styles.progressBar}>
                                <div
                                  className={styles.progressFill}
                                  style={{
                                    width: `${calculateProcessingProgress(
                                      app
                                    )}%`,
                                  }}
                                />
                              </div>
                              <div className={styles.progressInfo}>
                                <span className={styles.progressText}>
                                  {calculateProcessingProgress(app)}% Complete
                                </span>
                                <span className={styles.estimatedDate}>
                                  Est. Completion:{" "}
                                  {formatDate(app.estimatedCompletion)}
                                </span>
                              </div>
                            </div>

                            <div className={styles.detailsGrid}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                  Duration:
                                </span>
                                <span className={styles.detailValue}>
                                  {app.duration}
                                </span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                  Purpose:
                                </span>
                                <span className={styles.detailValue}>
                                  {app.purpose}
                                </span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                  Departure:
                                </span>
                                <span className={styles.detailValue}>
                                  {formatDate(app.departureDate)}
                                </span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                  Processing Fee:
                                </span>
                                <span className={styles.detailValue}>
                                  {formatCurrency(
                                    app.processingFee,
                                    app.currency
                                  )}
                                </span>
                              </div>
                            </div>

                            {app.documents && app.documents.length > 0 && (
                              <div className={styles.documents}>
                                {app.documents.map((doc, index) => (
                                  <span key={index} className={styles.document}>
                                    <FiFileText /> {doc}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className={styles.applicationActions}>
                            <div className={styles.actionStatus}>
                              {getStatusBadge(app.status)}
                              <div className={styles.applicationPrice}>
                                {formatCurrency(app.totalPaid, app.currency)}
                              </div>
                            </div>

                            <div className={styles.actionButtons}>
                              <button
                                className={styles.viewButton}
                                onClick={() => handleViewDetails(app)}>
                                <FiEye /> Details
                              </button>
                              <button
                                className={styles.trackButton}
                                onClick={() => handleTrackApplication(app)}>
                                <FiSearch /> Track
                              </button>
                              {app.status === "approved" && (
                                <button
                                  className={styles.downloadButton}
                                  onClick={() => handleDownloadVisa(app)}>
                                  <FiDownload /> Visa
                                </button>
                              )}
                              {app.status === "completed" && (
                                <button
                                  className={styles.renewButton}
                                  onClick={() => handleRenewApplication(app)}>
                                  <FiRefreshCw /> Renew
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <FiGlobe className={styles.emptyIcon} />
                      <h3>No visa applications found</h3>
                      <p>
                        {searchQuery
                          ? "No applications match your search criteria"
                          : "You haven't applied for any visas yet."}
                      </p>
                      <button
                        className={styles.newVisaAction}
                        onClick={() => navigate("/dashboard/visa")}>
                        <FiGlobe /> Apply for a Visa
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "profile" && userProfile && (
              <div className={styles.profileDetailsCard}>
                <h3 className={styles.profileSectionTitle}>
                  Personal Information
                </h3>

                <div className={styles.profileForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>
                        <FiUser /> Full Name
                      </label>
                      <div className={styles.readOnlyField}>
                        {userProfile.fullName}
                      </div>
                    </div>
                    <div className={styles.formField}>
                      <label>
                        <FiMail /> Email Address
                      </label>
                      <div className={styles.readOnlyField}>
                        {userProfile.email}
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>
                        <FiPhone /> Phone Number
                      </label>
                      <div className={styles.readOnlyField}>
                        {userProfile.phone}
                      </div>
                    </div>
                    <div className={styles.formField}>
                      <label>
                        <FiCalendar /> Date of Birth
                      </label>
                      <div className={styles.readOnlyField}>
                        {formatDate(userProfile.dob)}
                      </div>
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label>
                      <FiFlag /> Nationality
                    </label>
                    <div className={styles.readOnlyField}>
                      {userProfile.nationality}
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label>
                      <FiFileText /> Passport Number
                    </label>
                    <div className={styles.readOnlyField}>
                      {userProfile.passportNumber}
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label>
                      <FiMapPin /> Address
                    </label>
                    <div className={styles.readOnlyField}>
                      {userProfile.address}
                    </div>
                  </div>

                  <div className={styles.profileActions}>
                    <button className={styles.editProfileButton}>
                      <FiEdit2 /> Edit Profile Information
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className={styles.documentsCard}>
                <h3 className={styles.profileSectionTitle}>Document Library</h3>
                <p className={styles.sectionSubtitle}>
                  Your uploaded documents for visa applications
                </p>

                <div className={styles.documentCategories}>
                  <div className={styles.documentCategory}>
                    <h4>Passport & Identification</h4>
                    <div className={styles.documentList}>
                      <div className={styles.documentItem}>
                        <FiFileText className={styles.documentIcon} />
                        <div className={styles.documentInfo}>
                          <div className={styles.documentName}>
                            Passport Data Page
                          </div>
                          <div className={styles.documentMeta}>
                            Uploaded: Nov 10, 2024 • Verified ✓
                          </div>
                        </div>
                        <div className={styles.documentActions}>
                          <button className={styles.documentAction}>
                            <FiDownload />
                          </button>
                          <button className={styles.documentAction}>
                            <FiEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.documentCategory}>
                    <h4>Financial Documents</h4>
                    <div className={styles.documentList}>
                      <div className={styles.documentItem}>
                        <FiFileText className={styles.documentIcon} />
                        <div className={styles.documentInfo}>
                          <div className={styles.documentName}>
                            Bank Statement
                          </div>
                          <div className={styles.documentMeta}>
                            Uploaded: Nov 15, 2024 • Expires: May 15, 2025
                          </div>
                        </div>
                        <div className={styles.documentActions}>
                          <button className={styles.documentAction}>
                            <FiDownload />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.uploadSection}>
                  <div className={styles.uploadZone}>
                    <FiUpload className={styles.uploadIcon} />
                    <div className={styles.uploadText}>
                      <h4>Upload New Document</h4>
                      <p>
                        Drag & drop or click to browse files (PDF, JPG, PNG)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className={styles.settingsCard}>
                <h3 className={styles.profileSectionTitle}>Account Settings</h3>

                <div className={styles.settingsSections}>
                  <div className={styles.settingsSection}>
                    <h4>
                      <FiLock /> Security
                    </h4>
                    <div className={styles.securityFeatures}>
                      {securityFeatures.map((feature) => (
                        <div
                          key={feature.id}
                          className={styles.securityFeature}>
                          <div className={styles.featureInfo}>
                            <div
                              className={styles.featureIcon}
                              style={{ color: feature.color }}>
                              {feature.icon}
                            </div>
                            <div>
                              <div className={styles.featureLabel}>
                                {feature.label}
                              </div>
                              <div className={styles.featureStatus}>
                                {feature.status}
                              </div>
                            </div>
                          </div>
                          <button className={styles.featureAction}>
                            {feature.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.settingsSection}>
                    <h4>
                      <FiBell /> Notifications
                    </h4>
                    <div className={styles.notificationSettings}>
                      <div className={styles.notificationItem}>
                        <div className={styles.notificationInfo}>
                          <div className={styles.notificationLabel}>
                            Application Status Updates
                          </div>
                          <div className={styles.notificationDescription}>
                            Get notified when your visa application status
                            changes
                          </div>
                        </div>
                        <div className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            id="status-updates"
                            defaultChecked
                          />
                          <label htmlFor="status-updates"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className={styles.notificationsCard}>
                <h3 className={styles.profileSectionTitle}>Notifications</h3>

                <div className={styles.notificationsList}>
                  <div className={styles.notificationItem}>
                    <div
                      className={styles.notificationIcon}
                      style={{ color: "#10b981" }}>
                      <FiCheckCircle />
                    </div>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationTitle}>
                        Visa Approved!
                      </div>
                      <div className={styles.notificationMessage}>
                        Your UK Tourist Visa (VISA-UK-789012) has been approved.
                      </div>
                      <div className={styles.notificationTime}>2 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiZap /> Quick Actions
              </h3>
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

            {/* Processing Applications */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiClock /> Processing Applications
              </h3>
              <div className={styles.processingList}>
                {applications
                  .filter(
                    (app) =>
                      app.status === "processing" || app.status === "pending"
                  )
                  .map((app) => (
                    <div key={app.id} className={styles.processingItem}>
                      <div className={styles.processingFlag}>
                        {getCountryFlag(app.destinationCode)}
                      </div>
                      <div className={styles.processingInfo}>
                        <div className={styles.processingDestination}>
                          {app.destination}
                        </div>
                        <div className={styles.processingType}>
                          {app.type} Visa
                        </div>
                        <div className={styles.processingReference}>
                          {app.reference}
                        </div>
                      </div>
                      <div className={styles.processingStatus}>
                        {app.status === "processing" ? "In Review" : "Pending"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Visa Tips */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiHelpCircle /> Visa Tips
              </h3>
              <div className={styles.tipsList}>
                <div className={styles.tipItem}>
                  <FiCheckCircle className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Apply at least 4-6 weeks before travel
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheckCircle className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Keep passport valid for 6+ months
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheckCircle className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Upload clear document scans
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheckCircle className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Check visa requirements per country
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Travel */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiCalendar /> Upcoming Travel
              </h3>
              <div className={styles.upcomingList}>
                {applications
                  .filter(
                    (app) =>
                      app.status === "approved" || app.status === "completed"
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.departureDate) - new Date(b.departureDate)
                  )
                  .slice(0, 3)
                  .map((app) => (
                    <div key={app.id} className={styles.upcomingItem}>
                      <div className={styles.upcomingDate}>
                        {new Date(app.departureDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </div>
                      <div className={styles.upcomingInfo}>
                        <div className={styles.upcomingDestination}>
                          {app.destination}
                        </div>
                        <div className={styles.upcomingType}>
                          {app.type} Visa
                        </div>
                      </div>
                      <div className={styles.upcomingAction}>
                        <button className={styles.viewButtonSmall}>
                          <FiEye />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Visa Application Details</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseDetails}>
                <FiX />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.applicationSummary}>
                <div className={styles.summaryHeader}>
                  <div className={styles.summaryFlag}>
                    {getCountryFlag(selectedApplication.destinationCode)}
                  </div>
                  <div className={styles.summaryInfo}>
                    <h3 className={styles.summaryTitle}>
                      {selectedApplication.destination} -{" "}
                      {selectedApplication.type} Visa
                    </h3>
                    <div className={styles.summaryReference}>
                      Reference: {selectedApplication.reference}
                    </div>
                  </div>
                  {getStatusBadge(selectedApplication.status)}
                </div>

                <div className={styles.summaryDetails}>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>
                      Application Information
                    </h4>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Application Date:
                        </span>
                        <span className={styles.detailValue}>
                          {formatDate(selectedApplication.applicationDate)}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Processing Start:
                        </span>
                        <span className={styles.detailValue}>
                          {formatDate(selectedApplication.processingDate) ||
                            "Pending"}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Estimated Completion:
                        </span>
                        <span className={styles.detailValue}>
                          {formatDate(selectedApplication.estimatedCompletion)}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Departure Date:
                        </span>
                        <span className={styles.detailValue}>
                          {formatDate(selectedApplication.departureDate)}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Visa Duration:
                        </span>
                        <span className={styles.detailValue}>
                          {selectedApplication.duration}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Purpose:</span>
                        <span className={styles.detailValue}>
                          {selectedApplication.purpose}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Priority:</span>
                        <span className={styles.detailValue}>
                          {selectedApplication.priority
                            .charAt(0)
                            .toUpperCase() +
                            selectedApplication.priority.slice(1)}
                        </span>
                      </div>
                      {selectedApplication.officer && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Processing Officer:
                          </span>
                          <span className={styles.detailValue}>
                            {selectedApplication.officer}
                          </span>
                        </div>
                      )}
                      {selectedApplication.visaNumber && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Visa Number:
                          </span>
                          <span className={styles.detailValue}>
                            {selectedApplication.visaNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>Payment Details</h4>
                    <div className={styles.paymentSummary}>
                      <div className={styles.paymentRow}>
                        <span>Visa Fee:</span>
                        <span>
                          {formatCurrency(
                            selectedApplication.fee,
                            selectedApplication.currency
                          )}
                        </span>
                      </div>
                      <div className={styles.paymentRow}>
                        <span>Processing Fee:</span>
                        <span>
                          {formatCurrency(
                            selectedApplication.processingFee,
                            selectedApplication.currency
                          )}
                        </span>
                      </div>
                      <div className={styles.paymentRow}>
                        <span>Total Paid:</span>
                        <span className={styles.paymentAmount}>
                          {formatCurrency(
                            selectedApplication.totalPaid,
                            selectedApplication.currency
                          )}
                        </span>
                      </div>
                      <div className={styles.paymentRow}>
                        <span>Payment Status:</span>
                        <span className={styles.paymentStatusPaid}>Paid</span>
                      </div>
                    </div>
                  </div>

                  {selectedApplication.reason && (
                    <div className={styles.detailSection}>
                      <h4 className={styles.detailTitle}>
                        <FiAlertCircle /> Rejection Reason
                      </h4>
                      <div className={styles.rejectionReason}>
                        {selectedApplication.reason}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalActions}>
                {selectedApplication.visaNumber && (
                  <button
                    className={styles.modalButton}
                    onClick={() => handleDownloadVisa(selectedApplication)}>
                    <FiDownload /> Download Visa
                  </button>
                )}
                <button className={styles.modalButtonSecondary}>
                  <FiPrinter /> Print Summary
                </button>
                <button className={styles.modalButtonSecondary}>
                  <FiShare2 /> Share Details
                </button>
                <button
                  className={styles.modalButton}
                  onClick={() => handleTrackApplication(selectedApplication)}>
                  <FiSearch /> Track Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserVisaRecords;
