import { useState, useEffect } from "react";
import {
  FaClock, FaEye, FaCheck, FaTimes, FaGraduationCap,
  FaPaperPlane, FaExclamationTriangle, FaBuilding,
  FaSpinner, FaBan, FaPrint, FaArrowRight, FaArrowLeft
} from "react-icons/fa";
import { applicationApi } from "../api/client";

function RejectModal({ isOpen, onClose, onConfirm, isProcessing }) {
  const [reason, setReason] = useState("");
  if (!isOpen) return null;
  const handleSubmit = () => {
    if (!reason.trim()) { alert("Please enter a rejection reason"); return; }
    onConfirm(reason);
    setReason("");
  };
  return (
    <div className="ra-overlay" onClick={onClose}>
      <div className="ra-modal ra-modal-sm" onClick={e => e.stopPropagation()}>
        <button className="ra-modal-close" onClick={onClose} disabled={isProcessing}><FaTimes /></button>
        <div className="ra-modal-icon ra-modal-icon-danger"><FaBan /></div>
        <h3 className="ra-modal-title">Reject Application</h3>
        <p className="ra-modal-subtitle">Please provide a reason for rejecting this application</p>
        <div className="ra-form-group">
          <label>Rejection Reason</label>
          <textarea className="ra-textarea" rows="3"
            placeholder="e.g., Missing documents, Credit hours not met, etc."
            value={reason} onChange={e => setReason(e.target.value)} disabled={isProcessing} />
        </div>
        <div className="ra-modal-footer">
          <button className="ra-btn-close" onClick={onClose} disabled={isProcessing}>Cancel</button>
          <button className="ra-btn-reject" onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? <FaSpinner className="spinner" /> : <FaTimes />} Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

function ApproveModal({ app, onClose, onApproved, isProcessing, setIsProcessing }) {
  const [step, setStep] = useState(1);
  if (!app) return null;

  const studentName   = `${app.studentId?.firstName || ""} ${app.studentId?.lastName || ""}`.trim();
  const studentID     = app.studentId?.studentID || "N/A";
  const major         = app.officialForm?.major || app.studentId?.major || "N/A";
  const companyName   = app.companyId?.name || "N/A";
  const trainingTitle = app.trainingId?.title || app.trainingId?.field || "N/A";
  const totalHours    = app.trainingId?.totalHours || 160;
  const startDate     = app.trainingId?.startDate
    ? new Date(app.trainingId.startDate).toISOString().split("T")[0] : "N/A";
  const trainerName   = app.officialForm?.trainerName ||
    (app.companyId?.trainer?.firstName
      ? `${app.companyId.trainer.firstName} ${app.companyId.trainer.lastName || ""}`.trim() : "N/A");
  const universityName  = app.studentId?.university_name || app.universityId?.name || "Palestine Technical University - Kadoorie";
  const supervisorName  = localStorage.getItem("firstName")
    ? `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName") || ""}`.trim()
    : "Training Coordinator";
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  const buildLogbook = () => {
    const rows = [];
    const start = app.trainingId?.startDate ? new Date(app.trainingId.startDate) : new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    let week = 1, dayCount = 0, weekDayCount = 0;
    let current = new Date(start);
    while (dayCount < 20) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        if (weekDayCount === 5) { week++; weekDayCount = 0; }
        rows.push({
          week: weekDayCount === 0 ? `Week ${week}` : "",
          day: dayNames[dayOfWeek],
          date: current.toISOString().split("T")[0],
          hours: 8,
        });
        dayCount++; weekDayCount++;
      }
      current.setDate(current.getDate() + 1);
    }
    return rows;
  };

  const logbook = buildLogbook();

  const handleForward = async () => {
    setIsProcessing(true);
    try {
      await applicationApi.universityResponse(app._id, "approve");
      onApproved();
      onClose();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="ra-overlay" onClick={onClose}>
      <div className="ra-modal ra-modal-lg" onClick={e => e.stopPropagation()}
        style={{ maxWidth: 780, maxHeight: "90vh", overflowY: "auto" }}>
        <button className="ra-modal-close" onClick={onClose}><FaTimes /></button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <FaPaperPlane style={{ color: "#6c47ff" }} />
          <div>
            <h3 className="ra-modal-title" style={{ margin: 0 }}>
              {step === 1 ? "كتاب التدريب الميداني الرسمي" : "Final Training Evaluation Form"}
            </h3>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
              {step === 1
                ? "Step 1 of 2 — Official Arabic letter to the company."
                : "Step 2 of 2 — Evaluation form."}
            </p>
          </div>
        </div>

        {step === 1 && (
          <div id="print-area">
            <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 32, background: "#fafafa", fontFamily: "Arial, sans-serif", direction: "rtl" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <img src="/ptu-banner.png" alt="University Banner" style={{ maxWidth: "100%", height: "auto" }} onError={e => { e.target.style.display = "none"; }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span>التاريخ :</span>
                <span style={{ fontWeight: 600 }}>{today}</span>
              </div>
              <div style={{ marginBottom: 12 }}>حضرة السادة : <strong>{companyName}</strong>. المحترمين</div>
              <div style={{ marginBottom: 12 }}>
                <strong>الموضوع : التدريب الميداني</strong><br />
                <strong>تخصص : {major}</strong>
              </div>
              <div style={{ marginBottom: 16 }}>تحية طيبة وبعد..</div>
              <p style={{ lineHeight: 2, marginBottom: 12 }}>
                أرجو من حضرتكم التكرم بالسماح للطالب/ة <strong>{studentName}</strong> بالتدرب في مؤسستكم الموقرة
                أيام الدوام الرسمي في المؤسسة بحيث ينهي الطالب (160) ساعة تدريبية.
              </p>
              <p style={{ lineHeight: 2, marginBottom: 20 }}>
                يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق بعد انتهاء فترة التدريب.
              </p>
              <div style={{ marginBottom: 20 }}>وتفضلوا بقبول فائق الاحترام..</div>
              <div>
                مسؤول التدريب : <strong>{supervisorName}</strong>
                <div style={{ fontSize: 13, color: "#666" }}>{universityName}</div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div id="print-area">
            <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 28, background: "#fafafa", fontFamily: "Arial, sans-serif" }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <img src="/ptu-banner.png" alt="University Banner" style={{ maxWidth: "100%", height: "auto" }} onError={e => { e.target.style.display = "none"; }} />
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>Final Training Evaluation Form</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  ["STUDENT NAME", studentName],
                  ["UNIVERSITY ID", studentID],
                  ["UNIVERSITY", universityName],
                  ["TRAINING TITLE", trainingTitle],
                  ["COMPANY", companyName],
                  ["TRAINING SUPERVISOR", trainerName],
                  ["START DATE", startDate],
                  ["TARGET HOURS", `${totalHours} hours`],
                  ["TOTAL HOURS COMPLETED", "(to be filled by company)"],
                  ["TOTAL DAYS", "(to be filled by company)"],
                ].map(([label, val], i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 6, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, color: val.startsWith("(") ? "#bbb" : "#1a1729", fontStyle: val.startsWith("(") ? "italic" : "normal" }}>{val}</div>
                  </div>
                ))}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 8 }}>
                <thead>
                  <tr style={{ background: "#f5f4f1" }}>
                    {["Week", "Day", "Date", "Tasks Completed", "Hours", "Company Rating", "Feedback"].map(h => (
                      <th key={h} style={{ padding: "8px 6px", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logbook.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "6px", color: "#6c47ff" }}>{row.week}</td>
                      <td style={{ padding: "6px", color: "#555" }}>{row.day}</td>
                      <td style={{ padding: "6px", color: "#555" }}>{row.date}</td>
                      <td style={{ padding: "6px" }}><div style={{ minHeight: 28, border: "1px solid #e0e0e0", borderRadius: 4, padding: "4px 6px", fontSize: 11, color: "#bbb", fontStyle: "italic" }}>(student entry)</div></td>
                      <td style={{ padding: "6px" }}><div style={{ width: 40, border: "1px solid #e0e0e0", borderRadius: 4, padding: "4px 6px", textAlign: "center" }}>{row.hours}</div></td>
                      <td style={{ padding: "6px" }}><div style={{ width: 50, height: 28, border: "1px solid #e0e0e0", borderRadius: 4 }} /></td>
                      <td style={{ padding: "6px" }}><div style={{ minWidth: 100, height: 28, border: "1px solid #e0e0e0", borderRadius: 4 }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <button className="ra-btn-close" onClick={onClose}>Cancel</button>
          <div style={{ display: "flex", gap: 10 }}>
            {step === 2 && (
              <button onClick={() => setStep(1)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: 13 }}>
                <FaArrowLeft size={12} /> Back
              </button>
            )}
            <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: 13 }}>
              <FaPrint size={12} /> Print
            </button>
            {step === 1 && (
              <button onClick={() => setStep(2)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: "#6c47ff", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Next <FaArrowRight size={12} />
              </button>
            )}
            {step === 2 && (
              <button onClick={handleForward} disabled={isProcessing} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: "#6c47ff", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: isProcessing ? 0.7 : 1 }}>
                {isProcessing ? <FaSpinner className="spinner" /> : <FaPaperPlane size={12} />}
                Forward to Company
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationModal({ app, onClose }) {
  if (!app) return null;
  const firstName = app.studentId?.firstName || "";
  const lastName  = app.studentId?.lastName  || "";
  const studentFullName = `${firstName} ${lastName}`.trim();
  const initials = studentFullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const getTimeRemaining = (deadline) => {
    if (!deadline) return "No deadline set";
    const remaining = new Date(deadline) - new Date();
    if (remaining <= 0) return "Expired";
    const days  = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % 86400000) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

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
              <strong>Deadline: {getTimeRemaining(app.studentDeadline)}</strong> — University must act within 3 days.
            </span>
          </div>
        )}

        {/* ✅ لو الطلب auto_cancelled نعرض رسالة ونمنع الـ approve/reject */}
        {app.status === "auto_cancelled" && (
          <div className="ra-modal-warning urgent">
            <FaExclamationTriangle />
            <span><strong>This application has been auto-cancelled</strong> — the deadline has expired.</span>
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
          <div className="ra-grid-item"><label>Semester</label><div>{app.officialForm?.semester || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Academic Year</label><div>{app.officialForm?.academicYear || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Major</label><div>{app.officialForm?.major || app.studentId?.major || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Student ID</label><div>{app.studentId?.studentID || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Credit Hours</label><div>{app.officialForm?.completedCredits || app.studentId?.completedCreditHours || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Student Mobile</label><div>{app.officialForm?.studentPhone || app.studentId?.phone || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Submission Date</label><div>{app.submittedToUniversityAt ? new Date(app.submittedToUniversityAt).toLocaleDateString() : "N/A"}</div></div>
          <div className="ra-grid-item"><label>Company Address</label><div>{app.officialForm?.companyAddress || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Company Phone</label><div>{app.officialForm?.companyPhone || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Training Supervisor</label><div>{app.officialForm?.trainerName || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Job Title</label><div>{app.officialForm?.supervisorJobTitle || "N/A"}</div></div>
          <div className="ra-grid-item"><label>Supervisor Phone</label><div>{app.officialForm?.trainerPhone || "N/A"}</div></div>
          <div className="ra-grid-item ra-full"><label>Supervisor Email</label><div>{app.officialForm?.trainerEmail || "N/A"}</div></div>
        </div>

        <div className="ra-modal-workflow">
  <div className="ra-workflow-title">Application Workflow</div>

  {/* Company Approval Step */}
  <div className="ra-workflow-step">
    <div className="ra-step-icon ra-step-success"><FaBuilding /></div>
    <div className="ra-step-text">Company Approval</div>
    <div className="ra-step-badge ra-badge-success">
      <FaCheck /> Approved
    </div>
  </div>

  <div className="ra-workflow-line"></div>

  {/* University Review Step — يتغير حسب الحالة الفعلية */}
  <div className="ra-workflow-step">
    <div className={`ra-step-icon ${
      app.status === "university_rejected" ? "ra-step-danger" :
      app.status === "auto_cancelled"      ? "ra-step-danger" :
      app.status === "pending_university"  ? "ra-step-pending" :
      "ra-step-success"
    }`}>
      <FaGraduationCap />
    </div>
    <div className="ra-step-text">University Review</div>
    <div className={`ra-step-badge ${
      app.status === "university_rejected" ? "ra-badge-danger" :
      app.status === "auto_cancelled"      ? "ra-badge-danger" :
      app.status === "pending_university"  ? "ra-badge-pending" :
      "ra-badge-success"
    }`}>
      {app.status === "university_rejected" ? <><FaTimes /> Rejected</>  :
       app.status === "auto_cancelled"      ? <><FaBan />   Cancelled</> :
       app.status === "pending_university"  ? <><FaClock /> Pending</>   :
       <><FaCheck /> Approved</>}
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
  const [filter,       setFilter]       = useState("pending_university");
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [selectedApp,  setSelectedApp]  = useState(null);
  const [approveApp,   setApproveApp]   = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectAppId,  setRejectAppId]  = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.university();
      const now = new Date();

      // ✅ لبنى: نحول company_approved المنتهية لـ auto_cancelled محلياً
      const apps = (response.applications || []).map(app => {
        if (
          app.status === "company_approved" &&
          app.studentDeadline &&
          new Date(app.studentDeadline) < now
        ) {
          return { ...app, status: "auto_cancelled" };
        }
        return app;
      });

      setApplications(apps);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const getCountByStatus = (status) => applications.filter(app => app.status === status).length;
  const filteredApps = applications.filter(app => app.status === filter);

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
    { key: "pending_university", label: "Pending",         icon: FaClock },
    { key: "university_approved", label: "Sent to Company", icon: FaPaperPlane },
    { key: "university_rejected", label: "Rejected",        icon: FaTimes },
    { key: "auto_cancelled",      label: "Cancelled",       icon: FaExclamationTriangle },
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
          <button key={tab.key}
            className={`ra-tab ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}>
            <tab.icon /> {tab.label} ({getCountByStatus(tab.key)})
          </button>
        ))}
      </div>

      <div className="ra-list">
        {filteredApps.length === 0 && (
          <div className="ra-empty">No applications in "{tabs.find(t => t.key === filter)?.label}".</div>
        )}

        {filteredApps.map(app => {
          const firstName = app.studentId?.firstName || "";
          const lastName  = app.studentId?.lastName  || "";
          const studentFullName = `${firstName} ${lastName}`.trim();
          const initials = studentFullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

          const getTimeRemaining = (deadline) => {
            if (!deadline) return null;
            const remaining = new Date(deadline) - new Date();
            if (remaining <= 0) return "Expired";
            const days  = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining % 86400000) / (1000 * 60 * 60));
            if (days > 0) return `${days}d ${hours}h remaining`;
            return `${hours}h remaining`;
          };

          const timeRemaining = getTimeRemaining(app.studentDeadline);
          const isUrgent = app.studentDeadline && (new Date(app.studentDeadline) - new Date()) < 86400000;

          // ✅ الطلب المنتهي — نعرضه في cancelled بس بدون أزرار
          const isExpired = app.status === "auto_cancelled";

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

                {/* ✅ Expired badge للطلبات المنتهية */}
                {isExpired && (
                  <div className="ra-timer urgent">
                    <FaExclamationTriangle /> Expired
                  </div>
                )}

                <div className="ra-card-actions">
                  {/* ✅ أزرار Approve/Reject بس للـ pending_university وليس المنتهية */}
                  {app.status === "pending_university" && !isExpired && (
                    <>
                      <button
                        className="ra-btn-solid ra-solid-approve"
                        onClick={e => { e.stopPropagation(); setApproveApp(app); }}
                        disabled={isProcessing}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        className="ra-btn-solid ra-solid-reject"
                        onClick={e => { e.stopPropagation(); setRejectAppId(app._id); }}
                        disabled={isProcessing}
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                  <button
                    className="ra-btn-view"
                    onClick={e => { e.stopPropagation(); setSelectedApp(app); }}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedApp && <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} />}

      {approveApp && (
        <ApproveModal
          app={approveApp}
          onClose={() => setApproveApp(null)}
          onApproved={fetchApplications}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      )}

      <RejectModal
        isOpen={!!rejectAppId}
        onClose={() => setRejectAppId(null)}
        onConfirm={reason => { if (rejectAppId) handleReject(rejectAppId, reason); }}
        isProcessing={isProcessing}
      />
    </div>
  );
}