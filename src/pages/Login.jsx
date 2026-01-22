import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

import styles from "../pages/login.module.css";
import {
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiMail,
  FiLock,
  FiShield,
} from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail = location.state?.registeredEmail || "";

  const [formData, setFormData] = useState({
    email: registeredEmail,
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);

  // HARDCODED ADMIN CREDENTIALS
  const ADMIN_USERS = [
    {
      email: "admin@gmail.com",
      password: "admin123",
      fullName: "System Administrator",
      role: "admin",
      isAdmin: true,
      permissions: ["all"],
    },
    {
      email: "support@travelfin.com",
      password: "support123",
      fullName: "Support Admin",
      role: "support",
      isAdmin: true,
      permissions: ["users", "bookings", "support"],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trimStart(),
    });

    // Check if email matches admin pattern
    if (name === "email") {
      const email = value.toLowerCase();
      setShowAdminHint(email.includes("admin") || email.includes("support"));
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.keys(validationErrors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 1. FIRST CHECK: Is this an admin user?
      const adminUser = ADMIN_USERS.find(
        (admin) =>
          admin.email.toLowerCase() === formData.email.toLowerCase() &&
          admin.password === formData.password
      );

      if (adminUser) {
        console.log("Admin login successful:", adminUser);
        setLoginSuccess(true);

        // Save admin session
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: `admin-${Date.now()}`,
            email: adminUser.email,
            fullName: adminUser.fullName,
            role: adminUser.role,
            isAdmin: true,
            permissions: adminUser.permissions,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          })
        );

        // Redirect to ADMIN dashboard
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 300);
        return;
      }

      // 2. SECOND CHECK: Is this a regular user?
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === formData.email.toLowerCase() &&
          u.password === formData.password
      );

      if (!user) {
        setErrors({ submit: "Invalid email or password." });
        setIsLoading(false);
        return;
      }

      console.log("Regular user login successful:", user);
      setLoginSuccess(true);

      // Save regular user session
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: "user",
          isAdmin: false,
          createdAt: user.createdAt,
          lastLogin: new Date().toISOString(),
        })
      );

      // Redirect to USER dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 300);
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login would be implemented here");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
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
    <div className={styles.loginPage}>
      <Navbar />
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <h1>Sign in to your account</h1>
            <p className={styles.subtitle}>
              Welcome back! Please enter your details.
            </p>
          </div>

          {showAdminHint && (
            <div className={styles.adminHint}>
              <FiShield />
              <span>Admin account detected</span>
            </div>
          )}

          <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
            {errors.submit && (
              <div className={`${styles.errorMessage} ${styles.globalError}`}>
                <FiAlertCircle /> <span>{errors.submit}</span>
              </div>
            )}

            {loginSuccess && (
              <div
                className={`${styles.errorMessage} ${styles.successMessage}`}>
                <FiCheckCircle /> <span>Login successful! Redirecting...</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email">
                <FiMail /> Email
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
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
                autoFocus
              />
              {errors.email && (
                <div className={styles.errorMessage}>
                  <FiAlertCircle size={12} /> <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                <FiLock /> Password
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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <div className={styles.errorMessage}>
                  <FiAlertCircle size={12} /> <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className={styles.forgotPassword}>
              <a
                href="/forgot-password"
                className={styles.forgotPasswordLink}
                onClick={handleForgotPassword}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || loginSuccess}>
              {isLoading
                ? "Signing in..."
                : loginSuccess
                ? "Success!"
                : "Sign in"}
            </button>

            <div className={styles.loginOptions}>Or continue with</div>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
              disabled={isLoading || loginSuccess}>
              <span className={styles.googleIcon}>
                <GoogleIcon />
              </span>{" "}
              Sign in with Google
            </button>

            <div className={styles.registerLink}>
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
