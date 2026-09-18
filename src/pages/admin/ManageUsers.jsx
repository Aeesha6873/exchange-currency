import React, { useState, useEffect, useMemo } from "react";
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

const formatDate = (iso) => {
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

const formatDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const formatRelative = (iso) => {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Math.max(0, Date.now() - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(iso);
};

const currencyFmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

/* ------------------------------------------------------------------ */
/*  Aggregation helpers — build a "user view model" from raw storage   */
/* ------------------------------------------------------------------ */

function buildUserView(user, { bookings, transactions, visaApplications }) {
  const userBookings = bookings.filter((b) => b.userId === user.id);
  const userTxns = transactions.filter((t) => t.userId === user.id);
  const userVisas = visaApplications.filter((v) => v.userId === user.id);

  // Service aggregates
  const currencyService = {
    name: "currency",
    icon: <FaExchangeAlt />,
    transactions: userTxns.length,
    totalAmount: userTxns.reduce((s, t) => s + (Number(t.amount) || 0), 0),
    lastUsed:
      userTxns
        .map((t) => t.createdAt || t.date)
        .filter(Boolean)
        .sort()
        .pop() || null,
    status: userTxns.length > 0 ? "active" : "inactive",
  };

  const flightBookings = userBookings.filter((b) => b.type === "flight");
  const flightService = {
    name: "flight",
    icon: <FaPlane />,
    transactions: flightBookings.length,
    totalAmount: flightBookings.reduce((s, b) => s + (Number(b.price) || 0), 0),
    lastUsed:
      flightBookings
        .map((b) => b.createdAt || b.bookingDate || b.date)
        .filter(Boolean)
        .sort()
        .pop() || null,
    status: flightBookings.length > 0 ? "active" : "inactive",
  };

  const travelBookings = userBookings.filter((b) =>
    ["hotel", "tour", "car"].includes(b.type),
  );
  const travelService = {
    name: "travel",
    icon: <FaHotel />,
    transactions: travelBookings.length,
    totalAmount: travelBookings.reduce((s, b) => s + (Number(b.price) || 0), 0),
    lastUsed:
      travelBookings
        .map((b) => b.createdAt || b.bookingDate || b.date)
        .filter(Boolean)
        .sort()
        .pop() || null,
    status: travelBookings.length > 0 ? "active" : "inactive",
  };

  const visaService = {
    name: "visa",
    icon: <FaPassport />,
    transactions: userVisas.length,
    totalAmount: userVisas.reduce((s, v) => s + (Number(v.amountPaid) || 0), 0),
    lastUsed:
      userVisas
        .map((v) => v.submittedAt)
        .filter(Boolean)
        .sort()
        .pop() || null,
    status: userVisas.length > 0 ? "active" : "inactive",
  };

  const services = [
    currencyService,
    flightService,
    travelService,
    visaService,
  ].filter((s) => s.transactions > 0);

  // Recent activity (merged, newest first)
  const activity = [
    ...userTxns.map((t) => ({
      id: `tx-${t.id}`,
      type: "currency_exchange",
      action: `Currency Exchange — ${t.fromCurrency} to ${t.toCurrency}`,
      date: t.createdAt || t.date,
      amount: Number(t.amount) || 0,
      status: t.status || "pending",
      reference: t.reference || t.id,
    })),
    ...userBookings.map((b) => ({
      id: `bk-${b.id}`,
      type:
        b.type === "flight" ? "flight_booking"
        : b.type === "hotel" ? "hotel_booking"
        : `${b.type}_booking`,
      action: `${b.type} — ${b.destination || "—"}`,
      date: b.createdAt || b.bookingDate || b.date,
      amount: Number(b.price) || 0,
      status: b.status || "pending",
      reference: b.reference || b.id,
    })),
    ...userVisas.map((v) => ({
      id: `v-${v.id}`,
      type: "visa_application",
      action: `Visa Application — ${v.countryName || "—"}`,
      date: v.submittedAt,
      amount: Number(v.amountPaid) || 0,
      status: v.status || "pending",
      reference: v.applicationId || v.id,
    })),
  ]
    .filter((a) => a.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20);

  // Documents (from user profile + visa passport uploads)
  const documents = [];
  if (user.passportNumber) {
    documents.push({
      id: "passport",
      type: "passport",
      name: "Passport",
      number: user.passportNumber,
      expiryDate: user.passportExpiry || "—",
      status: user.passportVerified ? "verified" : "pending_verification",
      uploadedDate: user.createdAt || user.joinDate,
      fileSize: "—",
    });
  }
  if (user.idNumber) {
    documents.push({
      id: "id_card",
      type: "id_card",
      name: "National ID Card",
      number: user.idNumber,
      expiryDate: user.idExpiry || "—",
      status: user.idVerified ? "verified" : "pending_verification",
      uploadedDate: user.createdAt || user.joinDate,
      fileSize: "—",
    });
  }
  // Visa passport uploads as docs
  userVisas.forEach((v, i) => {
    if (v.passportFile) {
      documents.push({
        id: `visa-passport-${v.id}`,
        type: "passport",
        name: `Visa Passport (${v.countryName || "—"})`,
        number: v.passportNumber || "—",
        expiryDate: "—",
        status: "verified",
        uploadedDate: v.submittedAt,
        fileSize: v.passportFile.size || "—",
      });
    }
  });

  // Statistics
  const totalSpent =
    currencyService.totalAmount +
    flightService.totalAmount +
    travelService.totalAmount +
    visaService.totalAmount;

  const totalTransactions =
    currencyService.transactions +
    flightService.transactions +
    travelService.transactions +
    visaService.transactions;

  const completedCount = [
    ...userTxns.map((t) => t.status),
    ...userBookings.map((b) => b.status),
    ...userVisas.map((v) => v.status),
  ].filter(
    (s) => s === "completed" || s === "confirmed" || s === "approved",
  ).length;

  const successRate =
    totalTransactions === 0 ? 0 : (
      Math.round((completedCount / totalTransactions) * 100)
    );

  const avgTransaction =
    totalTransactions === 0 ? 0 : Math.round(totalSpent / totalTransactions);

  // Last active = max timestamp across everything
  const allTimestamps = [
    user.createdAt,
    user.joinDate,
    ...userTxns.map((t) => t.createdAt || t.date),
    ...userBookings.map((b) => b.createdAt || b.bookingDate || b.date),
    ...userVisas.map((v) => v.submittedAt),
  ]
    .filter(Boolean)
    .map((d) => new Date(d).getTime())
    .filter((n) => !Number.isNaN(n));

  const lastActive =
    allTimestamps.length ?
      new Date(Math.max(...allTimestamps)).toISOString()
    : user.createdAt || user.joinDate || null;

  // Status — falls back to computed if user record has none
  let status = user.status;
  if (!status) {
    status = "active";
    if (lastActive) {
      const days = (Date.now() - new Date(lastActive).getTime()) / 86400000;
      if (days > 30) status = "inactive";
      else if (days > 7) status = "pending";
    }
  }

  const type = totalTransactions >= 10 ? "vip" : "regular";

  return {
    // Identity
    id: user.id,
    name: user.fullName || user.email || "Unnamed User",
    email: user.email || "—",
    phone: user.phone || "—",
    address: user.address || "—",
    country: user.nationality || user.country || "—",
    occupation: user.occupation || "—",
    dateOfBirth: user.dateOfBirth || "—",
    emergencyContact: user.emergencyContact || "—",
    idNumber: user.idNumber || "",
    passportNumber: user.passportNumber || "",
    joinDate: user.joinDate || user.createdAt || null,
    lastActive,
    status,
    type,

    // Aggregates
    services,
    recentActivity: activity,
    documents,
    statistics: {
      totalSpent,
      currencySpent: currencyService.totalAmount,
      flightSpent: flightService.totalAmount,
      travelSpent: travelService.totalAmount,
      visaSpent: visaService.totalAmount,
      successRate: `${successRate}%`,
      averageTransaction: avgTransaction,
      favoriteService:
        services.length > 0 ?
          services.reduce((best, s) =>
            s.transactions > best.transactions ? s : best,
          ).name
        : "—",
    },

    // Extra info for table view
    totalTransactions,
  };
}

/* ------------------------------------------------------------------ */

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

  const load = () => {
    const users = read("users", []);
    const bookings = read("bookings", []);
    const transactions = read("transactions", []);
    const visaApplications = read("visaApplications", []);

    const pool = { bookings, transactions, visaApplications };

    const enriched = users
      .filter((u) => u.role !== "admin" && !u.isAdmin)
      .map((u) => buildUserView(u, pool));

    setAllUsers(enriched);

    if (userId) {
      const match = enriched.find((u) => String(u.id) === String(userId));
      setUser(match || null);
      if (match) setEditedData({ ...match });
      setViewMode("single");
    } else {
      setUser(null);
      setViewMode("all");
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    load();

    const onStorage = (e) => {
      if (
        ["users", "bookings", "transactions", "visaApplications"].includes(
          e.key,
        )
      ) {
        load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  /* ---------- handlers ---------- */

  const handleBack = () => {
    if (viewMode === "single") navigate("/admin/manage-users");
    else navigate("/admin");
  };

  const handleManageUser = (id) => {
    navigate(`/admin/manage-users?userId=${id}`);
  };

  const handleViewAllUsers = () => navigate("/admin/all-users");

  const handleSave = () => {
    const users = read("users", []);
    const updated = users.map((u) =>
      String(u.id) === String(user.id) ?
        {
          ...u,
          fullName: editedData.name,
          email: editedData.email,
          phone: editedData.phone,
          address: editedData.address,
          nationality: editedData.country,
          occupation: editedData.occupation,
          dateOfBirth: editedData.dateOfBirth,
          emergencyContact: editedData.emergencyContact,
        }
      : u,
    );
    write("users", updated);
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
      !window.confirm(
        `Are you sure you want to ${
          newStatus === "active" ? "activate" : "deactivate"
        } this user?`,
      )
    ) {
      return;
    }

    const users = read("users", []);
    const updated = users.map((u) =>
      String(u.id) === String(user.id) ? { ...u, status: newStatus } : u,
    );
    write("users", updated);
    setUser((prev) => ({ ...prev, status: newStatus }));
    alert(
      `User ${
        newStatus === "active" ? "activated" : "deactivated"
      } successfully!`,
    );
  };

  const handleDeleteUser = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    const users = read("users", []);
    write(
      "users",
      users.filter((u) => String(u.id) !== String(user.id)),
    );

    const clean = (key) =>
      write(
        key,
        read(key, []).filter((r) => String(r.userId) !== String(user.id)),
      );
    clean("bookings");
    clean("transactions");
    clean("visaApplications");

    alert("User deleted successfully!");
    navigate("/admin/manage-users");
  };

  const handleResetPassword = () => {
    if (window.confirm(`Send password reset email to ${user.email}?`)) {
      alert(`Password reset email sent to ${user.email}.`);
    }
  };

  const handleVerifyDocument = (docId) => {
    if (!window.confirm("Mark this document as verified?")) return;
    // Nothing to write back unless we extend the user model. Just show feedback.
    alert("Document verified successfully!");
  };

  const handleViewDocument = (docId) => {
    const doc = user.documents.find((d) => d.id === docId);
    if (!doc) return;
    alert(
      `${doc.name}\nNumber: ${doc.number}\nExpiry: ${doc.expiryDate}\nStatus: ${doc.status}`,
    );
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiUser /> },
    { id: "services", label: "Services", icon: <FiPackage /> },
    { id: "activity", label: "Activity", icon: <FiActivity /> },
    { id: "documents", label: "Documents", icon: <FiCreditCard /> },
  ];

  /* ---------- derived: filtered users for grid ---------- */

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return allUsers.filter(
      (u) =>
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [allUsers, searchTerm]);

  const totals = useMemo(() => {
    return {
      total: allUsers.length,
      active: allUsers.filter((u) => u.status === "active").length,
      vip: allUsers.filter((u) => u.type === "vip").length,
      transactions: allUsers.reduce((s, u) => s + u.totalTransactions, 0),
    };
  }, [allUsers]);

  /* ---------- loading ---------- */

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

  /* ================================================================== */
  /*  SINGLE USER VIEW                                                   */
  /* ================================================================== */

  if (viewMode === "single" && user) {
    return (
      <div className={styles.manageUsers}>
        {/* Header */}
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

        {/* Tab content */}
        <div className={styles.tabContent}>
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className={styles.overviewContent}>
              <div className={styles.overviewGrid}>
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
                          value={editedData.name || ""}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={editedData.email || ""}
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
                          value={editedData.phone || ""}
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
                          value={editedData.address || ""}
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
                          <p>{user.occupation}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Date of Birth</label>
                          <p>{user.dateOfBirth}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Joined</label>
                          <p>{formatDate(user.joinDate)}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <label>Last Active</label>
                          <p>{formatRelative(user.lastActive)}</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div className={styles.statsSection}>
                  <div className={styles.statsCard}>
                    <h3>User Statistics</h3>
                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}>
                        <div className={styles.statIcon}>
                          <FiDollarSign />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            {currencyFmt(user.statistics.totalSpent)}
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
                            {user.statistics.successRate}
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
                            {user.services.length}
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
                            {currencyFmt(user.statistics.averageTransaction)}
                          </div>
                          <div className={styles.statLabel}>Avg. Txn</div>
                        </div>
                      </div>
                    </div>
                  </div>

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
                          navigate(`/admin/transactions?userId=${user.id}`)
                        }>
                        <FiActivity /> View Transactions
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() =>
                          navigate(`/admin/flight-bookings?userId=${user.id}`)
                        }>
                        <FiPackage /> View Bookings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SERVICES */}
          {activeTab === "services" && (
            <div className={styles.servicesContent}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3>Service Usage</h3>
                  <p>Services this user has used</p>
                </div>
                <button
                  className={styles.exportBtn}
                  onClick={() => {
                    const blob = new Blob(
                      [JSON.stringify(user.services, null, 2)],
                      { type: "application/json" },
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${user.name}-services.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>
                  <FiDownload /> Export
                </button>
              </div>

              {user.services.length === 0 ?
                <div className={styles.emptyState}>
                  <FiPackage className={styles.emptyIcon} />
                  <h3>No services used yet</h3>
                  <p>This user hasn't used any of your services.</p>
                </div>
              : <div className={styles.servicesGrid}>
                  {user.services.map((service) => (
                    <div key={service.name} className={styles.serviceCard}>
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
                          {service.icon}
                        </div>
                        <h4>
                          {service.name.charAt(0).toUpperCase() +
                            service.name.slice(1)}
                        </h4>
                      </div>

                      <div className={styles.serviceStats}>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>
                            {service.transactions}
                          </span>
                          <span className={styles.statLabel}>Transactions</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>
                            {currencyFmt(service.totalAmount)}
                          </span>
                          <span className={styles.statLabel}>Total Amount</span>
                        </div>
                      </div>

                      <div className={styles.serviceInfo}>
                        <div className={styles.infoRow}>
                          <span className={styles.label}>Status:</span>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[service.status]
                            }`}>
                            {service.status}
                          </span>
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.label}>Last Used:</span>
                          <span className={styles.value}>
                            {service.lastUsed ?
                              formatDate(service.lastUsed)
                            : "—"}
                          </span>
                        </div>
                      </div>

                      <button
                        className={styles.viewTransactionsBtn}
                        onClick={() =>
                          navigate(
                            `/admin/transactions?userId=${user.id}&service=${service.name}`,
                          )
                        }>
                        View All Transactions
                      </button>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}

          {/* ACTIVITY */}
          {activeTab === "activity" && (
            <div className={styles.activityContent}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3>Recent Activity</h3>
                  <p>Latest actions across all services</p>
                </div>
                <button
                  className={styles.exportBtn}
                  onClick={() => {
                    const blob = new Blob(
                      [JSON.stringify(user.recentActivity, null, 2)],
                      { type: "application/json" },
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${user.name}-activity.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>
                  <FiDownload /> Export
                </button>
              </div>

              {user.recentActivity.length === 0 ?
                <div className={styles.emptyState}>
                  <FiActivity className={styles.emptyIcon} />
                  <h3>No activity yet</h3>
                  <p>This user hasn't made any transactions.</p>
                </div>
              : <div className={styles.activityList}>
                  {user.recentActivity.map((activity) => (
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
                            {currencyFmt(activity.amount)}
                          </span>
                        </div>
                        <div className={styles.activityMeta}>
                          <span className={styles.activityDate}>
                            <FiCalendar /> {formatDateTime(activity.date)}
                          </span>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[activity.status]
                            }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === "documents" && (
            <div className={styles.documentsContent}>
              <div className={styles.sectionHeader}>
                <div>
                  <h3>User Documents</h3>
                  <p>Uploaded documents from profile and visa applications</p>
                </div>
              </div>

              {user.documents.length === 0 ?
                <div className={styles.emptyState}>
                  <FiCreditCard className={styles.emptyIcon} />
                  <h3>No documents on file</h3>
                  <p>This user hasn't uploaded any documents yet.</p>
                </div>
              : <div className={styles.documentsGrid}>
                  {user.documents.map((document) => (
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
                            {formatDate(document.uploadedDate)}
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
                          className={`${styles.statusBadge} ${
                            styles[document.status]
                          }`}>
                          {document.status.replace(/_/g, " ")}
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
                          {document.status === "verified" ?
                            "Verified"
                          : "Verify"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================================================================== */
  /*  ALL USERS VIEW                                                     */
  /* ================================================================== */

  return (
    <div className={styles.manageUsers}>
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
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUsers />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totals.total}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiCheckCircle />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totals.active}</div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiShield />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totals.vip}</div>
            <div className={styles.statLabel}>VIP Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiActivity />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{totals.transactions}</div>
            <div className={styles.statLabel}>Total Transactions</div>
          </div>
        </div>
      </div>

      {/* Search */}
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
            onClick={() => setSearchTerm("")}>
            Clear Search
          </button>
        </div>
      </div>

      {/* Users grid */}
      <div className={styles.usersManagement}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>User Management</h3>
            <p className={styles.sectionDescription}>
              Click on any user card to manage their account, view details, or
              perform actions.
            </p>
          </div>
        </div>

        {filteredUsers.length === 0 ?
          <div className={styles.emptyState}>
            <FiUsers className={styles.emptyIcon} />
            <h3>{allUsers.length === 0 ? "No users yet" : "No users found"}</h3>
            <p>
              {allUsers.length === 0 ?
                "No users have registered on the platform yet."
              : "Try adjusting your search."}
            </p>
          </div>
        : <div className={styles.usersGrid}>
            {filteredUsers.map((u) => (
              <div key={u.id} className={styles.userCard}>
                <div className={styles.userCardHeader}>
                  <div className={styles.userAvatar}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.userCardInfo}>
                    <h4>{u.name}</h4>
                    <p className={styles.userCardEmail}>{u.email}</p>
                    <div className={styles.userCardMeta}>
                      <span
                        className={`${styles.statusBadge} ${styles[u.status]}`}>
                        {u.status}
                      </span>
                      {u.type === "vip" && (
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
                    <span>{u.phone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiGlobe className={styles.detailIcon} />
                    <span>{u.country}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiCalendar className={styles.detailIcon} />
                    <span>Joined {formatDate(u.joinDate)}</span>
                  </div>
                </div>

                <div className={styles.userCardServices}>
                  <div className={styles.servicesLabel}>Services Used:</div>
                  <div className={styles.servicesList}>
                    {u.services.length === 0 ?
                      <span className={styles.serviceBadge}>none yet</span>
                    : u.services.map((service) => (
                        <span
                          key={service.name}
                          className={styles.serviceBadge}>
                          {service.icon}
                          {service.name}
                        </span>
                      ))
                    }
                  </div>
                </div>

                <div className={styles.userCardStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {u.totalTransactions}
                    </span>
                    <span className={styles.statLabel}>Transactions</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {formatRelative(u.lastActive)}
                    </span>
                    <span className={styles.statLabel}>Last Active</span>
                  </div>
                </div>

                <div className={styles.userCardActions}>
                  <button
                    className={styles.primaryAction}
                    onClick={() => handleManageUser(u.id)}>
                    <FiUser /> Manage User
                  </button>
                  <div className={styles.secondaryActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        (window.location.href = `mailto:${u.email}`)
                      }
                      title="Send Email">
                      <FiMail />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        u.phone !== "—" &&
                        (window.location.href = `tel:${u.phone}`)
                      }
                      title="Call User">
                      <FiPhone />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() =>
                        navigate(`/admin/transactions?userId=${u.id}`)
                      }
                      title="View Transactions">
                      <FiActivity />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default ManagerUsers;
