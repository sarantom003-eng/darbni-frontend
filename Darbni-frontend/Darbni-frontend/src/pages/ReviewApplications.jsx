import { useState, useEffect } from "react";
import {
  FaClock, FaEye, FaCheck, FaTimes, FaGraduationCap,
  FaPaperPlane, FaExclamationTriangle, FaBuilding,
  FaSpinner, FaBan
} from "react-icons/fa";
import { applicationApi } from "../api/client";

function RejectModal({ isOpen, onClose, onConfirm, isProcessing }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="ra-overlay" onClick={onClose}>
      <div className="ra-modal ra-modal-sm" onClick={e => e.stopPropagation()}>
        <button className="ra-modal-close" onClick={onClose} disabled={isProcessing}>
          <FaTimes />
        </button>
        <div className="ra-modal-icon ra-modal-icon-danger">
          <FaBan />
        </div>
        <h3 className="ra-modal-title">Reject Application</h3>
        <p className="ra-modal-subtitle">Please provide a reason for rejecting this application</p>
        <div className="ra-form-group">
          <label>Rejection Reason</label>
          <textarea
            className="ra-textarea"
            rows="3"
            placeholder="e.g., Missing documents, Credit hours not met, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isProcessing}
          />
        </div>
        <div className="ra-modal-footer">
          <button className="ra-btn-close" onClick={onClose} disabled={isProcessing}>
            Cancel
          </button>
          <button className="ra-btn-reject" onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? <FaSpinner className="spinner" /> : <FaTimes />}
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationModal({ app, onClose }) {
  if (!app) return null;

  const firstName = app.studentId?.firstName || "";
  const lastName = app.studentId?.lastName || "";
  const studentFullName = `${firstName} ${lastName}`.trim();
  const initials = studentFullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const getTimeRemaining = (deadline) => {
    if (!deadline) return "No deadline set";
    const remaining = new Date(deadline) - new Date();
    if (remaining <= 0) return "Expired";
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % 86400000) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const timeRemaining = getTimeRemaining(app.studentDeadline);
  const isUrgent = app.studentDeadline && (new Date(app.studentDeadline) - new Date()) < 86400000;

  return (
    <div className="ra-overlay" onClick={onClose}>
      <div className="ra-modal" onClick={e => e.stopPropagation()}>
        <button className="ra-modal-close" onClick={onClose}><FaTimes /></button>
        <h3 className="ra-modal-title">Application Details</h3>

        <div className="ra-modal-head">
          <div className="ra-modal-avatar">{initials}</div>
          <div>
            <div className="ra-modal-name">{studentFullName}</div>
            <div className="ra-modal-id">{app.studentId?.studentID || "N/A"}</div>
          </div>
        </div>

        {app.status === "pending_university" && (
          <div className={`ra-modal-warning ${isUrgent ? "urgent" : ""}`}>
            <FaClock />
            <span>
              <strong>Deadline: {timeRemaining}</strong> — University must act within 3 days or the application is auto-cancelled.
            </span>
          </div>
        )}

        <div className="ra-modal-quick">
          <div className="ra-quick-box">
            <div className="ra-quick-label">Company</div>
            <div className="ra-quick-val">{app.companyId?.name || "N/A"}</div>
          </div>
          <div className="ra-quick-box">
            <div className="ra-quick-label">Field</div>
            <div className="ra-quick-val">{app.trainingId?.field || "N/A"}</div>
          </div>
          <div className="ra-quick-box">
            <div className="ra-quick-label">Hours</div>
            <div className="ra-quick-val">{app.trainingId?.totalHours || "N/A"}h</div>
          </div>
        </div>

        <div className="ra-modal-section-title"><FaGraduationCap /> Submitted Training Request</div>
        <div className="ra-modal-grid">
          <div className="ra-grid-item">
            <label>Semester</label>
            <div>{app.officialForm?.semester || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Academic Year</label>
            <div>{app.officialForm?.academicYear || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Major</label>
            <div>{app.officialForm?.major || app.studentId?.major || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Student ID</label>
            <div>{app.studentId?.studentID || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Credit Hours Completed</label>
            <div>{app.officialForm?.completedCredits || app.studentId?.completedCreditHours || "N/A"}h</div>
          </div>
          <div className="ra-grid-item">
            <label>Student Mobile</label>
            <div>{app.officialForm?.studentPhone || app.studentId?.phone || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Submission Date</label>
            <div>{app.submittedToUniversityAt ? new Date(app.submittedToUniversityAt).toLocaleDateString() : "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Company Address</label>
            <div>{app.officialForm?.companyAddress || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Company Phone</label>
            <div>{app.officialForm?.companyPhone || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Training Supervisor</label>
            <div>{app.officialForm?.trainerName || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Job Title</label>
            <div>{app.officialForm?.supervisorJobTitle || "N/A"}</div>
          </div>
          <div className="ra-grid-item">
            <label>Supervisor Phone</label>
            <div>{app.officialForm?.trainerPhone || "N/A"}</div>
          </div>
          <div className="ra-grid-item ra-full">
            <label>Supervisor Email</label>
            <div>{app.officialForm?.trainerEmail || "N/A"}</div>
          </div>
        </div>

        <div className="ra-modal-workflow">
          <div className="ra-workflow-title">Application Workflow</div>
          <div className="ra-workflow-step">
            <div className="ra-step-icon ra-step-success"><FaBuilding /></div>
            <div className="ra-step-text">Company Approval</div>
            <div className="ra-step-badge ra-badge-success">
              <FaCheck /> {app.companyApprovedAt ? "Approved" : "Pending"}
            </div>
          </div>
          <div className="ra-workflow-line"></div>
          <div className="ra-workflow-step">
            <div className={`ra-step-icon ${app.status === "pending_university" ? "ra-step-pending" : "ra-step-success"}`}>
              <FaGraduationCap />
            </div>
            <div className="ra-step-text">University Review</div>
            <div className={`ra-step-badge ${app.status === "pending_university" ? "ra-badge-pending" : "ra-badge-success"}`}>
              {app.status === "pending_university" ? <FaClock /> : <FaCheck />}
              {app.status === "pending_university" ? "Pending" : "Approved"}
            </div>
          </div>
        </div>

        <div className="ra-modal-footer">
          <button className="ra-btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewApplications() {
  const [filter, setFilter] = useState("pending_university");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectAppId, setRejectAppId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.university();
      setApplications(response.applications || []);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const getCountByStatus = (status) => applications.filter(app => app.status === status).length;
  const filteredApps = applications.filter(app => app.status === filter);

  const handleApprove = async (applicationId) => {
    setIsProcessing(true);
    try {
      await applicationApi.universityResponse(applicationId, "approve");
      await fetchApplications();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (applicationId, reason) => {
    setIsProcessing(true);
    try {
      await applicationApi.universityResponse(applicationId, "reject", { rejectionReason: reason });
      await fetchApplications();
      setRejectAppId(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { key: "pending_university", label: "Pending", icon: FaClock },
    { key: "university_approved", label: "Sent to Company", icon: FaPaperPlane },
    { key: "university_rejected", label: "Rejected", icon: FaTimes },
    { key: "auto_cancelled", label: "Cancelled", icon: FaExclamationTriangle },
  ];

  if (loading) return (
    <div className="ra-page">
      <div className="ra-loading"><FaSpinner className="spinner" /><p>Loading applications...</p></div>
    </div>
  );

  if (error) return (
    <div className="ra-page">
      <div className="ra-error">
        <FaExclamationTriangle /><p>{error}</p>
        <button onClick={fetchApplications}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="ra-page">
      <div className="ra-header">
        <h1 className="ra-title">Review Applications</h1>
        <p className="ra-sub">Review student applications and track company responses</p>
      </div>

      <div className="ra-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`ra-tab ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            <tab.icon /> {tab.label} ({getCountByStatus(tab.key)})
          </button>
        ))}
      </div>

      <div className="ra-list">
        {filteredApps.length === 0 && (
          <div className="ra-empty">
            No applications found in "{tabs.find(t => t.key === filter)?.label}" category.
          </div>
        )}

        {filteredApps.map(app => {
          const firstName = app.studentId?.firstName || "";
          const lastName = app.studentId?.lastName || "";
          const studentFullName = `${firstName} ${lastName}`.trim();
          const initials = studentFullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

          const getTimeRemaining = (deadline) => {
            if (!deadline) return null;
            const remaining = new Date(deadline) - new Date();
            if (remaining <= 0) return "Expired";
            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining % 86400000) / (1000 * 60 * 60));
            if (days > 0) return `${days}d ${hours}h remaining`;
            return `${hours}h remaining`;
          };

          const timeRemaining = getTimeRemaining(app.studentDeadline);
          const isUrgent = app.studentDeadline && (new Date(app.studentDeadline) - new Date()) < 86400000;

          return (
            <div key={app._id} className="ra-card" onClick={() => setSelectedApp(app)} style={{ cursor: "pointer" }}>
              <div className="ra-card-left">
                <div className="ra-card-avatar">{initials}</div>
                <div className="ra-card-info">
                  <div className="ra-card-name">
                    {studentFullName} <span className="ra-card-id">{app.studentId?.studentID || "N/A"}</span>
                  </div>
                  <div className="ra-card-details">
                    {app.companyId?.name || "N/A"} · {app.trainingId?.field || "N/A"}
                  </div>
                  <div className="ra-card-meta">
                    Hours: <strong>{app.trainingId?.totalHours || "N/A"}h</strong> &nbsp;
                    Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>

              <div className="ra-card-right">
                {app.status === "pending_university" && timeRemaining && (
                  <div className={`ra-timer ${isUrgent ? "urgent" : ""}`}>
                    <FaClock /> {timeRemaining}
                  </div>
                )}
                <div className="ra-card-actions">
                  {app.status === "pending_university" && (
                    <>
                      <button
                        className="ra-btn-solid ra-solid-approve"
                        onClick={(e) => { e.stopPropagation(); handleApprove(app._id); }}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <FaSpinner className="spinner" /> : <FaCheck />} Approve
                      </button>
                      <button
                        className="ra-btn-solid ra-solid-reject"
                        onClick={(e) => { e.stopPropagation(); setRejectAppId(app._id); }}
                        disabled={isProcessing}
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                  <button
                    className="ra-btn-view"
                    onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedApp && (
        <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      <RejectModal
        isOpen={!!rejectAppId}
        onClose={() => setRejectAppId(null)}
        onConfirm={(reason) => { if (rejectAppId) handleReject(rejectAppId, reason); }}
        isProcessing={isProcessing}
      />
    </div>
  );
}