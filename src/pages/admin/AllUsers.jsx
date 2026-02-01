import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiFilter,
  FiMail,
  FiPhone,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi";
import styles from "./AllUsers.module.css";

const AllUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const users = [
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
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@travel.com",
      phone: "+44 7911 123456",
      status: "active",
      services: ["currency", "travel", "visa"],
      totalTransactions: 15,
      joinDate: "2023-02-20",
      lastActive: "Today",
      type: "regular",
      country: "United Kingdom",
    },
    {
      id: 3,
      name: "David Chen",
      email: "david@flight.com",
      phone: "+86 138 0013 8000",
      status: "pending",
      services: ["flight", "visa"],
      totalTransactions: 4,
      joinDate: "2023-03-10",
      lastActive: "Yesterday",
      type: "regular",
      country: "China",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah@travel.com",
      phone: "+1 (555) 987-6543",
      status: "active",
      services: ["flight", "travel", "visa"],
      totalTransactions: 12,
      joinDate: "2023-01-05",
      lastActive: "Today",
      type: "vip",
      country: "Canada",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@exchange.com",
      phone: "+61 412 345 678",
      status: "inactive",
      services: ["currency", "visa"],
      totalTransactions: 5,
      joinDate: "2023-02-28",
      lastActive: "1 week ago",
      type: "regular",
      country: "Australia",
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa@travel.com",
      phone: "+65 8123 4567",
      status: "active",
      services: ["currency", "flight", "travel", "visa"],
      totalTransactions: 48,
      joinDate: "2022-12-01",
      lastActive: "Today",
      type: "vip",
      country: "Singapore",
    },
    {
      id: 7,
      name: "Robert Kim",
      email: "robert@visa.com",
      phone: "+82 10-1234-5678",
      status: "active",
      services: ["visa"],
      totalTransactions: 2,
      joinDate: "2023-04-15",
      lastActive: "Today",
      type: "regular",
      country: "South Korea",
    },
    {
      id: 8,
      name: "Maria Garcia",
      email: "maria@travel.com",
      phone: "+34 612 345 678",
      status: "active",
      services: ["travel", "visa"],
      totalTransactions: 8,
      joinDate: "2023-03-25",
      lastActive: "Today",
      type: "regular",
      country: "Spain",
    },
    {
      id: 9,
      name: "Ahmed Hassan",
      email: "ahmed@exchange.com",
      phone: "+971 50 123 4567",
      status: "pending",
      services: ["currency", "flight"],
      totalTransactions: 6,
      joinDate: "2023-05-10",
      lastActive: "3 days ago",
      type: "regular",
      country: "UAE",
    },
    {
      id: 10,
      name: "Sophie Martin",
      email: "sophie@flight.com",
      phone: "+33 6 12 34 56 78",
      status: "active",
      services: ["currency", "flight", "travel", "visa"],
      totalTransactions: 25,
      joinDate: "2023-01-30",
      lastActive: "Today",
      type: "vip",
      country: "France",
    },
  ];

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    vip: users.filter((u) => u.type === "vip").length,
    newToday: 3,
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Action handlers
  const handleManageUser = (userId, e) => {
    e.stopPropagation();
    console.log("Managing user ID:", userId);
    navigate(`/admin/manage-users/${userId}`);
  };

  const handleViewDetails = (userId) => {
    navigate(`/admin/manage-users/${userId}`);
  };

  const handleSendEmail = (email, e) => {
    e.stopPropagation();
    window.location.href = `mailto:${email}`;
  };

  const handleCallUser = (phone, e) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleDeleteUser = (userId, userName, e) => {
    e.stopPropagation();
    if (
      window.confirm(`Delete user "${userName}"? This action cannot be undone.`)
    ) {
      console.log(`Deleting user ${userId}`);
      // API call here
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(users, null, 2);
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

  // Make table row clickable for quick view
  const handleRowClick = (userId) => {
    navigate(`/admin/manage-users/${userId}`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiUsers className={styles.titleIcon} />
            All Users
            <span className={styles.userCount}>{users.length}</span>
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

      {/* Stats Cards */}
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
            <button
              className={`${styles.statusBtn} ${statusFilter === "all" ? styles.active : ""}`}
              onClick={() => setStatusFilter("all")}>
              All
            </button>
            <button
              className={`${styles.statusBtn} ${statusFilter === "active" ? styles.active : ""}`}
              onClick={() => setStatusFilter("active")}>
              Active
            </button>
            <button
              className={`${styles.statusBtn} ${statusFilter === "pending" ? styles.active : ""}`}
              onClick={() => setStatusFilter("pending")}>
              Pending
            </button>
            <button
              className={`${styles.statusBtn} ${statusFilter === "inactive" ? styles.active : ""}`}
              onClick={() => setStatusFilter("inactive")}>
              Inactive
            </button>
          </div>
        </div>

        <button className={styles.clearBtn} onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Users Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Users ({filteredUsers.length})</h3>
          <div className={styles.tableInfo}>
            Showing {indexOfFirstUser + 1} to{" "}
            {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length}
          </div>
        </div>

        <div className={styles.tableWrapper}>
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
                        {user.country} • Joined {user.joinDate}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.contactCell}>
                      <div className={styles.contactItem}>
                        <FiMail className={styles.contactIcon} />
                        <span className={styles.contactText}>{user.email}</span>
                      </div>
                      <div className={styles.contactItem}>
                        <FiPhone className={styles.contactIcon} />
                        <span className={styles.contactText}>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.servicesCell}>
                      <div className={styles.servicesList}>
                        {user.services.slice(0, 3).map((service, index) => (
                          <span key={index} className={styles.serviceBadge}>
                            {service}
                          </span>
                        ))}
                        {user.services.length > 3 && (
                          <span className={styles.moreBadge}>
                            +{user.services.length - 3}
                          </span>
                        )}
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
                      {user.lastActive}
                    </div>
                  </td>
                  <td>
                    <div
                      className={styles.actionsCell}
                      onClick={(e) => e.stopPropagation()}>
                      <div className={styles.actionsRow}>
                        <button
                          className={styles.manageBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManageUser(user.id, e);
                          }}>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}>
              Previous
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageBtn} ${currentPage === pageNum ? styles.active : ""}`}
                    onClick={() => setCurrentPage(pageNum)}>
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className={styles.pageBtn}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {currentUsers.length === 0 && (
        <div className={styles.emptyState}>
          <FiUsers className={styles.emptyIcon} />
          <h3>No users found</h3>
          <p>Try adjusting your search or filters</p>
          <button className={styles.clearBtn} onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
