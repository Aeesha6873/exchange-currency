import { useState } from "react";
import { TravelIcons } from "./TravelIcons";
import styles from "./TravelPackages.module.css";

const packagesData = [
  {
    id: 1,
    name: "Bali Bliss Retreat",
    type: "Premium",
    duration: "8 days / 7 nights",
    price: 2499,
    savings: 300,
    rating: 4.9,
    reviews: 128,
    inclusions: {
      flights: true,
      hotel: "5-star luxury resort",
      transfers: true,
      meals: "Breakfast daily + 3 dinners",
      activities: ["Spa day", "Temple tour", "Cooking class"],
      guide: "Personal guide",
    },
    description:
      "Ultimate relaxation package with luxury accommodations and cultural experiences.",
    bestFor: ["Honeymoon", "Wellness", "Luxury"],
  },
  {
    id: 2,
    name: "Bali Adventure Explorer",
    type: "Adventure",
    duration: "10 days / 9 nights",
    price: 1899,
    savings: 200,
    rating: 4.8,
    reviews: 96,
    inclusions: {
      flights: true,
      hotel: "4-star eco-resort",
      transfers: true,
      meals: "Breakfast daily",
      activities: ["Volcano hike", "Surfing lessons", "Jungle trek"],
      guide: "Adventure guide",
    },
    description:
      "For thrill-seekers wanting to explore Bali's natural wonders.",
    bestFor: ["Adventure", "Nature", "Active travelers"],
  },
  {
    id: 3,
    name: "Bali Cultural Immersion",
    type: "Cultural",
    duration: "7 days / 6 nights",
    price: 1599,
    savings: 150,
    rating: 4.7,
    reviews: 84,
    inclusions: {
      flights: true,
      hotel: "Boutique hotels",
      transfers: true,
      meals: "All meals included",
      activities: ["Traditional dance", "Art workshops", "Village visits"],
      guide: "Cultural expert",
    },
    description: "Deep dive into Balinese culture, arts, and traditions.",
    bestFor: ["Culture", "Learning", "Photography"],
  },
  {
    id: 4,
    name: "Bali Budget Escape",
    type: "Economy",
    duration: "6 days / 5 nights",
    price: 1199,
    savings: 100,
    rating: 4.5,
    reviews: 156,
    inclusions: {
      flights: true,
      hotel: "3-star comfortable hotels",
      transfers: "Shared transfers",
      meals: "Breakfast only",
      activities: ["Beach days", "Market visits"],
      guide: "Local host",
    },
    description: "Affordable Bali experience without compromising on quality.",
    bestFor: ["Budget", "Solo travelers", "Backpackers"],
  },
];

export default function TravelPackages({
  destination,
  onSelectPackage,
  onBack,
}) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleContinue = () => {
    if (selectedPackage) {
      onSelectPackage(selectedPackage);
    }
  };

  return (
    <div className={styles.travelPackages}>
      {/* Header */}
      <div className={styles.packagesHeader}>
        <button onClick={onBack} className={styles.backButton}>
          <TravelIcons.ArrowRight style={{ transform: "rotate(180deg)" }} />
          Back to Destinations
        </button>

        {/* <div className={styles.headerContent}>
          <h1>Packages for {destination.name}</h1>
          <p>Choose from our carefully curated travel packages</p>
        </div> */}
      </div>

      {/* Package Grid */}
      <div className={styles.packagesGrid}>
        {packagesData.map((pkg) => (
          <div
            key={pkg.id}
            className={`${styles.packageCard} ${
              selectedPackage?.id === pkg.id ? styles.selected : ""
            }`}
            onClick={() => handlePackageSelect(pkg)}>
            {/* Package Badge */}
            <div className={styles.packageBadge}>
              <span className={styles.badgeText}>{pkg.type}</span>
              {pkg.savings > 0 && (
                <span className={styles.savingsBadge}>Save ${pkg.savings}</span>
              )}
            </div>

            {/* Package Header */}
            <div className={styles.packageHeader}>
              <h3>{pkg.name}</h3>
              <div className={styles.packageRating}>
                <TravelIcons.Star />
                <span>{pkg.rating}</span>
                <span className={styles.reviewCount}>
                  ({pkg.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Duration & Price */}
            <div className={styles.packageInfo}>
              <div className={styles.infoItem}>
                <TravelIcons.Clock />
                <span>{pkg.duration}</span>
              </div>
              <div className={styles.priceSection}>
                <div className={styles.price}>${pkg.price}</div>
                <div className={styles.perPerson}>per person</div>
              </div>
            </div>

            {/* Description */}
            <p className={styles.packageDescription}>{pkg.description}</p>

            {/* Inclusions */}
            <div className={styles.inclusionsSection}>
              <h4>What's Included:</h4>
              <div className={styles.inclusionsGrid}>
                <div className={styles.inclusionItem}>
                  <TravelIcons.Plane />
                  <span>Flights</span>
                </div>
                <div className={styles.inclusionItem}>
                  <TravelIcons.Hotel />
                  <span>{pkg.inclusions.hotel}</span>
                </div>
                <div className={styles.inclusionItem}>
                  <TravelIcons.Car />
                  <span>Transfers</span>
                </div>
                <div className={styles.inclusionItem}>
                  <TravelIcons.Meals />
                  <span>{pkg.inclusions.meals}</span>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className={styles.activitiesSection}>
              <h4>Featured Activities:</h4>
              <div className={styles.activityTags}>
                {pkg.inclusions.activities.map((activity, index) => (
                  <span key={index} className={styles.activityTag}>
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div className={styles.bestForSection}>
              <h4>Perfect For:</h4>
              <div className={styles.bestForTags}>
                {pkg.bestFor.map((type, index) => (
                  <span key={index} className={styles.bestForTag}>
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Select Button */}
            <button
              className={`${styles.selectButton} ${
                selectedPackage?.id === pkg.id ? styles.selected : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePackageSelect(pkg);
              }}>
              {selectedPackage?.id === pkg.id ? (
                <>
                  <TravelIcons.CheckCircle />
                  Selected
                </>
              ) : (
                "Select Package"
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.selectedInfo}>
          {selectedPackage ? (
            <>
              <h3>{selectedPackage.name} Selected</h3>
              <p>Total: ${selectedPackage.price} per person</p>
            </>
          ) : (
            <p>Select a package to continue</p>
          )}
        </div>
        <button
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={!selectedPackage}>
          Customize Package
          <TravelIcons.ArrowRight />
        </button>
      </div>
    </div>
  );
}
