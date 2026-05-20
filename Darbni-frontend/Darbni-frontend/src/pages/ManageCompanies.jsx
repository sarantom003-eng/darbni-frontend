import { useState } from "react";
import {
  FaSearch, FaBuilding, FaCheck, FaTimes, FaEnvelope,
  FaPhone, FaGlobe, FaMapMarkerAlt, FaCalendarAlt, FaUserTie,
  FaIdBadge, FaBriefcase, FaClock
} from "react-icons/fa";

const INITIAL_COMPANIES = [
  {
    id: 1,
    name: "TechPal Solutions",
    email: "hr@techpal.ps",
    city: "Ramallah",
    registered: "1/15/2025",
    status: "Approved",
    activeInternships: 3,
    field: "Software Development",
    about: "A leading Palestinian software house specializing in web and mobile applications.",
    phone: "+970 2 295 1111",
    website: "https://techpal.ps",
    address: "Al-Masyoun, Ramallah",
    contactPerson: "Layla Saeed",
    role: "HR Manager",
  },
  {
    id: 2,
    name: "DataVision Co.",
    email: "info@datavision.ps",
    city: "Nablus",
    registered: "2/20/2025",
    status: "Approved",
    activeInternships: 2,
    field: "Data Analytics",
    about: "Empowering businesses through data-driven insights and AI solutions.",
    phone: "+970 9 234 5678",
    website: "https://datavision.ps",
    address: "Rafidia, Nablus",
    contactPerson: "Ahmad Jaber",
    role: "Operations Director",
  },
  {
    id: 3,
    name: "CloudNine Tech",
    email: "careers@cloudnine.com",
    city: "Tulkarm",
    registered: "3/10/2025",
    status: "Pending",
    activeInternships: 0,
    field: "Cloud Infrastructure",
    about: "Providing secure and scalable cloud hosting and infrastructure management.",
    phone: "+970 9 267 8901",
    website: "https://cloudnine.com",
    address: "Main Street, Tulkarm",
    contactPerson: "Sami Naser",
    role: "CEO",
  },
  {
    id: 4,
    name: "CyberGuard Inc.",
    email: "admin@cyberguard.ps",
    city: "Bethlehem",
    registered: "3/25/2025",
    status: "Pending",
    activeInternships: 0,
    field: "Cybersecurity",
    about: "Protecting digital assets with state-of-the-art security protocols.",
    phone: "+970 2 274 1234",
    website: "https://cyberguard.ps",
    address: "Manger Square, Bethlehem",
    contactPerson: "Rami Khalil",
    role: "Security Chief",
  },
  {
    id: 5,
    name: "Fake Corp",
    email: "test@fake.com",
    city: "Unknown",
    registered: "4/1/2025",
    status: "Rejected",
    activeInternships: 0,
    field: "Unknown",
    about: "No description provided.",
    phone: "N/A",
    website: "N/A",
    address: "Unknown",
    contactPerson: "Unknown",
    role: "Unknown",
  },
];

