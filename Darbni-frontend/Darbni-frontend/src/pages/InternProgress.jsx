import { useState } from "react";
import { FaChevronRight, FaChevronDown, FaCheck, FaRegCommentDots } from "react-icons/fa";

// Mock Data متطابقة مع هيكل الـ API
const MOCK_INTERNS = [
  {
    id: "1",
    name: "Sara Tomeh",
    initials: "ST",
    color: "#7c5cbf",
    department: "Data Science",
    pendingCount: 6,
    hoursCompleted: 120,
    targetHours: 200,
    weeks: [
      {
        id: "week1",
        label: "Week 1",
        dates: "Mar 3 - Mar 7",
        totalHours: 30,
        days: 5,
        status: "confirmed",
        entries: [
          { day: "Sunday", date: "Mar 3", task: "Data cleaning with Pandas", hours: 6, status: "confirmed", logId: "log1" },
          { day: "Monday", date: "Mar 4", task: "Explored datasets", hours: 6, status: "confirmed", logId: "log2" },
          { day: "Tuesday", date: "Mar 5", task: "Data visualization", hours: 6, status: "confirmed", logId: "log3" },
          { day: "Wednesday", date: "Mar 6", task: "Feature engineering", hours: 6, status: "confirmed", logId: "log4" },
          { day: "Thursday", date: "Mar 7", task: "Documentation", hours: 6, status: "confirmed", logId: "log5" },
        ],
      },
      {
        id: "week2",
        label: "Week 2",
        dates: "Mar 10 - Mar 14",
        totalHours: 28,
        days: 5,
        status: "confirmed",
        entries: [
          { day: "Sunday", date: "Mar 10", task: "SQL queries", hours: 6, status: "confirmed", logId: "log6" },
          { day: "Monday", date: "Mar 11", task: "Database design", hours: 6, status: "confirmed", logId: "log7" },
          { day: "Tuesday", date: "Mar 12", task: "API integration", hours: 5, status: "confirmed", logId: "log8" },
          { day: "Wednesday", date: "Mar 13", task: "Testing", hours: 5, status: "confirmed", logId: "log9" },
          { day: "Thursday", date: "Mar 14", task: "Report writing", hours: 6, status: "confirmed", logId: "log10" },
        ],
      },
      {
        id: "week3",
        label: "Week 3",
        dates: "Mar 17 - Mar 21",
        totalHours: 32,
        days: 5,
        status: "pending",
        entries: [
          { day: "Sunday", date: "Mar 17", task: "ML model planning", hours: 7, status: "pending", logId: "log11" },
          { day: "Monday", date: "Mar 18", task: "Data preprocessing for ML", hours: 7, status: "pending", logId: "log12" },
          { day: "Tuesday", date: "Mar 19", task: "Model training", hours: 6, status: "pending", logId: "log13" },
          { day: "Wednesday", date: "Mar 20", task: "Model evaluation", hours: 6, status: "pending", logId: "log14" },
          { day: "Thursday", date: "Mar 21", task: "Results documentation", hours: 6, status: "pending", logId: "log15" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Rami Khalil",
    initials: "RK",
    color: "#e67e22",
    department: "Web Development",
    pendingCount: 3,
    hoursCompleted: 80,
    targetHours: 200,
    weeks: [
      {
        id: "week1",
        label: "Week 1",
        dates: "Mar 3 - Mar 7",
        totalHours: 35,
        days: 5,
        status: "confirmed",
        entries: [
          { day: "Sunday", date: "Mar 3", task: "HTML/CSS review", hours: 7, status: "confirmed", logId: "log16" },
          { day: "Monday", date: "Mar 4", task: "JavaScript basics", hours: 7, status: "confirmed", logId: "log17" },
          { day: "Tuesday", date: "Mar 5", task: "React components", hours: 7, status: "confirmed", logId: "log18" },
          { day: "Wednesday", date: "Mar 6", task: "State management", hours: 7, status: "confirmed", logId: "log19" },
          { day: "Thursday", date: "Mar 7", task: "Routing setup", hours: 7, status: "confirmed", logId: "log20" },
        ],
      },
      {
        id: "week2",
        label: "Week 2",
        dates: "Mar 10 - Mar 14",
        totalHours: 30,
        days: 5,
        status: "pending",
        entries: [
          { day: "Sunday", date: "Mar 10", task: "API integration", hours: 6, status: "pending", logId: "log21" },
          { day: "Monday", date: "Mar 11", task: "Form validation", hours: 6, status: "pending", logId: "log22" },
          { day: "Tuesday", date: "Mar 12", task: "Authentication flow", hours: 6, status: "pending", logId: "log23" },
          { day: "Wednesday", date: "Mar 13", task: "Dashboard layout", hours: 6, status: "pending", logId: "log24" },
          { day: "Thursday", date: "Mar 14", task: "Code review", hours: 6, status: "pending", logId: "log25" },
        ],
      },
    ],
  },
];

// ========== Feedback Modal ==========
function FeedbackModal({ target, onClose, onConfirm }) {
  const [feedbackText, setFeedbackText] = useState("");

  if (!target) return null;

  return (
    <div className="ip-fb-overlay" onClick={onClose}>
      <div className="ip-fb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ip-fb-head">
          <h4 className="ip-fb-title">Provide Feedback</h4>
          <button className="ip-fb-x" onClick={onClose}>✕</button>
        </div>
        <textarea
          className="ip-fb-textarea"
          placeholder="Write your feedback or review..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows={5}
        />
        <div className="ip-fb-actions">
          <button className="ip-fb-cancel" onClick={onClose}>Cancel</button>
          <button
            className="ip-fb-send"
            onClick={() => {
              onConfirm(feedbackText);
              setFeedbackText("");
              onClose();
            }}
            disabled={!feedbackText.trim()}
          >
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Intern Modal ==========
function InternModal({ intern, onClose }) {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [weeks, setWeeks] = useState(intern.weeks);
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  const progress = Math.min(100, Math.round((intern.hoursCompleted / intern.targetHours) * 100));

  const handleConfirmEntry = (weekId, entryIdx, logId) => {
    setWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId
          ? {
              ...w,
              entries: w.entries.map((e, i) =>
                i === entryIdx ? { ...e, status: "confirmed" } : e
              ),
              status: w.entries.every((e, i) =>
                i === entryIdx ? true : e.status === "confirmed"
              )
                ? "confirmed"
                : w.status,
            }
          : w
      )
    );
    // TODO: استدعاء API التأكيد
    console.log("Confirmed log:", logId);
  };

  const handleSendFeedback = (weekId, entryIdx, logId, feedbackText) => {
    setWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId
          ? {
              ...w,
              entries: w.entries.map((e, i) =>
                i === entryIdx
                  ? { ...e, status: "confirmed_with_review", feedback: feedbackText }
                  : e
              ),
            }
          : w
      )
    );
    // TODO: استدعاء API الفيدباك
    console.log("Feedback sent for log:", logId, feedbackText);
  };

  return (
    <div className="ip-overlay" onClick={onClose}>
      <div className="ip-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ip-modal-head">
          <div className="ip-modal-who">
            <div className="ip-avatar" style={{ background: intern.color }}>
              {intern.initials}
            </div>
            <h3 className="ip-modal-name">{intern.name}</h3>
          </div>
          <button className="ip-modal-x" onClick={onClose}>✕</button>
        </div>

        {/* Stats */}
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

        {/* Progress bar */}
        <div className="ip-bar-wrap">
          <div className="ip-bar-bg">
            <div className="ip-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Weekly Schedule Log */}
        <h4 className="ip-log-title">Weekly Schedule Log</h4>

        <div className="ip-weeks">
          {weeks.map((week) => {
            const isOpen = expandedWeek === week.id;
            return (
              <div key={week.id} className="ip-week">
                <div
                  className="ip-week-head"
                  onClick={() => setExpandedWeek(isOpen ? null : week.id)}
                >
                  <div className="ip-week-left">
                    {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                    <div>
                      <span className="ip-week-label">{week.label}</span>
                      <span className="ip-week-dates">{week.dates}</span>
                    </div>
                  </div>
                  <div className="ip-week-right">
                    <span className="ip-week-hours">
                      {week.totalHours}h · {week.days} days
                    </span>
                    <span className={`ip-week-badge ip-week-badge-${week.status}`}>
                      {week.status === "confirmed" ? "✓" : "⊘"}{" "}
                      {week.status === "confirmed" ? "Confirmed" : "Pending"}
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
                                {entry.status === "confirmed"
                                  ? "Confirmed"
                                  : entry.status === "confirmed_with_review"
                                  ? "Reviewed"
                                  : "Pending"}
                              </span>
                            </td>
                            <td className="ip-td-actions">
                              {entry.status === "pending" && (
                                <>
                                  <button
                                    className="ip-confirm-btn"
                                    onClick={() =>
                                      handleConfirmEntry(week.id, idx, entry.logId)
                                    }
                                  >
                                    <FaCheck size={10} /> Confirm
                                  </button>
                                  <button
                                    className="ip-feedback-btn"
                                    onClick={() =>
                                      setFeedbackTarget({
                                        weekId: week.id,
                                        entryIdx: idx,
                                        logId: entry.logId,
                                      })
                                    }
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
                          <td colSpan="2">
                            <strong>Week Total</strong>
                          </td>
                          <td></td>
                          <td>
                            <strong>{week.totalHours}h</strong>
                          </td>
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

        {/* Feedback Modal */}
        <FeedbackModal
          target={feedbackTarget}
          onClose={() => setFeedbackTarget(null)}
          onConfirm={(feedbackText) => {
            if (feedbackTarget) {
              handleSendFeedback(
                feedbackTarget.weekId,
                feedbackTarget.entryIdx,
                feedbackTarget.logId,
                feedbackText
              );
            }
          }}
        />
      </div>
    </div>
  );
}

// ========== Main Page ==========
export default function InternProgress() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="ip-page">
      <div className="ip-header">
        <h1 className="ip-title">Intern Progress Monitoring</h1>
        <p className="ip-sub">
          Review daily logs and confirm or give feedback on intern progress.
        </p>
      </div>

      <div className="ip-list">
        {MOCK_INTERNS.map((intern) => {
          const pct = Math.min(100, Math.round((intern.hoursCompleted / intern.targetHours) * 100));
          return (
            <div
              key={intern.id}
              className="ip-card"
              onClick={() => setSelected(intern)}
            >
              <div className="ip-avatar" style={{ background: intern.color }}>
                {intern.initials}
              </div>
              <div className="ip-card-body">
                <div className="ip-card-top">
                  <span className="ip-card-name">{intern.name}</span>
                  <span className="ip-card-dept">· {intern.department} ·</span>
                  <span className="ip-pending-badge">{intern.pendingCount} pending</span>
                </div>
                <div className="ip-card-bar-row">
                  <div className="ip-card-bar-bg">
                    <div className="ip-card-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="ip-card-pct">⌐ {pct}%</span>
                </div>
                <span className="ip-card-hours">
                  ◎ {intern.hoursCompleted}/{intern.targetHours} hours
                </span>
              </div>
              <FaChevronRight className="ip-card-chev" size={14} />
            </div>
          );
        })}
      </div>

      {selected && (
        <InternModal intern={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}