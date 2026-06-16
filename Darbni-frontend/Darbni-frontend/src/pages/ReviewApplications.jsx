function ApproveModal({ app, onClose, onApproved, isProcessing, setIsProcessing }) {
  const [step, setStep] = useState(1);
  if (!app) return null;

  const studentName   = `${app.studentId?.firstName || ""} ${app.studentId?.lastName || ""}`.trim();
  const studentID     = app.studentId?.studentID || "N/A";
  const major         = app.officialForm?.major || app.studentId?.major || "N/A";
  const companyName   = app.companyId?.name || "N/A";
  const trainingTitle = app.trainingId?.title || app.trainingId?.field || "N/A";
  const totalHours    = app.trainingId?.totalHours || 160;
  const startDate     = app.trainingId?.startDate
    ? new Date(app.trainingId.startDate).toISOString().split("T")[0] : "N/A";
  const trainerName   = app.officialForm?.trainerName ||
    (app.companyId?.trainer?.firstName
      ? `${app.companyId.trainer.firstName} ${app.companyId.trainer.lastName || ""}`.trim() : "N/A");
  const universityName  = app.studentId?.university_name || app.universityId?.name || "Palestine Technical University - Kadoorie";
  const supervisorName  = localStorage.getItem("firstName")
    ? `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName") || ""}`.trim()
    : "Training Coordinator";
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  const buildLogbook = () => {
    const rows = [];
    const start = app.trainingId?.startDate ? new Date(app.trainingId.startDate) : new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    let week = 1, dayCount = 0, weekDayCount = 0;
    let current = new Date(start);
    while (dayCount < 20) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        if (weekDayCount === 5) { week++; weekDayCount = 0; }
        rows.push({
          week: weekDayCount === 0 ? `Week ${week}` : "",
          day: dayNames[dayOfWeek],
          date: current.toISOString().split("T")[0],
          hours: 8,
        });
        dayCount++; weekDayCount++;
      }
      current.setDate(current.getDate() + 1);
    }
    return rows;
  };

  const logbook = buildLogbook();

  const handleForward = async () => {
    setIsProcessing(true);
    try {
      await applicationApi.universityResponse(app._id, "approve");
      onApproved();
      onClose();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="ra-overlay" onClick={onClose}>
      <div className="ra-modal ra-modal-lg" onClick={e => e.stopPropagation()}
        style={{ maxWidth: 780, maxHeight: "90vh", overflowY: "auto" }}>
        <button className="ra-modal-close" onClick={onClose}><FaTimes /></button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <FaPaperPlane style={{ color: "#6c47ff" }} />
          <div>
            <h3 className="ra-modal-title" style={{ margin: 0 }}>
              {step === 1 ? "كتاب التدريب الميداني الرسمي" : "Final Training Evaluation Form"}
            </h3>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
              {step === 1 ? "Step 1 of 2 — Official Arabic letter to the company." : "Step 2 of 2 — Evaluation form."}
            </p>
          </div>
        </div>

        {/* ===== STEP 1 ===== */}
        {step === 1 && (
          <div id="print-area">
            <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 32, background: "#fafafa", fontFamily: "Arial, sans-serif", direction: "rtl" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <img src="/ptu-banner.png" alt="University Banner" style={{ maxWidth: "100%", height: "auto" }} onError={e => { e.target.style.display = "none"; }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span>التاريخ :</span>
                <span style={{ fontWeight: 600 }}>{today}</span>
              </div>
              <div style={{ marginBottom: 12 }}>حضرة السادة : <strong>{companyName}</strong>. المحترمين</div>
              <div style={{ marginBottom: 12 }}>
                <strong>الموضوع : التدريب الميداني</strong><br />
                <strong>تخصص : {major}</strong>
              </div>
              <div style={{ marginBottom: 16 }}>تحية طيبة وبعد..</div>
              {/* ✅ الصيغة الكاملة */}
              <p style={{ lineHeight: 2, marginBottom: 12 }}>
                أرجو من حضرتكم التكرم بالسماح للطالب/ة <strong>{studentName}</strong> بالتدرب في مؤسستكم الموقرة أيام الدوام الرسمي في المؤسسة بحيث ينهي الطالب ({totalHours}) ساعة تدريبية حيث يكون دوام الطالب في مؤسستكم مثل دوام العاملين فيها ولا يحق له التغيب دون إذن رسمي، وسيقدم الطالب المتدرب تقريراً عما اكتسب من مهارات للمحاضر المسؤول عنه في الجامعة في نهاية هذه الفترة.
              </p>
              <p style={{ lineHeight: 2, marginBottom: 20 }}>
                يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق ومتابعة حضور الطالب المتدرب من خلال نموذج الحضور والغياب المرفق وذلك بعد انتهاء فترة التدريب.
              </p>
              <div style={{ marginBottom: 20 }}>وتفضلوا بقبول فائق الاحترام..</div>
              <div>
                مسؤول التدريب : <strong>{supervisorName}</strong>
                <div style={{ fontSize: 13, color: "#666" }}>{universityName}</div>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 2 ===== */}
        {step === 2 && (
          <div id="print-area">
            <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 28, background: "#fafafa", fontFamily: "Arial, sans-serif" }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <img src="/ptu-banner.png" alt="University Banner" style={{ maxWidth: "100%", height: "auto" }} onError={e => { e.target.style.display = "none"; }} />
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>Final Training Evaluation Form</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  ["STUDENT NAME",           studentName],
                  ["UNIVERSITY ID",          studentID],
                  ["UNIVERSITY",             universityName],
                  ["TRAINING TITLE",         trainingTitle],
                  ["COMPANY",               companyName],
                  ["TRAINING SUPERVISOR",    trainerName],
                  ["START DATE",            startDate],
                  ["TARGET HOURS",          `${totalHours} hours`],
                  ["TOTAL HOURS COMPLETED", "(to be filled by company)"],
                  ["TOTAL DAYS",            "(to be filled by company)"],
                ].map(([label, val], i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 6, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, color: val.startsWith("(") ? "#bbb" : "#1a1729", fontStyle: val.startsWith("(") ? "italic" : "normal" }}>{val}</div>
                  </div>
                ))}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 8 }}>
                <thead>
                  <tr style={{ background: "#f5f4f1" }}>
                    {["Week","Day","Date","Tasks Completed","Hours","Company Rating","Feedback"].map(h => (
                      <th key={h} style={{ padding: "8px 6px", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logbook.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "6px", color: "#6c47ff" }}>{row.week}</td>
                      <td style={{ padding: "6px", color: "#555" }}>{row.day}</td>
                      <td style={{ padding: "6px", color: "#555" }}>{row.date}</td>
                      <td style={{ padding: "6px" }}><div style={{ minHeight: 28, border: "1px solid #e0e0e0", borderRadius: 4, padding: "4px 6px", fontSize: 11, color: "#bbb", fontStyle: "italic" }}>(student entry)</div></td>
                      <td style={{ padding: "6px" }}><div style={{ width: 40, border: "1px solid #e0e0e0", borderRadius: 4, padding: "4px 6px", textAlign: "center" }}>{row.hours}</div></td>
                      <td style={{ padding: "6px" }}><div style={{ width: 50, height: 28, border: "1px solid #e0e0e0", borderRadius: 4 }} /></td>
                      <td style={{ padding: "6px" }}><div style={{ minWidth: 100, height: 28, border: "1px solid #e0e0e0", borderRadius: 4 }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <button className="ra-btn-close" onClick={onClose}>Cancel</button>
          <div style={{ display: "flex", gap: 10 }}>
            {step === 2 && (
              <button onClick={() => setStep(1)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: 13 }}>
                <FaArrowLeft size={12} /> Back
              </button>
            )}
            <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: 13 }}>
              <FaPrint size={12} /> Print
            </button>
            {step === 1 && (
              <button onClick={() => setStep(2)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: "#6c47ff", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Next <FaArrowRight size={12} />
              </button>
            )}
            {step === 2 && (
              <button onClick={handleForward} disabled={isProcessing} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: "#6c47ff", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: isProcessing ? 0.7 : 1 }}>
                {isProcessing ? <FaSpinner className="spinner" /> : <FaPaperPlane size={12} />}
                Forward to Company
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}