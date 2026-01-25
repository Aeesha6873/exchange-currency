/* AllUsers.jsx */
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
  FiDollarSign,
  FiCalendar,
  FiPackage,
  FiGlobe,
  FiFilter,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
} from "react-icons/fi";
import {
  FaPlane,
  FaExchangeAlt,
  FaHotel,
  FaPassport,
  FaUserTie,
} from "react-icons/fa";
import styles from "./AllUsers.module.css";

const AllUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const usersPerPage = 10;

  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@travel.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      lastActive: "2 hours ago",
      joinDate: "2023-01-15",
      services: [
        {
          name: "currency",
          icon: <FaExchangeAlt />,
          color: "#3b82f6",
          count: 12,
        },
        { name: "flight", icon: <FaPlane />, color: "#8b5cf6", count: 8 },
        { name: "travel", icon: <FaHotel />, color: "#10b981", count: 5 },
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 3 },
      ],
      totalSpent: 4850,
      currencyAmount: 1850,
      flightAmount: 1600,
      travelAmount: 1200,
      visaAmount: 200,
      bookings: 28,
      type: "vip",
      country: "United States",
      verified: true,
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@travel.com",
      phone: "+44 7911 123456",
      status: "active",
      lastActive: "Today",
      joinDate: "2023-02-20",
      services: [
        {
          name: "currency",
          icon: <FaExchangeAlt />,
          color: "#3b82f6",
          count: 5,
        },
        { name: "travel", icon: <FaHotel />, color: "#10b981", count: 7 },
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 2 },
      ],
      totalSpent: 3150,
      currencyAmount: 850,
      flightAmount: 0,
      travelAmount: 2000,
      visaAmount: 300,
      bookings: 15,
      type: "regular",
      country: "United Kingdom",
      verified: true,
    },
    {
      id: 3,
      name: "David Chen",
      email: "david@flight.com",
      phone: "+86 138 0013 8000",
      status: "pending",
      lastActive: "Yesterday",
      joinDate: "2023-03-10",
      services: [
        { name: "flight", icon: <FaPlane />, color: "#8b5cf6", count: 4 },
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 1 },
      ],
      totalSpent: 1600,
      currencyAmount: 0,
      flightAmount: 1200,
      travelAmount: 0,
      visaAmount: 400,
      bookings: 4,
      type: "regular",
      country: "China",
      verified: false,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah@travel.com",
      phone: "+1 (555) 987-6543",
      status: "active",
      lastActive: "Today",
      joinDate: "2023-01-05",
      services: [
        { name: "flight", icon: <FaPlane />, color: "#8b5cf6", count: 6 },
        { name: "travel", icon: <FaHotel />, color: "#10b981", count: 4 },
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 2 },
      ],
      totalSpent: 4200,
      currencyAmount: 0,
      flightAmount: 2200,
      travelAmount: 1600,
      visaAmount: 400,
      bookings: 12,
      type: "vip",
      country: "Canada",
      verified: true,
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@exchange.com",
      phone: "+61 412 345 678",
      status: "inactive",
      lastActive: "1 week ago",
      joinDate: "2023-02-28",
      services: [
        {
          name: "currency",
          icon: <FaExchangeAlt />,
          color: "#3b82f6",
          count: 8,
        },
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 1 },
      ],
      totalSpent: 1250,
      currencyAmount: 850,
      flightAmount: 0,
      travelAmount: 0,
      visaAmount: 400,
      bookings: 5,
      type: "regular",
      country: "Australia",
      verified: true,
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa@travel.com",
      phone: "+65 8123 4567",
      status: "active",
      lastActive: "Today",
      joinDate: "2022-12-01",
      services: [
        {
          name: "currency",
          icon: <FaExchangeAlt />,
          color: "#3b82f6",
          count: 15,
        },
        { name: "flight", icon: <FaPlane />, color: "#8b5cf6", count: 12 },
        { name: "travel", icon: <FaHotel />, color: "#10b981", count: 18 },
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 3 },
      ],
      totalSpent: 6900,
      currencyAmount: 2500,
      flightAmount: 2400,
      travelAmount: 1800,
      visaAmount: 200,
      bookings: 48,
      type: "vip",
      country: "Singapore",
      verified: true,
    },
    {
      id: 7,
      name: "Robert Kim",
      email: "robert@visa.com",
      phone: "+82 10-1234-5678",
      status: "active",
      lastActive: "Today",
      joinDate: "2023-04-15",
      services: [
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 4 },
      ],
      totalSpent: 950,
      currencyAmount: 0,
      flightAmount: 0,
      travelAmount: 0,
      visaAmount: 950,
      bookings: 2,
      type: "regular",
      country: "South Korea",
      verified: true,
    },
    {
      id: 8,
      name: "Maria Garcia",
      email: "maria@travel.com",
      phone: "+34 612 345 678",
      status: "active",
      lastActive: "Today",
      joinDate: "2023-03-25",
      services: [
        { name: "travel", icon: <FaHotel />, color: "#10b981", count: 5 },
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 1 },
      ],
      totalSpent: 2800,
      currencyAmount: 0,
      flightAmount: 0,
      travelAmount: 2400,
      visaAmount: 400,
      bookings: 8,
      type: "regular",
      country: "Spain",
      verified: true,
    },
    {
      id: 9,
      name: "Ahmed Hassan",
      email: "ahmed@exchange.com",
      phone: "+971 50 123 4567",
      status: "pending",
      lastActive: "3 days ago",
      joinDate: "2023-05-10",
      services: [
        {
          name: "currency",
          icon: <FaExchangeAlt />,
          color: "#3b82f6",
          count: 3,
        },
        { name: "flight", icon: <FaPlane />, color: "#8b5cf6", count: 2 },
      ],
      totalSpent: 2200,
      currencyAmount: 1200,
      flightAmount: 1000,
      travelAmount: 0,
      visaAmount: 0,
      bookings: 6,
      type: "regular",
      country: "UAE",
      verified: false,
    },
    {
      id: 10,
      name: "Sophie Martin",
      email: "sophie@flight.com",
      phone: "+33 6 12 34 56 78",
      status: "active",
      lastActive: "Today",
      joinDate: "2023-01-30",
      services: [
        {
          name: "currency",
          icon: <FaExchangeAlt />,
          color: "#3b82f6",
          count: 4,
        },
        { name: "flight", icon: <FaPlane />, color: "#8b5cf6", count: 9 },
        { name: "travel", icon: <FaHotel />, color: "#10b981", count: 3 },
        { name: "visa", icon: <FaPassport />, color: "#f59e0b", count: 2 },
      ],
      totalSpent: 5100,
      currencyAmount: 800,
      flightAmount: 3200,
      travelAmount: 900,
      visaAmount: 200,
      bookings: 25,
      type: "vip",
      country: "France",
      verified: true,
    },
  ];

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    vip: users.filter((u) => u.type === "vip").length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
    currencyUsers: users.filter((u) =>
      u.services.some((s) => s.name === "currency"),
    ).length,
    flightUsers: users.filter((u) =>
      u.services.some((s) => s.name === "flight"),
    ).length,
    travelUsers: users.filter((u) =>
      u.services.some((s) => s.name === "travel"),
    ).length,
    visaUsers: users.filter((u) => u.services.some((s) => s.name === "visa"))
      .length,
    currencyRevenue: users.reduce((sum, u) => sum + u.currencyAmount, 0),
    flightRevenue: users.reduce((sum, u) => sum + u.flightAmount, 0),
    travelRevenue: users.reduce((sum, u) => sum + u.travelAmount, 0),
    visaRevenue: users.reduce((sum, u) => sum + u.visaAmount, 0),
  };

  // Filter and sort users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    const matchesService =
      serviceFilter === "all" ||
      user.services.some((s) => s.name === serviceFilter);

    return matchesSearch && matchesStatus && matchesService;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "totalSpent":
        aValue = a.totalSpent;
        bValue = b.totalSpent;
        break;
      case "bookings":
        aValue = a.bookings;
        bValue = b.bookings;
        break;
      case "joinDate":
        aValue = new Date(a.joinDate);
        bValue = new Date(b.joinDate);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle user selection
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
  };

  // Navigation handlers
  const handleViewUser = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/user/${userId}/edit`);
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      console.log(`Deleting user ${userId}`);
      // In a real app, you would make an API call here
    }
  };

  const handleSendEmail = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to send email.");
      return;
    }
    navigate(`/admin/communication/email?users=${selectedUsers.join(",")}`);
  };

  const handleExport = () => {
    navigate("/admin/reports/users/export");
  };

  const handleAddUser = () => {
    navigate("/admin/users/create");
  };

  const handleViewTransactions = (userId, service) => {
    navigate(`/admin/transactions?user=${userId}&service=${service}`);
  };

  const handleViewBookings = (userId, service) => {
    navigate(`/admin/bookings?user=${userId}&service=${service}`);
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    if (
      window.confirm(
        `Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} this user?`,
      )
    ) {
      console.log(`Changing user ${userId} status to ${newStatus}`);
      // In a real app, you would make an API call here
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/admin/user/${userId}/profile`);
  };

  const handleViewActivity = (userId) => {
    navigate(`/admin/user/${userId}/activity`);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedUsers([]); // Clear selection when changing pages
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServiceFilter("all");
    setSelectedUsers([]);
    setCurrentPage(1);
  };

  const handleServiceClick = (userId, serviceName) => {
    switch (serviceName) {
      case "currency":
        navigate(`/admin/transactions?user=${userId}&type=currency`);
        break;
      case "flight":
        navigate(`/admin/flight-bookings?user=${userId}`);
        break;
      case "travel":
        navigate(`/admin/travel-bookings?user=${userId}`);
        break;
      case "visa":
        navigate(`/admin/visa-applications?user=${userId}`);
        break;
    }
  };

  return (
    <div className={styles.allUsers}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiUsers className={styles.titleIcon} />
            All Users
            <span className={styles.userCount}>{users.length}</span>
          </h1>
          <p className={styles.subtitle}>
            Manage users across Currency Exchange, Flight Bookings, Travel
            Agency & Visa Services
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.exportBtn} onClick={handleExport}>
            <FiDownload />
            Export
          </button>
          <button className={styles.addBtn} onClick={handleAddUser}>
            + Add New User
          </button>
        </div>
      </div>

      {/* Service Statistics */}
      <div className={styles.serviceStats}>
        <div className={styles.serviceStatCard}>
          <div
            className={styles.serviceStatIcon}
            style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
            <FaExchangeAlt />
          </div>
          <div className={styles.serviceStatContent}>
            <div className={styles.serviceStatValue}>{stats.currencyUsers}</div>
            <div className={styles.serviceStatLabel}>Currency Users</div>
            <div className={styles.serviceStatRevenue}>
              ${stats.currencyRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className={styles.serviceStatCard}>
          <div
            className={styles.serviceStatIcon}
            style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
            <FaPlane />
          </div>
          <div className={styles.serviceStatContent}>
            <div className={styles.serviceStatValue}>{stats.flightUsers}</div>
            <div className={styles.serviceStatLabel}>Flight Users</div>
            <div className={styles.serviceStatRevenue}>
              ${stats.flightRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className={styles.serviceStatCard}>
          <div
            className={styles.serviceStatIcon}
            style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
            <FaHotel />
          </div>
          <div className={styles.serviceStatContent}>
            <div className={styles.serviceStatValue}>{stats.travelUsers}</div>
            <div className={styles.serviceStatLabel}>Travel Users</div>
            <div className={styles.serviceStatRevenue}>
              ${stats.travelRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className={styles.serviceStatCard}>
          <div
            className={styles.serviceStatIcon}
            style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
            <FaPassport />
          </div>
          <div className={styles.serviceStatContent}>
            <div className={styles.serviceStatValue}>{stats.visaUsers}</div>
            <div className={styles.serviceStatLabel}>Visa Users</div>
            <div className={styles.serviceStatRevenue}>
              ${stats.visaRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button
            className={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}>
            <FiFilter />
            {showFilters ? "Hide Filters" : "Show Filters"}
            <FiChevronDown
              className={`${styles.filterChevron} ${showFilters ? styles.rotated : ""}`}
            />
          </button>
        </div>

        {showFilters && (
          <div className={styles.advancedFilters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Status</label>
              <div className={styles.filterOptions}>
                {["all", "active", "pending", "inactive"].map((status) => (
                  <button
                    key={status}
                    className={`${styles.statusFilterBtn} ${statusFilter === status ? styles.active : ""}`}
                    onClick={() => setStatusFilter(status)}>
                    {status === "active" && <FiUserCheck />}
                    {status === "inactive" && <FiUserX />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Service</label>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.serviceFilterBtn} ${serviceFilter === "all" ? styles.active : ""}`}
                  onClick={() => setServiceFilter("all")}>
                  All Services
                </button>
                {[
                  {
                    id: "currency",
                    name: "Currency",
                    icon: <FaExchangeAlt />,
                    color: "#3b82f6",
                  },
                  {
                    id: "flight",
                    name: "Flight",
                    icon: <FaPlane />,
                    color: "#8b5cf6",
                  },
                  {
                    id: "travel",
                    name: "Travel",
                    icon: <FaHotel />,
                    color: "#10b981",
                  },
                  {
                    id: "visa",
                    name: "Visa",
                    icon: <FaPassport />,
                    color: "#f59e0b",
                  },
                ].map((service) => (
                  <button
                    key={service.id}
                    className={`${styles.serviceFilterBtn} ${serviceFilter === service.id ? styles.active : ""}`}
                    onClick={() => setServiceFilter(service.id)}
                    style={{ borderColor: service.color }}>
                    <span style={{ color: service.color }}>{service.icon}</span>
                    {service.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={styles.clearFiltersBtn}
              onClick={handleClearFilters}>
              Clear All Filters
            </button>
          </div>
        )}

        <div className={styles.filterControls}>
          <div className={styles.selectedActions}>
            {selectedUsers.length > 0 && (
              <>
                <button
                  className={styles.bulkActionBtn}
                  onClick={handleSendEmail}>
                  <FiMail />
                  Send Email ({selectedUsers.length})
                </button>
                <button
                  className={styles.bulkActionBtn}
                  onClick={() => console.log("Bulk action for", selectedUsers)}>
                  <FiEdit2 />
                  Edit Selected
                </button>
              </>
            )}
          </div>

          <div className={styles.sortControls}>
            <span className={styles.sortLabel}>Sort by:</span>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="totalSpent">Total Spent</option>
              <option value="bookings">Bookings</option>
              <option value="joinDate">Join Date</option>
            </select>
            <button
              className={styles.sortOrderBtn}
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }>
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableInfo}>
            <span className={styles.tableCount}>
              {sortedUsers.length} users found
            </span>
            {selectedUsers.length > 0 && (
              <span className={styles.selectedCount}>
                {selectedUsers.length} selected
              </span>
            )}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === currentUsers.length &&
                      currentUsers.length > 0
                    }
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
                <th>User</th>
                <th>Services</th>
                <th>Status</th>
                <th>Spent</th>
                <th>Bookings</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className={styles.tableRow}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className={styles.checkbox}
                    />
                  </td>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.userAvatar}>
                        {user.name.charAt(0)}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>
                          {user.name}
                          {user.type === "vip" && (
                            <span className={styles.vipBadge}>VIP</span>
                          )}
                        </div>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.services}>
                      {user.services.map((service, index) => (
                        <div
                          key={index}
                          className={`${styles.serviceBadge} ${styles[`${service.name}Badge`]}`}
                          title={`${service.name}: ${service.count} bookings`}>
                          {service.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div
                      className={`${styles.statusBadge} ${styles[`${user.status}Status`]}`}>
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </div>
                  </td>
                  <td>
                    <div className={styles.spentAmount}>
                      ${user.totalSpent.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className={styles.bookingsCount}>{user.bookings}</div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.viewBtn}`}
                        onClick={() => handleViewUser(user.id)}
                        title="View User">
                        <FiEye />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleEditUser(user.id)}
                        title="Edit User">
                        <FiEdit2 />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {indexOfFirstUser + 1} to{" "}
            {Math.min(indexOfLastUser, sortedUsers.length)} of{" "}
            {sortedUsers.length} users
          </div>
          <div className={styles.paginationControls}>
            <button
              className={styles.paginationBtn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              Previous
            </button>

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
                  className={`${styles.paginationBtn} ${currentPage === pageNum ? styles.active : ""}`}
                  onClick={() => handlePageChange(pageNum)}>
                  {pageNum}
                </button>
              );
            })}

            <button
              className={styles.paginationBtn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              Next
            </button>
          </div>

          <div className={styles.pageSize}>
            <span>Show:</span>
            <select className={styles.pageSizeSelect}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {currentUsers.length === 0 && (
        <div className={styles.emptyState}>
          <FiUsers className={styles.emptyIcon} />
          <h3>No users found</h3>
          <p>
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            className={styles.clearFiltersBtn}
            onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
