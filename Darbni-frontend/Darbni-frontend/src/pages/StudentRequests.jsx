import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaChevronRight, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { applicationApi } from "../api/client";

const getColorForName = (name) => {
  const colors = ["#6c47ff", "#4a3fa0", "#27ae60", "#e74c3c", "#f39c12", "#1abc9c", "#3498db", "#9b59b6"];
  const index = name.length ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

const mapApplication = (app, statusType) => {
  const student  = app.studentId  || {};
  const training = app.trainingId || {};
  const firstName = student.firstName || "";
  const lastName  = student.lastName  || "";
  const fullName  = `${firstName} ${lastName}`.trim() || "Unknown Student";

  let displayStatus = "pending";
  if (statusType === "resolved") {
    if (app.status === "company_approved")  displayStatus = "approved";
    else if (app.status === "company_rejected") displayStatus = "rejected";
  }

  return {
    id:              app._id,
    name:            fullName,
    initials:        firstName ? `${firstName[0]}${lastName?.[0] || ""}` : "??",
    color:           getColorForName(firstName || fullName),
    university:      student.university_name || student.universityId?.name || "Unknown",
    position:        training.title || "Unknown Position",
    date:            app.createdAt
      ? new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    status:          displayStatus,
    resolvedDate:    app.companyApprovedAt
      ? new Date(app.companyApprovedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : null,
    rejectionReason: app.companyRejectionReason || null,
    coverLetter:     app.coverLetter || null,
    major:           student.major || "N/A",
  };
};

// ✅ Modal بسيط للـ rejection reason
function RejectModal({ onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  return (
    <div className="reject-overlay" onClick={onCancel}>
      <div className="reject-modal" onClick={e => e.stopPropagation()}>
        <h3 className="reject-modal-title">Reject Application</h3>
        <p className="reject-modal-message">Please provide a reason for rejection:</p>
        <textarea
          className="reject-textarea"
          rows={3}
          placeholder="e.g. Position filled or requirements not met"
          value={reason}
          onChange={e => setReason(e.target.value)}
          autoFocus
        />
        <div className="reject-modal-actions">
          <button className="reject-btn-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="reject-btn-confirm"
            onClick={() => onConfirm(reason || "Rejected by company")}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentRequests() {
  const [pending, setPending]       = useState([]);
  const [resolved, setResolved]     = useState([]);
  const [activeTab, setActiveTab]   = useState("pending");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [processingId, setProcessingId] = useState(null);
  // ✅ state للـ reject modal
  const [rejectTarget, setRejectTarget] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await applicationApi.company();
      setPending((response.pending   || []).map(app => mapApplication(app, "pending")));
      setResolved((response.resolved || []).map(app => mapApplication(app, "resolved")));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await applicationApi.companyResponse(id, "approve");
      await loadApplications();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async (reason) => {
    const id = rejectTarget;
    setRejectTarget(null);
    setProcessingId(id);
    try {
      await applicationApi.companyResponse(id, "reject", reason);
      await loadApplications();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const displayList  = activeTab === "pending" ? pending : resolved;
  const pendingCount = pending.length;
  const resolvedCount = resolved.length;

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1 className="sr-title">Student Approval Requests</h1>
        <p className="sr-sub">Students seeking company approval before applying to the university.</p>
      </div>

      {error && (
        <div className="sr-error">
          <span>{error}</span>
          <button onClick={loadApplications} className="sr-retry-btn">Retry</button>
        </div>
      )}

      <div className="sr-tabs">
        <button
          className={`sr-tab${activeTab === "pending" ? " sr-tab-active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <FaClock size={12} /> Pending ({pendingCount})
        </button>
        <button
          className={`sr-tab${activeTab === "resolved" ? " sr-tab-active" : ""}`}
          onClick={() => setActiveTab("resolved")}
        >
          <FaCheckCircle size={12} /> Resolved ({resolvedCount})
        </button>
      </div>

      {loading && (
        <div className="sr-loading">
          <FaSpinner className="spinner" />
          <p>Loading requests...</p>
        </div>
      )}

      {!loading && (
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
                <div className="sr-avatar" style={{ background: req.color }}>
                  {req.initials}
                </div>
                <div className="sr-info">
                  <div className="sr-name">{req.name}</div>
                  <div className="sr-meta">
                    {req.university} · {req.position} · {req.date}
                  </div>
                </div>
                <div className="sr-actions">
                  {req.status === "pending" && (
                    <>
                      <span className="sr-status-badge sr-status-pending">Pending</span>
                      <button
                        className="sr-btn-approve"
                        disabled={processingId === req.id}
                        onClick={e => { e.stopPropagation(); handleApprove(req.id); }}
                      >
                        {processingId === req.id
                          ? <FaSpinner className="spinner" />
                          : <><FaCheck size={11} /> Approve</>}
                      </button>
                      <button
                        className="sr-btn-reject"
                        disabled={processingId === req.id}
                        onClick={e => { e.stopPropagation(); setRejectTarget(req.id); }}
                      >
                        {processingId === req.id
                          ? <FaSpinner className="spinner" />
                          : <><FaTimes size={11} /> Reject</>}
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
                      <span className="sr-detail-label">Major</span>
                      <span className="sr-detail-val">{req.major}</span>
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
                    {req.rejectionReason && req.status === "rejected" && (
                      <div className="sr-detail-item sr-detail-full">
                        <span className="sr-detail-label">Rejection Reason</span>
                        <span className="sr-detail-val" style={{ color: "#e74c3c" }}>{req.rejectionReason}</span>
                      </div>
                    )}
                    {req.coverLetter && (
                      <div className="sr-detail-item sr-detail-full">
                        <span className="sr-detail-label">Cover Letter</span>
                        <span className="sr-detail-val">{req.coverLetter}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Reject Modal */}
      {rejectTarget && (
        <RejectModal
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}