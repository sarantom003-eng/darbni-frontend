import React, { useState } from "react";
import { FaFileAlt, FaCheckCircle, FaChevronRight, FaStar, FaTimesCircle, FaRegClock } from "react-icons/fa";

const MOCK_REPORTS = [
  {
    id: 1, name: "Sara Tomeh", idNum: "20210289", initials: "ST", color: "#f0e6ff", textColor: "#7c5cbf",
    university: "Palestine Technical University - Kadoorie",
    trainingTitle: "Data Science Internship",
    department: "Data Science",
    company: "DataVision Co.",
    supervisor: "Eng. Rami Khalil",
    uniCoord: "Dr. Samira Khalid",
    startDate: "2026-03-03", endDate: "2026-04-30",
    hoursDone: "160h / 160 hours", totalDays: 20,
    rating: 5,
    perfComments: "Sara demonstrated outstanding technical skills and consistent professionalism. She delivered every task on time and showed strong initiative across the entire training period. Highly recommended for advanced ML training.",
    otherComments: "We would gladly host her again in a paid role after graduation.",
    status: "Pending Review",
    weeks: [
      {
        label: "Week 1",
        entries: [
          { day: "Sun", date: "2026-03-08", task: "Onboarding & environment setup", hours: "8h", eval: "Excellent" },
          { day: "Mon", date: "2026-03-09", task: "Codebase walkthrough", hours: "8h", eval: "Excellent" },
          { day: "Tue", date: "2026-03-10", task: "First feature spec", hours: "8h", eval: "Very good" },
          { day: "Wed", date: "2026-03-11", task: "Pair programming", hours: "8h", eval: "Good" },
          { day: "Thu", date: "2026-03-12", task: "Component library study", hours: "8h", eval: "Excellent" },
        ]
      },
      {
        label: "Week 2",
        entries: [
          { day: "Sun", date: "2026-03-15", task: "Built login screen", hours: "8h", eval: "Excellent" },
          { day: "Mon", date: "2026-03-16", task: "REST API integration", hours: "8h", eval: "Very good" },
          { day: "Tue", date: "2026-03-17", task: "Form validation", hours: "8h", eval: "Excellent" },
          { day: "Wed", date: "2026-03-18", task: "Sprint review", hours: "8h", eval: "Good — improve docs" },
          { day: "Thu", date: "2026-03-19", task: "Code review feedback", hours: "8h", eval: "Excellent" },
        ]
      },
      {
        label: "Week 3",
        entries: [
          { day: "Sun", date: "2026-03-22", task: "Dashboard layout", hours: "8h", eval: "Excellent" },
          { day: "Mon", date: "2026-03-23", task: "Unit tests", hours: "8h", eval: "Excellent" },
          { day: "Tue", date: "2026-03-24", task: "Bug triage", hours: "8h", eval: "Very good" },
          { day: "Wed", date: "2026-03-25", task: "Performance audit", hours: "8h", eval: "Good" },
          { day: "Thu", date: "2026-03-26", task: "Database schema review", hours: "8h", eval: "Excellent" },
        ]
      },
      {
        label: "Week 4",
        entries: [
          { day: "Sun", date: "2026-03-29", task: "API endpoints development", hours: "8h", eval: "Excellent" },
          { day: "Mon", date: "2026-03-30", task: "End-to-end tests", hours: "8h", eval: "Very good" },
          { day: "Tue", date: "2026-03-31", task: "Documentation update", hours: "8h", eval: "Excellent" },
          { day: "Wed", date: "2026-04-01", task: "Final demo prep", hours: "8h", eval: "Excellent" },
          { day: "Thu", date: "2026-04-02", task: "Final demo & wrap-up", hours: "8h", eval: "Excellent — outstanding finish" },
        ]
      }
    ]
  },
  {
    id: 2, name: "Nour Abed", idNum: "20200412", initials: "NA", color: "#f0e6ff", textColor: "#7c5cbf",
    university: "Palestine Technical University - Kadoorie",
    trainingTitle: "Cybersecurity Internship",
    department: "Cybersecurity",
    company: "CyberGuard Inc.",
    supervisor: "Eng. Tariq Ziad",
    uniCoord: "Dr. Samira Khalid",
    startDate: "2026-03-03", endDate: "2026-04-30",
    hoursDone: "160h / 160 hours", totalDays: 20,
    rating: 3,
    perfComments: "Good performance overall.",
    otherComments: "No other comments.",
    status: "Pending Decision",
    sentDate: "Apr 02, 2026",
    weeks: []
  }
];

