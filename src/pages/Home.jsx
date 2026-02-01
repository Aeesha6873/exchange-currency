import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

import "../pages/home.css";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80",
      icon: "fas fa-exchange-alt",
      title: "Smart Currency Exchange",
      description:
        "Get the best exchange rates for 150+ currencies. Fast, secure, and transparent.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80",
      icon: "fas fa-plane",
      title: "Easy Flight Booking",
      description:
        "Find and book flights with exclusive deals and best price guarantee.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80",
      icon: "fas fa-suitcase",
      title: "Custom Travel Planning",
      description:
        "Personalized travel packages with hotels, tours, and local experiences.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80",
      icon: "fas fa-passport",
      title: "Seamless Visa Processing",
      description:
        "Expert guidance for visa applications to 50+ countries worldwide.",
    },
  ];

  // Change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    window.location.href = "/exchange";
  };

  const handleLearnMore = () => {
    document.querySelector(".services-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <>
      <Navbar />

      {/* Hero Section - Showcases Our Services */}
      <section className="hero">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === activeSlide ? "active" : ""}`}>
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80";
                }}
              />
            </div>
          ))}
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-service-icon">
            <i className={currentSlide.icon}></i>
          </div>
          <h1 className="hero-title">{currentSlide.title}</h1>
          <p className="hero-description">{currentSlide.description}</p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={handleGetStarted}>
              <i className="fas fa-rocket"></i>
              Get Started
            </button>
            <button className="btn-secondary" onClick={handleLearnMore}>
              <i className="fas fa-compass"></i>
              All Services
            </button>
          </div>
        </div>

        <div className="services-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`service-dots ${index === activeSlide ? "active" : ""}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`View ${heroSlides[index].title}`}
            />
          ))}
        </div>
      </section>

      {/* Services Section - 4 Equal Cards */}
      <section className="section services-section">
        <div className="section-headers">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive solutions for all your travel and financial needs
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-exchange-alt"></i>
            </div>
            <h3>Currency Exchange</h3>
            <p>
              Best rates for 150+ currencies with instant processing and
              complete transparency.
            </p>
            <button
              className="btn-service"
              onClick={() => navigateTo("/exchange")}>
              Exchange Now
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-plane"></i>
            </div>
            <h3>Flight Booking</h3>
            <p>
              Find and book flights worldwide with exclusive deals and flexible
              options.
            </p>
            <button
              className="btn-service"
              onClick={() => navigateTo("/flights")}>
              Book Flight
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-suitcase"></i>
            </div>
            <h3>Travel Planning</h3>
            <p>
              Customized travel packages with hotels, tours, and local
              experiences.
            </p>
            <button
              className="btn-service"
              onClick={() => navigateTo("/travel")}>
              Plan Trip
            </button>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-passport"></i>
            </div>
            <h3>Visa Services</h3>
            <p>
              Streamlined visa applications with expert guidance for 50+
              countries.
            </p>
            <button className="btn-service" onClick={() => navigateTo("/visa")}>
              Apply for Visa
            </button>
          </div>
        </div>
      </section>

      {/* Offers Section - 3 Equal Cards */}
      <section className="offers-section">
        <div className="section-headers">
          <h2 className="section-title">Special Offers</h2>
          <p className="section-subtitle">
            Limited time deals for our valued customers
          </p>
        </div>

        <div className="offers-grid">
          <div className="offer-card">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Flight Deal"
              className="offer-image"
            />
            <div className="offer-content">
              <span className="offer-badge">Save 20%</span>
              <h4>Flight Discount</h4>
              <p>20% off on international flights. Book before month end.</p>
              <button
                className="btn-offer"
                onClick={() => navigateTo("/flights")}>
                Book Now
              </button>
            </div>
          </div>

          <div className="offer-card">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Exchange Offer"
              className="offer-image"
            />
            <div className="offer-content">
              <span className="offer-badge">No Fees</span>
              <h4>Free Exchange</h4>
              <p>No fees on first $5,000 exchange for new customers.</p>
              <button
                className="btn-offer"
                onClick={() => navigateTo("/exchange")}>
                Exchange Now
              </button>
            </div>
          </div>

          <div className="offer-card">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Visa Offer"
              className="offer-image"
            />
            <div className="offer-content">
              <span className="offer-badge">Fast Track</span>
              <h4>Express Visa</h4>
              <p>Priority visa processing in just 48 hours.</p>
              <button className="btn-offer" onClick={() => navigateTo("/visa")}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - 4 Equal Cards */}
      <section className="features-section">
        <div className="section-headers">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            Experience the difference with our premium services
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>100% Secure</h3>
            <p>Bank-level security with SSL encryption and fraud protection.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-bolt"></i>
            </div>
            <h3>Lightning Fast</h3>
            <p>
              Instant transactions with real-time processing for all services.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-globe"></i>
            </div>
            <h3>Global Network</h3>
            <p>
              Services available in 150+ countries with local expert support.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer service in multiple languages.</p>
          </div>
        </div>
      </section>
    </>
  );
}
