import { useState } from "react";
import { TravelIcons } from "./TravelIcons";
import styles from "./PackageCustomizer.module.css";

const upgradeOptions = {
  flights: [
    { id: "economy", name: "Economy Class", price: 0, included: true },
    {
      id: "premium",
      name: "Premium Economy",
      price: 299,
      features: ["Extra legroom", "Priority check-in", "Enhanced meals"],
    },
    {
      id: "business",
      name: "Business Class",
      price: 899,
      features: ["Lie-flat seats", "Lounge access", "Premium dining"],
    },
  ],
  hotels: [
    { id: "standard", name: "Standard Room", price: 0, included: true },
    {
      id: "deluxe",
      name: "Deluxe Ocean View",
      price: 199,
      features: ["Ocean view", "Larger room", "Balcony"],
    },
    {
      id: "suite",
      name: "Luxury Suite",
      price: 499,
      features: ["Separate living area", "Butler service", "Private pool"],
    },
  ],
  transfers: [
    { id: "shared", name: "Shared Transfer", price: 0, included: true },
    {
      id: "private",
      name: "Private Transfer",
      price: 149,
      features: ["Private vehicle", "Meet & greet", "Flexible timing"],
    },
  ],
  activities: [
    {
      id: "spa",
      name: "Luxury Spa Day",
      price: 189,
      features: ["3-hour treatment", "Massage", "Facials"],
    },
    {
      id: "cooking",
      name: "Private Cooking Class",
      price: 129,
      features: ["Market visit", "3-course meal", "Recipe book"],
    },
    {
      id: "helicopter",
      name: "Helicopter Tour",
      price: 299,
      features: ["45-minute flight", "Aerial views", "Champagne"],
    },
    {
      id: "diving",
      name: "Scuba Diving",
      price: 159,
      features: [
        "Certified instructor",
        "Equipment rental",
        "Underwater photos",
      ],
    },
  ],
  insurance: [
    {
      id: "basic",
      name: "Basic Coverage",
      price: 89,
      coverage: ["Medical", "Cancellation", "Baggage"],
    },
    {
      id: "premium",
      name: "Premium Coverage",
      price: 149,
      coverage: ["Full medical", "Trip interruption", "Adventure sports"],
    },
  ],
};

