import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiMail,
  FiPhone,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi";
import styles from "./AllUsers.module.css";

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
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

const AllUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const usersPerPage = 10;

  // Load users + their activity from localStorage
  const loadData = () => {
    const users = read("users", []);
    const bookings = read("bookings", []);
    const transactions = read("transactions", []);
    const visaApplications = read("visaApplications", []);

    // Enrich each user with computed fields
    const enriched = users
      .filter((u) => u.role !== "admin" && !u.isAdmin) // hide admins from this list
      .map((u) => {
        const userBookings = bookings.filter((b) => b.userId === u.id);
        const userTxns = transactions.filter((t) => t.userId === u.id);
        const userVisas = visaApplications.filter((v) => v.userId === u.id);

        // Services this user has ever used
        const services = [];
        if (userTxns.length > 0) services.push("currency");
        if (userBookings.some((b) => b.type === "flight"))
          services.push("flight");
        if (userBookings.some((b) => ["hotel", "tour", "car"].includes(b.type)))
          services.push("travel");
        if (userVisas.length > 0) services.push("visa");

        const totalTransactions =
          userBookings.length + userTxns.length + userVisas.length;

        // Latest activity timestamp across everything
        const timestamps = [
          u.createdAt,
          u.joinDate,
          ...userBookings.map((b) => b.createdAt || b.bookingDate || b.date),
          ...userTxns.map((t) => t.createdAt || t.date),
          ...userVisas.map((v) => v.submittedAt),
        ]
          .filter(Boolean)
          .map((d) => new Date(d).getTime())
          .filter((n) => !Number.isNaN(n));

        const lastActive =
          timestamps.length ?
            new Date(Math.max(...timestamps)).toISOString()
          : u.createdAt || u.joinDate || null;

        // Status
        let status = u.status;
        if (!status) {
          status = "active";
          if (lastActive) {
            const days =
              (Date.now() - new Date(lastActive).getTime()) / 86400000;
            if (days > 30) status = "inactive";
            else if (days > 7) status = "pending";
          }
        }

        // VIP: 10+ transactions
        const type = totalTransactions >= 10 ? "vip" : "regular";

        return {
          id: u.id,
          name: u.fullName || u.email || "Unnamed User",
          email: u.email || "—",
          phone: u.phone || "—",
          country: u.nationality || u.country || "—",
          joinDate: u.joinDate || u.createdAt || null,
          lastActive,
          status,
          type,
          services,
          totalTransactions,
        };
      });

    setAllUsers(enriched);
  };

  useEffect(() => {
    loadData();
    const onStorage = (e) => {
      if (
        ["users", "bookings", "transactions", "visaApplications"].includes(
          e.key,
        )
      ) {
        loadData();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: allUsers.length,
      active: allUsers.filter((u) => u.status === "active").length,
      vip: allUsers.filter((u) => u.type === "vip").length,
      newToday: allUsers.filter((u) => {
        if (!u.joinDate) return false;
        return new Date(u.joinDate) >= today;
      }).length,
    };
  }, [allUsers]);

  // Filter
  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return allUsers.filter((user) => {
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allUsers, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage),
  );
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Handlers
  const handleManageUser = (userId, e) => {
    e?.stopPropagation();
    navigate(`/admin/manage-users/${userId}`);
  };

  const handleRowClick = (userId) => {
    navigate(`/admin/manage-users/${userId}`);
  };

  const handleSendEmail = (email, e) => {
    e.stopPropagation();
    if (!email || email === "—") return;
    window.location.href = `mailto:${email}`;
  };

  const handleCallUser = (phone, e) => {
    e.stopPropagation();
    if (!phone || phone === "—") return;
    window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
  };

  const handleDeleteUser = (userId, userName, e) => {
    e.stopPropagation();
    if (
      !window.confirm(
        `Delete user "${userName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    const remaining = read("users", []).filter((u) => u.id !== userId);
    localStorage.setItem("users", JSON.stringify(remaining));

    // Also clean up their data so nothing is orphaned
    const clean = (key) =>
      localStorage.setItem(
        key,
        JSON.stringify(read(key, []).filter((r) => r.userId !== userId)),
      );
    clean("bookings");
    clean("transactions");
    clean("visaApplications");

    loadData();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(allUsers, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", "users_export.json");
    link.click();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiUsers className={styles.titleIcon} />
            All Users
            <span className={styles.userCount}>{allUsers.length}</span>
          </h1>
          <p className={styles.subtitle}>
            Manage all platform users across all services
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.exportBtn} onClick={handleExport}>
            <FiDownload /> Export
          </button>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/admin/users/new")}>
            + Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUser />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiCheckCircle />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUser />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.vip}</div>
            <div className={styles.statLabel}>VIP Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUser />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.newToday}</div>
            <div className={styles.statLabel}>New Today</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.statusFilters}>
            {["all", "active", "pending", "inactive"].map((s) => (
              <button
                key={s}
                className={`${styles.statusBtn} ${
                  statusFilter === s ? styles.active : ""
                }`}
                onClick={() => setStatusFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button className={styles.clearBtn} onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Users ({filteredUsers.length})</h3>
          {filteredUsers.length > 0 && (
            <div className={styles.tableInfo}>
              Showing {indexOfFirstUser + 1} to{" "}
              {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length}
            </div>
          )}
        </div>

        {currentUsers.length === 0 ?
          <div className={styles.emptyState}>
            <FiUsers className={styles.emptyIcon} />
            <h3>No users found</h3>
            <p>
              {allUsers.length === 0 ?
                "No users have registered yet."
              : "Try adjusting your search or filters."}
            </p>
            {allUsers.length > 0 && (
              <button className={styles.clearBtn} onClick={handleClearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        : <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "200px" }}>User</th>
                  <th style={{ width: "150px" }}>Contact</th>
                  <th style={{ width: "100px" }}>Status</th>
                  <th style={{ width: "150px" }}>Services</th>
                  <th style={{ width: "120px" }}>Transactions</th>
                  <th style={{ width: "120px" }}>Last Active</th>
                  <th style={{ width: "180px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={styles.tableRow}
                    onClick={() => handleRowClick(user.id)}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userName}>
                          {user.name}
                          {user.type === "vip" && (
                            <span className={styles.vipBadge}>VIP</span>
                          )}
                        </div>
                        <div className={styles.userMeta}>
                          {user.country} • Joined {formatDate(user.joinDate)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactCell}>
                        <div className={styles.contactItem}>
                          <FiMail className={styles.contactIcon} />
                          <span className={styles.contactText}>
                            {user.email}
                          </span>
                        </div>
                        <div className={styles.contactItem}>
                          <FiPhone className={styles.contactIcon} />
                          <span className={styles.contactText}>
                            {user.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[user.status] || ""
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.servicesCell}>
                        <div className={styles.servicesList}>
                          {user.services.length === 0 ?
                            <span className={styles.moreBadge}>none</span>
                          : <>
                              {user.services.slice(0, 3).map((s, i) => (
                                <span key={i} className={styles.serviceBadge}>
                                  {s}
                                </span>
                              ))}
                              {user.services.length > 3 && (
                                <span className={styles.moreBadge}>
                                  +{user.services.length - 3}
                                </span>
                              )}
                            </>
                          }
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.transactionsCell}>
                        <span className={styles.transactionsCount}>
                          {user.totalTransactions}
                        </span>
                        <span className={styles.transactionsLabel}>total</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.lastActiveCell}>
                        {formatRelative(user.lastActive)}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.actionsCell}
                        onClick={(e) => e.stopPropagation()}>
                        <div className={styles.actionsRow}>
                          <button
                            className={styles.manageBtn}
                            onClick={(e) => handleManageUser(user.id, e)}>
                            <FiEye /> Manage
                          </button>
                        </div>
                        <div className={styles.actionsRow}>
                          <button
                            className={styles.actionBtn}
                            onClick={(e) => handleSendEmail(user.email, e)}
                            title="Send Email">
                            <FiMail />
                          </button>
                          <button
                            className={styles.actionBtn}
                            onClick={(e) => handleCallUser(user.phone, e)}
                            title="Call User">
                            <FiPhone />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={(e) =>
                              handleDeleteUser(user.id, user.name, e)
                            }
                            title="Delete User">
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}>
              Previous
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageBtn} ${
                      currentPage === pageNum ? styles.active : ""
                    }`}
                    onClick={() => setCurrentPage(pageNum)}>
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
