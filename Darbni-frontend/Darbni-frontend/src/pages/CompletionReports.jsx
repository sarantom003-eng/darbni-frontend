import { useState } from "react";
import {
  FaCheckCircle, FaExclamationCircle, FaChevronRight,
  FaPlus, FaFileAlt, FaStar, FaPrint,
} from "react-icons/fa";

/* ─────────────────────── Mock Data ─────────────────────── */
const MOCK_INTERNS = [
  {
    id: 1,
    name: "Sara Tomeh",
    initials: "ST",
    color: "#7c5cbf",
    studentId: "20210289",
    university: "Palestine Technical University",
    campus: "Khadoorie",
    internship: "Data Science Internship",
    department: "Data Science",
    company: "DataVision Co.",
    supervisor: "Eng. Rami Khalil",
    universityCoord: "Dr. Samira Khalid",
    startDate: "2026-03-03",
    endDate: "2026-04-30",
    logbookComplete: true,
    weeks: [
      {
        label: "Week 1",
        entries: [
          { day: "Sun", date: "Mar 3", task: "Data cleaning with Pandas", hours: 6, evaluation: "Excellent" },
          { day: "Mon", date: "Mar 4", task: "Explored datasets", hours: 6, evaluation: "Excellent" },
          { day: "Tue", date: "Mar 5", task: "Data visualization", hours: 6, evaluation: "Good — improve chart titles" },
          { day: "Wed", date: "Mar 6", task: "Feature engineering", hours: 6, evaluation: "Excellent" },
          { day: "Thu", date: "Mar 7", task: "Documentation", hours: 6, evaluation: "Very good" },
        ],
      },
      {
        label: "Week 2",
        entries: [
          { day: "Sun", date: "Mar 10", task: "EDA on customer dataset", hours: 6, evaluation: "Excellent" },
          { day: "Mon", date: "Mar 11", task: "Statistical tests", hours: 7, evaluation: "Excellent" },
          { day: "Tue", date: "Mar 12", task: "Built first regression model", hours: 7, evaluation: "Excellent" },
          { day: "Wed", date: "Mar 13", task: "Model tuning", hours: 6, evaluation: "Try cross-validation" },
          { day: "Thu", date: "Mar 14", task: "Sprint demo", hours: 5, evaluation: "Very good presentation" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Rami Khalil",
    initials: "RK",
    color: "#e67e22",
    studentId: "20230222",
    university: "An-Najah National University",
    campus: null,
    internship: "Web Development Internship",
    department: "Web Development",
    company: "TechBridge Ltd.",
    supervisor: "Eng. Ahmad Saleh",
    universityCoord: "Dr. Nadia Farhat",
    startDate: "2026-03-03",
    endDate: "2026-04-30",
    logbookComplete: true,
    weeks: [
      {
        label: "Week 1",
        entries: [
          { day: "Sun", date: "Mar 3", task: "HTML/CSS review", hours: 7, evaluation: "Excellent" },
          { day: "Mon", date: "Mar 4", task: "JavaScript basics", hours: 7, evaluation: "Excellent" },
          { day: "Tue", date: "Mar 5", task: "React components", hours: 7, evaluation: "Very good" },
          { day: "Wed", date: "Mar 6", task: "State management", hours: 7, evaluation: "Excellent" },
          { day: "Thu", date: "Mar 7", task: "Routing setup", hours: 7, evaluation: "Good" },
        ],
      },
      {
        label: "Week 2",
        entries: [
          { day: "Sun", date: "Mar 10", task: "API integration", hours: 6, evaluation: "Excellent" },
          { day: "Mon", date: "Mar 11", task: "Form validation", hours: 6, evaluation: "Very good" },
          { day: "Tue", date: "Mar 12", task: "Authentication flow", hours: 6, evaluation: "Excellent" },
          { day: "Wed", date: "Mar 13", task: "Dashboard layout", hours: 6, evaluation: "Excellent" },
          { day: "Thu", date: "Mar 14", task: "Code review", hours: 6, evaluation: "Very good" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Layla Haddad",
    initials: "LH",
    color: "#c0a26a",
    studentId: "20230019",
    university: "Palestine Technical University",
    campus: "Khadoorie",
    internship: "Software Engineering Internship",
    department: "Software Engineering",
    company: "DataVision Co.",
    supervisor: "Eng. Rami Khalil",
    universityCoord: "Dr. Samira Khalid",
    startDate: "2026-03-03",
    endDate: "2026-04-30",
    logbookComplete: false,
    weeks: [],
  },
];

/* ─────────────────────── Report Modal ─────────────────────── */
function ReportModal({ intern, onClose }) {
  const allEntries = intern.weeks.flatMap((w) =>
    w.entries.map((e) => ({ ...e, week: w.label }))
  );
  const totalHours = allEntries.reduce((s, e) => s + e.hours, 0);
  const totalDays = allEntries.length;

  const [hoursCompleted, setHoursCompleted] = useState(String(totalHours));
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [perfComments, setPerfComments] = useState("");
  const [otherComments, setOtherComments] = useState("");

  const uniDisplay = intern.campus
    ? `${intern.university} - ${intern.campus}`
    : intern.university;

  const letterDate = "March 1, 2026";

  return (
    <div className="rpt-overlay" onClick={onClose}>
      <div className="rpt-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Modal Header ── */}
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

        {/* ── Scrollable Body ── */}
        <div className="rpt-body">
          {/* ── University Letter ── */}
          <div className="rpt-letter">
            <div className="rpt-letter-header">
              <img src="/ptu-banner.png" alt="Palestine Technical University - Khadoorie" className="rpt-letter-banner" />
            </div>

            <div className="rpt-letter-date">{letterDate} &emsp; التاريخ :</div>

            <div className="rpt-letter-to">حضرة السادة : <strong>{intern.company}</strong>. المحترمين</div>

            <div className="rpt-letter-subject">
              <strong>الموضوع : التدريب الميداني</strong>
              <br />
              <strong>تخصص : {intern.department}</strong>
            </div>

            <div className="rpt-letter-greeting">تحية طيبة وبعد...</div>

            <p className="rpt-letter-body">
              أرجو من حضرتكم التكرم بالسماح للطالب/ة <strong>{intern.name}</strong> بالتدرب في مؤسستكم الموقرة أيام الدوام الرسمي في المؤسسة بحيث ينهي الطالب (160) ساعة تدريبية حيث يكون دوام الطالب في مؤسستكم مثل دوام العاملين فيها ولا يحق له التغيب دون إذن رسمي، وسيقدم الطالب المتدرب تقريراً عما اكتسبه من مهارات للمحاضر المسؤول عنه في الجامعة في نهاية هذه الفترة.
            </p>
            <p className="rpt-letter-body">
              يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق ومتابعة حضور الطالب المتدرب من خلال نموذج الحضور والغياب المرفق وذلك بعد انتهاء فترة التدريب.
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
            {/* Row 1 */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Student Name</label>
                <div className="rpt-value">{intern.name}</div>
              </div>
              <div className="rpt-field">
                <label className="rpt-label">University ID</label>
                <div className="rpt-value">{intern.studentId}</div>
              </div>
            </div>
            {/* Row 2 */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">University</label>
                <div className="rpt-value">{uniDisplay}</div>
              </div>
              <div className="rpt-field">
                <label className="rpt-label">Training Title</label>
                <div className="rpt-value">{intern.internship}</div>
              </div>
            </div>
            {/* Row 3 */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Company</label>
                <div className="rpt-value">{intern.company}</div>
              </div>
              <div className="rpt-field">
                <label className="rpt-label">Training Supervisor</label>
                <div className="rpt-value">{intern.supervisor}</div>
              </div>
            </div>
            {/* Row 4 */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Start Date</label>
                <div className="rpt-value">{intern.startDate}</div>
              </div>
              <div className="rpt-field">
                <label className="rpt-label">End Date</label>
                <div className="rpt-value">{intern.endDate}</div>
              </div>
            </div>
            {/* Row 5 - editable */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Total Hours Completed</label>
                <input
                  type="text"
                  className="rpt-input"
                  value={hoursCompleted}
                  onChange={(e) => setHoursCompleted(e.target.value)}
                />
              </div>
              <div className="rpt-field">
                <label className="rpt-label">Total Days</label>
                <div className="rpt-value">{totalDays}</div>
              </div>
            </div>
          </div>

          {/* ── Logbook Table ── */}
          <h4 className="rpt-logbook-title">Logbook & Daily Evaluation</h4>
          <div className="rpt-table-wrap">
            <table className="rpt-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Task</th>
                  <th>Hours</th>
                  <th>Company Evaluation</th>
                </tr>
              </thead>
              <tbody>
                {intern.weeks.map((week) =>
                  week.entries.map((entry, idx) => (
                    <tr key={`${week.label}-${idx}`}>
                      {idx === 0 ? (
                        <td className="rpt-td-week" rowSpan={week.entries.length}>
                          {week.label}
                        </td>
                      ) : null}
                      <td className="rpt-td-day">{entry.day}</td>
                      <td>{entry.date}</td>
                      <td>{entry.task}</td>
                      <td className="rpt-td-hours">{entry.hours}</td>
                      <td className="rpt-td-eval">{entry.evaluation}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Star Rating ── */}
          <div className="rpt-rating-section">
            <label className="rpt-label">Final Rating *</label>
            <div className="rpt-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={28}
                  className={`rpt-star ${
                    star <= (hoverRating || rating) ? "rpt-star-filled" : "rpt-star-empty"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>

          {/* ── Comments ── */}
          <div className="rpt-comment-section">
            <label className="rpt-label">Comments on Student's Performance *</label>
            <textarea
              className="rpt-textarea"
              placeholder="Strengths, areas of growth, technical skills, professionalism..."
              value={perfComments}
              onChange={(e) => setPerfComments(e.target.value)}
              rows={4}
            />
          </div>

          <div className="rpt-comment-section">
            <label className="rpt-label">Other Comments</label>
            <textarea
              className="rpt-textarea"
              placeholder="Any additional notes for the university..."
              value={otherComments}
              onChange={(e) => setOtherComments(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="rpt-footer">
          <button className="rpt-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="rpt-btn-print" onClick={() => window.print()}>
            <FaPrint size={12} /> Print
          </button>
          <button className="rpt-btn-send" onClick={onClose}>
            ✓ Save & Send to University
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Create Report Modal ─────────────────────── */
function CreateReportModal({ onClose }) {
  const validIds = MOCK_INTERNS.map((i) => i.studentId);
  const [uniId, setUniId] = useState("");
  const [matched, setMatched] = useState(null);

  // Form state
  const [studentName, setStudentName] = useState("");
  const [university, setUniversity] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [company, setCompany] = useState("DataVision Co.");
  const [supervisor, setSupervisor] = useState("Eng. ");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetHours, setTargetHours] = useState("160 hours");
  const [hoursCompleted, setHoursCompleted] = useState("160h");
  const [totalDays, setTotalDays] = useState("20");
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);
  const [perfComments, setPerfComments] = useState("");
  const [otherComments, setOtherComments] = useState("");

  const handleLookup = () => {
    const found = MOCK_INTERNS.find((i) => i.studentId === uniId.trim());
    if (found) {
      setMatched(found);
      setStudentName(found.name);
      const uniDisp = found.campus ? `${found.university} - ${found.campus}` : found.university;
      setUniversity(uniDisp);
      setTrainingTitle(found.internship);
      setCompany(found.company);
      setSupervisor(found.supervisor);
    }
  };

  const uniDisplay = matched
    ? (matched.campus ? `${matched.university} - ${matched.campus}` : matched.university)
    : "—";
  const dept = matched ? matched.department : "—";
  const coord = matched ? matched.universityCoord : "—";
  const companyName = matched ? matched.company : "—";

  return (
    <div className="rpt-overlay" onClick={onClose}>
      <div className="rpt-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="rpt-head">
          <div className="rpt-head-left">
            <FaPlus className="rpt-head-icon" />
            <div>
              <h2 className="rpt-head-title">Create a New Final Report</h2>
              <p className="rpt-head-sub">
                Step 1 — Enter the student's University ID. The system will auto-fill the official letter the university already sent. Step 2 — Fill the Final Training Evaluation Form below.
              </p>
            </div>
          </div>
          <button className="rpt-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="rpt-body">
          {/* University ID lookup */}
          <div className="cnr-lookup">
            <label className="rpt-label">University ID *</label>
            <div className="cnr-lookup-row">
              <input
                type="text"
                className="rpt-input"
                placeholder="e.g. 20210289"
                value={uniId}
                onChange={(e) => setUniId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
              <button className="cnr-lookup-btn" onClick={handleLookup}>
                Type a University ID to auto-fill
              </button>
            </div>
            <div className="cnr-hint">Try one of: {validIds.join(", ")}</div>
          </div>

          {/* University Letter (read-only) */}
          <div className="rpt-letter">
            <div className="rpt-letter-header">
              <img src="/ptu-banner.png" alt="Palestine Technical University - Khadoorie" className="rpt-letter-banner" />
            </div>
            <div className="rpt-letter-note">Part 1 — Official letter from the university (auto-filled, read-only)</div>

            <div className="rpt-letter-to">حضرة السادة : <strong>{companyName}</strong>. المحترمين</div>
            <div className="rpt-letter-date">— &emsp; التاريخ :</div>

            <div className="rpt-letter-subject">
              <strong>الموضوع : التدريب الميداني</strong><br />
              <strong>تخصص : {dept}</strong>
            </div>

            <div className="rpt-letter-greeting">تحية طيبة وبعد...</div>

            <p className="rpt-letter-body">
              أرجو من حضرتكم التكرم بالسماح للطالب/ة <strong>{matched ? matched.name : "—"}</strong> بالتدرب في مؤسستكم الموقرة أيام الدوام الرسمي في المؤسسة بحيث ينهي الطالب (160) ساعة تدريبية حيث يكون دوام الطالب في مؤسستكم مثل دوام العاملين فيها ولا يحق له التغيب دون إذن رسمي، وسيقدم الطالب المتدرب تقريراً عما اكتسبه من مهارات للمحاضر المسؤول عنه في الجامعة في نهاية هذه الفترة.
            </p>
            <p className="rpt-letter-body">
              يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق ومتابعة حضور الطالب المتدرب من خلال نموذج الحضور والغياب المرفق وذلك بعد انتهاء فترة التدريب.
            </p>

            <div className="rpt-letter-closing">وتفضلوا بقبول فائق الاحترام..</div>
            <div className="rpt-letter-signature">
              <div>مسؤول التدريب : <strong>{coord}</strong></div>
              <div className="rpt-letter-sig-uni">{uniDisplay}</div>
            </div>
          </div>

          {/* Evaluation Form Header */}
          <div className="rpt-eval-header">
            <h3 className="rpt-eval-title">Final Training Evaluation Form</h3>
            <p className="rpt-eval-sub">Field Training Department — to be completed by the company at the end of training</p>
          </div>

          <h4 className="rpt-logbook-title" style={{ marginBottom: 16 }}>Report Information</h4>

          <div className="rpt-form">
            {/* Row 1 */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Student Name</label>
                <input type="text" className="rpt-input-line" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
              </div>
              <div className="rpt-field">
                <label className="rpt-label">University ID</label>
                <input type="text" className="rpt-input-line" value={uniId} onChange={(e) => setUniId(e.target.value)} />
              </div>
            </div>
            {/* Row 2 */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">University</label>
                <input type="text" className="rpt-input-line" value={university} onChange={(e) => setUniversity(e.target.value)} />
              </div>
              <div className="rpt-field">
                <label className="rpt-label">Training Title</label>
                <input type="text" className="rpt-input-line" value={trainingTitle} onChange={(e) => setTrainingTitle(e.target.value)} />
              </div>
            </div>
            {/* Row 3 */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Company</label>
                <input type="text" className="rpt-input-line" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="rpt-field">
                <label className="rpt-label">Training Supervisor (Company)</label>
                <input type="text" className="rpt-input-line" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} />
              </div>
            </div>
            {/* Row 4 - dates */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Start Date</label>
                <input type="date" className="rpt-input-line" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="rpt-field">
                <label className="rpt-label">End Date</label>
                <input type="date" className="rpt-input-line" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            {/* Row 5 */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Target Hours</label>
                <input type="text" className="rpt-input-line" value={targetHours} onChange={(e) => setTargetHours(e.target.value)} />
              </div>
              <div className="rpt-field">
                <label className="rpt-label">Total Hours Completed</label>
                <input type="text" className="rpt-input-line" value={hoursCompleted} onChange={(e) => setHoursCompleted(e.target.value)} />
              </div>
            </div>
            {/* Row 6 - single */}
            <div className="rpt-field-row">
              <div className="rpt-field">
                <label className="rpt-label">Total Days</label>
                <input type="text" className="rpt-input-line" value={totalDays} onChange={(e) => setTotalDays(e.target.value)} />
              </div>
              <div className="rpt-field"></div>
            </div>
          </div>

          {/* Final Evaluation */}
          <h4 className="rpt-logbook-title" style={{ marginTop: 8 }}>Final Evaluation</h4>

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

        {/* Footer */}
        <div className="rpt-footer">
          <button className="rpt-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="rpt-btn-send" onClick={onClose}>✓ Send to University</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Page ─────────────────────── */
export default function CompletionReports() {
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const ready   = MOCK_INTERNS.filter((i) => i.logbookComplete);
  const pending = MOCK_INTERNS.filter((i) => !i.logbookComplete);

  const buildMeta = (intern) => {
    const parts = [intern.studentId, intern.university];
    if (intern.campus) parts.push(intern.campus);
    parts.push(intern.internship);
    return parts.join(" · ");
  };

  return (
    <div className="cr-page">
      {/* Header row */}
      <div className="cr-header">
        <div>
          <h1 className="cr-title">Final Training Reports</h1>
          <p className="cr-sub">
            Generate and send the official end-of-training report to each intern's university.
          </p>
        </div>
        <button className="cr-create-btn" onClick={() => setShowCreate(true)}>
          <FaPlus size={12} /> Create New Report
        </button>
      </div>

      {/* ── Ready for Report ── */}
      <div className="cr-section">
        <div className="cr-section-head">
          <FaCheckCircle className="cr-section-icon cr-icon-ready" />
          <div>
            <h2 className="cr-section-title">
              Ready for Report <span className="cr-count">({ready.length})</span>
            </h2>
            <p className="cr-section-sub">
              Logbook complete — click a student to fill in and send the final report.
            </p>
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

      {/* ── Pending — Logbook Incomplete ── */}
      <div className="cr-section">
        <div className="cr-section-head">
          <FaExclamationCircle className="cr-section-icon cr-icon-pending" />
          <div>
            <h2 className="cr-section-title">
              Pending — Logbook Incomplete <span className="cr-count">({pending.length})</span>
            </h2>
            <p className="cr-section-sub">
              Reports cannot be created until every day is confirmed in the logbook.
            </p>
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
                <span className="cr-badge cr-badge-pending">⊘ Awaiting Logbook</span>
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
