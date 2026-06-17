import { useEffect, useState } from "react";
import { FaCheck, FaClock, FaCheckCircle, FaBan, FaTimes } from "react-icons/fa";
import { applicationApi } from "../api/client";

function CustomToast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => { if (onClose) onClose(); }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`custom-toast custom-toast-${type}`}>
      <span className="custom-toast-icon">
        {type === "error"   && "❌"}
        {type === "success" && "✅"}
        {type === "info"    && "ℹ️"}
        {type === "warning" && "⚠️"}
      </span>
      <span className="custom-toast-message">{message}</span>
      <button className="custom-toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

function RequestModal({ req, onClose, onAccept }) {
  const company = localStorage.getItem("name") || "Your Company";

  return (
    <div className="ur-overlay" onClick={onClose}>
      <div className="ur-modal" onClick={e => e.stopPropagation()}>
        <button className="ur-modal-x" onClick={onClose}><FaTimes /></button>

        <div className="ur-letter-header">
          <span className="ur-letter-icon">📄</span>
          <div>
            <h3 className="ur-letter-title">Official University Letter</h3>
            <p className="ur-letter-fwd">Forwarded by {req.university}</p>
          </div>
        </div>

        <div className="ur-letter-box" dir="rtl">
          <div className="ur-banner-wrap">
            <img src="/ptu-banner.png" alt="University Letterhead" className="ur-banner-img" />
          </div>
          <div className="ur-letter-date-row">
            <span>التاريخ : {req.letterDate}</span>
          </div>
          <div className="ur-letter-body">
            <p style={{ textAlign: "right" }}>حضرة السادة : <strong>{company}</strong> المحترمين</p>
            <p style={{ textAlign: "center", fontWeight: 700 }}>الموضوع : التدريب الميداني</p>
            <p style={{ textAlign: "center" }}>تخصص : <strong>{req.specialization}</strong></p>
            <p style={{ marginTop: 10, textAlign: "right" }}>تحية طيبة وبعد،</p>
            <p>
              أرجو من حضرتكم التكرم بالسماح للطالب/ة <strong>{req.name}</strong> بالتدرب
              في مؤسستكم الموقرة بحيث ينهي الطالب (160)ساعة تدريبية حيث يكون دوام الطالب في مؤسستكم مثل دوام العاملين فيها ولا يحق له التغيب دون إذن رسمي، وسيقدم الطالب المتدرب تقريراً عما اكتسب من مهارات للمحاضر المسؤول عنه في الجامعة في نهاية هذه الفترة

يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق ومتابعة حضور الطالب المتدرب من خلال نموذج الحضور والغياب المرفق وذلك بعد انتهاء فترة التدريب.
            </p>
            <p style={{ textAlign: "center", marginTop: 18, fontWeight: 700 }}>وتفضلوا بقبول فائق الاحترام..</p>
            <p className="ur-sig">مسؤول التدريب : <strong>{req.supervisor}</strong></p>
            <p className="ur-sig-uni">{req.university}</p>
          </div>
        </div>

        <div className="ur-report">
          <h3 className="ur-report-title">Training Request Details</h3>
          <p className="ur-report-sub">Forwarded by {req.university}</p>
          <h4 className="ur-report-sec">Student Information</h4>
          <div className="ur-report-grid">
            <Field label="STUDENT NAME"        value={req.name} />
            <Field label="UNIVERSITY"          value={req.university} />
            <Field label="TRAINING TITLE"      value={req.position} />
            <Field label="COMPANY"             value={company} />
            <Field label="TRAINING SUPERVISOR" value={req.supervisor} />
            <Field label="START DATE"          value={req.startDate} />
            <Field label="END DATE"            value={req.endDate} />
            <Field label="TOTAL HOURS"         value={req.hours} />
          </div>
        </div>

        <div className="ur-actions">
          <button className="ur-btn-close" onClick={onClose}>Close</button>
          {req.status === "pending" && (
            <button className="ur-btn-accept" onClick={() => onAccept(req.id)}>
              <FaCheck size={12} /> Accept Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, full }) {
  return (
    <div className={`ur-field${full ? " ur-field-full" : ""}`}>
      <span className="ur-field-label">{label}</span>
      <span className={`ur-field-val${!value ? " ur-field-empty" : ""}`}>
        {value || "—"}
      </span>
    </div>
  );
}

// ✅ mapApplication معدلة حسب التعديلات
const mapApplication = (app, statusType) => {
  const student  = app.studentId  || {};
  const training = app.trainingId || {};
  const firstName = student.firstName || "";
  const lastName  = student.lastName  || "";
  const fullName  = `${firstName} ${lastName}`.trim() || "Unknown Student";

  // =====================================================
  // التعديل: اسم مدرب الشركة بدل supervisor الجامعة
  // بيجي من officialForm.trainerName (نفس المنطق المستخدم
  // في CompletionReports.jsx لأن الـ backend ما بعمل populate
  // لـ companyId.trainer بالـ response)
  const supervisorName = app.officialForm?.trainerName || "Not Assigned";
  // =====================================================

  // ✅ التعديل من الصورة
  let displayStatus = "pending";
  if (statusType === "resolved")  displayStatus = "resolved";
  if (statusType === "cancelled") displayStatus = "cancelled";

  // حساب End Date بناء على startDate + duration_weeks (نفس منطق CompletionReports)
  const startDateObj = training.startDate ? new Date(training.startDate) : null;
  const endDateObj = startDateObj && training.duration_weeks
    ? new Date(startDateObj.getTime() + training.duration_weeks * 7 * 24 * 60 * 60 * 1000)
    : null;

  return {
    id:             app._id,
    name:           fullName,
    initials:       firstName ? `${firstName[0]}${lastName?.[0] || ""}` : "??",
    color:          ["#6c47ff","#4a3fa0","#27ae60","#e74c3c","#e67e22"][firstName.charCodeAt(0) % 5 || 0],
    university:     student.university_name || student.universityId?.name || "Unknown",
    position:       training.title || "Unknown Position",
    specialization: student.major  || "N/A",
    submittedDate:  app.submittedToUniversityAt
      ? new Date(app.submittedToUniversityAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    letterDate:     app.submittedToUniversityAt
      ? new Date(app.submittedToUniversityAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "",
    startDate:      training.startDate
      ? new Date(training.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "TBD",
    endDate:        endDateObj
      ? endDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "TBD",
    hours:          training.totalHours || 160,
    supervisor:     supervisorName,
    status:         displayStatus,
    rawStatus:      app.status,
  };
};

export default function UniversityRequests() {
  const [pending,      setPending]      = useState([]);
  const [resolved,     setResolved]     = useState([]);
  const [cancelled,    setCancelled]    = useState([]);
  const [tab,          setTab]          = useState("pending");
  const [selected,     setSelected]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (message, type = "error") => setToast({ message, type });

  // ✅ loadApplications معدلة حسب الصور
  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await applicationApi.company();

      // ✅ pending = university_approved من resolved
      const universityPending = (response.resolved || []).filter(
        app => app.status === "university_approved"
      );

      // ✅ resolved = company_final_approved أو in_training أو completed
      const universityResolved = (response.resolved || []).filter(
        app =>
          app.status === "company_final_approved" ||
          app.status === "in_training" ||
          app.status === "completed"
      );

      // ✅ cancelled = auto_cancelled
      const universityCancelled = (response.resolved || []).filter(
        app => app.status === "auto_cancelled"
      );

      setPending(universityPending.map(app => mapApplication(app, "pending")));
      setResolved(universityResolved.map(app => mapApplication(app, "resolved")));
      setCancelled(universityCancelled.map(app => mapApplication(app, "cancelled")));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, []);

  const handleAccept = async (id) => {
    setProcessingId(id);
    try {
      await applicationApi.companyFinalResponse(id, "approve");
      showToast("Application approved successfully!", "success");
      await loadApplications();
      setSelected(null);
    } catch (err) {
      showToast(err.message || "Failed to approve application", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const list = tab === "pending" ? pending : tab === "resolved" ? resolved : cancelled;

  return (
    <div className="ur-page">
      <div className="ur-header">
        <h1 className="ur-title">University Requests</h1>
        <p className="ur-sub">Official internship requests forwarded by universities.</p>
      </div>

      {error && (
        <div className="ur-error">
          <span>{error}</span>
          <button onClick={loadApplications} className="ur-retry-btn">Retry</button>
        </div>
      )}

      <div className="ur-tabs">
        <button className={`ur-tab${tab === "pending"   ? " ur-tab-active" : ""}`} onClick={() => setTab("pending")}>
          <FaClock size={12} /> Pending ({pending.length})
        </button>
        <button className={`ur-tab${tab === "resolved"  ? " ur-tab-active" : ""}`} onClick={() => setTab("resolved")}>
          <FaCheckCircle size={12} /> Resolved ({resolved.length})
        </button>
        <button className={`ur-tab${tab === "cancelled" ? " ur-tab-active" : ""}`} onClick={() => setTab("cancelled")}>
          <FaBan size={12} /> Cancelled ({cancelled.length})
        </button>
      </div>

      {loading && <div className="ur-loading"><p>Loading requests...</p></div>}

      {!loading && (
        <div className="ur-list">
          {list.length === 0 && <div className="ur-empty">No {tab} requests.</div>}
          {list.map(r => (
            <div key={r.id} className="ur-item" onClick={() => setSelected(r)}>
              <div className="ur-avatar" style={{ background: r.color }}>{r.initials}</div>
              <div className="ur-info">
                <div className="ur-name">{r.name}</div>
                <div className="ur-meta">
                  {r.university} · {r.position} · Submitted {r.submittedDate}
                </div>
              </div>
              <div className="ur-row-actions">
                {r.status === "pending" && (
                  <>
                    <span className="ur-badge ur-badge-pending">Pending</span>
                    <button
                      className="ur-accept-btn"
                      disabled={processingId === r.id}
                      onClick={e => { e.stopPropagation(); handleAccept(r.id); }}
                    >
                      <FaCheck size={11} /> {processingId === r.id ? "..." : "Accept"}
                    </button>
                  </>
                )}
                {r.status === "resolved"  && <span className="ur-badge ur-badge-resolved">Resolved</span>}
                {r.status === "cancelled" && <span className="ur-badge ur-badge-cancelled">Cancelled</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <RequestModal req={selected} onClose={() => setSelected(null)} onAccept={handleAccept} />
      )}

      {toast && (
        <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}