import React from "react";
import { useLocation } from "react-router-dom";
import { FiShield, FiFileText, FiLock, FiInfo } from "react-icons/fi";
import styles from "./Legal.module.css";

const LEGAL_CONTENT = {
  "/privacy": {
    title: "Privacy Policy",
    short: "Privacy",
    icon: <FiLock />,
    updated: "January 2024",
    intro:
      "Your privacy matters. This policy explains what data we collect, how we use it, and the choices you have.",
    sections: [
      {
        heading: "Information we collect",
        body: "We collect the information you provide directly — name, email, phone number, address, passport details for visa applications, and transaction data for exchanges and bookings. We also collect technical information like your browser, IP address, and device type when you use the site.",
      },
      {
        heading: "How we use your information",
        body: "We use your data to provide our services (currency exchange, flight bookings, visa applications, travel packages), to communicate with you about your transactions, to prevent fraud, and to improve the platform. We never sell your personal data.",
      },
      {
        heading: "Sharing with third parties",
        body: "We share data only where necessary: with airlines to issue tickets, with hotels and tour operators to confirm bookings, with visa authorities to process applications, and with payment processors to settle transactions. Each partner is contractually required to protect your data.",
      },
      {
        heading: "Your rights",
        body: "You can access, correct, export, or delete your personal data at any time from your account settings or by contacting support. You can also opt out of marketing communications without losing access to essential service messages.",
      },
      {
        heading: "Data retention",
        body: "We retain transactional records for at least 7 years to comply with financial regulations. Other personal data is deleted within 30 days of account closure unless a legal requirement says otherwise.",
      },
    ],
  },
  "/terms": {
    title: "Terms of Service",
    short: "Terms",
    icon: <FiFileText />,
    updated: "January 2024",
    intro:
      "These terms govern your use of TravelFin. By creating an account or using any of our services, you agree to them.",
    sections: [
      {
        heading: "Using our services",
        body: "You must be at least 18 years old to use TravelFin. You agree to provide accurate information, keep your password secure, and use the platform for lawful purposes only.",
      },
      {
        heading: "Currency exchange",
        body: "Exchange rates are displayed before you confirm a transaction. Once confirmed, the rate is locked. Transfers typically settle within 1–3 business days. Refunds are subject to the receiving bank's timeline.",
      },
      {
        heading: "Flight and travel bookings",
        body: "Bookings are made on behalf of airlines, hotels, and tour operators. Their terms and conditions apply in addition to ours. Cancellations, changes, and refunds follow the supplier's policy, which is shown before checkout.",
      },
      {
        heading: "Visa applications",
        body: "We facilitate submission but do not issue visas. Approval is decided solely by the destination country's authorities. Fees for rejected applications are non-refundable.",
      },
      {
        heading: "Account suspension",
        body: "We may suspend accounts involved in fraud, abuse, or violations of these terms. You will be notified and given an opportunity to appeal where appropriate.",
      },
    ],
  },
  "/cookies": {
    title: "Cookie Policy",
    short: "Cookies",
    icon: <FiInfo />,
    updated: "January 2024",
    intro:
      "Cookies help us keep you signed in, remember your preferences, and understand how the site is used.",
    sections: [
      {
        heading: "Essential cookies",
        body: "These are required for the site to work — they keep you logged in, remember your currency preferences, and secure your session. You cannot disable them.",
      },
      {
        heading: "Analytics cookies",
        body: "We use analytics to understand which pages are popular and where users get stuck. This data is aggregated and does not identify you personally.",
      },
      {
        heading: "Preference cookies",
        body: "These remember your language, currency, and display settings across visits so you don't have to set them every time.",
      },
      {
        heading: "Managing cookies",
        body: "You can clear or block cookies in your browser settings. Blocking essential cookies will prevent you from logging in.",
      },
    ],
  },
  "/security": {
    title: "Security",
    short: "Security",
    icon: <FiShield />,
    updated: "January 2024",
    intro:
      "Protecting your money and data is our top priority. Here's how we do it.",
    sections: [
      {
        heading: "Encryption",
        body: "All traffic to and from TravelFin uses TLS 1.3. Sensitive data — passwords, payment details, passport information — is encrypted at rest with AES-256.",
      },
      {
        heading: "Two-factor authentication",
        body: "Every admin account requires 2FA. Users can enable it from their profile for an extra layer of protection on logins and large transactions.",
      },
      {
        heading: "Monitoring",
        body: "Transactions are monitored in real time for unusual patterns. Suspicious activity triggers additional verification before proceeding.",
      },
      {
        heading: "Reporting a vulnerability",
        body: "If you believe you've found a security issue, email security@travelfin.com. We respond within 24 hours and never pursue legal action against good-faith researchers.",
      },
    ],
  },
};

const Legal = () => {
  const location = useLocation();
  const content = LEGAL_CONTENT[location.pathname];

  if (!content) {
    return (
      <div className={styles.legal}>
        <div className={styles.notFound}>
          <h1>Page not found</h1>
          <a href="/">Go home</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.legal}>
      <div className={styles.container}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroIcon}>{content.icon}</div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>{content.title}</h1>
            <p className={styles.heroUpdated}>
              Last updated: {content.updated}
            </p>
          </div>
        </section>

        <div className={styles.layout}>
          {/* TABLE OF CONTENTS */}
          <aside className={styles.toc}>
            <div className={styles.tocTitle}>On this page</div>
            <ul className={styles.tocList}>
              {content.sections.map((s, i) => (
                <li key={i}>
                  <a href={`#section-${i}`}>
                    <span className={styles.tocNumber}>{i + 1}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* ARTICLE */}
          <article className={styles.article}>
            <p className={styles.intro}>{content.intro}</p>

            {content.sections.map((s, i) => (
              <section key={i} id={`section-${i}`} className={styles.section}>
                <h2 className={styles.heading}>
                  <span className={styles.headingNumber}>{i + 1}</span>
                  {s.heading}
                </h2>
                <p className={styles.body}>{s.body}</p>
              </section>
            ))}

            <div className={styles.footerNote}>
              <p>
                Questions about this page?{" "}
                <a href="/contact">Contact our support team</a> — we reply
                within 2 hours.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Legal;
