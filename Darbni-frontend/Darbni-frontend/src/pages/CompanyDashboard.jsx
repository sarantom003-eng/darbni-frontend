import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaUsers, FaGraduationCap, FaCheckCircle } from "react-icons/fa";

const RECENT_APPS = [
  { name: "Ahmad Nasser", field: "Web Development", status: "pending"  },
  { name: "Sara Tomeh",   field: "Data Science",    status: "accepted" },
  { name: "Khaled Hasan", field: "Cybersecurity",   status: "pending"  },
];

const TRAINING = [
  { name: "Sara Tomeh",  date: "Mar 3, 2026", pct: 85 },
  { name: "Rami Khalil", date: "Mar 2, 2026", pct: 60 },
  { name: "Nour Abed",   date: "Mar 1, 2026", pct: 40 },
];

const barColor = (p) => p >= 80 ? "#27ae60" : p >= 50 ? "#f1c40f" : "#e74c3c";

const statusStyle = (s) =>
  s === "accepted"
    ? { background: "#6c47ff", color: "#fff", border: "none" }
    : { background: "transparent", color: "#888", border: "1px solid #ddd" };

export default function CompanyDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dash-content">

      {/* Header */}
      <div className="dash-title">
        <h1>Company Dashboard</h1>
        <p>Manage training programs and applications</p>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {[
          { label: "Active Opportunities", val: 4,  icon: <FaBriefcase />,    to: "/company/internships" },
          { label: "Total Applicants",     val: 15, icon: <FaUsers />,        to: "/company/students"    },
          { label: "In Training",          val: 6,  icon: <FaGraduationCap />,to: "/company/progress"    },
          { label: "Completed",            val: 12, icon: <FaCheckCircle />,  to: "/company/reports"     },
        ].map((s) => (
          <div
            key={s.label}
            className="dash-stat"
            onClick={() => navigate(s.to)}
            style={{ cursor: "pointer" }}
          >
            <div className="dash-stat-top">
              <span>{s.label}</span>
              <div className="dash-stat-icon">{s.icon}</div>
            </div>
            <div className="dash-stat-val">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="dash-bottom">

        {/* Recent Applications */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Recent Applications</h3>
            <span
              className="dash-view-link"
              onClick={() => navigate("/company/students")}
              style={{ cursor: "pointer" }}
            >
              View All →
            </span>
          </div>
          {RECENT_APPS.map((app) => (
            <div className="dash-app-item" key={app.name}>
              <div>
                <div className="dash-app-name">{app.name}</div>
                <div className="dash-app-field">{app.field}</div>
              </div>
              <span className="dash-status" style={statusStyle(app.status)}>
                {app.status}
              </span>
            </div>
          ))}
        </div>

        {/* Training Progress */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Training Progress</h3>
            <span
              className="dash-view-link"
              onClick={() => navigate("/company/progress")}
              style={{ cursor: "pointer" }}
            >
              View All →
            </span>
          </div>
          {TRAINING.map((t) => (
            <div className="dash-train-item" key={t.name}>
              <div className="dash-train-top">
                <div>
                  <div className="dash-train-name">{t.name}</div>
                  <div className="dash-train-date">Last entry: {t.date}</div>
                </div>
                <div className="dash-train-pct" style={{ color: barColor(t.pct) }}>
                  {t.pct}%
                </div>
              </div>
              <div className="dash-bar-bg">
                <div
                  className="dash-bar-fill"
                  style={{ width: t.pct + "%", background: barColor(t.pct) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}