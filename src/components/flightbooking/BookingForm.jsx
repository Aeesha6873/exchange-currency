import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./BookingForm.module.css";

const BookingForm = ({ flight, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    passengers: [
      {
        title: "Mr",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passport: "",
        dob: "",
      },
    ],
    paymentMethod: "credit",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    acceptTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    const bookingId =
      "BK" + Math.random().toString(36).substr(2, 8).toUpperCase();
    onComplete({ ...formData, bookingId });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalPrice = flight.price.amount + 85;

  return (
    <div className={styles.bookingPage}>
      <div className={styles.bookingContainer}>
        {/* Header */}
        <motion.div
          className={styles.bookingHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div className={styles.headerContent}>
            <motion.button
              className={styles.backButton}
              onClick={onBack}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}>
              ← Back to Results
            </motion.button>

            <div className={styles.headerMain}>
              <div className={styles.headerTitleSection}>
                <h1 className={styles.headerTitle}>Complete Your Booking</h1>
                <p className={styles.headerSubtitle}>
                  Final step to secure your flight
                </p>
              </div>
            </div>

            <div className={styles.flightHeaderInfo}>
              <div className={styles.flightRouteMini}>
                <div className={styles.airportCodeMini}>
                  {flight.departure.code}
                </div>
                <div className={styles.routeArrowMini}>→</div>
                <div className={styles.airportCodeMini}>
                  {flight.arrival.code}
                </div>
              </div>
              <div className={styles.flightDetailsMini}>
                <span>{flight.airline}</span>
                <span>•</span>
                <span>{flight.flightNumber}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className={styles.bookingLayout}>
          {/* Summary Sidebar */}
          <div className={styles.summarySidebar}>
            <motion.div
              className={`${styles.summaryCard} ${styles.flightSummary}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}>
              <div className={styles.summaryHeader}>
                <div className={styles.summaryIcon}>⟁</div>
                <div className={styles.summaryTitle}>
                  <h3>Flight Details</h3>
                  <p>
                    {flight.departure.date} • {flight.cabinClass}
                  </p>
                </div>
              </div>

              <div className={styles.flightVisual}>
                <div className={styles.flightPath}>
                  <div className={styles.pathDot}></div>
                  <div className={styles.pathDot}></div>
                </div>

                <div className={styles.flightCities}>
                  <div className={styles.cityInfo}>
                    <div className={styles.cityCode}>
                      {flight.departure.code}
                    </div>
                    <div className={styles.cityName}>
                      {flight.departure.city}
                    </div>
                    <div className={styles.cityTime}>
                      {flight.departure.time}
                    </div>
                  </div>

                  <div className={styles.flightDuration}>
                    <div className={styles.durationIcon}>⏱️</div>
                    <div className={styles.durationText}>{flight.duration}</div>
                    <div className={styles.distanceLabel}>Non-stop</div>
                  </div>

                  <div className={styles.cityInfo}>
                    <div className={styles.cityCode}>{flight.arrival.code}</div>
                    <div className={styles.cityName}>{flight.arrival.city}</div>
                    <div className={styles.cityTime}>{flight.arrival.time}</div>
                  </div>
                </div>
              </div>

              <div className={styles.flightSpecs}>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Airline</div>
                  <div className={styles.specValue}>{flight.airline}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Flight No.</div>
                  <div className={styles.specValue}>{flight.flightNumber}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Aircraft</div>
                  <div className={styles.specValue}>{flight.aircraft}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Class</div>
                  <div className={styles.specValue}>{flight.cabinClass}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.summaryCard} ${styles.priceSummary}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}>
              <div className={styles.summaryHeader}>
                <div className={styles.summaryIcon}>⊡</div>
                <div className={styles.summaryTitle}>
                  <h3>Price Breakdown</h3>
                  <p>Including all taxes & fees</p>
                </div>
              </div>

              <div className={styles.priceMatrix}>
                <div className={styles.priceRow}>
                  <div className={styles.priceLabel}>Base Fare</div>
                  <div className={styles.priceAmount}>
                    {formatPrice(flight.price.amount)}
                  </div>
                </div>
                <div className={styles.priceRow}>
                  <div className={styles.priceLabel}>Taxes & Fees</div>
                  <div className={styles.priceAmount}>$85.00</div>
                </div>
                <div className={styles.priceRow}>
                  <div className={styles.priceLabel}>Service Charge</div>
                  <div className={styles.priceAmount}>$0.00</div>
                </div>

                <div className={styles.priceDivider}></div>

                <div className={styles.priceTotal}>
                  <div className={styles.totalLabel}>Total Amount</div>
                  <div className={styles.totalAmount}>
                    {formatPrice(totalPrice)}
                    <div className={styles.totalSub}>Including all charges</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              className={styles.securityBadge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <div className={styles.securityIcon}>🔒</div>
              <div className={styles.securityText}>
                <h4>Secure & Encrypted</h4>
                <p>256-bit SSL • PCI DSS Compliant</p>
              </div>
              <div className={styles.securityStatus}>
                <div className={styles.statusDot}></div>
                <span>Secure</span>
              </div>
            </motion.div>
          </div>

          {/* Form Container */}
          <motion.div
            className={styles.formContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <div className={styles.formSectionsContainer}>
              <form onSubmit={handleSubmit}>
                {/* Passenger Information */}
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>✎</div>
                    <div className={styles.sectionTitle}>
                      <h3>Passenger Details</h3>
                      <p>Enter information for all travelers</p>
                    </div>
                  </div>

                  <div className={styles.passengerForms}>
                    {formData.passengers.map((passenger, index) => (
                      <motion.div
                        key={index}
                        className={styles.passengerCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}>
                        <div className={styles.passengerHeader}>
                          <div className={styles.passengerNumber}>
                            <span>{index + 1}</span>
                          </div>
                          <div className={styles.passengerTitle}>
                            <h4>Traveler {index + 1}</h4>
                            <p>Primary passenger</p>
                          </div>
                        </div>

                        <div className={styles.formGrid}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <span className={styles.labelText}>Title</span>
                              <span className={styles.required}>*</span>
                            </label>
                            <select
                              className={styles.formInput}
                              value={passenger.title}
                              onChange={(e) => {
                                const newPassengers = [...formData.passengers];
                                newPassengers[index].title = e.target.value;
                                setFormData({
                                  ...formData,
                                  passengers: newPassengers,
                                });
                              }}
                              required>
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Ms">Ms</option>
                              <option value="Dr">Dr</option>
                            </select>
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <span className={styles.labelText}>
                                First Name
                              </span>
                              <span className={styles.required}>*</span>
                            </label>
                            <input
                              type="text"
                              className={styles.formInput}
                              value={passenger.firstName}
                              onChange={(e) => {
                                const newPassengers = [...formData.passengers];
                                newPassengers[index].firstName = e.target.value;
                                setFormData({
                                  ...formData,
                                  passengers: newPassengers,
                                });
                              }}
                              required
                              placeholder="Enter first name"
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <span className={styles.labelText}>
                                Last Name
                              </span>
                              <span className={styles.required}>*</span>
                            </label>
                            <input
                              type="text"
                              className={styles.formInput}
                              value={passenger.lastName}
                              onChange={(e) => {
                                const newPassengers = [...formData.passengers];
                                newPassengers[index].lastName = e.target.value;
                                setFormData({
                                  ...formData,
                                  passengers: newPassengers,
                                });
                              }}
                              required
                              placeholder="Enter last name"
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <span className={styles.labelText}>Email</span>
                              <span className={styles.required}>*</span>
                            </label>
                            <input
                              type="email"
                              className={styles.formInput}
                              value={passenger.email}
                              onChange={(e) => {
                                const newPassengers = [...formData.passengers];
                                newPassengers[index].email = e.target.value;
                                setFormData({
                                  ...formData,
                                  passengers: newPassengers,
                                });
                              }}
                              required
                              placeholder="email@example.com"
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <span className={styles.labelText}>Phone</span>
                              <span className={styles.required}>*</span>
                            </label>
                            <input
                              type="tel"
                              className={styles.formInput}
                              value={passenger.phone}
                              onChange={(e) => {
                                const newPassengers = [...formData.passengers];
                                newPassengers[index].phone = e.target.value;
                                setFormData({
                                  ...formData,
                                  passengers: newPassengers,
                                });
                              }}
                              required
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <span className={styles.labelText}>
                                Passport Number
                              </span>
                            </label>
                            <input
                              type="text"
                              className={styles.formInput}
                              value={passenger.passport}
                              onChange={(e) => {
                                const newPassengers = [...formData.passengers];
                                newPassengers[index].passport = e.target.value;
                                setFormData({
                                  ...formData,
                                  passengers: newPassengers,
                                });
                              }}
                              placeholder="Enter passport number"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>💳</div>
                    <div className={styles.sectionTitle}>
                      <h3>Payment Method</h3>
                      <p>Choose your preferred payment option</p>
                    </div>
                  </div>

                  <div className={styles.paymentSelector}>
                    {[
                      { id: "credit", label: "Credit Card", icon: "💳" },
                      { id: "debit", label: "Debit Card", icon: "💳" },
                      { id: "paypal", label: "PayPal", icon: "🔵" },
                    ].map((method) => (
                      <motion.div
                        key={method.id}
                        className={`${styles.paymentMethod} ${
                          formData.paymentMethod === method.id
                            ? styles.active
                            : ""
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: method.id })
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        <div className={styles.paymentIcon}>{method.icon}</div>
                        <div className={styles.methodLabel}>{method.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.labelText}>Card Number</span>
                        <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWrapper}>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardNumber: e.target.value,
                            })
                          }
                          required
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        <div className={styles.cardBrand}>💳</div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.labelText}>Expiry Date</span>
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={formData.cardExpiry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardExpiry: e.target.value,
                          })
                        }
                        required
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.labelText}>CVV</span>
                        <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWrapper}>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={formData.cardCvv}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardCvv: e.target.value,
                            })
                          }
                          required
                          placeholder="123"
                          maxLength="4"
                        />
                        <div className={styles.infoIcon}>?</div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span className={styles.labelText}>
                          Cardholder Name
                        </span>
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={formData.cardName}
                        onChange={(e) =>
                          setFormData({ ...formData, cardName: e.target.value })
                        }
                        required
                        placeholder="As shown on card"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className={styles.termsSection}>
                  <div className={styles.termsCard}>
                    <div className={styles.termsHeader}>
                      <div className={styles.termsIcon}>📜</div>
                      <h4>Terms & Conditions</h4>
                    </div>

                    <div className={styles.termsContent}>
                      <p className={styles.termsText}>
                        By completing this booking, you agree to our Terms of
                        Service, Privacy Policy, and the airline's specific
                        conditions. Please review cancellation policies as they
                        vary by airline.
                      </p>

                      <div className={styles.termsCheckbox}>
                        <input
                          type="checkbox"
                          id="acceptTerms"
                          className={styles.checkboxInput}
                          checked={formData.acceptTerms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              acceptTerms: e.target.checked,
                            })
                          }
                          required
                        />
                        <label
                          htmlFor="acceptTerms"
                          className={styles.termsLabel}>
                          <div className={styles.checkboxCustom}></div>
                          <span className={styles.agreeText}>
                            I accept all terms and conditions
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions - This is now fixed at bottom */}
                <div className={styles.formActions}>
                  <div className={styles.actionsWrapper}>
                    <div className={styles.totalPreview}>
                      <div className={styles.previewLabel}>Total Payment</div>
                      <div className={styles.previewAmount}>
                        {formatPrice(totalPrice)}
                      </div>
                      <div className={styles.previewNote}>
                        Includes taxes and fees
                      </div>
                    </div>

                    <div className={styles.actionButtons}>
                      <motion.button
                        type="button"
                        className={`${styles.actionButton} ${styles.buttonSecondary}`}
                        onClick={onBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        <span className={styles.buttonIcon}>←</span>
                        Go Back
                      </motion.button>

                      <motion.button
                        type="submit"
                        className={`${styles.actionButton} ${styles.buttonPrimary}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!formData.acceptTerms}>
                        <span className={styles.buttonIcon}>✓</span>
                        <div className={styles.buttonContent}>
                          <span>Confirm & Pay</span>
                          <span className={styles.buttonSubtext}>
                            {formatPrice(totalPrice)}
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
