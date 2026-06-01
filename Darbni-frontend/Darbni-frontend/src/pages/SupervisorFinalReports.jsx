import React, { useState, useEffect } from "react";
import { FaFileAlt, FaCheckCircle, FaChevronRight, FaStar, FaTimesCircle, FaRegClock, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { applicationApi, getToken } from "../api/client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ========== جلب السجلات ==========
const fetchLogsForApplication = async (applicationId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/logs/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error("Error fetching logs:", err);
    return null;
  }
};

// ========== قرار المشرف ==========
const submitDecision = async (reportId, decision, notes) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/supervisor-decision`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ decision, supervisorNotes: notes }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to submit decision");
  }
  return await response.json();
};

// ========== بناء الأسابيع من السجلات ==========
const buildWeeksFromLogs = (logs) => {
  if (!logs || logs.length === 0) return [];

  const weeksMap = new Map();
  let weekCounter = 0;

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  logs.forEach(log => {
    const date = new Date(log.log_date);
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;

    if (!weeksMap.has(weekKey)) {
      weekCounter++;
      weeksMap.set(weekKey, {
        id: weekKey,
        label: `Week ${weekCounter}`,
        dates: getWeekRange(date),
        totalHours: 0,
        days: 0,
        entries: [],
      });
    }

    const week = weeksMap.get(weekKey);
    week.totalHours += log.hours;
    week.days++;
    week.entries.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      task: log.tasks_completed,
      hours: `${log.hours}h`,
      eval: log.company_feedback || log.status || "—",
    });

    week.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  return Array.from(weeksMap.values());
};

// ========== Modal ==========
function FinalReportModal({ report, onClose, onDecisionSubmitted }) {
  const [decisionNotes, setDecisionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDecision = async (decision) => {
    if (decision === "failed" && !decisionNotes.trim()) {
      alert("Please enter notes when marking as failed");
      return;
    }
    setIsProcessing(true);
    try {
      await submitDecision(report.reportId, decision, decisionNotes);
      onDecisionSubmitted();
      onClose();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="sfr-overlay" onClick={onClose}>
      <div className="sfr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sfr-modal-close" onClick={onClose}>✕</button>

        <div className="sfr-head">
          <FaFileAlt className="sfr-head-icon" />
          <div>
            <h2 className="sfr-head-title">Final Training Report</h2>
            <p className="sfr-head-sub">Official university letter and the data filled by the company at the end of training.</p>
          </div>
        </div>

        <div className="sfr-body-wrap">
          {/* Official Letter */}
          <div className="sfr-letter">
            <div className="sfr-letter-banner">
              <img src="/ptu-banner.png" alt="University Banner" />
            </div>

            <div className="sfr-letter-date">{report.reportDate} : التاريخ</div>
            <div className="sfr-letter-to">حضرة السادة : <strong>{report.company}</strong>. المحترمين</div>

            <div className="sfr-letter-subject">
              <strong>الموضوع : التدريب الميداني</strong><br />
              <strong>تخصص : {report.department}</strong>
            </div>

            <div className="sfr-letter-greeting">تحية طيبة وبعد..</div>

            <p className="sfr-letter-p">
              أرجو من حضرتكم التكرم بالسماح للطالب/ة <strong>{report.name}</strong> بالتدرب في مؤسستكم الموقرة أيام الدوام الرسمي في المؤسسة بحيث ينهي الطالب (160) ساعة تدريبية حيث يكون دوام الطالب في مؤسستكم مثل دوام العاملين فيها ولا يحق له التغيب دون إذن رسمي، وسيقدم الطالب المتدرب تقريراً عما اكتسبه من مهارات للمحاضر المسؤول عنه في الجامعة في نهاية هذه الفترة.
            </p>
            <p className="sfr-letter-p">
              يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق ومتابعة حضور الطالب المتدرب من خلال نموذج الحضور والغياب المرفق وذلك بعد انتهاء فترة التدريب.
            </p>

            <div className="sfr-letter-closing">وتفضلوا بقبول فائق الاحترام..</div>

            <div className="sfr-letter-sig">
              <div>مسؤول التدريب : <strong>{report.uniCoord}</strong></div>
              <div className="sfr-letter-sig-uni">{report.university}</div>
            </div>
          </div>

          <div className="sfr-divider"></div>

          {/* Filled by Company */}
          <div className="sfr-comp-head">
            <h3 className="sfr-comp-title">Final Training Report — Filled by Company</h3>
            <p className="sfr-comp-sub">Submitted by {report.company}</p>
          </div>

          <h4 className="sfr-section-title">Report Information</h4>
          <div className="sfr-grid">
            <div className="sfr-field"><label>STUDENT NAME</label><div>{report.name}</div></div>
            <div className="sfr-field"><label>UNIVERSITY ID</label><div>{report.idNum}</div></div>
            <div className="sfr-field"><label>UNIVERSITY</label><div>{report.university}</div></div>
            <div className="sfr-field"><label>TRAINING TITLE</label><div>{report.trainingTitle}</div></div>
            <div className="sfr-field"><label>COMPANY</label><div>{report.company}</div></div>
            <div className="sfr-field"><label>TRAINING SUPERVISOR (COMPANY)</label><div>{report.supervisor}</div></div>
            <div className="sfr-field"><label>ATTENDANCE RATE</label><div>{report.attendanceRate}%</div></div>
            <div className="sfr-field"><label>TOTAL HOURS COMPLETED</label><div>{report.totalHours}h</div></div>
            <div className="sfr-field sfr-col-span-2">
              <label>FINAL RATING</label>
              <div className="sfr-stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <FaStar key={i} size={18} color={i <= report.rating ? "#7c5cbf" : "#e0e0e0"} />
                ))}
              </div>
            </div>
          </div>

          <h4 className="sfr-section-title" style={{ marginTop: 32 }}>Weekly Training Logbook</h4>
          <div className="sfr-table-wrap">
            <table className="sfr-table">
              <thead>
                <tr>
                  <th>Week</th><th>Day</th><th>Date</th>
                  <th>Tasks Completed</th><th>Hours</th><th>Company Evaluation</th>
                </tr>
              </thead>
              <tbody>
                {report.weeks.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: "center", color: "#aaa" }}>No logs available</td></tr>
                )}
                {report.weeks.map(week =>
                  week.entries.map((entry, idx) => (
                    <tr key={`${week.label}-${idx}`}>
                      {idx === 0 && <td rowSpan={week.entries.length} className="sfr-td-week"><strong>{week.label}</strong></td>}
                      <td>{entry.day}</td>
                      <td>{entry.date}</td>
                      <td className="sfr-td-task">{entry.task}</td>
                      <td><strong>{entry.hours}</strong></td>
                      <td><em>{entry.eval}</em></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h4 className="sfr-section-title" style={{ marginTop: 32 }}>Final Evaluation</h4>
          <div className="sfr-grid">
            <div className="sfr-field sfr-col-span-2">
              <label>COMMENTS ON STUDENT PERFORMANCE</label>
              <div className="sfr-comments-box">{report.perfComments || "—"}</div>
            </div>
            <div className="sfr-field sfr-col-span-2">
              <label>OTHER COMMENTS</label>
              <div className="sfr-comments-box">{report.otherComments || "—"}</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sfr-decision">
          <h4 className="sfr-dec-title">Your Decision</h4>
          <label className="sfr-dec-lbl">Reason / Notes (required if failing)</label>
          <textarea
            className="sfr-dec-textarea"
            placeholder="—"
            value={decisionNotes}
            onChange={(e) => setDecisionNotes(e.target.value)}
            disabled={isProcessing}
          />
          <div className="sfr-dec-actions">
            <button className="sfr-btn-close" onClick={onClose} disabled={isProcessing}>Close</button>
            <div className="sfr-dec-right">
              <button className="sfr-btn-fail" onClick={() => handleDecision("failed")} disabled={isProcessing}>
                {isProcessing ? <FaSpinner className="spinner" /> : <FaTimesCircle size={14} />} Mark as Failed
              </button>
              <button className="sfr-btn-pass" onClick={() => handleDecision("passed")} disabled={isProcessing}>
                {isProcessing ? <FaSpinner className="spinner" /> : <FaCheckCircle size={14} />} Mark as Passed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== الصفحة الرئيسية ==========
export default function SupervisorFinalReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      // ✅ جلب كل طلبات الجامعة المكتملة
      const response = await applicationApi.university();
      const allApplications = response.applications || [];

      // ✅ فقط الطلبات المكتملة
      const completed = allApplications.filter(app => app.status === "completed");

      // ✅ جلب logs لكل طالب
      const mapped = await Promise.all(completed.map(async (app) => {
        const student = app.studentId || {};
        const training = app.trainingId || {};
        const company = app.companyId || {};
        const university = app.universityId || {};

        const firstName = student.firstName || "";
        const lastName = student.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim() || "Unknown";
        const initials = firstName ? `${firstName[0]}${lastName?.[0] || ""}` : "??";

        // ✅ جلب الـ report الخاص بهاد الطلب
        let reportId = null, attendanceRate = 0, totalHours = 0;
        let rating = 0, perfComments = "", otherComments = "", reportDate = "";
        try {
          const token = getToken();
          const repRes = await fetch(`${API_BASE_URL}/reports/${app._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (repRes.ok) {
            const repData = await repRes.json();
            const rep = repData.report;
            if (rep) {
              reportId = rep._id;
              attendanceRate = rep.attendanceRate || 0;
              totalHours = rep.totalHours || 0;
              rating = rep.overallRating || 0;
              perfComments = rep.performanceSummary || "";
              otherComments = rep.additionalFeedback || "";
              reportDate = rep.report_date
                ? new Date(rep.report_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                : "";
            }
          }
        } catch (e) {
          console.error("Error fetching report:", e);
        }

        // ✅ جلب الـ logs
        const logsData = await fetchLogsForApplication(app._id);
        const weeks = logsData?.logs ? buildWeeksFromLogs(logsData.logs) : [];

        return {
          id: app._id,
          reportId,
          name: fullName,
          idNum: student.studentID || "N/A",
          initials,
          color: "#f0e6ff",
          textColor: "#7c5cbf",
          university: university.name || student.university_name || "N/A",
          trainingTitle: training.title || "N/A",
          department: student.major || "N/A",
          company: company.name || "N/A",
          supervisor: company.trainer?.firstName
            ? `${company.trainer.firstName} ${company.trainer.lastName || ""}`.trim()
            : "N/A",
          uniCoord: localStorage.getItem("firstName")
            ? `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName") || ""}`.trim()
            : "N/A",
          attendanceRate,
          totalHours,
          rating,
          perfComments,
          otherComments,
          reportDate,
          sentDate: reportDate,
          weeks,
        };
      }));

      setReports(mapped);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  if (loading) return (
    <div className="sfr-page">
      <div className="sfr-loading"><FaSpinner className="spinner" /><p>Loading reports...</p></div>
    </div>
  );

  if (error) return (
    <div className="sfr-page">
      <div className="sfr-error">
        <FaExclamationTriangle /><p>{error}</p>
        <button onClick={fetchReports}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="sfr-page">
      <div className="sfr-header">
        <h1 className="sfr-page-title">Final Reports</h1>
        <p className="sfr-page-sub">Review the official training report sent back by each company and decide if the student passed.</p>
      </div>

      <div className="sfr-list-container">
        <div className="sfr-list-header">
          <FaFileAlt color="#7c5cbf" /> <strong>Incoming Reports ({reports.length})</strong>
        </div>
        <p className="sfr-list-sub">Click a report to view the full official letter and submit your decision.</p>

        <div className="sfr-list">
          {reports.length === 0 && (
            <div className="sfr-empty">No completed reports found.</div>
          )}
          {reports.map((r) => (
            <div key={r.id} className="sfr-card" onClick={() => setSelectedReport(r)}>
              <div className="sfr-card-content">
                <div className="sfr-avatar" style={{ background: r.color, color: r.textColor }}>
                  {r.initials}
                </div>
                <div className="sfr-card-info">
                  <div className="sfr-card-row1">
                    <span className="sfr-cname">{r.name}</span>
                    <span className="sfr-cid">{r.idNum}</span>
                  </div>
                  <div className="sfr-card-row2">
                    <span className="sfr-cat">{r.company} - {r.trainingTitle}{r.sentDate ? ` - Sent ${r.sentDate}` : ""}</span>
                  </div>
                </div>
                <div className="sfr-card-right">
                  <div className="sfr-stars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <FaStar key={i} size={14} color={i <= r.rating ? "#7c5cbf" : "#e0e0e0"} />
                    ))}
                  </div>
                  <span className="sfr-cbadge-pending"><FaRegClock size={12} /> Pending Decision</span>
                  <FaChevronRight size={14} color="#aaa" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedReport && (
        <FinalReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onDecisionSubmitted={fetchReports}
        />
      )}
    </div>
  );
}