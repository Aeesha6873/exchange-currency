import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobe,
  FaPlaneDeparture,
  FaCalendarAlt,
  FaUser,
  FaFileUpload,
  FaCreditCard,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaFlag,
  FaClock,
  FaCalendarDay,
  FaUserCircle,
  FaPassport,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUpload,
  FaTrash,
  FaPrint,
  FaRobot,
  FaEye,
  FaDownload,
  FaCheck,
  FaChevronDown,
  FaInfoCircle,
} from "react-icons/fa";
import "./VisaService.css";

export default function VisaServicePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    country: "",
    departureTime: "",
    duration: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passportNumber: "",
    nationality: "",
    passportFile: null,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const steps = [
    { id: 1, label: "Country", icon: <FaGlobe />, color: "var(--green)" },
    {
      id: 2,
      label: "Departure",
      icon: <FaPlaneDeparture />,
      color: "var(--orange)",
    },
    {
      id: 3,
      label: "Duration",
      icon: <FaCalendarAlt />,
      color: "var(--green)",
    },
    { id: 4, label: "Details", icon: <FaUser />, color: "var(--orange)" },
    { id: 5, label: "Upload", icon: <FaFileUpload />, color: "var(--green)" },
    { id: 6, label: "Payment", icon: <FaCreditCard />, color: "var(--orange)" },
    {
      id: 7,
      label: "Complete",
      icon: <FaCheckCircle />,
      color: "var(--green)",
    },
  ];

  const countries = [
    {
      id: "uk",
      name: "United Kingdom",
      flag: "🇬🇧",
      price: 450,
      currency: "£",
      processing: "5-7 days",
    },
    {
      id: "china",
      name: "China",
      flag: "🇨🇳",
      price: 350,
      currency: "¥",
      processing: "7-10 days",
    },
    {
      id: "umarah",
      name: "Umarah",
      flag: "🇸🇦",
      price: 300,
      currency: "SAR",
      processing: "3-5 days",
    },
    {
      id: "qatar",
      name: "Qatar",
      flag: "🇶🇦",
      price: 400,
      currency: "QAR",
      processing: "4-6 days",
    },
    {
      id: "dubai",
      name: "Dubai",
      flag: "🇦🇪",
      price: 380,
      currency: "AED",
      processing: "2-4 days",
    },
    {
      id: "algeria",
      name: "Algeria",
      flag: "🇩🇿",
      price: 250,
      currency: "DZD",
      processing: "5-8 days",
    },
  ];

  const departureTimes = [
    { id: "urgent", label: "Urgent", range: "24-48 hours", icon: <FaClock /> },
    {
      id: "express",
      label: "Express",
      range: "3-5 days",
      icon: <FaCalendarDay />,
    },
    {
      id: "standard",
      label: "Standard",
      range: "7-10 days",
      icon: <FaCalendarAlt />,
    },
    {
      id: "regular",
      label: "Regular",
      range: "15-20 days",
      icon: <FaCalendarDay />,
    },
  ];

  const durations = [
    {
      id: "30",
      label: "Short Stay",
      months: "1 month",
      icon: <FaCalendarDay />,
    },
    { id: "90", label: "Tourist", months: "3 months", icon: <FaCalendarAlt /> },
    {
      id: "180",
      label: "Business",
      months: "6 months",
      icon: <FaCalendarDay />,
    },
    {
      id: "365",
      label: "Long Term",
      months: "1 year",
      icon: <FaCalendarAlt />,
    },
    {
      id: "730",
      label: "Residence",
      months: "2 years",
      icon: <FaCalendarDay />,
    },
  ];

  const stepDescriptions = {
    1: "Select your destination country from the dropdown",
    2: "Choose when you need your visa processed",
    3: "Select your visa duration",
    4: "Fill in your personal details",
    5: "Upload your passport data page",
    6: "Review and complete payment",
    7: "Application submitted successfully!",
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      setIsAnimating(false);
    }, 400);
  };

  const handleStepBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }, 400);
  };

  const handleCountrySelect = (e) => {
    const countryId = e.target.value;
    setApplicationData({ ...applicationData, country: countryId });
  };

  const handleDepartureSelect = (timeId) => {
    setApplicationData({ ...applicationData, departureTime: timeId });
  };

  const handleDurationSelect = (durationId) => {
    setApplicationData({ ...applicationData, duration: durationId });
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match("image.*|application/pdf")) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setApplicationData({
        ...applicationData,
        passportFile: {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          type: file.type,
          url: URL.createObjectURL(file),
        },
      });
    } else {
      alert("Please upload a valid image or PDF file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.match("image.*|application/pdf")) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setApplicationData({
        ...applicationData,
        passportFile: {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          type: file.type,
          url: URL.createObjectURL(file),
        },
      });
    } else {
      alert("Please upload a valid image or PDF file");
    }
  };

  const handleRemovePassport = () => {
    if (applicationData.passportFile?.url) {
      URL.revokeObjectURL(applicationData.passportFile.url);
    }
    setApplicationData({ ...applicationData, passportFile: null });
  };

  const handleUploadSubmit = () => {
    if (!applicationData.passportFile) {
      alert("Please upload your passport data page");
      return;
    }
    handleNext();
  };

  const handlePaymentSubmit = () => {
    handleNext();
  };

  const resetApplication = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(1);
      setApplicationData({
        country: "",
        departureTime: "",
        duration: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passportNumber: "",
        nationality: "",
        passportFile: null,
      });
      setIsAnimating(false);
    }, 400);
  };

  const calculateTotalPrice = () => {
    const country = countries.find((c) => c.id === applicationData.country);
    return country?.price || 0;
  };

  const getCountryName = () => {
    return countries.find((c) => c.id === applicationData.country)?.name || "";
  };

  const getCountryFlag = () => {
    return countries.find((c) => c.id === applicationData.country)?.flag || "";
  };

  const getCountryCurrency = () => {
    return (
      countries.find((c) => c.id === applicationData.country)?.currency || "$"
    );
  };

  const getCountryProcessing = () => {
    return (
      countries.find((c) => c.id === applicationData.country)?.processing || ""
    );
  };

  const getDepartureLabel = () => {
    return (
      departureTimes.find((t) => t.id === applicationData.departureTime)
        ?.range || ""
    );
  };

  const getDurationLabel = () => {
    return (
      durations.find((d) => d.id === applicationData.duration)?.months || ""
    );
  };

  const currentStepIndex = currentStep - 1;
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && currentStep > 1) {
        handleStepBack();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentStep]);

  return (
    <div className="visaServicePage">
      <main className="visaMain">
        <div className="visaContainer">
          {/* Step Navigation */}
          <div className="visaStepNavigation">
            <div className="visaStepProgress">
              <div
                className="visaProgressLine"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  background: `linear-gradient(90deg, var(--green), var(--dark-green))`,
                }}></div>
            </div>

            <div className="visaStepIndicators">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`visaStepIndicator ${isActive ? "active" : ""} ${
                      isCompleted ? "completed" : ""
                    }`}
                    style={{
                      "--step-color": step.color,
                      animationDelay: `${index * 100}ms`,
                    }}>
                    <div className="visaIndicatorRing">
                      <div className="visaIndicatorDot"></div>
                      <span className="visaStepIcon">{step.icon}</span>
                    </div>
                    <span className="visaStepName">{step.label}</span>
                    {isActive && (
                      <motion.div
                        className="visaActivePulse"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="visaContentArea">
            {/* Side Panel */}
            <div className="visaSidePanel">
              <div className="visaSidePanelSticky">
                <div className="visaCurrentStepInfo">
                  <motion.div
                    className="visaStepNumber"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}>
                    <span>0{currentStep}</span>
                  </motion.div>
                  <div className="visaStepInfo">
                    <h3 className="visaStepTitle">{currentStepConfig.label}</h3>
                    <p className="visaStepDescription">
                      {stepDescriptions[currentStep]}
                    </p>
                  </div>
                  <div className="visaProgressDots">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`visaProgressDot ${
                          index === currentStepIndex ? "active" : ""
                        } ${index < currentStepIndex ? "completed" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                {currentStep !== 7 && (
                  <div className="visaQuickHelp">
                    <div className="visaHelpHeader">
                      <span className="visaHelpIcon">
                        <FaRobot />
                      </span>
                      <span>Visa Tips</span>
                    </div>
                    <ul className="visaTipsList">
                      <li>Ensure passport is valid for 6+ months</li>
                      <li>Clear scan of passport data page required</li>
                      <li>Processing time depends on selected duration</li>
                      <li>Keep reference number for tracking</li>
                    </ul>
                  </div>
                )}

                {/* Pricing Summary */}
                {applicationData.country && (
                  <div className="pricing-summary">
                    <div className="pricing-header">
                      <div className="pricing-title">Estimated Total</div>
                      <div className="pricing-total">
                        {getCountryCurrency()}
                        {calculateTotalPrice()}
                      </div>
                    </div>
                    <div className="pricing-details">
                      <div className="pricing-item">
                        <span className="pricing-label">Visa Fee</span>
                        <span className="pricing-value">
                          {getCountryCurrency()}
                          {calculateTotalPrice()}
                        </span>
                      </div>
                      {applicationData.departureTime && (
                        <div className="pricing-item">
                          <span className="pricing-label">Processing Time</span>
                          <span className="pricing-value">
                            {getDepartureLabel()}
                          </span>
                        </div>
                      )}
                      {applicationData.duration && (
                        <div className="pricing-item">
                          <span className="pricing-label">Duration</span>
                          <span className="pricing-value">
                            {getDurationLabel()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Card */}
            <div className="visaMainCard">
              <div className="visaCardHeader">
                <div className="visaCardGlow"></div>
                <h2 className="visaCardTitle">
                  {currentStep === 1 && "Select Destination"}
                  {currentStep === 2 && "Expected Departure"}
                  {currentStep === 3 && "Visa Duration"}
                  {currentStep === 4 && "Personal Details"}
                  {currentStep === 5 && "Upload Passport"}
                  {currentStep === 6 && "Payment"}
                  {currentStep === 7 && "Application Complete"}
                </h2>
                <div className="visaCardSubtitle">
                  <span className="visaSubtitleLine"></span>
                  <span className="visaSubtitleText">
                    {currentStep === 1 && "Choose your destination country"}
                    {currentStep === 2 &&
                      "Select your preferred processing time"}
                    {currentStep === 3 && "Choose your visa duration"}
                    {currentStep === 4 && "Enter your personal information"}
                    {currentStep === 5 && "Upload passport data page"}
                    {currentStep === 6 && "Complete your payment"}
                    {currentStep === 7 && "Submission successful"}
                  </span>
                </div>
              </div>

              <div className="visaCardContent">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="visaContentWrapper">
                    {isAnimating ? (
                      <div className="visaLoadingState">
                        <div className="visaNeonSpinner">
                          <div className="visaSpinnerCore"></div>
                          <div className="visaSpinnerRing"></div>
                        </div>
                        <p className="visaLoadingText">Processing...</p>
                        <div className="visaLoadingDots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Step 1: Country Selection */}
                        {currentStep === 1 && (
                          <div className="visaForm">
                            <div className="form-section">
                              <h3 className="section-title">
                                <FaMapMarkerAlt
                                  style={{ marginRight: "10px" }}
                                />
                                Select Your Destination
                              </h3>
                              <p className="section-subtitle">
                                Choose your destination country from the
                                dropdown below. The visa fee will be displayed
                                after selection.
                              </p>

                              <div className="country-dropdown-container">
                                <div className="country-select-wrapper">
                                  <select
                                    value={applicationData.country}
                                    onChange={handleCountrySelect}
                                    className="country-select"
                                    required>
                                    <option value="">
                                      -- Select a country --
                                    </option>
                                    {countries.map((country) => (
                                      <option
                                        key={country.id}
                                        value={country.id}>
                                        {country.flag} {country.name}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="country-select-icon">
                                    <FaChevronDown />
                                  </span>
                                </div>
                              </div>

                              {applicationData.country && (
                                <motion.div
                                  className="selected-country-info"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5 }}>
                                  <div className="selected-country-flag">
                                    {getCountryFlag()}
                                  </div>
                                  <div className="selected-country-details">
                                    <h3 className="selected-country-name">
                                      {getCountryName()}
                                      <FaCheck
                                        style={{ color: "var(--green)" }}
                                      />
                                    </h3>
                                    <div className="selected-country-price">
                                      <div className="price-tag">
                                        <span className="currency-symbol">
                                          {getCountryCurrency()}
                                        </span>
                                        <span>{calculateTotalPrice()}</span>
                                      </div>
                                      <div className="processing-info">
                                        <FaInfoCircle
                                          style={{ marginRight: "6px" }}
                                        />
                                        Standard processing:{" "}
                                        {getCountryProcessing()}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            <div className="visaActionButtons">
                              <div style={{ flex: 1 }}></div>
                              <button
                                className="visaPrimaryButton"
                                onClick={handleNext}
                                disabled={!applicationData.country}>
                                Next: Departure Time{" "}
                                <FaArrowRight style={{ marginLeft: "8px" }} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Departure Time Selection */}
                        {currentStep === 2 && (
                          <div className="visaForm">
                            <div className="form-section">
                              <h3 className="section-title">
                                <FaPlaneDeparture
                                  style={{ marginRight: "10px" }}
                                />
                                Expected Departure Time
                              </h3>
                              <p className="section-subtitle">
                                Select how urgently you need your visa
                                processed.
                              </p>

                              <div className="departure-time-grid">
                                {departureTimes.map((time) => (
                                  <div
                                    key={time.id}
                                    className={`time-slot ${
                                      applicationData.departureTime === time.id
                                        ? "selected"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleDepartureSelect(time.id)
                                    }>
                                    <div className="time-slot-icon">
                                      {time.icon}
                                    </div>
                                    <div className="time-label">
                                      {time.label}
                                    </div>
                                    <div className="time-range">
                                      {time.range}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="visaActionButtons">
                              <button
                                className="visaSecondaryButton"
                                onClick={handleStepBack}>
                                <FaArrowLeft style={{ marginRight: "8px" }} />
                                Back
                              </button>
                              <button
                                className="visaPrimaryButton"
                                onClick={handleNext}
                                disabled={!applicationData.departureTime}>
                                Next: Duration{" "}
                                <FaArrowRight style={{ marginLeft: "8px" }} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Duration Selection */}
                        {currentStep === 3 && (
                          <div className="visaForm">
                            <div className="form-section">
                              <h3 className="section-title">
                                <FaCalendarAlt
                                  style={{ marginRight: "10px" }}
                                />
                                Visa Duration
                              </h3>
                              <p className="section-subtitle">
                                Select how long you need the visa for.
                              </p>

                              <div className="duration-cards">
                                {durations.map((duration) => (
                                  <div
                                    key={duration.id}
                                    className={`duration-card ${
                                      applicationData.duration === duration.id
                                        ? "selected"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleDurationSelect(duration.id)
                                    }>
                                    <div className="duration-icon">
                                      {duration.icon}
                                    </div>
                                    <div className="duration-label">
                                      {duration.label}
                                    </div>
                                    <div className="duration-months">
                                      {duration.months}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="duration-note">
                              <p className="duration-note-text">
                                <strong>Note:</strong> Processing time depends
                                on selected duration. Longer durations may
                                require additional documentation.
                              </p>
                            </div>

                            <div className="visaActionButtons">
                              <button
                                className="visaSecondaryButton"
                                onClick={handleStepBack}>
                                <FaArrowLeft style={{ marginRight: "8px" }} />
                                Back
                              </button>
                              <button
                                className="visaPrimaryButton"
                                onClick={handleNext}
                                disabled={!applicationData.duration}>
                                Next: Details{" "}
                                <FaArrowRight style={{ marginLeft: "8px" }} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Step 4: Personal Details */}
                        {currentStep === 4 && (
                          <form
                            className="visaForm"
                            onSubmit={handleDetailsSubmit}>
                            <div className="form-section">
                              <h3 className="section-title">
                                <FaUserCircle style={{ marginRight: "10px" }} />
                                Personal Information
                              </h3>
                              <p className="section-subtitle">
                                Please provide your personal details as they
                                appear in your passport.
                              </p>

                              <div className="formGrid">
                                <div className="formField">
                                  <label>
                                    <FaUser style={{ marginRight: "8px" }} />
                                    First Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={applicationData.firstName}
                                    onChange={(e) =>
                                      setApplicationData({
                                        ...applicationData,
                                        firstName: e.target.value,
                                      })
                                    }
                                    required
                                    placeholder="Enter your first name"
                                  />
                                </div>
                                <div className="formField">
                                  <label>
                                    <FaUser style={{ marginRight: "8px" }} />
                                    Last Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={applicationData.lastName}
                                    onChange={(e) =>
                                      setApplicationData({
                                        ...applicationData,
                                        lastName: e.target.value,
                                      })
                                    }
                                    required
                                    placeholder="Enter your last name"
                                  />
                                </div>
                              </div>

                              <div className="formGrid">
                                <div className="formField">
                                  <label>
                                    <FaEnvelope
                                      style={{ marginRight: "8px" }}
                                    />
                                    Email Address *
                                  </label>
                                  <input
                                    type="email"
                                    value={applicationData.email}
                                    onChange={(e) =>
                                      setApplicationData({
                                        ...applicationData,
                                        email: e.target.value,
                                      })
                                    }
                                    required
                                    placeholder="Enter your email address"
                                  />
                                </div>
                                <div className="formField">
                                  <label>
                                    <FaPhone style={{ marginRight: "8px" }} />
                                    Phone Number *
                                  </label>
                                  <input
                                    type="tel"
                                    value={applicationData.phone}
                                    onChange={(e) =>
                                      setApplicationData({
                                        ...applicationData,
                                        phone: e.target.value,
                                      })
                                    }
                                    required
                                    placeholder="Enter your phone number"
                                  />
                                </div>
                              </div>

                              <div className="formGrid">
                                <div className="formField">
                                  <label>
                                    <FaPassport
                                      style={{ marginRight: "8px" }}
                                    />
                                    Passport Number *
                                  </label>
                                  <input
                                    type="text"
                                    value={applicationData.passportNumber}
                                    onChange={(e) =>
                                      setApplicationData({
                                        ...applicationData,
                                        passportNumber: e.target.value,
                                      })
                                    }
                                    required
                                    placeholder="Enter your passport number"
                                  />
                                </div>
                                <div className="formField">
                                  <label>
                                    <FaGlobe style={{ marginRight: "8px" }} />
                                    Nationality *
                                  </label>
                                  <input
                                    type="text"
                                    value={applicationData.nationality}
                                    onChange={(e) =>
                                      setApplicationData({
                                        ...applicationData,
                                        nationality: e.target.value,
                                      })
                                    }
                                    placeholder="e.g., Nigerian"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="visaActionButtons">
                              <button
                                type="button"
                                className="visaSecondaryButton"
                                onClick={handleStepBack}>
                                <FaArrowLeft style={{ marginRight: "8px" }} />
                                Back
                              </button>
                              <button
                                type="submit"
                                className="visaPrimaryButton"
                                disabled={
                                  !applicationData.firstName ||
                                  !applicationData.lastName ||
                                  !applicationData.email ||
                                  !applicationData.phone ||
                                  !applicationData.passportNumber ||
                                  !applicationData.nationality
                                }>
                                Next: Upload Passport{" "}
                                <FaArrowRight style={{ marginLeft: "8px" }} />
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Step 5: Passport Upload */}
                        {currentStep === 5 && (
                          <div className="visaForm">
                            <div className="upload-data-section">
                              <div className="upload-data-header">
                                <h4>
                                  <FaPassport style={{ marginRight: "10px" }} />
                                  Passport Data Page Upload
                                </h4>
                                <p>
                                  Upload a clear scan of your passport data page
                                </p>
                              </div>

                              <div
                                className={`passport-upload-zone ${
                                  isDragging ? "dragging" : ""
                                }`}
                                onClick={() => fileInputRef.current.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}>
                                <div className="upload-zone-icon">
                                  <FaUpload />
                                </div>
                                <div className="upload-zone-title">
                                  {applicationData.passportFile
                                    ? "Upload Complete"
                                    : "Upload Passport"}
                                </div>
                                <div className="upload-zone-subtitle">
                                  {applicationData.passportFile
                                    ? "Passport data page uploaded successfully"
                                    : "Click to browse or drag & drop"}
                                </div>
                                <div className="upload-zone-instructions">
                                  PDF, JPG, or PNG • Max 10MB
                                </div>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handlePassportUpload}
                                  style={{ display: "none" }}
                                />
                              </div>

                              {applicationData.passportFile && (
                                <motion.div
                                  className="passport-preview"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5 }}>
                                  <div className="passport-preview-icon">
                                    <FaPassport />
                                  </div>
                                  <div className="passport-preview-info">
                                    <div className="passport-preview-name">
                                      {applicationData.passportFile.name}
                                    </div>
                                    <div className="passport-preview-meta">
                                      <span>
                                        {applicationData.passportFile.size}
                                      </span>
                                      <span>
                                        {applicationData.passportFile.type
                                          .split("/")[1]
                                          .toUpperCase()}
                                      </span>
                                      <span style={{ color: "var(--green)" }}>
                                        <FaCheck
                                          style={{ marginRight: "4px" }}
                                        />
                                        Ready for submission
                                      </span>
                                    </div>
                                  </div>
                                  <div className="passport-preview-actions">
                                    <button
                                      className="visaSecondaryButton"
                                      onClick={() =>
                                        window.open(
                                          applicationData.passportFile.url,
                                          "_blank"
                                        )
                                      }
                                      style={{ padding: "10px 20px" }}>
                                      <FaEye style={{ marginRight: "8px" }} />
                                      View
                                    </button>
                                    <button
                                      className="visaSecondaryButton"
                                      onClick={handleRemovePassport}
                                      style={{ padding: "10px 20px" }}>
                                      <FaTrash style={{ marginRight: "8px" }} />
                                      Remove
                                    </button>
                                  </div>
                                </motion.div>
                              )}

                              <div className="upload-requirements">
                                <div className="requirements-title">
                                  <FaInfoCircle />
                                  Passport Requirements
                                </div>
                                <ul className="requirements-list">
                                  <li>Clear scan of the passport data page</li>
                                  <li>
                                    All information must be clearly visible
                                  </li>
                                  <li>
                                    Passport must be valid for at least 6 months
                                  </li>
                                  <li>File size must not exceed 10MB</li>
                                </ul>
                              </div>
                            </div>

                            <div className="visaActionButtons">
                              <button
                                className="visaSecondaryButton"
                                onClick={handleStepBack}>
                                <FaArrowLeft style={{ marginRight: "8px" }} />
                                Back
                              </button>
                              <button
                                className="visaPrimaryButton"
                                onClick={handleUploadSubmit}
                                disabled={!applicationData.passportFile}>
                                Next: Payment{" "}
                                <FaArrowRight style={{ marginLeft: "8px" }} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Step 6: Payment */}
                        {currentStep === 6 && (
                          <div className="visaForm">
                            <div className="form-section">
                              <h3 className="section-title">
                                <FaCreditCard style={{ marginRight: "10px" }} />
                                Payment Details
                              </h3>

                              <div className="pricing-summary">
                                <div className="pricing-header">
                                  <div className="pricing-title">
                                    Payment Summary
                                  </div>
                                  <div className="pricing-total">
                                    {getCountryCurrency()}
                                    {calculateTotalPrice()}
                                  </div>
                                </div>
                                <div className="pricing-details">
                                  <div className="pricing-item">
                                    <span className="pricing-label">
                                      Destination
                                    </span>
                                    <span className="pricing-value">
                                      {getCountryFlag()} {getCountryName()}
                                    </span>
                                  </div>
                                  <div className="pricing-item">
                                    <span className="pricing-label">
                                      Processing Time
                                    </span>
                                    <span className="pricing-value">
                                      {getDepartureLabel()}
                                    </span>
                                  </div>
                                  <div className="pricing-item">
                                    <span className="pricing-label">
                                      Visa Duration
                                    </span>
                                    <span className="pricing-value">
                                      {getDurationLabel()}
                                    </span>
                                  </div>
                                  <div className="pricing-item total">
                                    <span className="pricing-label">
                                      Total Amount
                                    </span>
                                    <span className="pricing-value">
                                      {getCountryCurrency()}
                                      {calculateTotalPrice()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="formField fullWidth">
                                <label>Payment Method *</label>
                                <select defaultValue="card" required>
                                  <option value="card">
                                    Credit/Debit Card
                                  </option>
                                  <option value="bank">Bank Transfer</option>
                                  <option value="wallet">Digital Wallet</option>
                                </select>
                              </div>

                              <div className="formField">
                                <label>Card Number *</label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  required
                                />
                              </div>

                              <div className="formGrid">
                                <div className="formField">
                                  <label>Expiry Date *</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    required
                                  />
                                </div>
                                <div className="formField">
                                  <label>CVV *</label>
                                  <input
                                    type="text"
                                    placeholder="123"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="visaActionButtons">
                              <button
                                className="visaSecondaryButton"
                                onClick={handleStepBack}>
                                <FaArrowLeft style={{ marginRight: "8px" }} />
                                Back
                              </button>
                              <button
                                className="visaPrimaryButton"
                                onClick={handlePaymentSubmit}>
                                Pay {getCountryCurrency()}
                                {calculateTotalPrice()}{" "}
                                <FaArrowRight style={{ marginLeft: "8px" }} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Step 7: Success */}
                        {currentStep === 7 && (
                          <div className="visaSuccessContainer">
                            <div className="visaSuccessCard">
                              <div className="visaSuccessCardGlow"></div>

                              <motion.div
                                className="visaSuccessIcon"
                                animate={{
                                  rotate: 360,
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{
                                  rotate: {
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                  },
                                  scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                  },
                                }}>
                                <div className="visaSuccessIconInner">
                                  <div className="visaSuccessIconRing"></div>
                                  <span className="visaSuccessCheck">
                                    <FaCheckCircle />
                                  </span>
                                </div>
                              </motion.div>

                              <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="visaSuccessTitle">
                                Application Submitted!
                              </motion.h2>

                              <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="visaSuccessSubtitle">
                                Your visa application has been received and
                                payment confirmed. You will receive an email
                                with your application ID and tracking details
                                within 24 hours.
                              </motion.p>

                              <motion.div
                                className="applicationSummary"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}>
                                <div className="applicationSummaryGlow"></div>

                                <div className="applicationHeader">
                                  <div className="applicationIdSection">
                                    <div className="applicationLabel">
                                      APPLICATION ID
                                    </div>
                                    <div className="applicationId">
                                      VISA-
                                      {Date.now()
                                        .toString()
                                        .slice(-8)
                                        .toUpperCase()}
                                    </div>
                                  </div>
                                </div>

                                <div className="applicationDetailsGrid">
                                  <div className="applicationDetailItem">
                                    <div className="detailTitle">
                                      Destination
                                    </div>
                                    <div className="detailContent">
                                      {getCountryFlag()} {getCountryName()}
                                    </div>
                                  </div>
                                  <div className="applicationDetailItem">
                                    <div className="detailTitle">Applicant</div>
                                    <div className="detailContent">
                                      {applicationData.firstName}{" "}
                                      {applicationData.lastName}
                                    </div>
                                  </div>
                                  <div className="applicationDetailItem">
                                    <div className="detailTitle">
                                      Visa Duration
                                    </div>
                                    <div className="detailContent">
                                      {getDurationLabel()}
                                    </div>
                                  </div>
                                  <div className="applicationDetailItem">
                                    <div className="detailTitle">
                                      Processing Time
                                    </div>
                                    <div className="detailContent">
                                      {getDepartureLabel()}
                                    </div>
                                  </div>
                                  <div className="applicationDetailItem">
                                    <div className="detailTitle">Status</div>
                                    <div className="detailContent">
                                      <span
                                        style={{
                                          color: "var(--green)",
                                          fontWeight: "700",
                                        }}>
                                        Payment Confirmed
                                      </span>
                                    </div>
                                  </div>
                                  <div className="applicationDetailItem">
                                    <div className="detailTitle">
                                      Amount Paid
                                    </div>
                                    <div className="detailContent">
                                      <span
                                        style={{
                                          color: "var(--green)",
                                          fontWeight: "800",
                                        }}>
                                        {getCountryCurrency()}
                                        {calculateTotalPrice()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="applicationDetailItem">
                                    <div className="detailTitle">Submitted</div>
                                    <div className="detailContent">
                                      {new Date().toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="applicationDetailItem">
                                    <div className="detailTitle">
                                      Estimated Processing
                                    </div>
                                    <div className="detailContent">
                                      {getDepartureLabel()}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="visaActionButtons"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}>
                                <button
                                  className="visaSecondaryButton"
                                  onClick={() => window.print()}>
                                  <FaPrint style={{ marginRight: "8px" }} />
                                  Print Receipt
                                </button>
                                <button
                                  className="visaPrimaryButton"
                                  onClick={resetApplication}>
                                  Start New Application
                                </button>
                              </motion.div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card Footer */}
              <div className="visaCardFooter">
                <div className="visaFooterStats">
                  <div className="visaStat">
                    <span className="visaStatLabel">Step</span>
                    <span className="visaStatValue">0{currentStep}/07</span>
                  </div>
                  <div className="visaStat">
                    <span className="visaStatLabel">Status</span>
                    <span className="visaStatValue">
                      {currentStep === 7 ? "Complete" : "In Progress"}
                    </span>
                  </div>
                  {applicationData.country && (
                    <div className="visaStat">
                      <span className="visaStatLabel">Price</span>
                      <span
                        className="visaStatValue"
                        style={{ color: "var(--green)" }}>
                        {getCountryCurrency()}
                        {calculateTotalPrice()}
                      </span>
                    </div>
                  )}
                </div>
                {currentStep !== 7 && (
                  <button className="visaAssistButton">
                    <span className="visaAssistIcon">
                      <FaRobot />
                    </span>
                    Visa Assistant
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
