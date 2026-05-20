import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaClock, FaCheckCircle, FaPaperPlane, FaTimes } from "react-icons/fa";
import { applicationApi } from "../api/client";

const STATUS_CONFIG = {
  awaiting_company_approval: { label: "Pending Company Approval", color: "#b7791f", bg: "#fff8e1" },
  company_approved:          { label: "Approved by Company",      color: "#4a3fa0", bg: "#f0eff5" },
  company_rejected:          { label: "Rejected by Company",      color: "#e74c3c", bg: "#fff0f0" },
  auto_cancelled:            { label: "Cancelled (Expired)",      color: "#888",    bg: "#f5f5f5" },
  pending_university:        { label: "Awaiting University Approval", color: "#b7791f", bg: "#fff8e1" },
  university_approved:       { label: "Approved by University",   color: "#27ae60", bg: "#f0fff4" },
  university_rejected:       { label: "Rejected by University",   color: "#e74c3c", bg: "#fff0f0" },
  company_final_approved:    { label: "Final Approved",           color: "#27ae60", bg: "#f0fff4" },
  in_training:               { label: "In Training",              color: "#4a3fa0", bg: "#f0eff5" },
  completed:                 { label: "Completed",                color: "#27ae60", bg: "#f0fff4" },
};

// دالة حساب الوقت المتبقي
function getTimeLeft(deadlineDate) {
  if (!deadlineDate) return null;
  const now = new Date();
  const deadline = new Date(deadlineDate);
  const diffMs = deadline - now;
  if (diffMs <= 0) return "Expired";
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours}h remaining`;
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  if (remainingHours > 0) return `${diffDays}d ${remainingHours}h remaining`;
  return `${diffDays}d remaining`;
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#888", bg: "#f0f0f0" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}44`,
      borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600,
    }}>
      {cfg.label}
    </span>
  );
}

