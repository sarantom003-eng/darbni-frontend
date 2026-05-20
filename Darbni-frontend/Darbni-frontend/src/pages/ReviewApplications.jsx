import { useState } from "react";
import {
  FaClock, FaEye, FaCheck, FaTimes, FaGraduationCap,
  FaPaperPlane, FaBan, FaExclamationTriangle, FaBuilding
} from "react-icons/fa";

const APPLICATIONS = [
  {
    id: 1,
    studentName: "Ahmad Nasser",
    studentId: "20211234",
    company: "TechPal Solutions",
    field: "Web Development",
    hours: "150h",
    appliedDate: "2025-12-01",
    status: "Pending",
    timeRemaining: "1d 23h remaining",
    urgent: false,
    details: {
      semester: "Spring 2025/2026",
      major: "Web Development",
      creditHours: "112h",
      mobile: "+970 599 123 456",
      submissionDate: "2026-05-10",
      companyAddress: "Tulkarm - Industrial Zone, Building 12",
      companyPhone: "+970 9 234 5678",
      trainingSupervisor: "Eng. Mahmoud Saleh",
      jobTitle: "Senior Software Engineer",
      supervisorPhone: "+970 599 987 654",
      supervisorEmail: "supervisor@company.ps"
    }
  },
  {
    id: 2,
    studentName: "Layla Haddad",
    studentId: "20211567",
    company: "DataVision Co.",
    field: "Data Science",
    hours: "150h",
    appliedDate: "2025-12-03",
    status: "Pending",
    timeRemaining: "4h remaining",
    urgent: true,
    details: {
      semester: "Spring 2025/2026",
      major: "Data Science",
      creditHours: "120h",
      mobile: "+970 599 333 444",
      submissionDate: "2026-05-08",
      companyAddress: "Nablus - Rafidia",
      companyPhone: "+970 9 233 4455",
      trainingSupervisor: "Dr. Sami Ali",
      jobTitle: "Data Analyst Intern",
      supervisorPhone: "+970 599 111 222",
      supervisorEmail: "sami@datavision.ps"
    }
  },
  {
    id: 3,
    studentName: "Reem Khalil",
    studentId: "20216789",
    company: "SecureNet Co.",
    field: "Network Security",
    hours: "150h",
    appliedDate: "2025-12-10",
    status: "Pending",
    timeRemaining: "23h remaining",
    urgent: false,
    details: {
      semester: "Spring 2025/2026",
      major: "Network Engineering",
      creditHours: "105h",
      mobile: "+970 599 555 666",
      submissionDate: "2026-05-11",
      companyAddress: "Ramallah - Al-Masyoun",
      companyPhone: "+970 2 295 1234",
      trainingSupervisor: "Eng. Omar Zaid",
      jobTitle: "Security Intern",
      supervisorPhone: "+970 599 777 888",
      supervisorEmail: "omar@securenet.ps"
    }
  }
];

