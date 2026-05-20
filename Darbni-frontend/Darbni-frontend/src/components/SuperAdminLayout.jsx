import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FaSignOutAlt, FaBell, FaChevronDown, FaKey,
  FaTh, FaUniversity, FaUserShield, FaUserGraduate, FaCog
} from "react-icons/fa";

const NAV = [
  { label: "Dashboard",    to: "/superadmin",              icon: <FaTh /> },
  { label: "Universities", to: "/superadmin/universities", icon: <FaUniversity /> },
  { label: "Supervisors",  to: "/superadmin/supervisors",  icon: <FaUserShield /> },
  { label: "Students",     to: "/superadmin/students",     icon: <FaUserGraduate /> },
  { label: "Settings",     to: "/superadmin/settings",     icon: <FaCog /> },
];

const MOCK_NOTIFS = [
  { id: 1, title: "New University",  msg: "Birzeit University requested activation.",    time: "2 hours ago", read: false },
  { id: 2, title: "New Supervisor",  msg: "A new supervisor registered from An-Najah.", time: "5 hours ago", read: false },
  { id: 3, title: "System Update",   msg: "Platform statistics have been updated.",      time: "1 day ago",   read: true  },
];

function ChangePasswordModal({ onClose }) {
  const [cur,     setCur]     = useState("");
  const [nw,      setNw]      = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNw,  setShowNw]  = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [err,     setErr]     = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit =
    cur.trim().length >= 6 &&
    nw.trim().length >= 6 &&
    confirm.trim().length >= 6 &&
    nw === confirm &&
    nw !== cur;

  const handleUpdate = () => {
    if (!cur || !nw || !confirm) { setErr("Please fill in all fields."); return; }
    if (nw.length < 6)           { setErr("New password must be at least 6 characters."); return; }
    if (nw === cur)              { setErr("New password must be different from current."); return; }
    if (nw !== confirm)          { setErr("Passwords do not match."); return; }
    setErr("");
    setSuccess(true);
    setTimeout(onClose, 1500);
  };

  const EyeIcon = ({ show }) => show
    ? <svg viewBox="0 0 24 24" width="16" height="16" stroke="#aaa" fill="none" strokeWidth="2" strokeLinecap="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    : <svg viewBox="0 0 24 24" width="16" height="16" stroke="#aaa" fill="none" strokeWidth="2" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="pw-modal-icon">🔒</div>
        <h3 className="pw-modal-title">Change Password</h3>
        <p className="pw-modal-sub">Enter your current password and choose a new one.</p>
        {success && <div className="pw-success">✓ Password updated successfully!</div>}

        <div className="profile-field">
          <label>Current Password</label>
          <div className="login-pw-wrap">
            <input
              className={`login-inp${err && !cur ? " error" : cur.length >= 6 ? " ok" : ""}`}
              type={showCur ? "text" : "password"}
              placeholder="••••••••"
              value={cur}
              autoComplete="current-password"
              onChange={e => { setCur(e.target.value); setErr(""); }}
            />
            <button className="login-eye-btn" type="button" onClick={() => setShowCur(!showCur)}>
              <EyeIcon show={showCur} />
            </button>
          </div>
        </div>

        <div className="profile-field">
          <label>New Password</label>
          <div className="login-pw-wrap">
            <input
              className={`login-inp${err && !nw ? " error" : nw.length >= 6 && nw !== cur ? " ok" : ""}`}
              type={showNw ? "text" : "password"}
              placeholder="••••••••"
              value={nw}
              autoComplete="new-password"
              onChange={e => { setNw(e.target.value); setErr(""); }}
            />
            <button className="login-eye-btn" type="button" onClick={() => setShowNw(!showNw)}>
              <EyeIcon show={showNw} />
            </button>
          </div>
          {nw && nw === cur && (
            <div style={{ color: "#e67e22", fontSize: 12, marginTop: 4 }}>
              New password must be different from current
            </div>
          )}
        </div>

        <div className="profile-field">
          <label>Confirm New Password</label>
          <div className="login-pw-wrap">
            <input
              className={`login-inp${confirm && confirm !== nw ? " error" : confirm && confirm === nw && confirm.length >= 6 ? " ok" : ""}`}
              type={showCon ? "text" : "password"}
              placeholder="••••••••"
              value={confirm}
              autoComplete="new-password"
              onChange={e => { setConfirm(e.target.value); setErr(""); }}
            />
            <button className="login-eye-btn" type="button" onClick={() => setShowCon(!showCon)}>
              <EyeIcon show={showCon} />
            </button>
          </div>
          {confirm && confirm !== nw && (
            <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>Passwords do not match</div>
          )}
          {err && <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 5 }}>{err}</div>}
        </div>

        <div className="modal-actions" style={{ marginTop: 20 }}>
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-submit" onClick={handleUpdate}
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed" }}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dropRef   = useRef(null);
  const notifRef  = useRef(null);

  const [showDrop,    setShowDrop]    = useState(false);
  const [showNotif,   setShowNotif]   = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [notifs,      setNotifs]      = useState(MOCK_NOTIFS);
  const [topbarLogo,  setTopbarLogo]  = useState(() => localStorage.getItem("adminLogo") || null);

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = () => setTopbarLogo(localStorage.getItem("adminLogo") || null);
    window.addEventListener("adminLogoUpdated", handler);
    return () => window.removeEventListener("adminLogoUpdated", handler);
  }, []);

  const isActive = (to) => {
    if (to === "/superadmin") return location.pathname === "/superadmin";
    return location.pathname.startsWith(to);
  };

  const email = localStorage.getItem("email") || "admin@darbni.com";
  const handleLogout = () => { localStorage.clear(); navigate("/login"); };
  const markAllRead  = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  const markRead     = (id) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif  = (id) => setNotifs(ns => ns.filter(n => n.id !== id));

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current  && !dropRef.current.contains(e.target))  setShowDrop(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div>
          <div className="sidebar-logo-wrap" style={{ cursor: "pointer" }} onClick={() => navigate("/superadmin")}>
            <span style={{ fontSize: 20 }}>🎓</span>
            <div>
              <div className="sidebar-logo-name">Darbni</div>
              <div className="sidebar-logo-sub">Super Admin Portal</div>
            </div>
          </div>
          <ul>
            {NAV.map(item => (
              <li key={item.label} className={isActive(item.to) ? "active" : ""} onClick={() => navigate(item.to)}>
                {item.icon} {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="signout" onClick={handleLogout}><FaSignOutAlt /> Sign Out</div>
      </div>

      <div className="main-content">
        <div className="topbar">
          {topbarLogo && (
            <img src={topbarLogo} alt="logo"
              style={{ height: 36, width: 36, borderRadius: 8, objectFit: "cover", marginRight: "auto" }} />
          )}

          <div style={{ position: "relative" }} ref={notifRef}>
            <div className="notif" style={{ cursor: "pointer" }}
              onClick={() => { setShowNotif(!showNotif); setShowDrop(false); }}>
              <FaBell />
              {unread > 0 && <span className="notif-badge">{unread}</span>}
            </div>
            {showNotif && (
              <div className="notif-dropdown">
                <div className="notif-drop-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="notif-drop-title">Notifications</span>
                    {unread > 0 && <span className="notif-new-badge">{unread} new</span>}
                  </div>
                  <button className="notif-read-all" onClick={markAllRead}>✓ Read All</button>
                </div>
                <div className="notif-list">
                  {notifs.map(n => (
                    <div key={n.id} className={`notif-item${n.read ? "" : " unread"}`}>
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-msg">{n.msg}</div>
                      <div className="notif-item-time">{n.time}</div>
                      <div className="notif-item-actions">
                        {!n.read && <button onClick={() => markRead(n.id)}>✓ Mark as Read</button>}
                        <button onClick={() => deleteNotif(n.id)}>🗑 Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: "relative" }} ref={dropRef}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
              onClick={() => { setShowDrop(!showDrop); setShowNotif(false); }}>
              <div className="profile-circle">A</div>
              <FaChevronDown style={{ fontSize: 11, color: "#888" }} />
            </div>
            {showDrop && (
              <div className="profile-dropdown">
                <div className="profile-drop-info">
                  <div className="profile-drop-name">Super Admin</div>
                  <div className="profile-drop-email">{email}</div>
                </div>
                <div className="profile-drop-item" onClick={() => { setShowPwModal(true); setShowDrop(false); }}>
                  <FaKey /> Change Password
                </div>
                <div className="profile-drop-item signout-item" onClick={handleLogout}>
                  <FaSignOutAlt /> Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
        <Outlet />
      </div>
      {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}
    </div>
  );
}