export default function PackageCustomizer({
  package: pkg,
  onComplete,
  onBack,
}) {
  const [selectedUpgrades, setSelectedUpgrades] = useState({
    flights: "economy",
    hotels: "standard",
    transfers: "shared",
    activities: [],
    insurance: null,
  });
  const [specialRequests, setSpecialRequests] = useState("");

  const calculateTotal = () => {
    let total = pkg.price;

    // Add flight upgrade cost
    const flightUpgrade = upgradeOptions.flights.find(
      (f) => f.id === selectedUpgrades.flights
    );
    total += flightUpgrade?.price || 0;

    // Add hotel upgrade cost
    const hotelUpgrade = upgradeOptions.hotels.find(
      (h) => h.id === selectedUpgrades.hotels
    );
    total += hotelUpgrade?.price || 0;

    // Add transfer upgrade cost
    const transferUpgrade = upgradeOptions.transfers.find(
      (t) => t.id === selectedUpgrades.transfers
    );
    total += transferUpgrade?.price || 0;

    // Add selected activities cost
    selectedUpgrades.activities.forEach((activityId) => {
      const activity = upgradeOptions.activities.find(
        (a) => a.id === activityId
      );
      total += activity?.price || 0;
    });

    // Add insurance cost
    if (selectedUpgrades.insurance) {
      const insurance = upgradeOptions.insurance.find(
        (i) => i.id === selectedUpgrades.insurance
      );
      total += insurance?.price || 0;
    }

    return total;
  };

  const handleUpgradeChange = (category, value) => {
    if (category === "activities") {
      const currentActivities = [...selectedUpgrades.activities];
      if (currentActivities.includes(value)) {
        setSelectedUpgrades({
          ...selectedUpgrades,
          activities: currentActivities.filter((id) => id !== value),
        });
      } else {
        setSelectedUpgrades({
          ...selectedUpgrades,
          activities: [...currentActivities, value],
        });
      }
    } else {
      setSelectedUpgrades({
        ...selectedUpgrades,
        [category]: value,
      });
    }
  };

  const handleSubmit = () => {
    const customizedPackage = {
      ...pkg,
      upgrades: selectedUpgrades,
      specialRequests,
      finalPrice: calculateTotal(),
      basePrice: pkg.price,
    };
    onComplete(customizedPackage);
  };

  const getSelectedActivityNames = () => {
    return selectedUpgrades.activities.map((id) => {
      const activity = upgradeOptions.activities.find((a) => a.id === id);
      return activity?.name || "";
    });
  };

  return (
    <div className={styles.packageCustomizer}>
      {/* Header */}
      <div className={styles.customizerHeader}>
        <button onClick={onBack} className={styles.backButton}>
          <TravelIcons.ArrowRight style={{ transform: "rotate(180deg)" }} />
          Back to Packages
        </button>
        {/* 
        <div className={styles.headerContent}>
          <h1>Customize Your Package</h1>
          <p>
            Personalize your {pkg.name} experience with upgrades and add-ons
          </p>
        </div> */}
      </div>

      <div className={styles.customizerGrid}>
        {/* Left Column - Upgrade Options */}
        <div className={styles.upgradeOptions}>
          {/* Flight Upgrades */}
          <div className={styles.upgradeSection}>
            <h3 className={styles.sectionTitle}>
              <TravelIcons.Plane />
              Flight Class
            </h3>
            <div className={styles.upgradeCards}>
              {upgradeOptions.flights.map((option) => (
                <div
                  key={option.id}
                  className={`${styles.upgradeCard} ${
                    selectedUpgrades.flights === option.id
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleUpgradeChange("flights", option.id)}>
                  <div className={styles.upgradeHeader}>
                    <h4>{option.name}</h4>
                    <div className={styles.upgradePrice}>
                      {option.price > 0 ? `+$${option.price}` : "Included"}
                    </div>
                  </div>

                  {option.features && (
                    <ul className={styles.featuresList}>
                      {option.features.map((feature, index) => (
                        <li key={index}>
                          <TravelIcons.CheckCircle />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {option.included && (
                    <div className={styles.includedBadge}>
                      Included in package
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Upgrades */}
          <div className={styles.upgradeSection}>
            <h3 className={styles.sectionTitle}>
              <TravelIcons.Hotel />
              Hotel Room
            </h3>
            <div className={styles.upgradeCards}>
              {upgradeOptions.hotels.map((option) => (
                <div
                  key={option.id}
                  className={`${styles.upgradeCard} ${
                    selectedUpgrades.hotels === option.id ? styles.selected : ""
                  }`}
                  onClick={() => handleUpgradeChange("hotels", option.id)}>
                  <div className={styles.upgradeHeader}>
                    <h4>{option.name}</h4>
                    <div className={styles.upgradePrice}>
                      {option.price > 0 ? `+$${option.price}` : "Included"}
                    </div>
                  </div>

                  {option.features && (
                    <ul className={styles.featuresList}>
                      {option.features.map((feature, index) => (
                        <li key={index}>
                          <TravelIcons.CheckCircle />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {option.included && (
                    <div className={styles.includedBadge}>
                      Included in package
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transfer Upgrades */}
          <div className={styles.upgradeSection}>
            <h3 className={styles.sectionTitle}>
              <TravelIcons.Car />
              Airport Transfers
            </h3>
            <div className={styles.upgradeCards}>
              {upgradeOptions.transfers.map((option) => (
                <div
                  key={option.id}
                  className={`${styles.upgradeCard} ${
                    selectedUpgrades.transfers === option.id
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleUpgradeChange("transfers", option.id)}>
                  <div className={styles.upgradeHeader}>
                    <h4>{option.name}</h4>
                    <div className={styles.upgradePrice}>
                      {option.price > 0 ? `+$${option.price}` : "Included"}
                    </div>
                  </div>

                  {option.features && (
                    <ul className={styles.featuresList}>
                      {option.features.map((feature, index) => (
                        <li key={index}>
                          <TravelIcons.CheckCircle />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {option.included && (
                    <div className={styles.includedBadge}>
                      Included in package
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Add-ons */}
          <div className={styles.upgradeSection}>
            <h3 className={styles.sectionTitle}>
              <TravelIcons.Activities />
              Additional Activities
            </h3>
            <div className={styles.activityGrid}>
              {upgradeOptions.activities.map((option) => (
                <div
                  key={option.id}
                  className={`${styles.activityCard} ${
                    selectedUpgrades.activities.includes(option.id)
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleUpgradeChange("activities", option.id)}>
                  <div className={styles.activityHeader}>
                    <h4>{option.name}</h4>
                    <div className={styles.activityPrice}>+${option.price}</div>
                  </div>

                  <ul className={styles.activityFeatures}>
                    {option.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>

                  <div className={styles.selectActivity}>
                    {selectedUpgrades.activities.includes(option.id)
                      ? "✓ Selected"
                      : "Select"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Insurance */}
          <div className={styles.upgradeSection}>
            <h3 className={styles.sectionTitle}>
              <TravelIcons.Insurance />
              Travel Insurance
            </h3>
            <div className={styles.insuranceCards}>
              {upgradeOptions.insurance.map((option) => (
                <div
                  key={option.id}
                  className={`${styles.insuranceCard} ${
                    selectedUpgrades.insurance === option.id
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleUpgradeChange("insurance", option.id)}>
                  <div className={styles.insuranceHeader}>
                    <h4>{option.name}</h4>
                    <div className={styles.insurancePrice}>
                      +${option.price}
                    </div>
                  </div>

                  <ul className={styles.coverageList}>
                    {option.coverage.map((item, index) => (
                      <li key={index}>
                        <TravelIcons.CheckCircle />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.recommendation}>
                    Recommended for international travel
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className={styles.upgradeSection}>
            <h3 className={styles.sectionTitle}>
              <TravelIcons.Star />
              Special Requests
            </h3>
            <div className={styles.specialRequests}>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any dietary requirements, accessibility needs, room preferences, or special occasions..."
                rows="4"
              />
              <p className={styles.requestNote}>
                We'll do our best to accommodate all requests
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className={styles.summaryColumn}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Package Summary</h3>

            <div className={styles.packageDetails}>
              <h4>{pkg.name}</h4>
              <p>{pkg.duration}</p>
            </div>

            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>Base Package Price</span>
                <span>${pkg.price}</span>
              </div>

              {selectedUpgrades.flights !== "economy" && (
                <div className={styles.priceRow}>
                  <span>Flight Upgrade</span>
                  <span>
                    +$
                    {upgradeOptions.flights.find(
                      (f) => f.id === selectedUpgrades.flights
                    )?.price || 0}
                  </span>
                </div>
              )}

              {selectedUpgrades.hotels !== "standard" && (
                <div className={styles.priceRow}>
                  <span>Hotel Upgrade</span>
                  <span>
                    +$
                    {upgradeOptions.hotels.find(
                      (h) => h.id === selectedUpgrades.hotels
                    )?.price || 0}
                  </span>
                </div>
              )}

              {selectedUpgrades.transfers !== "shared" && (
                <div className={styles.priceRow}>
                  <span>Transfer Upgrade</span>
                  <span>
                    +$
                    {upgradeOptions.transfers.find(
                      (t) => t.id === selectedUpgrades.transfers
                    )?.price || 0}
                  </span>
                </div>
              )}

              {selectedUpgrades.activities.map((activityId) => {
                const activity = upgradeOptions.activities.find(
                  (a) => a.id === activityId
                );
                return activity ? (
                  <div key={activityId} className={styles.priceRow}>
                    <span>{activity.name}</span>
                    <span>+${activity.price}</span>
                  </div>
                ) : null;
              })}

              {selectedUpgrades.insurance && (
                <div className={styles.priceRow}>
                  <span>Travel Insurance</span>
                  <span>
                    +$
                    {upgradeOptions.insurance.find(
                      (i) => i.id === selectedUpgrades.insurance
                    )?.price || 0}
                  </span>
                </div>
              )}

              <div className={styles.priceRowTotal}>
                <span>Total Package Price</span>
                <span className={styles.totalPrice}>${calculateTotal()}</span>
              </div>
            </div>

            <div className={styles.upgradeSummary}>
              <h4>Selected Upgrades:</h4>
              <ul className={styles.upgradeList}>
                <li>
                  <TravelIcons.Plane />
                  {
                    upgradeOptions.flights.find(
                      (f) => f.id === selectedUpgrades.flights
                    )?.name
                  }
                </li>
                <li>
                  <TravelIcons.Hotel />
                  {
                    upgradeOptions.hotels.find(
                      (h) => h.id === selectedUpgrades.hotels
                    )?.name
                  }
                </li>
                <li>
                  <TravelIcons.Car />
                  {
                    upgradeOptions.transfers.find(
                      (t) => t.id === selectedUpgrades.transfers
                    )?.name
                  }
                </li>
                {getSelectedActivityNames().map((name, index) => (
                  <li key={index}>
                    <TravelIcons.Activities />
                    {name}
                  </li>
                ))}
                {selectedUpgrades.insurance && (
                  <li>
                    <TravelIcons.Insurance />
                    {
                      upgradeOptions.insurance.find(
                        (i) => i.id === selectedUpgrades.insurance
                      )?.name
                    }
                  </li>
                )}
              </ul>
            </div>

            <button className={styles.continueButton} onClick={handleSubmit}>
              Continue to Expert Advice
              <TravelIcons.ArrowRight />
            </button>
          </div>

          <div className={styles.supportCard}>
            <h4>Need Help Choosing?</h4>
            <p>
              Our travel experts can recommend the best upgrades for your needs.
            </p>
            <button className={styles.supportButton}>
              <TravelIcons.Assistant />
              Chat with Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
