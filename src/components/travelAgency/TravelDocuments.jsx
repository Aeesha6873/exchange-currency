import React, { useState } from "react";
import styles from "./TravelDocuments.module.css";
import {
  FileText,
  Plane,
  Building,
  FileCheck,
  Download,
  Share2,
  Printer,
  Eye,
  Upload,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Car,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";

const TravelDocuments = ({ bookingData, onNewTrip, compact = false }) => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Passport Copy",
      type: "passport",
      status: "verified",
      uploadedDate: "2024-05-15",
      expiryDate: "2029-08-20",
      size: "2.4 MB",
      category: "identification",
    },
    {
      id: 2,
      title: "Japan Visa",
      type: "visa",
      status: "verified",
      uploadedDate: "2024-05-20",
      expiryDate: "2024-12-31",
      size: "1.8 MB",
      category: "visa",
    },
    {
      id: 3,
      title: "Flight Tickets",
      type: "tickets",
      status: "uploaded",
      uploadedDate: "2024-05-25",
      expiryDate: "2024-06-15",
      size: "3.2 MB",
      category: "transportation",
    },
    {
      id: 4,
      title: "Hotel Reservations",
      type: "hotel",
      status: "uploaded",
      uploadedDate: "2024-05-18",
      expiryDate: "2024-06-22",
      size: "1.5 MB",
      category: "accommodation",
    },
    {
      id: 5,
      title: "Travel Insurance",
      type: "insurance",
      status: "pending",
      uploadedDate: "2024-05-28",
      expiryDate: "2024-07-30",
      size: "4.1 MB",
      category: "insurance",
    },
    {
      id: 6,
      title: "COVID-19 Vaccination",
      type: "health",
      status: "verified",
      uploadedDate: "2024-05-10",
      expiryDate: "N/A",
      size: "1.2 MB",
      category: "health",
    },
    {
      id: 7,
      title: "International Driver License",
      type: "license",
      status: "missing",
      uploadedDate: null,
      expiryDate: "2025-01-15",
      size: null,
      category: "other",
    },
    {
      id: 8,
      title: "Credit Card Front/Back",
      type: "payment",
      status: "pending",
      uploadedDate: "2024-05-30",
      expiryDate: "2027-11-30",
      size: "2.8 MB",
      category: "financial",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dragging, setDragging] = useState(false);

  const categories = [
    { id: "all", label: "All Documents", count: documents.length },
    {
      id: "identification",
      label: "Identification",
      count: documents.filter((d) => d.category === "identification").length,
    },
    {
      id: "visa",
      label: "Visa",
      count: documents.filter((d) => d.category === "visa").length,
    },
    {
      id: "transportation",
      label: "Transportation",
      count: documents.filter((d) => d.category === "transportation").length,
    },
    {
      id: "accommodation",
      label: "Accommodation",
      count: documents.filter((d) => d.category === "accommodation").length,
    },
    {
      id: "insurance",
      label: "Insurance",
      count: documents.filter((d) => d.category === "insurance").length,
    },
  ];

  const filteredDocuments =
    selectedCategory === "all"
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory);

  const getDocumentIcon = (type) => {
    switch (type) {
      case "passport":
        return <FileText size={24} />;
      case "visa":
        return <FileText size={24} />;
      case "tickets":
        return <Plane size={24} />;
      case "hotel":
        return <Building size={24} />;
      case "insurance":
        return <FileCheck size={24} />;
      case "health":
        return <FileCheck size={24} />;
      case "license":
        return <Car size={24} />;
      case "payment":
        return <CreditCard size={24} />;
      default:
        return <FileText size={24} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle size={16} />;
      case "uploaded":
        return <FileCheck size={16} />;
      case "pending":
        return <AlertCircle size={16} />;
      case "missing":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "var(--green)";
      case "uploaded":
        return "#3b82f6";
      case "pending":
        return "var(--orange)";
      case "missing":
        return "#ef4444";
      default:
        return "var(--text-secondary)";
    }
  };

  const handleFileUpload = (files) => {
    const newDocuments = Array.from(files).map((file, index) => ({
      id: documents.length + index + 1,
      title: file.name.replace(/\.[^/.]+$/, ""),
      type: "other",
      status: "uploaded",
      uploadedDate: new Date().toISOString().split("T")[0],
      expiryDate: "N/A",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      category: "other",
    }));
    setDocuments([...documents, ...newDocuments]);
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const downloadDocument = (doc) => {
    alert(`Downloading ${doc.title}...`);
  };

  const viewDocument = (doc) => {
    alert(`Viewing ${doc.title}...`);
  };

  const shareDocument = (doc) => {
    alert(`Sharing ${doc.title}...`);
  };

  const downloadAllDocuments = () => {
    alert("Downloading all documents as ZIP file...");
  };

  const shareAllDocuments = () => {
    alert("Share link generated and copied to clipboard!");
  };

  const handleNewTripClick = () => {
    if (onNewTrip) {
      onNewTrip();
    }
  };

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <h4>Travel Documents</h4>
          <span className={styles.compactStats}>
            {documents.filter((d) => d.status === "verified").length}/
            {documents.length} Verified
          </span>
        </div>

        <div className={styles.compactDocuments}>
          {documents.slice(0, 3).map((document) => (
            <div key={document.id} className={styles.compactDocument}>
              <div className={styles.compactDocIcon}>
                {getDocumentIcon(document.type)}
              </div>
              <div className={styles.compactDocInfo}>
                <h6>{document.title}</h6>
                <span
                  className={styles.compactDocStatus}
                  style={{ color: getStatusColor(document.status) }}>
                  {document.status}
                </span>
              </div>
              <button className={styles.compactDocAction}>
                <Eye size={14} />
              </button>
            </div>
          ))}
        </div>

        <button className={styles.compactViewAll}>View All Documents</button>
      </div>
    );
  }

  return (
    <div className={styles.documentsContainer}>
      {/* Navigation Header */}
      <div className={styles.navigationHeader}>
        <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>Step 06/06</span>
          <h3 className={styles.stepTitle}>Travel Documents</h3>
        </div>

        <button onClick={handleNewTripClick} className={styles.newTripButton}>
          <Home size={20} />
          Start New Trip
        </button>
      </div>

      <div className={styles.documentsHeader}>
        {/* <div className={styles.headerInfo}>
          <h2>Travel Documents</h2>
          <p>Manage all your travel documents in one place</p>
        </div> */}
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <FileCheck size={24} />
            </div>
            <div>
              <h3>
                {documents.filter((d) => d.status === "verified").length}/
                {documents.length}
              </h3>
              <p>Verified</p>
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h3>{documents.filter((d) => d.status === "missing").length}</h3>
              <p>Missing</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.uploadSection}>
        <div
          className={`${styles.uploadArea} ${dragging ? styles.dragging : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <Upload size={40} />
          <h3>Drag & Drop Documents Here</h3>
          <p>Or click to browse files</p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className={styles.fileInput}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <p className={styles.fileTypes}>
            Supports PDF, JPG, PNG, DOC (Max 10MB)
          </p>
        </div>
      </div>

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryBtn} ${
              selectedCategory === category.id ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}>
            <span className={styles.categoryLabel}>{category.label}</span>
            <span className={styles.categoryCount}>{category.count}</span>
          </button>
        ))}
      </div>

      <div className={styles.documentsGrid}>
        {filteredDocuments.map((document) => (
          <div key={document.id} className={styles.documentCard}>
            <div className={styles.documentHeader}>
              <div
                className={`${styles.documentIcon} ${styles[document.type]}`}>
                {getDocumentIcon(document.type)}
              </div>
              <div
                className={styles.documentStatus}
                style={{ color: getStatusColor(document.status) }}>
                {getStatusIcon(document.status)}
                <span>
                  {document.status.charAt(0).toUpperCase() +
                    document.status.slice(1)}
                </span>
              </div>
            </div>

            <div className={styles.documentContent}>
              <h4>{document.title}</h4>

              <div className={styles.documentMeta}>
                {document.uploadedDate && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Uploaded:</span>
                    <span className={styles.metaValue}>
                      {document.uploadedDate}
                    </span>
                  </div>
                )}

                {document.expiryDate && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Expires:</span>
                    <span
                      className={`${styles.metaValue} ${
                        document.expiryDate === "N/A"
                          ? styles.na
                          : new Date(document.expiryDate) < new Date()
                          ? styles.expired
                          : ""
                      }`}>
                      {document.expiryDate}
                    </span>
                  </div>
                )}

                {document.size && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Size:</span>
                    <span className={styles.metaValue}>{document.size}</span>
                  </div>
                )}
              </div>

              {document.status === "missing" && (
                <div className={styles.missingAlert}>
                  <AlertCircle size={16} />
                  <span>This document is required for your trip</span>
                </div>
              )}
            </div>

            <div className={styles.documentActions}>
              <button
                onClick={() => viewDocument(document)}
                className={styles.actionBtn}>
                <Eye size={18} />
              </button>
              <button
                onClick={() => downloadDocument(document)}
                className={styles.actionBtn}>
                <Download size={18} />
              </button>
              <button
                onClick={() => shareDocument(document)}
                className={styles.actionBtn}>
                <Share2 size={18} />
              </button>
              <button className={styles.actionBtn}>
                <Printer size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.documentsSummary}>
        <div className={styles.summaryInfo}>
          <h4>Document Checklist</h4>
          <div className={styles.checklist}>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} />
              <span>Passport with 6+ months validity</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} />
              <span>Visa approval (if required)</span>
            </div>
            <div className={styles.checklistItem}>
              <AlertCircle size={20} />
              <span>Travel insurance policy</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} />
              <span>Flight tickets and reservations</span>
            </div>
          </div>
        </div>

        <div className={styles.summaryActions}>
          <button onClick={downloadAllDocuments} className={styles.primaryBtn}>
            <Download size={20} />
            Download All Documents
          </button>
          <button onClick={shareAllDocuments} className={styles.secondaryBtn}>
            <Share2 size={20} />
            Share Document Folder
          </button>
        </div>
      </div>

      {/* Completion Celebration */}
      <div className={styles.completionCelebration}>
        <div className={styles.celebrationContent}>
          <h3>🎉 Trip Planning Complete!</h3>
          <p>
            Your trip to Tokyo, Japan has been successfully planned. All your
            travel documents are organized and ready to go!
          </p>
          <div className={styles.celebrationStats}>
            <div className={styles.celebrationStat}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Planning Complete</span>
            </div>
            <div className={styles.celebrationStat}>
              <span className={styles.statValue}>{documents.length}</span>
              <span className={styles.statLabel}>Documents</span>
            </div>
            <div className={styles.celebrationStat}>
              <span className={styles.statValue}>June 15-25</span>
              <span className={styles.statLabel}>Travel Dates</span>
            </div>
          </div>
          <button
            onClick={handleNewTripClick}
            className={styles.celebrateButton}>
            Plan Another Adventure
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelDocuments;
