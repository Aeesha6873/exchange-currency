// route/UserRoutes.jsx
import { Routes, Route } from "react-router-dom";
import DashboardHome from "../pages/user/Dashboard";

// Import your existing service pages
import Exchange from "../pages/exchange/Exchange";
import FlightBookingPage from "../pages/FlightBooking/FlightBookingPage";
import TravelAgencyPage from "../pages/TravelAgency/TravelAgencyPage";

import Profile from "../pages/dashboard/Profile";
import Wallet from "../pages/dashboard/Wallet";
import Transactions from "../pages/dashboard/Transactions";
import Bookings from "../pages/dashboard/Bookings";
import Settings from "../pages/dashboard/Settings";

function UserRoutes() {
  return (
    <div className="dashboard-content">
      <Routes>
        {/* Dashboard Home */}
        <Route path="/" element={<DashboardHome />} />

        {/* Account Management */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/settings" element={<Settings />} />

        {/* SERVICES - These are CRITICAL */}
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/flight" element={<FlightBookingPage />} />
        <Route path="/travel-agency" element={<TravelAgencyPage />} />
      </Routes>
    </div>
  );
}

export default UserRoutes;
