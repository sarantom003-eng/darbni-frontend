import { useState, useEffect } from "react";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import { api } from "../api/client";

const CRITERIA = [
  { key: "mentorship",   label: "Mentorship & Supervision",  desc: "Quality of guidance from your training supervisor." },
  { key: "environment",  label: "Work Environment",           desc: "Inclusivity, safety, and overall workplace atmosphere." },
  { key: "learning",     label: "Learning Opportunities",     desc: "Real tasks, exposure to tools, and skill growth." },
  { key: "communication",label: "Communication",              desc: "Clarity of expectations, feedback, and team collaboration." },
];

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <FaStar
          key={star}
          style={{
            fontSize: 22,
            cursor: "pointer",
            color: star <= (hover || value) ? "#6c5ce7" : "#ddd",
            transition: "color 0.15s",
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}

// دالة لجلب الـ applicationId المكتمل (status = completed)
async function getCompletedApplicationId() {
  const appsRes = await api("/applications/my");
  const applications = appsRes.applications || [];
  // جلب أول تطبيق مكتمل ولم يتم تقييمه بعد
  const completedApp = applications.find(app => 
    app.status === "completed"
  );
  if (!completedApp) throw new Error("No completed training found to rate");
  return { 
    applicationId: completedApp._id, 
    companyName: completedApp.companyId?.name || "Company",
    trainingTitle: completedApp.trainingId?.title || "Training"
  };
}

export default function RateCompany() {
  const [applicationId, setApplicationId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [ratings, setRatings] = useState({
    mentorship: 0, environment: 0,
    learning: 0, communication: 0,
  });
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedOverall, setSubmittedOverall] = useState(null);

  useEffect(() => {
    let alive = true;
    const loadData = async () => {
      try {
        const { applicationId: appId, companyName: name, trainingTitle: title } = await getCompletedApplicationId();
        if (!alive) return;
        setApplicationId(appId);
        setCompanyName(name);
        setTrainingTitle(title);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    loadData();
    return () => { alive = false; };
  }, []);

  const setRating = (key, val) => {
    setRatings(r => ({ ...r, [key]: val }));
    setFormError(false);
  };

  const ratedCount = Object.values(ratings).filter(v => v > 0).length;
  const allRated = ratedCount === CRITERIA.length;
  const overallAvg = allRated
    ? (Object.values(ratings).reduce((s, v) => s + v, 0) / CRITERIA.length).toFixed(1)
    : null;

  const handleSubmit = async () => {
    if (!allRated) { setFormError(true); return; }
    
    setSubmitting(true);
    try {
      const res = await api("/ratings", {
        method: "POST",
        body: {
          applicationId,
          overallRating: parseFloat(overallAvg),
          criteria: ratings,
          comments: comment,
        }
      });
      setSubmittedOverall(res.rating?.overallRating || overallAvg);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}>Loading...</div>;
  if (error) return <div style={{ textAlign: "center", padding: 50, color: "#e74c3c" }}>{error}</div>;

  if (submitted) {
    return (
      <div style={{ maxWidth: 620 }}>
        <h1 className="page-title">Rate Your Training Company</h1>
        <p className="page-sub">Share your experience — your rating shapes the company's public score.</p>
        <div className="rate-success-card">
          <div className="rate-success-icon">⭐</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1729", marginBottom: 6 }}>
            Evaluation Submitted!
          </h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
            Thank you for rating <strong>{companyName}</strong>. Your feedback helps future students.
          </p>
          <div className="rate-success-avg">
            <span style={{ fontSize: 28, fontWeight: 700, color: "#4a3fa0" }}>{submittedOverall}</span>
            <span style={{ fontSize: 14, color: "#aaa" }}> / 5 overall</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 620 }}>
      <h1 className="page-title">Rate Your Training Company</h1>
      <p className="page-sub">Share your experience — your rating shapes the company's public score.</p>

      <div className="rate-info-box">
        <span className="rate-info-icon">ℹ</span>
        <p>
          Each company's star rating shown on training opportunities is the{" "}
          <strong>average of all completed-student evaluations</strong>. Please rate fairly
          and based on your full training experience.
        </p>
      </div>

      {formError && (
        <div className="rate-error-banner">
          <strong>Please rate all criteria</strong>
          <div style={{ fontSize: 13, marginTop: 3 }}>
            All criteria are required so the average is fair and complete.
          </div>
        </div>
      )}

      <div className="rate-card">
        <div className="rate-card-header">
          <div>
            <div className="rate-company-name">{companyName}</div>
            <div className="rate-company-hint">{trainingTitle}</div>
          </div>
          <span className="rate-company-badge">Training Completed</span>
        </div>

        {CRITERIA.map((c, i) => (
          <div key={c.key} className="rate-criterion">
            <div>
              <div className="rate-criterion-label">{c.label}</div>
              <div className="rate-criterion-desc">{c.desc}</div>
            </div>
            <StarRating
              value={ratings[c.key]}
              onChange={val => setRating(c.key, val)}
            />
            {i < CRITERIA.length - 1 && <div className="rate-divider" />}
          </div>
        ))}

        <div className="rate-avg-box">
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1729" }}>Overall Average</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Auto-calculated from your scores above</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#4a3fa0" }}>
              {overallAvg ?? "—"}
            </span>
            <span style={{ fontSize: 14, color: "#aaa" }}>/ 5</span>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label className="rate-comment-label">Comments (optional)</label>
          <textarea
            className="rate-textarea"
            rows={5}
            placeholder="Share details about your experience, what you learned, and any suggestions..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <button className="rate-submit-btn" onClick={handleSubmit} disabled={submitting}>
          <FaPaperPlane /> {submitting ? "Submitting..." : "Submit Evaluation"}
        </button>
      </div>
    </div>
  );
}