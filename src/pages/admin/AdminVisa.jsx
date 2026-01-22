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
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    processing: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  // Colors matching your VisaService
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
      // Sample countries data
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
          color: colors.green,
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
          color: colors.orange,
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
          color: colors.green,
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
          color: colors.orange,
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
          color: colors.green,
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
          color: colors.orange,
        },
      ];

      // Sample pricing tiers
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

      // Sample applications
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
          reviewHistory: [
            {
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              action: "Document Review",
              officer: "Admin User",
              status: "processing",
            },
            {
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              action: "Approved",
              officer: "Admin User",
              status: "approved",
            },
          ],
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

      // Calculate stats
      const totalApps = sampleApplications.length;
      const pending = sampleApplications.filter(
        (app) => app.status === "pending"
      ).length;
      const approved = sampleApplications.filter(
        (app) => app.status === "approved"
      ).length;
      const rejected = sampleApplications.filter(
        (app) => app.status === "rejected"
      ).length;
      const processing = sampleApplications.filter(
        (app) => app.status === "processing"
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

  // Status options
  const statusOptions = [
    { id: "all", label: "All Status", color: "#6b7280" },
    { id: "pending", label: "Pending", color: colors.orange },
    { id: "processing", label: "Processing", color: colors.blue },
    { id: "approved", label: "Approved", color: colors.green },
    { id: "rejected", label: "Rejected", color: colors.red },
  ];

  // Format currency
  const formatCurrency = (amount, currency) => {
    return `${currency}${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      pending: {
        icon: <FaClock />,
        color: colors.orange,
        bgColor: `rgba(${parseInt(colors.orange.slice(1, 3), 16)}, ${parseInt(
          colors.orange.slice(3, 5),
          16
        )}, ${parseInt(colors.orange.slice(5, 7), 16)}, 0.1)`,
        label: "Pending",
      },
      processing: {
        icon: <FaClock />,
        color: colors.blue,
        bgColor: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(
          colors.blue.slice(3, 5),
          16
        )}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.1)`,
        label: "Processing",
      },
      approved: {
        icon: <FaCheckCircle />,
        color: colors.green,
        bgColor: `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(
          colors.green.slice(3, 5),
          16
        )}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.1)`,
        label: "Approved",
      },
      rejected: {
        icon: <FaTimesCircle />,
        color: colors.red,
        bgColor: `rgba(${parseInt(colors.red.slice(1, 3), 16)}, ${parseInt(
          colors.red.slice(3, 5),
          16
        )}, ${parseInt(colors.red.slice(5, 7), 16)}, 0.1)`,
        label: "Rejected",
      },
    };

    const { icon, color, bgColor, label } = config[status] || config.pending;

    return (
      <span
        className="status-badge"
        style={{ color, backgroundColor: bgColor }}>
        {icon}
        {label}
      </span>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    const config = {
      paid: {
        color: colors.green,
        bgColor: `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(
          colors.green.slice(3, 5),
          16
        )}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.1)`,
        label: "Paid",
      },
      pending: {
        color: colors.orange,
        bgColor: `rgba(${parseInt(colors.orange.slice(1, 3), 16)}, ${parseInt(
          colors.orange.slice(3, 5),
          16
        )}, ${parseInt(colors.orange.slice(5, 7), 16)}, 0.1)`,
        label: "Pending",
      },
      refunded: {
        color: "#6b7280",
        bgColor: "rgba(107, 114, 128, 0.1)",
        label: "Refunded",
      },
    };

    const { color, bgColor, label } = config[status] || config.pending;

    return (
      <span
        className="payment-badge"
        style={{ color, backgroundColor: bgColor }}>
        {label}
      </span>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const config = {
      urgent: {
        color: colors.red,
        bgColor: `rgba(${parseInt(colors.red.slice(1, 3), 16)}, ${parseInt(
          colors.red.slice(3, 5),
          16
        )}, ${parseInt(colors.red.slice(5, 7), 16)}, 0.1)`,
        label: "Urgent",
      },
      express: {
        color: colors.purple,
        bgColor: `rgba(${parseInt(colors.purple.slice(1, 3), 16)}, ${parseInt(
          colors.purple.slice(3, 5),
          16
        )}, ${parseInt(colors.purple.slice(5, 7), 16)}, 0.1)`,
        label: "Express",
      },
      standard: {
        color: colors.blue,
        bgColor: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(
          colors.blue.slice(3, 5),
          16
        )}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.1)`,
        label: "Standard",
      },
      regular: {
        color: "#6b7280",
        bgColor: "rgba(107, 114, 128, 0.1)",
        label: "Regular",
      },
    };

    const { color, bgColor, label } = config[priority] || config.standard;

    return (
      <span
        className="priority-badge"
        style={{ color, backgroundColor: bgColor }}>
        {label}
      </span>
    );
  };

  // Handle application actions
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
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
      alert("Status updated successfully!");
    }
  };

  const handleAssignOfficer = (appId) => {
    const officerName = prompt("Enter officer name to assign:");
    if (officerName) {
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, assignedOfficer: officerName } : app
        )
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

  // Country management
  const handleAddCountry = () => {
    setEditingCountry(null);
    setShowCountryModal(true);
  };

  const handleEditCountry = (country) => {
    setEditingCountry(country);
    setShowCountryModal(true);
  };

  const handleSaveCountry = (countryData) => {
    if (editingCountry) {
      setCountries(
        countries.map((c) => (c.id === editingCountry.id ? countryData : c))
      );
    } else {
      setCountries([
        ...countries,
        { ...countryData, id: Date.now().toString() },
      ]);
    }
    setShowCountryModal(false);
    setEditingCountry(null);
  };

  const handleToggleCountryActive = (countryId) => {
    setCountries(
      countries.map((c) =>
        c.id === countryId ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  // Pricing management
  const handleAddPricing = () => {
    setEditingPrice(null);
    setShowPricingModal(true);
  };

  const handleEditPricing = (price) => {
    setEditingPrice(price);
    setShowPricingModal(true);
  };

  const handleSavePricing = (priceData) => {
    if (editingPrice) {
      setPricing(
        pricing.map((p) => (p.id === editingPrice.id ? priceData : p))
      );
    } else {
      setPricing([...pricing, { ...priceData, id: Date.now() }]);
    }
    setShowPricingModal(false);
    setEditingPrice(null);
  };

  const handleDeletePricing = (priceId) => {
    if (window.confirm("Are you sure you want to delete this pricing?")) {
      setPricing(pricing.filter((p) => p.id !== priceId));
    }
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
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
        <div className="admin-header-content">
          <h1 className="admin-title">
            <FaPassport /> Visa Management Admin
          </h1>
          <p className="admin-subtitle">
            Manage visa applications, pricing, and countries
          </p>
        </div>
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
          <div
            className="stat-icon"
            style={{
              background: `rgba(${parseInt(
                colors.blue.slice(1, 3),
                16
              )}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(
                colors.blue.slice(5, 7),
                16
              )}, 0.1)`,
            }}>
            <FaFileInvoiceDollar style={{ color: colors.blue }} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: `rgba(${parseInt(
                colors.orange.slice(1, 3),
                16
              )}, ${parseInt(colors.orange.slice(3, 5), 16)}, ${parseInt(
                colors.orange.slice(5, 7),
                16
              )}, 0.1)`,
            }}>
            <FaUserClock style={{ color: colors.orange }} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: `rgba(${parseInt(
                colors.purple.slice(1, 3),
                16
              )}, ${parseInt(colors.purple.slice(3, 5), 16)}, ${parseInt(
                colors.purple.slice(5, 7),
                16
              )}, 0.1)`,
            }}>
            <FaChartLine style={{ color: colors.purple }} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.processing}</div>
            <div className="stat-label">Processing</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: `rgba(${parseInt(
                colors.green.slice(1, 3),
                16
              )}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(
                colors.green.slice(5, 7),
                16
              )}, 0.1)`,
            }}>
            <FaUserCheck style={{ color: colors.green }} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: `rgba(${parseInt(
                colors.red.slice(1, 3),
                16
              )}, ${parseInt(colors.red.slice(3, 5), 16)}, ${parseInt(
                colors.red.slice(5, 7),
                16
              )}, 0.1)`,
            }}>
            <FaTimesCircle style={{ color: colors.red }} />
          </div>
          <div className="stat-content">
            <div className="statNumber">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: `rgba(${parseInt(
                colors.blue.slice(1, 3),
                16
              )}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(
                colors.blue.slice(5, 7),
                16
              )}, 0.1)`,
            }}>
            <FaMoneyBillWave style={{ color: colors.blue }} />
          </div>
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
        <div className="admin-tabs-container">
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
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderBottomColor:
                    activeTab === tab.id
                      ? tab.id === "applications"
                        ? colors.blue
                        : tab.id === "countries"
                        ? colors.green
                        : tab.id === "pricing"
                        ? colors.orange
                        : colors.purple
                      : "transparent",
                }}>
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="tab-badge">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="search-filters-card">
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

            <div className="filters-container">
              <div className="filter-group">
                <label>Status</label>
                <div className="filter-chips">
                  {statusOptions.map((status) => (
                    <button
                      key={status.id}
                      className={`filter-chip ${
                        statusFilter === status.id ? "active" : ""
                      }`}
                      onClick={() => setStatusFilter(status.id)}
                      style={{
                        backgroundColor:
                          statusFilter === status.id ? status.color : "",
                        borderColor: status.color,
                      }}>
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>Destination Country</label>
                <div className="filter-chips">
                  <button
                    className={`filter-chip ${
                      countryFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => setCountryFilter("all")}
                    style={{ borderColor: colors.green }}>
                    All Countries
                  </button>
                  {countries.map((country) => (
                    <button
                      key={country.id}
                      className={`filter-chip ${
                        countryFilter === country.id ? "active" : ""
                      }`}
                      onClick={() => setCountryFilter(country.id)}
                      style={{
                        backgroundColor:
                          countryFilter === country.id ? country.color : "",
                        borderColor: country.color,
                      }}>
                      <span className="country-flag">{country.flag}</span>
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="applications-section">
              <div className="table-container">
                <div className="table-header">
                  <div className="table-row header-row">
                    <div
                      className="table-cell"
                      onClick={() => handleSort("applicantName")}>
                      <div className="sort-header">
                        Applicant {getSortIcon("applicantName")}
                      </div>
                    </div>
                    <div
                      className="table-cell"
                      onClick={() => handleSort("destination")}>
                      <div className="sort-header">
                        Destination {getSortIcon("destination")}
                      </div>
                    </div>
                    <div
                      className="table-cell"
                      onClick={() => handleSort("applicationDate")}>
                      <div className="sort-header">
                        Applied {getSortIcon("applicationDate")}
                      </div>
                    </div>
                    <div
                      className="table-cell"
                      onClick={() => handleSort("status")}>
                      <div className="sort-header">
                        Status {getSortIcon("status")}
                      </div>
                    </div>
                    <div
                      className="table-cell"
                      onClick={() => handleSort("amountPaid")}>
                      <div className="sort-header">
                        Amount {getSortIcon("amountPaid")}
                      </div>
                    </div>
                    <div className="table-cell">Actions</div>
                  </div>
                </div>

                <div className="table-body">
                  {filteredApplications.map((app) => (
                    <div key={app.id} className="table-row">
                      <div className="table-cell">
                        <div className="applicant-info">
                          <div className="applicant-name">
                            {app.applicantName}
                          </div>
                          <div className="applicant-details">
                            <span className="applicant-email">
                              <FaEnvelope /> {app.applicantEmail}
                            </span>
                            <span className="applicant-phone">
                              <FaPhone /> {app.applicantPhone}
                            </span>
                          </div>
                          <div className="applicant-reference">
                            <FaPassport /> {app.reference}
                          </div>
                        </div>
                      </div>

                      <div className="table-cell">
                        <div className="destination-info">
                          <div className="destination-flag">
                            {countries.find((c) => c.id === app.destinationCode)
                              ?.flag || "🌍"}
                          </div>
                          <div className="destination-details">
                            <div className="destination-name">
                              {app.destination}
                            </div>
                            <div className="visa-type">
                              <span className="type-badge">{app.visaType}</span>
                              <span className="duration">
                                {app.duration} days
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="table-cell">
                        <div className="date-info">
                          <div className="date-item">
                            <span className="date-label">Applied:</span>
                            <span className="date-value">
                              {formatDate(app.applicationDate)}
                            </span>
                          </div>
                          <div className="date-item">
                            <span className="date-label">Departure:</span>
                            <span className="date-value">
                              {formatDate(app.departureDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="table-cell">
                        <div className="status-container">
                          {getStatusBadge(app.status)}
                          {getPaymentBadge(app.paymentStatus)}
                          {getPriorityBadge(app.priority)}
                        </div>
                      </div>

                      <div className="table-cell">
                        <div className="amount-info">
                          <div className="amount">
                            {formatCurrency(app.amountPaid, app.currency)}
                          </div>
                          <div className="payment-status">
                            {app.paymentStatus === "paid" ? (
                              <span className="payment-paid">Paid</span>
                            ) : app.paymentStatus === "pending" ? (
                              <span className="payment-pending">Pending</span>
                            ) : (
                              <span className="payment-refunded">Refunded</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="table-cell">
                        <div className="action-buttons">
                          <button
                            className="action-btn view-btn"
                            onClick={() => handleViewApplication(app)}
                            title="View Details">
                            <FaEye />
                          </button>
                          <button
                            className="action-btn email-btn"
                            onClick={() => handleSendEmail(app)}
                            title="Send Email">
                            <FaEnvelope />
                          </button>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleAssignOfficer(app.id)}
                            title="Assign Officer">
                            <FaEdit />
                          </button>
                          {app.status === "pending" && (
                            <button
                              className="action-btn process-btn"
                              onClick={() =>
                                handleUpdateStatus(app.id, "processing")
                              }
                              title="Start Processing">
                              <FaArrowRight />
                            </button>
                          )}
                          {app.status === "processing" && (
                            <>
                              <button
                                className="action-btn approve-btn"
                                onClick={() =>
                                  handleUpdateStatus(app.id, "approved")
                                }
                                title="Approve">
                                <FaCheckCircle />
                              </button>
                              <button
                                className="action-btn reject-btn"
                                onClick={() =>
                                  handleUpdateStatus(app.id, "rejected")
                                }
                                title="Reject">
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

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
                        <FaClock /> {country.processingTime}
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
                        className={`btn-toggle-status ${
                          country.isActive ? "deactivate" : "activate"
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
                        (c) => c.id === price.countryId
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
                        (app) => app.destinationCode === country.id
                      ).length;
                      const countryRevenue = applications
                        .filter(
                          (app) =>
                            app.destinationCode === country.id &&
                            app.paymentStatus === "paid"
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
                          {app.status === "approved" ? (
                            <FaCheckCircle style={{ color: colors.green }} />
                          ) : app.status === "rejected" ? (
                            <FaTimesCircle style={{ color: colors.red }} />
                          ) : (
                            <FaClock style={{ color: colors.orange }} />
                          )}
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
                            (c) => c.id === selectedApplication.destinationCode
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
                            "rejected"
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
    </div>
  );
};

export default AdminVisa;
