import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Confirmation.module.css";

const Confirmation = ({ bookingData, flight, onNewBooking }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Create confetti using your color scheme
    const confettiArray = [];
    for (let i = 0; i < 50; i++) {
      confettiArray.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        color: ["var(--green)", "var(--dark-green)", "#059669"][
          Math.floor(Math.random() * 3)
        ],
      });
    }
    setConfetti(confettiArray);
  }, []);

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

  const totalPrice = flight.price.amount + 85;

  return (
    <div className={styles.confirmationPage}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridLines}></div>
        <div className={styles.floatingOrbs}>
          <div className={styles.orb1}></div>
          <div className={styles.orb2}></div>
          <div className={styles.orb3}></div>
        </div>
      </div>

      {/* Confetti Animation */}
      <div className={styles.confettiContainer}>
        <AnimatePresence>
          {confetti.map((item) => (
            <motion.div
              key={item.id}
              className={styles.confetti}
              style={{
                left: item.left,
                background: item.color,
              }}
              initial={{ y: -100, opacity: 1 }}
              animate={{
                y: "100vh",
                opacity: 0,
                rotate: 720,
              }}
              transition={{
                duration: 3,
                delay: item.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.confirmationContainer}>
        {/* Success Header */}
        <motion.div
          className={styles.successHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div className={styles.headerContent}>
            <motion.div
              className={styles.successAnimation}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              }}>
              <div className={styles.successCircle}>
                <div className={styles.neonRing}></div>
                <span className={styles.successIcon}>✓</span>
              </div>
            </motion.div>

            <div className={styles.headerText}>
              <h1 className={styles.successTitle}>Booking Confirmed!</h1>
              <p className={styles.successSubtitle}>
                Your flight has been successfully booked. E-ticket has been sent
                to your email.
              </p>

              <div className={styles.bookingInfo}>
                <div className={styles.bookingIdCard}>
                  <div className={styles.bookingIdLabel}>Booking ID</div>
                  <div className={styles.bookingIdValue}>
                    {bookingData.bookingId}
                  </div>
                  <motion.button
                    className={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(bookingData.bookingId);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}>
                    <span className={styles.copyIcon}>📋</span>
                    Copy
                  </motion.button>
                </div>

                <div className={styles.successStatus}>
                  <div className={styles.statusIndicator}>
                    <div className={styles.statusDot}></div>
                    <span>Confirmed</span>
                  </div>
                  <div className={styles.statusTime}>Just now</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className={styles.contentLayout}>
          {/* Left Column - Flight Details */}
          <div className={styles.leftColumn}>
            {/* Digital Ticket */}
            <motion.div
              className={styles.digitalTicket}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}>
              <div className={styles.ticketHeader}>
                <div className={styles.ticketGlow}></div>
                <div className={styles.ticketBrand}>
                  <div className={styles.airlineBadge}>
                    <span className={styles.badgeIcon}>✈️</span>
                    <div className={styles.badgeText}>
                      <h3>{flight.airline}</h3>
                      <p>Flight {flight.flightNumber}</p>
                    </div>
                  </div>
                  <div className={styles.ticketTag}>
                    <span className={styles.tagIcon}>🔐</span>
                    Digital
                  </div>
                </div>
              </div>

              <div className={styles.ticketBody}>
                <div className={styles.flightRoute}>
                  <div className={styles.routeSegment}>
                    <div className={styles.departureInfo}>
                      <div className={styles.airportCode}>
                        {flight.departure.code}
                      </div>
                      <div className={styles.airportCity}>
                        {flight.departure.city}
                      </div>
                      <div className={styles.departureTime}>
                        <span className={styles.time}>
                          {formatTime(flight.departure.time)}
                        </span>
                        <span className={styles.date}>
                          {flight.departure.date}
                        </span>
                      </div>
                    </div>

                    <div className={styles.flightConnector}>
                      <div className={styles.connectorLine}></div>
                      <div className={styles.flightIcon}>⟁</div>
                      <div className={styles.durationBadge}>
                        {flight.duration}
                      </div>
                    </div>

                    <div className={styles.arrivalInfo}>
                      <div className={styles.airportCode}>
                        {flight.arrival.code}
                      </div>
                      <div className={styles.airportCity}>
                        {flight.arrival.city}
                      </div>
                      <div className={styles.arrivalTime}>
                        <span className={styles.time}>
                          {formatTime(flight.arrival.time)}
                        </span>
                        <span className={styles.date}>
                          {flight.departure.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.ticketDetails}>
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>🛋️</div>
                      <div className={styles.detailInfo}>
                        <div className={styles.detailLabel}>Class</div>
                        <div className={styles.detailValue}>
                          {flight.cabinClass}
                        </div>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>👥</div>
                      <div className={styles.detailInfo}>
                        <div className={styles.detailLabel}>Passengers</div>
                        <div className={styles.detailValue}>
                          {bookingData.passengers.length} Adult
                          {bookingData.passengers.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>✈️</div>
                      <div className={styles.detailInfo}>
                        <div className={styles.detailLabel}>Aircraft</div>
                        <div className={styles.detailValue}>
                          {flight.aircraft}
                        </div>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>💰</div>
                      <div className={styles.detailInfo}>
                        <div className={styles.detailLabel}>Total</div>
                        <div className={styles.detailValue}>
                          {formatPrice(totalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.ticketFooter}>
                <div className={styles.scanCode}>
                  <div className={styles.codeIcon}>📱</div>
                  <div className={styles.codeText}>
                    <span>Scan at airport</span>
                    <small>Digital boarding pass ready</small>
                  </div>
                </div>
                <div className={styles.validUntil}>Valid until departure</div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              className={styles.nextSteps}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>📋</div>
                <div className={styles.sectionTitle}>
                  <h3>Next Steps</h3>
                  <p>Prepare for your journey</p>
                </div>
              </div>

              <div className={styles.stepsList}>
                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>01</div>
                  <div className={styles.stepContent}>
                    <h4>Check Email</h4>
                    <p>
                      E-ticket and confirmation sent to your registered email
                    </p>
                  </div>
                  <div className={styles.stepIcon}>📧</div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>02</div>
                  <div className={styles.stepContent}>
                    <h4>Online Check-in</h4>
                    <p>
                      Available 24 hours before departure on airline's website
                    </p>
                  </div>
                  <div className={styles.stepIcon}>📱</div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>03</div>
                  <div className={styles.stepContent}>
                    <h4>Prepare Documents</h4>
                    <p>Have passport and necessary travel documents ready</p>
                  </div>
                  <div className={styles.stepIcon}>🛂</div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>04</div>
                  <div className={styles.stepContent}>
                    <h4>Arrive Early</h4>
                    <p>Plan to reach airport 3 hours before departure</p>
                  </div>
                  <div className={styles.stepIcon}>⏰</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Passengers & Actions */}
          <div className={styles.rightColumn}>
            {/* Passengers Section */}
            <motion.div
              className={styles.passengersSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>👥</div>
                <div className={styles.sectionTitle}>
                  <h3>Passenger Details</h3>
                  <p>
                    {bookingData.passengers.length} traveler
                    {bookingData.passengers.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className={styles.passengersList}>
                {bookingData.passengers.map((passenger, index) => (
                  <motion.div
                    key={index}
                    className={styles.passengerCard}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}>
                    <div className={styles.passengerIndex}>
                      <span>{index + 1}</span>
                    </div>

                    <div className={styles.passengerInfo}>
                      <h4>
                        {passenger.title} {passenger.firstName}{" "}
                        {passenger.lastName}
                      </h4>
                      <div className={styles.passengerContacts}>
                        <span className={styles.contactItem}>
                          <span className={styles.contactIcon}>✉️</span>
                          {passenger.email}
                        </span>
                        <span className={styles.contactItem}>
                          <span className={styles.contactIcon}>📞</span>
                          {passenger.phone}
                        </span>
                      </div>
                    </div>

                    <div className={styles.passengerStatus}>
                      <div className={styles.statusBadge}>Primary</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className={styles.quickActions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <div className={styles.actionsHeader}>
                <h3>Quick Actions</h3>
                <p>Manage your booking</p>
              </div>

              <div className={styles.actionGrid}>
                <motion.button
                  className={styles.actionButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.print()}>
                  <div className={styles.actionIcon}>🖨️</div>
                  <div className={styles.actionContent}>
                    <span>Print Itinerary</span>
                    <small>Physical copy</small>
                  </div>
                </motion.button>

                <motion.button
                  className={styles.actionButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert("Email resent successfully!")}>
                  <div className={styles.actionIcon}>📧</div>
                  <div className={styles.actionContent}>
                    <span>Resend Email</span>
                    <small>Confirmation</small>
                  </div>
                </motion.button>

                <motion.button
                  className={styles.actionButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert("E-ticket downloaded!")}>
                  <div className={styles.actionIcon}>📥</div>
                  <div className={styles.actionContent}>
                    <span>Download Ticket</span>
                    <small>Digital copy</small>
                  </div>
                </motion.button>

                <motion.button
                  className={styles.actionButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert("Support contact opened!")}>
                  <div className={styles.actionIcon}>💬</div>
                  <div className={styles.actionContent}>
                    <span>Contact Support</span>
                    <small>24/7 available</small>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div
              className={styles.supportCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}>
              <div className={styles.supportHeader}>
                <div className={styles.supportIcon}>🛟</div>
                <div className={styles.supportTitle}>
                  <h4>Need Help?</h4>
                  <p>We're here for you</p>
                </div>
              </div>

              <div className={styles.supportInfo}>
                <div className={styles.supportContact}>
                  <span className={styles.contactIcon}>📞</span>
                  <span>+1 (800) 123-4567</span>
                </div>
                <div className={styles.supportContact}>
                  <span className={styles.contactIcon}>✉️</span>
                  <span>support@flightbook.com</span>
                </div>
                <div className={styles.supportContact}>
                  <span className={styles.contactIcon}>💬</span>
                  <span>Live Chat Available</span>
                </div>
              </div>
            </motion.div>

            {/* New Booking Button */}
            <motion.div
              className={styles.newBookingContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}>
              <motion.button
                className={styles.newBookingButton}
                onClick={onNewBooking}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <div className={styles.bookingIcon}>✈️</div>
                <div className={styles.bookingText}>
                  <span>Book Another Flight</span>
                  <small>Start new journey</small>
                </div>
                <div className={styles.bookingArrow}>→</div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
