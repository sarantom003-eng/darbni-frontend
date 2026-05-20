import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { 
  FaBriefcase, FaChartLine, FaSearch, FaCheckCircle, 
  FaClock, FaCode, FaPaintBrush, FaDatabase, FaRobot, FaBriefcaseMedical, FaBullhorn,
  FaArrowRight, FaArrowDown, FaQuoteLeft, FaStar
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import heroImage from "../assets/hero.jpg";

const categories = [
  { name: "Software Development", icon: <FaCode /> },
  { name: "UI/UX Design",          icon: <FaPaintBrush /> },
  { name: "Data Analytics",        icon: <FaDatabase /> },
  { name: "AI & Machine Learning", icon: <FaRobot /> },
  { name: "Business Development",  icon: <FaBriefcaseMedical /> },
  { name: "Content & Marketing",   icon: <FaBullhorn /> }
];

const testimonials = [
  { name: "Ahmad Sami", quote: "Darbni connected me with the best tech companies. My internship turned into a full-time job!", avatar: "https://i.pravatar.cc/150?img=11" },
  { name: "Lina Omar",  quote: "The process was so smooth. From searching to approval, everything is well organized.",          avatar: "https://i.pravatar.cc/150?img=5"  },
  { name: "Yousef Ali", quote: "An essential platform for every Palestinian student. It bridges the gap perfectly.",            avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Sara Majed", quote: "I found my dream UI/UX internship here. Highly recommended for graduates.",                    avatar: "https://i.pravatar.cc/150?img=9"  }
];

const COMPANIES = [
  { id: 1, name: "Tech Corp 1", field: "Frontend Developer", location: "Ramallah", duration: "3 Months", type: "In-person", rating: 4, spots: 2 },
  { id: 2, name: "Tech Corp 2", field: "Frontend Developer", location: "Ramallah", duration: "3 Months", type: "Online",    rating: 4, spots: 4 },
  { id: 3, name: "Tech Corp 3", field: "Frontend Developer", location: "Ramallah", duration: "3 Months", type: "Hybrid",    rating: 4, spots: 1 },
];

function SectionConnector() {
  return (
    <motion.div
      className="section-connector"
      initial={{ opacity: 0, height: 0 }}
      whileInView={{ opacity: 1, height: 80 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="connector-glow"
        animate={{ y: [0, 80], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <FaArrowDown className="connector-arrow" />
    </motion.div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <motion.div
      className="section-header"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <h2>{title}</h2>
      <div className="title-underline"></div>
      {subtitle && <p>{subtitle}</p>}
    </motion.div>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page-modern">
      <Navbar />

      {/* HERO */}
      <section id="home" className="hero-modern" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay"></div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>Your Bridge to <br/> <span className="highlight">Professional Training</span></h1>
          <p>Connecting Palestinian university students with technology companies for meaningful internship opportunities.</p>

          <div className="hero-buttons">
            <button className="btn-primary">Start Your Journey <FaArrowRight /></button>
            <button className="btn-secondary" onClick={() => navigate("/login")}>Sign In</button>
          </div>

          <div className="search-box-glass">
            <input type="text" placeholder="Search for training opportunities..." />
            <button className="search-btn">Search</button>
          </div>
        </motion.div>
      </section>

      <SectionConnector />

      {/* CATEGORIES */}
      <section className="explore-categories">
        <SectionTitle title="Explore by Category" subtitle="Find the right path that matches your skills and passion." />
        <div className="category-grid">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              className="category-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="cat-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionConnector />

      {/* HOW IT WORKS */}
      <section className="how-it-works-timeline">
        <SectionTitle title="How Darbni Works" subtitle="A seamless process connecting students, companies, and universities." />
        <div className="timeline-container">
          {[
            { icon: <FaSearch />,      title: "Search & Apply",   desc: "Students search for training opportunities and apply easily." },
            { icon: <FaCheckCircle />, title: "Review & Approve", desc: "Universities review and send approved requests." },
            { icon: <FaChartLine />,   title: "Train & Progress", desc: "Track progress and receive evaluations." },
          ].map((step, index) => (
            <motion.div
              key={index}
              className="timeline-step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionConnector />

      {/* FEATURED OPPORTUNITIES */}
      <section id="opportunities" className="featured-opportunities-modern">
        <SectionTitle title="Featured Opportunities" subtitle="Explore the latest internships." />
        <div className="opportunities-grid">
          {COMPANIES.map((company, index) => (
            <motion.div
              key={company.id}
              className="opportunity-glass-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
              whileHover={{ y: -5 }}
            >
              <div className="opp-header">
                <div className="opp-icon"><FaBriefcase /></div>
                <div className="opp-company">{company.name}</div>
              </div>
              <h3 className="opp-title">{company.field}</h3>
              <div className="opp-details">
                <span><FaLocationDot /> {company.location}</span>
                <span><FaClock /> {company.duration}</span>
              </div>
              <div className="opp-footer">
                <div className="opp-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < company.rating ? "" : "dim"} />
                  ))}
                </div>
                <button
                  className="apply-btn-modern"
                  onClick={() => {
                    localStorage.setItem("selectedCompany", company.id);
                    navigate("/register");
                  }}
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionConnector />

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <SectionTitle title="What People Say" subtitle="Success stories from our students." />
        <div className="testimonials-slider">
          <motion.div
            className="testimonials-track"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((test, index) => (
              <div key={index} className="testimonial-card">
                <FaQuoteLeft className="quote-icon" />
                <p className="quote-text">"{test.quote}"</p>
                <div className="test-author">
                  <img src={test.avatar} alt={test.name} />
                  <span>{test.name}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;