import { useState } from "react";
import { FaCheck, FaClock, FaCheckCircle, FaBan, FaTimes } from "react-icons/fa";

const MOCK = [
  {
    id: 1, name: "Ahmad Nasser", initials: "AN", color: "#6c47ff",
    university: "Palestine Technical University - Khadoorie",
    position: "Frontend Development Intern", specialization: "Computer Science",
    submittedDate: "Mar 6, 2026", letterDate: "March 6, 2026",
    startDate: "Apr 1, 2026", hours: 160,
    supervisor: "Dr. Samira Khalid", status: "pending",
  },
  {
    id: 2, name: "Khaled Hasan", initials: "KH", color: "#4a3fa0",
    university: "An-Najah National University",
    position: "Network Security Intern", specialization: "Computer Engineering",
    submittedDate: "Mar 5, 2026", letterDate: "March 5, 2026",
    startDate: "Apr 1, 2026", hours: 160,
    supervisor: "Dr. Ahmad Saleh", status: "pending",
  },
  {
    id: 3, name: "Layla Haddad", initials: "LH", color: "#e67e22",
    university: "Palestine Technical University - Khadoorie",
    position: "Mobile App Intern", specialization: "Software Engineering",
    submittedDate: "Mar 8, 2026", letterDate: "March 8, 2026",
    startDate: "Apr 5, 2026", hours: 160,
    supervisor: "Dr. Samira Khalid", status: "pending",
  },
  {
    id: 4, name: "Sara Tomeh", initials: "ST", color: "#27ae60",
    university: "Birzeit University",
    position: "Data Science Intern", specialization: "Data Science",
    submittedDate: "Feb 28, 2026", letterDate: "February 28, 2026",
    startDate: "Mar 15, 2026", hours: 160,
    supervisor: "Dr. Nadia Karam", status: "resolved",
  },
  {
    id: 5, name: "Omar Khalil", initials: "OK", color: "#e74c3c",
    university: "Palestine Polytechnic University",
    position: "Backend Development Intern", specialization: "Computer Science",
    submittedDate: "Feb 20, 2026", letterDate: "February 20, 2026",
    startDate: "Mar 10, 2026", hours: 160,
    supervisor: "Dr. Fadi Mansour", status: "cancelled",
  },
];

/* ── Modal ── */
function RequestModal({ req, onClose, onAccept }) {
  const company = localStorage.getItem("name") || "Your Company";

  return (
    <div className="ur-overlay" onClick={onClose}>
      <div className="ur-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ur-modal-x" onClick={onClose}><FaTimes /></button>

        {/* ── Official Letter ── */}
        <div className="ur-letter-header">
          <span className="ur-letter-icon">📄</span>
          <div>
            <h3 className="ur-letter-title">Official University Letter</h3>
            <p className="ur-letter-fwd">Forwarded by {req.university}</p>
          </div>
        </div>

        <div className="ur-letter-box" dir="rtl">
          {/* Banner Image */}
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
              ({req.hours}) ساعة تدريبية حيث يكون دوام الطالب في مؤسستكم مثل دوام
              العاملين فيها ولا يحق له التغيب دون إذن رسمي. وسيقدم الطالب المتدرب تقريراً عما
              اكتسب من مهارات للمحاضر المسؤول عنه في الجامعة في نهاية هذه الفترة.
            </p>
            <p>
              يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق
              ومتابعة حضور الطالب المتدرب من خلال نموذج الحضور والغياب المرفق
              وذلك بعد انتهاء فترة التدريب.
            </p>
            <p style={{ textAlign: "center", marginTop: 18, fontWeight: 700 }}>وتفضلوا بقبول فائق الاحترام..</p>
            <p className="ur-sig">مسؤول التدريب : <strong>{req.supervisor}</strong></p>
            <p className="ur-sig-uni">{req.university}</p>
          </div>
        </div>

        {/* ── Report Form ── */}
        <div className="ur-report">
          <h3 className="ur-report-title">Final Training Report — Filled by Company</h3>
          <p className="ur-report-sub">Submitted by {company}</p>

          <h4 className="ur-report-sec">Report Information</h4>
          <div className="ur-report-grid">
            <Field label="STUDENT NAME" value={req.name} />
            <Field label="UNIVERSITY ID" />
            <Field label="UNIVERSITY" value={req.university} />
            <Field label="TRAINING TITLE" value={req.position} />
            <Field label="COMPANY" value={company} />
            <Field label="TRAINING SUPERVISOR (COMPANY)" />
            <Field label="START DATE" value={req.startDate} />
            <Field label="END DATE" />
            <Field label="TOTAL HOURS COMPLETED" />
            <Field label="TOTAL DAYS" />
          </div>
          <div className="ur-report-full">
            <Field label="FINAL RATING" full />
          </div>

          <h4 className="ur-report-sec">Final Evaluation</h4>
          <div className="ur-report-full">
            <Field label="COMMENTS ON STUDENT PERFORMANCE" full />
          </div>
          <div className="ur-report-full">
            <Field label="OTHER COMMENTS" full />
          </div>
        </div>

        {/* ── Actions ── */}
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

/* ── Page ── */
export default function UniversityRequests() {
  const [data, setData] = useState(MOCK);
  const [tab, setTab] = useState("pending");
  const [selected, setSelected] = useState(null);

  const pending = data.filter((r) => r.status === "pending");
  const resolved = data.filter((r) => r.status === "resolved");
  const cancelled = data.filter((r) => r.status === "cancelled");

  const list =
    tab === "pending" ? pending : tab === "resolved" ? resolved : cancelled;

  const handleAccept = (id) => {
    setData((d) =>
      d.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
    );
    setSelected(null);
  };

  return (
    <div className="ur-page">
      <div className="ur-header">
        <h1 className="ur-title">University Requests</h1>
        <p className="ur-sub">
          Official internship requests forwarded by universities. Click any name
          to view the official letter.
        </p>
      </div>

      {/* Tabs */}
      <div className="ur-tabs">
        <button
          className={`ur-tab${tab === "pending" ? " ur-tab-active" : ""}`}
          onClick={() => setTab("pending")}
        >
          <FaClock size={12} /> Pending ({pending.length})
        </button>
        <button
          className={`ur-tab${tab === "resolved" ? " ur-tab-active" : ""}`}
          onClick={() => setTab("resolved")}
        >
          <FaCheckCircle size={12} /> Resolved ({resolved.length})
        </button>
        <button
          className={`ur-tab${tab === "cancelled" ? " ur-tab-active" : ""}`}
          onClick={() => setTab("cancelled")}
        >
          <FaBan size={12} /> Cancelled ({cancelled.length})
        </button>
      </div>

      {/* List */}
      <div className="ur-list">
        {list.length === 0 && (
          <div className="ur-empty">No {tab} requests.</div>
        )}
        {list.map((r) => (
          <div key={r.id} className="ur-item" onClick={() => setSelected(r)}>
            <div className="ur-avatar" style={{ background: r.color }}>
              {r.initials}
            </div>
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
                    onClick={(e) => { e.stopPropagation(); handleAccept(r.id); }}
                  >
                    <FaCheck size={11} /> Accept
                  </button>
                </>
              )}
              {r.status === "resolved" && (
                <span className="ur-badge ur-badge-resolved">Resolved</span>
              )}
              {r.status === "cancelled" && (
                <span className="ur-badge ur-badge-cancelled">Cancelled</span>
              )}
            </div>
          </div>
        ))}
      </div>

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
