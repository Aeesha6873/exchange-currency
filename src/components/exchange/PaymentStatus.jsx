import { useEffect, useState } from "react";
import "./ExchangeComponents.css";

export default function PaymentStatus({ onConfirmed, amount, fromCurrency }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Verifying payment...");
  const [estimatedTime, setEstimatedTime] = useState(45);

  useEffect(() => {
    const messages = [
      "Verifying payment...",
      "Checking transaction details...",
      "Confirming with bank...",
      "Processing exchange...",
      "Finalizing transaction...",
    ];

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 20;

        if (newProgress >= 20) setStatus(messages[1]);
        if (newProgress >= 40) setStatus(messages[2]);
        if (newProgress >= 60) setStatus(messages[3]);
        if (newProgress >= 80) setStatus(messages[4]);

        setEstimatedTime(Math.max(5, 45 - newProgress * 0.45));

        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onConfirmed();
          }, 800);
          return 100;
        }
        return newProgress;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [onConfirmed]);

  return (
    <div className="exchange-component status-wrapper fade-in">
      <div className="status-spinner">
        <div className="status-spinner-inner" />
      </div>

      <p className="status-text">{status}</p>

      <div className="status-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-info">
          <span>{progress}% complete</span>
          <span>~{Math.ceil(estimatedTime)}s remaining</span>
        </div>
      </div>

      <div className="status-details">
        <div className="status-card">
          <span className="detail-label">Amount</span>
          <div className="status-value">
            ${parseFloat(amount).toLocaleString()}
          </div>
        </div>
        <div className="status-card orange">
          <span className="detail-label">Currency</span>
          <div className="status-value">{fromCurrency}</div>
        </div>
      </div>

      <div className="processing-note">
        <div className="note-content">
          <span className="note-icon">⏳</span>
          <div>
            <strong>Processing your transaction</strong>
            <div className="note-subtext">
              This usually takes 1-2 minutes. Your funds are safe and secure.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
