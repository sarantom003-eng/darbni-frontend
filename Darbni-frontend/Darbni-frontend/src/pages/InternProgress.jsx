import { useEffect, useState } from "react";
import { FaChevronRight, FaChevronDown, FaCheck, FaRegCommentDots } from "react-icons/fa";
import { applicationApi, notificationApi } from "../api/client";

// ✅ تحويل بيانات المتدرب من API إلى تنسيق الواجهة
const mapIntern = (app, logsData = null) => {
  const student = app.studentId || {};
  const training = app.trainingId || {};
  
  const firstName = student.firstName || "";
  const lastName = student.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown Student";
  
  // حساب الساعات المنجزة من logs
  let hoursCompleted = 0;
  let weeks = [];
  
  if (logsData && logsData.stats) {
    hoursCompleted = logsData.stats.confirmedHours || 0;
    weeks = buildWeeksFromLogs(logsData.logs || []);
  }
  
  // حساب عدد السجلات المعلقة
  const pendingCount = logsData?.stats?.pendingLogs || 0;
  
  return {
    id: app._id,
    applicationId: app._id,
    name: fullName,
    initials: firstName ? `${firstName[0]}${lastName?.[0] || ""}` : "??",
    color: ["#7c5cbf", "#e67e22", "#27ae60", "#e74c3c", "#3498db"][Math.floor(Math.random() * 5)],
    department: student.major || "N/A",
    pendingCount: pendingCount,
    hoursCompleted: hoursCompleted,
    targetHours: training.totalHours || 160,
    weeks: weeks,
    studentId: student,
    trainingId: training,
    companyId: app.companyId,
  };
};

// ✅ دوال مساعدة لتنسيق التواريخ
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

// ✅ تحويل الـ logs إلى هيكل أسابيع
const buildWeeksFromLogs = (logs) => {
  if (!logs || logs.length === 0) return [];
  
  const weeksMap = new Map();
  let weekCounter = 0;
  
  logs.forEach(log => {
    const date = new Date(log.log_date);
    const weekNumber = getWeekNumber(date);
    const weekKey = `${date.getFullYear()}-W${weekNumber}`;
    
    if (!weeksMap.has(weekKey)) {
      weekCounter++;
      weeksMap.set(weekKey, {
        id: weekKey,
        label: `Week ${weekCounter}`,
        dates: getWeekRange(date),
        totalHours: 0,
        days: 0,
        status: "pending",
        entries: [],
      });
    }
    
    const week = weeksMap.get(weekKey);
    week.totalHours += log.hours;
    week.days++;
    week.entries.push({
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      task: log.tasks_completed,
      hours: log.hours,
      status: log.status === "confirmed" ? "confirmed" : "pending",
      logId: log._id,
      feedback: log.company_feedback || "",
    });
    
    week.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    const allConfirmed = week.entries.every(e => e.status === "confirmed");
    week.status = allConfirmed ? "confirmed" : "pending";
  });
  
  return Array.from(weeksMap.values());
};

