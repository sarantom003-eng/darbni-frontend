import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authApi } from "../api/client";

function ResetPassword() {
  const { token }                     = useParams();
  const navigate                      = useNavigate();

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw,          setShowPw]          = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [apiError,        setApiError]        = useState("");
  const [success,         setSuccess]         = useState(false);
  const [errors,          setErrors]          = useState({});

  const validate = () => {
    const e = {};
    if (!newPassword)                e.newPassword     = "Password is required";
    else if (newPassword.length < 6) e.newPassword     = "Min 6 characters";
    if (!confirmPassword)            e.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReset = async () => {
    if (!validate()) return;

    setLoading(true);
    setApiError("");

    try {
      await authApi.resetPassword(token, { newPassword, confirmPassword });
      setSuccess(true);
    } catch (err) {
      setApiError(err.message);
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          {!success ? (
            <>
              <h1 className="login-title">Reset Password</h1>
              <p className="login-sub">Enter your new password below.</p>

              {apiError && (
                <div className="contact-success" style={{ background: "#ffecec", color: "#b00020", marginBottom: "16px" }}>
                  {apiError}
                </div>
              )}

              {/* New Password */}
              <div className="login-field">
                <label htmlFor="new-password">New Password</label>
                <div className="login-pw-wrap">
                  <input
                    className={`login-inp${errors.newPassword ? " error" : newPassword.length >= 6 ? " ok" : ""}`}
                    type={showPw ? "text" : "password"}
                    id="new-password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }}
                    disabled={loading}
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
                {errors.newPassword && <p className="reg-err">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="login-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="login-pw-wrap">
                  <input
                    className={`login-inp${errors.confirmPassword ? " error" : confirmPassword && newPassword === confirmPassword ? " ok" : ""}`}
                    type={showConfirm ? "text" : "password"}
                    id="confirm-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                    disabled={loading}
                  />
                  <button className="login-eye-btn" type="button" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm
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
                {errors.confirmPassword && <p className="reg-err">{errors.confirmPassword}</p>}
              </div>

              <button
                className="login-btn forgot-btn"
                onClick={handleReset}
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
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
              <h1 className="login-title">Password Reset!</h1>
              <p className="login-sub">Your password has been reset successfully.</p>

              <div className="forgot-success-note">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="#27ae60" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>You can now sign in with your new password</span>
              </div>

              <button
                className="login-btn"
                style={{ marginTop: "20px" }}
                onClick={() => navigate("/login")}
              >
                Go to Sign In
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default ResetPassword;