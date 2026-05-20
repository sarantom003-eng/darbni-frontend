import { useState, useEffect } from "react";
import { FaPlus, FaPencilAlt, FaTimes, FaCheck, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { api } from "../api/client";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStatusLabel(status) {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    confirmed_with_review: "Confirmed with Review"
  };
  return labels[status] || status;
}

function statusStyle(s) {
  if (s === "confirmed") return { color: "#27ae60", fontWeight: 700 };
  if (s === "confirmed_with_review") return { background: "#fff8e1", color: "#b7791f", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 600 };
  if (s === "pending") return { background: "#fff8e1", color: "#b7791f", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 600 };
  return {};
}

function canEdit(status) {
  return status === "pending" || status === "confirmed_with_review";
}

// دالة لجلب الـ applicationId النشط للطالب
async function getActiveApplicationId() {
  const appsRes = await api("/applications/my");
  const applications = appsRes.applications || [];
  const activeApp = applications.find(app => 
    app.status === "in_training" || app.status === "company_final_approved"
  );
  if (!activeApp) throw new Error("No active training found");
  return activeApp._id;
}

// تجميع الـ logs حسب الأسبوع
function groupLogsByWeek(logs) {
  if (!logs.length) return [];
  
  const sorted = [...logs].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
  const weeksMap = new Map();
  
  sorted.forEach((log, index) => {
    const weekNum = Math.floor(index / 5) + 1;
    if (!weeksMap.has(weekNum)) {
      weeksMap.set(weekNum, {
        id: weekNum,
        label: `Week ${weekNum}`,
        expanded: weekNum === 1,
        entries: []
      });
    }
    const date = new Date(log.log_date);
    weeksMap.get(weekNum).entries.push({
      id: log._id,
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: log.log_date.split("T")[0],
      dateDisplay: formatDateDisplay(log.log_date),
      hours: log.hours,
      tasks: log.tasks_completed,
      status: log.status,
      feedback: log.company_feedback || ""
    });
  });
  
  return Array.from(weeksMap.values()).map(week => {
    const dates = week.entries.map(e => e.date).sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    return {
      ...week,
      startDate,
      endDate,
      range: `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`
    };
  });
}

function weekStats(entries) {
  const total = entries.reduce((s, e) => s + e.hours, 0);
  const confirmed = entries.filter(e => e.status === "confirmed" || e.status === "confirmed_with_review").length;
  return { total, confirmed, all: entries.length };
}

function weekStatus(entries) {
  if (entries.length === 0) return "Pending";
  if (entries.every(e => e.status === "confirmed" || e.status === "confirmed_with_review")) {
    return entries.some(e => e.status === "confirmed_with_review") ? "Evaluated" : "Confirmed";
  }
  return "Pending";
}

const inputBase = {
  display: "block", width: "100%", padding: "10px 12px",
  borderRadius: 8, fontSize: 14, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", background: "#fff",
  color: "#1a1a2e", pointerEvents: "auto", userSelect: "text"
};

const inputNormal = { ...inputBase, border: "1.5px solid #dddbe8" };
const inputOk = { ...inputBase, border: "1.5px solid #27ae60" };
const inputErr = { ...inputBase, border: "1.5px solid #e74c3c" };

function getInpStyle(value, hasErr) {
  if (hasErr && !value) return inputErr;
  if (value) return inputOk;
  return inputNormal;
}