// ✅ جلب logs لطلب معين
const fetchLogsForApplication = async (applicationId) => {
  try {
    // ملاحظة: الـ endpoint متوقع يكون /logs/:applicationId
    // إذا مش موجود، ممكن تحتاجي تعدلي حسب الـ API الفعلي
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/logs/${applicationId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (err) {
    console.error("Error fetching logs:", err);
    return null;
  }
};

// ✅ تأكيد سجل (Company Review)
const confirmLog = async (logId, action, feedback = "") => {
  try {
    const body = feedback 
      ? { action: "feedback", company_feedback: feedback }
      : { action: "confirm" };
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/logs/${logId}/company-review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to confirm log");
    }
    
    return await response.json();
  } catch (err) {
    console.error("Error confirming log:", err);
    throw err;
  }
};

/* ── Modal ── */
function InternModal({ intern, onClose, onRefresh }) {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [weeks, setWeeks] = useState(intern.weeks || []);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const progress = Math.min(100, Math.round((intern.hoursCompleted / intern.targetHours) * 100));

  const handleConfirmEntry = async (weekId, entryIdx, logId) => {
    setProcessingId(logId);
    try {
      await confirmLog(logId, "confirm");
      // تحديث الـ UI محلياً
      setWeeks(prev =>
        prev.map(w =>
          w.id === weekId
            ? {
                ...w,
                entries: w.entries.map((e, i) =>
                  i === entryIdx ? { ...e, status: "confirmed" } : e
                ),
                status: w.entries.every((e, i) =>
                  i === entryIdx ? true : e.status === "confirmed"
                ) ? "confirmed" : w.status,
              }
            : w
        )
      );
      onRefresh();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackTarget) return;
    setProcessingId(feedbackTarget.logId);
    try {
      await confirmLog(feedbackTarget.logId, "feedback", feedbackText);
      setWeeks(prev =>
        prev.map(w =>
          w.id === feedbackTarget.weekId
            ? {
                ...w,
                entries: w.entries.map((e, i) =>
                  i === feedbackTarget.entryIdx 
                    ? { ...e, status: "confirmed_with_review", feedback: feedbackText } 
                    : e
                ),
              }
            : w
        )
      );
      setFeedbackTarget(null);
      setFeedbackText("");
      onRefresh();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="ip-overlay" onClick={onClose}>
      <div className="ip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ip-modal-head">
          <div className="ip-modal-who">
            <div className="ip-avatar" style={{ background: intern.color }}>{intern.initials}</div>
            <h3 className="ip-modal-name">{intern.name}</h3>
          </div>
          <button className="ip-modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="ip-stats">
          <div className="ip-stat">
            <span className="ip-stat-num">{intern.hoursCompleted}</span>
            <span className="ip-stat-label">Hours Completed</span>
          </div>
          <div className="ip-stat">
            <span className="ip-stat-num">{intern.targetHours}</span>
            <span className="ip-stat-label">Target Hours</span>
          </div>
          <div className="ip-stat ip-stat-highlight">
            <span className="ip-stat-num">{progress}%</span>
            <span className="ip-stat-label">Overall Progress</span>
          </div>
        </div>

        <div className="ip-bar-wrap">
          <div className="ip-bar-bg">
            <div className="ip-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h4 className="ip-log-title">Weekly Schedule Log</h4>

        <div className="ip-weeks">
          {weeks.length === 0 && (
            <div className="ip-empty-logs">No logs submitted yet.</div>
          )}
          {weeks.map((week) => {
            const isOpen = expandedWeek === week.id;
            return (
              <div key={week.id} className="ip-week">
                <div className="ip-week-head" onClick={() => setExpandedWeek(isOpen ? null : week.id)}>
                  <div className="ip-week-left">
                    {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                    <div>
                      <span className="ip-week-label">{week.label}</span>
                      <span className="ip-week-dates">{week.dates}</span>
                    </div>
                  </div>
                  <div className="ip-week-right">
                    <span className="ip-week-hours">{week.totalHours}h · {week.days} days</span>
                    <span className={`ip-week-badge ip-week-badge-${week.status}`}>
                      {week.status === "confirmed" ? "✓" : "⊘"} {week.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="ip-week-body">
                    <table className="ip-table">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Date</th>
                          <th>Tasks Completed</th>
                          <th>Hours</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {week.entries.map((entry, idx) => (
                          <tr key={idx}>
                            <td className="ip-td-day">{entry.day}</td>
                            <td>{entry.date}</td>
                            <td className="ip-td-task">
                              {entry.task}
                              {entry.feedback && (
                                <div className="ip-feedback-note">💬 {entry.feedback}</div>
                              )}
                            </td>
                            <td>{entry.hours}h</td>
                            <td>
                              <span className={`ip-entry-badge ip-entry-badge-${entry.status}`}>
                                {entry.status === "confirmed" ? "Confirmed" : 
                                 entry.status === "confirmed_with_review" ? "Reviewed" : "Pending"}
                              </span>
                            </td>
                            <td className="ip-td-actions">
                              {entry.status === "pending" && (
                                <>
                                  <button
                                    className="ip-confirm-btn"
                                    disabled={processingId === entry.logId}
                                    onClick={() => handleConfirmEntry(week.id, idx, entry.logId)}
                                  >
                                    <FaCheck size={10} /> {processingId === entry.logId ? "..." : "Confirm"}
                                  </button>
                                  <button
                                    className="ip-feedback-btn"
                                    onClick={() => setFeedbackTarget({ 
                                      logId: entry.logId, 
                                      entryIdx: idx, 
                                      weekId: week.id 
                                    })}
                                  >
                                    <FaRegCommentDots size={10} /> Feedback
                                  </button>
                                </>
                              )}
                              {entry.status === "confirmed_with_review" && (
                                <span className="ip-done-text">✓ Feedback Sent</span>
                              )}
                              {entry.status === "confirmed" && (
                                <span className="ip-done-text">✓</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2"><strong>Week Total</strong></td>
                          <td></td>
                          <td><strong>{week.totalHours}h</strong></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ip-modal-footer">
          <button className="ip-close-btn" onClick={onClose}>Close</button>
        </div>

        {feedbackTarget && (
          <div className="ip-fb-overlay" onClick={() => setFeedbackTarget(null)}>
            <div className="ip-fb-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ip-fb-head">
                <h4 className="ip-fb-title">Provide Feedback</h4>
                <button className="ip-fb-x" onClick={() => setFeedbackTarget(null)}>✕</button>
              </div>
              <textarea
                className="ip-fb-textarea"
                placeholder="Write your feedback or review..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={5}
              />
              <div className="ip-fb-actions">
                <button className="ip-fb-cancel" onClick={() => setFeedbackTarget(null)}>Cancel</button>
                <button className="ip-fb-send" onClick={handleSendFeedback} disabled={!feedbackText.trim()}>
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── الصفحة الرئيسية ── */
export default function InternProgress() {
  const [interns, setInterns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActiveInterns = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await applicationApi.company();
      
      // حسب الـ API، الـ pending هم اللي بانتظار موافقة الشركة (awaiting_company_approval)
      // الـ resolved هم اللي تمت الموافقة عليهم من الشركة
      // المتدربين النشطين هم اللي status = company_approved, in_training, company_final_approved
      const allApplications = [...(response.pending || []), ...(response.resolved || [])];
      
      const activeApps = allApplications.filter(app => 
        app.status === "company_approved" || 
        app.status === "in_training" || 
        app.status === "company_final_approved"
      );
      
      const mappedInterns = await Promise.all(
        activeApps.map(async (app) => {
          const logsData = await fetchLogsForApplication(app._id);
          return mapIntern(app, logsData);
        })
      );
      
      setInterns(mappedInterns);
    } catch (err) {
      setError(err.message || "Failed to load interns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveInterns();
  }, []);

  const refreshData = async () => {
    await loadActiveInterns();
    if (selected) {
      // Refresh current selected intern
      const updated = interns.find(i => i.id === selected.id);
      if (updated) setSelected(updated);
    }
  };

  return (
    <div className="ip-page">
      <div className="ip-header">
        <h1 className="ip-title">Intern Progress Monitoring</h1>
        <p className="ip-sub">Review daily logs and confirm or give feedback on intern progress.</p>
      </div>

      {error && (
        <div className="ip-error">
          <span>{error}</span>
          <button onClick={refreshData} className="ip-retry-btn">Retry</button>
        </div>
      )}

      {loading && (
        <div className="ip-loading">
          <div className="ip-spinner"></div>
          <p>Loading interns...</p>
        </div>
      )}

      {!loading && (
        <div className="ip-list">
          {interns.length === 0 && (
            <div className="ip-empty">No active interns at the moment.</div>
          )}
          {interns.map((intern) => {
            const pct = Math.min(100, Math.round((intern.hoursCompleted / intern.targetHours) * 100));
            return (
              <div key={intern.id} className="ip-card" onClick={() => setSelected(intern)}>
                <div className="ip-avatar" style={{ background: intern.color }}>
                  {intern.initials}
                </div>
                <div className="ip-card-body">
                  <div className="ip-card-top">
                    <span className="ip-card-name">{intern.name}</span>
                    <span className="ip-card-dept">· {intern.department} ·</span>
                    {intern.pendingCount > 0 && (
                      <span className="ip-pending-badge">{intern.pendingCount} pending</span>
                    )}
                  </div>
                  <div className="ip-card-bar-row">
                    <div className="ip-card-bar-bg">
                      <div className="ip-card-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="ip-card-pct">⌐ {pct}%</span>
                  </div>
                  <span className="ip-card-hours">◎ {intern.hoursCompleted}/{intern.targetHours} hours</span>
                </div>
                <FaChevronRight className="ip-card-chev" size={14} />
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <InternModal intern={selected} onClose={() => setSelected(null)} onRefresh={refreshData} />
      )}
    </div>
  );
}