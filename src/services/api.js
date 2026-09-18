import { KEYS, get, set, remove, delay, uid } from "./storage";

/* AUTH ------------------------------------------------------------- */
export const authApi = {
  getCurrentUser: () => get(KEYS.CURRENT_USER),
  setCurrentUser: (user) => set(KEYS.CURRENT_USER, user),
  logout: () => remove(KEYS.CURRENT_USER),
  getAllUsers: () => get(KEYS.USERS, []),
  saveAllUsers: (users) => set(KEYS.USERS, users),
};

/* BOOKINGS --------------------------------------------------------- */
export const bookingsApi = {
  list: async (userId) => {
    await delay();
    return get(KEYS.BOOKINGS, []).filter((b) => b.userId === userId);
  },
  get: async (id) => {
    await delay();
    return get(KEYS.BOOKINGS, []).find((b) => b.id === id) || null;
  },
  create: async (userId, booking) => {
    await delay();
    const all = get(KEYS.BOOKINGS, []);
    const newBooking = {
      id: uid("bk"),
      userId,
      createdAt: new Date().toISOString(),
      status: "pending",
      ...booking,
    };
    set(KEYS.BOOKINGS, [...all, newBooking]);
    return newBooking;
  },
  update: async (id, patch) => {
    await delay();
    const all = get(KEYS.BOOKINGS, []);
    const next = all.map((b) => (b.id === id ? { ...b, ...patch } : b));
    set(KEYS.BOOKINGS, next);
    return next.find((b) => b.id === id);
  },
  cancel: async (id) => bookingsApi.update(id, { status: "cancelled" }),
  listAll: () => get(KEYS.BOOKINGS, []),
  replaceAll: (rows) => set(KEYS.BOOKINGS, rows),
};

/* TRANSACTIONS ----------------------------------------------------- */
export const transactionsApi = {
  list: async (userId) => {
    await delay();
    return get(KEYS.TRANSACTIONS, []).filter((t) => t.userId === userId);
  },
  create: async (userId, txn) => {
    await delay();
    const all = get(KEYS.TRANSACTIONS, []);
    const newTxn = {
      id: uid("tx"),
      userId,
      createdAt: new Date().toISOString(),
      status: "pending",
      ...txn,
    };
    set(KEYS.TRANSACTIONS, [...all, newTxn]);
    return newTxn;
  },
  update: async (id, patch) => {
    await delay();
    const all = get(KEYS.TRANSACTIONS, []);
    const next = all.map((t) => (t.id === id ? { ...t, ...patch } : t));
    set(KEYS.TRANSACTIONS, next);
    return next.find((t) => t.id === id);
  },
  listAll: () => get(KEYS.TRANSACTIONS, []),
  replaceAll: (rows) => set(KEYS.TRANSACTIONS, rows),
};

/* NOTIFICATIONS ---------------------------------------------------- */
export const notificationsApi = {
  list: async (userId) => {
    await delay();
    return get(KEYS.NOTIFICATIONS, []).filter(
      (n) => n.userId === userId || n.userId === "all",
    );
  },
  create: async (notification) => {
    const all = get(KEYS.NOTIFICATIONS, []);
    const newNotif = {
      id: uid("nt"),
      createdAt: new Date().toISOString(),
      ...notification,
    };
    set(KEYS.NOTIFICATIONS, [...all, newNotif]);
    return newNotif;
  },
  broadcast: (payload) =>
    notificationsApi.create({ userId: "all", ...payload }),
};

/* RATES ------------------------------------------------------------ */
export const ratesApi = {
  list: async () => {
    await delay();
    return get(KEYS.RATES, []);
  },
  update: async (rates) => {
    set(KEYS.RATES, rates);
    return rates;
  },
};

/* PROFILE ---------------------------------------------------------- */
export const profileApi = {
  get: async (userId) => {
    await delay();
    const users = get(KEYS.USERS, []);
    return users.find((u) => u.id === userId) || authApi.getCurrentUser();
  },
  update: async (userId, patch) => {
    await delay();
    const users = get(KEYS.USERS, []);
    const next = users.map((u) => (u.id === userId ? { ...u, ...patch } : u));
    set(KEYS.USERS, next);
    const current = authApi.getCurrentUser();
    if (current && current.id === userId) {
      authApi.setCurrentUser({ ...current, ...patch });
    }
    return next.find((u) => u.id === userId);
  },
};

