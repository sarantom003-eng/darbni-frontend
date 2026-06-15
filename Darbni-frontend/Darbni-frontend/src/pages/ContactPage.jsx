import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { contactApi } from "../api/client";

function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await contactApi.send(form);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="contact-body">

        <div className="contact-form-wrap">
          <h2>Send us a Message</h2>
          {sent && <div className="contact-success">✓ Message sent successfully!</div>}
          {error && <div className="contact-success" style={{ background: "#ffecec", color: "#b00020" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-field">
                <label>Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="contact-field">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="contact-field">
              <label>Subject</label>
              <input
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                required
                placeholder="How can we help?"
              />
            </div>
            <div className="contact-field">
              <label>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                placeholder="Tell us more about your inquiry..."
              />
            </div>
            <button type="submit" className="contact-submit" disabled={loading}>
              {loading ? "Sending..." : "✉ Send Message"}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p className="contact-info-desc">
            Whether you're a student looking for internships, a company wanting to
            partner, or a university supervisor with questions, we're here to help.
          </p>
          <div className="contact-info-card">
            <div className="contact-info-icon">✉</div>
            <div>
              <span>Email</span>
              <strong>darbni.platform@outlook.com</strong>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon">📞</div>
            <div>
              <span>Phone</span>
              <strong>+970 590000000</strong>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon">📍</div>
            <div>
              <span>Address</span>
              <strong>Palestine Technical University – Kadoorie, Tulkarm</strong>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon">🕐</div>
            <div>
              <span>Hours</span>
              <strong>Sun - Thu: 8:00 AM - 4:00 PM</strong>
            </div>
          </div>
        </div>
      </div>

    

      <Footer />
    </>
  );
}

export default ContactPage;