import React, { useState } from "react";
import { FaSearch, FaEnvelope, FaReply, FaTrash, FaRegClock } from "react-icons/fa";

const MOCK_MESSAGES = [
  {
    id: 1,
    name: "Ahmad Khalil",
    email: "ahmad@student.ptuk.edu.ps",
    subject: "Question about internship requirements",
    body: "Hello, I would like to know the minimum hours required for the internship to be approved. Also, can I split my internship between two companies? Thank you.",
    date: "Apr 3, 2026, 01:30 PM",
    unread: true,
    replied: false,
  },
  {
    id: 2,
    name: "TechPal Solutions HR",
    email: "hr@techpal.com",
    subject: "Partnership Inquiry",
    body: "We are interested in partnering with your university to offer internship opportunities for computer science students. Please let us know the process to register as a partner company.",
    date: "Apr 2, 2026, 05:15 PM",
    unread: true,
    replied: false,
  },
  {
    id: 3,
    name: "Sara Tomeh",
    email: "sara@student.ptuk.edu.ps",
    subject: "Issue with progress submission",
    body: "I'm having trouble submitting my weekly progress report. The system shows an error when I try to upload my report file. Can you help?",
    date: "Mar 31, 2026, 07:45 PM",
    unread: false,
    replied: true,
  },
  {
    id: 4,
    name: "Nour Abed",
    email: "nour@student.ptuk.edu.ps",
    subject: "Certificate request",
    body: "I have completed my internship at CyberGuard Inc. and I need an official completion certificate. How can I request one?",
    date: "Mar 28, 2026, 02:20 PM",
    unread: false,
    replied: false,
  }
];

export default function SupervisorContactMessages() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All, Unread, Read

  const [viewMsg, setViewMsg] = useState(null);
  const [replyMsg, setReplyMsg] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setMessages(messages.filter((m) => m.id !== id));
    if (viewMsg && viewMsg.id === id) setViewMsg(null);
  };

  const handleRead = (msg) => {
    if (msg.unread) {
      setMessages(messages.map((m) => m.id === msg.id ? { ...m, unread: false } : m));
    }
    setViewMsg({ ...msg, unread: false });
  };

  const handleReplyOpen = (msg, e) => {
    if (e) e.stopPropagation();
    setReplyMsg(msg);
    setViewMsg(null);
    setReplyText("");
  };

  const handleSendReply = () => {
    setMessages(messages.map((m) => m.id === replyMsg.id ? { ...m, replied: true } : m));
    setReplyMsg(null);
  };

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    const matchFilter = filter === "All" || (filter === "Unread" && m.unread) || (filter === "Read" && !m.unread);
    return matchSearch && matchFilter;
  });

  return (
    <div className="scm-page">
      <div className="scm-header">
        <h1 className="scm-title">Contact Messages</h1>
        <p className="scm-sub">Manage messages received from the Contact Us page</p>
      </div>

      <div className="scm-controls">
        <div className="scm-search-box">
          <FaSearch color="#aaa" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="scm-filters">
          <button className={`scm-filter-btn ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>All</button>
          <button className={`scm-filter-btn ${filter === "Unread" ? "active" : ""}`} onClick={() => setFilter("Unread")}>Unread</button>
          <button className={`scm-filter-btn ${filter === "Read" ? "active" : ""}`} onClick={() => setFilter("Read")}>Read</button>
        </div>
      </div>

      <div className="scm-list">
        {filtered.length === 0 ? (
          <div className="scm-empty">No messages found.</div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className={`scm-card ${m.unread ? "unread" : ""}`} onClick={() => handleRead(m)}>
              <div className="scm-card-left">
                <FaEnvelope className="scm-card-icon" color="#aaa" />
                <div className="scm-card-content">
                  <div className="scm-card-name-row">
                    <span className="scm-card-name">{m.name}</span>
                    {m.replied && <span className="scm-replied-badge">Replied</span>}
                  </div>
                  <div className="scm-card-subject">{m.subject}</div>
                  <div className="scm-card-preview">{m.body}</div>
                </div>
              </div>
              <div className="scm-card-right">
                <span className="scm-card-datetime">{m.date}</span>
                <button className="scm-icon-btn reply" onClick={(e) => handleReplyOpen(m, e)} title="Reply">
                  <FaReply size={13} />
                </button>
                <button className="scm-icon-btn delete" onClick={(e) => handleDelete(m.id, e)} title="Delete">
                  <FaTrash size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Read Message Modal */}
      {viewMsg && (
        <div className="scm-overlay" onClick={() => setViewMsg(null)}>
          <div className="scm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="scm-modal-close" onClick={() => setViewMsg(null)}>✕</button>
            
            <h2 className="scm-modal-subject">{viewMsg.subject}</h2>
            <div className="scm-modal-sender">
              <strong>{viewMsg.name}</strong> <span>&lt;{viewMsg.email}&gt;</span>
            </div>
            <div className="scm-modal-date">
              <FaRegClock /> {viewMsg.date}
            </div>

            <div className="scm-modal-body">
              {viewMsg.body}
            </div>

            <div className="scm-modal-actions">
              <button className="scm-btn-secondary" onClick={() => handleReplyOpen(viewMsg)}>
                <FaReply /> Reply
              </button>
              <button className="scm-btn-danger" onClick={(e) => handleDelete(viewMsg.id, e)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyMsg && (
        <div className="scm-overlay" onClick={() => setReplyMsg(null)}>
          <div className="scm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="scm-modal-close" onClick={() => setReplyMsg(null)}>✕</button>
            
            <h2 className="scm-modal-subject" style={{ marginBottom: '16px' }}>Reply to {replyMsg.name}</h2>
            
            <div className="scm-reply-info">
              <div><strong>To:</strong> {replyMsg.email}</div>
              <div><strong>Subject:</strong> Re: {replyMsg.subject}</div>
            </div>

            <textarea
              className="scm-reply-textarea"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />

            <div className="scm-modal-actions" style={{ marginTop: '20px' }}>
              <button className="scm-btn-secondary" onClick={() => setReplyMsg(null)}>
                Cancel
              </button>
              <button className="scm-btn-primary" onClick={handleSendReply}>
                <FaReply /> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
