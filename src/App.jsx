import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Exchange from "./pages/exchange/Exchange";
import VisaService from "./pages/visa/VisaService";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlightBookingPage from "./pages/FlightBooking/FlightBookingPage";
import TravelAgencyPage from "./pages/TravelAgency/TravelAgencyPage";
import DashboardHome from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";

import Transactions from "./pages/user/Transactions";
import Bookings from "./pages/user/Bookings";
import Settings from "./pages/user/Settings";

import Footer from "./components/Footer";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ManagerUsers from "./pages/admin/ManageUsers";
import ExchangeTransaction from "./pages/admin/ExchangeTransaction";

import AllUsers from "./pages/admin/AllUsers";
import FlightBookings from "./pages/admin/FlightBookings";

import ManageFlight from "./pages/admin/ManangeFlight";
import ExchangeRates from "./pages/admin/ExchangeRate";
import ToursPackages from "./pages/admin/ToursPackages";
import TravelBookings from "./pages/admin/TravelBookings";
import AdminSettings from "./pages/admin/AdminSettings";
import UserVisaRecords from "./pages/user/UserVisaRecords";
import Visa from "./pages/admin/AdminVisa";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/exchange"
          element={
            <>
              <Navbar />
              <Exchange />
              <Footer />
            </>
          }
        />
        <Route
          path="/visa"
          element={
            <>
              <Navbar />
              <VisaService />
              <Footer />
            </>
          }
        />

        <Route
          path="/flight"
          element={
            <>
              <Navbar />
              <FlightBookingPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/travel-agency"
          element={
            <>
              <Navbar />
              <TravelAgencyPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
              <Footer />
            </>
          }
        />

        {/* ========== USER DASHBOARD ROUTES ========== */}
        <Route path="/dashboard" element={<UserLayout />}>
          <Route index element={<DashboardHome />} />

          {/* Services */}
          <Route path="exchange" element={<Exchange />} />
          <Route path="visa" element={<VisaService />} />
          <Route path="flight" element={<FlightBookingPage />} />
          <Route path="travel-agency" element={<TravelAgencyPage />} />

          {/* Account Management */}
          <Route path="profile" element={<Profile />} />

          <Route path="transactions" element={<Transactions />} />
          <Route path="my-visa" element={<UserVisaRecords />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ========== ADMIN DASHBOARD ROUTES ========== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="manage-users" element={<ManagerUsers />} />
          <Route path="manage-users/:userId" element={<ManagerUsers />} />

          <Route path="transactions" element={<ExchangeTransaction />} />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="flight-bookings" element={<FlightBookings />} />

          <Route path="manage-flight" element={<ManageFlight />} />
          <Route path="rates" element={<ExchangeRates />} />
          <Route path="tours" element={<ToursPackages />} />
          <Route path="bookings" element={<TravelBookings />} />
          <Route path="visa" element={<Visa />} />
          <Route path="admin-settings" element={<AdminSettings />} />
        </Route>

        {/* ========== CATCH-ALL REDIRECT ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
