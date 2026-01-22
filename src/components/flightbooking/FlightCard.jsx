import React from "react";
import styles from "./FlightCard.module.css";

const FlightCard = ({ flight, onSelect }) => {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getAirlineCode = (code) => {
    return code || "FL";
  };

  const totalPrice = flight.price.total || flight.price.amount + 85;

  return (
    <div className={styles.flightCard}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.airlineInfo}>
          <div className={styles.airlineLogo}>
            {getAirlineCode(flight.airlineCode)}
          </div>
          <div className={styles.airlineDetails}>
            <h3>{flight.airline}</h3>
            <div className={styles.flightMeta}>
              <span className={styles.flightNumber}>{flight.flightNumber}</span>
              • {flight.aircraft}
            </div>
          </div>
        </div>

        <div className={styles.quickInfo}>
          <div className={styles.duration}>{flight.duration}</div>
          <div
            className={`${styles.stops} ${
              flight.stops === 0 ? styles.direct : styles.withStops
            }`}>
            {flight.stops === 0
              ? "Direct"
              : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className={styles.routeInfo}>
        <div className={styles.departure}>
          <div className={styles.time}>{formatTime(flight.departure.time)}</div>
          <div className={styles.airportCode}>{flight.departure.code}</div>
          <div className={styles.city}>{flight.departure.city}</div>
        </div>

        <div className={styles.routeCenter}>→</div>

        <div className={styles.arrival}>
          <div className={styles.time}>{formatTime(flight.arrival.time)}</div>
          <div className={styles.airportCode}>{flight.arrival.code}</div>
          <div className={styles.city}>{flight.arrival.city}</div>
        </div>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>C</div>
          <div className={styles.featureDetails}>
            <div className={styles.featureLabel}>Carry-on</div>
            <div className={styles.featureValue}>
              {flight.baggage?.carryOn?.pieces || 1} pc
            </div>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>B</div>
          <div className={styles.featureDetails}>
            <div className={styles.featureLabel}>Checked</div>
            <div className={styles.featureValue}>
              {flight.baggage?.checked?.pieces || 1} pc
            </div>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>S</div>
          <div className={styles.featureDetails}>
            <div className={styles.featureLabel}>Class</div>
            <div className={styles.featureValue}>{flight.cabinClass}</div>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>R</div>
          <div className={styles.featureDetails}>
            <div className={styles.featureLabel}>Refund</div>
            <div className={styles.featureValue}>
              {flight.isRefundable ? "Yes" : "No"}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.seatStatus}>
          <div
            className={`${styles.seatIndicator} ${
              flight.seatAvailability === "Good"
                ? styles.good
                : flight.seatAvailability === "Limited"
                ? styles.limited
                : styles.scarce
            }`}>
            <span className={styles.seatDot}></span>
            {flight.seatAvailability} seats
          </div>
        </div>

        <div className={styles.priceAction}>
          <div className={styles.priceSection}>
            <div className={styles.priceLabel}>Total</div>
            <div className={styles.priceValue}>{formatPrice(totalPrice)}</div>
            <div className={styles.priceNote}>per passenger</div>
          </div>

          <button
            className={styles.selectButton}
            onClick={() => onSelect(flight)}>
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