export default function TrainingLogbook() {
  const [applicationId, setApplicationId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalHours: 0, confirmedHours: 0, progressPercent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [modal, setModal] = useState(null);
  const [formErr, setFormErr] = useState(false);
  const [toast, setToast] = useState(null);

  const [fDay, setFDay] = useState("");
  const [fDate, setFDate] = useState("");
  const [fHours, setFHours] = useState("");
  const [fTasks, setFTasks] = useState("");

  const showToast = (msg, sub) => {
    setToast({ msg, sub });
    setTimeout(() => setToast(null), 3000);
  };

  // تحميل البيانات عند بدء الصفحة
  useEffect(() => {
    let alive = true;
    const loadData = async () => {
      try {
        const appId = await getActiveApplicationId();
        if (!alive) return;
        setApplicationId(appId);
        
        const logsRes = await api(`/logs/${appId}`);
        if (!alive) return;
        setLogs(logsRes.logs || []);
        setStats(logsRes.stats || { totalHours: 0, confirmedHours: 0, progressPercent: 0 });
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    loadData();
    return () => { alive = false; };
  }, []);

  const weeks = groupLogsByWeek(logs);
  
  const [weeksState, setWeeksState] = useState([]);
  useEffect(() => {
    setWeeksState(weeks);
  }, [logs]);

  const toggleWeek = (id) => {
    setWeeksState(prev => prev.map(w => w.id === id ? { ...w, expanded: !w.expanded } : w));
  };

  const openAdd = (weekId = null) => {
    setFDay(""); setFDate(""); setFHours(""); setFTasks("");
    setFormErr(false);
    setModal({ mode: "add", weekId });
  };

  const openEdit = (weekId, entry) => {
    setFDay(entry.day);
    setFDate(entry.date);
    setFHours(String(entry.hours));
    setFTasks(entry.tasks);
    setFormErr(false);
    setModal({ mode: "edit", weekId, entry });
  };

  const closeModal = () => { setModal(null); setFormErr(false); };

  const submitForm = async () => {
    if (!fDay || !fDate || !fHours || !fTasks.trim()) {
      setFormErr(true);
      return;
    }

    setFormErr(false);
    
    try {
      if (modal.mode === "add") {
        await api("/logs", {
          method: "POST",
          body: {
            applicationId,
            log_date: fDate,
            tasks_completed: fTasks,
            hours: parseInt(fHours)
          }
        });
        showToast("Entry Added", "Daily entry submitted successfully.");
      } else {
        await api(`/logs/${modal.entry.id}`, {
          method: "PUT",
          body: {
            tasks_completed: fTasks,
            hours: parseInt(fHours)
          }
        });
        showToast("Entry Updated", "Daily entry has been updated.");
      }
      
      // إعادة تحميل البيانات
      const logsRes = await api(`/logs/${applicationId}`);
      setLogs(logsRes.logs || []);
      setStats(logsRes.stats || { totalHours: 0, confirmedHours: 0, progressPercent: 0 });
      closeModal();
    } catch (err) {
      setFormErr(true);
      showToast("Error", err.message);
    }
  };

  const totalHours = stats.totalHours || 0;
  const confirmedHours = stats.confirmedHours || 0;
  const completion = stats.progressPercent || 0;

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}>Loading logbook...</div>;
  if (error) return <div style={{ textAlign: "center", padding: 50, color: "#e74c3c" }}>{error}</div>;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Training Logbook</h1>
          <p className="page-sub">Track your daily progress and hours</p>
        </div>
        <button className="logbook-add-btn" onClick={() => openAdd(null)}>
          <FaPlus /> Add Entry
        </button>
      </div>

      <div className="logbook-stats">
        <div className="logbook-stat-card">
          <div className="logbook-stat-label">Total Hours</div>
          <div className="logbook-stat-val">{totalHours}h</div>
        </div>
        <div className="logbook-stat-card">
          <div className="logbook-stat-label">Confirmed Hours</div>
          <div className="logbook-stat-val">{confirmedHours}h</div>
        </div>
        <div className="logbook-stat-card">
          <div className="logbook-stat-label">Completion</div>
          <div className="logbook-stat-val">{completion}%</div>
        </div>
      </div>

      <div className="logbook-section-title">Weekly Schedule Log</div>

      <div className="logbook-weeks">
        {weeksState.map(week => {
          const statsW = weekStats(week.entries);
          const wstatus = weekStatus(week.entries);
          return (
            <div key={week.id} className="logbook-week-wrap">
              <div className="logbook-week-header" onClick={() => toggleWeek(week.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="logbook-chevron">
                    {week.expanded ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                  <div>
                    <div className="logbook-week-label">{week.label}</div>
                    <div className="logbook-week-range">{week.range}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="logbook-week-summary">
                    {statsW.total}h · {statsW.confirmed}/{statsW.all} confirmed
                  </span>
                  {(wstatus === "Confirmed" || wstatus === "Evaluated") && (
                    <span className="logbook-badge-eval">
                      <FaCheck style={{ fontSize: 10 }} /> Evaluated
                    </span>
                  )}
                  <span className={`logbook-week-status ${wstatus.toLowerCase().replace(" ", "-")}`}>
                    {wstatus}
                  </span>
                </div>
              </div>

              {week.expanded && (
                <div className="logbook-entries">
                  <div className="logbook-entries-head">
                    <span>Day</span>
                    <span>Date</span>
                    <span>Tasks Completed</span>
                    <span style={{ textAlign: "right" }}>Hours</span>
                    <span style={{ textAlign: "center" }}>Status</span>
                    <span style={{ textAlign: "center" }}>Edit</span>
                  </div>

                  {week.entries.map(entry => (
                    <div key={entry.id} className="logbook-entry-row">
                      <span className="logbook-entry-day">{entry.day}</span>
                      <span className="logbook-entry-date">{entry.dateDisplay || entry.date}</span>
                      <div>
                        <div className="logbook-entry-tasks">{entry.tasks}</div>
                        {entry.feedback && (
                          <div className="logbook-entry-feedback">💬 <em>{entry.feedback}</em></div>
                        )}
                      </div>
                      <span className="logbook-entry-hours">{entry.hours}h</span>
                      <span className="logbook-entry-status">
                        <span style={statusStyle(entry.status)}>{getStatusLabel(entry.status)}</span>
                      </span>
                      <span className="logbook-entry-edit">
                        {canEdit(entry.status) && (
                          <button className="logbook-edit-btn" onClick={() => openEdit(week.id, entry)}>
                            <FaPencilAlt />
                          </button>
                        )}
                      </span>
                    </div>
                  ))}

                  <div className="logbook-week-total">
                    <span>Week Total</span>
                    <span></span><span></span>
                    <span className="logbook-entry-hours">{statsW.total}h</span>
                    <span style={{ fontSize: 12, color: "#888", textAlign: "center" }}>
                      {statsW.confirmed}/{statsW.all} confirmed
                    </span>
                    <span></span>
                  </div>

                  {wstatus !== "Confirmed" && wstatus !== "Evaluated" && (
                    <button className="logbook-add-day-btn" onClick={() => openAdd(week.id)}>
                      <FaPlus /> Add Day
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>{modal.mode === "add" ? "Add Daily Entry" : "Edit Daily Entry"}</h3>
              <button className="modal-close" onClick={closeModal}><FaTimes /></button>
            </div>

            {formErr && (
              <div className="logbook-form-err">
                <strong>Missing fields</strong>
                <div>Please fill in all required fields.</div>
              </div>
            )}

            <div className="logbook-form-row">
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Day</label>
                <select
                  value={fDay}
                  onChange={e => setFDay(e.target.value)}
                  style={getInpStyle(fDay, formErr)}
                >
                  <option value="">Select day</option>
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Date</label>
                <input
                  type="date"
                  value={fDate}
                  onChange={e => setFDate(e.target.value)}
                  style={getInpStyle(fDate, formErr)}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Hours Completed</label>
              <input
                type="number"
                min="1"
                max="12"
                placeholder="e.g., 7"
                value={fHours}
                onChange={e => setFHours(e.target.value)}
                style={getInpStyle(fHours, formErr)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Tasks Completed</label>
              <textarea
                rows={4}
                placeholder="Describe what you worked on today..."
                value={fTasks}
                onChange={e => setFTasks(e.target.value)}
                style={{
                  ...getInpStyle(fTasks, formErr),
                  resize: "vertical", minHeight: 100, lineHeight: 1.5,
                  pointerEvents: "auto", userSelect: "text", cursor: "text"
                }}
              />
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="modal-cancel" onClick={closeModal}>Cancel</button>
              <button className="modal-submit" onClick={submitForm}>
                <FaCheck /> {modal.mode === "add" ? "Submit Entry" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="logbook-toast">
          <strong>{toast.msg}</strong>
          <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{toast.sub}</div>
        </div>
      )}
    </>
  );
}