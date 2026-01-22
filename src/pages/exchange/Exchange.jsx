import { useState, useEffect } from "react";
import "./exchange.css";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import ConverterCard from "../../components/exchange/ConverterCard";
import PaymentAccount from "../../components/exchange/PaymentAccount";
import PaymentStatus from "../../components/exchange/PaymentStatus";
import UserBankForm from "../../components/exchange/UserBankForm";

export default function ExchangePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [exchangeData, setExchangeData] = useState({
    from: "NGN",
    to: "USD",
    amount: "",
    convertedAmount: "",
  });
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { id: 1, label: "Convert", icon: "⟁", color: "var(--green)" },
    { id: 2, label: "Payment", icon: "⊡", color: "var(--orange)" },
    { id: 3, label: "Verify", icon: "✎", color: "var(--green)" },
    { id: 4, label: "Details", icon: "○", color: "var(--orange)" },
    { id: 5, label: "Complete", icon: "✓", color: "var(--green)" },
  ];

  const currencyInfo = {
    NGN: { name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬", color: "#10b981" },
    USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸", color: "#f97316" },
  };

  const stepDescriptions = {
    1: "Enter the amount you want to exchange and select currencies",
    2: "Make payment to complete the currency conversion",
    3: "Verify your payment details and confirm transaction",
    4: "Provide your bank account information to receive funds",
    5: "Review your transaction confirmation and details",
  };

  const handleConverterNext = (data) => {
    setIsAnimating(true);
    setTimeout(() => {
      setExchangeData(data);
      setCurrentStep(2);
      setIsAnimating(false);
    }, 400);
  };

  const handlePaymentPaid = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(3);
      setIsAnimating(false);
    }, 400);
  };

  const handlePaymentConfirmed = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setPaymentConfirmed(true);
      setCurrentStep(4);
      setIsAnimating(false);
    }, 400);
  };

  const handleBankFormSubmit = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(5);
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

  const resetExchange = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(1);
      setExchangeData({
        from: "NGN",
        to: "USD",
        amount: "",
        convertedAmount: "",
      });
      setPaymentConfirmed(false);
      setIsAnimating(false);
    }, 400);
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

  const SuccessParticles = () => (
    <div className="successParticles">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="successParticle"
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.05,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          style={{
            background:
              i % 3 === 0
                ? "var(--green)"
                : i % 3 === 1
                ? "var(--orange)"
                : "var(--dark-green)",
          }}
        />
      ))}
    </div>
  );

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
    <div className="exchangePage">
      {/* <Navbar /> */}

      {/* Animated Background Elements */}
      <div className="backgroundElements">
        <div className="gridLines"></div>
        <div className="floatingOrbs">
          <div className="orb1"></div>
          <div className="orb2"></div>
          <div className="orb3"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="main">
        <div className="container">
          {/* Step Navigation */}
          <div className="stepNavigation">
            <div className="stepProgress">
              <div
                className="progressLine"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  background: `linear-gradient(90deg, var(--green), var(--dark-green))`,
                }}></div>
            </div>

            <div className="stepIndicators">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`stepIndicator ${isActive ? "active" : ""} ${
                      isCompleted ? "completed" : ""
                    }`}
                    style={{
                      "--step-color": step.color,
                      animationDelay: `${index * 100}ms`,
                    }}>
                    <div className="indicatorRing">
                      <div className="indicatorDot"></div>
                      <span className="stepIcon">{step.icon}</span>
                    </div>
                    <span className="stepName">{step.label}</span>
                    {isActive && (
                      <motion.div
                        className="activePulse"
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
          <div className="contentArea">
            {/* Side Panel */}
            <div className="sidePanel">
              <div className="sidePanelSticky">
                <div className="currentStepInfo">
                  <motion.div
                    className="stepNumber"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}>
                    <span>0{currentStep}</span>
                  </motion.div>
                  <div className="stepInfo">
                    <h3 className="stepTitle">{currentStepConfig.label}</h3>
                    <p className="stepDescription">
                      {stepDescriptions[currentStep]}
                    </p>
                  </div>
                  <div className="progressDots">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`progressDot ${
                          index === currentStepIndex ? "active" : ""
                        } ${index < currentStepIndex ? "completed" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                {currentStep !== 5 && (
                  <div className="quickHelp">
                    <div className="helpHeader">
                      <span className="helpIcon">⚡</span>
                      <span>Exchange Tips</span>
                    </div>
                    <ul className="tipsList">
                      <li>Check exchange rates before proceeding</li>
                      <li>Double-check bank account details</li>
                      <li>Transactions typically complete in 24 hours</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Card */}
            <div className="mainCard">
              <div className="cardHeader">
                <div className="cardGlow"></div>
                <h2 className="cardTitle">
                  {currentStep === 1 && "Currency Exchange"}
                  {currentStep === 2 && "Make Payment"}
                  {currentStep === 3 && "Verify Payment"}
                  {currentStep === 4 && "Bank Details"}
                  {currentStep === 5 && "Exchange Complete"}
                </h2>
                <div className="cardSubtitle">
                  <span className="subtitleLine"></span>
                  <span className="subtitleText">
                    {currentStep === 1 && "Convert your currency"}
                    {currentStep === 2 && "Complete your payment"}
                    {currentStep === 3 && "Confirm transaction details"}
                    {currentStep === 4 && "Provide receiving account"}
                    {currentStep === 5 && "Transaction successful"}
                  </span>
                </div>
              </div>

              <div className="cardContent">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="contentWrapper">
                    {isAnimating ? (
                      <div className="loadingState">
                        <div className="neonSpinner">
                          <div className="spinnerCore"></div>
                          <div className="spinnerRing"></div>
                        </div>
                        <p className="loadingText">Processing...</p>
                        <div className="loadingDots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {currentStep === 1 && (
                          <ConverterCard
                            data={exchangeData}
                            onNext={handleConverterNext}
                          />
                        )}

                        {currentStep === 2 && (
                          <PaymentAccount
                            fromCurrency={exchangeData.from}
                            onPaid={handlePaymentPaid}
                            onBack={() => setCurrentStep(1)}
                            amount={exchangeData.amount}
                            currencySymbol={
                              currencyInfo[exchangeData.from]?.symbol
                            }
                          />
                        )}

                        {currentStep === 3 && (
                          <PaymentStatus
                            onConfirmed={handlePaymentConfirmed}
                            amount={exchangeData.amount}
                            fromCurrency={exchangeData.from}
                          />
                        )}

                        {currentStep === 4 && paymentConfirmed && (
                          <UserBankForm
                            onSubmit={handleBankFormSubmit}
                            onBack={() => setCurrentStep(3)}
                            toCurrency={exchangeData.to}
                            convertedAmount={exchangeData.convertedAmount}
                          />
                        )}

                        {currentStep === 5 && (
                          <div className="successContainer">
                            <SuccessParticles />

                            <div className="successCard">
                              <div className="successCardGlow"></div>

                              <motion.div
                                className="successIcon"
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
                                <div className="successIconInner">
                                  <div className="successIconRing"></div>
                                  <span className="successCheck">✓</span>
                                </div>
                              </motion.div>

                              <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="successTitle">
                                Exchange Complete!
                              </motion.h2>

                              <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="successSubtitle">
                                Your funds will arrive within 24 hours. Check
                                your email for confirmation.
                              </motion.p>

                              <motion.div
                                className="transactionCard"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}>
                                <div className="transactionCardGlow"></div>

                                <div className="transactionHeader">
                                  <div className="transactionIdSection">
                                    <div className="transactionLabel">
                                      TRANSACTION ID
                                    </div>
                                    <div className="transactionId">
                                      TXN-
                                      {Date.now()
                                        .toString()
                                        .slice(-8)
                                        .toUpperCase()}
                                    </div>
                                  </div>

                                  <motion.button
                                    className="copyButton"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      const refId = `TXN-${Date.now()
                                        .toString()
                                        .slice(-8)
                                        .toUpperCase()}`;
                                      navigator.clipboard.writeText(refId);
                                      const btn =
                                        document.querySelector(".copyButton");
                                      if (btn) {
                                        btn.innerHTML = "✅ Copied!";
                                        setTimeout(() => {
                                          btn.innerHTML = "📋 Copy";
                                        }, 2000);
                                      }
                                    }}>
                                    📋 Copy
                                  </motion.button>
                                </div>

                                <div className="currencyExchangeDisplay">
                                  <motion.div
                                    className="currencyBox fromCurrency"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}>
                                    <div className="currencyLabel">
                                      YOU SENT
                                    </div>
                                    <div className="currencyAmount">
                                      {currencyInfo[exchangeData.from]?.symbol}
                                      {parseFloat(
                                        exchangeData.amount
                                      ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </div>
                                    <div className="currencyCode">
                                      {exchangeData.from}
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="exchangeArrow"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{
                                      duration: 20,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}>
                                    ⟳
                                  </motion.div>

                                  <motion.div
                                    className="currencyBox toCurrency"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}>
                                    <div className="currencyLabel">
                                      YOU RECEIVE
                                    </div>
                                    <div className="currencyAmount">
                                      {currencyInfo[exchangeData.to]?.symbol}
                                      {parseFloat(
                                        exchangeData.convertedAmount
                                      ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </div>
                                    <div className="currencyCode">
                                      {exchangeData.to}
                                    </div>
                                  </motion.div>
                                </div>

                                <div className="transactionDetailsGrid">
                                  <div className="detailItem">
                                    <div className="detailLabel">
                                      EXCHANGE RATE
                                    </div>
                                    <div className="detailValue">
                                      1 {exchangeData.from} ={" "}
                                      {exchangeData.from === "NGN" &&
                                      exchangeData.to === "USD"
                                        ? "0.00067"
                                        : exchangeData.from === "USD" &&
                                          exchangeData.to === "NGN"
                                        ? "1500"
                                        : "1.0000"}{" "}
                                      {exchangeData.to}
                                    </div>
                                  </div>

                                  <div className="detailItem">
                                    <div className="detailLabel">
                                      TRANSACTION FEE
                                    </div>
                                    <div className="detailValue">0.5%</div>
                                  </div>

                                  <div className="detailItem">
                                    <div className="detailLabel">STATUS</div>
                                    <div className="statusBadge">
                                      ✅ Completed
                                    </div>
                                  </div>

                                  <div className="detailItem">
                                    <div className="detailLabel">
                                      EST. ARRIVAL
                                    </div>
                                    <div className="detailValue">24 hours</div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="actionButtons"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}>
                                <motion.button
                                  className="secondaryButton"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => window.print()}>
                                  🖨️ Print Receipt
                                </motion.button>

                                <motion.button
                                  className="primaryButton"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={resetExchange}>
                                  Start New Exchange
                                </motion.button>
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
              <div className="cardFooter">
                <div className="footerStats">
                  <div className="stat">
                    <span className="statLabel">Step</span>
                    <span className="statValue">0{currentStep}/05</span>
                  </div>
                  <div className="stat">
                    <span className="statLabel">Status</span>
                    <span className="statValue">
                      {currentStep === 5 ? "Complete" : "In Progress"}
                    </span>
                  </div>
                </div>
                {currentStep !== 5 && (
                  <button className="assistButton">
                    <span className="assistIcon">⟳</span>
                    AI Assist
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
