import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="about-hero">
        <h1>About Darbni</h1>
        <p>
          A graduation project from Palestine Technical University – Kadoorie,
          designed to bridge the gap between students and professional training opportunities.
        </p>
      </div>

      <div className="about-mission">
        <div className="about-mission-text">
          <h2>Our Mission</h2>
          <p>
            Our platform connects Palestinian university students with technology companies, facilitating meaningful internship experiences that prepare
students for their professional careers.
          </p>
          <p>
            We believe every student deserves access to quality training
            opportunities, and every company benefits from fresh talent and
            innovative ideas.
          </p>
          <ul className="about-checklist">
            <li><span>✓</span> Connecting students with 150+ partner companies</li>
            <li><span>✓</span> Streamlined application and approval process</li>
            <li><span>✓</span> Real-time progress tracking and evaluation</li>
            <li><span>✓</span> University supervisor oversight and support</li>
          </ul>
        </div>

        <div className="about-stats">
          <div className="stat-card">
            <span className="stat-icon">🎓</span>
            <span className="stat-number">2,500+</span>
            <span className="stat-label">Students Trained</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏢</span>
            <span className="stat-number">150+</span>
            <span className="stat-label">Partner Companies</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <span className="stat-number">50+</span>
            <span className="stat-label">University Supervisors</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <span className="stat-number">95%</span>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
      </div>

      <div className="about-values">
        <h2>Our Values</h2>
        <p className="about-values-sub">The principles that guide everything we do</p>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <h3>Mission-Driven</h3>
            <p>Empowering Palestinian students with real-world experience</p>
          </div>
          <div className="value-card">
            <div className="value-icon">❤️</div>
            <h3>Student-Centered</h3>
            <p>Every feature designed with student success in mind</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>Community Impact</h3>
            <p>Building bridges between education and industry</p>
          </div>
          <div className="value-card">
            <div className="value-icon">⭐</div>
            <h3>Excellence</h3>
            <p>Committed to quality training and meaningful outcomes</p>
          </div>
        </div>
      </div>

      <div className="about-team">
        <h2>Our Team</h2>
        <p className="about-team-sub">Built with passion by students, for students</p>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">S</div>
            <h3>Sara Tomeh</h3>
            <p>Frontend Developer</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">L</div>
            <h3>Lubna Almahdi</h3>
            <p>Backend Developer</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutPage;
