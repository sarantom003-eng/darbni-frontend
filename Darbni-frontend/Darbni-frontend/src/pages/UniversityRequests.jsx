import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaChevronRight, FaClock, FaCheckCircle } from "react-icons/fa";
import { applicationApi } from "../api/client";

// دالة لتوليد لون ثابت حسب الاسم
const getColorForName = (name) => {
  const colors = ["#6c47ff", "#4a3fa0", "#27ae60", "#e74c3c", "#f39c12", "#1abc9c", "#3498db", "#9b59b6"];
  const index = name.length ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

// تحويل بيانات الـ API إلى تنسيق الواجهة
const mapApplication = (app, statusType) => {
  // استخراج بيانات الطالب (قد تكون populated object أو ID فقط)
  const student = app.studentId || {};
  const training = app.trainingId || {};
  
  const firstName = student.firstName || "";
  const lastName = student.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown Student";
  
  // تحديد الحالة المعروضة في الواجهة
  let displayStatus = "pending";
  if (statusType === "resolved") {
    if (app.status === "company_approved" || app.status === "university_approved" || 
        app.status === "company_final_approved" || app.status === "completed") {
      displayStatus = "approved";
    } else if (app.status === "company_rejected" || app.status === "university_rejected") {
      displayStatus = "rejected";
    } else {
      displayStatus = "pending";
    }
  } else {
    displayStatus = "pending";
  }
  
  return {
    id: app._id,
    name: fullName,
    initials: firstName ? `${firstName[0]}${lastName?.[0] || ""}` : "??",
    color: getColorForName(firstName || fullName),
    university: student.university_name || student.universityId?.name || "Unknown",
    position: training.title || "Unknown Position",
    date: app.createdAt 
      ? new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    status: displayStatus,
    resolvedDate: app.companyApprovedAt || app.companyRejectedAt || app.universityApprovedAt
      ? new Date(app.companyApprovedAt || app.companyRejectedAt || app.universityApprovedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : null,
    rejectionReason: app.companyRejectionReason || app.universityRejectionReason || null,
    coverLetter: app.coverLetter || null,
    major: student.major || "N/A",
    rawStatus: app.status, // للحفظ في console.log إذا احتجتي
  };
};

export default function StudentRequests() {
  const [pending, setPending] = useState([]);
  const [resolved, setResolved] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // جلب البيانات من الـ API
  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await applicationApi.company();
      
      // ✅ DEBUG: شوفي شو راجع من الـ API (اتركيه للتأكد ثم امسحيه)
      console.log("🔍 API Response:", response);
      
      // استخراج الـ pending والـ resolved من الـ Response
      const pendingApps = (response.pending || []).map(app => mapApplication(app, "pending"));
      const resolvedApps = (response.resolved || []).map(app => mapApplication(app, "resolved"));
      
      setPending(pendingApps);
      setResolved(resolvedApps);
      
      console.log(`✅ Loaded: ${pendingApps.length} pending, ${resolvedApps.length} resolved`);
    } catch (err) {
      console.error("❌ Error loading applications:", err);
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // الموافقة على طالب
  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await applicationApi.companyResponse(id, "approve");
      await loadApplications(); // إعادة تحميل البيانات
    } catch (err) {
      console.error("❌ Approve error:", err);
      setError(err.message || "Failed to approve application");
    } finally {
      setProcessingId(null);
    }
  };

  // رفض طالب
  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:", "Position filled or requirements not met");
    if (reason === null) return;
    
    setProcessingId(id);
    try {
      await applicationApi.companyResponse(id, "reject", reason);
      await loadApplications();
    } catch (err) {
      console.error("❌ Reject error:", err);
      setError(err.message || "Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const displayList = activeTab === "pending" ? pending : resolved;
  const pendingCount = pending.length;
  const resolvedCount = resolved.length;

  return (
    <div className="sr-page">
      {/* Header */}
      <div className="sr-header">
        <h1 className="sr-title">Student Approval Requests</h1>
        <p className="sr-sub">Students seeking company approval before applying to the university.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="sr-error">
          <span>{error}</span>
          <button onClick={loadApplications} className="sr-retry-btn">Retry</button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="sr-tabs">
        <button
          className={`sr-tab${activeTab === "pending" ? " sr-tab-active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <FaClock size={12} />
          Pending ({pendingCount})
        </button>
        <button
          className={`sr-tab${activeTab === "resolved" ? " sr-tab-active" : ""}`}
          onClick={() => setActiveTab("resolved")}
        >
          <FaCheckCircle size={12} />
          Resolved ({resolvedCount})
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="sr-loading">
          <div className="sr-spinner"></div>
          <p>Loading requests...</p>
        </div>
      )}

      {/* Request List */}
      {!loading && (
        <div className="sr-list">
          {displayList.length === 0 && (
            <div className="sr-empty">
              {activeTab === "pending"
                ? "No pending requests at the moment."
                : "No resolved requests yet."}
            </div>
          )}

          {displayList.map((req) => (
            <div key={req.id} className="sr-item">
              <div className="sr-item-main" onClick={() => toggleExpand(req.id)}>
                {/* Avatar */}
                <div className="sr-avatar" style={{ background: req.color }}>
                  {req.initials}
                </div>

                {/* Info */}
                <div className="sr-info">
                  <div className="sr-name">{req.name}</div>
                  <div className="sr-meta">
                    {req.university} · {req.position} · {req.date}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="sr-actions">
                  {req.status === "pending" && (
                    <>
                      <span className="sr-status-badge sr-status-pending">Pending</span>
                      <button
                        className="sr-btn-approve"
                        disabled={processingId === req.id}
                        onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}
                      >
                        <FaCheck size={11} /> {processingId === req.id ? "..." : "Approve"}
                      </button>
                      <button
                        className="sr-btn-reject"
                        disabled={processingId === req.id}
                        onClick={(e) => { e.stopPropagation(); handleReject(req.id); }}
                      >
                        <FaTimes size={11} /> {processingId === req.id ? "..." : "Reject"}
                      </button>
                    </>
                  )}
                  {req.status === "approved" && (
                    <span className="sr-status-badge sr-status-approved">Approved</span>
                  )}
                  {req.status === "rejected" && (
                    <span className="sr-status-badge sr-status-rejected">Rejected</span>
                  )}
                  <FaChevronRight
                    className={`sr-chevron${expandedId === req.id ? " sr-chevron-open" : ""}`}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === req.id && (
                <div className="sr-detail">
                  <div className="sr-detail-grid">
                    <div className="sr-detail-item">
                      <span className="sr-detail-label">Student Name</span>
                      <span className="sr-detail-val">{req.name}</span>
                    </div>
                    <div className="sr-detail-item">
                      <span className="sr-detail-label">University</span>
                      <span className="sr-detail-val">{req.university}</span>
                    </div>
                    <div className="sr-detail-item">
                      <span className="sr-detail-label">Major</span>
                      <span className="sr-detail-val">{req.major}</span>
                    </div>
                    <div className="sr-detail-item">
                      <span className="sr-detail-label">Position Applied</span>
                      <span className="sr-detail-val">{req.position}</span>
                    </div>
                    <div className="sr-detail-item">
                      <span className="sr-detail-label">Request Date</span>
                      <span className="sr-detail-val">{req.date}</span>
                    </div>
                    <div className="sr-detail-item">
                      <span className="sr-detail-label">Status</span>
                      <span className="sr-detail-val" style={{
                        color: req.status === "approved" ? "#27ae60" : req.status === "rejected" ? "#e74c3c" : "#b8860b",
                        fontWeight: 700,
                        textTransform: "capitalize"
                      }}>{req.status}</span>
                    </div>
                    {req.resolvedDate && (
                      <div className="sr-detail-item">
                        <span className="sr-detail-label">Resolved Date</span>
                        <span className="sr-detail-val">{req.resolvedDate}</span>
                      </div>
                    )}
                    {req.rejectionReason && req.status === "rejected" && (
                      <div className="sr-detail-item sr-detail-full">
                        <span className="sr-detail-label">Rejection Reason</span>
                        <span className="sr-detail-val" style={{ color: "#e74c3c" }}>{req.rejectionReason}</span>
                      </div>
                    )}
                    {req.coverLetter && (
                      <div className="sr-detail-item sr-detail-full">
                        <span className="sr-detail-label">Cover Letter</span>
                        <span className="sr-detail-val">{req.coverLetter}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}