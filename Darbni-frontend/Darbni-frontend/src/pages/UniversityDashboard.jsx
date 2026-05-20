import { useNavigate } from "react-router-dom";
import {
  FaExclamationCircle, FaUserFriends, FaClipboardCheck,
  FaCheckCircle, FaBuilding, FaUserGraduate,
  FaSpinner, FaCog, FaArrowRight
} from "react-icons/fa";

const RECENT_APPS = [
  { name: "Ahmad Nasser",  company: "TechPal Solutions",  status: "pending"  },
  { name: "Layla Haddad",  company: "DataVision Co.",     status: "approved" },
  { name: "Omar Saleh",    company: "CloudNine Tech",     status: "pending"  },
];

const STUDENT_PROGRESS = [
  { name: "Sara Tomeh",   company: "TechPal Solutions",  hours: 120, total: 150 },
  { name: "Rami Khalil",  company: "DataVision Co.",     hours: 80,  total: 150 },
  { name: "Nour Abed",    company: "CyberGuard Inc.",    hours: 150, total: 150 },
];

const barColor = (pct) => pct >= 100 ? "#6c47ff" : pct >= 50 ? "#6c47ff" : "#e74c3c";

export default function UniversityDashboard() {
  const navigate = useNavigate();

  // ← هاد التغيير الوحيد
  const universityName = localStorage.getItem("university") || "Palestine Technical University – Kadoorie";

  const stats = [
    { label: "Companies Pending Approval", value: "2",  icon: <FaExclamationCircle />, color: "#e74c3c", bg: "#fff3f3", highlight: true, to: "/supervisor/companies" },
    { label: "Registered Students",        value: "47", icon: <FaUserFriends />,       color: "#6c47ff", bg: "#f3efff", to: "/supervisor/students" },
    { label: "Pending Reviews",            value: "5",  icon: <FaClipboardCheck />,    color: "#6c47ff", bg: "#f3efff", to: "/supervisor/applications" },
    { label: "Completed Trainings",        value: "24", icon: <FaCheckCircle />,       color: "#27ae60", bg: "#f0fdf4", to: "/supervisor/reports" },
  ];

  const infoCards = [
    { label: "Approved Companies", value: "12", icon: <FaBuilding />,     color: "#6c47ff", bg: "#f3efff", to: "/supervisor/companies" },
    { label: "Active Trainees",    value: "12", icon: <FaUserGraduate />, color: "#6c47ff", bg: "#f3efff", to: "/supervisor/students" },
    { label: "In Progress",        value: "8",  icon: <FaSpinner />,      color: "#6c47ff", bg: "#f3efff", to: "/supervisor/progress" },
    { label: "Settings",           value: "",   icon: <FaCog />,          color: "#6c47ff", bg: "#f3efff", to: "/supervisor/settings", isSettings: true },
  ];

  const statusPill = (s) => {
    if (s === "approved") return { background: "#6c47ff", color: "#fff", border: "none" };
    return { background: "transparent", color: "#888", border: "1px solid #ddd" };
  };

  return (
    <div style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>

      <div className="uni-dash-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 className="uni-dash-title">University Admin Dashboard</h1>
            <span className="uni-dash-badge">👤 Admin</span>
          </div>
          {/* ← هاد السطر المعدّل */}
          <p className="uni-dash-sub">{universityName} — Full platform management</p>
        </div>
      </div>

      <div className="uni-stats-row">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`uni-stat-card${s.highlight ? " uni-stat-highlight" : ""}`}
            onClick={() => navigate(s.to)}
          >
            <div className="uni-stat-top">
              {s.highlight && (
                <div className="uni-stat-alert-icon" style={{ color: s.color }}>
                  {s.icon}
                </div>
              )}
              <div>
                <div className="uni-stat-val">{s.value}</div>
                <div className="uni-stat-label">{s.label}</div>
              </div>
              {!s.highlight && (
                <div className="uni-stat-icon" style={{ color: s.color, background: s.bg }}>
                  {s.icon}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="uni-info-row">
        {infoCards.map((c, i) => (
          <div
            key={i}
            className="uni-info-card"
            onClick={() => navigate(c.to)}
          >
            <div className="uni-info-top">
              <span className="uni-info-label">{c.label}</span>
              <div className="uni-info-icon" style={{ color: c.color, background: c.bg }}>
                {c.icon}
              </div>
            </div>
            {c.isSettings ? (
              <div className="uni-info-settings">
                <FaCog style={{ fontSize: 28, color: "#6c47ff", opacity: 0.5 }} />
              </div>
            ) : (
              <div className="uni-info-val">{c.value}</div>
            )}
          </div>
        ))}
      </div>

      <div className="uni-bottom-row">
        <div className="uni-bottom-card">
          <div className="uni-card-head">
            <h3>Recent Applications</h3>
            <span className="uni-view-link" onClick={() => navigate("/supervisor/applications")}>
              View All <FaArrowRight style={{ fontSize: 10 }} />
            </span>
          </div>
          <div className="uni-app-list">
            {RECENT_APPS.map((app, i) => (
              <div className="uni-app-item" key={i}>
                <div className="uni-app-info">
                  <div className="uni-app-name">{app.name}</div>
                  <div className="uni-app-company">{app.company}</div>
                </div>
                <span className="uni-app-status" style={statusPill(app.status)}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="uni-bottom-card">
          <div className="uni-card-head">
            <h3>Student Progress</h3>
            <span className="uni-view-link" onClick={() => navigate("/supervisor/progress")}>
              View All <FaArrowRight style={{ fontSize: 10 }} />
            </span>
          </div>
          <div className="uni-progress-list">
            {STUDENT_PROGRESS.map((s, i) => {
              const pct = Math.round((s.hours / s.total) * 100);
              return (
                <div className="uni-progress-item" key={i}>
                  <div className="uni-progress-top">
                    <div>
                      <div className="uni-progress-name">{s.name}</div>
                      <div className="uni-progress-company">{s.company}</div>
                    </div>
                    <div className="uni-progress-hours">{s.hours}/{s.total}h</div>
                  </div>
                  <div className="uni-bar-bg">
                    <div
                      className="uni-bar-fill"
                      style={{ width: pct + "%", background: barColor(pct) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}