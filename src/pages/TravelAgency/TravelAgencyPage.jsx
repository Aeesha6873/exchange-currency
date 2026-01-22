import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
import DestinationInspiration from "../../components/travelAgency/DestinationInspiration";
import TravelPackages from "../../components/travelAgency/TravelPackages";
import PackageCustomizer from "../../components/travelAgency/PackageCustomizer";
import TravelConsultant from "../../components/travelAgency/TravelConsultant";
import GroupBooking from "../../components/travelAgency/GroupBooking";
import TravelItinerary from "../../components/travelAgency/TravelItinerary";
import TravelDocuments from "../../components/travelAgency/TravelDocuments";
import { TravelIcons } from "../../components/travelAgency/TravelIcons";
import ChatInterface from "../../components/travelAgency/ChatInterface";
import styles from "./TravelAgencyPage.module.css";

export default function TravelAgencyPage() {
  const [currentStep, setCurrentStep] = useState("inspiration");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customizedPackage, setCustomizedPackage] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      id: "inspiration",
      label: "Get Inspired",
      icon: <TravelIcons.Heart />,
      color: "var(--green)",
    },
    {
      id: "packages",
      label: "Choose Package",
      icon: <TravelIcons.Package />,
      color: "var(--orange)",
    },
    {
      id: "customize",
      label: "Customize",
      icon: <TravelIcons.Star />,
      color: "var(--green)",
    },
    {
      id: "consult",
      label: "Get Advice",
      icon: <TravelIcons.Assistant />,
      color: "var(--orange)",
    },
    {
      id: "book",
      label: "Book & Pay",
      icon: <TravelIcons.CheckCircle />,
      color: "var(--green)",
    },
    {
      id: "documents",
      label: "Travel Docs",
      icon: <TravelIcons.Passport />,
      color: "var(--orange)",
    },
  ];

  const stepDescriptions = {
    inspiration: "Browse destinations and get travel inspiration",
    packages: "Select from curated travel packages",
    customize: "Personalize your package with upgrades and add-ons",
    consult: "Get expert advice from our travel consultants",
    book: "Complete booking and payment",
    documents: "Access your travel documents and itinerary",
  };

  const handleSelectDestination = (destination) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedDestination(destination);
      setCurrentStep("packages");
      setIsAnimating(false);
    }, 400);
  };

  const handleSelectPackage = (packageData) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedPackage(packageData);
      setCurrentStep("customize");
      setIsAnimating(false);
    }, 400);
  };

  const handleCustomizeComplete = (customized) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCustomizedPackage(customized);
      setCurrentStep("consult");
      setIsAnimating(false);
    }, 400);
  };

  const handleConsultationComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep("book");
      setIsAnimating(false);
    }, 400);
  };

  const handleBookingComplete = (data) => {
    setIsAnimating(true);
    setTimeout(() => {
      setBookingData(data);
      setCurrentStep("documents");
      setIsAnimating(false);
    }, 400);
  };

  const handleNewTrip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedDestination(null);
      setSelectedPackage(null);
      setCustomizedPackage(null);
      setBookingData(null);
      setCurrentStep("inspiration");
      setIsAnimating(false);
    }, 400);
  };

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const currentStepConfig = steps[currentStepIndex];

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className={styles.travelAgencyPage}>
      {/* <Navbar /> */}

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gridLines}></div>
        <div className={styles.floatingOrbs}>
          <div className={styles.orb1}></div>
          <div className={styles.orb2}></div>
          <div className={styles.orb3}></div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Step Navigation - Only show after inspiration */}
          {currentStep !== "inspiration" && (
            <div className={styles.stepNavigation}>
              <div className={styles.stepProgress}>
                <div
                  className={styles.progressLine}
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                    background: `linear-gradient(90deg, var(--green), var(--orange))`,
                  }}></div>
              </div>

              <div className={styles.stepIndicators}>
                {steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`${styles.stepIndicator} ${
                        isActive ? styles.active : ""
                      } ${isCompleted ? styles.completed : ""}`}
                      style={{
                        "--step-color": step.color,
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
          )}

          {/* Content Area */}
          <div className={styles.contentArea}>
            {/* Side Panel - Only show after inspiration */}
            {currentStep !== "inspiration" && (
              <div className={styles.sidePanel}>
                <div className={styles.sidePanelSticky}>
                  {/* Current Step Info */}
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
                        {stepDescriptions[currentStep]}
                      </p>
                    </div>
                    <div className={styles.progressDots}>
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`${styles.progressDot} ${
                            index === currentStepIndex ? styles.active : ""
                          } ${
                            index < currentStepIndex ? styles.completed : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick Help */}
                  {currentStep !== "documents" && (
                    <div className={styles.quickHelp}>
                      <div className={styles.helpHeader}>
                        <span className={styles.helpIcon}>
                          <TravelIcons.Lightbulb />
                        </span>
                        <span>Travel Tips</span>
                      </div>
                      <ul className={styles.tipsList}>
                        <li>Book 60+ days in advance for best prices</li>
                        <li>Check visa requirements before booking</li>
                        <li>Travel insurance recommended for all trips</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main Card */}
            <div
              className={`${styles.mainCard} ${
                currentStep === "inspiration" ? styles.fullWidth : ""
              }`}>
              {currentStep !== "inspiration" && (
                <div className={styles.cardHeader}>
                  <div className={styles.cardGlow}></div>
                  <h2 className={styles.cardTitle}>
                    {currentStep === "packages" &&
                      `Packages for ${selectedDestination?.name}`}
                    {currentStep === "customize" && "Customize Your Package"}
                    {currentStep === "consult" && "Expert Travel Advice"}
                    {currentStep === "book" && "Complete Your Booking"}
                    {currentStep === "documents" && "Travel Documents"}
                  </h2>
                  <div className={styles.cardSubtitle}>
                    <span className={styles.subtitleLine}></span>
                    <span className={styles.subtitleText}>
                      {stepDescriptions[currentStep]}
                    </span>
                  </div>
                </div>
              )}

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
                        <p className={styles.loadingText}>Loading...</p>
                        <div className={styles.loadingDots}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {currentStep === "inspiration" && (
                          <DestinationInspiration
                            onSelectDestination={handleSelectDestination}
                          />
                        )}
                        {currentStep === "packages" && selectedDestination && (
                          <TravelPackages
                            destination={selectedDestination}
                            onSelectPackage={handleSelectPackage}
                            onBack={() => setCurrentStep("inspiration")}
                          />
                        )}
                        {currentStep === "customize" && selectedPackage && (
                          <PackageCustomizer
                            package={selectedPackage}
                            onComplete={handleCustomizeComplete}
                            onBack={() => setCurrentStep("packages")}
                          />
                        )}
                        {currentStep === "consult" && customizedPackage && (
                          <TravelConsultant
                            package={customizedPackage}
                            onComplete={handleConsultationComplete}
                            onBack={() => setCurrentStep("customize")}
                          />
                        )}
                        {currentStep === "book" && customizedPackage && (
                          <GroupBooking
                            package={customizedPackage}
                            onComplete={handleBookingComplete}
                            onBack={() => setCurrentStep("consult")}
                          />
                        )}
                        {currentStep === "documents" && bookingData && (
                          <TravelDocuments
                            bookingData={bookingData}
                            onNewTrip={handleNewTrip}
                          />
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card Footer */}
              {currentStep !== "inspiration" && (
                <div className={styles.cardFooter}>
                  <div className={styles.footerStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Step</span>
                      <span className={styles.statValue}>
                        0{currentStepIndex + 1}/06
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Status</span>
                      <span className={styles.statValue}>
                        {currentStep === "documents"
                          ? "Complete"
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                  {currentStep !== "documents" && currentStep !== "book" && (
                    <button className={styles.assistButton}>
                      <span className={styles.assistIcon}>
                        <TravelIcons.Assistant />
                      </span>
                      Need Help?
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
