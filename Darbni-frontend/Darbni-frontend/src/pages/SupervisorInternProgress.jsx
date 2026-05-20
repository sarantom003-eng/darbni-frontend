import React, { useState } from "react";
import { FaUserFriends, FaRegClock, FaCheckCircle, FaExclamationCircle, FaChevronRight, FaChevronDown, FaCheck, FaRegCommentDots } from "react-icons/fa";

const MOCK_TRAINEES = [
  {
    id: 1, name: "Sara Tomeh", idNum: "20211111", initials: "ST", color: "#f0e6ff", textColor: "#7c5cbf",
    company: "TechPal Solutions", department: "Web Development",
    status: "In Progress", statusClass: "sip-badge-progress",
    hoursDone: 120, targetHours: 150, confirmed: 8, totalConfirmed: 11,
    progress: 80,
    weeks: [
      {
        id: 1, label: "Week 1", dates: "Mar 3 - Mar 7", totalHours: 15, days: 4, status: "Confirmed",
        entries: [
          { day: "Sunday", date: "Mar 3", task: "HTML/CSS review", hours: 4, status: "Confirmed" },
          { day: "Monday", date: "Mar 4", task: "JavaScript basics", hours: 4, status: "Confirmed" },
          { day: "Tuesday", date: "Mar 5", task: "React components", hours: 4, status: "Confirmed" },
          { day: "Wednesday", date: "Mar 6", task: "State management", hours: 3, status: "Confirmed" }
        ]
      },
      {
        id: 2, label: "Week 2", dates: "Mar 10 - Mar 14", totalHours: 18, days: 4, status: "Confirmed",
        entries: [
          { day: "Sunday", date: "Mar 10", task: "Routing setup", hours: 5, status: "Confirmed" },
          { day: "Monday", date: "Mar 11", task: "API integration", hours: 5, status: "Confirmed" },
          { day: "Tuesday", date: "Mar 12", task: "Form validation", hours: 4, status: "Confirmed" },
          { day: "Wednesday", date: "Mar 13", task: "Authentication flow", hours: 4, status: "Confirmed" }
        ]
      },
      {
        id: 3, label: "Week 3", dates: "Mar 17 - Mar 21", totalHours: 15, days: 3, status: "Pending",
        entries: [
          { day: "Sunday", date: "Mar 17", task: "Dashboard layout", hours: 5, status: "Pending" },
          { day: "Monday", date: "Mar 18", task: "Code review", hours: 5, status: "Pending" },
          { day: "Tuesday", date: "Mar 19", task: "Bug fixing", hours: 5, status: "Pending" }
        ]
      }
    ]
  },
  {
    id: 2, name: "Rami Khalil", idNum: "20212222", initials: "RK", color: "#f0e6ff", textColor: "#7c5cbf",
    company: "DataVision Co.", department: "Data Science",
    status: "In Progress", statusClass: "sip-badge-progress",
    hoursDone: 80, targetHours: 150, confirmed: 6, totalConfirmed: 8,
    progress: 53,
    weeks: [
      {
        id: 1, label: "Week 1", dates: "Mar 3 - Mar 7", totalHours: 20, days: 4, status: "Confirmed",
        entries: [
          { day: "Sunday", date: "Mar 3", task: "Data cleaning", hours: 5, status: "Confirmed" },
          { day: "Monday", date: "Mar 4", task: "Dataset exploration", hours: 5, status: "Confirmed" },
          { day: "Tuesday", date: "Mar 5", task: "Feature analysis", hours: 5, status: "Confirmed" },
          { day: "Wednesday", date: "Mar 6", task: "Visualization", hasComment: true, comment: "\"Solid understanding\"", hours: 5, status: "Confirmed" },
        ]
      },
      {
        id: 2, label: "Week 2", dates: "Mar 10 - Mar 14", totalHours: 20, days: 4, status: "Pending",
        entries: [
          { day: "Sunday", date: "Mar 10", task: "Model training", hours: 5, status: "Pending" },
          { day: "Monday", date: "Mar 11", task: "Evaluation", hours: 5, status: "Pending" },
          { day: "Tuesday", date: "Mar 12", task: "Deployment setup", hours: 5, status: "Pending" },
          { day: "Wednesday", date: "Mar 13", task: "Documentation", hours: 5, status: "Pending" }
        ]
      }
    ]
  },
  {
    id: 3, name: "Nour Abed", idNum: "20213333", initials: "NA", color: "#f0e6ff", textColor: "#7c5cbf",
    company: "CyberGuard Inc.", department: "Cybersecurity",
    status: "Completed", statusClass: "sip-badge-completed",
    hoursDone: 150, targetHours: 150, confirmed: 4, totalConfirmed: 4,
    progress: 100,
    weeks: []
  },
  {
    id: 4, name: "Omar Saleh", idNum: "20214444", initials: "OS", color: "#f0e6ff", textColor: "#7c5cbf",
    company: "CloudNine Tech", department: "Cloud Computing",
    status: "Behind", statusClass: "sip-badge-behind",
    hoursDone: 45, targetHours: 150, confirmed: 2, totalConfirmed: 3,
    progress: 30,
    weeks: []
  }
];

