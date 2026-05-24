import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaChevronRight, FaPlus, FaFileAlt, FaStar, FaPrint } from "react-icons/fa";
import { api } from "../api/client";

// ✅ دالة الـ API المؤقتة (لأنها مش موجودة في client.js)
const reportsApi = {
  companyReports: () => api("/reports/company"),
  create: (data) => api("/reports", { method: "POST", body: data }),
};

// ✅ تحويل بيانات الـ API إلى تنسيق الواجهة
const mapIntern = (app, type) => {
  const student = app.studentId || {};
  const training = app.trainingId || {};
  
  const firstName = student.firstName || "";
  const lastName = student.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown Student";
  
  return {
    id: app._id,
    name: fullName,
    initials: firstName ? `${firstName[0]}${lastName?.[0] || ""}` : "??",
    color: ["#7c5cbf", "#e67e22", "#27ae60", "#e74c3c", "#3498db"][Math.floor(Math.random() * 5)],
    studentId: student.studentID || "N/A",
    university: student.university_name || student.universityId?.name || "Unknown",
    campus: null,
    internship: training.title || "Unknown Training",
    department: student.major || "N/A",
    company: localStorage.getItem("name") || "Your Company",
    supervisor: "TBD",
    universityCoord: "TBD",
    startDate: training.startDate ? new Date(training.startDate).toLocaleDateString() : "TBD",
    endDate: "TBD",
    logbookComplete: type === "needsReport",
    weeks: [],
    status: app.status,
    reportData: app.reportData || null,
  };
};

