import React, { useState, useEffect } from "react";
import FlightCard from "./FlightCard";
import { flights } from "./mockData";
import styles from "./FlightResults.module.css";

const FlightResults = ({ searchParams, onSelectFlight, onBack }) => {
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filters, setFilters] = useState({
    maxPrice: 2000,
    stops: "all",
    airlines: [],
    sortBy: "price",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 2; // Changed from 5 to 2

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let results = [...flights];

      // Apply price filter
      results = results.filter((f) => f.price.total <= filters.maxPrice);

      // Apply stops filter
      if (filters.stops === "nonstop") {
        results = results.filter((f) => f.stops === 0);
      } else if (filters.stops === "1stop") {
        results = results.filter((f) => f.stops <= 1);
      }

      // Apply airline filter
      if (filters.airlines.length > 0) {
        results = results.filter((f) =>
          filters.airlines.includes(f.airlineCode)
        );
      }

      // Sort results
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case "price":
            return a.price.total - b.price.total;
          case "duration":
            const getMinutes = (duration) => {
              const match = duration.match(/(\d+)h\s*(\d+)m/);
              return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
            };
            return getMinutes(a.duration) - getMinutes(b.duration);
          case "departure":
            return (
              new Date(`${a.departure.date}T${a.departure.time}`) -
              new Date(`${b.departure.date}T${b.departure.time}`)
            );
          default:
            return 0;
        }
      });

      setFilteredFlights(results);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleAirlineChange = (airlineCode) => {
    setFilters((prev) => ({
      ...prev,
      airlines: prev.airlines.includes(airlineCode)
        ? prev.airlines.filter((code) => code !== airlineCode)
        : [...prev.airlines, airlineCode],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      maxPrice: 2000,
      stops: "all",
      airlines: [],
      sortBy: "price",
    });
  };

  // Pagination logic
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = filteredFlights.slice(
    indexOfFirstFlight,
    indexOfLastFlight
  );
  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate stats
  const totalFlights = filteredFlights.length;
  const minPrice =
    totalFlights > 0
      ? Math.min(...filteredFlights.map((f) => f.price.total))
      : 0;
  const directFlights = filteredFlights.filter((f) => f.stops === 0).length;
  const maxPrice =
    totalFlights > 0
      ? Math.max(...filteredFlights.map((f) => f.price.total))
      : 0;

  return (
    <div className={styles.flightResults}>
      <div className={styles.container}>
        {/* Back Button */}
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Search
        </button>

        {/* Header */}
        <div className={styles.resultsHeader}>
          <div className={styles.headerContent}>
            <div className={styles.routeSummary}>
              <div className={styles.routeDisplay}>
                <span>
                  {searchParams?.from?.split("(")[0]?.trim() || "Origin"}
                </span>
                <span className={styles.routeArrow}>→</span>
                <span>
                  {searchParams?.to?.split("(")[0]?.trim() || "Destination"}
                </span>
              </div>
              <div className={styles.tripDetails}>
                {searchParams?.departureDate && (
                  <div className={styles.detailItem}>
                    <span>{searchParams?.departureDate}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span>
                    {searchParams?.passengers || 1} Passenger
                    {searchParams?.passengers > 1 ? "s" : ""}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span>
                    {searchParams?.cabinClass?.charAt(0).toUpperCase() +
                      searchParams?.cabinClass?.slice(1) || "Economy"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* Filters Sidebar */}
          <div className={styles.filtersSidebar}>
            {/* Price Filter */}
            <div className={styles.filterCard}>
              <div className={styles.filterHeader}>
                <div className={styles.filterIcon}>P</div>
                <div className={styles.filterTitle}>Price Range</div>
              </div>
              <div className={styles.priceFilter}>
                <div className={styles.priceHeader}>
                  <div className={styles.priceLabel}>Max Price</div>
                  <div className={styles.priceValue}>${filters.maxPrice}</div>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="100"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", parseInt(e.target.value))
                  }
                  className={styles.priceSlider}
                />
              </div>
            </div>

            {/* Stops Filter */}
            <div className={styles.filterCard}>
              <div className={styles.filterHeader}>
                <div className={styles.filterIcon}>S</div>
                <div className={styles.filterTitle}>Stops</div>
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>Select Stops</div>
                <div className={styles.filterOptions}>
                  {[
                    { value: "all", label: "All Stops" },
                    { value: "nonstop", label: "Non-stop" },
                    { value: "1stop", label: "1 Stop Max" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`${styles.filterOption} ${
                        filters.stops === option.value ? styles.active : ""
                      }`}
                      onClick={() => handleFilterChange("stops", option.value)}>
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Airlines Filter */}
            <div className={styles.filterCard}>
              <div className={styles.filterHeader}>
                <div className={styles.filterIcon}>A</div>
                <div className={styles.filterTitle}>Airlines</div>
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>Select Airlines</div>
                <div className={styles.filterOptions}>
                  {[
                    { code: "EK", name: "Emirates" },
                    { code: "SQ", name: "Singapore" },
                    { code: "BA", name: "British" },
                    { code: "LH", name: "Lufthansa" },
                  ].map((airline) => (
                    <div
                      key={airline.code}
                      className={`${styles.filterOption} ${
                        filters.airlines.includes(airline.code)
                          ? styles.active
                          : ""
                      }`}
                      onClick={() => handleAirlineChange(airline.code)}>
                      {airline.name}
                    </div>
                  ))}
                </div>
              </div>
              <button
                className={styles.clearFiltersBtn}
                onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>

            {/* Stats */}
            <div className={styles.statsCard}>
              <div className={styles.filterHeader}>
                <div className={styles.filterIcon}>T</div>
                <div className={styles.filterTitle}>Stats</div>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{totalFlights}</div>
                  <div className={styles.statLabel}>Flights</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>${minPrice}</div>
                  <div className={styles.statLabel}>From</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{directFlights}</div>
                  <div className={styles.statLabel}>Direct</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>${maxPrice}</div>
                  <div className={styles.statLabel}>To</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Results Area */}
          <div className={styles.resultsArea}>
            {/* Results Toolbar */}
            <div className={styles.resultsToolbar}>
              <div className={styles.resultsCount}>
                Showing <span>{filteredFlights.length}</span> flights
              </div>
              <div className={styles.sortContainer}>
                <div className={styles.sortLabel}>Sort by:</div>
                <select
                  className={styles.sortSelect}
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange("sortBy", e.target.value)
                  }>
                  <option value="price">Lowest Price</option>
                  <option value="duration">Shortest Duration</option>
                  <option value="departure">Earliest Departure</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingText}>Searching flights...</div>
              </div>
            ) : filteredFlights.length > 0 ? (
              <>
                {/* Flights List */}
                <div className={styles.flightsList}>
                  {currentFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={onSelectFlight}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <div className={styles.paginationLeft}>
                      <button
                        className={`${styles.pageButton} ${
                          currentPage === 1 ? styles.disabled : ""
                        }`}
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}>
                        ← Previous
                      </button>
                    </div>

                    <div className={styles.paginationCenter}>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          className={`${styles.pageNumber} ${
                            currentPage === index + 1 ? styles.active : ""
                          }`}
                          onClick={() => paginate(index + 1)}>
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <div className={styles.paginationRight}>
                      <button
                        className={`${styles.pageButton} ${
                          currentPage === totalPages ? styles.disabled : ""
                        }`}
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}>
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className={styles.noResults}>
                <h3 className={styles.noResultsTitle}>No flights found</h3>
                <p className={styles.noResultsText}>
                  Try adjusting your filters or search for different dates
                </p>
                <div className={styles.actionButtons}>
                  <button className={styles.primaryButton} onClick={onBack}>
                    Modify Search
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={clearAllFilters}>
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
