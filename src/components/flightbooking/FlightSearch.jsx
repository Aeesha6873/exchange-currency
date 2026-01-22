import React, { useState, useEffect } from "react";
import { airports } from "./mockData";
import styles from "./FlightSearch.module.css";
import {
  IconPlane,
  IconUsers,
  IconUser,
  IconChild,
  IconBaby,
  IconSeat,
  IconCheck,
  IconShield,
  IconStar,
  IconCalendar,
  IconSwap,
  IconClose,
  IconChevronDown,
  IconEconomy,
  IconPremium,
  IconBusiness,
  IconFirstClass,
} from "./Icons";

const FlightSearch = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    tripType: "round",
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: "economy",
  });
  const [showTravelers, setShowTravelers] = useState(false);
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setFormData((prev) => ({
      ...prev,
      departureDate: today.toISOString().split("T")[0],
      returnDate: tomorrow.toISOString().split("T")[0],
    }));
  }, []);

  const totalPassengers = () => {
    return (
      formData.passengers.adults +
      formData.passengers.children +
      formData.passengers.infants
    );
  };

  const getCabinDisplay = (cabin) => {
    const cabinNames = {
      economy: "Economy",
      premium: "Premium Economy",
      business: "Business",
      first: "First Class",
    };
    return cabinNames[cabin] || cabin;
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if ((field === "from" || field === "to") && value.length > 1) {
      const filtered = airports
        .filter(
          (a) =>
            a.city.toLowerCase().includes(value.toLowerCase()) ||
            a.code.toLowerCase().includes(value.toLowerCase()) ||
            a.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions((prev) => ({ ...prev, [field]: filtered }));
      setActiveField(field);
    } else {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      if (activeField === field) setActiveField(null);
    }
  };

  const selectSuggestion = (field, airport) => {
    setFormData((prev) => ({
      ...prev,
      [field]: `${airport.city} (${airport.code})`,
    }));
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
    setActiveField(null);
  };

  const updatePassengers = (type, delta) => {
    setFormData((prev) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(
          type === "adults" ? 1 : 0,
          prev.passengers[type] + delta
        ),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      ...formData,
      passengers: totalPassengers(),
    });
  };

  const cabinClasses = [
    {
      id: "economy",
      name: "Economy",
      desc: "Standard comfort with great value",
      icon: <IconEconomy size={24} />,
    },
    {
      id: "premium",
      name: "Premium Economy",
      desc: "Extra space and amenities",
      icon: <IconPremium size={24} />,
    },
    {
      id: "business",
      name: "Business Class",
      desc: "Premium service & comfort",
      icon: <IconBusiness size={24} />,
    },
    {
      id: "first",
      name: "First Class",
      desc: "Ultimate luxury experience",
      icon: <IconFirstClass size={24} />,
    },
  ];

  return (
    <div className={styles.flightSearch}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridLines}></div>
        <div className={styles.floatingOrbs}>
          <div className={styles.orb1}></div>
          <div className={styles.orb2}></div>
          <div className={styles.orb3}></div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Left Side - Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeTag}>
            <IconPlane size={16} />
            Premium Flight Search
          </div>

          <h1 className={styles.welcomeTitle}>
            <span className={styles.accent}>Find Your Perfect</span>
            Flight Experience
          </h1>

          <p className={styles.welcomeSubtitle}>
            Search and compare flights from over 500 airlines worldwide. Our
            advanced platform ensures you find the best deals with ease.
          </p>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <IconCheck size={20} />
              </div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>Best Price Guarantee</div>
                <div className={styles.featureDesc}>
                  We guarantee the lowest prices or we'll match it
                </div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <IconShield size={20} />
              </div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>Flexible Booking</div>
                <div className={styles.featureDesc}>
                  Free changes on most tickets with no hidden fees
                </div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <IconStar size={20} />
              </div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>24/7 Premium Support</div>
                <div className={styles.featureDesc}>
                  Expert assistance anytime you need it
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Search Form */}
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.formCard}>
            {/* Trip Type */}
            <div className={styles.tripType}>
              <button
                type="button"
                className={`${styles.tripButton} ${
                  formData.tripType === "round" ? styles.active : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, tripType: "round" }))
                }>
                Round Trip
              </button>
              <button
                type="button"
                className={`${styles.tripButton} ${
                  formData.tripType === "oneway" ? styles.active : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, tripType: "oneway" }))
                }>
                One Way
              </button>
              <button
                type="button"
                className={`${styles.tripButton} ${
                  formData.tripType === "multi" ? styles.active : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, tripType: "multi" }))
                }>
                Multi City
              </button>
            </div>

            {/* Route Inputs */}
            <div className={styles.routeSection}>
              <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>
                  <IconPlane size={16} />
                  Departure
                </div>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter city or airport"
                  value={formData.from}
                  onChange={(e) => handleInputChange("from", e.target.value)}
                  onFocus={() => setActiveField("from")}
                  required
                />
                {activeField === "from" && suggestions.from.length > 0 && (
                  <div className={styles.suggestions}>
                    {suggestions.from.map((airport) => (
                      <div
                        key={airport.code}
                        className={styles.suggestionItem}
                        onClick={() => selectSuggestion("from", airport)}>
                        <div className={styles.suggestionCity}>
                          <IconPlane size={14} />
                          {airport.city}
                        </div>
                        <div className={styles.suggestionCode}>
                          {airport.code}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={styles.swapButton}
                onClick={handleSwap}
                aria-label="Swap destinations">
                <IconSwap size={18} />
              </button>

              <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>
                  <IconPlane size={16} />
                  Destination
                </div>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter city or airport"
                  value={formData.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  onFocus={() => setActiveField("to")}
                  required
                />
                {activeField === "to" && suggestions.to.length > 0 && (
                  <div className={styles.suggestions}>
                    {suggestions.to.map((airport) => (
                      <div
                        key={airport.code}
                        className={styles.suggestionItem}
                        onClick={() => selectSuggestion("to", airport)}>
                        <div className={styles.suggestionCity}>
                          <IconPlane size={14} />
                          {airport.city}
                        </div>
                        <div className={styles.suggestionCode}>
                          {airport.code}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className={styles.datesSection}>
              <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>
                  <IconCalendar size={16} />
                  Departure Date
                </div>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={formData.departureDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departureDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {formData.tripType === "round" && (
                <div className={styles.inputGroup}>
                  <div className={styles.inputLabel}>
                    <IconCalendar size={16} />
                    Return Date
                  </div>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={formData.returnDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        returnDate: e.target.value,
                      }))
                    }
                    min={formData.departureDate}
                  />
                </div>
              )}
            </div>

            {/* Travelers & Class */}
            {/* Travelers & Class - ULTRA COMPACT */}
            <div className={styles.travelersContainer}>
              <div className={styles.inputLabel}>
                <IconUsers size={12} />
                Travelers & Class
              </div>
              <button
                type="button"
                className={`${styles.travelersTrigger} ${
                  showTravelers ? styles.active : ""
                }`}
                onClick={() => setShowTravelers(!showTravelers)}>
                <div className={styles.triggerContent}>
                  <div className={styles.triggerIcon}>
                    <IconUser size={14} />
                  </div>
                  <div className={styles.triggerInfo}>
                    <div className={styles.travelersCount}>
                      {totalPassengers()}{" "}
                      {totalPassengers() === 1 ? "Traveler" : "Travelers"}
                    </div>
                    <div className={styles.cabinClass}>
                      {getCabinDisplay(formData.cabinClass)}
                    </div>
                  </div>
                </div>
                <span className={styles.dropdownArrow}>
                  <IconChevronDown size={10} />
                </span>
              </button>

              {/* Travelers Dropdown - ULTRA COMPACT */}
              {showTravelers && (
                <div className={styles.travelersDropdown}>
                  <div className={styles.dropdownHeader}>
                    <h3 className={styles.dropdownTitle}>
                      <IconUsers size={14} />
                      Travelers & Class
                    </h3>
                    <button
                      type="button"
                      className={styles.closeButton}
                      onClick={() => setShowTravelers(false)}>
                      <IconClose size={12} />
                    </button>
                  </div>

                  <div className={styles.dropdownContent}>
                    {/* Passengers Section */}
                    <div className={styles.passengersSection}>
                      <div className={styles.sectionHeader}>
                        <IconUser size={12} />
                        <div className={styles.sectionTitle}>Passengers</div>
                      </div>
                      <div className={styles.passengersList}>
                        {[
                          {
                            type: "adults",
                            label: "Adults",
                            age: "12+ years",
                            icon: <IconUser size={12} />,
                          },
                          {
                            type: "children",
                            label: "Children",
                            age: "2-11 years",
                            icon: <IconChild size={12} />,
                          },
                          {
                            type: "infants",
                            label: "Infants",
                            age: "0-2 years",
                            icon: <IconBaby size={12} />,
                          },
                        ].map((passenger) => (
                          <div
                            key={passenger.type}
                            className={styles.passengerItem}>
                            <div className={styles.passengerInfo}>
                              <div className={styles.passengerLabel}>
                                {passenger.icon}
                                {passenger.label}
                              </div>
                              <div className={styles.passengerAge}>
                                {passenger.age}
                              </div>
                            </div>
                            <div className={styles.passengerControls}>
                              <button
                                type="button"
                                className={styles.counterButton}
                                onClick={() =>
                                  updatePassengers(passenger.type, -1)
                                }
                                disabled={
                                  formData.passengers[passenger.type] <=
                                  (passenger.type === "adults" ? 1 : 0)
                                }>
                                −
                              </button>
                              <span className={styles.passengerValue}>
                                {formData.passengers[passenger.type]}
                              </span>
                              <button
                                type="button"
                                className={styles.counterButton}
                                onClick={() =>
                                  updatePassengers(passenger.type, 1)
                                }>
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cabin Class Section */}
                    <div className={styles.cabinSection}>
                      <div className={styles.sectionHeader}>
                        <IconSeat size={12} />
                        <div className={styles.sectionTitle}>Cabin Class</div>
                      </div>
                      <div className={styles.cabinGrid}>
                        {[
                          {
                            id: "economy",
                            name: "Economy",
                            desc: "Best value",
                            icon: <IconEconomy size={16} />,
                          },
                          {
                            id: "premium",
                            name: "Premium",
                            desc: "More space",
                            icon: <IconPremium size={16} />,
                          },
                          {
                            id: "business",
                            name: "Business",
                            desc: "Premium",
                            icon: <IconBusiness size={16} />,
                          },
                          {
                            id: "first",
                            name: "First",
                            desc: "Luxury",
                            icon: <IconFirstClass size={16} />,
                          },
                        ].map((cabin) => (
                          <button
                            key={cabin.id}
                            type="button"
                            className={`${styles.cabinOption} ${
                              formData.cabinClass === cabin.id
                                ? styles.active
                                : ""
                            }`}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                cabinClass: cabin.id,
                              }));
                            }}>
                            <span className={styles.cabinIcon}>
                              {cabin.icon}
                            </span>
                            <div className={styles.cabinContent}>
                              <span className={styles.cabinName}>
                                {cabin.name}
                              </span>
                              <span className={styles.cabinDesc}>
                                {cabin.desc}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={styles.dropdownFooter}>
                    <div className={styles.totalInfo}>
                      <div className={styles.totalLabel}>Total Travelers</div>
                      <div className={styles.totalValue}>
                        {totalPassengers()}{" "}
                        {totalPassengers() === 1 ? "Traveler" : "Travelers"}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.applyButton}
                      onClick={() => setShowTravelers(false)}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className={styles.searchButtonContainer}>
              <button type="submit" className={styles.searchButton}>
                <IconPlane size={20} />
                Search Flights
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightSearch;