/* ─────────────────────── Report Modal ─────────────────────── */
function ReportModal({ intern, onClose }) {
  const [hoursCompleted, setHoursCompleted] = useState(String(intern.totalHours || 160));
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [perfComments, setPerfComments] = useState("");
  const [otherComments, setOtherComments] = useState("");
  const [sending, setSending] = useState(false);

  const letterDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const uniDisplay = intern.campus ? `${intern.university} - ${intern.campus}` : intern.university;

  const handleSendReport = async () => {
    if (rating === 0) {
      alert("Please select a final rating");
      return;
    }
    setSending(true);
    try {
      await reportsApi.create({
        applicationId: intern.id,
        attendanceRate: 100,
        overallRating: rating,
        performanceSummary: perfComments,
        totalHours: Number(hoursCompleted) || 160,
        additionalFeedback: otherComments,
        reportStatus: "sent",
      });
      alert("Report sent to university successfully!");
      onClose();
    } catch (err) {
      alert("Failed to send report: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rpt-overlay" onClick={onClose}>
      <div className="rpt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rpt-head">
          <div className="rpt-head-left">
            <FaFileAlt className="rpt-head-icon" />
            <div>
              <h2 className="rpt-head-title">Final Training Report</h2>
              <p className="rpt-head-sub">
                Official university letter received — fill in the company evaluation below and send the complete report back.
              </p>
            </div>
          </div>
          <button className="rpt-close" onClick={onClose}>✕</button>
        </div>

        <div className="rpt-body">
          {/* ── University Letter ── */}
          <div className="rpt-letter">
            <div className="rpt-letter-header">
              <img src="/ptu-banner.png" alt="Palestine Technical University - Khadoorie" className="rpt-letter-banner" />
            </div>
            <div className="rpt-letter-date">{letterDate} &emsp; التاريخ :</div>
            <div className="rpt-letter-to">حضرة السادة : <strong>{intern.company}</strong>. المحترمين</div>
            <div className="rpt-letter-subject">
              <strong>الموضوع : التدريب الميداني</strong><br />
              <strong>تخصص : {intern.department}</strong>
            </div>
            <div className="rpt-letter-greeting">تحية طيبة وبعد...</div>
            <p className="rpt-letter-body">
              أرجو من حضرتكم التكرم بالسماح للطالب/ة <strong>{intern.name}</strong> بالتدرب في مؤسستكم الموقرة...
            </p>
            <p className="rpt-letter-body">
              يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق ومتابعة حضور الطالب المتدرب...
            </p>
            <div className="rpt-letter-closing">وتفضلوا بقبول فائق الاحترام..</div>
            <div className="rpt-letter-signature">
              <div>مسؤول التدريب : <strong>{intern.universityCoord}</strong></div>
              <div className="rpt-letter-sig-uni">{uniDisplay}</div>
            </div>
          </div>

          {/* ── Evaluation Form ── */}
          <div className="rpt-eval-header">
            <h3 className="rpt-eval-title">Final Training Report — Company Evaluation</h3>
            <p className="rpt-eval-sub">To be filled and sent back to the university</p>
          </div>

          <div className="rpt-form">
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">Student Name</label><div className="rpt-value">{intern.name}</div></div>
              <div className="rpt-field"><label className="rpt-label">University ID</label><div className="rpt-value">{intern.studentId}</div></div>
            </div>
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">University</label><div className="rpt-value">{uniDisplay}</div></div>
              <div className="rpt-field"><label className="rpt-label">Training Title</label><div className="rpt-value">{intern.internship}</div></div>
            </div>
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">Company</label><div className="rpt-value">{intern.company}</div></div>
              <div className="rpt-field"><label className="rpt-label">Training Supervisor</label><div className="rpt-value">{intern.supervisor}</div></div>
            </div>
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">Start Date</label><div className="rpt-value">{intern.startDate}</div></div>
              <div className="rpt-field"><label className="rpt-label">End Date</label><div className="rpt-value">{intern.endDate}</div></div>
            </div>
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Total Hours Completed</label>
                <input type="text" className="rpt-input" value={hoursCompleted} onChange={(e) => setHoursCompleted(e.target.value)} />
              </div>
              <div className="rpt-field"><label className="rpt-label">Total Days</label><div className="rpt-value">—</div></div>
            </div>
          </div>

          <div className="rpt-rating-section">
            <label className="rpt-label">Final Rating *</label>
            <div className="rpt-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={28}
                  className={`rpt-star ${star <= (hoverRating || rating) ? "rpt-star-filled" : "rpt-star-empty"}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>

          <div className="rpt-comment-section">
            <label className="rpt-label">Comments on Student's Performance *</label>
            <textarea className="rpt-textarea" placeholder="Strengths, areas of growth, technical skills, professionalism..." value={perfComments} onChange={(e) => setPerfComments(e.target.value)} rows={4} />
          </div>

          <div className="rpt-comment-section">
            <label className="rpt-label">Other Comments</label>
            <textarea className="rpt-textarea" placeholder="Any additional notes for the university..." value={otherComments} onChange={(e) => setOtherComments(e.target.value)} rows={3} />
          </div>
        </div>

        <div className="rpt-footer">
          <button className="rpt-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="rpt-btn-print" onClick={() => window.print()}><FaPrint size={12} /> Print</button>
          <button className="rpt-btn-send" onClick={handleSendReport} disabled={sending}>
            {sending ? "Sending..." : "✓ Save & Send to University"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Create Report Modal ─────────────────────── */
function CreateReportModal({ onClose }) {
  const [applicationId, setApplicationId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [university, setUniversity] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [company, setCompany] = useState(localStorage.getItem("name") || "");
  const [supervisor, setSupervisor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hoursCompleted, setHoursCompleted] = useState("160");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [perfComments, setPerfComments] = useState("");
  const [otherComments, setOtherComments] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!applicationId.trim()) {
      alert("Please enter Application ID");
      return;
    }
    if (rating === 0) {
      alert("Please select a final rating");
      return;
    }
    setLoading(true);
    try {
      await reportsApi.create({
        applicationId,
        attendanceRate: 100,
        overallRating: rating,
        performanceSummary: perfComments,
        totalHours: Number(hoursCompleted),
        additionalFeedback: otherComments,
        reportStatus: "sent",
      });
      alert("Report sent to university successfully!");
      onClose();
    } catch (err) {
      alert("Failed to send report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rpt-overlay" onClick={onClose}>
      <div className="rpt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rpt-head">
          <div className="rpt-head-left">
            <FaPlus className="rpt-head-icon" />
            <div>
              <h2 className="rpt-head-title">Create a New Final Report</h2>
              <p className="rpt-head-sub">Fill in the application ID and complete the evaluation form.</p>
            </div>
          </div>
          <button className="rpt-close" onClick={onClose}>✕</button>
        </div>

        <div className="rpt-body">
          <div className="cnr-lookup">
            <label className="rpt-label">Application ID *</label>
            <input type="text" className="rpt-input" placeholder="Enter application ID" value={applicationId} onChange={(e) => setApplicationId(e.target.value)} />
          </div>

          <div className="rpt-eval-header">
            <h3 className="rpt-eval-title">Final Training Evaluation Form</h3>
            <p className="rpt-eval-sub">Field Training Department — to be completed by the company</p>
          </div>

          <div className="rpt-form">
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">Student Name</label><input className="rpt-input" value={studentName} onChange={(e) => setStudentName(e.target.value)} /></div>
              <div className="rpt-field"><label className="rpt-label">University ID</label><input className="rpt-input" placeholder="Optional" /></div>
            </div>
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">University</label><input className="rpt-input" value={university} onChange={(e) => setUniversity(e.target.value)} /></div>
              <div className="rpt-field"><label className="rpt-label">Training Title</label><input className="rpt-input" value={trainingTitle} onChange={(e) => setTrainingTitle(e.target.value)} /></div>
            </div>
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">Company</label><input className="rpt-input" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
              <div className="rpt-field"><label className="rpt-label">Training Supervisor</label><input className="rpt-input" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} /></div>
            </div>
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">Start Date</label><input type="date" className="rpt-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div className="rpt-field"><label className="rpt-label">End Date</label><input type="date" className="rpt-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            </div>
            <div className="rpt-field-row">
              <div className="rpt-field"><label className="rpt-label">Total Hours Completed</label><input className="rpt-input" value={hoursCompleted} onChange={(e) => setHoursCompleted(e.target.value)} /></div>
            </div>
          </div>

          <div className="rpt-rating-section">
            <label className="rpt-label">Final Rating *</label>
            <div className="rpt-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={28} className={`rpt-star ${star <= (hoverRating || rating) ? "rpt-star-filled" : "rpt-star-empty"}`} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} />
              ))}
            </div>
          </div>

          <div className="rpt-comment-section">
            <label className="rpt-label">Comments on Student's Performance *</label>
            <textarea className="rpt-textarea" rows={4} value={perfComments} onChange={(e) => setPerfComments(e.target.value)} />
          </div>

          <div className="rpt-comment-section">
            <label className="rpt-label">Other Comments</label>
            <textarea className="rpt-textarea" rows={3} value={otherComments} onChange={(e) => setOtherComments(e.target.value)} />
          </div>
        </div>

        <div className="rpt-footer">
          <button className="rpt-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="rpt-btn-send" onClick={handleSend} disabled={loading}>{loading ? "Sending..." : "✓ Send to University"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Page ─────────────────────── */
export default function CompletionReports() {
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [ready, setReady] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await reportsApi.companyReports();
      console.log("🔍 Reports API Response:", response);
      
      const needsReport = (response.needsReport?.list || []).map(app => mapIntern(app, "needsReport"));
      const reportsReady = (response.reportsReady?.list || []).map(app => mapIntern(app, "reportsReady"));
      
      setReady(needsReport);
      setPending(reportsReady);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const buildMeta = (intern) => {
    const parts = [intern.studentId, intern.university];
    if (intern.campus) parts.push(intern.campus);
    parts.push(intern.internship);
    return parts.join(" · ");
  };

  if (loading) return <div className="cr-page">Loading reports...</div>;
  if (error) return <div className="cr-page">Error: {error}</div>;

  return (
    <div className="cr-page">
      <div className="cr-header">
        <div>
          <h1 className="cr-title">Final Training Reports</h1>
          <p className="cr-sub">Generate and send the official end-of-training report to each intern's university.</p>
        </div>
        <button className="cr-create-btn" onClick={() => setShowCreate(true)}><FaPlus size={12} /> Create New Report</button>
      </div>

      <div className="cr-section">
        <div className="cr-section-head">
          <FaCheckCircle className="cr-section-icon cr-icon-ready" />
          <div>
            <h2 className="cr-section-title">Ready for Report <span className="cr-count">({ready.length})</span></h2>
            <p className="cr-section-sub">Logbook complete — click a student to fill in and send the final report.</p>
          </div>
        </div>
        <div className="cr-list">
          {ready.map((intern) => (
            <div key={intern.id} className="cr-card" onClick={() => setSelected(intern)}>
              <div className="cr-avatar" style={{ background: intern.color }}>{intern.initials}</div>
              <div className="cr-card-info">
                <span className="cr-card-name">{intern.name}</span>
                <span className="cr-card-meta">{buildMeta(intern)}</span>
              </div>
              <div className="cr-card-right">
                <span className="cr-badge cr-badge-ready">Ready to Report</span>
                <FaChevronRight className="cr-chev" size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cr-section">
        <div className="cr-section-head">
          <FaExclamationCircle className="cr-section-icon cr-icon-pending" />
          <div>
            <h2 className="cr-section-title">Pending — Reports Ready <span className="cr-count">({pending.length})</span></h2>
            <p className="cr-section-sub">Reports have been sent to the university.</p>
          </div>
        </div>
        <div className="cr-list">
          {pending.map((intern) => (
            <div key={intern.id} className="cr-card cr-card-pending">
              <div className="cr-avatar" style={{ background: intern.color }}>{intern.initials}</div>
              <div className="cr-card-info">
                <span className="cr-card-name">{intern.name}</span>
                <span className="cr-card-meta">{buildMeta(intern)}</span>
              </div>
              <div className="cr-card-right">
                <span className="cr-badge cr-badge-pending">✓ Report Sent</span>
                <FaChevronRight className="cr-chev" size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <ReportModal intern={selected} onClose={() => setSelected(null)} />}
      {showCreate && <CreateReportModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}