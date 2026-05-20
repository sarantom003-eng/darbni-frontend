import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authApi } from "../api/client";

function Forgot() {
  const [email,      setEmail]      = useState("");
  const [emailState, setEmailState] = useState("hint");
  const [emailNote,  setEmailNote]  = useState("Enter the email linked to your account");
  const [submitted,  setSubmitted]  = useState(false);
  const [btnError,   setBtnError]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const onEmailInput = (v) => {
    setEmail(v);
    if (v.length > 5 && isValidEmail(v)) {
      setEmailState("ok");
      setEmailNote("Email looks valid");
    } else if (v.length > 0) {
      setEmailState("hint");
      setEmailNote("Enter the email linked to your account");
    } else {
      setEmailState("hint");
      setEmailNote("Enter the email linked to your account");
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailState("err");
      setEmailNote("Email cannot be empty");
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailState("err");
      setEmailNote("Enter a valid email (e.g. name@domain.com)");
      return false;
    }
    setEmailState("ok");
    setEmailNote("Email looks valid");
    return true;
  };

  const handleReset = async () => {
    const ok = validateEmail();
    if (!ok) {
      setBtnError(true);
      setTimeout(() => setBtnError(false), 2200);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
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
        <div className="login-card forgot-card">

          {/* Icon */}
          <div className="forgot-icon-wrap">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="#fff" fill="none"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,12 2,6"/>
            </svg>
          </div>

          {!submitted ? (
            <>
              <h1 className="login-title">Forgot Password?</h1>
              <p className="login-sub">No worries, we'll send you reset instructions.</p>

              {apiError && (
                <div className="contact-success" style={{ background: "#ffecec", color: "#b00020", marginBottom: "16px" }}>
                  {apiError}
                </div>
              )}

              <div className="login-field">
                <label htmlFor="forgot-email">Email Address</label>
                <input
                  className={`login-inp${emailState === "err" ? " error" : emailState === "ok" ? " ok" : ""}`}
                  type="email"
                  id="forgot-email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => onEmailInput(e.target.value)}
                  onBlur={validateEmail}
                  autoComplete="email"
                  disabled={loading}
                />
                <div className={`login-note ${emailState}`}>
                  {emailState === "ok"
                    ? <svg viewBox="0 0 24 24" width="13" height="13" stroke="#27ae60" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg viewBox="0 0 24 24" width="13" height="13" stroke={emailState === "err" ? "#e74c3c" : "#aaa"} fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  }
                  <span>{emailNote}</span>
                </div>
              </div>

              <button
                className={`login-btn forgot-btn${btnError ? " btn-err" : ""}`}
                onClick={handleReset}
                disabled={loading}
              >
                {loading ? "Sending..." : btnError ? "Fix errors above" : "Send Reset Link"}
              </button>

              <div className="forgot-back">
                <Link to="/login">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="login-title">Check your email</h1>
              <p className="login-sub">
                We sent a reset link to<br/>
                <strong style={{ color: "#2e2b3f" }}>{email}</strong>
              </p>

              <div className="forgot-success-note">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="#27ae60" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Didn't receive it? Check your spam folder</span>
              </div>

              <button
                className="login-btn"
                style={{ marginTop: "20px" }}
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                  setEmailState("hint");
                  setEmailNote("Enter the email linked to your account");
                  setApiError("");
                }}
              >
                Try another email
              </button>

              <div className="forgot-back">
                <Link to="/login">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back to Sign In
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default Forgot;