import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSync,
  FaFileExport,
  FaGlobe,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaUserCheck,
  FaUserClock,
  FaFileInvoiceDollar,
  FaPlus,
  FaChevronDown,
  FaPrint,
  FaShareAlt,
  FaCopy,
  FaArchive,
  FaBell,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronRight,
  FaPassport,
  FaPlaneDeparture,
  FaCalendarAlt,
  FaFileUpload,
  FaCreditCard,
  FaUserCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarDay,
  FaRobot,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "./AdminVisa.css";

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
  const [sortField, setSortField] = useState("applicationDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [newCountry, setNewCountry] = useState({
    id: "",
    name: "",
    flag: "",
    basePrice: 0,
    currency: "$",
    processingTime: "7-14 days",
    isActive: true,
    visaTypes: [],
    requirements: [],
  });
  const [newPricing, setNewPricing] = useState({
    id: Date.now(),
    countryId: "",
    visaType: "tourist",
    duration: "30",
    price: 0,
    processingFee: 0,
    expressFee: 0,
    urgentFee: 0,
  });
  const [newVisaType, setNewVisaType] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    processing: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  const colors = {
    green: "#10b981",
    orange: "#f59e0b",
    blue: "#3b82f6",
    purple: "#8b5cf6",
    red: "#ef4444",
    darkGreen: "#059669",
    darkOrange: "#d97706",
  };

  // Initialize with sample data
  useEffect(() => {
    const loadData = () => {
      const sampleCountries = [
        {
          id: "uk",
          name: "United Kingdom",
          flag: "🇬🇧",
          basePrice: 450,
          currency: "£",
          processingTime: "5-7 days",
          isActive: true,
          visaTypes: ["tourist", "business", "student"],
          requirements: ["Valid passport", "Financial proof", "Accommodation"],
        },
        {
          id: "china",
          name: "China",
          flag: "🇨🇳",
          basePrice: 350,
          currency: "¥",
          processingTime: "7-10 days",
          isActive: true,
          visaTypes: ["business", "tourist", "work"],
          requirements: ["Passport photo", "Invitation letter"],
        },
        {
          id: "umarah",
          name: "Umarah",
          flag: "🇸🇦",
          basePrice: 300,
          currency: "SAR",
          processingTime: "3-5 days",
          isActive: true,
          visaTypes: ["tourist", "business", "religious"],
          requirements: ["Passport copy", "Hotel booking"],
        },
        {
          id: "qatar",
          name: "Qatar",
          flag: "🇶🇦",
          basePrice: 400,
          currency: "QAR",
          processingTime: "4-6 days",
          isActive: true,
          visaTypes: ["tourist", "business"],
          requirements: ["Passport valid 6 months"],
        },
        {
          id: "dubai",
          name: "Dubai",
          flag: "🇦🇪",
          basePrice: 380,
          currency: "AED",
          processingTime: "2-4 days",
          isActive: true,
          visaTypes: ["tourist", "transit", "work"],
          requirements: ["Passport", "Photo"],
        },
        {
          id: "algeria",
          name: "Algeria",
          flag: "🇩🇿",
          basePrice: 250,
          currency: "DZD",
          processingTime: "5-8 days",
          isActive: true,
          visaTypes: ["tourist", "business"],
          requirements: ["Valid passport", "Return ticket"],
        },
      ];

      const samplePricing = [
        {
          id: 1,
          countryId: "uk",
          visaType: "tourist",
          duration: "30",
          price: 450,
          processingFee: 50,
          expressFee: 100,
          urgentFee: 200,
        },
        {
          id: 2,
          countryId: "uk",
          visaType: "business",
          duration: "90",
          price: 650,
          processingFee: 75,
          expressFee: 150,
          urgentFee: 300,
        },
        {
          id: 3,
          countryId: "china",
          visaType: "tourist",
          duration: "30",
          price: 350,
          processingFee: 40,
          expressFee: 80,
          urgentFee: 160,
        },
      ];

      const sampleApplications = [
        {
          id: "VISA-" + Date.now().toString().slice(-8).toUpperCase(),
          reference: "VISA-001",
          applicantName: "John Smith",
          applicantEmail: "john.smith@example.com",
          applicantPhone: "+1 (555) 123-4567",
          passportNumber: "A12345678",
          nationality: "Nigerian",
          destination: "United Kingdom",
          destinationCode: "uk",
          visaType: "tourist",
          duration: "90",
          processingTime: "standard",
          applicationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "approved",
          paymentStatus: "paid",
          amountPaid: 500,
          currency: "£",
          documents: ["passport.pdf"],
          notes: "All documents verified",
          assignedOfficer: "Admin User",
          priority: "standard",
        },
        {
          id: "VISA-" + (Date.now() + 1).toString().slice(-8).toUpperCase(),
          reference: "VISA-002",
          applicantName: "Sarah Johnson",
          applicantEmail: "sarah.j@example.com",
          applicantPhone: "+1 (555) 987-6543",
          passportNumber: "B87654321",
          nationality: "American",
          destination: "China",
          destinationCode: "china",
          visaType: "business",
          duration: "30",
          processingTime: "express",
          applicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          departureDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: "processing",
          paymentStatus: "paid",
          amountPaid: 425,
          currency: "¥",
          documents: ["passport.pdf", "invitation.pdf"],
          notes: "Awaiting additional documents",
          assignedOfficer: "",
          priority: "express",
        },
        {
          id: "VISA-" + (Date.now() + 2).toString().slice(-8).toUpperCase(),
          reference: "VISA-003",
          applicantName: "Michael Brown",
          applicantEmail: "michael.b@example.com",
          applicantPhone: "+1 (555) 456-7890",
          passportNumber: "C98765432",
          nationality: "British",
          destination: "Umarah",
          destinationCode: "umarah",
          visaType: "tourist",
          duration: "180",
          processingTime: "urgent",
          applicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "pending",
          paymentStatus: "pending",
          amountPaid: 0,
          currency: "SAR",
          documents: [],
          notes: "Payment not received",
          assignedOfficer: "",
          priority: "urgent",
        },
        {
          id: "VISA-" + (Date.now() + 3).toString().slice(-8).toUpperCase(),
          reference: "VISA-004",
          applicantName: "Emily Davis",
          applicantEmail: "emily.d@example.com",
          applicantPhone: "+1 (555) 234-5678",
          passportNumber: "D76543210",
          nationality: "Canadian",
          destination: "Dubai",
          destinationCode: "dubai",
          visaType: "tourist",
          duration: "30",
          processingTime: "standard",
          applicationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          departureDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: "rejected",
          paymentStatus: "refunded",
          amountPaid: 425,
          currency: "AED",
          documents: ["passport.pdf"],
          notes: "Incomplete documentation",
          rejectionReason: "Missing required financial documents",
          assignedOfficer: "Admin User",
          priority: "standard",
        },
      ];

      const totalApps = sampleApplications.length;
      const pending = sampleApplications.filter(
        (app) => app.status === "pending",
      ).length;
      const approved = sampleApplications.filter(
        (app) => app.status === "approved",
      ).length;
      const rejected = sampleApplications.filter(
        (app) => app.status === "rejected",
      ).length;
      const processing = sampleApplications.filter(
        (app) => app.status === "processing",
      ).length;
      const totalRevenue = sampleApplications
        .filter((app) => app.paymentStatus === "paid")
        .reduce((sum, app) => sum + app.amountPaid, 0);

      setApplications(sampleApplications);
      setCountries(sampleCountries);
      setPricing(samplePricing);
      setStats({
        totalApplications: totalApps,
        pending,
        approved,
        rejected,
        processing,
        totalRevenue,
        monthlyRevenue: totalRevenue * 12,
      });
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter and sort applications
  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        searchTerm === "" ||
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      const matchesCountry =
        countryFilter === "all" || app.destinationCode === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortOrder === "asc" ? 1 : -1;

      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

  const statusOptions = [
    { id: "all", label: "All Status", color: "#6b7280" },
    { id: "pending", label: "Pending", color: colors.orange },
    { id: "processing", label: "Processing", color: colors.blue },
    { id: "approved", label: "Approved", color: colors.green },
    { id: "rejected", label: "Rejected", color: colors.red },
  ];

  const formatCurrency = (amount, currency) => {
    return `${currency}${amount.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setShowApplicationModal(true);
  };

  const handleUpdateStatus = (appId, newStatus) => {
    if (
      window.confirm(`Are you sure you want to change status to ${newStatus}?`)
    ) {
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app,
        ),
      );
      alert("Status updated successfully!");
    }
  };

  const handleAssignOfficer = (appId) => {
    const officerName = prompt("Enter officer name to assign:");
    if (officerName) {
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, assignedOfficer: officerName } : app,
        ),
      );
      alert(`Assigned to ${officerName}`);
    }
  };

  const handleSendEmail = (application) => {
    const subject = `Update on your visa application ${application.reference}`;
    const body = `Dear ${application.applicantName},\n\n`;
    const emailLink = `mailto:${
      application.applicantEmail
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailLink, "_blank");
  };

  const handleExportData = (format) => {
    alert(`Exporting data in ${format.toUpperCase()} format...`);
  };

  // Country Management Functions
  const handleAddCountry = () => {
    setNewCountry({
      id: "",
      name: "",
      flag: "",
      basePrice: 0,
      currency: "$",
      processingTime: "7-14 days",
      isActive: true,
      visaTypes: [],
      requirements: [],
    });
    setEditingCountry(null);
    setShowCountryModal(true);
  };

  const handleEditCountry = (country) => {
    setNewCountry(country);
    setEditingCountry(country);
    setShowCountryModal(true);
  };

  const handleSaveCountry = () => {
    if (!newCountry.name.trim() || !newCountry.id.trim()) {
      alert("Country name and ID are required");
      return;
    }

    if (editingCountry) {
      // Update existing country
      setCountries(
        countries.map((c) =>
          c.id === editingCountry.id ? { ...newCountry } : c,
        ),
      );
      alert("Country updated successfully!");
    } else {
      // Add new country
      if (countries.some((c) => c.id === newCountry.id)) {
        alert("Country ID already exists");
        return;
      }
      setCountries([...countries, newCountry]);
      alert("Country added successfully!");
    }
    setShowCountryModal(false);
    setEditingCountry(null);
    setNewCountry({
      id: "",
      name: "",
      flag: "",
      basePrice: 0,
      currency: "$",
      processingTime: "7-14 days",
      isActive: true,
      visaTypes: [],
      requirements: [],
    });
  };

  const handleDeleteCountry = (countryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this country? This will also delete associated pricing.",
      )
    ) {
      setCountries(countries.filter((c) => c.id !== countryId));
      setPricing(pricing.filter((p) => p.countryId !== countryId));
      alert("Country deleted successfully!");
    }
  };

  const handleToggleCountryActive = (countryId) => {
    setCountries(
      countries.map((c) =>
        c.id === countryId ? { ...c, isActive: !c.isActive } : c,
      ),
    );
  };

  const handleAddVisaType = () => {
    if (newVisaType.trim()) {
      setNewCountry({
        ...newCountry,
        visaTypes: [...newCountry.visaTypes, newVisaType.trim()],
      });
      setNewVisaType("");
    }
  };

  const handleRemoveVisaType = (index) => {
    const updatedVisaTypes = [...newCountry.visaTypes];
    updatedVisaTypes.splice(index, 1);
    setNewCountry({ ...newCountry, visaTypes: updatedVisaTypes });
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setNewCountry({
        ...newCountry,
        requirements: [...newCountry.requirements, newRequirement.trim()],
      });
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...newCountry.requirements];
    updatedRequirements.splice(index, 1);
    setNewCountry({ ...newCountry, requirements: updatedRequirements });
  };

  // Pricing Management Functions
  const handleAddPricing = () => {
    setNewPricing({
      id: Date.now(),
      countryId: "",
      visaType: "tourist",
      duration: "30",
      price: 0,
      processingFee: 0,
      expressFee: 0,
      urgentFee: 0,
    });
    setEditingPrice(null);
    setShowPricingModal(true);
  };

  const handleEditPricing = (price) => {
    setNewPricing(price);
    setEditingPrice(price);
    setShowPricingModal(true);
  };

  const handleSavePricing = () => {
    if (!newPricing.countryId || !newPricing.visaType) {
      alert("Please select a country and visa type");
      return;
    }

    if (editingPrice) {
      // Update existing pricing
      setPricing(
        pricing.map((p) => (p.id === editingPrice.id ? { ...newPricing } : p)),
      );
      alert("Pricing updated successfully!");
    } else {
      // Add new pricing
      setPricing([...pricing, newPricing]);
      alert("Pricing added successfully!");
    }
    setShowPricingModal(false);
    setEditingPrice(null);
    setNewPricing({
      id: Date.now(),
      countryId: "",
      visaType: "tourist",
      duration: "30",
      price: 0,
      processingFee: 0,
      expressFee: 0,
      urgentFee: 0,
    });
  };

  const handleDeletePricing = (priceId) => {
    if (window.confirm("Are you sure you want to delete this pricing?")) {
      setPricing(pricing.filter((p) => p.id !== priceId));
    }
  };

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
          <FaPassport /> Visa Management Admin
        </h1>
        <p className="admin-subtitle">
          Manage visa applications, pricing, and countries
        </p>
        <div className="admin-header-actions">
          <button
            className="btn-refresh"
            onClick={() => window.location.reload()}>
            <FaSync /> Refresh
          </button>
          <button
            className="btn-export"
            onClick={() => handleExportData("csv")}>
            <FaFileExport /> Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.processing}</div>
            <div className="stat-label">Processing</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-main-content">
        {/* Tabs Navigation */}
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

        {/* Search and Filters */}
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
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  className={`filter-chip ${
                    statusFilter === status.id ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter(status.id)}>
                  {status.label}
                </button>
              ))}
            </div>

            <div className="filter-chips" style={{ marginTop: "0.75rem" }}>
              <button
                className={`filter-chip ${
                  countryFilter === "all" ? "active" : ""
                }`}
                onClick={() => setCountryFilter("all")}>
                All Countries
              </button>
              {countries.map((country) => (
                <button
                  key={country.id}
                  className={`filter-chip ${
                    countryFilter === country.id ? "active" : ""
                  }`}
                  onClick={() => setCountryFilter(country.id)}>
                  <span className="country-flag-small">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="applications-section">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("applicantName")}>
                        <div className="sort-header">
                          Applicant {getSortIcon("applicantName")}
                        </div>
                      </th>
                      <th onClick={() => handleSort("destination")}>
                        <div className="sort-header">
                          Destination {getSortIcon("destination")}
                        </div>
                      </th>
                      <th onClick={() => handleSort("status")}>
                        <div className="sort-header">
                          Status {getSortIcon("status")}
                        </div>
                      </th>
                      <th onClick={() => handleSort("applicationDate")}>
                        <div className="sort-header">
                          Date {getSortIcon("applicationDate")}
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
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        <td className="applicant-cell">
                          <div className="applicant-info">
                            <strong className="applicant-name">
                              {app.applicantName}
                            </strong>
                            <div className="applicant-details">
                              <span className="applicant-email">
                                <FaEnvelope size={10} /> {app.applicantEmail}
                              </span>
                            </div>
                            <div className="applicant-reference">
                              <FaPassport size={10} /> {app.reference}
                            </div>
                          </div>
                        </td>

                        <td className="destination-cell">
                          <div className="destination-info">
                            <div className="destination-flag">
                              {countries.find(
                                (c) => c.id === app.destinationCode,
                              )?.flag || "🌍"}
                            </div>
                            <div className="destination-details">
                              <div className="destination-name">
                                {app.destination}
                              </div>
                              <div className="visa-type">{app.visaType}</div>
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
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </td>

                        <td className="date-cell">
                          <div className="date-info">
                            <div className="date-item">
                              <span className="date-label">Applied</span>
                              <span className="date-value">
                                {formatDate(app.applicationDate)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="amount-cell">
                          <div className="amount-info">
                            <div className="amount">
                              {formatCurrency(app.amountPaid, app.currency)}
                            </div>
                            <div
                              className={`payment-status ${
                                app.paymentStatus === "paid" ?
                                  "paid"
                                : "pending"
                              }`}>
                              {app.paymentStatus === "paid" ?
                                "Paid"
                              : app.paymentStatus === "pending" ?
                                "Pending"
                              : "Refunded"}
                            </div>
                          </div>
                        </td>

                        <td className="actions-cell">
                          <div className="action-buttons">
                            <button
                              className="action-btn view"
                              onClick={() => handleViewApplication(app)}
                              title="View Details">
                              <FaEye />
                            </button>
                            <button
                              className="action-btn email"
                              onClick={() => handleSendEmail(app)}
                              title="Send Email">
                              <FaEnvelope />
                            </button>
                            <button
                              className="action-btn edit"
                              onClick={() => handleAssignOfficer(app.id)}
                              title="Assign Officer">
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredApplications.length === 0 && (
                  <div className="empty-state">
                    <FaSearch className="empty-icon" />
                    <h3>No applications found</h3>
                    <p>Try adjusting your search or filters</p>
                    <button
                      className="clear-filters-btn"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setCountryFilter("all");
                      }}>
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Countries Tab */}
          {activeTab === "countries" && (
            <div className="countries-section">
              <div className="section-header">
                <h2>Manage Destination Countries</h2>
                <button className="btn-add-country" onClick={handleAddCountry}>
                  <FaPlus /> Add Country
                </button>
              </div>

              <div className="countries-grid">
                {countries.map((country) => (
                  <div key={country.id} className="country-card">
                    <div className="country-card-header">
                      <div className="country-flag">{country.flag}</div>
                      <div className="country-name">{country.name}</div>
                      <div className="country-status">
                        <span
                          className={`status-dot ${
                            country.isActive ? "active" : "inactive"
                          }`}></span>
                        {country.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="country-card-body">
                      <div className="country-price">
                        <span className="price-currency">
                          {country.currency}
                        </span>
                        <span className="price-amount">
                          {country.basePrice}
                        </span>
                      </div>
                      <div className="country-processing">
                        <FaClock /> {country.processingTime} processing
                      </div>
                      <div className="country-visa-types">
                        {country.visaTypes.map((type, index) => (
                          <span key={index} className="visa-type-tag">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="country-card-footer">
                      <button
                        className="btn-edit-country"
                        onClick={() => handleEditCountry(country)}>
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn-delete-country"
                        onClick={() => handleDeleteCountry(country.id)}
                        title="Delete Country">
                        <FaTrash />
                      </button>
                      <button
                        className={`btn-toggle-status ${
                          country.isActive ? "deactivate" : ""
                        }`}
                        onClick={() => handleToggleCountryActive(country.id)}>
                        {country.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === "pricing" && (
            <div className="pricing-section">
              <div className="section-header">
                <h2>Manage Visa Pricing</h2>
                <button className="btn-add-pricing" onClick={handleAddPricing}>
                  <FaPlus /> Add Pricing
                </button>
              </div>

              <div className="pricing-table-container">
                <table className="pricing-table">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Visa Type</th>
                      <th>Duration</th>
                      <th>Base Price</th>
                      <th>Processing Fee</th>
                      <th>Express Fee</th>
                      <th>Urgent Fee</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricing.map((price) => {
                      const country = countries.find(
                        (c) => c.id === price.countryId,
                      );
                      const totalPrice = price.price + price.processingFee;

                      return (
                        <tr key={price.id}>
                          <td>
                            <div className="price-country">
                              <span className="price-flag">
                                {country?.flag || "🌍"}
                              </span>
                              <span>{country?.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td>
                            <span className="visa-type-badge">
                              {price.visaType}
                            </span>
                          </td>
                          <td>{price.duration} days</td>
                          <td>
                            <span className="price-value">
                              {country?.currency || "$"}
                              {price.price}
                            </span>
                          </td>
                          <td>
                            <span className="price-value">
                              {country?.currency || "$"}
                              {price.processingFee}
                            </span>
                          </td>
                          <td>
                            <span className="price-value">
                              {country?.currency || "$"}
                              {price.expressFee}
                            </span>
                          </td>
                          <td>
                            <span className="price-value">
                              {country?.currency || "$"}
                              {price.urgentFee}
                            </span>
                          </td>
                          <td>
                            <strong className="total-price">
                              {country?.currency || "$"}
                              {totalPrice}
                            </strong>
                          </td>
                          <td>
                            <div className="price-actions">
                              <button
                                className="btn-edit-price"
                                onClick={() => handleEditPricing(price)}>
                                <FaEdit />
                              </button>
                              <button
                                className="btn-delete-price"
                                onClick={() => handleDeletePricing(price.id)}>
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {pricing.length === 0 && (
                  <div className="empty-state">
                    <FaMoneyBillWave className="empty-icon" />
                    <h3>No pricing configured</h3>
                    <p>Click "Add Pricing" to create your first pricing rule</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="analytics-section">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Applications Overview</h3>
                  <div className="chart-placeholder">
                    <div
                      className="chart-bar"
                      style={{ height: "80%", background: colors.green }}></div>
                    <div
                      className="chart-bar"
                      style={{
                        height: "60%",
                        background: colors.orange,
                      }}></div>
                    <div
                      className="chart-bar"
                      style={{ height: "90%", background: colors.blue }}></div>
                    <div
                      className="chart-bar"
                      style={{ height: "40%", background: colors.red }}></div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Revenue Analysis</h3>
                  <div className="chart-placeholder">
                    <div
                      className="chart-donut"
                      style={{
                        background: `conic-gradient(${colors.green} 0% 40%, ${colors.orange} 40% 70%, ${colors.blue} 70% 85%, ${colors.purple} 85% 100%)`,
                      }}></div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Top Countries</h3>
                  <div className="country-stats">
                    {countries.slice(0, 5).map((country) => {
                      const countryApps = applications.filter(
                        (app) => app.destinationCode === country.id,
                      ).length;
                      const countryRevenue = applications
                        .filter(
                          (app) =>
                            app.destinationCode === country.id &&
                            app.paymentStatus === "paid",
                        )
                        .reduce((sum, app) => sum + app.amountPaid, 0);

                      return (
                        <div key={country.id} className="country-stat">
                          <div className="country-stat-header">
                            <span className="country-flag">{country.flag}</span>
                            <span className="country-name">{country.name}</span>
                          </div>
                          <div className="country-stat-numbers">
                            <div className="stat-number">
                              {countryApps}{" "}
                              <span className="stat-label">Apps</span>
                            </div>
                            <div className="stat-number">
                              ${countryRevenue.toLocaleString()}{" "}
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
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className="activity-item">
                        <div className="activity-icon">
                          {app.status === "approved" ?
                            <FaCheckCircle style={{ color: colors.green }} />
                          : app.status === "rejected" ?
                            <FaTimesCircle style={{ color: colors.red }} />
                          : <FaClock style={{ color: colors.orange }} />}
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">
                            {app.applicantName}
                          </div>
                          <div className="activity-subtitle">
                            {app.destination} •{" "}
                            {formatDate(app.applicationDate)}
                          </div>
                        </div>
                        <div className="activity-amount">
                          {formatCurrency(app.amountPaid, app.currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
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
                    {selectedApplication.reference}
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
                      <FaUserCircle /> Applicant Information
                    </h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Full Name:</span>
                        <span className="detail-value">
                          {selectedApplication.applicantName}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">
                          {selectedApplication.applicantEmail}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">
                          {selectedApplication.applicantPhone}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Passport Number:</span>
                        <span className="detail-value">
                          {selectedApplication.passportNumber}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Nationality:</span>
                        <span className="detail-value">
                          {selectedApplication.nationality}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3 className="section-title">
                      <FaPassport /> Visa Information
                    </h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Destination:</span>
                        <span className="detail-value">
                          {countries.find(
                            (c) => c.id === selectedApplication.destinationCode,
                          )?.flag || "🌍"}{" "}
                          {selectedApplication.destination}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Visa Type:</span>
                        <span className="detail-value">
                          {selectedApplication.visaType}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">
                          {selectedApplication.duration} days
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Processing Time:</span>
                        <span className="detail-value">
                          {selectedApplication.processingTime}
                        </span>
                      </div>
                    </div>
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
                {selectedApplication.status === "processing" && (
                  <>
                    <button
                      className="btn-success"
                      onClick={() => {
                        handleUpdateStatus(selectedApplication.id, "approved");
                        setShowApplicationModal(false);
                      }}>
                      Approve
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason) {
                          handleUpdateStatus(
                            selectedApplication.id,
                            "rejected",
                          );
                          setShowApplicationModal(false);
                        }
                      }}>
                      Reject
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Country Management Modal */}
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
                  {editingCountry ? "Edit Country" : "Add New Country"}
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
                    <label htmlFor="countryId">Country ID *</label>
                    <input
                      type="text"
                      id="countryId"
                      value={newCountry.id}
                      onChange={(e) =>
                        setNewCountry({ ...newCountry, id: e.target.value })
                      }
                      placeholder="e.g., uk, usa, china"
                      disabled={editingCountry}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="countryName">Country Name *</label>
                    <input
                      type="text"
                      id="countryName"
                      value={newCountry.name}
                      onChange={(e) =>
                        setNewCountry({ ...newCountry, name: e.target.value })
                      }
                      placeholder="e.g., United Kingdom"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="countryFlag">Flag Emoji</label>
                    <input
                      type="text"
                      id="countryFlag"
                      value={newCountry.flag}
                      onChange={(e) =>
                        setNewCountry({ ...newCountry, flag: e.target.value })
                      }
                      placeholder="e.g., 🇬🇧"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <input
                      type="text"
                      id="currency"
                      value={newCountry.currency}
                      onChange={(e) =>
                        setNewCountry({
                          ...newCountry,
                          currency: e.target.value,
                        })
                      }
                      placeholder="e.g., £, $, €"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="basePrice">Base Price</label>
                    <input
                      type="number"
                      id="basePrice"
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
                    <label htmlFor="processingTime">Processing Time</label>
                    <input
                      type="text"
                      id="processingTime"
                      value={newCountry.processingTime}
                      onChange={(e) =>
                        setNewCountry({
                          ...newCountry,
                          processingTime: e.target.value,
                        })
                      }
                      placeholder="e.g., 5-7 days"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Visa Types</label>
                    <div className="tag-input-group">
                      <input
                        type="text"
                        value={newVisaType}
                        onChange={(e) => setNewVisaType(e.target.value)}
                        placeholder="Add visa type (e.g., tourist, business)"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddVisaType()
                        }
                      />
                      <button
                        type="button"
                        className="btn-add-tag"
                        onClick={handleAddVisaType}>
                        <FaPlus />
                      </button>
                    </div>
                    <div className="tags-container">
                      {newCountry.visaTypes.map((type, index) => (
                        <span key={index} className="tag">
                          {type}
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => handleRemoveVisaType(index)}>
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
                        placeholder="Add requirement"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddRequirement()
                        }
                      />
                      <button
                        type="button"
                        className="btn-add-tag"
                        onClick={handleAddRequirement}>
                        <FaPlus />
                      </button>
                    </div>
                    <div className="tags-container">
                      {newCountry.requirements.map((req, index) => (
                        <span key={index} className="tag">
                          {req}
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => handleRemoveRequirement(index)}>
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
                      <span>Active Country</span>
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

      {/* Pricing Management Modal */}
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
                  {editingPrice ? "Edit Pricing" : "Add New Pricing"}
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
                    <label htmlFor="countryId">Country *</label>
                    <select
                      id="countryId"
                      value={newPricing.countryId}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          countryId: e.target.value,
                        })
                      }>
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="visaType">Visa Type *</label>
                    <select
                      id="visaType"
                      value={newPricing.visaType}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          visaType: e.target.value,
                        })
                      }>
                      <option value="tourist">Tourist</option>
                      <option value="business">Business</option>
                      <option value="student">Student</option>
                      <option value="work">Work</option>
                      <option value="transit">Transit</option>
                      <option value="religious">Religious</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">Duration (days)</label>
                    <select
                      id="duration"
                      value={newPricing.duration}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          duration: e.target.value,
                        })
                      }>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Base Price</label>
                    <input
                      type="number"
                      id="price"
                      value={newPricing.price}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="processingFee">Processing Fee</label>
                    <input
                      type="number"
                      id="processingFee"
                      value={newPricing.processingFee}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          processingFee: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expressFee">Express Fee</label>
                    <input
                      type="number"
                      id="expressFee"
                      value={newPricing.expressFee}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          expressFee: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="urgentFee">Urgent Fee</label>
                    <input
                      type="number"
                      id="urgentFee"
                      value={newPricing.urgentFee}
                      onChange={(e) =>
                        setNewPricing({
                          ...newPricing,
                          urgentFee: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group full-width">
                    <div className="price-summary">
                      <h4>Price Summary</h4>
                      <div className="summary-row">
                        <span>Base Price:</span>
                        <span>${newPricing.price}</span>
                      </div>
                      <div className="summary-row">
                        <span>Processing Fee:</span>
                        <span>${newPricing.processingFee}</span>
                      </div>
                      <div className="summary-row">
                        <span>Express Fee:</span>
                        <span>${newPricing.expressFee}</span>
                      </div>
                      <div className="summary-row">
                        <span>Urgent Fee:</span>
                        <span>${newPricing.urgentFee}</span>
                      </div>
                      <div className="summary-row total">
                        <strong>Total (Base + Processing):</strong>
                        <strong>
                          ${newPricing.price + newPricing.processingFee}
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