function InternModal({ intern, onClose }) {
  const [expandedWeek, setExpandedWeek] = useState(intern.weeks?.[0]?.id || null);

  return (
    <div className="sip-overlay" onClick={onClose}>
      <div className="sip-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sip-modal-close" onClick={onClose}>✕</button>
        
        <div className="sip-modal-header">
          <div className="sip-avatar-large" style={{ background: intern.color, color: intern.textColor }}>
            {intern.initials}
          </div>
          <div className="sip-modal-title-wrap">
            <h3 className="sip-modal-name">{intern.name}</h3>
            <p className="sip-modal-dept">{intern.company} - {intern.department}</p>
          </div>
        </div>

        <div className="sip-modal-stats">
          <div className="sip-mstat">
            <span className="sip-mstat-num">{intern.hoursDone}</span>
            <span className="sip-mstat-lbl">Hours Done</span>
          </div>
          <div className="sip-mstat">
            <span className="sip-mstat-num">{intern.targetHours}</span>
            <span className="sip-mstat-lbl">Target</span>
          </div>
          <div className="sip-mstat">
            <span className="sip-mstat-num">{intern.progress}%</span>
            <span className="sip-mstat-lbl">Progress</span>
          </div>
        </div>

        <div className="sip-modal-bar-wrap">
          <div className="sip-modal-bar-bg">
            <div className="sip-modal-bar-fill" style={{ width: `${intern.progress}%` }}></div>
          </div>
        </div>

        <h4 className="sip-modal-log-title">Weekly Schedule Log</h4>
        
        <div className="sip-weeks">
          {intern.weeks && intern.weeks.map(week => {
            const isOpen = expandedWeek === week.id;
            return (
              <div key={week.id} className="sip-week-card">
                <div className="sip-week-head" onClick={() => setExpandedWeek(isOpen ? null : week.id)}>
                  <div className="sip-week-hleft">
                    {isOpen ? <FaChevronDown size={10} color="#888" /> : <FaChevronRight size={10} color="#888" />}
                    <span className="sip-week-lbl">{week.label}</span>
                    <span className="sip-week-dates">{week.dates}</span>
                  </div>
                  <div className="sip-week-hright">
                    <span className="sip-week-hours">{week.totalHours}h - {week.days} days</span>
                    <span className={`sip-wbadge ${week.status === 'Confirmed' ? 'sip-wbadge-conf' : 'sip-wbadge-pend'}`}>
                      {week.status === 'Confirmed' ? <FaCheckCircle size={12}/> : <FaRegClock size={12}/>}
                      {week.status}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="sip-week-body">
                    <table className="sip-table">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Date</th>
                          <th>Tasks Completed</th>
                          <th>Hours</th>
                          <th>Company Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {week.entries.map((entry, idx) => (
                          <tr key={idx}>
                            <td className="sip-td-day">{entry.day}</td>
                            <td>{entry.date}</td>
                            <td>
                              {entry.task}
                              {entry.hasComment && (
                                <div className="sip-entry-comment">
                                  <FaRegCommentDots size={12}/> <i>{entry.comment}</i>
                                </div>
                              )}
                            </td>
                            <td><b>{entry.hours}h</b></td>
                            <td>
                              <span className={`sip-ebadge ${entry.status === 'Confirmed' ? 'sip-ebadge-conf' : 'sip-ebadge-pend'}`}>
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3}>Week Total</td>
                          <td><b>{week.totalHours}h</b></td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="sip-modal-footer">
          <button className="sip-btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function SupervisorInternProgress() {
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  return (
    <div className="sip-page">
      <div className="sip-header">
        <h1 className="sip-page-title">Intern Progress</h1>
        <p className="sip-page-sub">Track hours, daily progress, and provide feedback</p>
      </div>

      <div className="sip-top-stats">
        <div className="sip-tstat-card">
          <div className="sip-tstat-icon sip-icon-purple"><FaUserFriends /></div>
          <div className="sip-tstat-info">
            <span className="sip-tstat-val">4</span>
            <span className="sip-tstat-lbl">Trainees</span>
          </div>
        </div>
        <div className="sip-tstat-card">
          <div className="sip-tstat-icon sip-icon-purple"><FaRegClock /></div>
          <div className="sip-tstat-info">
            <span className="sip-tstat-val">66%</span>
            <span className="sip-tstat-lbl">Avg Progress</span>
          </div>
        </div>
        <div className="sip-tstat-card">
          <div className="sip-tstat-icon sip-icon-green"><FaCheckCircle /></div>
          <div className="sip-tstat-info">
            <span className="sip-tstat-val">1</span>
            <span className="sip-tstat-lbl">Completed</span>
          </div>
        </div>
        <div className="sip-tstat-card">
          <div className="sip-tstat-icon sip-icon-red"><FaExclamationCircle /></div>
          <div className="sip-tstat-info">
            <span className="sip-tstat-val">1</span>
            <span className="sip-tstat-lbl">Behind</span>
          </div>
        </div>
      </div>

      <div className="sip-list">
        {MOCK_TRAINEES.map((t) => (
          <div key={t.id} className="sip-card" onClick={() => setSelectedTrainee(t)}>
            <div className="sip-card-content">
              <div className="sip-avatar" style={{ background: t.color, color: t.textColor }}>
                {t.initials}
              </div>
              <div className="sip-card-info">
                <div className="sip-card-row1">
                  <span className="sip-cname">{t.name}</span>
                  <span className="sip-cid">{t.idNum}</span>
                  <span className={`sip-cbadge ${t.statusClass}`}>{t.status}</span>
                </div>
                <div className="sip-card-row2">
                  <span className="sip-cat">@ {t.company} - {t.department}</span>
                </div>
                <div className="sip-card-row3">
                  <span className="sip-chours">{t.hoursDone}/{t.targetHours}h - {t.confirmed}/{t.totalConfirmed} confirmed</span>
                </div>
              </div>
              <div className="sip-card-right">
                <FaChevronRight size={14} color="#aaa" />
              </div>
            </div>
            <div className="sip-card-bar-wrap">
              <div className="sip-card-bar-bg">
                <div className="sip-card-bar-fill" style={{ width: `${t.progress}%` }}></div>
              </div>
              <span className="sip-card-pct">{t.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      {selectedTrainee && (
        <InternModal intern={selectedTrainee} onClose={() => setSelectedTrainee(null)} />
      )}
    </div>
  );
}
