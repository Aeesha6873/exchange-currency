import { useState, useMemo } from "react";
import { TravelIcons } from "./TravelIcons";
import styles from "./DestinationInspiration.module.css";

// Image Placeholder Component
const DestinationImage = ({ destination }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Use color-based placeholders for each destination
  const getPlaceholderColor = (id) => {
    const colors = [
      "linear-gradient(135deg, #10b981, #059669)", // Green gradient
      "linear-gradient(135deg, #f97316, #ea580c)", // Orange gradient
      "linear-gradient(135deg, #3b82f6, #1d4ed8)", // Blue gradient
      "linear-gradient(135deg, #8b5cf6, #7c3aed)", // Purple gradient
      "linear-gradient(135deg, #ec4899, #db2777)", // Pink gradient
      "linear-gradient(135deg, #0ea5e9, #0284c7)", // Sky blue gradient
    ];
    return colors[id % colors.length];
  };

  const getInitial = (name) => name.charAt(0);

  return (
    <div
      className={styles.destinationImage}
      style={{ background: getPlaceholderColor(destination.id) }}>
      {!loaded && !error && (
        <div className={styles.imagePlaceholder}>
          <div className={styles.destinationInitial}>
            {getInitial(destination.name)}
          </div>
        </div>
      )}

      {!error && (
        <img
          src={destination.image}
          alt={destination.name}
          className={`${styles.destinationImageImg} ${
            loaded ? styles.loaded : ""
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          width="400"
          height="300"
        />
      )}

      <div className={styles.destinationBadge}>
        <span>{destination.category}</span>
      </div>
      <div className={styles.destinationRating}>
        <TravelIcons.Star />
        <span>{destination.rating}</span>
      </div>
    </div>
  );
};

// Use more reliable image URLs or local images
const destinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    category: "Beach & Relaxation",
    image: "/images/destinations/bali.jpg", // You should add these to public/images/destinations/
    fallbackImage:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    duration: "7-10 days",
    price: "$1,499+",
    highlights: [
      "Beach resorts",
      "Cultural temples",
      "Spa retreats",
      "Rice terraces",
    ],
    bestFor: ["Honeymoon", "Wellness", "Adventure"],
    season: "Year-round",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Swiss Alps",
    category: "Adventure & Nature",
    image: "/images/destinations/swiss-alps.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    duration: "5-8 days",
    price: "$2,299+",
    highlights: ["Mountain hiking", "Ski resorts", "Lakes", "Chocolate tours"],
    bestFor: ["Adventure", "Romantic", "Family"],
    season: "Winter/Summer",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Tokyo, Japan",
    category: "City & Culture",
    image: "/images/destinations/tokyo.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    duration: "8-12 days",
    price: "$2,899+",
    highlights: [
      "Cherry blossoms",
      "Sushi making",
      "Tech districts",
      "Historic temples",
    ],
    bestFor: ["Culture", "Food", "Shopping"],
    season: "Spring/Fall",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Safari Kenya",
    category: "Wildlife & Safari",
    image: "/images/destinations/kenya.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    duration: "10-14 days",
    price: "$3,499+",
    highlights: [
      "Game drives",
      "Maasai culture",
      "Hot air balloons",
      "Luxury lodges",
    ],
    bestFor: ["Adventure", "Photography", "Luxury"],
    season: "Dry season",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Greek Islands",
    category: "Island Hopping",
    image: "/images/destinations/greece.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    duration: "10-14 days",
    price: "$2,199+",
    highlights: [
      "Santorini sunsets",
      "Mykonos parties",
      "Ancient ruins",
      "Boat tours",
    ],
    bestFor: ["Honeymoon", "Relaxation", "History"],
    season: "Summer",
    rating: 4.8,
  },
  {
    id: 6,
    name: "New York City",
    category: "Urban Exploration",
    image: "/images/destinations/nyc.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    duration: "5-7 days",
    price: "$1,799+",
    highlights: ["Broadway shows", "Museum tours", "Shopping", "Food tours"],
    bestFor: ["Culture", "Shopping", "Entertainment"],
    season: "Spring/Fall",
    rating: 4.6,
  },
];

const categories = [
  "All Destinations",
  "Beach & Relaxation",
  "Adventure & Nature",
  "City & Culture",
  "Wildlife & Safari",
  "Island Hopping",
  "Luxury & Romance",
  "Family Friendly",
];

const TravelTip = ({ icon: Icon, title, description }) => (
  <div className={styles.tipCard}>
    <div className={styles.tipIcon}>
      <Icon />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default function DestinationInspiration({ onSelectDestination }) {
  const [selectedCategory, setSelectedCategory] = useState("All Destinations");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesCategory =
        selectedCategory === "All Destinations" ||
        dest.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.highlights.some((h) =>
          h.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectDestination = (destination) => {
    setIsAnimating(true);
    setTimeout(() => {
      onSelectDestination(destination);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={styles.destinationInspiration}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>Where Will Your</span>
            <span className={styles.titleLine2}>Next Adventure Take You?</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover handpicked destinations and let our travel experts craft
            your perfect journey
          </p>
          <div className={styles.searchBox}>
            <TravelIcons.Search />
            <input
              type="text"
              placeholder="Search destinations, activities, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className={styles.categorySection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleHighlight}>Explore</span> By Category
        </h2>
        <div className={styles.categoryFilters}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryFilter} ${
                selectedCategory === category ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <div className={styles.destinationsSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleHighlight}>Featured</span> Destinations
        </h2>
        <p className={styles.sectionSubtitle}>
          {filteredDestinations.length} amazing destinations found
        </p>

        {filteredDestinations.length === 0 ? (
          <div className={styles.noResults}>
            <TravelIcons.Search className={styles.noResultsIcon} />
            <h3>No destinations found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={styles.destinationsGrid}>
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className={`${styles.destinationCard} ${
                  isAnimating ? styles.animating : ""
                }`}
                onClick={() => handleSelectDestination(destination)}>
                <DestinationImage destination={destination} />

                <div className={styles.destinationContent}>
                  <div className={styles.destinationHeader}>
                    <h3>{destination.name}</h3>
                    <div className={styles.destinationPrice}>
                      {destination.price}
                      <span className={styles.priceNote}>per person</span>
                    </div>
                  </div>

                  <div className={styles.destinationInfo}>
                    <div className={styles.infoItem}>
                      <TravelIcons.Clock />
                      <span>{destination.duration}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <TravelIcons.Calendar />
                      <span>Best: {destination.season}</span>
                    </div>
                  </div>

                  <div className={styles.destinationHighlights}>
                    <h4>Highlights</h4>
                    <div className={styles.highlightTags}>
                      {destination.highlights
                        .slice(0, 3)
                        .map((highlight, index) => (
                          <span key={index} className={styles.highlightTag}>
                            {highlight}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className={styles.destinationBestFor}>
                    <h4>Perfect For</h4>
                    <div className={styles.bestForTags}>
                      {destination.bestFor.map((type, index) => (
                        <span key={index} className={styles.bestForTag}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className={styles.exploreButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDestination(destination);
                    }}>
                    <span>Explore Packages</span>
                    <TravelIcons.ArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Travel Tips */}
      <div className={styles.tipsSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleHighlight}>Smart</span> Travel Planning
        </h2>
        <div className={styles.tipsGrid}>
          <TravelTip
            icon={TravelIcons.Calendar}
            title="Best Time to Book"
            description="Book international trips 3-6 months in advance for best prices and availability."
          />
          <TravelTip
            icon={TravelIcons.Passport}
            title="Visa & Documents"
            description="Check visa requirements 8 weeks before travel. Ensure passports have 6+ months validity."
          />
          <TravelTip
            icon={TravelIcons.Insurance}
            title="Travel Insurance"
            description="Always get comprehensive travel insurance covering medical, cancellation, and baggage."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p className={styles.ctaSubtitle}>
            Select a destination above and let our experts handle the rest
          </p>
          <div className={styles.ctaStats}>
            <div className={styles.ctaStat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Destinations</span>
            </div>
            <div className={styles.ctaStat}>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>Satisfaction</span>
            </div>
            <div className={styles.ctaStat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