const statusColor = (status) => {
  if (status === "Approved") return { bg: "#d1fae5", color: "#059669", border: "1px solid #a7f3d0" };
  if (status === "Pending")  return { bg: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" };
  if (status === "Rejected") return { bg: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" };
  return { bg: "#f5f4f1", color: "#888", border: "1px solid #e8e6ef" };
};

function CompanyModal({ company, onClose, onUpdateStatus }) {
  if (!company) return null;
  const sc = statusColor(company.status);

  return (
    <div className="mc-overlay" onClick={onClose}>
      <div className="mc-modal" onClick={e => e.stopPropagation()}>
        <button className="mc-modal-close" onClick={onClose}><FaTimes /></button>

        <h3 className="mc-modal-title">Company Profile</h3>
        <p className="mc-modal-sub">Full details from the company record.</p>

        {/* Header */}
        <div className="mc-modal-head">
          <div className="mc-modal-avatar"><FaBuilding /></div>
          <div>
            <div className="mc-modal-name">{company.name}</div>
            <div className="mc-modal-badges">
              <span className="mc-badge" style={{ background: sc.bg, color: sc.color, border: sc.border || "none" }}>
                {company.status}
              </span>
              <span className="mc-badge-outline">{company.field}</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mc-modal-about">
          {company.about}
        </div>

        {/* Info Grid */}
        <div className="mc-modal-grid">
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaEnvelope /> Email</div>
            <div className="mc-modal-field-val">{company.email}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaPhone /> Phone</div>
            <div className="mc-modal-field-val">{company.phone}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaGlobe /> Website</div>
            <div className="mc-modal-field-val">{company.website}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaMapMarkerAlt /> City</div>
            <div className="mc-modal-field-val">{company.city}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaMapMarkerAlt /> Address</div>
            <div className="mc-modal-field-val">{company.address}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaCalendarAlt /> Registered</div>
            <div className="mc-modal-field-val">{company.registered}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaUserTie /> Contact Person</div>
            <div className="mc-modal-field-val">{company.contactPerson}</div>
          </div>
          <div className="mc-modal-field">
            <div className="mc-modal-field-label"><FaIdBadge /> Role</div>
            <div className="mc-modal-field-val">{company.role}</div>
          </div>
          <div className="mc-modal-field mc-modal-field-full">
            <div className="mc-modal-field-label"><FaBriefcase /> Active Internships</div>
            <div className="mc-modal-field-val">{company.activeInternships}</div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mc-modal-footer">
          {company.status === "Approved" && (
            <button className="mc-btn-revoke" onClick={() => { onUpdateStatus(company.id, "Rejected"); onClose(); }}>
              Revoke Approval
            </button>
          )}
          {company.status === "Pending" && (
            <>
              <button className="mc-btn-reject" onClick={() => { onUpdateStatus(company.id, "Rejected"); onClose(); }}>
                <FaTimes /> Reject
              </button>
              <button className="mc-btn-approve" onClick={() => { onUpdateStatus(company.id, "Approved"); onClose(); }}>
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
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = companies.filter(c => c.status === "Pending").length;

  const updateStatus = (id, newStatus) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="mc-page">

      {/* Header */}
      <div className="mc-header">
        <h1 className="mc-title">Manage Companies</h1>
        <p className="mc-sub">Approve or reject company registrations</p>
      </div>

      {/* Toolbar */}
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

      {/* Table */}
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>City</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Active Internships</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#bbb", padding: 40 }}>
                  No companies found
                </td>
              </tr>
            )}
            {filtered.map((c) => {
              const sc = statusColor(c.status);
              return (
                <tr key={c.id} className="mc-row" onClick={() => setSelected(c)} style={{ cursor: "pointer" }}>
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
                  <td>{c.registered}</td>
                  <td>
                    <span className="mc-badge" style={{ background: sc.bg, color: sc.color, border: sc.border || "none" }}>
                      {c.status}
                    </span>
                  </td>
                  <td>{c.activeInternships}</td>
                  <td>
                    <div className="mc-actions">
                      {c.status === "Approved" && (
                        <button 
                          className="mc-btn-text mc-text-danger"
                          onClick={(e) => { e.stopPropagation(); updateStatus(c.id, "Rejected"); }}
                        >
                          Revoke
                        </button>
                      )}
                      {c.status === "Pending" && (
                        <>
                          <button 
                            className="mc-btn-outline mc-outline-success"
                            onClick={(e) => { e.stopPropagation(); updateStatus(c.id, "Approved"); }}
                          >
                            <FaCheck /> Approve
                          </button>
                          <button 
                            className="mc-btn-outline mc-outline-danger"
                            onClick={(e) => { e.stopPropagation(); updateStatus(c.id, "Rejected"); }}
                          >
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
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}
