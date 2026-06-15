import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authApi, saveSession, roleToFrontend } from "../api/client";

function Login() {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);

  const [emailState, setEmailState] = useState("hint");
  const [emailNote,  setEmailNote]  = useState("Enter your university, staff, or company email");
  const [pwState,    setPwState]    = useState("hint");
  const [pwNote,     setPwNote]     = useState("At least 6 characters required");
  const [pwStrength, setPwStrength] = useState({ pct: 0, color: "#eee", label: "" });
  const [btnError,   setBtnError]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const detectRole = (e) => {
    if (e.toLowerCase() === "admin@darbni.com") return "superadmin";
    if (/@students\./i.test(e))                 return "student";
    if (/@ptuk\.edu\.ps$/i.test(e))             return "supervisor";
    return "company";
  };

  const detectRoleLabel = (e) => {
    if (e.toLowerCase() === "admin@darbni.com") return "Super Admin";
    if (/@students\./i.test(e))                 return "Student";
    if (/@ptuk\.edu\.ps$/i.test(e))             return "University Supervisor";
    return "Company";
  };

  const calcStrength = (v) => {
    let s = 0;
    if (v.length >= 6)           s++;
    if (v.length >= 10)          s++;
    if (/[A-Z]/.test(v))         s++;
    if (/[0-9]/.test(v))         s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    const pcts = [0, 20, 40, 65, 85, 100];
    const cols = ["", "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"];
    const labs = ["", "Too short", "Weak", "Fair", "Good", "Strong"];
    return { pct: pcts[s], color: cols[s] || "#eee", label: v.length ? labs[s] : "" };
  };

  const onEmailInput = (v) => {
    setEmail(v);
    if (v.length > 5 && isValidEmail(v)) {
      setEmailState("ok");
      setEmailNote("Valid — detected as " + detectRoleLabel(v));
    } else {
      setEmailState("hint");
      setEmailNote("Enter your university, staff, or company email");
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailState("err"); setEmailNote("Email cannot be empty"); return false;
    }
    if (!isValidEmail(email)) {
      setEmailState("err"); setEmailNote("Enter a valid email (e.g. name@domain.com)"); return false;
    }
    setEmailState("ok"); setEmailNote("Valid — detected as " + detectRoleLabel(email));
    return true;
  };

  const onPwInput = (v) => {
    setPassword(v);
    const s = calcStrength(v);
    setPwStrength(s);
    if (v.length >= 6) { setPwState("ok");   setPwNote("Password looks good"); }
    else if (v.length) { setPwState("hint");  setPwNote("At least 6 characters required"); }
    else               { setPwState("hint");  setPwNote("At least 6 characters required"); }
  };

  const validatePw = () => {
    if (!password)           { setPwState("err"); setPwNote("Password cannot be empty"); return false; }
    if (password.length < 6) { setPwState("err"); setPwNote("Password must be at least 6 characters"); return false; }
    setPwState("ok"); setPwNote("Password looks good");
    return true;
  };

  const handleSignIn = async () => {
    const eOk = validateEmail();
    const pOk = validatePw();
    if (!eOk || !pOk) {
      setBtnError(true);
      setTimeout(() => setBtnError(false), 2200);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      const data = await authApi.login(email, password);
      saveSession(data);
      localStorage.setItem("email", email);
      const role = roleToFrontend(data.role);

      if (role === "superadmin")      navigate("/superadmin");
      else if (role === "student")    navigate("/student");
      else if (role === "supervisor") navigate("/supervisor");
      else                            navigate("/company");
    } catch (err) {
      setApiError(err.message);
      setBtnError(true);
      setTimeout(() => setBtnError(false), 2200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          {apiError && <div className="contact-success" style={{ background: "#ffecec", color: "#b00020" }}>{apiError}</div>}

          {/* Email */}
          <div className="login-field">
            <label htmlFor="email">Email Address</label>
            <input
              className={`login-inp${emailState === "err" ? " error" : emailState === "ok" ? " ok" : ""}`}
              type="email"
              id="email"
              placeholder="you@students.ptuk.edu.ps"
              value={email}
              onChange={(e) => onEmailInput(e.target.value)}
              onBlur={validateEmail}
              autoComplete="email"
            />
            <div className={`login-note ${emailState}`}>
              {emailState === "ok"
                ? <svg viewBox="0 0 24 24" width="13" height="13" stroke="#27ae60" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg viewBox="0 0 24 24" width="13" height="13" stroke={emailState === "err" ? "#e74c3c" : "#aaa"} fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
              <span>{emailNote}</span>
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-pw-wrap">
              <input
                className={`login-inp${pwState === "err" ? " error" : pwState === "ok" ? " ok" : ""}`}
                type={showPw ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => onPwInput(e.target.value)}
                onBlur={validatePw}
                autoComplete="current-password"
              />
              <button className="login-eye-btn" type="button" onClick={() => setShowPw(!showPw)}>
                {showPw
                  ? <svg viewBox="0 0 24 24" width="16" height="16" stroke="#aaa" fill="none" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  : <svg viewBox="0 0 24 24" width="16" height="16" stroke="#aaa" fill="none" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                }
              </button>
            </div>
            <div className="login-pw-strength">
              <div className="login-pw-bar" style={{ width: pwStrength.pct + "%", background: pwStrength.color }}></div>
            </div>
            {pwStrength.label && (
              <div className="login-pw-hint" style={{ color: pwStrength.color }}>{pwStrength.label}</div>
            )}
            <div className={`login-note ${pwState}`}>
              {pwState === "ok"
                ? <svg viewBox="0 0 24 24" width="13" height="13" stroke="#27ae60" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg viewBox="0 0 24 24" width="13" height="13" stroke={pwState === "err" ? "#e74c3c" : "#aaa"} fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
              <span>{pwNote}</span>
            </div>
          </div>

          <div className="login-forgot">
            <Link to="/forgot">Forgot password?</Link>
          </div>

          <button
            className={`login-btn${btnError ? " btn-err" : ""}`}
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Signing in..." : btnError ? "Fix errors above" : "Sign In"}
          </button>

       

          <div className="login-signup-row">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;