import React, { useState, useEffect } from "react";
import { FaSearch, FaEnvelope, FaReply, FaTrash, FaRegClock, FaSpinner } from "react-icons/fa";
import { api } from "../api/client";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMsg, setViewMsg] = useState(null);
  const [replyMsg, setReplyMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // ✅ GET /contact
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api("/contact");
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  // ✅ PATCH /contact/:id/status → read
  const handleRead = async (msg) => {
    if (msg.status === "unread") {
      try {
        await api(`/contact/${msg._id}/status`, {
          method: "PATCH",
          body: { status: "read" },
        });
        setMessages(prev => prev.map(m =>
          m._id === msg._id ? { ...m, status: "read" } : m
        ));
      } catch (err) {
        console.error(err);
      }
    }
    setViewMsg({ ...msg, status: msg.status === "unread" ? "read" : msg.status });
  };

  // ✅ PATCH /contact/:id/reply
  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await api(`/contact/${replyMsg._id}/reply`, {
        method: "PATCH",
        body: { replyMessage: replyText },
      });
      setMessages(prev => prev.map(m =>
        m._id === replyMsg._id ? { ...m, status: "replied" } : m
      ));
      setReplyMsg(null);
      setReplyText("");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // ✅ DELETE /contact/:id
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api(`/contact/${id}`, { method: "DELETE" });
      setMessages(prev => prev.filter(m => m._id !== id));
      if (viewMsg?._id === id) setViewMsg(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleReplyOpen = (msg, e) => {
    if (e) e.stopPropagation();
    setReplyMsg(msg);
    setViewMsg(null);
    setReplyText("");
  };

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      (m.senderName || "").toLowerCase().includes(q) ||
      (m.senderEmail || "").toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "unread"  && m.status === "unread") ||
      (filter === "read"    && m.status === "read") ||
      (filter === "replied" && m.status === "replied");
    return matchSearch && matchFilter;
  });

  if (loading) return (
    <div className="scm-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <FaSpinner className="spinner" />
    </div>
  );

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
          <button className={`scm-filter-btn ${filter === "all"     ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
          <button className={`scm-filter-btn ${filter === "unread"  ? "active" : ""}`} onClick={() => setFilter("unread")}>Unread</button>
          <button className={`scm-filter-btn ${filter === "read"    ? "active" : ""}`} onClick={() => setFilter("read")}>Read</button>
          <button className={`scm-filter-btn ${filter === "replied" ? "active" : ""}`} onClick={() => setFilter("replied")}>Replied</button>
        </div>
      </div>

      <div className="scm-list">
        {filtered.length === 0 ? (
          <div className="scm-empty">No messages found.</div>
        ) : (
          filtered.map((m) => (
            <div key={m._id} className={`scm-card ${m.status === "unread" ? "unread" : ""}`} onClick={() => handleRead(m)}>
              <div className="scm-card-left">
                <FaEnvelope className="scm-card-icon" color="#aaa" />
                <div className="scm-card-content">
                  <div className="scm-card-name-row">
                    <span className="scm-card-name">{m.senderName}</span>
                    {m.status === "replied" && <span className="scm-replied-badge">Replied</span>}
                    {m.status === "unread"  && <span className="scm-unread-badge">Unread</span>}
                  </div>
                  <div className="scm-card-subject">{m.subject}</div>
                  <div className="scm-card-preview">{m.message}</div>
                </div>
              </div>
              <div className="scm-card-right">
                <span className="scm-card-datetime">
                  {m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  }) : "—"}
                </span>
                <button className="scm-icon-btn reply" onClick={(e) => handleReplyOpen(m, e)} title="Reply">
                  <FaReply size={13} />
                </button>
                <button className="scm-icon-btn delete" onClick={(e) => handleDelete(m._id, e)} title="Delete">
                  <FaTrash size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Message Modal */}
      {viewMsg && (
        <div className="scm-overlay" onClick={() => setViewMsg(null)}>
          <div className="scm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="scm-modal-close" onClick={() => setViewMsg(null)}>✕</button>
            <h2 className="scm-modal-subject">{viewMsg.subject}</h2>
            <div className="scm-modal-sender">
              <strong>{viewMsg.senderName}</strong> <span>&lt;{viewMsg.senderEmail}&gt;</span>
            </div>
            <div className="scm-modal-date">
              <FaRegClock /> {viewMsg.createdAt ? new Date(viewMsg.createdAt).toLocaleString() : "—"}
            </div>
            <div className="scm-modal-body">{viewMsg.message}</div>
            <div className="scm-modal-actions">
              <button className="scm-btn-secondary" onClick={() => handleReplyOpen(viewMsg)}>
                <FaReply /> Reply
              </button>
              <button className="scm-btn-danger" onClick={(e) => handleDelete(viewMsg._id, e)}>
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
            <h2 className="scm-modal-subject" style={{ marginBottom: 16 }}>
              Reply to {replyMsg.senderName}
            </h2>
            <div className="scm-reply-info">
              <div><strong>To:</strong> {replyMsg.senderEmail}</div>
              <div><strong>Subject:</strong> Re: {replyMsg.subject}</div>
            </div>
            <textarea
              className="scm-reply-textarea"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isSending}
            />
            <div className="scm-modal-actions" style={{ marginTop: 20 }}>
              <button className="scm-btn-secondary" onClick={() => setReplyMsg(null)} disabled={isSending}>
                Cancel
              </button>
              <button className="scm-btn-primary" onClick={handleSendReply} disabled={isSending}>
                {isSending ? <FaSpinner className="spinner" /> : <FaReply />} Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}