function ApplicationModal({ app, onClose, onAction }) {
  if (!app) return null;
  const initials = app.studentName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="ra-overlay" onClick={onClose}>
      <div className="ra-modal" onClick={e => e.stopPropagation()}>
        <button className="ra-modal-close" onClick={onClose}><FaTimes /></button>

        <h3 className="ra-modal-title">Application Details</h3>

        {/* Header */}
        <div className="ra-modal-head">
          <div className="ra-modal-avatar">{initials}</div>
          <div>
            <div className="ra-modal-name">{app.studentName}</div>
            <div className="ra-modal-id">{app.studentId}</div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="ra-modal-warning">
          <FaClock />
          <span>
            <strong>Deadline: {app.timeRemaining}</strong> — University must act within 3 days or the application is auto-cancelled.
          </span>
        </div>

        {/* Quick Info */}
        <div className="ra-modal-quick">
          <div className="ra-quick-box">
            <div className="ra-quick-label">Company</div>
            <div className="ra-quick-val">{app.company}</div>
          </div>
          <div className="ra-quick-box">
            <div className="ra-quick-label">Field</div>
            <div className="ra-quick-val">{app.field}</div>
          </div>
          <div className="ra-quick-box">
            <div className="ra-quick-label">Hours</div>
            <div className="ra-quick-val">{app.hours}</div>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="ra-modal-section-title">
          <FaGraduationCap /> Submitted Training Request
        </div>
        <div className="ra-modal-grid">
          <div className="ra-grid-item"><label>Semester</label><div>{app.details.semester}</div></div>
          <div className="ra-grid-item"><label>Major</label><div>{app.details.major}</div></div>
          <div className="ra-grid-item"><label>Student ID</label><div>{app.studentId}</div></div>
          <div className="ra-grid-item"><label>Credit Hours Completed</label><div>{app.details.creditHours}</div></div>
          <div className="ra-grid-item"><label>Student Mobile</label><div>{app.details.mobile}</div></div>
          <div className="ra-grid-item"><label>Submission Date</label><div>{app.details.submissionDate}</div></div>
          <div className="ra-grid-item"><label>Company Address</label><div>{app.details.companyAddress}</div></div>
          <div className="ra-grid-item"><label>Company Phone</label><div>{app.details.companyPhone}</div></div>
          <div className="ra-grid-item"><label>Training Supervisor</label><div>{app.details.trainingSupervisor}</div></div>
          <div className="ra-grid-item"><label>Job Title</label><div>{app.details.jobTitle}</div></div>
          <div className="ra-grid-item"><label>Supervisor Phone</label><div>{app.details.supervisorPhone}</div></div>
          <div className="ra-grid-item ra-full"><label>Supervisor Email</label><div>{app.details.supervisorEmail}</div></div>
        </div>

        {/* Workflow */}
        <div className="ra-modal-workflow">
          <div className="ra-workflow-title">Application Workflow</div>
          <div className="ra-workflow-step">
            <div className="ra-step-icon ra-step-success"><FaBuilding /></div>
            <div className="ra-step-text">Company Approval</div>
            <div className="ra-step-badge ra-badge-success"><FaCheck /> Approved</div>
          </div>
          <div className="ra-workflow-line"></div>
          <div className="ra-workflow-step">
            <div className="ra-step-icon ra-step-pending"><FaGraduationCap /></div>
            <div className="ra-step-text">University Review</div>
            <div className="ra-step-badge ra-badge-pending"><FaClock /> Pending</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="ra-modal-footer">
          <button className="ra-btn-close" onClick={onClose}>Close</button>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="ra-btn-approve" onClick={() => onAction(app.id, "Approved")}>
              <FaCheck /> Approve & Forward
            </button>
            <button className="ra-btn-reject" onClick={() => onAction(app.id, "Rejected")}>
              <FaTimes /> Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewApplications() {
  const [filter, setFilter] = useState("Pending");
  const [apps, setApps] = useState(APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = apps.filter(a => a.status === filter);

  const handleAction = (id, newStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setSelectedApp(null);
  };

  const pendingCount = apps.filter(a => a.status === "Pending").length;
  const sentCount = apps.filter(a => a.status === "Sent").length;
  const rejectedCount = apps.filter(a => a.status === "Rejected").length;
  const cancelledCount = apps.filter(a => a.status === "Cancelled").length;

  return (
    <div className="ra-page">
      {/* Header */}
      <div className="ra-header">
        <h1 className="ra-title">Review Applications</h1>
        <p className="ra-sub">Review student applications and track company responses</p>
      </div>

      {/* Tabs */}
      <div className="ra-tabs">
        <button className={`ra-tab ${filter === "Pending" ? "active" : ""}`} onClick={() => setFilter("Pending")}>
          <FaClock /> Pending ({pendingCount})
        </button>
        <button className={`ra-tab ${filter === "Sent" ? "active" : ""}`} onClick={() => setFilter("Sent")}>
          <FaPaperPlane /> Sent to Company ({sentCount})
        </button>
        <button className={`ra-tab ${filter === "Rejected" ? "active" : ""}`} onClick={() => setFilter("Rejected")}>
          <FaTimes /> Rejected ({rejectedCount})
        </button>
        <button className={`ra-tab ${filter === "Cancelled" ? "active" : ""}`} onClick={() => setFilter("Cancelled")}>
          <FaExclamationTriangle /> Cancelled ({cancelledCount})
        </button>
      </div>

      {/* List */}
      <div className="ra-list">
        {filteredApps.length === 0 && (
          <div className="ra-empty">No applications found in this category.</div>
        )}

        {filteredApps.map(app => {
          const initials = app.studentName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={app.id} className="ra-card" onClick={() => setSelectedApp(app)} style={{ cursor: "pointer" }}>
              <div className="ra-card-left">
                <div className="ra-card-avatar">{initials}</div>
                <div className="ra-card-info">
                  <div className="ra-card-name">
                    {app.studentName} <span className="ra-card-id">{app.studentId}</span>
                  </div>
                  <div className="ra-card-details">
                    {app.company} · {app.field}
                  </div>
                  <div className="ra-card-meta">
                    Hours: <strong>{app.hours}</strong> &nbsp; Applied: {app.appliedDate}
                  </div>
                </div>
              </div>

              <div className="ra-card-right">
                {app.status === "Pending" && (
                  <div className={`ra-timer ${app.urgent ? "urgent" : ""}`}>
                    <FaClock /> {app.timeRemaining}
                  </div>
                )}

                <div className="ra-card-actions">
                  {app.status === "Pending" && (
                    <>
                      <button className="ra-btn-solid ra-solid-approve" onClick={(e) => { e.stopPropagation(); handleAction(app.id, "Approved"); }}>
                        <FaCheck /> Approve
                      </button>
                      <button className="ra-btn-solid ra-solid-reject" onClick={(e) => { e.stopPropagation(); handleAction(app.id, "Rejected"); }}>
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
