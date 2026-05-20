import { useNavigate } from "react-router-dom";
import {
  FaUniversity, FaUserGraduate, FaUserShield,
  FaBuilding, FaFileAlt, FaUsers, FaCheckCircle
} from "react-icons/fa";

const RECENT_ACTIVITY = [
  { color: "#27ae60", title: "Sara Ali registered",           sub: "PTUK · Computer Science",     time: "5 min ago"   },
  { color: "#f39c12", title: "TechHub Co. awaiting approval", sub: "Submitted by supervisor",      time: "22 min ago"  },
  { color: "#3498db", title: "Omar Hassan completed training", sub: "InnovateX · 160 hrs",         time: "1 hr ago"    },
  { color: "#27ae60", title: "Yara Nasser registered",        sub: "An-Najah · Software Eng.",     time: "2 hrs ago"   },
  { color: "#f39c12", title: "PaltelGroup awaiting approval", sub: "New company account",          time: "3 hrs ago"   },
  { color: "#3498db", title: "Mohammed Saleh completed training", sub: "Asal Tech · 160 hrs",     time: "5 hrs ago"   },
  { color: "#27ae60", title: "Reem Adel registered",          sub: "Birzeit · Information Systems",time: "8 hrs ago"   },
  { color: "#f39c12", title: "Exalt Tech awaiting approval",  sub: "New company account",          time: "yesterday"   },
  { color: "#3498db", title: "Khaled Omar completed training",sub: "Foothill · 160 hrs",           time: "yesterday"   },
  { color: "#27ae60", title: "Noor Said registered",          sub: "PPU · Accounting",             time: "2 days ago"  },
];

export default function AdminPage() {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Universities",  value: "10",   icon: <FaUniversity />,  color: "#6c47ff", bg: "#f3efff" },
    { label: "Total Students",      value: "1,248", icon: <FaUserGraduate />, color: "#6c47ff", bg: "#f3efff" },
    { label: "Total Supervisors",   value: "24",   icon: <FaUserShield />,  color: "#6c47ff", bg: "#f3efff" },
    { label: "Approved Companies",  value: "87",   icon: <FaBuilding />,    color: "#6c47ff", bg: "#f3efff" },
    { label: "Total Applications",  value: "412",  icon: <FaFileAlt />,     color: "#6c47ff", bg: "#f3efff" },
    { label: "Active Trainees",     value: "156",  icon: <FaUsers />,       color: "#6c47ff", bg: "#f3efff" },
    { label: "Completed Trainings", value: "318",  icon: <FaCheckCircle />, color: "#27ae60", bg: "#f0fdf4" },
  ];

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 6 }}>Darbni</p>
        <h1 style={{ fontSize: "1.9rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>
          Platform Overview
        </h1>
        <p style={{ color: "#888", fontSize: 14 }}>Live statistics across the entire Darbni platform</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p className="admin-stat-label">{s.label}</p>
                <p className="admin-stat-value">{s.value}</p>
              </div>
              <div className="admin-stat-icon" style={{ color: s.color, background: s.bg }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="admin-activity-card">
        <h2 className="admin-activity-title">
          <span style={{ color: "#6c47ff" }}>⚡</span> Recent Activity
        </h2>
        <div className="admin-activity-list">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="admin-activity-item">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="admin-activity-dot" style={{ background: item.color }} />
                <div>
                  <div className="admin-activity-name">{item.title}</div>
                  <div className="admin-activity-sub">{item.sub}</div>
                </div>
              </div>
              <div className="admin-activity-time">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}