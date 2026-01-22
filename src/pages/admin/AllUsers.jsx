import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiBriefcase,
} from "react-icons/fi";
import { FaPlane, FaExchangeAlt, FaHotel } from "react-icons/fa";
import styles from "./AllUsers.module.css";

const AllUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@travel.com",
      status: "active",
      lastActive: "2 hours ago",
      services: ["travel", "currency", "flight"],
      totalSpent: "$4,250",
      bookings: 25,
      type: "vip",
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@travel.com",
      status: "active",
      lastActive: "Today",
      services: ["travel", "currency"],
      totalSpent: "$2,850",
      bookings: 13,
      type: "regular",
    },
    {
      id: 3,
      name: "David Chen",
      email: "david@flight.com",
      status: "pending",
      lastActive: "Yesterday",
      services: ["flight"],
      totalSpent: "$1,200",
      bookings: 2,
      type: "regular",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah@travel.com",
      status: "active",
      lastActive: "Today",
      services: ["travel", "flight"],
      totalSpent: "$3,500",
      bookings: 10,
      type: "vip",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@exchange.com",
      status: "inactive",
      lastActive: "1 week ago",
      services: ["currency"],
      totalSpent: "$850",
      bookings: 3,
      type: "regular",
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa@travel.com",
      status: "active",
      lastActive: "Today",
      services: ["travel", "currency", "flight"],
      totalSpent: "$5,800",
      bookings: 45,
      type: "vip",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    vip: users.filter((u) => u.type === "vip").length,
    revenue: "$18,600",
    bookings: users.reduce((sum, u) => sum + u.bookings, 0),
  };

  // Action handlers
  const handleViewUser = (userId) => {
    navigate(`/users/${userId}/profile`);
  };

  const handleEditUser = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log(`Deleting user ${userId}`);
    }
  };

  const handleSendEmail = () => {
    navigate(`/communication/email?users=${selectedUsers.join(",")}`);
  };

  const handleExport = () => {
    navigate("/reports/export");
  };

  const handleAddUser = () => {
    navigate("/users/create");
  };

  return (
    <div className={styles.allUsers}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiUsers className={styles.titleIcon} />
            All Users
          </h1>
          <p className={styles.subtitle}>
            Manage users across Travel, Currency & Flight services
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.exportBtn} onClick={handleExport}>
            <FiDownload />
            Export
          </button>
          <button className={styles.addBtn} onClick={handleAddUser}>
            + Add User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUsers />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiUserCheck />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiDollarSign />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.revenue}</div>
            <div className={styles.statLabel}>Total Revenue</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiBriefcase />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.bookings}</div>
            <div className={styles.statLabel}>Total Bookings</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <button
              className={`${styles.filterTag} ${
                statusFilter === "all" ? styles.active : ""
              }`}
              onClick={() => setStatusFilter("all")}>
              All Users
            </button>
            <button
              className={`${styles.filterTag} ${
                statusFilter === "active" ? styles.active : ""
              }`}
              onClick={() => setStatusFilter("active")}>
              <FiUserCheck /> Active
            </button>
            <button
              className={`${styles.filterTag} ${
                statusFilter === "pending" ? styles.active : ""
              }`}
              onClick={() => setStatusFilter("pending")}>
              Pending
            </button>
            <button
              className={`${styles.filterTag} ${
                statusFilter === "inactive" ? styles.active : ""
              }`}
              onClick={() => setStatusFilter("inactive")}>
              <FiUserX /> Inactive
            </button>
          </div>

          <div className={styles.actionButtons}>
            {selectedUsers.length > 0 && (
              <button
                className={styles.bulkActionBtn}
                onClick={handleSendEmail}>
                <FiMail />
                Send Email ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SIMPLIFIED Users Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onChange={handleSelectAll}
                  className={styles.checkbox}
                />
              </th>
              <th>USER</th>
              <th>SERVICES USED</th>
              <th>STATUS</th>
              <th>LAST ACTIVE</th>
              <th>TOTAL SPENT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className={styles.checkbox}
                  />
                </td>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.userAvatar}>
                      {user.name.charAt(0)}
                    </div>
                    <div className={styles.userDetails}>
                      <div className={styles.userName}>
                        {user.name}
                        {user.type === "vip" && (
                          <span
                            style={{
                              marginLeft: "8px",
                              background: "#8b5cf6",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}>
                            VIP
                          </span>
                        )}
                      </div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.servicesCell}>
                    {user.services.includes("travel") && (
                      <div
                        className={`${styles.serviceIcon} ${styles.travel}`}
                        title="Travel">
                        <FaHotel />
                      </div>
                    )}
                    {user.services.includes("currency") && (
                      <div
                        className={`${styles.serviceIcon} ${styles.currency}`}
                        title="Currency Exchange">
                        <FaExchangeAlt />
                      </div>
                    )}
                    {user.services.includes("flight") && (
                      <div
                        className={`${styles.serviceIcon} ${styles.flight}`}
                        title="Flight Booking">
                        <FaPlane />
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${styles[user.status]}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className={styles.activityCell}>{user.lastActive}</td>
                <td className={styles.valueCell}>{user.totalSpent}</td>
                <td>
                  <div className={styles.actionsCell}>
                    <button
                      className={`${styles.actionBtn} ${styles.view}`}
                      onClick={() => handleViewUser(user.id)}>
                      <FiEye />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.edit}`}
                      onClick={() => handleEditUser(user.id)}>
                      <FiEdit2 />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDeleteUser(user.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className={styles.paginationControls}>
          <button className={styles.paginationBtn} disabled>
            Previous
          </button>
          <button className={`${styles.paginationBtn} ${styles.active}`}>
            1
          </button>
          <button className={styles.paginationBtn}>2</button>
          <button className={styles.paginationBtn}>3</button>
          <button className={styles.paginationBtn}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
