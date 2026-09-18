import React, { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiMessageSquare,
  FiUser,
  FiAlertCircle,
  FiChevronDown,
} from "react-icons/fi";
import styles from "./Contact.module.css";

const CONTACT_KEY = "contactMessages";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const all = JSON.parse(localStorage.getItem(CONTACT_KEY) || "[]");
    const newMessage = {
      id: `msg-${Date.now()}`,
      ...formData,
      submittedAt: new Date().toISOString(),
      status: "unread",
    };
    localStorage.setItem(CONTACT_KEY, JSON.stringify([...all, newMessage]));

    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "general",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  const contactInfo = [
    {
      icon: <FiMail />,
      label: "Email",
      value: "support@travelfin.com",
      href: "mailto:support@travelfin.com",
    },
    {
      icon: <FiPhone />,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: <FiMapPin />,
      label: "Address",
      value: "123 Main Street, New York, NY 10001",
    },
    {
      icon: <FiClock />,
      label: "Business hours",
      value: "Mon–Fri, 9:00 AM – 6:00 PM",
    },
  ];

  return (
    <div className={styles.contact}>
      {/* Header */}
      <section className={styles.hero}>
        <span className={styles.heroBadge}>
          <FiMessageSquare /> We reply within 2 hours
        </span>
        <h1 className={styles.title}>Get in touch</h1>
        <p className={styles.subtitle}>
          Have a question about a booking, an exchange, or a visa? Our team is
          here to help.
        </p>
      </section>

      {/* Layout */}
      <div className={styles.layout}>
        {/* Contact info sidebar */}
        <aside className={styles.infoPanel}>
          <div className={styles.infoPanelHeader}>
            <h2 className={styles.infoTitle}>Contact information</h2>
            <p className={styles.infoSubtitle}>
              Reach us through any of these channels
            </p>
          </div>

          <div className={styles.infoList}>
            {contactInfo.map((item, i) => (
              <div key={i} className={styles.infoItem}>
                <div className={styles.infoIcon}>{item.icon}</div>
                <div className={styles.infoBody}>
                  <div className={styles.infoLabel}>{item.label}</div>
                  {item.href ?
                    <a href={item.href} className={styles.infoValue}>
                      {item.value}
                    </a>
                  : <div className={styles.infoValue}>{item.value}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.responseNote}>
            <div className={styles.responseIcon}>
              <FiCheckCircle />
            </div>
            <div>
              <div className={styles.responseTitle}>
                Fast response guaranteed
              </div>
              <p className={styles.responseText}>
                Average reply in <strong>under 2 hours</strong> during business
                hours.
              </p>
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className={styles.formPanel}>
          {submitted ?
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <FiCheckCircle />
              </div>
              <h2 className={styles.successTitle}>Message sent</h2>
              <p className={styles.successText}>
                Thanks {formData.name.split(" ")[0] || "for reaching out"} —
                we've received your message and will reply to{" "}
                <strong>{formData.email}</strong> within a few hours.
              </p>
              <button className={styles.secondaryBtn} onClick={handleReset}>
                Send another message
              </button>
            </div>
          : <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Send us a message</h2>
                <p className={styles.formSubtitle}>
                  Fill in the form below and we'll get back to you shortly.
                </p>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="name">
                    <FiUser /> Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={errors.name ? styles.inputError : ""}
                  />
                  {errors.name && (
                    <span className={styles.errorText}>
                      <FiAlertCircle size={12} /> {errors.name}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">
                    <FiMail /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={errors.email ? styles.inputError : ""}
                  />
                  {errors.email && (
                    <span className={styles.errorText}>
                      <FiAlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="phone">
                    <FiPhone /> Phone <span>optional</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 0000"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="subject">
                    <FiMessageSquare /> Subject
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}>
                      <option value="general">General inquiry</option>
                      <option value="exchange">Currency exchange</option>
                      <option value="flight">Flight booking</option>
                      <option value="visa">Visa services</option>
                      <option value="travel">Travel packages</option>
                      <option value="billing">Billing & payments</option>
                      <option value="technical">Technical issue</option>
                    </select>
                    <FiChevronDown className={styles.selectIcon} />
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="message">
                  <FiMessageSquare /> Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className={errors.message ? styles.inputError : ""}
                />
                {errors.message && (
                  <span className={styles.errorText}>
                    <FiAlertCircle size={12} /> {errors.message}
                  </span>
                )}
              </div>

              <div className={styles.formFooter}>
                <p className={styles.formNote}>
                  By submitting, you agree to our terms of service.
                </p>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}>
                  {isSubmitting ?
                    "Sending..."
                  : <>
                      <FiSend /> Send Message
                    </>
                  }
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  );
};

export default Contact;
