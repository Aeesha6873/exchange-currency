import React, { useState } from "react";
import styles from "./TravelItinerary.module.css";
import {
  Calendar,
  MapPin,
  Clock,
  Plane,
  Building,
  Utensils,
  Camera,
  ShoppingBag,
  ChevronRight,
  Download,
  Share2,
  Printer,
  Train,
} from "lucide-react";

const TravelItinerary = () => {
  const [activeDay, setActiveDay] = useState(1);

  const itineraryDays = [
    {
      day: 1,
      date: "2024-06-15",
      location: "Tokyo, Japan",
      activities: [
        {
          id: 8,
          time: "07:00 AM",
          title: "Bullet Train to Kyoto",
          description: "Shinkansen Nozomi 101",
          icon: <Train size={20} />,
          type: "transport",
          duration: "2.5 hours",
          notes: "Seat: 12A, Window",
        },
        ,
        {
          id: 2,
          time: "10:00 AM",
          title: "Hotel Check-in",
          description: "The Ritz-Carlton Tokyo",
          icon: <Hotel size={20} />,
          type: "accommodation",
          duration: "2 hours",
          notes: "Early check-in requested",
        },
        {
          id: 3,
          time: "01:00 PM",
          title: "Lunch at Tsukiji Market",
          description: "Fresh sushi and local delicacies",
          icon: <Utensils size={20} />,
          type: "dining",
          duration: "2 hours",
          notes: "Reservation confirmed",
        },
        {
          id: 4,
          time: "03:00 PM",
          title: "Senso-ji Temple Visit",
          description: "Tokyo's oldest temple in Asakusa",
          icon: <Camera size={20} />,
          type: "sightseeing",
          duration: "3 hours",
          notes: "Guided tour included",
        },
      ],
    },
    {
      day: 2,
      date: "2024-06-16",
      location: "Tokyo, Japan",
      activities: [
        {
          id: 5,
          time: "09:00 AM",
          title: "Shinjuku Gyoen Garden",
          description: "Morning walk in traditional gardens",
          icon: <Camera size={20} />,
          type: "sightseeing",
          duration: "2 hours",
          notes: "Photography allowed",
        },
        {
          id: 6,
          time: "12:00 PM",
          title: "Harajuku Shopping",
          description: "Explore Takeshita Street",
          icon: <ShoppingBag size={20} />,
          type: "shopping",
          duration: "3 hours",
          notes: "Budget: ¥20,000",
        },
        {
          id: 7,
          time: "07:00 PM",
          title: "Traditional Kaiseki Dinner",
          description: "Michelin-starred restaurant",
          icon: <Utensils size={20} />,
          type: "dining",
          duration: "3 hours",
          notes: "Dress code: Smart casual",
        },
      ],
    },
    {
      day: 3,
      date: "2024-06-17",
      location: "Kyoto, Japan",
      activities: [
        {
          id: 8,
          time: "07:00 AM",
          title: "Bullet Train to Kyoto",
          description: "Shinkansen Nozomi 101",
          icon: <Plane size={20} />,
          type: "transport",
          duration: "2.5 hours",
          notes: "Seat: 12A, Window",
        },
        {
          id: 9,
          time: "10:00 AM",
          title: "Fushimi Inari Shrine",
          description: "Famous torii gate pathway",
          icon: <Camera size={20} />,
          type: "sightseeing",
          duration: "4 hours",
          notes: "Early morning recommended",
        },
        {
          id: 10,
          time: "02:00 PM",
          title: "Kinkaku-ji Temple",
          description: "The Golden Pavilion",
          icon: <Camera size={20} />,
          type: "sightseeing",
          duration: "2 hours",
          notes: "Entry included",
        },
      ],
    },
  ];

  const currentDay =
    itineraryDays.find((day) => day.day === activeDay) || itineraryDays[0];

  const exportItinerary = () => {
    alert("Itinerary exported as PDF!");
  };

  const shareItinerary = () => {
    alert("Share link copied to clipboard!");
  };

  const printItinerary = () => {
    alert("Opening print dialog...");
  };

  return (
    <div className={styles.itineraryContainer}>
      <div className={styles.itineraryHeader}>
        <div className={styles.headerInfo}>
          <h2>Japan Adventure Itinerary</h2>
          <div className={styles.headerMeta}>
            <span className={styles.metaItem}>
              <Calendar size={18} />
              June 15-22, 2024
            </span>
            <span className={styles.metaItem}>
              <MapPin size={18} />
              Tokyo → Kyoto → Osaka
            </span>
            <span className={styles.metaItem}>
              <Clock size={18} />8 Days, 7 Nights
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button onClick={exportItinerary} className={styles.actionBtn}>
            <Download size={20} />
            Export
          </button>
          <button onClick={shareItinerary} className={styles.actionBtn}>
            <Share2 size={20} />
            Share
          </button>
          <button onClick={printItinerary} className={styles.actionBtn}>
            <Printer size={20} />
            Print
          </button>
        </div>
      </div>

      <div className={styles.itineraryContent}>
        <div className={styles.daysNavigation}>
          {itineraryDays.map((day) => (
            <button
              key={day.day}
              className={`${styles.dayTab} ${
                activeDay === day.day ? styles.active : ""
              }`}
              onClick={() => setActiveDay(day.day)}>
              <span className={styles.dayNumber}>Day {day.day}</span>
              <span className={styles.dayDate}>{day.date}</span>
            </button>
          ))}
        </div>

        <div className={styles.dayOverview}>
          <div className={styles.dayHeader}>
            <h3>
              Day {currentDay.day}: {currentDay.location}
              <span className={styles.dayDate}>{currentDay.date}</span>
            </h3>
            <div className={styles.dayStats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Activities:</span>
                <span className={styles.statValue}>
                  {currentDay.activities.length}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Duration:</span>
                <span className={styles.statValue}>12 hours</span>
              </div>
            </div>
          </div>

          <div className={styles.timeline}>
            {currentDay.activities.map((activity, index) => (
              <div key={activity.id} className={styles.timelineItem}>
                <div className={styles.timelineConnector}>
                  <div className={styles.timelineDot}></div>
                  {index < currentDay.activities.length - 1 && (
                    <div className={styles.timelineLine}></div>
                  )}
                </div>
                <div className={styles.activityCard}>
                  <div
                    className={`${styles.activityIcon} ${
                      styles[activity.type]
                    }`}>
                    {activity.icon}
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityTime}>
                        {activity.time}
                      </span>
                      <h4>{activity.title}</h4>
                      <span className={styles.activityDuration}>
                        <Clock size={14} />
                        {activity.duration}
                      </span>
                    </div>
                    <p className={styles.activityDescription}>
                      {activity.description}
                    </p>
                    {activity.notes && (
                      <div className={styles.activityNotes}>
                        <strong>Notes:</strong> {activity.notes}
                      </div>
                    )}
                    <div className={styles.activityActions}>
                      <button className={styles.detailsBtn}>
                        View Details
                        <ChevronRight size={16} />
                      </button>
                      <button className={styles.mapBtn}>
                        <MapPin size={16} />
                        Show on Map
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tripSummary}>
          <div className={styles.summaryCard}>
            <h4>Trip Summary</h4>
            <div className={styles.summaryStats}>
              <div className={styles.summaryStat}>
                <span className={styles.statNumber}>8</span>
                <span className={styles.statLabel}>Days</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.statNumber}>3</span>
                <span className={styles.statLabel}>Cities</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.statNumber}>14</span>
                <span className={styles.statLabel}>Activities</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.statNumber}>7</span>
                <span className={styles.statLabel}>Hotels</span>
              </div>
            </div>
          </div>

          <div className={styles.weatherCard}>
            <h4>Weather Forecast</h4>
            <div className={styles.weatherInfo}>
              <div className={styles.weatherIcon}>☀️</div>
              <div className={styles.weatherDetails}>
                <span className={styles.weatherTemp}>24°C</span>
                <span className={styles.weatherCondition}>Mostly Sunny</span>
              </div>
            </div>
            <p className={styles.weatherNote}>
              Perfect weather for sightseeing!
            </p>
          </div>

          <div className={styles.budgetCard}>
            <h4>Daily Budget</h4>
            <div className={styles.budgetMeter}>
              <div
                className={styles.budgetProgress}
                style={{ width: "65%" }}></div>
            </div>
            <div className={styles.budgetInfo}>
              <span>¥8,450 / ¥13,000</span>
              <span>65% spent</span>
            </div>
          </div>
        </div>

        <div className={styles.mapPreview}>
          <h4>Day {activeDay} Route Map</h4>
          <div className={styles.mapContainer}>
            <div className={styles.mapPlaceholder}>
              <MapPin size={48} />
              <p>Interactive map showing today's route</p>
              <button className={styles.viewMapBtn}>View Full Map</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelItinerary;
