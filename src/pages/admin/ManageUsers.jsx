import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiUser,
  FiUsers,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiSave,
  FiLock,
  FiCreditCard,
  FiPackage,
  FiActivity,
  FiArrowLeft,
  FiGlobe,
  FiSearch,
  FiFilter,
  FiEye,
  FiDownload,
  FiKey,
  FiDollarSign,
  FiShield,
} from "react-icons/fi";
import { FaExchangeAlt, FaPlane, FaHotel, FaPassport } from "react-icons/fa";
import styles from "./ManageUsers.module.css";

const ManagerUsers = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");

  const [viewMode, setViewMode] = useState(userId ? "single" : "all");
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample all users data
  const allUsersData = [
    {
      id: 1,
      name: "John Smith",
      email: "john@travel.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      services: ["currency", "flight", "travel", "visa"],
      totalTransactions: 28,
      joinDate: "2023-01-15",
      lastActive: "2 hours ago",
      type: "vip",
      country: "United States",
      address: "123 Main St, New York, NY 10001",
      occupation: "Business Executive",
    },
    {
      id: 2,
      name: "Emma Johnson",
      email: "emma@travel.com",
      phone: "+44 20 1234 5678",
      status: "active",
      services: ["flight", "travel", "visa"],
      totalTransactions: 15,
      joinDate: "2023-03-10",
      lastActive: "1 day ago",
      type: "regular",
      country: "United Kingdom",
      address: "456 Oxford St, London, UK",
      occupation: "Marketing Manager",
    },
    {
      id: 3,
      name: "David Chen",
      email: "david@travel.com",
      phone: "+86 10 1234 5678",
      status: "pending",
      services: ["currency", "flight"],
      totalTransactions: 8,
      joinDate: "2024-01-05",
      lastActive: "1 week ago",
      type: "regular",
      country: "China",
      address: "789 Wangfujing St, Beijing",
      occupation: "Software Engineer",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@travel.com",
      phone: "+61 2 1234 5678",
      status: "inactive",
      services: ["currency", "travel"],
      totalTransactions: 5,
      joinDate: "2023-11-20",
      lastActive: "1 month ago",
      type: "regular",
      country: "Australia",
      address: "101 George St, Sydney",
      occupation: "Doctor",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@travel.com",
      phone: "+1 (555) 987-6543",
      status: "active",
      services: ["currency", "flight", "travel", "visa"],
      totalTransactions: 42,
      joinDate: "2022-08-15",
      lastActive: "Today",
      type: "vip",
      country: "Canada",
      address: "222 Bay St, Toronto",
      occupation: "Investment Banker",
    },
    {
      id: 6,
      name: "Lisa Garcia",
      email: "lisa@travel.com",
      phone: "+34 91 123 4567",
      status: "active",
      services: ["flight", "travel"],
      totalTransactions: 12,
      joinDate: "2023-06-25",
      lastActive: "3 days ago",
      type: "regular",
      country: "Spain",
      address: "333 Gran Via, Madrid",
      occupation: "Architect",
    },
  ];

  // Complete single user data with all properties
  const sampleUsers = {
    1: {
      id: 1,
      name: "John Smith",
      email: "john@travel.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      joinDate: "2023-01-15",
      type: "vip",
      country: "United States",
      address: "123 Main St, New York, NY 10001",
      idNumber: "ABC123456",
      passportNumber: "P12345678",
      dateOfBirth: "1985-06-15",
      occupation: "Business Executive",
      emergencyContact: "+1 (555) 987-6543",

      // Services with full details
      services: [
        {
          name: "currency",
          icon: <FaExchangeAlt />,
          transactions: 12,
          totalAmount: 1850,
          lastUsed: "2024-01-15",
          status: "active",
        },
        {
          name: "flight",
          icon: <FaPlane />,
          transactions: 8,
          totalAmount: 1600,
          lastUsed: "2024-01-14",
          status: "active",
        },
        {
          name: "travel",
          icon: <FaHotel />,
          transactions: 5,
          totalAmount: 1200,
          lastUsed: "2024-01-10",
          status: "active",
        },
        {
          name: "visa",
          icon: <FaPassport />,
          transactions: 3,
          totalAmount: 200,
          lastUsed: "2023-12-20",
          status: "completed",
        },
      ],

      // Recent Activity
      recentActivity: [
        {
          id: 1,
          type: "flight_booking",
          action: "Flight Booking - NYC to LON",
          date: "2024-01-15 14:30",
          amount: 500,
          status: "confirmed",
          reference: "FB-2024-001",
        },
        {
          id: 2,
          type: "currency_exchange",
          action: "Currency Exchange - USD to EUR",
          date: "2024-01-14 10:15",
          amount: 300,
          status: "completed",
          reference: "CE-2024-002",
        },
        {
          id: 3,
          type: "hotel_booking",
          action: "Hotel Booking - Hilton London",
          date: "2024-01-10 16:45",
          amount: 400,
          status: "confirmed",
          reference: "HB-2024-003",
        },
        {
          id: 4,
          type: "visa_application",
          action: "Visa Application - UK Tourist Visa",
          date: "2023-12-20 09:20",
          amount: 200,
          status: "approved",
          reference: "VA-2023-004",
        },
      ],

      // Documents
      documents: [
        {
          id: 1,
          type: "id_card",
          name: "National ID Card",
          number: "ABC123456",
          expiryDate: "2028-06-15",
          status: "verified",
          uploadedDate: "2023-02-10",
          fileSize: "2.4 MB",
        },
        {
          id: 2,
          type: "passport",
          name: "Passport",
          number: "P12345678",
          expiryDate: "2030-12-31",
          status: "verified",
          uploadedDate: "2023-02-12",
          fileSize: "3.1 MB",
        },
        {
          id: 3,
          type: "driving_license",
          name: "Driving License",
          number: "DL78901234",
          expiryDate: "2027-08-20",
          status: "pending_verification",
          uploadedDate: "2024-01-05",
          fileSize: "1.8 MB",
        },
      ],

      // Statistics
      statistics: {
        totalSpent: 4850,
        currencySpent: 1850,
        flightSpent: 1600,
        travelSpent: 1200,
        visaSpent: 200,
        successRate: "98%",
        averageTransaction: 173,
        favoriteService: "Currency Exchange",
      },

      // Preferences
      preferences: {
        notifications: true,
        twoFactorAuth: true,
        marketingEmails: false,
        autoCurrencyConversion: true,
        preferredCurrency: "USD",
        language: "English",
      },
    },
  };

  useEffect(() => {
    if (userId) {
      // Single user view
      setViewMode("single");
      setTimeout(() => {
        const userData = sampleUsers[userId];
        if (userData) {
          setUser(userData);
          setEditedData({ ...userData });
        }
        setLoading(false);
      }, 300);
    } else {
      // All users view
      setViewMode("all");
      setAllUsers(allUsersData);
      setLoading(false);
    }
  }, [userId]);

  const handleBack = () => {
    if (viewMode === "single") {
      navigate("/admin/manage-users");
    } else {
      navigate("/admin");
    }
  };

  const handleManageUser = (userId) => {
    navigate(`/admin/manage-users?userId=${userId}`);
  };

  const handleViewAllUsers = () => {
    navigate("/admin/all-users");
  };

  // Single user functions
  const handleSave = () => {
    setUser(editedData);
    setIsEditing(false);
    alert("User profile updated successfully!");
  };

  const handleCancel = () => {
    setEditedData({ ...user });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleStatus = () => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    if (
      window.confirm(
        `Are you sure you want to ${
          newStatus === "active" ? "activate" : "deactivate"
        } this user?`,
      )
    ) {
      setUser((prev) => ({ ...prev, status: newStatus }));
      alert(
        `User ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully!`,
      );
    }
  };

  const handleDeleteUser = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      navigate("/admin/manage-users");
      alert("User deleted successfully!");
    }
  };

  const handleResetPassword = () => {
    if (window.confirm("Send password reset email to user?")) {
      alert("Password reset email sent!");
    }
  };

  const handleVerifyDocument = (docId) => {
    const doc = user.documents.find((d) => d.id === docId);
    if (doc) {
      if (window.confirm(`Verify ${doc.name}?`)) {
        const updatedDocs = user.documents.map((d) =>
          d.id === docId ? { ...d, status: "verified" } : d,
        );
        setUser((prev) => ({ ...prev, documents: updatedDocs }));
        alert(`${doc.name} verified successfully!`);
      }
    }
  };

  const handleViewDocument = (docId) => {
    const doc = user.documents.find((d) => d.id === docId);
    if (doc) {
      alert(
        `Viewing ${doc.name} (${doc.number})\nExpires: ${doc.expiryDate}\nStatus: ${doc.status}`,
      );
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiUser /> },
    { id: "services", label: "Services", icon: <FiPackage /> },
    { id: "activity", label: "Activity", icon: <FiActivity /> },
    { id: "documents", label: "Documents", icon: <FiCreditCard /> },
  ];

  if (loading) {
    return (
      <div className={styles.manageUsers}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (viewMode === "single" && user) {
    return (
      <div className={styles.manageUsers}>
        {/* Single User View Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={handleBack}>
              <FiArrowLeft /> Back to All Users
            </button>
            <h1 className={styles.title}>
              <FiUser className={styles.titleIcon} />
              Manage User
            </h1>
            <div className={styles.userInfoHeader}>
              <span className={styles.userName}>{user.name}</span>
              <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
              {user.type === "vip" && (
                <span className={styles.vipBadge}>
                  <FiShield /> VIP
                </span>
              )}
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={`${styles.statusToggleBtn} ${
                user.status === "active" ? styles.deactivate : styles.activate
              }`}
              onClick={handleToggleStatus}>
              {user.status === "active" ?
                <FiXCircle />
              : <FiCheckCircle />}
              {user.status === "active" ? "Deactivate" : "Activate"}
            </button>
            <button className={styles.deleteBtn} onClick={handleDeleteUser}>
              <FiTrash2 />
              Delete User
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === "overview" && (
            <div className={styles.overviewContent}>
              <div className={styles.overviewGrid}>
                {/* Left Column - Profile */}
                <div className={styles.profileSection}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3>Profile Information</h3>
                      <p>View and edit user profile details</p>
                    </div>
                    {!isEditing && (
                      <button
                        className={styles.editBtn}
                        onClick={() => setIsEditing(true)}>
                        <FiEdit2 /> Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditing ?
                    <div className={styles.editForm}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={editedData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={editedData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={editedData.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Address</label>
                        <input
                          type="text"
                          value={editedData.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formActions}>
                        <button className={styles.saveBtn} onClick={handleSave}>
                          <FiSave /> Save Changes
                        </button>
                        <button
                          className={styles.cancelBtn}
                          onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  : <div className={styles.infoCard}>
                      <div className={styles.infoHeader}>
                        <FiUser className={styles.infoIcon} />
                        <h4>Personal Information</h4>
                      </div>
                      <div className={styles.infoBody}>
                        <div className={styles.infoRow}>
                          <label>Full Name</label>
                          <p>{user.name}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Email</label>
                          <p>{user.email}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Phone</label>
                          <p>{user.phone}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Address</label>
                          <p>{user.address}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Country</label>
                          <p>{user.country}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Occupation</label>
                          <p>{user.occupation || "Not specified"}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Date of Birth</label>
                          <p>{user.dateOfBirth || "Not specified"}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Emergency Contact</label>
                          <p>{user.emergencyContact || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                {/* Right Column - Stats & Actions */}
                <div className={styles.statsSection}>
                  {/* User Stats */}
                  <div className={styles.statsCard}>
                    <h3>User Statistics</h3>
                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}>
                        <div className={styles.statIcon}>
                          <FiDollarSign />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            $
                            {user.statistics?.totalSpent?.toLocaleString() ||
                              "0"}
                          </div>
                          <div className={styles.statLabel}>Total Spent</div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statIcon}>
                          <FiCheckCircle />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            {user.statistics?.successRate || "95%"}
                          </div>
                          <div className={styles.statLabel}>Success Rate</div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statIcon}>
                          <FiPackage />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            {user.services?.length || 0}
                          </div>
                          <div className={styles.statLabel}>Services Used</div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statIcon}>
                          <FiActivity />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            ${user.statistics?.averageTransaction || "173"}
                          </div>
                          <div className={styles.statLabel}>
                            Avg. Transaction
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className={styles.quickActionsCard}>
                    <h3>Quick Actions</h3>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionBtn}
                        onClick={handleResetPassword}>
                        <FiLock /> Reset Password
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() =>
                          (window.location.href = `mailto:${user.email}`)
                        }>
                        <FiMail /> Send Email
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() =>
                          navigate(`/admin/transactions?userId=${userId}`)
                        }>
                        <FiActivity /> View Transactions
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() =>
                          navigate(`/admin/bookings?userId=${userId}`)
                        }>
                        <FiPackage /> View Bookings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className={styles.servicesContent}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3>Service Usage</h3>
                  <p>View and manage user's service activities</p>
                </div>
                <button
                  className={styles.exportBtn}
                  onClick={() => alert("Export service data")}>
                  <FiDownload /> Export
                </button>
              </div>

              <div className={styles.servicesGrid}>
                {user.services?.map((service, index) => (
                  <div key={index} className={styles.serviceCard}>
                    <div className={styles.serviceHeader}>
                      <div
                        className={styles.serviceIcon}
                        style={{
                          background:
                            service.name === "currency" ?
                              "rgba(59, 130, 246, 0.1)"
                            : service.name === "flight" ?
                              "rgba(139, 92, 246, 0.1)"
                            : service.name === "travel" ?
                              "rgba(16, 185, 129, 0.1)"
                            : "rgba(245, 158, 11, 0.1)",
                          color:
                            service.name === "currency" ? "#3b82f6"
                            : service.name === "flight" ? "#8b5cf6"
                            : service.name === "travel" ? "#10b981"
                            : "#f59e0b",
                        }}>
                        {service.name === "currency" ?
                          <FaExchangeAlt />
                        : service.name === "flight" ?
                          <FaPlane />
                        : service.name === "travel" ?
                          <FaHotel />
                        : <FaPassport />}
                      </div>
                      <h4>
                        {service.name.charAt(0).toUpperCase() +
                          service.name.slice(1)}
                      </h4>
                    </div>

                    <div className={styles.serviceStats}>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>
                          {service.transactions || 0}
                        </span>
                        <span className={styles.statLabel}>Transactions</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>
                          ${service.totalAmount?.toLocaleString() || "0"}
                        </span>
                        <span className={styles.statLabel}>Total Amount</span>
                      </div>
                    </div>

                    <div className={styles.serviceInfo}>
                      <div className={styles.infoRow}>
                        <span className={styles.label}>Status:</span>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[service.status || "active"]
                          }`}>
                          {service.status || "Active"}
                        </span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.label}>Last Used:</span>
                        <span className={styles.value}>
                          {service.lastUsed || "N/A"}
                        </span>
                      </div>
                    </div>

                    <button
                      className={styles.viewTransactionsBtn}
                      onClick={() =>
                        navigate(
                          `/admin/transactions?userId=${userId}&service=${service.name}`,
                        )
                      }>
                      View All Transactions
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className={styles.activityContent}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3>Recent Activity</h3>
                  <p>Track user's recent actions and transactions</p>
                </div>
                <button
                  className={styles.exportBtn}
                  onClick={() => alert("Export activity data")}>
                  <FiDownload /> Export
                </button>
              </div>

              <div className={styles.activityList}>
                {user.recentActivity?.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {activity.type === "flight_booking" ?
                        <FaPlane />
                      : activity.type === "currency_exchange" ?
                        <FaExchangeAlt />
                      : activity.type === "hotel_booking" ?
                        <FaHotel />
                      : <FaPassport />}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityHeader}>
                        <div>
                          <span className={styles.activityAction}>
                            {activity.action}
                          </span>
                          <span className={styles.activityReference}>
                            Ref: {activity.reference}
                          </span>
                        </div>
                        <span className={styles.activityAmount}>
                          ${activity.amount}
                        </span>
                      </div>
                      <div className={styles.activityMeta}>
                        <span className={styles.activityDate}>
                          <FiCalendar /> {activity.date}
                        </span>
                        <span
                          className={`${styles.statusBadge} ${styles[activity.status]}`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                    <button
                      className={styles.viewDetailsBtn}
                      onClick={() =>
                        navigate(
                          `/admin/transactions?reference=${activity.reference}`,
                        )
                      }>
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className={styles.documentsContent}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3>User Documents</h3>
                  <p>Manage user's uploaded documents and verifications</p>
                </div>
                <button
                  className={styles.exportBtn}
                  onClick={() => alert("Export documents list")}>
                  <FiDownload /> Export
                </button>
              </div>

              <div className={styles.documentsGrid}>
                {user.documents?.map((document) => (
                  <div key={document.id} className={styles.documentCard}>
                    <div className={styles.documentHeader}>
                      <div className={styles.documentIcon}>
                        {document.type === "passport" ?
                          <FiCreditCard />
                        : document.type === "id_card" ?
                          <FiCreditCard />
                        : <FiKey />}
                      </div>
                      <div>
                        <h4>{document.name}</h4>
                        <p className={styles.documentNumber}>
                          Number: {document.number}
                        </p>
                      </div>
                    </div>

                    <div className={styles.documentDetails}>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Expiry Date:</span>
                        <span className={styles.value}>
                          {document.expiryDate}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Uploaded:</span>
                        <span className={styles.value}>
                          {document.uploadedDate}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>File Size:</span>
                        <span className={styles.value}>
                          {document.fileSize}
                        </span>
                      </div>
                    </div>

                    <div className={styles.documentStatus}>
                      <span
                        className={`${styles.statusBadge} ${styles[document.status]}`}>
                        {document.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className={styles.documentActions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => handleViewDocument(document.id)}>
                        <FiEye /> View
                      </button>
                      <button
                        className={styles.verifyBtn}
                        onClick={() => handleVerifyDocument(document.id)}
                        disabled={document.status === "verified"}>
                        <FiCheckCircle />
                        {document.status === "verified" ? "Verified" : "Verify"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // All Users View (when clicking from sidebar)
  return (
    <div className={styles.manageUsers}>
      {/* All Users View Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiUsers className={styles.titleIcon} />
            Manage Users
          </h1>
          <p className={styles.subtitle}>
            Manage all users or select a specific user to manage
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.viewAllBtn} onClick={handleViewAllUsers}>
            <FiEye /> View All Users Table
          </button>
          <button
            className={styles.addUserBtn}
            onClick={() => navigate("/admin/users/new")}>
            <FiUser /> Add New User
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUsers />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{allUsers.length}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiCheckCircle />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {allUsers.filter((u) => u.status === "active").length}
            </div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiShield />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {allUsers.filter((u) => u.type === "vip").length}
            </div>
            <div className={styles.statLabel}>VIP Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiActivity />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {allUsers.reduce((sum, user) => sum + user.totalTransactions, 0)}
            </div>
            <div className={styles.statLabel}>Total Transactions</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterOptions}>
          <button
            className={styles.filterBtn}
            onClick={() => alert("Filter by status")}>
            <FiFilter /> Status
          </button>
          <button
            className={styles.filterBtn}
            onClick={() => alert("Filter by service")}>
            <FiFilter /> Service
          </button>
          <button
            className={styles.filterBtn}
            onClick={() => setSearchTerm("")}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Management Grid */}
      <div className={styles.usersManagement}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>User Management</h3>
          <p className={styles.sectionDescription}>
            Click on any user card to manage their account, view details, or
            perform actions.
          </p>
        </div>

        <div className={styles.usersGrid}>
          {allUsers
            .filter(
              (user) =>
                searchTerm === "" ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((user) => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userCardHeader}>
                  <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
                  <div className={styles.userCardInfo}>
                    <h4>{user.name}</h4>
                    <p className={styles.userCardEmail}>{user.email}</p>
                    <div className={styles.userCardMeta}>
                      <span
                        className={`${styles.statusBadge} ${styles[user.status]}`}>
                        {user.status}
                      </span>
                      {user.type === "vip" && (
                        <span className={styles.vipBadge}>
                          <FiShield /> VIP
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.userCardDetails}>
                  <div className={styles.detailItem}>
                    <FiPhone className={styles.detailIcon} />
                    <span>{user.phone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiGlobe className={styles.detailIcon} />
                    <span>{user.country}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiCalendar className={styles.detailIcon} />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>

                <div className={styles.userCardServices}>
                  <div className={styles.servicesLabel}>Services Used:</div>
                  <div className={styles.servicesList}>
                    {user.services.map((service, index) => (
                      <span key={index} className={styles.serviceBadge}>
                        {service === "currency" ?
                          <FaExchangeAlt />
                        : service === "flight" ?
                          <FaPlane />
                        : service === "travel" ?
                          <FaHotel />
                        : <FaPassport />}
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.userCardStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {user.totalTransactions}
                    </span>
                    <span className={styles.statLabel}>Transactions</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{user.lastActive}</span>
                    <span className={styles.statLabel}>Last Active</span>
                  </div>
                </div>

                <div className={styles.userCardActions}>
                  <button
                    className={styles.primaryAction}
                    onClick={() => handleManageUser(user.id)}>
                    <FiUser /> Manage User
                  </button>
                  <div className={styles.secondaryActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        (window.location.href = `mailto:${user.email}`)
                      }
                      title="Send Email">
                      <FiMail />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        (window.location.href = `tel:${user.phone}`)
                      }
                      title="Call User">
                      <FiPhone />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        navigate(`/admin/transactions?userId=${user.id}`)
                      }
                      title="View Transactions">
                      <FiActivity />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {allUsers.filter(
          (user) =>
            searchTerm === "" ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        ).length === 0 && (
          <div className={styles.emptyState}>
            <FiUsers className={styles.emptyIcon} />
            <h3>No users found</h3>
            <p>Try adjusting your search or add a new user</p>
            <button
              className={styles.addUserBtn}
              onClick={() => navigate("/admin/users/new")}>
              <FiUser /> Add New User
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div className={styles.bulkActions}>
        <h3>Bulk Actions</h3>
        <div className={styles.bulkActionButtons}>
          <button
            className={styles.bulkActionBtn}
            onClick={() => alert("Send bulk email")}>
            <FiMail /> Send Email to All
          </button>
          <button
            className={styles.bulkActionBtn}
            onClick={() => alert("Export all users")}>
            <FiDownload /> Export All Users
          </button>
          <button
            className={styles.bulkActionBtn}
            onClick={() => alert("Generate report")}>
            <FiActivity /> Generate Report
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <h3>Quick Links</h3>
        <div className={styles.linksGrid}>
          <button
            className={styles.linkCard}
            onClick={() => navigate("/admin/all-users")}>
            <FiEye className={styles.linkIcon} />
            <span className={styles.linkTitle}>View All Users Table</span>
            <span className={styles.linkDescription}>
              Detailed table view with filtering
            </span>
          </button>
          <button
            className={styles.linkCard}
            onClick={() => navigate("/admin/users/new")}>
            <FiUser className={styles.linkIcon} />
            <span className={styles.linkTitle}>Add New User</span>
            <span className={styles.linkDescription}>
              Create a new user account
            </span>
          </button>
          <button
            className={styles.linkCard}
            onClick={() => navigate("/admin/transactions")}>
            <FiActivity className={styles.linkIcon} />
            <span className={styles.linkTitle}>View All Transactions</span>
            <span className={styles.linkDescription}>
              All user transactions
            </span>
          </button>
          <button
            className={styles.linkCard}
            onClick={() => navigate("/admin/manage-users?userId=1")}>
            <FiShield className={styles.linkIcon} />
            <span className={styles.linkTitle}>Manage VIP Users</span>
            <span className={styles.linkDescription}>
              Special management for VIPs
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerUsers;
