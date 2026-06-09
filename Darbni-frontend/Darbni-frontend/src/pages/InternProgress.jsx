import { useEffect, useState } from "react";
import { FaCheck, FaChevronRight, FaChevronDown, FaRegCommentDots, FaSpinner } from "react-icons/fa";
import { applicationApi, api } from "../api/client";

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
    const date    = new Date(log.log_date);
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    if (!weeksMap.has(weekKey)) {
      weekCounter++;
      weeksMap.set(weekKey, {
        id:         weekKey,
        label:      `Week ${weekCounter}`,
        dates:      getWeekRange(date),
        totalHours: 0,
        days:       0,
        entries:    [],
      });
    }
    const week = weeksMap.get(weekKey);
    week.totalHours += log.hours;
    week.days++;
    week.entries.push({
      logId:    log._id,
      day:      date.toLocaleDateString("en-US", { weekday: "long" }),
      date:     date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      task:     log.tasks_completed,
      hours:    log.hours,
      status:   log.status,
      feedback: log.company_feedback || "",
    });
    week.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  return Array.from(weeksMap.values());
};

function FeedbackModal({ target, onClose, onConfirm }) {
  const [feedbackText, setFeedbackText] = useState("");
  if (!target) return null;
  return (
    <div className="ip-fb-overlay" onClick={onClose}>
      <div className="ip-fb-modal" onClick={e => e.stopPropagation()}>
        <div className="ip-fb-head">
          <h4 className="ip-fb-title">Provide Feedback</h4>
          <button className="ip-fb-x" onClick={onClose}>✕</button>
        </div>
        <textarea
          className="ip-fb-textarea"
          placeholder="Write your feedback..."
          value={feedbackText}
          onChange={e => setFeedbackText(e.target.value)}
          rows={5}
        />
        <div className="ip-fb-actions">
          <button className="ip-fb-cancel" onClick={onClose}>Cancel</button>
          <button
            className="ip-fb-send"
            onClick={() => { onConfirm(feedbackText); setFeedbackText(""); onClose(); }}
            disabled={!feedbackText.trim()}
          >
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

function InternModal({ intern, onClose }) {
  const [expandedWeek,   setExpandedWeek]   = useState(null);
  const [weeks,          setWeeks]          = useState(intern.weeks);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [processing,     setProcessing]     = useState(null);

  const progress = Math.min(100, Math.round((intern.hoursDone / intern.targetHours) * 100));

  // ✅ Confirm log — PATCH /logs/:id/company-review
  const handleConfirmEntry = async (logId, weekId, entryIdx) => {
    setProcessing(logId);
    try {
      await api(`/logs/${logId}/company-review`, {
        method: "PATCH",
        body: { action: "confirm" },
      });
      setWeeks(prev => prev.map(w =>
        w.id === weekId
          ? { ...w, entries: w.entries.map((e, i) => i === entryIdx ? { ...e, status: "confirmed" } : e) }
          : w
      ));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Feedback log — PATCH /logs/:id/company-review
  const handleSendFeedback = async (logId, weekId, entryIdx, feedbackText) => {
    setProcessing(logId);
    try {
      await api(`/logs/${logId}/company-review`, {
        method: "PATCH",
        body: { action: "feedback", company_feedback: feedbackText },
      });
      setWeeks(prev => prev.map(w =>
        w.id === weekId
          ? { ...w, entries: w.entries.map((e, i) => i === entryIdx ? { ...e, status: "confirmed_with_review", feedback: feedbackText } : e) }
          : w
      ));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="ip-overlay" onClick={onClose}>
      <div className="ip-modal" onClick={e => e.stopPropagation()}>
        <div className="ip-modal-head">
          <div className="ip-modal-who">
            <div className="ip-avatar" style={{ background: intern.color }}>{intern.initials}</div>
            <h3 className="ip-modal-name">{intern.name}</h3>
          </div>
          <button className="ip-modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="ip-stats">
          <div className="ip-stat">
            <span className="ip-stat-num">{intern.hoursDone}</span>
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
          {weeks.length === 0 && <div style={{ color: "#aaa", padding: 20 }}>No logs submitted yet.</div>}
          {weeks.map(week => {
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
                  </div>
                </div>

                {isOpen && (
                  <div className="ip-week-body">
                    <table className="ip-table">
                      <thead>
                        <tr>
                          <th>Day</th><th>Date</th><th>Tasks</th>
                          <th>Hours</th><th>Status</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {week.entries.map((entry, idx) => (
                          <tr key={idx}>
                            <td className="ip-td-day">{entry.day}</td>
                            <td>{entry.date}</td>
                            <td>
                              {entry.task}
                              {entry.feedback && (
                                <div className="ip-feedback-note">💬 {entry.feedback}</div>
                              )}
                            </td>
                            <td>{entry.hours}h</td>
                            <td>
                              <span className={`ip-entry-badge ip-entry-badge-${entry.status === "confirmed_with_review" ? "confirmed" : entry.status}`}>
                                {entry.status === "confirmed" ? "Confirmed" : entry.status === "confirmed_with_review" ? "Reviewed" : "Pending"}
                              </span>
                            </td>
                            <td className="ip-td-actions">
                              {entry.status === "pending" && (
                                <>
                                  <button
                                    className="ip-confirm-btn"
                                    disabled={processing === entry.logId}
                                    onClick={() => handleConfirmEntry(entry.logId, week.id, idx)}
                                  >
                                    {processing === entry.logId ? <FaSpinner className="spinner" /> : <><FaCheck size={10} /> Confirm</>}
                                  </button>
                                  <button
                                    className="ip-feedback-btn"
                                    disabled={processing === entry.logId}
                                    onClick={() => setFeedbackTarget({ logId: entry.logId, weekId: week.id, entryIdx: idx })}
                                  >
                                    <FaRegCommentDots size={10} /> Feedback
                                  </button>
                                </>
                              )}
                              {entry.status === "confirmed_with_review" && <span className="ip-done-text">✓ Reviewed</span>}
                              {entry.status === "confirmed" && <span className="ip-done-text">✓</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2"><strong>Week Total</strong></td>
                          <td></td>
                          <td><strong>{week.totalHours}h</strong></td>
                          <td></td><td></td>
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

        <FeedbackModal
          target={feedbackTarget}
          onClose={() => setFeedbackTarget(null)}
          onConfirm={(text) => {
            if (feedbackTarget) {
              handleSendFeedback(feedbackTarget.logId, feedbackTarget.weekId, feedbackTarget.entryIdx, text);
            }
          }}
        />
      </div>
    </div>
  );
}

export default function InternProgress() {
  const [interns,  setInterns]  = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await applicationApi.company();

        // ✅ in_training فقط
        const active = [
          ...(response.pending  || []),
          ...(response.resolved || []),
        ].filter(app => app.status === "in_training");

        const mapped = await Promise.all(active.map(async (app) => {
          const student  = app.studentId  || {};
          const training = app.trainingId || {};
          const firstName = student.firstName || "";
          const lastName  = student.lastName  || "";
          const fullName  = `${firstName} ${lastName}`.trim() || "Unknown";
          const initials  = firstName ? `${firstName[0]}${lastName?.[0] || ""}`.toUpperCase() : "??";

          let hoursDone = 0, targetHours = 160, weeks = [];
          try {
            const logsData = await api(`/logs/${app._id}`);
            if (logsData?.stats) {
              hoursDone   = logsData.stats.confirmedHours || 0;
              targetHours = logsData.stats.requiredHours  || training.totalHours || 160;
            }
            weeks = buildWeeksFromLogs(logsData?.logs || []);
          } catch (e) {
            targetHours = training.totalHours || 160;
          }

          return {
            id:          app._id,
            name:        fullName,
            initials,
            color:       ["#7c5cbf","#e67e22","#27ae60","#e74c3c","#3498db"][firstName.charCodeAt(0) % 5 || 0],
            department:  student.major || "N/A",
            hoursDone,
            targetHours,
            weeks,
          };
        }));

        setInterns(mapped);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="ip-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <FaSpinner className="spinner" />
    </div>
  );

  if (error) return (
    <div className="ip-page">
      <div style={{ color: "#e74c3c", padding: 20 }}>{error}</div>
    </div>
  );

  return (
    <div className="ip-page">
      <div className="ip-header">
        <h1 className="ip-title">Intern Progress Monitoring</h1>
        <p className="ip-sub">Review daily logs and confirm or give feedback on intern progress.</p>
      </div>

      <div className="ip-list">
        {interns.length === 0 && <div className="ip-empty" style={{ color: "#aaa", padding: 40 }}>No active interns.</div>}
        {interns.map(intern => {
          const pct = Math.min(100, Math.round((intern.hoursDone / intern.targetHours) * 100));
          return (
            <div key={intern.id} className="ip-card" onClick={() => setSelected(intern)}>
              <div className="ip-avatar" style={{ background: intern.color }}>{intern.initials}</div>
              <div className="ip-card-body">
                <div className="ip-card-top">
                  <span className="ip-card-name">{intern.name}</span>
                  <span className="ip-card-dept">· {intern.department}</span>
                </div>
                <div className="ip-card-bar-row">
                  <div className="ip-card-bar-bg">
                    <div className="ip-card-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="ip-card-pct">{pct}%</span>
                </div>
                <span className="ip-card-hours">{intern.hoursDone}/{intern.targetHours} hours</span>
              </div>
              <FaChevronRight className="ip-card-chev" size={14} />
            </div>
          );
        })}
      </div>

      {selected && <InternModal intern={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}