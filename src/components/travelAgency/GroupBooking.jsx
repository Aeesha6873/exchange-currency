import React, { useState } from "react";
import styles from "./GroupBooking.module.css";
import {
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Share2,
  Download,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

const GroupBooking = ({
  package: pkg,
  onComplete,
  onBack,
  compact = false,
}) => {
  const [groupSize, setGroupSize] = useState(10);
  const [groupMembers, setGroupMembers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      status: "confirmed",
      role: "Leader",
    },
    {
      id: 2,
      name: "Aisha Abdullahi",
      email: "aisha@example.com",
      status: "confirmed",
      role: "Member",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      status: "pending",
      role: "Member",
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma@example.com",
      status: "confirmed",
      role: "Member",
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "robert@example.com",
      status: "pending",
      role: "Member",
    },
  ]);
  const [discount, setDiscount] = useState(15);

  const addMember = () => {
    const newMember = {
      id: groupMembers.length + 1,
      name: `Member ${groupMembers.length + 1}`,
      email: `member${groupMembers.length + 1}@example.com`,
      status: "pending",
      role: "Member",
    };
    setGroupMembers([...groupMembers, newMember]);
    setGroupSize(groupSize + 1);
    if (groupSize + 1 >= 15) setDiscount(20);
    else if (groupSize + 1 >= 10) setDiscount(15);
    else if (groupSize + 1 >= 5) setDiscount(10);
  };

  const removeMember = (id) => {
    if (groupMembers.length > 1) {
      const updatedMembers = groupMembers.filter((member) => member.id !== id);
      setGroupMembers(updatedMembers);
      setGroupSize(updatedMembers.length);
      if (updatedMembers.length >= 15) setDiscount(20);
      else if (updatedMembers.length >= 10) setDiscount(15);
      else if (updatedMembers.length >= 5) setDiscount(10);
      else setDiscount(0);
    }
  };

  const toggleStatus = (id) => {
    setGroupMembers((members) =>
      members.map((member) =>
        member.id === id
          ? {
              ...member,
              status: member.status === "confirmed" ? "pending" : "confirmed",
            }
          : member
      )
    );
  };

  const sendInvites = () => {
    alert("Invitation emails sent to all pending members!");
    setGroupMembers((members) =>
      members.map((member) => ({
        ...member,
        status: "invited",
      }))
    );
  };

  const exportList = () => {
    alert("Group member list exported!");
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete({ groupSize, members: groupMembers, discount });
    }
  };

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <div className={styles.compactStats}>
            <div className={styles.compactStat}>
              <Users size={20} />
              <span>{groupSize} Members</span>
            </div>
            <div className={styles.compactStat}>
              <CheckCircle size={20} />
              <span>
                {groupMembers.filter((m) => m.status === "confirmed").length}{" "}
                Confirmed
              </span>
            </div>
          </div>
          <button className={styles.compactAddBtn} onClick={addMember}>
            <UserPlus size={16} />
            Add
          </button>
        </div>

        <div className={styles.compactMembers}>
          {groupMembers.slice(0, 3).map((member) => (
            <div key={member.id} className={styles.compactMember}>
              <div className={styles.compactAvatar}>
                {member.name.charAt(0)}
                {member.role === "Leader" && (
                  <span className={styles.leaderDot}>👑</span>
                )}
              </div>
              <div className={styles.compactMemberInfo}>
                <h5>{member.name}</h5>
                <span
                  className={`${styles.compactStatus} ${
                    styles[member.status]
                  }`}>
                  {member.status}
                </span>
              </div>
              <button
                onClick={() => toggleStatus(member.id)}
                className={`${styles.compactToggle} ${
                  member.status === "confirmed" ? styles.confirmed : ""
                }`}>
                <CheckCircle size={14} />
              </button>
            </div>
          ))}
        </div>

        <button className={styles.compactViewAll}>View All Members</button>
      </div>
    );
  }

  return (
    <div className={styles.groupBookingContainer}>
      {/* Navigation Header */}
      <div className={styles.navigationHeader}>
        {onBack && (
          <button onClick={onBack} className={styles.backButton}>
            <ChevronLeft size={20} />
            Back
          </button>
        )}

        {/* <div className={styles.stepInfo}>
          <span className={styles.stepNumber}>Step 05/06</span>
          <h3 className={styles.stepTitle}>Group Booking</h3>
        </div> */}

        <button onClick={handleComplete} className={styles.nextButton}>
          Continue to Documents
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.groupHeader}>
        {/* <div className={styles.headerInfo}>
          <h2>Group Booking Management</h2>
          <p>Manage your travel group members and discounts</p>
        </div> */}
        <div className={styles.groupStats}>
          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div>
              <h3>{groupSize}</h3>
              <p>Group Size</p>
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>
              <CheckCircle size={24} />
            </div>
            <div>
              <h3>
                {groupMembers.filter((m) => m.status === "confirmed").length}/
                {groupSize}
              </h3>
              <p>Confirmed</p>
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.discountBadge}>{discount}%</div>
            <div>
              <h3>Discount</h3>
              <p>Group Savings</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.groupControls}>
        <div className={styles.sizeControls}>
          <button onClick={addMember} className={styles.controlBtn}>
            <UserPlus size={20} />
            Add Member
          </button>
          <button
            onClick={() =>
              groupMembers.length > 1 &&
              removeMember(groupMembers[groupMembers.length - 1].id)
            }
            className={`${styles.controlBtn} ${styles.removeBtn}`}
            disabled={groupMembers.length <= 1}>
            <UserMinus size={20} />
            Remove Last
          </button>
        </div>
        <div className={styles.actionControls}>
          <button onClick={sendInvites} className={styles.actionBtn}>
            <Mail size={20} />
            Send Invites
          </button>
          <button className={styles.actionBtn}>
            <Share2 size={20} />
            Share Link
          </button>
          <button onClick={exportList} className={styles.actionBtn}>
            <Download size={20} />
            Export List
          </button>
        </div>
      </div>

      <div className={styles.discountTiers}>
        <h3>Group Discount Tiers</h3>
        <div className={styles.tiers}>
          <div
            className={`${styles.tier} ${groupSize >= 5 ? styles.active : ""}`}>
            <span className={styles.tierLabel}>5+ Members</span>
            <span className={styles.tierDiscount}>10% OFF</span>
          </div>
          <div
            className={`${styles.tier} ${
              groupSize >= 10 ? styles.active : ""
            }`}>
            <span className={styles.tierLabel}>10+ Members</span>
            <span className={styles.tierDiscount}>15% OFF</span>
          </div>
          <div
            className={`${styles.tier} ${
              groupSize >= 15 ? styles.active : ""
            }`}>
            <span className={styles.tierLabel}>15+ Members</span>
            <span className={styles.tierDiscount}>20% OFF</span>
          </div>
          <div
            className={`${styles.tier} ${
              groupSize >= 20 ? styles.active : ""
            }`}>
            <span className={styles.tierLabel}>20+ Members</span>
            <span className={styles.tierDiscount}>25% OFF</span>
          </div>
        </div>
      </div>

      <div className={styles.membersList}>
        <h3>Group Members ({groupSize})</h3>
        <div className={styles.membersGrid}>
          {groupMembers.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberAvatar}>
                {member.name.charAt(0)}
                {member.role === "Leader" && (
                  <span className={styles.leaderBadge}>👑</span>
                )}
              </div>
              <div className={styles.memberInfo}>
                <h4>{member.name}</h4>
                <p className={styles.memberEmail}>{member.email}</p>
                <div className={styles.memberMeta}>
                  <span className={styles.memberRole}>{member.role}</span>
                  <span
                    className={`${styles.memberStatus} ${
                      styles[member.status]
                    }`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <div className={styles.memberActions}>
                <button
                  onClick={() => toggleStatus(member.id)}
                  className={`${styles.statusBtn} ${
                    member.status === "confirmed" ? styles.confirmed : ""
                  }`}>
                  <CheckCircle size={16} />
                  {member.status === "confirmed" ? "Confirmed" : "Confirm"}
                </button>
                <button
                  onClick={() => removeMember(member.id)}
                  className={styles.removeMemberBtn}
                  disabled={member.role === "Leader"}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.groupSummary}>
        <div className={styles.summaryInfo}>
          <h4>Group Summary</h4>
          <p>
            Total members: {groupSize} | Confirmed:{" "}
            {groupMembers.filter((m) => m.status === "confirmed").length} |
            Pending: {groupMembers.filter((m) => m.status === "pending").length}
          </p>
        </div>
        <div className={styles.summaryActions}>
          <button className={styles.primaryBtn} onClick={handleComplete}>
            Finalize Group Booking
          </button>
          <button className={styles.secondaryBtn}>Request Custom Quote</button>
        </div>
      </div>
    </div>
  );
};

export default GroupBooking;