/* VISA ------------------------------------------------------------- */
export const visaApi = {
  getCountries: async () => {
    await delay();
    return get(KEYS.VISA_COUNTRIES, []);
  },
  saveCountries: (rows) => set(KEYS.VISA_COUNTRIES, rows),

  getDepartureTimes: async () => {
    await delay();
    return get(KEYS.VISA_DEPARTURE_TIMES, []);
  },
  saveDepartureTimes: (rows) => set(KEYS.VISA_DEPARTURE_TIMES, rows),

  getDurations: async () => {
    await delay();
    return get(KEYS.VISA_DURATIONS, []);
  },
  saveDurations: (rows) => set(KEYS.VISA_DURATIONS, rows),

  listForUser: async (userId) => {
    await delay();
    return get(KEYS.VISA_APPLICATIONS, []).filter((a) => a.userId === userId);
  },
  get: async (id) => {
    await delay();
    return get(KEYS.VISA_APPLICATIONS, []).find((a) => a.id === id) || null;
  },
  create: async (userId, application) => {
    await delay();
    const all = get(KEYS.VISA_APPLICATIONS, []);
    const newApp = {
      id: uid("visa"),
      userId,
      applicationId: `VISA-${Date.now().toString().slice(-8).toUpperCase()}`,
      status: "processing",
      submittedAt: new Date().toISOString(),
      ...application,
    };
    set(KEYS.VISA_APPLICATIONS, [...all, newApp]);
    return newApp;
  },
  update: async (id, patch) => {
    await delay();
    const all = get(KEYS.VISA_APPLICATIONS, []);
    const next = all.map((a) => (a.id === id ? { ...a, ...patch } : a));
    set(KEYS.VISA_APPLICATIONS, next);
    return next.find((a) => a.id === id);
  },
  listAll: () => get(KEYS.VISA_APPLICATIONS, []),
};

/* TRAVEL AGENCY ---------------------------------------------------- */
export const travelApi = {
  /* --- Destinations (config, admin-managed, read by user) --- */
  getDestinations: async () => {
    await delay();
    return get(KEYS.TRAVEL_DESTINATIONS, []);
  },
  saveDestinations: (rows) => set(KEYS.TRAVEL_DESTINATIONS, rows),

  /* --- Packages (config, admin-managed, read by user) --- */
  getPackages: async () => {
    await delay();
    return get(KEYS.TRAVEL_PACKAGES, []);
  },
  getPackagesByDestination: async (destinationId) => {
    await delay();
    return get(KEYS.TRAVEL_PACKAGES, []).filter(
      (p) => p.destinationId === destinationId && p.isActive !== false,
    );
  },
  savePackages: (rows) => set(KEYS.TRAVEL_PACKAGES, rows),

  /* --- Bookings (created by user, read by user + admin) --- */
  createBooking: async (userId, booking) => {
    await delay();
    const all = get(KEYS.BOOKINGS, []);
    const newBooking = {
      id: uid("bk"),
      userId,
      reference: `TR-${Date.now().toString().slice(-6)}`,
      type: "tour",
      status: "pending",
      createdAt: new Date().toISOString(),
      ...booking,
    };
    set(KEYS.BOOKINGS, [...all, newBooking]);
    return newBooking;
  },

  listUserBookings: async (userId) => {
    await delay();
    return get(KEYS.BOOKINGS, []).filter(
      (b) => b.userId === userId && b.type === "tour",
    );
  },

  // Admin
  listAllBookings: () => get(KEYS.BOOKINGS, []),
  updateBooking: async (id, patch) => {
    await delay();
    const all = get(KEYS.BOOKINGS, []);
    const next = all.map((b) => (b.id === id ? { ...b, ...patch } : b));
    set(KEYS.BOOKINGS, next);
    return next.find((b) => b.id === id);
  },
};