function FinalReportModal({ report, onClose }) {
  const [decisionNotes, setDecisionNotes] = useState("");

  const handleDecision = (status) => {
    // Ideally this would save the status
    onClose();
  };

  return (
    <div className="sfr-overlay" onClick={onClose}>
      <div className="sfr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sfr-modal-close" onClick={onClose}>✕</button>
        
        <div className="sfr-head">
          <FaFileAlt className="sfr-head-icon" />
          <div>
            <h2 className="sfr-head-title">Final Training Report</h2>
            <p className="sfr-head-sub">Official university letter and the data filled by the company at the end of training.</p>
          </div>
        </div>

        <div className="sfr-body-wrap">
          {/* Official Letter */}
          <div className="sfr-letter">
            <div className="sfr-letter-banner">
              <img src="/ptu-banner.png" alt="University Banner" />
            </div>
            
            <div className="sfr-letter-date">March 1, 2026 : التاريخ</div>
            <div className="sfr-letter-to">حضرة السادة : <strong>{report.company}</strong>. المحترمين</div>
            
            <div className="sfr-letter-subject">
              <strong>الموضوع : التدريب الميداني</strong><br/>
              <strong>تخصص : {report.department}</strong>
            </div>
            
            <div className="sfr-letter-greeting">تحية طيبة وبعد..</div>
            
            <p className="sfr-letter-p">
              أرجو من حضرتكم التكرم بالسماح للطالب/ة <strong>{report.name}</strong> بالتدرب في مؤسستكم الموقرة أيام الدوام الرسمي في المؤسسة بحيث ينهي الطالب (160) ساعة تدريبية حيث يكون دوام الطالب في مؤسستكم مثل دوام العاملين فيها ولا يحق له التغيب دون إذن رسمي، وسيقدم الطالب المتدرب تقريراً عما اكتسبه من مهارات للمحاضر المسؤول عنه في الجامعة في نهاية هذه الفترة.
            </p>
            <p className="sfr-letter-p">
              يرجى من المشرف المباشر عن التدريب لديكم تعبئة نموذج التقييم المرفق ومتابعة حضور الطالب المتدرب من خلال نموذج الحضور والغياب المرفق وذلك بعد انتهاء فترة التدريب.
            </p>
            
            <div className="sfr-letter-closing">وتفضلوا بقبول فائق الاحترام..</div>
            
            <div className="sfr-letter-sig">
              <div>مسؤول التدريب : <strong>{report.uniCoord}</strong></div>
              <div className="sfr-letter-sig-uni">Palestine Technical University - Kadoorie</div>
            </div>
          </div>

          <div className="sfr-divider"></div>

          {/* Filled by Company */}
          <div className="sfr-comp-head">
            <h3 className="sfr-comp-title">Final Training Report — Filled by Company</h3>
            <p className="sfr-comp-sub">Submitted by {report.company}</p>
          </div>

          <h4 className="sfr-section-title">Report Information</h4>
          <div className="sfr-grid">
            <div className="sfr-field">
              <label>STUDENT NAME</label>
              <div>{report.name}</div>
            </div>
            <div className="sfr-field">
              <label>UNIVERSITY ID</label>
              <div>{report.idNum}</div>
            </div>
            <div className="sfr-field">
              <label>UNIVERSITY</label>
              <div>{report.university}</div>
            </div>
            <div className="sfr-field">
              <label>TRAINING TITLE</label>
              <div>{report.trainingTitle}</div>
            </div>
            <div className="sfr-field">
              <label>COMPANY</label>
              <div>{report.company}</div>
            </div>
            <div className="sfr-field">
              <label>TRAINING SUPERVISOR (COMPANY)</label>
              <div>{report.supervisor}</div>
            </div>
            <div className="sfr-field">
              <label>START DATE</label>
              <div>{report.startDate}</div>
            </div>
            <div className="sfr-field">
              <label>END DATE</label>
              <div>{report.endDate}</div>
            </div>
            <div className="sfr-field">
              <label>TOTAL HOURS COMPLETED</label>
              <div>{report.hoursDone}</div>
            </div>
            <div className="sfr-field">
              <label>TOTAL DAYS</label>
              <div>{report.totalDays}</div>
            </div>
            <div className="sfr-field sfr-col-span-2">
              <label>FINAL RATING</label>
              <div className="sfr-stars">
                {[1,2,3,4,5].map(i => (
                  <FaStar key={i} size={18} color={i <= report.rating ? "#7c5cbf" : "#e0e0e0"} />
                ))}
              </div>
            </div>
          </div>

          <h4 className="sfr-section-title" style={{ marginTop: 32 }}>Weekly Training Logbook</h4>
          <div className="sfr-table-wrap">
            <table className="sfr-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Tasks Completed</th>
                  <th>Hours</th>
                  <th>Company Evaluation</th>
                </tr>
              </thead>
              <tbody>
                {report.weeks.map(week => (
                  week.entries.map((entry, idx) => (
                    <tr key={`${week.label}-${idx}`}>
                      {idx === 0 && <td rowSpan={week.entries.length} className="sfr-td-week"><strong>{week.label}</strong></td>}
                      <td>{entry.day}</td>
                      <td>{entry.date}</td>
                      <td className="sfr-td-task">{entry.task}</td>
                      <td><strong>{entry.hours}</strong></td>
                      <td><em>{entry.eval}</em></td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="sfr-section-title" style={{ marginTop: 32 }}>Final Evaluation</h4>
          <div className="sfr-grid">
            <div className="sfr-field sfr-col-span-2">
              <label>COMMENTS ON STUDENT PERFORMANCE</label>
              <div className="sfr-comments-box">{report.perfComments}</div>
            </div>
            <div className="sfr-field sfr-col-span-2">
              <label>OTHER COMMENTS</label>
              <div className="sfr-comments-box">{report.otherComments}</div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="sfr-decision">
          <h4 className="sfr-dec-title">Your Decision</h4>
          <label className="sfr-dec-lbl">Reason / Notes (required if failing)</label>
          <textarea 
            className="sfr-dec-textarea"
            placeholder="—"
            value={decisionNotes}
            onChange={(e) => setDecisionNotes(e.target.value)}
          />
          <div className="sfr-dec-actions">
            <button className="sfr-btn-close" onClick={onClose}>Close</button>
            <div className="sfr-dec-right">
              <button className="sfr-btn-fail" onClick={() => handleDecision('fail')}>
                <FaTimesCircle size={14} /> Mark as Failed
              </button>
              <button className="sfr-btn-pass" onClick={() => handleDecision('pass')}>
                <FaCheckCircle size={14} /> Mark as Passed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupervisorFinalReports() {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="sfr-page">
      <div className="sfr-header">
        <h1 className="sfr-page-title">Final Reports</h1>
        <p className="sfr-page-sub">Review the official training report sent back by each company and decide if the student passed.</p>
      </div>

      <div className="sfr-list-container">
        <div className="sfr-list-header">
          <FaFileAlt color="#7c5cbf" /> <strong>Incoming Reports ({MOCK_REPORTS.length})</strong>
        </div>
        <p className="sfr-list-sub">Click a report to view the full official letter and submit your decision.</p>
        
        <div className="sfr-list">
        {MOCK_REPORTS.map((r) => (
          <div key={r.id} className="sfr-card" onClick={() => setSelectedReport(r)}>
            <div className="sfr-card-content">
              <div className="sfr-avatar" style={{ background: r.color, color: r.textColor }}>
                {r.initials}
              </div>
              <div className="sfr-card-info">
                <div className="sfr-card-row1">
                  <span className="sfr-cname">{r.name}</span>
                  <span className="sfr-cid">{r.idNum}</span>
                </div>
                <div className="sfr-card-row2">
                  <span className="sfr-cat">{r.company} - {r.trainingTitle} - Sent {r.sentDate || "Apr 12, 2026"}</span>
                </div>
              </div>
              <div className="sfr-card-right">
                <div className="sfr-stars">
                  {[1,2,3,4,5].map(i => (
                    <FaStar key={i} size={14} color={i <= r.rating ? "#7c5cbf" : "#e0e0e0"} />
                  ))}
                </div>
                <span className="sfr-cbadge-pending"><FaRegClock size={12}/> Pending Decision</span>
                <FaChevronRight size={14} color="#aaa" />
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      {selectedReport && (
        <FinalReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}
