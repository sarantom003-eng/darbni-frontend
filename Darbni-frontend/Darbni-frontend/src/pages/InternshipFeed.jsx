import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaStar, FaRegStar } from "react-icons/fa";
import { trainingApi } from "../api/client";

const mapTraining = (t) => ({
  id: t._id,
  name: t.companyId?.name || "Company",
  field: t.field || t.title,
  title: t.title,
  location: t.city || t.location || t.companyId?.city || "",
  type: (t.training_type || "").replace("in-person", "In-person").replace("online", "Online").replace("hybrid", "Hybrid"),
  rating: t.companyRating || 0,
  reviews: t.totalRatings || 0,
  spots: Math.max(0, (t.capacity || 0) - (t.acceptedCount || 0)),
});

const LOCATIONS = ["All Locations", "Tulkarm", "Ramallah", "Nablus", "Hebron"];
const TYPES = ["All Types", "In-person", "Online", "Hybrid"];

function Stars({ rating }) {
  return (
    <div className="feed-stars">
      {[1,2,3,4,5].map(i => (
        i <= Math.round(rating)
          ? <FaStar key={i} className="star-filled" />
          : <FaRegStar key={i} className="star-empty" />
      ))}
      <span className="feed-rating-num">({rating})</span>
    </div>
  );
}

function InternshipFeed() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [type, setType] = useState("All Types");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    trainingApi.list({
      city: location === "All Locations" ? "" : location,
      training_type: type === "All Types" ? "" : type.toLowerCase(),
      field: search,
    })
      .then(data => { if (alive) setCompanies((data.trainings || []).map(mapTraining)); })
      .catch(err => { if (alive) setError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [search, location, type]);

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.field.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    const matchLocation = location === "All Locations" || c.location === location;
    const matchType = type === "All Types" || c.type === type;
    return matchSearch && matchLocation && matchType;
  });

  return (
    <>
      <h1 className="page-title">Internship Feed</h1>
      <p className="page-sub">Discover and apply to training opportunities</p>

      <div className="feed-search-row">
        <div className="feed-search-wrap">
          <FaSearch className="feed-search-icon" />
          <input
            className="feed-search-inp"
            placeholder="Search by field, company, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="feed-filter-sel" value={location} onChange={e => setLocation(e.target.value)}>
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select className="feed-filter-sel" value={type} onChange={e => setType(e.target.value)}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {error && <div className="feed-empty" style={{ color: "#b00020" }}>{error}</div>}
      {loading ? (
        <div className="feed-empty">Loading opportunities...</div>
      ) : filtered.length === 0 ? (
        <div className="feed-empty">No opportunities found matching your filters.</div>
      ) : (
        <div className="feed-grid">
          {filtered.map(c => (
            <div key={c.id} className="feed-card" onClick={() => navigate(`/student/internship/${c.id}`)}>
              <div className="feed-card-top">
                <div>
                  <div className="feed-card-name">{c.name}</div>
                  <div className="feed-card-field">
                    <span className="feed-field-icon">🏢</span> {c.field}
                  </div>
                </div>
              </div>
              <Stars rating={c.rating} />
              <div className="feed-tags">
                <span className="feed-tag"><FaMapMarkerAlt /> {c.location}</span>
                <span className="feed-tag">💬 {c.type}</span>
              </div>
              <div className="feed-card-bottom">
                <span className={`feed-spots${c.spots === 0 ? " full" : ""}`}>
                  {c.spots === 0 ? "Full" : `${c.spots} spots left`}
                </span>
                <button
                  className={`feed-view-btn${c.spots === 0 ? " disabled" : ""}`}
                  disabled={c.spots === 0}
                  onClick={e => { e.stopPropagation(); navigate(`/student/internship/${c.id}`); }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default InternshipFeed;