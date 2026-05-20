import { useNavigate, Link } from "react-router-dom";
import { FaGraduationCap, FaBell } from "react-icons/fa";

function Navbar() {
  const navigate   = useNavigate();
  const isLoggedIn = !!localStorage.getItem("role");

  const getRoleLetter = () => {
    const role = localStorage.getItem("role");
    if (role === "student")    return "S";
    if (role === "company")    return "C";
    if (role === "supervisor") return "A";
    return "?";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo">
        <FaGraduationCap className="logo-icon" />
        <Link to="/" className="logo-text">Darbni</Link>
      </div>

      <div className="nav-links">
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="nav-buttons">
        {isLoggedIn ? (
          <>
            <div className="notif-wrap">
              <FaBell className="notif-icon" />
              <span className="notif-dot">2</span>
            </div>
            <div className="nav-avatar" onClick={handleLogout} title="Click to sign out">
              {getRoleLetter()}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="signin">Sign In</button>
            </Link>
            <Link to="/register">
              <button className="getstarted">Get Started</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;