function TrainingRequestModal({ app, onClose, onSubmit }) {
  const [semester, setSemester] = useState("Spring");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [major, setMajor] = useState(localStorage.getItem("major") || "");
  const [fullName, setFullName] = useState(`${localStorage.getItem("firstName") || ""} ${localStorage.getItem("lastName") || ""}`.trim());
  const [universityId, setUniversityId] = useState(localStorage.getItem("studentId") || "");
  const [mobile, setMobile] = useState(localStorage.getItem("phone") || "");
  const [creditHours, setCreditHours] = useState("");
  const [companyName, setCompanyName] = useState(app?.companyId?.name || app?.companyName || "");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split("T")[0]);
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorTitle, setSupervisorTitle] = useState("");
  const [supervisorPhone, setSupervisorPhone] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const clrErr = (f) => setErrors(p => ({ ...p, [f]: undefined }));

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Required";
    if (!universityId.trim()) e.universityId = "Required";
    if (!mobile.trim()) e.mobile = "Required";
    if (!creditHours || Number(creditHours) < 90) e.creditHours = "Must be ≥ 90";
    if (!companyAddress.trim()) e.companyAddress = "Required";
    if (!companyPhone.trim()) e.companyPhone = "Required";
    if (!supervisorName.trim()) e.supervisorName = "Required";
    if (!supervisorTitle.trim()) e.supervisorTitle = "Required";
    if (!supervisorPhone.trim()) e.supervisorPhone = "Required";
    if (!supervisorEmail.trim()) e.supervisorEmail = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await onSubmit({
        semester,
        academicYear,
        major,
        studentFullName: fullName,
        studentPhone: mobile,
        completedCredits: Number(creditHours),
        companyName,
        companyAddress,
        companyPhone,
        trainerName: supervisorName,
        supervisorJobTitle: supervisorTitle,
        trainerPhone: supervisorPhone,
        trainerEmail: supervisorEmail,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inp = (hasErr) => ({
    display: "block", width: "100%", padding: "10px 12px",
    borderRadius: 8, fontSize: 14, fontFamily: "inherit",
    border: hasErr ? "1.5px solid #e74c3c" : "1.5px solid #dddbe8",
    outline: "none", background: "#fafafa", boxSizing: "border-box",
    color: "#1a1a2e",
  });

  const lbl = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 };
  const errTxt = { fontSize: 11, color: "#e74c3c", marginTop: 2 };
  const half = { flex: "0 0 calc(50% - 6px)", display: "flex", flexDirection: "column", gap: 4 };
  const full = { flex: "0 0 100%", display: "flex", flexDirection: "column", gap: 4 };
  const row = { display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 };
  const secH = { fontWeight: 600, fontSize: 13, color: "#4a3fa0", marginBottom: 10, marginTop: 4, borderBottom: "1px solid #e8e6ef", paddingBottom: 6 };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 28,
        maxWidth: 580, width: "100%", maxHeight: "85vh",
        overflowY: "auto", position: "relative",
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 16, color: "#888",
        }}><FaTimes /></button>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1729", marginBottom: 6 }}>🎓 Submit Training Request to University</h3>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Complete the official training request. Your university supervisor must approve it within 3 days.</p>

        <div style={secH}>🎓 Academic Information</div>
        <div style={row}>
          <div style={half}><label style={lbl}>Semester</label><input value={semester} onChange={e => setSemester(e.target.value)} style={inp(false)} /></div>
          <div style={half}><label style={lbl}>Academic Year</label><input value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={inp(false)} /></div>
          <div style={half}><label style={lbl}>Major</label><input value={major} onChange={e => { setMajor(e.target.value); clrErr("major"); }} style={inp(errors.major)} />{errors.major && <span style={errTxt}>{errors.major}</span>}</div>
        </div>

        <div style={secH}>👤 Student Information</div>
        <div style={row}>
          <div style={half}><label style={lbl}>Full Name</label><input value={fullName} onChange={e => { setFullName(e.target.value); clrErr("fullName"); }} style={inp(errors.fullName)} />{errors.fullName && <span style={errTxt}>{errors.fullName}</span>}</div>
          <div style={half}><label style={lbl}>University ID</label><input value={universityId} onChange={e => { setUniversityId(e.target.value); clrErr("universityId"); }} style={inp(errors.universityId)} />{errors.universityId && <span style={errTxt}>{errors.universityId}</span>}</div>
          <div style={half}><label style={lbl}>Mobile</label><input value={mobile} onChange={e => { setMobile(e.target.value); clrErr("mobile"); }} style={inp(errors.mobile)} />{errors.mobile && <span style={errTxt}>{errors.mobile}</span>}</div>
          <div style={half}><label style={lbl}>Credit Hours</label><input type="number" value={creditHours} onChange={e => { setCreditHours(e.target.value); clrErr("creditHours"); }} style={inp(errors.creditHours)} />{errors.creditHours && <span style={errTxt}>{errors.creditHours}</span>}</div>
        </div>

        <div style={secH}>🏢 Company & Training Supervisor</div>
        <div style={row}>
          <div style={full}><label style={lbl}>Company Name</label><input value={companyName} disabled style={inp(false)} /></div>
          <div style={full}><label style={lbl}>Company Address</label><textarea rows={3} value={companyAddress} onChange={e => { setCompanyAddress(e.target.value); clrErr("companyAddress"); }} style={{ ...inp(errors.companyAddress), resize: "vertical" }} />{errors.companyAddress && <span style={errTxt}>{errors.companyAddress}</span>}</div>
          <div style={half}><label style={lbl}>Company Phone</label><input value={companyPhone} onChange={e => { setCompanyPhone(e.target.value); clrErr("companyPhone"); }} style={inp(errors.companyPhone)} />{errors.companyPhone && <span style={errTxt}>{errors.companyPhone}</span>}</div>
          <div style={half}><label style={lbl}>Submission Date</label><input type="date" value={submissionDate} onChange={e => setSubmissionDate(e.target.value)} style={inp(false)} /></div>
          <div style={half}><label style={lbl}>Supervisor Name</label><input value={supervisorName} onChange={e => { setSupervisorName(e.target.value); clrErr("supervisorName"); }} style={inp(errors.supervisorName)} />{errors.supervisorName && <span style={errTxt}>{errors.supervisorName}</span>}</div>
          <div style={half}><label style={lbl}>Job Title</label><input value={supervisorTitle} onChange={e => { setSupervisorTitle(e.target.value); clrErr("supervisorTitle"); }} style={inp(errors.supervisorTitle)} />{errors.supervisorTitle && <span style={errTxt}>{errors.supervisorTitle}</span>}</div>
          <div style={half}><label style={lbl}>Phone</label><input value={supervisorPhone} onChange={e => { setSupervisorPhone(e.target.value); clrErr("supervisorPhone"); }} style={inp(errors.supervisorPhone)} />{errors.supervisorPhone && <span style={errTxt}>{errors.supervisorPhone}</span>}</div>
          <div style={half}><label style={lbl}>Email</label><input value={supervisorEmail} onChange={e => { setSupervisorEmail(e.target.value); clrErr("supervisorEmail"); }} style={inp(errors.supervisorEmail)} />{errors.supervisorEmail && <span style={errTxt}>{errors.supervisorEmail}</span>}</div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, border: "1.5px solid #dddbe8", background: "#fff", color: "#555", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#4a3fa0", color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}><FaPaperPlane /> {submitting ? "Submitting..." : "Send to University"}</button>
        </div>
      </div>
    </div>
  );
}

