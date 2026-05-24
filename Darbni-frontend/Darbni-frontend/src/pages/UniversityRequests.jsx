import { useEffect, useState } from "react";
import { FaCheck, FaClock, FaCheckCircle, FaBan, FaTimes } from "react-icons/fa";
import { applicationApi } from "../api/client";

/* ── Modal عرض التفاصيل ── */
function RequestModal({ req, onClose, onAccept }) {
  const company = localStorage.getItem("name") || "Your Company";

  return (
    <div className="ur-overlay" onClick={onClose}>
      <div className="ur-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ur-modal-x" onClick={onClose}><FaTimes /></button>

        {/* Official Letter Header */}
        <div className="ur-letter-header">
          <span className="ur-letter-icon">📄</span>
          <div>
            <h3 className="ur-letter-title">Official University Letter</h3>
            <p className="ur-letter-fwd">Forwarded by {req.university}</p>
          </div>
        </div>

        {/* Letter Content */}
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
              في مؤسستكم الموقرة أيام الدوام الرسمي في المؤسسة بحيث ينهي الطالب
              ({req.hours}) ساعة تدريبية...
            </p>
            <p style={{ textAlign: "center", marginTop: 18, fontWeight: 700 }}>وتفضلوا بقبول فائق الاحترام..</p>
            <p className="ur-sig">مسؤول التدريب : <strong>{req.supervisor}</strong></p>
            <p className="ur-sig-uni">{req.university}</p>
          </div>
        </div>

        {/* Report Form */}
        <div className="ur-report">
          <h3 className="ur-report-title">Final Training Report — Filled by Company</h3>
          <p className="ur-report-sub">Submitted by {company}</p>
          <h4 className="ur-report-sec">Report Information</h4>
          <div className="ur-report-grid">
            <Field label="STUDENT NAME" value={req.name} />
            <Field label="UNIVERSITY" value={req.university} />
            <Field label="TRAINING TITLE" value={req.position} />
            <Field label="COMPANY" value={company} />
            <Field label="START DATE" value={req.startDate} />
          </div>
          <h4 className="ur-report-sec">Final Evaluation</h4>
          <div className="ur-report-full">
            <Field label="COMMENTS ON STUDENT PERFORMANCE" full />
          </div>
        </div>

        {/* Actions */}
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

// ✅ تحويل بيانات الـ API إلى تنسيق الواجهة
const mapApplication = (app, statusType) => {
  const student = app.studentId || {};
  const training = app.trainingId || {};
  
  const firstName = student.firstName || "";
  const lastName = student.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown Student";
  
  let displayStatus = "pending";
  if (statusType === "resolved") {
    if (app.status === "company_approved") displayStatus = "resolved";
    else if (app.status === "company_rejected") displayStatus = "cancelled";
  }
  
  return {
    id: app._id,
    name: fullName,
    initials: firstName ? `${firstName[0]}${lastName?.[0] || ""}` : "??",
    color: ["#6c47ff", "#4a3fa0", "#27ae60", "#e74c3c", "#e67e22"][Math.floor(Math.random() * 5)],
    university: student.university_name || student.universityId?.name || "Unknown",
    position: training.title || "Unknown Position",
    specialization: student.major || "N/A",
    submittedDate: app.submittedToUniversityAt || app.createdAt
      ? new Date(app.submittedToUniversityAt || app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    letterDate: app.submittedToUniversityAt
      ? new Date(app.submittedToUniversityAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "",
    startDate: training.startDate ? new Date(training.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
    hours: training.totalHours || 160,
    supervisor: app.supervisorId?.firstName ? `${app.supervisorId.firstName} ${app.supervisorId.lastName}` : "University Supervisor",
    status: displayStatus,
  };
};

export default function UniversityRequests() {
  const [pending, setPending] = useState([]);
  const [resolved, setResolved] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [tab, setTab] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // ✅ جلب البيانات من الـ API الخاص بالشركة
  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await applicationApi.company();
      console.log("🔍 Company API Response:", response);
      
      // ✅ تصفية البيانات حسب الحالة
      setPending((response.pending || []).map(app => mapApplication(app, "pending")));
      setResolved((response.resolved || []).filter(app => app.status === "company_approved").map(app => mapApplication(app, "resolved")));
      setCancelled((response.resolved || []).filter(app => app.status === "company_rejected").map(app => mapApplication(app, "cancelled")));
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // ✅ الموافقة النهائية من الشركة
  const handleAccept = async (id) => {
    setProcessingId(id);
    try {
      await applicationApi.companyFinalResponse(id, "approve");
      await loadApplications();
      setSelected(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getList = () => {
    if (tab === "pending") return pending;
    if (tab === "resolved") return resolved;
    return cancelled;
  };

  const list = getList();
  const pendingCount = pending.length;
  const resolvedCount = resolved.length;
  const cancelledCount = cancelled.length;

  return (
    <div className="ur-page">
      <div className="ur-header">
        <h1 className="ur-title">University Requests</h1>
        <p className="ur-sub">Official internship requests forwarded by universities. Click any name to view the official letter.</p>
      </div>

      {error && (
        <div className="ur-error">
          <span>{error}</span>
          <button onClick={loadApplications} className="ur-retry-btn">Retry</button>
        </div>
      )}

      <div className="ur-tabs">
        <button
          className={`ur-tab${tab === "pending" ? " ur-tab-active" : ""}`}
          onClick={() => setTab("pending")}
        >
          <FaClock size={12} /> Pending ({pendingCount})
        </button>
        <button
          className={`ur-tab${tab === "resolved" ? " ur-tab-active" : ""}`}
          onClick={() => setTab("resolved")}
        >
          <FaCheckCircle size={12} /> Resolved ({resolvedCount})
        </button>
        <button
          className={`ur-tab${tab === "cancelled" ? " ur-tab-active" : ""}`}
          onClick={() => setTab("cancelled")}
        >
          <FaBan size={12} /> Cancelled ({cancelledCount})
        </button>
      </div>

      {loading && (
        <div className="ur-loading">
          <div className="ur-spinner"></div>
          <p>Loading requests...</p>
        </div>
      )}

      {!loading && (
        <div className="ur-list">
          {list.length === 0 && <div className="ur-empty">No {tab} requests.</div>}
          {list.map((r) => (
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
                      onClick={(e) => { e.stopPropagation(); handleAccept(r.id); }}
                    >
                      <FaCheck size={11} /> {processingId === r.id ? "..." : "Accept"}
                    </button>
                  </>
                )}
                {r.status === "resolved" && <span className="ur-badge ur-badge-resolved">Resolved</span>}
                {r.status === "cancelled" && <span className="ur-badge ur-badge-cancelled">Cancelled</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <RequestModal
          req={selected}
          onClose={() => setSelected(null)}
          onAccept={handleAccept}
        />
      )}
    </div>
  );
}