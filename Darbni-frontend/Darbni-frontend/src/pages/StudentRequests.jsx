import { useState } from "react";
import { FaCheck, FaTimes, FaChevronRight, FaClock, FaCheckCircle } from "react-icons/fa";

const MOCK_REQUESTS = [
  {
    id: 1,
    name: "Ahmad Nasser",
    initials: "AN",
    color: "#6c47ff",
    university: "PTUK",
    position: "Frontend Development Intern",
    date: "Mar 5, 2026",
    status: "pending",
  },
  {
    id: 2,
    name: "Lina Qasim",
    initials: "LQ",
    color: "#4a3fa0",
    university: "An-Najah",
    position: "Network Security Intern",
    date: "Mar 4, 2026",
    status: "pending",
  },
  {
    id: 3,
    name: "Sara Tomeh",
    initials: "ST",
    color: "#27ae60",
    university: "Birzeit",
    position: "Data Science Intern",
    date: "Feb 28, 2026",
    status: "approved",
    resolvedDate: "Mar 2, 2026",
  },
  {
    id: 4,
    name: "Khaled Hasan",
    initials: "KH",
    color: "#e74c3c",
    university: "PPU",
    position: "Cybersecurity Intern",
    date: "Feb 25, 2026",
    status: "rejected",
    resolvedDate: "Mar 1, 2026",
  },
];

export default function StudentRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [activeTab, setActiveTab] = useState("pending");
  const [expandedId, setExpandedId] = useState(null);

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  const displayList = activeTab === "pending" ? pending : resolved;

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "approved", resolvedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
          : r
      )
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "rejected", resolvedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
          : r
      )
    );
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="sr-page">
      {/* Header */}
      <div className="sr-header">
        <h1 className="sr-title">Student Approval Requests</h1>
        <p className="sr-sub">Students seeking company approval before applying to the university.</p>
      </div>

      {/* Tab Switcher */}
      <div className="sr-tabs">
        <button
          className={`sr-tab${activeTab === "pending" ? " sr-tab-active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <FaClock size={12} />
          Pending ({pending.length})
        </button>
        <button
          className={`sr-tab${activeTab === "resolved" ? " sr-tab-active" : ""}`}
          onClick={() => setActiveTab("resolved")}
        >
          <FaCheckCircle size={12} />
          Resolved ({resolved.length})
        </button>
      </div>

      {/* Request List */}
      <div className="sr-list">
        {displayList.length === 0 && (
          <div className="sr-empty">
            {activeTab === "pending"
              ? "No pending requests at the moment."
              : "No resolved requests yet."}
          </div>
        )}

        {displayList.map((req) => (
          <div key={req.id} className="sr-item">
            <div className="sr-item-main" onClick={() => toggleExpand(req.id)}>
              {/* Avatar */}
              <div className="sr-avatar" style={{ background: req.color }}>
                {req.initials}
              </div>

              {/* Info */}
              <div className="sr-info">
                <div className="sr-name">{req.name}</div>
                <div className="sr-meta">
                  {req.university} · {req.position} · {req.date}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="sr-actions">
                {req.status === "pending" && (
                  <>
                    <span className="sr-status-badge sr-status-pending">Pending</span>
                    <button
                      className="sr-btn-approve"
                      onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}
                    >
                      <FaCheck size={11} /> Approve
                    </button>
                    <button
                      className="sr-btn-reject"
                      onClick={(e) => { e.stopPropagation(); handleReject(req.id); }}
                    >
                      <FaTimes size={11} /> Reject
                    </button>
                  </>
                )}
                {req.status === "approved" && (
                  <span className="sr-status-badge sr-status-approved">Approved</span>
                )}
                {req.status === "rejected" && (
                  <span className="sr-status-badge sr-status-rejected">Rejected</span>
                )}
                <FaChevronRight
                  className={`sr-chevron${expandedId === req.id ? " sr-chevron-open" : ""}`}
                />
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === req.id && (
              <div className="sr-detail">
                <div className="sr-detail-grid">
                  <div className="sr-detail-item">
                    <span className="sr-detail-label">Student Name</span>
                    <span className="sr-detail-val">{req.name}</span>
                  </div>
                  <div className="sr-detail-item">
                    <span className="sr-detail-label">University</span>
                    <span className="sr-detail-val">{req.university}</span>
                  </div>
                  <div className="sr-detail-item">
                    <span className="sr-detail-label">Position Applied</span>
                    <span className="sr-detail-val">{req.position}</span>
                  </div>
                  <div className="sr-detail-item">
                    <span className="sr-detail-label">Request Date</span>
                    <span className="sr-detail-val">{req.date}</span>
                  </div>
                  <div className="sr-detail-item">
                    <span className="sr-detail-label">Status</span>
                    <span className="sr-detail-val" style={{
                      color: req.status === "approved" ? "#27ae60" : req.status === "rejected" ? "#e74c3c" : "#b8860b",
                      fontWeight: 700,
                      textTransform: "capitalize"
                    }}>{req.status}</span>
                  </div>
                  {req.resolvedDate && (
                    <div className="sr-detail-item">
                      <span className="sr-detail-label">Resolved Date</span>
                      <span className="sr-detail-val">{req.resolvedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
