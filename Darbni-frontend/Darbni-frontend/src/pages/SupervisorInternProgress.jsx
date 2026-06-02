import React, { useState, useEffect } from "react";
import {
  FaUserFriends, FaRegClock, FaCheckCircle,
  FaChevronRight, FaChevronDown, FaRegCommentDots, FaSpinner
} from "react-icons/fa";
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
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      task: log.tasks_completed,
      hours: log.hours,
      status: log.status,
      feedback: log.company_feedback || "",
    });

    week.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  return Array.from(weeksMap.values());
};

// ========== Modal ==========
function InternModal({ intern, onClose }) {
  const [expandedWeek, setExpandedWeek] = useState(intern.weeks?.[0]?.id || null);
  const progress = intern.targetHours > 0 ? Math.round((intern.hoursDone / intern.targetHours) * 100) : 0;

  return (
    <div className="sip-overlay" onClick={onClose}>
      <div className="sip-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sip-modal-close" onClick={onClose}>✕</button>

        <div className="sip-modal-header">
          <div className="sip-avatar-large" style={{ background: intern.color, color: intern.textColor }}>
            {intern.initials}
          </div>
          <div className="sip-modal-title-wrap">
            <h3 className="sip-modal-name">{intern.name}</h3>
            <p className="sip-modal-dept">{intern.company} - {intern.department}</p>
          </div>
        </div>

        <div className="sip-modal-stats">
          <div className="sip-mstat"><span className="sip-mstat-num">{intern.hoursDone}</span><span className="sip-mstat-lbl">Hours Done</span></div>
          <div className="sip-mstat"><span className="sip-mstat-num">{intern.targetHours}</span><span className="sip-mstat-lbl">Target</span></div>
          <div className="sip-mstat"><span className="sip-mstat-num">{progress}%</span><span className="sip-mstat-lbl">Progress</span></div>
        </div>

        <div className="sip-modal-bar-wrap">
          <div className="sip-modal-bar-bg">
            <div className="sip-modal-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h4 className="sip-modal-log-title">Weekly Schedule Log</h4>

        <div className="sip-weeks">
          {intern.weeks.length === 0 && <div className="sip-no-weeks">No logs submitted yet.</div>}
          {intern.weeks.map(week => {
            const isOpen = expandedWeek === week.id;
            return (
              <div key={week.id} className="sip-week-card">
                <div className="sip-week-head" onClick={() => setExpandedWeek(isOpen ? null : week.id)}>
                  <div className="sip-week-hleft">
                    {isOpen ? <FaChevronDown size={10} color="#888" /> : <FaChevronRight size={10} color="#888" />}
                    <span className="sip-week-lbl">{week.label}</span>
                    <span className="sip-week-dates">{week.dates}</span>
                  </div>
                  <div className="sip-week-hright">
                    <span className="sip-week-hours">{week.totalHours}h - {week.days} days</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="sip-week-body">
                    <table className="sip-table">
                      <thead>
                        <tr><th>Day</th><th>Date</th><th>Tasks Completed</th><th>Hours</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {week.entries.map((entry, idx) => (
                          <tr key={idx}>
                            <td className="sip-td-day">{entry.day}</td>
                            <td className="sip-td-date">{entry.date}</td>
                            <td className="sip-td-task">
                              {entry.task}
                              {entry.feedback && (
                                <div className="sip-entry-comment">
                                  <FaRegCommentDots size={12} /> <i>{entry.feedback}</i>
                                </div>
                              )}
                            </td>
                            <td className="sip-td-hours"><b>{entry.hours}h</b></td>
                            <td className="sip-td-status"><span className="sip-ebadge">{entry.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="sip-tfoot-label">Week Total</td>
                          <td className="sip-tfoot-hours"><b>{week.totalHours}h</b></td>
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

        <div className="sip-modal-footer">
          <button className="sip-btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ========== الصفحة الرئيسية ==========
export default function SupervisorInternProgress() {
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await applicationApi.university();
      const allApplications = response.applications || [];

      // ✅ الصح — بس in_training وcompleted
const applications = allApplications.filter(app =>
  app.status === "in_training" ||
  app.status === "completed"
);

      const mapped = await Promise.all(applications.map(async (app) => {
        const student = app.studentId || {};
        const training = app.trainingId || {};
        const company = app.companyId || {};
        const firstName = student.firstName || "";
        const lastName = student.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim() || "Unknown";
        const initials = firstName ? `${firstName[0]}${lastName?.[0] || ""}` : "??";

        const logsData = await fetchLogsForApplication(app._id);
        let hoursDone = 0, confirmed = 0, totalConfirmed = 0, weeks = [], targetHours = 160;

        if (logsData && logsData.stats) {
          targetHours = logsData.stats.requiredHours || training.totalHours || 160;
          hoursDone = logsData.stats.confirmedHours || 0;
          confirmed = logsData.stats.confirmedLogs || 0;
          totalConfirmed = logsData.stats.totalLogs || 0;
          weeks = buildWeeksFromLogs(logsData.logs || []);
        } else {
          targetHours = training.totalHours || 160;
        }

        const progress = targetHours > 0 ? Math.round((hoursDone / targetHours) * 100) : 0;

        return {
          id: app._id,
          name: fullName,
          idNum: student.studentID || "N/A",
          initials,
          color: "#f0e6ff",
          textColor: "#7c5cbf",
          company: company.name || "N/A",
          department: student.major || "N/A",
          status: app.status,
          hoursDone,
          targetHours,
          confirmed,
          totalConfirmed,
          progress,
          weeks,
        };
      }));

      setTrainees(mapped);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalTrainees = trainees.length;
  const avgProgress = totalTrainees ? Math.round(trainees.reduce((s, t) => s + t.progress, 0) / totalTrainees) : 0;
  const completedCount = trainees.filter(t => t.status === "completed").length;

  if (loading) return (
    <div className="sip-page">
      <div className="sip-loading"><FaSpinner className="spinner" /><p>Loading interns...</p></div>
    </div>
  );

  if (error) return (
    <div className="sip-page">
      <div className="sip-error"><p>{error}</p><button onClick={fetchData} className="sip-retry-btn">Try Again</button></div>
    </div>
  );

  return (
    <div className="sip-page">
      <div className="sip-header">
        <h1 className="sip-page-title">Intern Progress</h1>
        <p className="sip-page-sub">Track hours, daily progress, and provide feedback</p>
      </div>

      <div className="sip-top-stats">
        <div className="sip-tstat-card">
          <div className="sip-tstat-icon sip-icon-purple"><FaUserFriends /></div>
          <div className="sip-tstat-info"><span className="sip-tstat-val">{totalTrainees}</span><span className="sip-tstat-lbl">Trainees</span></div>
        </div>
        <div className="sip-tstat-card">
          <div className="sip-tstat-icon sip-icon-purple"><FaRegClock /></div>
          <div className="sip-tstat-info"><span className="sip-tstat-val">{avgProgress}%</span><span className="sip-tstat-lbl">Avg Progress</span></div>
        </div>
        <div className="sip-tstat-card">
          <div className="sip-tstat-icon sip-icon-green"><FaCheckCircle /></div>
          <div className="sip-tstat-info"><span className="sip-tstat-val">{completedCount}</span><span className="sip-tstat-lbl">Completed</span></div>
        </div>
      </div>

      <div className="sip-list">
        {trainees.length === 0 && <div className="sip-empty">No interns found.</div>}
        {trainees.map(t => (
          <div key={t.id} className="sip-card" onClick={() => setSelectedTrainee(t)}>
            <div className="sip-card-content">
              <div className="sip-avatar" style={{ background: t.color, color: t.textColor }}>{t.initials}</div>
              <div className="sip-card-info">
                <div className="sip-card-row1">
                  <span className="sip-cname">{t.name}</span>
                  <span className="sip-cid">{t.idNum}</span>
                  <span className="sip-cbadge">{t.status}</span>
                </div>
                <div className="sip-card-row2"><span className="sip-cat">@ {t.company} - {t.department}</span></div>
                <div className="sip-card-row3"><span className="sip-chours">{t.hoursDone}/{t.targetHours}h - {t.confirmed}/{t.totalConfirmed} confirmed</span></div>
              </div>
              <div className="sip-card-right"><FaChevronRight size={14} color="#aaa" /></div>
            </div>
            <div className="sip-card-bar-wrap">
              <div className="sip-card-bar-bg">
                <div className="sip-card-bar-fill" style={{ width: `${t.progress}%` }} />
              </div>
              <span className="sip-card-pct">{t.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      {selectedTrainee && (
        <InternModal intern={selectedTrainee} onClose={() => setSelectedTrainee(null)} />
      )}
    </div>
  );
}