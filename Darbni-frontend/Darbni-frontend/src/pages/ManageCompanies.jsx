import { useState, useEffect } from "react";
import {
  FaSearch, FaBuilding, FaCheck, FaTimes, FaEnvelope,
  FaPhone, FaGlobe, FaMapMarkerAlt, FaCalendarAlt, FaUserTie,
  FaIdBadge, FaClock, FaSpinner, FaExclamationTriangle
} from "react-icons/fa";
import { api } from "../api/client";

const statusColor = (status) => {
  if (status === "approved") return { bg: "#d1fae5", color: "#059669", border: "1px solid #a7f3d0" };
  if (status === "pending")  return { bg: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" };
  if (status === "rejected") return { bg: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" };
  return { bg: "#f5f4f1", color: "#888", border: "1px solid #e8e6ef" };
};

const statusLabel = (status) => {
  if (status === "approved") return "Approved";
  if (status === "pending")  return "Pending";
  if (status === "rejected") return "Rejected";
  return status;
};

function CompanyModal({ company, onClose, onApprove, onReject, isProcessing }) {
  if (!company) return null;
  const sc = statusColor(company.status);

  return (
    <div className="mc-overlay" onClick={onClose}>
      <div className="mc-modal" onClick={e => e.stopPropagation()}>
        <button className="mc-modal-close" onClick={onClose}><FaTimes /></button>
        <h3 className="mc-modal-title">Company Profile</h3>
        <p className="mc-modal-sub">Full details from the company record.</p>
        <div className="mc-modal-head">
          <div className="mc-modal-avatar"><FaBuilding /></div>
          <div>
            <div className="mc-modal-name">{company.name}</div>
            <div className="mc-modal-badges">
              <span className="mc-badge" style={{ background: sc.bg, color: sc.color, border: sc.border || "none" }}>
                {statusLabel(company.status)}
              </span>
              <span className="mc-badge-outline">{company.industry || "N/A"}</span>
            </div>
          </div>
        </div>
        <div className="mc-modal-about">{company.about || "—"}</div>
        <div className="mc-modal-grid">
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaEnvelope /> Email</div>
            <div className="mc-modal-field-val">{company.email || "N/A"}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaPhone /> Phone</div>
            <div className="mc-modal-field-val">{company.phone || "N/A"}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaGlobe /> Website</div>
            <div className="mc-modal-field-val">{company.website || "N/A"}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaMapMarkerAlt /> City</div>
            <div className="mc-modal-field-val">{company.city || "N/A"}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaMapMarkerAlt /> Address</div>
            <div className="mc-modal-field-val">{company.location || "N/A"}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaUserTie /> Trainer Name</div>
            <div className="mc-modal-field-val">
              {company.trainer?.firstName
                ? `${company.trainer.firstName} ${company.trainer.lastName || ""}`.trim()
                : "N/A"}
            </div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaIdBadge /> Trainer Job Title</div>
            <div className="mc-modal-field-val">{company.trainer?.jobTitle || "N/A"}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaCalendarAlt /> Registered</div>
            <div className="mc-modal-field-val">{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "N/A"}</div>
          </div>
        </div>
        <div className="mc-modal-footer">
          {company.status === "approved" && (
            <button className="mc-btn-revoke" onClick={() => { onReject(company.userId); onClose(); }} disabled={isProcessing}>
              {isProcessing ? <FaSpinner className="spinner" /> : null} Revoke Approval
            </button>
          )}
          {company.status === "pending" && (
            <>
              <button className="mc-btn-reject" onClick={() => { onReject(company.userId); onClose(); }} disabled={isProcessing}>
                <FaTimes /> Reject
              </button>
              <button className="mc-btn-approve" onClick={() => { onApprove(company.userId); onClose(); }} disabled={isProcessing}>
                <FaCheck /> Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const mapCompany = (c, defaultStatus) => ({
    userId: c.user?._id || "",
    name: c.profile?.name || "N/A",
    email: c.user?.email || "N/A",
    industry: c.profile?.industry || "N/A",
    city: c.profile?.city || "N/A",
    phone: c.profile?.phone || "N/A",
    website: c.profile?.website || "N/A",
    about: c.profile?.about || "",
    location: c.profile?.location || "N/A",
    trainer: c.profile?.trainer || {},
    createdAt: c.profile?.createdAt || "",
    status: c.user?.verificationStatus || defaultStatus,
  });

  const fetchCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const [pendingRes, approvedRes] = await Promise.allSettled([
        api("/supervisor/companies/pending"),
        api("/supervisor/companies"),
      ]);
      const pending = pendingRes.status === "fulfilled"
        ? (pendingRes.value.companies || []).map(c => mapCompany(c, "pending"))
        : [];
      const approved = approvedRes.status === "fulfilled"
        ? (approvedRes.value.companies || []).map(c => mapCompany(c, "approved"))
        : [];
      const allIds = new Set(pending.map(c => c.userId));
      setCompanies([...pending, ...approved.filter(c => !allIds.has(c.userId))]);
    } catch (err) {
      setError(err.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  // ✅ approve بدون body
  const handleApprove = async (userId) => {
    setIsProcessing(true);
    try {
      await api(`/supervisor/companies/${userId}/approve`, { method: "PATCH" });
      await fetchCompanies();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ عدلي handleReject هيك
const handleReject = async (userId) => {
  setIsProcessing(true);
  try {
    await api(`/supervisor/companies/${userId}/reject`, {
      method: "PATCH",
      body: { rejectionReason: "Approval revoked by supervisor" },
    });
    await fetchCompanies();
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    setIsProcessing(false);
  }
};

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

  const pendingCount = companies.filter(c => c.status === "pending").length;

  if (loading) return (
    <div className="mc-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <FaSpinner className="spinner" />
    </div>
  );

  if (error) return (
    <div className="mc-page">
      <div className="mc-error">
        <FaExclamationTriangle /><p>{error}</p>
        <button onClick={fetchCompanies}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="mc-page">
      <div className="mc-header">
        <h1 className="mc-title">Manage Companies</h1>
        <p className="mc-sub">Approve or reject company registrations</p>
      </div>
      <div className="mc-toolbar">
        <div className="mc-search-wrap">
          <FaSearch className="mc-search-icon" />
          <input
            className="mc-search-inp"
            placeholder="Search companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {pendingCount > 0 && (
          <span className="mc-pending-badge">
            <FaClock /> {pendingCount} pending approval
          </span>
        )}
      </div>
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>City</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#bbb", padding: 40 }}>No companies found</td>
              </tr>
            )}
            {filtered.map((c) => {
              const sc = statusColor(c.status);
              return (
                <tr key={c.userId} className="mc-row" onClick={() => setSelected(c)} style={{ cursor: "pointer" }}>
                  <td>
                    <div className="mc-company-cell">
                      <div className="mc-company-icon"><FaBuilding /></div>
                      <div>
                        <div className="mc-company-name">{c.name}</div>
                        <div className="mc-company-email">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.city}</td>
                  <td>
                    <span className="mc-badge" style={{ background: sc.bg, color: sc.color, border: sc.border || "none" }}>
                      {statusLabel(c.status)}
                    </span>
                  </td>
                  <td>
                    <div className="mc-actions">
                      {c.status === "approved" && (
                        <button className="mc-btn-text mc-text-danger"
                          onClick={(e) => { e.stopPropagation(); handleReject(c.userId); }}
                          disabled={isProcessing}>
                          Revoke
                        </button>
                      )}
                      {c.status === "pending" && (
                        <>
                          <button className="mc-btn-outline mc-outline-success"
                            onClick={(e) => { e.stopPropagation(); handleApprove(c.userId); }}
                            disabled={isProcessing}>
                            {isProcessing ? <FaSpinner className="spinner" /> : <FaCheck />} Approve
                          </button>
                          <button className="mc-btn-outline mc-outline-danger"
                            onClick={(e) => { e.stopPropagation(); handleReject(c.userId); }}
                            disabled={isProcessing}>
                            <FaTimes /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selected && (
        <CompanyModal
          company={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}