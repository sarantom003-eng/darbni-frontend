import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <h3>Darbni</h3>
          <p>
            Connecting students with real training opportunities
            across Palestine.
          </p>
        </div>

        <div className="footer-links">
          <h4>Platform</h4>

          {/* LandingPage.jsx */}
          <Link to="/">Home</Link>

          {/* AboutPage.jsx */}
          <Link to="/about">About</Link>

          {/* ContactPage.jsx */}
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-links">
          <h4>Account</h4>

          {/* Login.jsx */}
          <Link to="/login">Sign In</Link>

          {/* Register.jsx */}
          <Link to="/register">Create Account</Link>
        </div>

      </div>

      <div className="footer-bottom">
        ©️ 2026 Darbni. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;