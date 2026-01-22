import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import styles from "../pages/register.module.css";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (password) => {
    if (!password) return "";
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    let score = 0;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    if (length >= 8) score++;

    if (score >= 5) return "strong";
    if (score >= 3) return "medium";
    return "weak";
  };

  useEffect(() => {
    const strength = checkPasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstError}"]`)?.focus();
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const existingUser = users.find((user) => user.email === formData.email);

      if (existingUser) {
        setErrors({ submit: "User with this email already exists" });
        setIsLoading(false);
        return;
      }

      // Save user to localStorage
      const newUser = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      console.log("Registration successful:", newUser);

      // Show success message and redirect to login
      setTimeout(() => {
        navigate("/login", { state: { registeredEmail: formData.email } });
      }, 500);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    alert("Google sign-up would be implemented here");
  };

  const GoogleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <div className={styles.registrationPage}>
      <Navbar />
      <div className={styles.registrationContainer}>
        <div className={styles.registrationCard}>
          <div className={styles.cardHeader}>
            <h1>Create Account</h1>
            <p className={styles.subtitle}>
              Join CurrencyX to start managing your finances
            </p>
          </div>

          <button
            type="button"
            className={styles.googleSignupBtn}
            onClick={handleGoogleSignUp}>
            <span className={styles.googleIcon}>
              <GoogleIcon />
            </span>
            Sign up with Google
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>Or continue with email</span>
            <span className={styles.dividerLine}></span>
          </div>

          <form
            className={styles.registrationForm}
            onSubmit={handleSubmit}
            noValidate>
            {errors.submit && (
              <div className={`${styles.errorMessage} ${styles.globalError}`}>
                <FiAlertCircle /> <span>{errors.submit}</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="fullName">
                <FiUser size={14} /> Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`${styles.formInput} ${
                  errors.fullName ? styles.error : ""
                }`}
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
                autoFocus
              />
              {errors.fullName && (
                <div className={styles.errorMessage}>
                  <FiAlertCircle size={12} /> <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                <FiMail size={14} /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.formInput} ${
                  errors.email ? styles.error : ""
                }`}
                placeholder="john@example.com"
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <div className={styles.errorMessage}>
                  <FiAlertCircle size={12} /> <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                <FiLock size={14} /> Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${styles.formInput} ${
                    errors.password ? styles.error : ""
                  }`}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {formData.password && passwordStrength && (
                <div
                  className={`${styles.passwordStrength} ${styles[passwordStrength]}`}>
                  {passwordStrength === "strong"
                    ? "Strong password ✓"
                    : passwordStrength === "medium"
                    ? "Medium password"
                    : "Weak password"}
                </div>
              )}
              {errors.password && (
                <div className={styles.errorMessage}>
                  <FiAlertCircle size={12} /> <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">
                <FiLock size={14} /> Confirm Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${styles.formInput} ${
                    errors.confirmPassword ? styles.error : ""
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  tabIndex={-1}>
                  {showConfirmPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className={styles.errorMessage}>
                  <FiAlertCircle size={12} />{" "}
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            <div className={styles.termsContainer}>
              <label className={styles.termsCheckbox}>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className={styles.checkmark}></span>
                <span className={styles.termsText}>
                  I agree to the{" "}
                  <Link to="/terms" className={styles.termsLink}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className={styles.termsLink}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <div className={styles.errorMessage}>
                  <FiAlertCircle size={12} /> <span>{errors.acceptTerms}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className={styles.loading}></span> Creating Account...
                </>
              ) : (
                <>
                  <FiCheckCircle size={16} /> Create Account
                </>
              )}
            </button>

            <div className={styles.loginLink}>
              Already have an account?{" "}
              <Link to="/login" className={styles.loginLinkBtn}>
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
