export const CABIN_CLASSES = [
  { value: "economy", label: "Economy", icon: "🛋️" },
  { value: "premium", label: "Premium Economy", icon: "✨" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "first", label: "First Class", icon: "⭐" },
];

export const PASSENGER_TYPES = [
  { type: "adults", label: "Adults", description: "12+ years", min: 1 },
  { type: "children", label: "Children", description: "2-11 years", min: 0 },
  { type: "infants", label: "Infants", description: "Under 2", min: 0 },
];

export const SORT_OPTIONS = [
  { value: "price", label: "Lowest Price" },
  { value: "duration", label: "Shortest Duration" },
  { value: "departure", label: "Earliest Departure" },
  { value: "arrival", label: "Earliest Arrival" },
];

export const FILTER_OPTIONS = {
  stops: [
    { value: "all", label: "All Stops" },
    { value: "nonstop", label: "Non-stop" },
    { value: "1stop", label: "1 Stop Max" },
  ],
  priceRange: { min: 0, max: 3000, step: 100 },
};
