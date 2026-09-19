import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

import PublicLayout from "./layouts/PublicLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Exchange from "./pages/exchange/Exchange";
import VisaService from "./pages/visa/VisaService";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlightBookingPage from "./pages/FlightBooking/FlightBookingPage";
import TravelAgencyPage from "./pages/TravelAgency/TravelAgencyPage";
import Rates from "./pages/Rates";
import Calculator from "./pages/Calculator";
import Legal from "./pages/Legal";
import Help from "./pages/Help";

import DashboardHome from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Transactions from "./pages/user/Transactions";
import Bookings from "./pages/user/Bookings";
import Settings from "./pages/user/Settings";
import UserVisaRecords from "./pages/user/UserVisaRecords";

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
import Visa from "./pages/admin/AdminVisa";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ========== PUBLIC ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/visa" element={<VisaService />} />
          <Route path="/flight" element={<FlightBookingPage />} />
          <Route path="/travel-agency" element={<TravelAgencyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Legal />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/cookies" element={<Legal />} />
          <Route path="/security" element={<Legal />} />
        </Route>

        {/* ========== USER DASHBOARD ========== */}
        <Route path="/dashboard" element={<UserLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="exchange" element={<Exchange />} />
          <Route path="visa" element={<VisaService />} />
          <Route path="flight" element={<FlightBookingPage />} />
          <Route path="travel-agency" element={<TravelAgencyPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="my-visa" element={<UserVisaRecords />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ========== ADMIN DASHBOARD ========== */}
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

        {/* ========== CATCH-ALL ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
