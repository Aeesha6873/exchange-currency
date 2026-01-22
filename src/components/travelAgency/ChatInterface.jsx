import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatInterface.module.css";
import { TravelIcons } from "./TravelIcons";
import {
  Send,
  Bot,
  User,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Sparkles,
  Loader2,
} from "lucide-react";

const ChatInterface = ({ onComplete, compact = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({});
  const messagesEndRef = useRef(null);

  const conversationFlow = [
    {
      question:
        "🌍 Hello! I'm your AI travel assistant. Where would you like to travel?",
      type: "destination",
      quickReplies: [
        "Bali, Indonesia",
        "Tokyo, Japan",
        "Swiss Alps",
        "Greek Islands",
        "Custom destination",
      ],
    },
    {
      question: "📅 When are you planning to travel?",
      type: "dates",
      quickReplies: [
        "This month",
        "Next month",
        "3-6 months",
        "Flexible dates",
        "Not sure yet",
      ],
    },
    {
      question: "👥 How many people will be traveling?",
      type: "groupSize",
      quickReplies: [
        "Solo",
        "Couple (2)",
        "Family (3-4)",
        "Group (5-8)",
        "Large group (9+)",
      ],
    },
    {
      question: "💰 What's your budget range per person?",
      type: "budget",
      quickReplies: [
        "Budget ($500-$1,000)",
        "Moderate ($1,000-$3,000)",
        "Luxury ($3,000+)",
        "Premium ($5,000+)",
      ],
    },
    {
      question: "🎯 What type of travel experience are you looking for?",
      type: "travelType",
      quickReplies: [
        "Adventure",
        "Relaxation",
        "Cultural",
        "Food & Wine",
        "Shopping",
        "Mixed",
      ],
    },
  ];

  // Initialize with welcome message
  useEffect(() => {
    setTimeout(() => {
      addBotMessage(conversationFlow[0].question);
    }, 500);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (text, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage = {
        id: messages.length + 1,
        text,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleQuickReply = (reply) => {
    if (currentStep >= conversationFlow.length) return;

    // Add user message
    addUserMessage(reply);

    // Update preferences
    const currentQuestion = conversationFlow[currentStep];
    setUserPreferences((prev) => ({
      ...prev,
      [currentQuestion.type]: reply,
    }));

    // Move to next step
    if (currentStep < conversationFlow.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => {
        addBotMessage(conversationFlow[currentStep + 1].question);
      }, 1000);
    } else {
      // All questions answered, show summary
      setTimeout(() => {
        showTravelSummary();
      }, 1000);
    }
  };

  const showTravelSummary = () => {
    const summary = `🎉 Perfect! Based on your preferences:

📍 **Destination:** ${userPreferences.destination || "Not specified"}
📅 **Travel Time:** ${userPreferences.dates || "Not specified"}
👥 **Group Size:** ${userPreferences.groupSize || "Not specified"}
💰 **Budget:** ${userPreferences.budget || "Not specified"}
🎯 **Experience:** ${userPreferences.travelType || "Not specified"}

I'm creating your personalized travel plan with:
✅ Detailed itinerary
✅ Best flight options
✅ Accommodation recommendations
✅ Local experiences
✅ Budget breakdown

Would you like to proceed with this plan?`;

    addBotMessage(summary);

    // Add action buttons
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "",
          sender: "bot-actions",
          actions: [
            "Proceed with Plan",
            "Modify Preferences",
            "Talk to Human Agent",
          ],
        },
      ]);
    }, 500);
  };

  const handleCustomMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);
    setInputMessage("");

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      addBotMessage(
        "Thanks for sharing! Let me think about the best options for you..."
      );
    }, 1000);
  };

  const handleAction = (action) => {
    switch (action) {
      case "Proceed with Plan":
        if (onComplete) {
          onComplete(userPreferences);
        }
        break;
      case "Modify Preferences":
        setCurrentStep(0);
        setUserPreferences({});
        setMessages([]);
        setTimeout(() => {
          addBotMessage(conversationFlow[0].question);
        }, 500);
        break;
      case "Talk to Human Agent":
        addBotMessage(
          "Perfect! I'll connect you with one of our expert travel consultants right away."
        );
        break;
    }
  };

  const renderMessage = (message) => {
    if (message.sender === "bot-actions") {
      return (
        <div className={styles.actionButtons}>
          {message.actions.map((action, index) => (
            <button
              key={index}
              className={styles.actionButton}
              onClick={() => handleAction(action)}>
              {action}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div
        className={`${styles.message} ${
          message.sender === "user" ? styles.userMessage : styles.botMessage
        }`}>
        <div className={styles.messageAvatar}>
          {message.sender === "user" ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className={styles.messageContent}>
          <p>{message.text}</p>
          <span className={styles.timestamp}>
            <Clock size={10} />
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  };

  const renderQuickReplies = () => {
    if (currentStep >= conversationFlow.length || isTyping) return null;

    const currentQuestion = conversationFlow[currentStep];

    return (
      <div className={styles.quickReplies}>
        {currentQuestion.quickReplies.map((reply, index) => (
          <button
            key={index}
            className={styles.quickReply}
            onClick={() => handleQuickReply(reply)}>
            {reply}
          </button>
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <Bot size={20} />
          <h4>AI Travel Assistant</h4>
          <span className={styles.onlineIndicator}></span>
        </div>

        <div className={styles.compactMessages}>
          {messages.slice(-3).map((message) => (
            <div key={message.id} className={styles.compactMessage}>
              <p>
                {message.text.length > 60
                  ? message.text.substring(0, 60) + "..."
                  : message.text}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleCustomMessage} className={styles.compactInput}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.compactInputField}
          />
          <button type="submit" className={styles.compactSend}>
            <Send size={16} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.chatInterface}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.botAvatar}>
            <Bot size={24} />
            <span className={styles.onlineStatus}></span>
          </div>
          <div>
            <h3>AI Travel Assistant</h3>
            <p>Planning your perfect trip step by step</p>
          </div>
        </div>

        <div className={styles.progressIndicator}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${
                  ((currentStep + 1) / (conversationFlow.length + 1)) * 100
                }%`,
              }}></div>
          </div>
          <span>
            Step {currentStep + 1} of {conversationFlow.length}
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={styles.messagesContainer}>
        {messages.map((message) => renderMessage(message))}

        {isTyping && (
          <div className={styles.typingIndicator}>
            <div className={styles.messageAvatar}>
              <Bot size={16} />
            </div>
            <div className={styles.typingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {renderQuickReplies()}

      {/* Custom Input */}
      <form onSubmit={handleCustomMessage} className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message or select an option above..."
            className={styles.messageInput}
            disabled={isTyping}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isTyping || !inputMessage.trim()}>
            {isTyping ? (
              <Loader2 size={18} className={styles.spinner} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className={styles.inputHint}>
          <Sparkles size={12} />
          The AI assistant can help you plan flights, hotels, activities, and
          more!
        </p>
      </form>

      {/* Travel Preferences Summary */}
      {Object.keys(userPreferences).length > 0 && (
        <div className={styles.preferencesSummary}>
          <h4>Your Travel Preferences</h4>
          <div className={styles.preferencesGrid}>
            {userPreferences.destination && (
              <div className={styles.preferenceItem}>
                <MapPin size={14} />
                <span>{userPreferences.destination}</span>
              </div>
            )}
            {userPreferences.dates && (
              <div className={styles.preferenceItem}>
                <Calendar size={14} />
                <span>{userPreferences.dates}</span>
              </div>
            )}
            {userPreferences.groupSize && (
              <div className={styles.preferenceItem}>
                <Users size={14} />
                <span>{userPreferences.groupSize}</span>
              </div>
            )}
            {userPreferences.budget && (
              <div className={styles.preferenceItem}>
                <DollarSign size={14} />
                <span>{userPreferences.budget}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
