import { KEYS, get, set } from "./storage";

export function seedIfEmpty() {
  if (get(KEYS.SEEDED)) return;

  /* ---------------- EMPTY USER DATA ---------------- */
  set(KEYS.USERS, []);
  set(KEYS.BOOKINGS, []);
  set(KEYS.TRANSACTIONS, []);
  set(KEYS.RATES, []);
  set(KEYS.NOTIFICATIONS, []);
  set(KEYS.VISA_APPLICATIONS, []);
  set(KEYS.VISA_PRICING, []);

  /* ---------------- VISA CATALOG ---------------- */
  const visaCountries = [
    {
      id: "uk",
      name: "United Kingdom",
      flag: "🇬🇧",
      basePrice: 450,
      currency: "£",
      processing: "5-7 days",
      isActive: true,
      visaTypes: ["tourist", "business", "student"],
      requirements: ["Valid passport", "Financial proof", "Accommodation"],
    },
    {
      id: "china",
      name: "China",
      flag: "🇨🇳",
      basePrice: 350,
      currency: "¥",
      processing: "7-10 days",
      isActive: true,
      visaTypes: ["business", "tourist", "work"],
      requirements: ["Passport photo", "Invitation letter"],
    },
    {
      id: "umarah",
      name: "Umarah",
      flag: "🇸🇦",
      basePrice: 300,
      currency: "SAR",
      processing: "3-5 days",
      isActive: true,
      visaTypes: ["tourist", "business", "religious"],
      requirements: ["Passport copy", "Hotel booking"],
    },
    {
      id: "qatar",
      name: "Qatar",
      flag: "🇶🇦",
      basePrice: 400,
      currency: "QAR",
      processing: "4-6 days",
      isActive: true,
      visaTypes: ["tourist", "business"],
      requirements: ["Passport valid 6 months"],
    },
    {
      id: "dubai",
      name: "Dubai",
      flag: "🇦🇪",
      basePrice: 380,
      currency: "AED",
      processing: "2-4 days",
      isActive: true,
      visaTypes: ["tourist", "transit", "work"],
      requirements: ["Passport", "Photo"],
    },
    {
      id: "algeria",
      name: "Algeria",
      flag: "🇩🇿",
      basePrice: 250,
      currency: "DZD",
      processing: "5-8 days",
      isActive: true,
      visaTypes: ["tourist", "business"],
      requirements: ["Valid passport", "Return ticket"],
    },
  ];

  const visaDepartureTimes = [
    {
      id: "urgent",
      label: "Urgent",
      time: "24-48 hours",
      iconKey: "clock",
      badge: "Premium",
    },
    {
      id: "express",
      label: "Express",
      time: "3-5 days",
      iconKey: "calendarDay",
      badge: "Fast",
    },
    {
      id: "standard",
      label: "Standard",
      time: "7-10 days",
      iconKey: "calendar",
      badge: "Popular",
    },
    {
      id: "regular",
      label: "Regular",
      time: "15-20 days",
      iconKey: "calendarDay",
      badge: "Economy",
    },
  ];

  const visaDurations = [
    {
      id: "30",
      label: "Short Stay",
      time: "1 month",
      iconKey: "calendarDay",
      badge: "Quick",
    },
    {
      id: "90",
      label: "Tourist",
      time: "3 months",
      iconKey: "calendar",
      badge: "Popular",
    },
    {
      id: "180",
      label: "Business",
      time: "6 months",
      iconKey: "calendarDay",
      badge: "Work",
    },
    {
      id: "365",
      label: "Long Term",
      time: "1 year",
      iconKey: "calendar",
      badge: "Extended",
    },
    {
      id: "730",
      label: "Residence",
      time: "2 years",
      iconKey: "calendarDay",
      badge: "Long-term",
    },
  ];

  set(KEYS.VISA_COUNTRIES, visaCountries);
  set(KEYS.VISA_DEPARTURE_TIMES, visaDepartureTimes);
  set(KEYS.VISA_DURATIONS, visaDurations);

  /* ---------------- TRAVEL DESTINATIONS ---------------- */
  // Admin manages from /admin/tours. Users browse from /travel-agency.
  const travelDestinations = [
    {
      id: "bali",
      name: "Bali",
      country: "Indonesia",
      flag: "🇮🇩",
      image: "",
      tagline: "Island of the Gods",
      description: "Beaches, temples, rice terraces and vibrant culture.",
      rating: 4.8,
      reviews: 2340,
      tags: ["Beach", "Culture", "Wellness"],
      startingPrice: 1200,
      currency: "USD",
      isActive: true,
    },
    {
      id: "paris",
      name: "Paris",
      country: "France",
      flag: "🇫🇷",
      image: "",
      tagline: "The City of Light",
      description: "Art, cuisine, fashion and the Eiffel Tower.",
      rating: 4.7,
      reviews: 5120,
      tags: ["City", "Romance", "Culture"],
      startingPrice: 1800,
      currency: "USD",
      isActive: true,
    },
    {
      id: "dubai",
      name: "Dubai",
      country: "UAE",
      flag: "🇦🇪",
      image: "",
      tagline: "Where tradition meets the future",
      description: "Skyscrapers, desert safaris and luxury shopping.",
      rating: 4.6,
      reviews: 3890,
      tags: ["Luxury", "Desert", "Shopping"],
      startingPrice: 1500,
      currency: "USD",
      isActive: true,
    },
    {
      id: "tokyo",
      name: "Tokyo",
      country: "Japan",
      flag: "🇯🇵",
      image: "",
      tagline: "Tradition and innovation",
      description: "Neon streets, temples, sushi and cherry blossoms.",
      rating: 4.9,
      reviews: 4210,
      tags: ["City", "Food", "Culture"],
      startingPrice: 2100,
      currency: "USD",
      isActive: true,
    },
  ];

  /* ---------------- TRAVEL PACKAGES ---------------- */
  const travelPackages = [
    {
      id: "bali-7-luxury",
      destinationId: "bali",
      name: "7-Day Luxury Escape",
      duration: "7 days",
      durationDays: 7,
      price: 3200,
      currency: "USD",
      travelers: 2,
      rating: 4.8,
      description: "Private villa, spa treatments, and guided tours.",
      inclusions: ["Hotel", "Meals", "Transport", "Guide"],
      highlights: ["Ubud", "Uluwatu", "Nusa Penida"],
      isActive: true,
    },
    {
      id: "bali-5-budget",
      destinationId: "bali",
      name: "5-Day Island Hopper",
      duration: "5 days",
      durationDays: 5,
      price: 1500,
      currency: "USD",
      travelers: 2,
      rating: 4.5,
      description: "Explore multiple islands with local guides.",
      inclusions: ["Hotel", "Breakfast", "Boat Transfers"],
      highlights: ["Gili Islands", "Seminyak", "Ubud"],
      isActive: true,
    },
    {
      id: "paris-3-romance",
      destinationId: "paris",
      name: "Romantic Weekend",
      duration: "3 days",
      durationDays: 3,
      price: 1800,
      currency: "USD",
      travelers: 2,
      rating: 4.7,
      description: "Seine dinner cruise, Eiffel Tower access, boutique hotel.",
      inclusions: ["Hotel", "Breakfast", "City Tour"],
      highlights: ["Eiffel Tower", "Louvre", "Seine Cruise"],
      isActive: true,
    },
    {
      id: "paris-5-art",
      destinationId: "paris",
      name: "Art & Culture Trail",
      duration: "5 days",
      durationDays: 5,
      price: 2400,
      currency: "USD",
      travelers: 2,
      rating: 4.6,
      description: "Museums, walking tours, and cooking classes.",
      inclusions: ["Hotel", "Breakfast", "Museum Passes"],
      highlights: ["Louvre", "Orsay", "Montmartre"],
      isActive: true,
    },
    {
      id: "dubai-4-luxury",
      destinationId: "dubai",
      name: "4-Day Luxury Retreat",
      duration: "4 days",
      durationDays: 4,
      price: 2200,
      currency: "USD",
      travelers: 2,
      rating: 4.7,
      description: "5-star hotel, desert safari, Burj Khalifa access.",
      inclusions: ["Hotel", "Meals", "Safari", "Transfers"],
      highlights: ["Burj Khalifa", "Palm Jumeirah", "Desert Safari"],
      isActive: true,
    },
    {
      id: "tokyo-6-cherry",
      destinationId: "tokyo",
      name: "Cherry Blossom Tour",
      duration: "6 days",
      durationDays: 6,
      price: 2800,
      currency: "USD",
      travelers: 2,
      rating: 4.9,
      description: "Sakura season, temples, sushi, and Mt. Fuji day trip.",
      inclusions: ["Hotel", "Breakfast", "JR Pass", "Guide"],
      highlights: ["Shinjuku", "Asakusa", "Mt. Fuji"],
      isActive: true,
    },
  ];

  set(KEYS.TRAVEL_DESTINATIONS, travelDestinations);
  set(KEYS.TRAVEL_PACKAGES, travelPackages);

  set(KEYS.SEEDED, true);
}