export default function MyApplications() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState(tabParam === "university" ? "university" : "company");

  useEffect(() => {
    if (tabParam === "university") setTab("university");
    else if (tabParam === "company") setTab("company");
  }, [tabParam]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    applicationApi.mine()
      .then(data => { if (alive) setApplications(data.applications || []); })
      .catch(err => { if (alive) setError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const companyStageApps = applications.filter(app =>
    ["awaiting_company_approval", "company_approved", "company_rejected", "auto_cancelled"].includes(app.status)
  );

  const universityStageApps = applications.filter(app =>
    ["pending_university", "university_approved", "university_rejected", "company_final_approved", "in_training", "completed"].includes(app.status)
  );

  const list = tab === "company" ? companyStageApps : universityStageApps;

  const handleTrainingSubmit = async (applicationId, formData) => {
    try {
      await applicationApi.submitToUniversity(applicationId, formData);
      const data = await applicationApi.mine();
      setApplications(data.applications || []);
      setModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    return name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "CO";
  };

  const isExpired = (deadlineDate) => {
    if (!deadlineDate) return false;
    return new Date(deadlineDate) < new Date();
  };

  const s = {
    page: { padding: "28px 28px" },
    title: { fontSize: 26, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 },
    sub: { fontSize: 14, color: "#888", marginBottom: 24 },
    tabs: { display: "flex", gap: 4, marginBottom: 24, borderBottom: "2px solid #ece9f1", paddingBottom: 0 },
    tabBtn: (active) => ({
      padding: "10px 18px", borderRadius: "8px 8px 0 0",
      border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
      background: active ? "#fff" : "transparent",
      color: active ? "#4a3fa0" : "#888",
      borderBottom: active ? "2px solid #4a3fa0" : "2px solid transparent",
      marginBottom: -2,
    }),
    list: { display: "flex", flexDirection: "column", gap: 14 },
    item: {
      background: "#fff", borderRadius: 14, padding: "18px 20px",
      border: "1px solid #ece9f1",
      boxShadow: "0 2px 8px rgba(30,26,60,0.04)",
      display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
    },
    left: { display: "flex", alignItems: "flex-start", gap: 14, flex: 1 },
    initials: {
      width: 44, height: 44, borderRadius: 10,
      background: "#4a3fa0", color: "#fff",
      fontWeight: 700, fontSize: 14,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    },
    companyName: { fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 2 },
    companySub: { fontSize: 13, color: "#888" },
    detailsBtn: {
      display: "flex", alignItems: "center", gap: 6,
      padding: "8px 16px", borderRadius: 8,
      border: "1.5px solid #dddbe8", background: "#fff",
      color: "#555", fontSize: 13, fontWeight: 600,
      cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
    },
    submitBtn: {
      marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 16px", borderRadius: 8,
      border: "none", background: "#4a3fa0", color: "#fff",
      fontSize: 13, fontWeight: 600, cursor: "pointer",
    },
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}>Loading applications...</div>;
  if (error) return <div style={{ textAlign: "center", padding: 50, color: "#e74c3c" }}>{error}</div>;

  return (
    <div style={s.page}>
      <h1 style={s.title}>My Applications</h1>
      <p style={s.sub}>Track your internship applications through every stage</p>

      <div style={s.tabs}>
        <button style={s.tabBtn(tab === "company")} onClick={() => setTab("company")}>
          🏢 Company Stage ({companyStageApps.length})
        </button>
        <button style={s.tabBtn(tab === "university")} onClick={() => setTab("university")}>
          🎓 University Stage ({universityStageApps.length})
        </button>
      </div>

      <div style={s.list}>
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb" }}>No applications yet. Browse internships to apply!</div>
        ) : (
          list.map(app => {
            const companyName = app.companyId?.name || "Company";
            const field = app.trainingId?.field || app.field || "Internship";
            const initials = getInitials(companyName);
            const isCompanyApproved = app.status === "company_approved";
            const isPendingUniversity = app.status === "pending_university";
            const showSubmitBtn = isCompanyApproved && !app.submittedToUniversityAt;
            
            return (
              <div key={app._id} style={s.item}>
                <div style={s.left}>
                  <div style={s.initials}>{initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.companyName}>{companyName}</div>
                    <div style={s.companySub}>{field}</div>
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <StatusBadge status={app.status} />
                      
                      {/* المهلة الأولى: company_approved */}
                      {isCompanyApproved && app.studentDeadline && (
                        <span style={{ 
                          fontSize: 12, 
                          color: isExpired(app.studentDeadline) ? "#e74c3c" : "#b7791f", 
                          background: isExpired(app.studentDeadline) ? "#ffecec" : "#fff8e1", 
                          borderRadius: 20, 
                          padding: "3px 10px", 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 4 
                        }}>
                          <FaClock /> {getTimeLeft(app.studentDeadline)}
                        </span>
                      )}
                      
                      {/* المهلة الثانية: pending_university */}
                      {isPendingUniversity && app.studentDeadline && (
                        <span style={{ 
                          fontSize: 12, 
                          color: isExpired(app.studentDeadline) ? "#e74c3c" : "#b7791f", 
                          background: isExpired(app.studentDeadline) ? "#ffecec" : "#fff8e1", 
                          borderRadius: 20, 
                          padding: "3px 10px", 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 4 
                        }}>
                          <FaClock /> {getTimeLeft(app.studentDeadline)}
                        </span>
                      )}
                    </div>
                    
                    {showSubmitBtn && (
                      <button style={s.submitBtn} onClick={() => setModal(app)}>
                        <FaPaperPlane /> Submit Training Request
                      </button>
                    )}
                    
                    {app.submittedToUniversityAt && (
                      <div style={{ marginTop: 8, fontSize: 12, color: "#27ae60", display: "flex", alignItems: "center", gap: 5 }}>
                        <FaCheckCircle /> Training request sent to university
                      </div>
                    )}
                    
                    {app.companyRejectionReason && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#e74c3c" }}>Reason: {app.companyRejectionReason}</div>
                    )}
                  </div>
                </div>
                <button style={s.detailsBtn} onClick={() => navigate(`/student/internship/${app.trainingId?._id || app.trainingId}`)}>
                  <FaEye /> Details
                </button>
              </div>
            );
          })
        )}
      </div>

      {modal && (
        <TrainingRequestModal
          app={modal}
          onClose={() => setModal(null)}
          onSubmit={(data) => handleTrainingSubmit(modal._id, data)}
        />
      )}
    </div>
  );
}