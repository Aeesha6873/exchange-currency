import React, { useState } from "react";
import {
  FiHelpCircle,
  FiChevronDown,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiSearch,
} from "react-icons/fi";
import styles from "./Help.module.css";

const FAQ_ITEMS = [
  {
    q: "How long does a currency exchange take?",
    a: "Most exchanges settle within 1–3 business days. Urgent transfers can settle same-day for an additional fee — this option appears at checkout.",
  },
  {
    q: "How do I cancel a flight booking?",
    a: "Go to Dashboard → Bookings, find your booking, and click Cancel. Refund amounts depend on the airline's policy, shown before you confirm the cancellation.",
  },
  {
    q: "What documents do I need for a visa application?",
    a: "Requirements vary by country. When you select a destination on the visa page, you'll see the exact checklist for that country — usually a valid passport (6+ months), a passport photo, and financial or accommodation proof.",
  },
  {
    q: "Can I change the passenger name on a ticket?",
    a: "Name changes are usually not allowed after ticketing. You may need to cancel and rebook. Contact support and we'll walk you through the specific airline's rules.",
  },
  {
    q: "How do I know if a rate is locked?",
    a: "Once you click Confirm on the review step, the rate is locked for that transaction. The locked rate is shown on your receipt and in the Transactions page.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. We never store full card numbers — only the last four digits for reference. All payment data is tokenized by our processor and encrypted end-to-end.",
  },
];

const Help = () => {
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");

  const toggle = (i) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));

  const filtered = FAQ_ITEMS.filter(
    (item) =>
      !search ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.help}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>
          <FiHelpCircle />
        </div>
        <h1 className={styles.heroTitle}>Help Center</h1>
        <p className={styles.heroSubtitle}>
          Answers to common questions, plus multiple ways to reach us when you
          need a hand.
        </p>

        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className={styles.contactStrip}>
        <a href="/contact" className={styles.contactCard}>
          <div className={styles.contactIcon}>
            <FiMessageSquare />
          </div>
          <div className={styles.contactBody}>
            <div className={styles.contactTitle}>Contact support</div>
            <div className={styles.contactDesc}>We reply within 2 hours</div>
          </div>
        </a>
        <a href="mailto:support@travelfin.com" className={styles.contactCard}>
          <div className={styles.contactIcon}>
            <FiMail />
          </div>
          <div className={styles.contactBody}>
            <div className={styles.contactTitle}>Email us</div>
            <div className={styles.contactDesc}>support@travelfin.com</div>
          </div>
        </a>
        <a
          href="tel: +234 916 001 1585 | 7000048006"
          className={styles.contactCard}>
          <div className={styles.contactIcon}>
            <FiPhone />
          </div>
          <div className={styles.contactBody}>
            <div className={styles.contactTitle}>Call us</div>
            <div className={styles.contactDesc}>+234 703 485 7569</div>
          </div>
        </a>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection} id="faq">
        <div className={styles.faqHeader}>
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
          <span className={styles.sectionCount}>
            {filtered.length} article{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {filtered.length === 0 ?
          <div className={styles.emptyFaq}>
            <FiSearch />
            <p>No articles match "{search}".</p>
          </div>
        : <div className={styles.faqList}>
            {filtered.map((item, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${open[i] ? styles.open : ""}`}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggle(i)}
                  aria-expanded={!!open[i]}>
                  <span>{item.q}</span>
                  <FiChevronDown className={styles.faqChevron} />
                </button>
                {open[i] && <p className={styles.faqAnswer}>{item.a}</p>}
              </div>
            ))}
          </div>
        }
      </section>
    </div>
  );
};

export default Help;
