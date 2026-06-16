import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaMapMarkerAlt, FaDesktop, FaClock, FaUsers, FaPaperPlane } from "react-icons/fa";
import { applicationApi, trainingApi } from "../api/client";

function Stars({ rating }) {
  return (
    <div className="feed-stars">
      {[1,2,3,4,5].map(i => (
        i <= Math.round(rating)
          ? <FaStar key={i} className="star-filled" />
          : <FaRegStar key={i} className="star-empty" />
      ))}
      <span className="feed-rating-num">({rating} rating)</span>
    </div>
  );
}

function mapTraining(data) {
  const t = data.training;
  return {
    id: t._id,
    name: t.companyId?.name || "Company",
    field: t.field || t.title,
    title: t.title,
    location: t.city || t.location || t.companyId?.city || "",
    type: (t.training_type || "").replace("in-person", "In-person").replace("online", "Online").replace("hybrid", "Hybrid"),
    duration: `${t.totalHours || 0}h`,
    startDate: t.startDate ? new Date(t.startDate).toLocaleDateString() : "N/A", // ← هاد
weeklyHours: t.weeklyHours || 0,
    weeklyHours: t.weeklyHours || 0,
    rating: data.companyRating || 0,
    reviews: data.totalRatings || 0,
    spots: data.remainingSeats ?? Math.max(0, (t.capacity || 0) - (t.acceptedCount || 0)),
    filled: t.acceptedCount || 0,
    total: t.capacity || 0,
    about: t.description || t.companyId?.about || "No description provided.",
    requirements: t.skills?.length ? t.skills : ["Student eligible for practical training", "Completed required credit hours"],
    gains: [t.benefits || "Practical workplace experience"],
  };
}

function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    trainingApi.get(id)
      .then(data => { if (alive) setCompany(mapTraining(data)); })
      .catch(err => { if (alive) setError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}>Loading internship...</div>;
  if (error) return <div style={{ padding: 40, color: "#b00020" }}>{error}</div>;
  if (!company) return <div style={{ padding: 40 }}>Internship not found.</div>;

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await applicationApi.create(company.id, { message });
      setSubmitted(true);
      setShowModal(false);
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="detail-back" onClick={() => navigate("/student/feed")}>← Back to Feed</button>

      <div className="detail-card">
        <div className="detail-header">
          <div>
            <h2 className="detail-name">{company.name}</h2>
            <div className="detail-field">{company.title || company.field}</div>
            <Stars rating={company.rating} />
          </div>
          {company.spots > 0 && <button className="detail-apply-top" onClick={() => setShowModal(true)}>Apply Now</button>}
        </div>

        <div className="detail-info-row">
          <div className="detail-info-box"><FaMapMarkerAlt className="detail-info-icon" /><div><div className="detail-info-label">Location</div><div className="detail-info-val">{company.location || "—"}</div></div></div>
          <div className="detail-info-box"><FaDesktop className="detail-info-icon" /><div><div className="detail-info-label">Type</div><div className="detail-info-val">{company.type || "—"}</div></div></div>
          <div className="detail-info-box"><FaClock className="detail-info-icon" /><div><div className="detail-info-label">Duration</div><div className="detail-info-val">{company.duration}</div></div></div>
          <div className="detail-info-row">
  <div className="detail-info-box"><FaMapMarkerAlt className="detail-info-icon" /><div><div className="detail-info-label">Location</div><div className="detail-info-val">{company.location || "—"}</div></div></div>
  <div className="detail-info-box"><FaDesktop className="detail-info-icon" /><div><div className="detail-info-label">Type</div><div className="detail-info-val">{company.type || "—"}</div></div></div>
  <div className="detail-info-box"><FaClock className="detail-info-icon" /><div><div className="detail-info-label">Duration</div><div className="detail-info-val">{company.duration}</div></div></div>
  <div className="detail-info-box"><FaClock className="detail-info-icon" /><div><div className="detail-info-label">Start Date</div><div className="detail-info-val">{company.startDate}</div></div></div>
  <div className="detail-info-box"><FaUsers className="detail-info-icon" /><div><div className="detail-info-label">Positions</div><div className="detail-info-val">{company.filled}/{company.total}</div></div></div>
</div>
          <div className="detail-info-box"><FaUsers className="detail-info-icon" /><div><div className="detail-info-label">Positions</div><div className="detail-info-val">{company.filled}/{company.total}</div></div></div>
        </div>

        <div className="detail-section"><h3 className="detail-sec-title">About the Internship</h3><p className="detail-sec-text">{company.about}</p></div>
        <div className="detail-section"><h3 className="detail-sec-title">Requirements</h3><ul className="detail-list">{company.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
        <div className="detail-section"><h3 className="detail-sec-title">What You'll Gain</h3><ul className="detail-list">{company.gains.map((g, i) => <li key={i}>{g}</li>)}</ul></div>

        <div className="detail-bottom-btns">
          {company.spots > 0 ? <button className="detail-apply-btn" onClick={() => setShowModal(true)}>Apply to Internship</button> : <div className="detail-full-msg">This internship is currently full.</div>}
        </div>
        {error && <div className="detail-success" style={{ background: "#ffecec", color: "#b00020" }}>{error}</div>}
        {submitted && <div className="detail-success">✅ Application submitted! You can track it in My Applications.</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Apply to {company.name}</h3><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <p className="modal-sub">Write a short message to introduce yourself for the <strong>{company.field}</strong> internship.</p>
            <textarea className="modal-textarea" placeholder="I'm interested in this internship because..." value={message} onChange={e => setMessage(e.target.value.slice(0, 500))} rows={5} />
            <div className="modal-count">{message.length}/500</div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-submit" onClick={handleSubmit} disabled={submitting}><FaPaperPlane /> {submitting ? "Submitting..." : "Submit Application"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InternshipDetail;