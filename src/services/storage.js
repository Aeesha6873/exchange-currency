export const KEYS = {
  CURRENT_USER: "currentUser",
  USERS: "users",
  BOOKINGS: "bookings",
  TRANSACTIONS: "transactions",
  NOTIFICATIONS: "notifications",
  RATES: "exchangeRates",
  SEEDED: "seeded_v1",

  // Visa
  VISA_APPLICATIONS: "visaApplications",
  VISA_COUNTRIES: "visaCountries",
  VISA_DEPARTURE_TIMES: "visaDepartureTimes",
  VISA_DURATIONS: "visaDurations",
  VISA_PRICING: "visaPricing",

  // Travel Agency
  TRAVEL_DESTINATIONS: "travelDestinations",
  TRAVEL_PACKAGES: "travelPackages",
};

export const get = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const remove = (key) => {
  localStorage.removeItem(key);
};

export const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const uid = (prefix = "id") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
