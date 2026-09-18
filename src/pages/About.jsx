import React from "react";
import { Link } from "react-router-dom";
import {
  FiGlobe,
  FiShield,
  FiZap,
  FiHeart,
  FiAward,
  FiTrendingUp,
  FiArrowRight,
  FiUsers,
  FiCheck,
} from "react-icons/fi";
import styles from "./About.module.css";

const About = () => {
  const stats = [
    { value: "50K+", label: "Happy Travellers" },
    { value: "120+", label: "Countries Covered" },
    { value: "2M+", label: "Transactions" },
    { value: "4.9", label: "Customer Rating", star: true },
  ];

  const values = [
    {
      icon: <FiShield />,
      title: "Trust first",
      text: "Every transaction is encrypted, monitored, and backed by our money-back guarantee.",
    },
    {
      icon: <FiZap />,
      title: "Fast by design",
      text: "Instant currency quotes, same-day processing, and live booking confirmations.",
    },
    {
      icon: <FiHeart />,
      title: "Built for travellers",
      text: "Every feature starts with a real traveller's problem — never a business metric.",
    },
    {
      icon: <FiAward />,
      title: "Best rates, always",
      text: "Transparent pricing with no hidden fees. Find a better rate and we'll match it.",
    },
  ];

  const services = [
    {
      emoji: "💱",
      title: "Currency Exchange",
      text: "Live market rates, instant conversions, and transfers to bank accounts worldwide.",
      link: "/exchange",
    },
    {
      emoji: "✈️",
      title: "Flight Booking",
      text: "Compare hundreds of airlines, filter by price, stops or duration, and book in seconds.",
      link: "/flight",
    },
    {
      emoji: "🛂",
      title: "Visa Services",
      text: "Apply for tourist, business, and student visas with guided document checklists.",
      link: "/visa",
    },
    {
      emoji: "🏝️",
      title: "Travel Packages",
      text: "Handpicked hotels, tours, and experiences — fully customisable before you book.",
      link: "/travel-agency",
    },
  ];

  return (
    <div className={styles.about}>
      {/* ---- HERO ---- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.heroBadge}>
              <FiGlobe /> Trusted by 50,000+ travellers
            </span>
            <h1 className={styles.heroTitle}>
              Travel smarter.{" "}
              <span className={styles.heroAccent}>Live richer.</span>
            </h1>
            <p className={styles.heroLead}>
              TravelFin brings currency exchange, flights, visas, and travel
              packages under one roof — so you can plan, pay, and travel without
              the friction.
            </p>
            <div className={styles.heroActions}>
              <Link to="/register" className={styles.primaryBtn}>
                Get Started <FiArrowRight />
              </Link>
              <Link to="/contact" className={styles.secondaryBtn}>
                Contact Us
              </Link>
            </div>

            <ul className={styles.heroChecks}>
              <li>
                <FiCheck /> No hidden fees
              </li>
              <li>
                <FiCheck /> Bank-grade security
              </li>
              <li>
                <FiCheck /> 24/7 support
              </li>
            </ul>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <div className={styles.heroCardDot} />
                <div className={styles.heroCardDot} />
                <div className={styles.heroCardDot} />
              </div>
              <div className={styles.heroCardBody}>
                <div className={styles.heroRate}>
                  <span className={styles.heroRateLabel}>Live rate</span>
                  <span className={styles.heroRateValue}>$1 = €0.92</span>
                </div>
                <div className={styles.heroBalance}>
                  <span className={styles.heroBalanceLabel}>You receive</span>
                  <span className={styles.heroBalanceValue}>€1,380.00</span>
                </div>
                <div className={styles.heroProgress}>
                  <div className={styles.heroProgressBar} />
                </div>
                <div className={styles.heroMeta}>
                  <span>Transfer complete</span>
                  <span className={styles.heroMetaBadge}>
                    <FiCheck /> Sent
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.heroCardAccent} />
          </div>
        </div>
      </section>

      {/* ---- STATS ---- */}
      <section className={styles.stats}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statValue}>
              {s.value}
              {s.star && <span className={styles.statStar}>★</span>}
            </div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ---- MISSION ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>
            <FiTrendingUp /> Our mission
          </span>
          <h2 className={styles.sectionTitle}>
            Making global travel and finance friction-free
          </h2>
          <p className={styles.sectionLead}>
            We started TravelFin because planning a trip shouldn't mean juggling
            five different websites. From the first currency conversion to the
            last stamp in your passport, we handle it all.
          </p>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((v, i) => (
            <div key={i} className={styles.valueCard}>
              <div className={styles.valueIcon}>{v.icon}</div>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueText}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- SERVICES ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>
            <FiGlobe /> What we offer
          </span>
          <h2 className={styles.sectionTitle}>Four services. One platform.</h2>
          <p className={styles.sectionLead}>
            Everything you need to plan, pay, and travel — built and maintained
            by the same team.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((s, i) => (
            <Link key={i} to={s.link} className={styles.serviceCard}>
              <div className={styles.serviceEmoji}>{s.emoji}</div>
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceText}>{s.text}</p>
              <span className={styles.serviceLink}>
                Explore <FiArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <div className={styles.ctaLeft}>
            <div className={styles.ctaIconWrap}>
              <FiUsers />
            </div>
            <div>
              <h2 className={styles.ctaTitle}>
                Ready to start your next journey?
              </h2>
              <p className={styles.ctaText}>
                Create a free account and get access to all our services in
                under a minute.
              </p>
            </div>
          </div>
          <Link to="/register" className={styles.ctaButton}>
            Create Free Account <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
