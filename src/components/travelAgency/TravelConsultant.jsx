import React, { useState } from "react";
import styles from "./TravelConsultant.module.css";
import {
  MessageSquare,
  Phone,
  Video,
  Send,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

const TravelConsultant = ({
  package: pkg,
  onComplete,
  onBack,
  compact = false,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Aisha, your travel consultant. How can I help you today?",
      sender: "consultant",
      time: "10:00 AM",
    },
    {
      id: 2,
      text: "I'd like to know more about the visa requirements for Japan.",
      sender: "user",
      time: "10:02 AM",
    },
    {
      id: 3,
      text: "Sure! For Japan, you'll need a valid passport with at least 6 months remaining, completed application form, passport photos, and proof of accommodation.",
      sender: "consultant",
      time: "10:05 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate consultant reply
    setTimeout(() => {
      const consultantReply = {
        id: messages.length + 2,
        text: "Thanks for your question! I'll check the specific requirements for your nationality and get back to you with detailed information.",
        sender: "consultant",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, consultantReply]);
      setIsTyping(false);
    }, 2000);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <div className={styles.compactAvatar}>
            <User size={24} />
          </div>
          <div className={styles.compactInfo}>
            <h4>Aisha Abdullahi</h4>
            <p>Senior Travel Consultant</p>
          </div>
          <span className={styles.onlineBadge}>Online</span>
        </div>

        <div className={styles.compactChat}>
          <div className={styles.compactMessages}>
            {messages.slice(-2).map((message) => (
              <div
                key={message.id}
                className={`${styles.compactMessage} ${
                  message.sender === "user" ? styles.userMessage : ""
                }`}>
                <p>
                  {message.text.length > 60
                    ? message.text.substring(0, 60) + "..."
                    : message.text}
                </p>
                <span>{message.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className={styles.compactInput}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
              className={styles.compactField}
            />
            <button type="submit" className={styles.compactSend}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.consultantContainer}>
      {/* Navigation Header */}
      <div className={styles.navigationHeader}>
        {onBack && (
          <button onClick={onBack} className={styles.backButton}>
            <ChevronLeft size={20} />
            Back
          </button>
        )}

        {/* <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>Step 04/06</span>
          <h3 className={styles.stepTitle}>Expert Travel Advice</h3>
        </div> */}

        <button onClick={handleComplete} className={styles.nextButton}>
          Continue to Booking
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.consultantHeader}>
        <div className={styles.consultantInfo}>
          <div className={styles.consultantAvatar}>
            <div className={styles.avatarIcon}>
              <User size={32} />
            </div>
            <span className={styles.onlineIndicator}></span>
          </div>
          <div>
            <h3>Aisha Abdullahi</h3>
            <p className={styles.consultantTitle}>Senior Travel Consultant</p>
            <p className={styles.availability}>
              <span className={styles.statusDot}></span>
              Available now
            </p>
          </div>
        </div>
        <div className={styles.consultantActions}>
          <button className={styles.actionBtn}>
            <Phone size={20} />
          </button>
          <button className={styles.actionBtn}>
            <Video size={20} />
          </button>
        </div>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.chatMessages}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === "user"
                  ? styles.userMessage
                  : styles.consultantMessage
              }`}>
              {message.sender === "consultant" && (
                <div className={styles.messageAvatar}>
                  <User size={20} />
                </div>
              )}
              <div className={styles.messageContent}>
                <p>{message.text}</p>
                <span className={styles.messageTime}>{message.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className={styles.typingIndicator}>
              <div className={styles.messageAvatar}>
                <User size={20} />
              </div>
              <div className={styles.typingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className={styles.messageInput}>
          <button type="button" className={styles.attachBtn}>
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className={styles.inputField}
          />
          <button type="submit" className={styles.sendBtn}>
            <Send size={20} />
          </button>
        </form>
      </div>

      <div className={styles.consultantFeatures}>
        <div className={styles.feature}>
          <MessageSquare size={24} />
          <h4>24/7 Support</h4>
          <p>Round-the-clock assistance</p>
        </div>
        <div className={styles.feature}>
          <Phone size={24} />
          <h4>Phone Support</h4>
          <p>Direct line to experts</p>
        </div>
        <div className={styles.feature}>
          <Video size={24} />
          <h4>Video Consultation</h4>
          <p>Face-to-face guidance</p>
        </div>
      </div>
    </div>
  );
};

export default TravelConsultant;
