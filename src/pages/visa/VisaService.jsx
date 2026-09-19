import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authApi, visaApi } from "../../services/api";
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
  FaCheck,
  FaChevronDown,
  FaInfoCircle,
} from "react-icons/fa";
import "./VisaService.css";

/* ========== BANK ACCOUNT DETAILS ==========
   Edit these once to match your real bank account. */
const BANK_DETAILS = {
  bankName: "TravelFin Partners Bank",
  accountName: "TravelFin Ltd",
  accountNumber: "0123456789",
  sortCode: "00-00-00",
  swift: "TRVLGB2L",
  iban: "GB00 TRVL 0000 0000 0123 45",
  reference: "Use your full name as the payment reference",
  instructions:
    "Transfer the exact amount shown above. Your application will be processed once we receive the funds — usually within 1 business day.",
};

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

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [copiedField, setCopiedField] = useState(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [dropdownRect, setDropdownRect] = useState(null);
  const triggerRef = useRef(null);

  const [countries, setCountries] = useState([]);
  const fileInputRef = useRef(null);

  /* ============ CONFIG ============ */
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

  /* ============ LOAD COUNTRIES ============ */
  useEffect(() => {
    const loadCountries = () => {
      try {
        const raw = localStorage.getItem("visaCountries");
        const stored = raw ? JSON.parse(raw) : [];
        const active = stored
          .filter((c) => c.isActive !== false)
          .map((c) => ({ ...c, price: c.basePrice ?? c.price ?? 0 }));
        setCountries(active);
      } catch (err) {
        console.error("Failed to load countries:", err);
        setCountries([]);
      }
    };

    loadCountries();

    const onStorage = (e) => {
      if (e.key === "visaCountries") loadCountries();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const departureTimes = [
    {
      id: "urgent",
      label: "Urgent",
      time: "24-48 hours",
      icon: <FaClock />,
      badge: "Premium",
    },
    {
      id: "express",
      label: "Express",
      time: "3-5 days",
      icon: <FaCalendarDay />,
      badge: "Fast",
    },
    {
      id: "standard",
      label: "Standard",
      time: "7-10 days",
      icon: <FaCalendarAlt />,
      badge: "Popular",
    },
    {
      id: "regular",
      label: "Regular",
      time: "15-20 days",
      icon: <FaCalendarDay />,
      badge: "Economy",
    },
  ];

  const durations = [
    {
      id: "30",
      label: "Short Stay",
      time: "1 month",
      icon: <FaCalendarDay />,
      badge: "Quick",
    },
    {
      id: "90",
      label: "Tourist",
      time: "3 months",
      icon: <FaCalendarAlt />,
      badge: "Popular",
    },
    {
      id: "180",
      label: "Business",
      time: "6 months",
      icon: <FaCalendarDay />,
      badge: "Work",
    },
    {
      id: "365",
      label: "Long Term",
      time: "1 year",
      icon: <FaCalendarAlt />,
      badge: "Extended",
    },
    {
      id: "730",
      label: "Residence",
      time: "2 years",
      icon: <FaCalendarDay />,
      badge: "Long-term",
    },
  ];

  const stepDescriptions = {
    1: "Select your destination country",
    2: "Choose when you need your visa processed",
    3: "Select your visa duration",
    4: "Fill in your personal details",
    5: "Upload your passport data page",
    6: "Review and complete payment",
    7: "Application submitted successfully!",
  };

  /* ============ HELPERS ============ */
  const getCountry = (id) => countries.find((c) => c.id === id);
  const getCountryName = () => getCountry(applicationData.country)?.name || "";
  const getCountryFlag = () => getCountry(applicationData.country)?.flag || "";
  const getCountryCurrency = () =>
    getCountry(applicationData.country)?.currency || "$";
  const getCountryProcessing = () =>
    getCountry(applicationData.country)?.processing || "";
  const getDepartureLabel = () =>
    departureTimes.find((t) => t.id === applicationData.departureTime)?.time ||
    "";
  const getDurationLabel = () =>
    durations.find((d) => d.id === applicationData.duration)?.time || "";
  const calculateTotalPrice = () =>
    getCountry(applicationData.country)?.price || 0;

  const copyToClipboard = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      alert(`Copy this: ${value}`);
    }
  };

  /* ============ NAV ============ */
  const goToStep = (n) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(n);
      setIsAnimating(false);
    }, 350);
  };
  const handleNext = () => goToStep(currentStep + 1);
  const handleStepBack = () => goToStep(currentStep - 1);

  /* ============ SELECTION ============ */
  const handleCountrySelect = (countryId) => {
    setApplicationData((prev) => ({ ...prev, country: countryId }));
    setCountryDropdownOpen(false);
  };
  const handleDepartureSelect = (timeId) =>
    setApplicationData((prev) => ({ ...prev, departureTime: timeId }));
  const handleDurationSelect = (durationId) =>
    setApplicationData((prev) => ({ ...prev, duration: durationId }));
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  /* ============ UPLOAD ============ */
  const processUpload = (file) => {
    if (!file) return;
    if (!file.type.match("image.*|application/pdf")) {
      alert("Please upload a valid image or PDF file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setApplicationData((prev) => ({
        ...prev,
        passportFile: {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          type: file.type,
          dataUrl: reader.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePassportUpload = (e) => processUpload(e.target.files[0]);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processUpload(e.dataTransfer.files[0]);
  };
  const handleRemovePassport = () => {
    setApplicationData((prev) => ({ ...prev, passportFile: null }));
  };
  const handleUploadSubmit = () => {
    if (!applicationData.passportFile) {
      alert("Please upload your passport data page");
      return;
    }
    handleNext();
  };

  /* ============ PAYMENT ============ */
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };
  const handleCardNumberChange = (e) =>
    setPaymentData((p) => ({
      ...p,
      cardNumber: formatCardNumber(e.target.value),
    }));
  const handleExpiryChange = (e) =>
    setPaymentData((p) => ({ ...p, expiry: formatExpiry(e.target.value) }));
  const handleCvvChange = (e) =>
    setPaymentData((p) => ({
      ...p,
      cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
    }));

  const handlePaymentSubmit = async () => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      alert("Please log in to submit a visa application.");
      return;
    }

    if (paymentMethod === "card") {
      const digits = paymentData.cardNumber.replace(/\s/g, "");
      if (digits.length < 13 || digits.length > 19) {
        alert("Please enter a valid card number");
        return;
      }
      if (!paymentData.cardName.trim()) {
        alert("Please enter the cardholder name");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
        alert("Please enter expiry as MM/YY");
        return;
      }
      if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        alert("Please enter a valid CVV");
        return;
      }
    }

    setIsAnimating(true);

    const paymentStatus =
      paymentMethod === "bank_transfer" ? "pending" : "paid";

    try {
      await visaApi.create(currentUser.id, {
        countryId: applicationData.country,
        countryName: getCountryName(),
        countryFlag: getCountryFlag(),
        countryCurrency: getCountryCurrency(),
        departureTimeId: applicationData.departureTime,
        departureLabel: getDepartureLabel(),
        durationId: applicationData.duration,
        durationLabel: getDurationLabel(),
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        passportNumber: applicationData.passportNumber,
        nationality: applicationData.nationality,
        passportFile:
          applicationData.passportFile ?
            {
              name: applicationData.passportFile.name,
              size: applicationData.passportFile.size,
              type: applicationData.passportFile.type,
              dataUrl: applicationData.passportFile.dataUrl,
            }
          : null,
        amountPaid: calculateTotalPrice(),
        paymentMethod,
        paymentStatus,
      });
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setCurrentStep(7);
      setIsAnimating(false);
    }, 400);
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
      setPaymentMethod("card");
      setPaymentData({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
      setCopiedField(null);
      setIsAnimating(false);
    }, 400);
  };

  /* ============ STEP TITLE ============ */
  const getCurrentStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Select Country";
      case 2:
        return "Processing Speed";
      case 3:
        return "Visa Duration";
      case 4:
        return "Personal Details";
      case 5:
        return "Upload Document";
      case 6:
        return "Review & Payment";
      case 7:
        return "Application Complete";
      default:
        return "";
    }
  };

  const currentStepIndex = currentStep - 1;
  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
  };

  /* ============ EFFECTS ============ */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (countryDropdownOpen) setCountryDropdownOpen(false);
        else if (currentStep > 1 && currentStep < 7) handleStepBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, countryDropdownOpen]);

  useEffect(() => {
    if (!countryDropdownOpen) return;
    const updateRect = () => {
      if (triggerRef.current) {
        setDropdownRect(triggerRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [countryDropdownOpen]);

  useEffect(() => {
    const onClickOutside = (e) => {
      const triggerEl = triggerRef.current;
      const portalEl = document.querySelector(".countryDropdownPortal");
      if (
        triggerEl &&
        !triggerEl.contains(e.target) &&
        (!portalEl || !portalEl.contains(e.target))
      ) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  /* ============ STEP 1 — COUNTRY ============ */
  const renderCountryStep = () => {
    const selected = getCountry(applicationData.country);
    const filtered = countries.filter((c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()),
    );

    return (
      <div className="visaForm">
        <div className="form-section">
          <h3 className="section-title">
            <FaGlobe /> Select Destination Country
          </h3>
          <p className="section-subtitle">
            Choose your destination to see visa requirements and pricing
          </p>

          <div className="countryDropdownWrapper">
            <div
              ref={triggerRef}
              className={`countryDropdownTrigger ${applicationData.country ? "has-value" : ""}`}
              onClick={() => {
                setCountrySearch("");
                setCountryDropdownOpen((v) => !v);
              }}>
              <div className="countryDropdownLeft">
                {selected ?
                  <>
                    <span className="countryDropdownFlag">{selected.flag}</span>
                    <div className="countryDropdownText">
                      <span className="countryDropdownName">
                        {selected.name}
                      </span>
                      <span className="countryDropdownMeta">
                        <FaClock /> {selected.processing}
                      </span>
                    </div>
                  </>
                : <>
                    <span className="countryDropdownPlaceholderIcon">
                      <FaGlobe />
                    </span>
                    <span className="countryDropdownPlaceholder">
                      Select a country...
                    </span>
                  </>
                }
              </div>

              <div className="countryDropdownRight">
                {selected && (
                  <span className="countryDropdownPrice">
                    <span className="currency-symbols">
                      {selected.currency}
                    </span>
                    <span className="price-amounts">{selected.price}</span>
                  </span>
                )}
                <FaChevronDown
                  className={`countryDropdownChevron ${
                    countryDropdownOpen ? "open" : ""
                  }`}
                />
              </div>
            </div>

            {countryDropdownOpen &&
              dropdownRect &&
              createPortal(
                <div
                  className="countryDropdownPortal"
                  style={{
                    position: "fixed",
                    top: dropdownRect.bottom + 6,
                    left: dropdownRect.left,
                    width: dropdownRect.width,
                  }}>
                  <div className="countryDropdownSearch">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                    />
                  </div>

                  <div className="countryDropdownMenu">
                    {filtered.length === 0 ?
                      <div className="countryDropdownEmpty">
                        {countries.length === 0 ?
                          "No countries available"
                        : "No countries found"}
                      </div>
                    : filtered.map((country) => {
                        const isSelected =
                          applicationData.country === country.id;
                        return (
                          <div
                            key={country.id}
                            className={`countryDropdownItem ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() => handleCountrySelect(country.id)}>
                            <span className="countryDropdownItemFlag">
                              {country.flag}
                            </span>
                            <div className="countryDropdownItemInfo">
                              <span className="countryDropdownItemName">
                                {country.name}
                              </span>
                              <span className="countryDropdownItemMeta">
                                <FaClock /> {country.processing}
                              </span>
                            </div>
                            <span className="countryDropdownItemPrice">
                              {country.currency}
                              {country.price}
                            </span>
                            {isSelected && (
                              <FaCheck className="countryDropdownItemCheck" />
                            )}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>,
                document.body,
              )}
          </div>
        </div>

        <div className="visaActions">
          <button
            className="visaBtn visaBtnPrimary"
            onClick={handleNext}
            disabled={!applicationData.country}>
            Continue <FaArrowRight />
          </button>
        </div>
      </div>
    );
  };

  /* ============ STEP 2 — DEPARTURE ============ */
  const renderDepartureStep = () => (
    <div className="visaForm">
      <div className="form-section">
        <h3 className="section-title">
          <FaPlaneDeparture /> Processing Speed
        </h3>
        <p className="section-subtitle">
          How quickly do you need your visa processed?
        </p>

        <div className="optionList">
          {departureTimes.map((time, index) => (
            <motion.div
              key={time.id}
              className={`optionListItem ${
                applicationData.departureTime === time.id ? "selected" : ""
              }`}
              onClick={() => handleDepartureSelect(time.id)}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}>
              <div className="optionListIcon">{time.icon}</div>
              <div className="optionListInfo">
                <span className="optionListLabel">{time.label}</span>
                <span className="optionListTime">{time.time}</span>
              </div>
              <span className="optionListBadge">{time.badge}</span>
              <div className="optionListCheck">
                {applicationData.departureTime === time.id && <FaCheck />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="visaActions">
        <button className="visaBtn visaBtnSecondary" onClick={handleStepBack}>
          <FaArrowLeft /> Back
        </button>
        <button
          className="visaBtn visaBtnPrimary"
          onClick={handleNext}
          disabled={!applicationData.departureTime}>
          Continue <FaArrowRight />
        </button>
      </div>
    </div>
  );

  /* ============ STEP 3 — DURATION ============ */
  const renderDurationStep = () => (
    <div className="visaForm">
      <div className="form-section">
        <h3 className="section-title">
          <FaCalendarAlt /> Visa Duration
        </h3>
        <p className="section-subtitle">
          Select how long you need your visa for
        </p>

        <div className="optionList">
          {durations.map((duration, index) => (
            <motion.div
              key={duration.id}
              className={`optionListItem ${
                applicationData.duration === duration.id ? "selected" : ""
              }`}
              onClick={() => handleDurationSelect(duration.id)}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}>
              <div className="optionListIcon">{duration.icon}</div>
              <div className="optionListInfo">
                <span className="optionListLabel">{duration.label}</span>
                <span className="optionListTime">{duration.time}</span>
              </div>
              <span className="optionListBadge">{duration.badge}</span>
              <div className="optionListCheck">
                {applicationData.duration === duration.id && <FaCheck />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="visaActions">
        <button className="visaBtn visaBtnSecondary" onClick={handleStepBack}>
          <FaArrowLeft /> Back
        </button>
        <button
          className="visaBtn visaBtnPrimary"
          onClick={handleNext}
          disabled={!applicationData.duration}>
          Continue <FaArrowRight />
        </button>
      </div>
    </div>
  );

  /* ============ STEP 4 — DETAILS ============ */
  const renderDetailsStep = () => (
    <div className="visaForm">
      <div className="form-section">
        <h3 className="section-title">
          <FaUser /> Personal Details
        </h3>
        <p className="section-subtitle">
          Provide your information as it appears on your passport
        </p>

        <form onSubmit={handleDetailsSubmit}>
          <div className="formGrid">
            <div className="formField">
              <label>
                <FaUserCircle /> First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                value={applicationData.firstName}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    firstName: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="formField">
              <label>
                <FaUserCircle /> Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                value={applicationData.lastName}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    lastName: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="formField">
              <label>
                <FaEnvelope /> Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={applicationData.email}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="formField">
              <label>
                <FaPhone /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+234 800 000 0000"
                value={applicationData.phone}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    phone: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="formField">
              <label>
                <FaPassport /> Passport Number
              </label>
              <input
                type="text"
                placeholder="A12345678"
                value={applicationData.passportNumber}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    passportNumber: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="formField">
              <label>
                <FaMapMarkerAlt /> Nationality
              </label>
              <input
                type="text"
                placeholder="e.g. Nigerian"
                value={applicationData.nationality}
                onChange={(e) =>
                  setApplicationData({
                    ...applicationData,
                    nationality: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="visaActions">
            <button
              type="button"
              className="visaBtn visaBtnSecondary"
              onClick={handleStepBack}>
              <FaArrowLeft /> Back
            </button>
            <button type="submit" className="visaBtn visaBtnPrimary">
              Continue <FaArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  /* ============ STEP 5 — UPLOAD ============ */
  const renderUploadStep = () => (
    <div className="visaForm">
      <div className="form-section">
        <h3 className="section-title">
          <FaFileUpload /> Upload Passport
        </h3>
        <p className="section-subtitle">
          Upload a clear image or PDF of your passport data page
        </p>

        {!applicationData.passportFile ?
          <div
            className={`visaUploadZone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}>
            <div className="visaUploadIcon">
              <FaUpload />
            </div>
            <p className="visaUploadText">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="visaUploadHint">PNG, JPG or PDF (max 10MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handlePassportUpload}
              hidden
            />
          </div>
        : <div className="visaFilePreview">
            <div className="visaFileIcon">
              <FaFileUpload />
            </div>
            <div className="visaFileInfo">
              <span className="visaFileName">
                {applicationData.passportFile.name}
              </span>
              <span className="visaFileSize">
                {applicationData.passportFile.size}
              </span>
            </div>
            <button className="visaFileRemove" onClick={handleRemovePassport}>
              <FaTrash />
            </button>
          </div>
        }
      </div>

      <div className="visaActions">
        <button className="visaBtn visaBtnSecondary" onClick={handleStepBack}>
          <FaArrowLeft /> Back
        </button>
        <button className="visaBtn visaBtnPrimary" onClick={handleUploadSubmit}>
          Continue to Payment <FaArrowRight />
        </button>
      </div>
    </div>
  );

  /* ============ STEP 6 — PAYMENT ============ */
  const renderPaymentStep = () => (
    <div className="visaForm visaPaymentStep">
      <div className="form-section">
        <h3 className="section-title">
          <FaCreditCard /> Review & Payment
        </h3>
        <p className="section-subtitle">
          Confirm your details and enter payment information
        </p>

        <div className="reviewGrid">
          <div className="reviewCard">
            <span className="reviewCard__label">
              <FaGlobe /> Country
            </span>
            <span className="reviewCard__value">
              {getCountryFlag()} {getCountryName()}
            </span>
          </div>
          <div className="reviewCard">
            <span className="reviewCard__label">
              <FaPlaneDeparture /> Processing
            </span>
            <span className="reviewCard__value">{getDepartureLabel()}</span>
          </div>
          <div className="reviewCard">
            <span className="reviewCard__label">
              <FaCalendarAlt /> Duration
            </span>
            <span className="reviewCard__value">{getDurationLabel()}</span>
          </div>
          <div className="reviewCard">
            <span className="reviewCard__label">
              <FaUser /> Full Name
            </span>
            <span className="reviewCard__value">
              {applicationData.firstName} {applicationData.lastName}
            </span>
          </div>
          <div className="reviewCard">
            <span className="reviewCard__label">
              <FaEnvelope /> Email
            </span>
            <span className="reviewCard__value">{applicationData.email}</span>
          </div>
          <div className="reviewCard">
            <span className="reviewCard__label">
              <FaPhone /> Phone
            </span>
            <span className="reviewCard__value">{applicationData.phone}</span>
          </div>
          <div className="reviewCard">
            <span className="reviewCard__label">
              <FaPassport /> Passport No.
            </span>
            <span className="reviewCard__value">
              {applicationData.passportNumber}
            </span>
          </div>
          <div className="reviewCard">
            <span className="reviewCard__label">
              <FaMapMarkerAlt /> Nationality
            </span>
            <span className="reviewCard__value">
              {applicationData.nationality}
            </span>
          </div>
          {applicationData.passportFile && (
            <div className="reviewCard reviewCard--full">
              <span className="reviewCard__label">
                <FaFileUpload /> Passport File
              </span>
              <span className="reviewCard__value reviewCard__value--truncate">
                {applicationData.passportFile.name}
              </span>
            </div>
          )}
        </div>

        <div className="paymentMethods">
          <h4 className="paymentMethodsTitle">Payment Method</h4>
          <div className="paymentMethodList paymentMethodList--row">
            <label
              className={`paymentMethodItem ${
                paymentMethod === "card" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("card")}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <div className="paymentMethodIcon">
                <FaCreditCard />
              </div>
              <div className="paymentMethodInfo">
                <span className="paymentMethodName">Card</span>
                <span className="paymentMethodDesc">Visa, MC, Verve</span>
              </div>
            </label>

            <label
              className={`paymentMethodItem ${
                paymentMethod === "bank_transfer" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("bank_transfer")}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
              />
              <div className="paymentMethodIcon">
                <FaGlobe />
              </div>
              <div className="paymentMethodInfo">
                <span className="paymentMethodName">Bank Transfer</span>
                <span className="paymentMethodDesc">Direct to our account</span>
              </div>
            </label>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="cardForm">
            <div className="formField">
              <label>
                <FaCreditCard /> Card Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>

            <div className="formField">
              <label>
                <FaUserCircle /> Cardholder Name
              </label>
              <input
                type="text"
                autoComplete="cc-name"
                placeholder="Name on card"
                value={paymentData.cardName}
                onChange={(e) =>
                  setPaymentData((p) => ({ ...p, cardName: e.target.value }))
                }
              />
            </div>

            <div className="cardFormRow">
              <div className="formField">
                <label>
                  <FaCalendarAlt /> Expiry
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={paymentData.expiry}
                  onChange={handleExpiryChange}
                />
              </div>

              <div className="formField">
                <label>
                  <FaInfoCircle /> CVV
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  value={paymentData.cvv}
                  onChange={handleCvvChange}
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "bank_transfer" && (
          <motion.div
            className="visaBankPanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}>
            <div className="visaBankNotice">
              <span className="visaBankNoticeIcon">🏦</span>
              <div>
                <div className="visaBankNoticeTitle">Pay via bank transfer</div>
                <p className="visaBankNoticeText">
                  Transfer{" "}
                  <strong>
                    {getCountryCurrency()}
                    {calculateTotalPrice()}
                  </strong>{" "}
                  to the account below. Your application will be processed once
                  the payment is received.
                </p>
              </div>
            </div>

            <div className="visaBankGrid">
              {[
                { label: "Bank name", value: BANK_DETAILS.bankName },
                { label: "Account name", value: BANK_DETAILS.accountName },
                { label: "Account number", value: BANK_DETAILS.accountNumber },
                { label: "Sort code", value: BANK_DETAILS.sortCode },
                { label: "SWIFT / BIC", value: BANK_DETAILS.swift },
                { label: "IBAN", value: BANK_DETAILS.iban },
              ].map((row) => (
                <div key={row.label} className="visaBankRow">
                  <div className="visaBankLabel">{row.label}</div>
                  <div className="visaBankValueWrap">
                    <span className="visaBankValue">{row.value}</span>
                    <button
                      type="button"
                      className="visaBankCopyBtn"
                      onClick={() => copyToClipboard(row.label, row.value)}>
                      {copiedField === row.label ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="visaBankReference">
              <strong>Payment reference:</strong> {BANK_DETAILS.reference}
            </div>

            <p className="visaBankInstructions">{BANK_DETAILS.instructions}</p>
          </motion.div>
        )}

        <div className="paymentTotal">
          <span>Total Amount</span>
          <div className="paymentAmount">
            <span className="currency-symbols">{getCountryCurrency()}</span>
            <span className="price-amounts">{calculateTotalPrice()}</span>
          </div>
        </div>
      </div>

      <div className="visaActions">
        <button className="visaBtn visaBtnSecondary" onClick={handleStepBack}>
          <FaArrowLeft /> Back
        </button>
        <button
          className="visaBtn visaBtnPrimary"
          onClick={handlePaymentSubmit}>
          <FaCreditCard />
          {paymentMethod === "bank_transfer" ?
            "Submit Application"
          : `Pay ${getCountryCurrency()}${calculateTotalPrice()}`}
        </button>
      </div>
    </div>
  );

  /* ============ STEP 7 — COMPLETE ============ */
  const renderCompleteStep = () => (
    <div className="visaComplete">
      <motion.div
        className="visaCompleteIcon"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}>
        <FaCheckCircle />
      </motion.div>
      <h2 className="visaCompleteTitle">Application Submitted!</h2>
      <p className="visaCompleteText">
        Your visa application for <strong>{getCountryName()}</strong> has been
        submitted successfully. We'll contact you at{" "}
        <strong>{applicationData.email}</strong> with updates.
      </p>

      <div className="visaCompleteDetails">
        <div className="visaCompleteItem">
          <span>Application ID</span>
          <strong>#VISA-{Date.now().toString().slice(-6)}</strong>
        </div>
        <div className="visaCompleteItem">
          <span>Processing Time</span>
          <strong>{getCountryProcessing()}</strong>
        </div>
        <div className="visaCompleteItem">
          <span>
            {paymentMethod === "bank_transfer" ? "Amount Due" : "Amount Paid"}
          </span>
          <strong>
            {getCountryCurrency()}
            {calculateTotalPrice()}
          </strong>
        </div>
      </div>

      <div className="visaActions visaActionsCenter">
        <button
          className="visaBtn visaBtnSecondary"
          onClick={() => window.print()}>
          <FaPrint /> Print Receipt
        </button>
        <button className="visaBtn visaBtnPrimary" onClick={resetApplication}>
          Start New Application
        </button>
      </div>
    </div>
  );

  /* ============ SWITCH ============ */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderCountryStep();
      case 2:
        return renderDepartureStep();
      case 3:
        return renderDurationStep();
      case 4:
        return renderDetailsStep();
      case 5:
        return renderUploadStep();
      case 6:
        return renderPaymentStep();
      case 7:
        return renderCompleteStep();
      default:
        return null;
    }
  };

  /* ============ MAIN ============ */
  return (
    <div className="visaServicePage">
      <main className="visaMain">
        <div className="visaContainer">
          <div className="visaStepNavigation">
            <div className="visaStepProgress">
              <div
                className="visaProgressLine"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="visaStepIndicators">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                return (
                  <div
                    key={step.id}
                    className={`visaStepIndicator ${
                      isActive ? "active" : ""
                    } ${isCompleted ? "completed" : ""}`}
                    style={{ "--step-color": step.color }}
                    onClick={() => {
                      if (index < currentStep && currentStep < 7)
                        goToStep(index + 1);
                    }}>
                    <div className="visaIndicatorRing">
                      <span className="visaStepIcon">{step.icon}</span>
                    </div>
                    <span className="visaStepName">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="visaContentArea">
            <aside className="visaSidePanel">
              <div className="visaSidePanelSticky">
                <div className="visaCurrentStepInfo">
                  <div className="visaStepNumber">{currentStep}</div>
                  <div className="visaStepInfo">
                    <h3 className="visaStepTitle">{getCurrentStepTitle()}</h3>
                    <p className="visaStepDescription">
                      {stepDescriptions[currentStep]}
                    </p>
                  </div>
                  <div className="visaProgressDots">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`visaProgressDot ${
                          i === currentStepIndex ? "active" : ""
                        } ${i < currentStepIndex ? "completed" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                {applicationData.country && (
                  <div className="pricing-summary">
                    <div className="pricing-header">
                      <span className="pricing-title">Summary</span>
                      <div className="pricing-total">
                        <span className="currency-symbols">
                          {getCountryCurrency()}
                        </span>
                        <span className="price-amounts">
                          {calculateTotalPrice()}
                        </span>
                      </div>
                    </div>
                    <div className="pricing-details">
                      <div className="pricing-item">
                        <span className="pricing-label">Country</span>
                        <span className="pricing-value">
                          {getCountryFlag()} {getCountryName()}
                        </span>
                      </div>
                      {applicationData.departureTime && (
                        <div className="pricing-item">
                          <span className="pricing-label">Processing</span>
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

                <div className="visaQuickHelp">
                  <div className="visaHelpHeader">
                    <FaInfoCircle className="visaHelpIcon" />
                    <span>Quick Tips</span>
                  </div>
                  <ul className="visaTipsList">
                    <li>Ensure passport is valid for 6+ months</li>
                    <li>Upload clear, well-lit documents</li>
                    <li>Double-check spelling of names</li>
                    <li>Keep your contact info updated</li>
                  </ul>
                </div>
              </div>
            </aside>

            <section className="visaMainCard">
              <div className="visaCardHeader">
                <div className="visaCardGlow" />
                <h2 className="visaCardTitle">{getCurrentStepTitle()}</h2>
                <div className="visaCardSubtitle">
                  <div className="visaSubtitleLine" />
                  <span className="visaSubtitleText">
                    Step {currentStep} of {steps.length}
                  </span>
                </div>
              </div>

              <div className="visaCardContent">
                <AnimatePresence mode="wait">
                  {isAnimating ?
                    <motion.div
                      key="loading"
                      className="visaLoadingState"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}>
                      <div className="visaNeonSpinner">
                        <div className="visaSpinnerCore" />
                        <div className="visaSpinnerRing" />
                      </div>
                      <p className="visaLoadingText">Loading...</p>
                    </motion.div>
                  : <motion.div
                      key={currentStep}
                      className="visaContentWrapper"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit">
                      {renderStepContent()}
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
