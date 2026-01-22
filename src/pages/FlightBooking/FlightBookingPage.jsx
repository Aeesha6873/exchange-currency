import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightSearch from "../../components/flightbooking/FlightSearch";
import FlightResults from "../../components/flightbooking/FlightResults";
import BookingForm from "../../components/flightbooking/BookingForm";
import Confirmation from "../../components/flightbooking/Confirmation";
// import Nav from "../../components/Navbar";
// import Footer from "../../components/Footer";
import styles from "./FlightBookingPage.module.css";

function FlightBookingPage() {
  const [currentStep, setCurrentStep] = useState("search");
  const [searchData, setSearchData] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { id: "search", label: "Flight Search", icon: "⟁", color: "var(--green)" },
    {
      id: "results",
      label: "Select Flight",
      icon: "⊡",
      color: "var(--dark-green)",
    },
    {
      id: "booking",
      label: "Passenger Details",
      icon: "✎",
      color: "var(--green)",
    },
    {
      id: "confirmation",
      label: "Confirmation",
      icon: "✓",
      color: "var(--dark-green)",
    },
  ];

  const handleSearch = (searchParams) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSearchData(searchParams);
      setCurrentStep("results");
      setIsAnimating(false);
    }, 400);
  };

  const handleSelectFlight = (flight) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedFlight(flight);
      setCurrentStep("booking");
      setIsAnimating(false);
    }, 400);
  };

  const handleBookingComplete = (data) => {
    setIsAnimating(true);
    setTimeout(() => {
      setBookingData(data);
      setCurrentStep("confirmation");
      setIsAnimating(false);
    }, 400);
  };

  const handleNewBooking = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSearchData(null);
      setSelectedFlight(null);
      setBookingData(null);
      setCurrentStep("search");
      setIsAnimating(false);
    }, 400);
  };

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const currentStepConfig = steps[currentStepIndex];

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.95, rotateX: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      rotateX: 10,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className={styles.bookingPage}>
      {/* <Nav /> */}

      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridLines}></div>
        <div className={styles.floatingOrbs}>
          <div className={styles.orb1}></div>
          <div className={styles.orb2}></div>
          <div className={styles.orb3}></div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Step Navigation */}
          <div className={styles.stepNavigation}>
            <div className={styles.stepProgress}>
              <div
                className={styles.progressLine}
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  background: `linear-gradient(90deg, var(--green), var(--dark-green))`,
                }}></div>
            </div>

            <div className={styles.stepIndicators}>
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const isUpcoming = index > currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`${styles.stepIndicator} ${
                      isActive ? styles.active : ""
                    } ${isCompleted ? styles.completed : ""} ${
                      isUpcoming ? styles.upcoming : ""
                    }`}
                    style={{
                      "--step-color": step.color,
                      animationDelay: `${index * 100}ms`,
                    }}>
                    <div className={styles.indicatorRing}>
                      <div className={styles.indicatorDot}></div>
                      <span className={styles.stepIcon}>{step.icon}</span>
                    </div>
                    <span className={styles.stepName}>{step.label}</span>
                    {isActive && (
                      <motion.div
                        className={styles.activePulse}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Area - FIXED: Made side panel sticky */}
          <div className={styles.contentArea}>
            {/* Fixed Sidebar - Stays visible while scrolling */}
            {/* <div className={styles.sidePanel}>
              <div className={styles.sidePanelSticky}>
                <div className={styles.currentStepInfo}>
                  <motion.div
                    className={styles.stepNumber}
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}>
                    <span>0{currentStepIndex + 1}</span>
                  </motion.div>
                  <div className={styles.stepInfo}>
                    <h3 className={styles.stepTitle}>
                      {currentStepConfig.label}
                    </h3>
                    <p className={styles.stepDescription}>
                      {currentStep === "search" &&
                        "Enter your travel preferences to find the perfect flight"}
                      {currentStep === "results" &&
                        "Browse and select from available flight options"}
                      {currentStep === "booking" &&
                        "Provide passenger details and complete payment"}
                      {currentStep === "confirmation" &&
                        "Review your booking confirmation and details"}
                    </p>
                  </div>
                  <div className={styles.progressDots}>
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`${styles.progressDot} ${
                          index === currentStepIndex ? styles.active : ""
                        } ${index < currentStepIndex ? styles.completed : ""}`}
                      />
                    ))}
                  </div>
                </div>

                {currentStep !== "confirmation" && (
                  <div className={styles.quickHelp}>
                    <div className={styles.helpHeader}>
                      <span className={styles.helpIcon}>⚡</span>
                      <span>Quick Tips</span>
                    </div>
                    <ul className={styles.tipsList}>
                      <li>Use flexible dates for better prices</li>
                      <li>Check baggage policies before booking</li>
                      <li>Save your preferences for faster booking</li>
                    </ul>
                  </div>
                )}
              </div>
            </div> */}

            {/* Main Content Card */}
            <div className={styles.mainCard}>
              {/* <div className={styles.cardHeader}>
                <div className={styles.cardGlow}></div>
                <h2 className={styles.cardTitle}>
                  {currentStep === "search" && "Find Your Flight"}
                  {currentStep === "results" && "Available Flights"}
                  {currentStep === "booking" && "Complete Your Booking"}
                  {currentStep === "confirmation" && "Booking Confirmed"}
                </h2>
                <div className={styles.cardSubtitle}>
                  <span className={styles.subtitleLine}></span>
                  <span className={styles.subtitleText}>
                    {currentStep === "search" && "Begin your journey"}
                    {currentStep === "results" &&
                      "Select your preferred option"}
                    {currentStep === "booking" && "Finalize your travel plans"}
                    {currentStep === "confirmation" && "Your adventure awaits"}
                  </span>
                </div>
              </div> */}

              <div className={styles.cardContent}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={styles.contentWrapper}>
                    {isAnimating ? (
                      <div className={styles.loadingState}>
                        <div className={styles.neonSpinner}>
                          <div className={styles.spinnerCore}></div>
                          <div className={styles.spinnerRing}></div>
                        </div>
                        <p className={styles.loadingText}>Processing...</p>
                        <div className={styles.loadingDots}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {currentStep === "search" && (
                          <FlightSearch onSearch={handleSearch} />
                        )}

                        {currentStep === "results" && searchData && (
                          <FlightResults
                            searchParams={searchData}
                            onSelectFlight={handleSelectFlight}
                            onBack={() => setCurrentStep("search")}
                          />
                        )}

                        {currentStep === "booking" && selectedFlight && (
                          <BookingForm
                            flight={selectedFlight}
                            searchParams={searchData}
                            onComplete={handleBookingComplete}
                            onBack={() => setCurrentStep("results")}
                          />
                        )}

                        {currentStep === "confirmation" && bookingData && (
                          <Confirmation
                            bookingData={bookingData}
                            flight={selectedFlight}
                            onNewBooking={handleNewBooking}
                          />
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.footerStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Step</span>
                    <span className={styles.statValue}>
                      0{currentStepIndex + 1}/04
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Status</span>
                    <span className={styles.statValue}>
                      {currentStep === "confirmation"
                        ? "Complete"
                        : "In Progress"}
                    </span>
                  </div>
                </div>
                {/* {currentStep !== "confirmation" && (
                  <button className={styles.assistButton}>
                    <span className={styles.assistIcon}>⟳</span>
                    AI Assist
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default FlightBookingPage;
