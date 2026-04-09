import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import useRole from '../hooks/useRole';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

// ── Innovation 1: AI Priority Suggestion ─────────────────────────────────────
const AIPrioritySuggestor = ({ title, description, onSuggest }) => {
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState(null);

  const getSuggestion = async () => {
    if (!title.trim() && !description.trim()) {
      showToast('Please enter a title and description first', 'warning');
      return;
    }
    setLoading(true);
    setSuggested(null);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: `You are a facilities management assistant. Based on this incident report, suggest the most appropriate priority level.

Title: ${title}
Description: ${description}

Reply with ONLY one word — exactly one of: LOW, MEDIUM, HIGH, CRITICAL

Rules:
- CRITICAL: safety hazard, no electricity/water, server room issues, fire/flood risk
- HIGH: major equipment failure, affects many people, urgent repair needed
- MEDIUM: equipment not working properly, moderate inconvenience
- LOW: minor cosmetic issues, low impact, can wait

Your answer (one word only):`
          }]
        })
      });

      const data = await response.json();
      const raw = data.content?.[0]?.text?.trim().toUpperCase();
      const valid = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      const priority = valid.includes(raw) ? raw : 'MEDIUM';
      setSuggested(priority);
      onSuggest(priority);
    } catch (err) {
      showToast('AI suggestion failed — try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    LOW: { bg: '#F1F5F9', color: '#64748B' },
    MEDIUM: { bg: '#DBEAFE', color: '#1D4ED8' },
    HIGH: { bg: '#FFE4E6', color: '#BE123C' },
    CRITICAL: { bg: '#FEE2E2', color: '#DC2626' },
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
      <button
        type="button"
        onClick={getSuggestion}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: loading ? '#F1F5F9' : '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          color: loading ? '#94A3B8' : '#1D4ED8',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseOver={e => !loading && (e.currentTarget.style.backgroundColor = '#DBEAFE')}
        onMouseOut={e => !loading && (e.currentTarget.style.backgroundColor = '#EFF6FF')}
      >
        {loading ? (
          <>
            <div style={{
              width: '12px', height: '12px',
              border: '2px solid #BFDBFE',
              borderTop: '2px solid #1D4ED8',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            Analysing...
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            AI Suggest Priority
          </>
        )}
      </button>

      {suggested && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: priorityColors[suggested]?.bg,
          color: priorityColors[suggested]?.color,
        }}>
          ✓ Suggested: {suggested}
        </span>
      )}
    </div>
  );
};

// ── Innovation 2: Status Timeline ────────────────────────────────────────────
const StatusTimeline = ({ history, createdAt, reporterName }) => {
  const statusColors = {
    OPEN:        { bg: '#DBEAFE', color: '#1D4ED8', dot: '#2563EB' },
    IN_PROGRESS: { bg: '#FEF3C7', color: '#B45309', dot: '#F59E0B' },
    RESOLVED:    { bg: '#D1FAE5', color: '#047857', dot: '#10B981' },
    CLOSED:      { bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
    REJECTED:    { bg: '#FEE2E2', color: '#DC2626', dot: '#EF4444' },
  };

  const statusLabels = {
    OPEN: 'Ticket Opened',
    IN_PROGRESS: 'Work Started',
    RESOLVED: 'Issue Resolved',
    CLOSED: 'Ticket Closed',
    REJECTED: 'Ticket Rejected',
  };

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Status Timeline
      </label>
      <div style={{ marginTop: '12px', position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '11px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          backgroundColor: '#E2E8F0',
          zIndex: 0,
        }} />

        {/* Created entry */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            backgroundColor: '#F1F5F9', border: '2px solid #94A3B8',
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
          </div>
          <div style={{ paddingTop: '2px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', margin: 0 }}>Ticket Created</p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
              by {reporterName} · {formatDateTime(createdAt)}
            </p>
          </div>
        </div>

        {/* History entries */}
        {(history || []).filter(h => h.toStatus !== 'OPEN').map((entry, idx) => {
          const colors = statusColors[entry.toStatus] || statusColors.OPEN;
          return (
            <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: colors.bg,
                border: `2px solid ${colors.dot}`,
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.dot }} />
              </div>
              <div style={{ paddingTop: '2px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', margin: 0 }}>
                    {statusLabels[entry.toStatus] || entry.toStatus}
                  </p>
                  <span style={{
                    padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
                    fontWeight: '600', backgroundColor: colors.bg, color: colors.color
                  }}>
                    {entry.toStatus}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                  by {entry.changedByName} · {formatDateTime(entry.changedAt)}
                </p>
                {entry.note && entry.note !== 'Ticket created' && (
                  <p style={{
                    fontSize: '12px', color: '#475569', margin: '4px 0 0',
                    padding: '6px 10px', backgroundColor: '#F8FAFC',
                    borderRadius: '6px', borderLeft: `3px solid ${colors.dot}`,
                  }}>
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main IncidentManager ──────────────────────────────────────────────────────
const IncidentManager = ({ forceOpenCreate = false, onModalClose = () => {} }) => {
  const { getUserInfo, isAdmin, isModerator } = useRole();
  const userInfo = getUserInfo();
  const isStaff = isAdmin() || isModerator();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [commentText, setCommentText] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(forceOpenCreate);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'OTHER',
    priority: 'MEDIUM', location: '', reporterContact: userInfo?.email || ''
  });
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [files, setFiles] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { if (forceOpenCreate) setShowCreateModal(true); }, [forceOpenCreate]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
      if (selectedTicket) {
        const updated = res.data.find(t => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err) {
      showToast('Failed to load tickets', 'error');
    } finally { setLoading(false); }
  }, [selectedTicket]);

  useEffect(() => { fetchTickets(); }, []);

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    if (editingTicketId) {
      try {
        await api.put(`/tickets/${editingTicketId}`, formData);
        showToast('Ticket updated successfully', 'success');
        setShowCreateModal(false);
        setEditingTicketId(null);
        fetchTickets();
      } catch (err) {
        showToast('Error updating ticket', 'error');
      } finally { setActionLoading(false); }
      return;
    }

    const data = new FormData();
    const payload = { ...formData, reporterContact: userInfo.email };
    data.append('ticket', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    files.forEach(file => data.append('files', file));

    try {
      await api.post('/tickets', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Incident raised successfully', 'success');
      setShowCreateModal(false);
      onModalClose();
      fetchTickets();
    } catch (err) {
      showToast('Error raising ticket', 'error');
    } finally { setActionLoading(false); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/tickets/${selectedTicket.id}/comments`, { content: commentText });
      setCommentText('');
      fetchTickets();
    } catch (err) { showToast('Comment failed', 'error'); }
  };

  const handleStatusChange = async (action) => {
    setActionLoading(true);
    try {
      let url = `/tickets/${selectedTicket.id}/${action}`;
      if (action === 'resolve') url += `?notes=${encodeURIComponent(actionNotes)}`;
      if (action === 'reject') url += `?reason=${encodeURIComponent(actionNotes)}`;

      await api.patch(url);
      showToast(`Ticket ${action} successful`, 'success');
      setActionNotes('');
      fetchTickets();
    } catch (err) { showToast('Action failed', 'error'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Permanently delete this ticket from the database?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/tickets/${selectedTicket.id}`);
      showToast('Ticket deleted successfully', 'success');
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) { showToast('Delete failed', 'error'); }
    finally { setActionLoading(false); }
  };

  const handleEditTicket = (t) => {
    setFormData({
      title: t.title, description: t.description,
      category: t.category, priority: t.priority,
      location: t.location, reporterContact: t.reporterContact
    });
    setEditingTicketId(t.id);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', category: 'OTHER',
      priority: 'MEDIUM', location: '', reporterContact: userInfo?.email || ''
    });
    setFiles([]);
    setEditingTicketId(null);
  };

  const filteredTickets = tickets.filter(t =>
    (filterStatus === '' || t.status === filterStatus) &&
    (t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     t.location?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const styles = {
    container: { fontFamily: "'Inter', sans-serif" },
    input: {
      padding: '10px 14px', borderRadius: '8px',
      border: '1px solid #E2E8F0', outline: 'none',
      fontSize: '14px', width: '100%', boxSizing: 'border-box',
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      backgroundColor: '#fff', borderRadius: '16px',
      border: '1px solid #E2E8F0', padding: '20px',
      cursor: 'pointer', transition: '0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    btnPrimary: {
      backgroundColor: '#2563EB', color: '#fff',
      padding: '10px 20px', borderRadius: '8px',
      border: 'none', fontWeight: '600', cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
    },
    commentBox: {
      background: '#F8FAFC', padding: '12px',
      borderRadius: '10px', marginBottom: '8px',
      border: '1px solid #E2E8F0',
    },
    managementPanel: {
      backgroundColor: '#F1F5F9', padding: '20px',
      borderRadius: '16px', height: '100%',
      display: 'flex', flexDirection: 'column', gap: '15px',
      overflowY: 'auto',
    },
    label: {
      fontSize: '11px', fontWeight: '700', color: '#94A3B8',
      textTransform: 'uppercase', letterSpacing: '0.05em',
    },
  };

  const priorityBorderColors = {
    LOW: '#94A3B8', MEDIUM: '#2563EB', HIGH: '#BE123C', CRITICAL: '#DC2626',
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard title="Total Tickets" value={tickets.length} icon="settings" color="#2563EB" />
        <StatCard title="Open" value={tickets.filter(t => t.status === 'OPEN').length} icon="clock" color="#F59E0B" />
        <StatCard title="In Progress" value={tickets.filter(t => t.status === 'IN_PROGRESS').length} icon="activity" color="#8B5CF6" />
        <StatCard title="Resolved" value={tickets.filter(t => t.status === 'RESOLVED').length} icon="check" color="#10B981" />
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          style={{ ...styles.input, flex: 1 }}
          placeholder="Search by title or location..."
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select style={{ ...styles.input, width: '160px' }} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        {!isStaff && (
          <button style={styles.btnPrimary} onClick={() => setShowCreateModal(true)}>
            + Raise Ticket
          </button>
        )}
      </div>

      {/* Ticket Grid */}
      {loading ? <LoadingSpinner /> : filteredTickets.length === 0 ? (
        <EmptyState
          icon="settings"
          title="No tickets found"
          message={filterStatus ? 'No tickets match your filter.' : 'No incident tickets yet.'}
          actionLabel={!isStaff ? 'Raise a Ticket' : undefined}
          onAction={!isStaff ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredTickets.map(t => (
            <div
              key={t.id}
              style={{
                ...styles.card,
                borderLeft: `4px solid ${priorityBorderColors[t.priority] || '#E2E8F0'}`,
              }}
              onClick={() => setSelectedTicket(t)}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <StatusBadge status={t.status} />
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {t.status === 'OPEN' && t.reporterId === userInfo?.id && (
                    <button
                      onClick={e => { e.stopPropagation(); handleEditTicket(t); }}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563EB', fontSize: '12px', fontWeight: '600' }}
                    >
                      Edit
                    </button>
                  )}
                  <StatusBadge status={t.priority} size="sm" />
                </div>
              </div>
              <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: '#0F172A' }}>{t.title}</h4>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px' }}>
                {t.location && `📍 ${t.location} · `}
                {new Date(t.createdAt).toLocaleDateString()}
              </p>
              {t.category && (
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                  backgroundColor: '#F1F5F9', color: '#64748B', fontWeight: '500',
                }}>
                  {t.category.replace('_', ' ')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Detail Modal ───────────────────────────────────────────────────── */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Ticket Details" size="xl">
        {selectedTicket && (
          <div style={{ display: 'grid', gridTemplateColumns: isStaff ? '1fr 320px' : '1fr', gap: '28px' }}>

            {/* LEFT: Info + Timeline + Comments */}
            <div style={{ overflowY: 'auto', maxHeight: '70vh', paddingRight: '8px' }}>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <label style={styles.label}>Issue Description</label>
                <p style={{ marginTop: '6px', lineHeight: '1.6', color: '#334155' }}>
                  {selectedTicket.description}
                </p>
              </div>

              {/* Attachments */}
              {selectedTicket.attachments?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={styles.label}>Evidence Attachments</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {selectedTicket.attachments.map((path, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:8081${path}`}
                        alt="attachment"
                        style={{
                          width: '100px', height: '100px', borderRadius: '10px',
                          objectFit: 'cover', border: '1px solid #E2E8F0', cursor: 'pointer',
                        }}
                        onClick={() => window.open(`http://localhost:8081${path}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Innovation 2: Status Timeline */}
              <div style={{
                marginBottom: '24px', padding: '16px',
                backgroundColor: '#F8FAFC', borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}>
                <StatusTimeline
                  history={selectedTicket.statusHistory || []}
                  createdAt={selectedTicket.createdAt}
                  reporterName={selectedTicket.reporterName}
                />
              </div>

              {/* Comments */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                <label style={styles.label}>Comments</label>
                <div style={{ maxHeight: '220px', overflowY: 'auto', marginTop: '10px', paddingRight: '4px' }}>
                  {selectedTicket.comments?.length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#94A3B8' }}>No comments yet.</p>
                  ) : (
                    selectedTicket.comments?.map(c => (
                      <div key={c.id} style={styles.commentBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700' }}>
                            {c.authorName} <StatusBadge status={c.authorRole} size="sm" />
                          </span>
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                            {new Date(c.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', marginTop: '4px', color: '#1E293B' }}>{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {['RESOLVED', 'CLOSED', 'REJECTED'].includes(selectedTicket.status) ? (
                  <div style={{
                    marginTop: '15px', padding: '12px', background: '#FEF2F2',
                    borderRadius: '10px', border: '1px solid #FECACA',
                  }}>
                    <span style={{ color: '#DC2626', fontSize: '13px', fontWeight: '600' }}>
                      Ticket is {selectedTicket.status}. Replies are disabled.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <input
                      style={styles.input}
                      placeholder="Post a comment..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                    />
                    <button type="submit" style={{ ...styles.btnPrimary, whiteSpace: 'nowrap' }}>Post</button>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT: Staff Management Panel */}
            {isStaff && (
              <div style={styles.managementPanel}>
                <label style={styles.label}>Workflow Controls</label>

                {selectedTicket.status === 'OPEN' && (
                  <button
                    style={styles.btnPrimary}
                    onClick={() => handleStatusChange('assign')}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Assign to Me'}
                  </button>
                )}

                {selectedTicket.status === 'IN_PROGRESS' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <textarea
                      style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                      placeholder="Resolution notes..."
                      value={actionNotes}
                      onChange={e => setActionNotes(e.target.value)}
                    />
                    <button
                      style={{ ...styles.btnPrimary, backgroundColor: '#10B981' }}
                      onClick={() => handleStatusChange('resolve')}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Mark as Resolved'}
                    </button>
                    <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>
                      ✉️ Reporter will receive an email notification
                    </p>
                  </div>
                )}

                {selectedTicket.status === 'RESOLVED' && isAdmin() && (
                  <div style={{ backgroundColor: '#DBEAFE', padding: '12px', borderRadius: '10px' }}>
                    <p style={{ fontSize: '12px', color: '#1E40AF', marginBottom: '8px' }}>
                      Technician has resolved this. Proceed to close?
                    </p>
                    <button
                      style={{ ...styles.btnPrimary, width: '100%', background: '#1E293B' }}
                      onClick={() => handleStatusChange('close')}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Close Ticket'}
                    </button>
                  </div>
                )}

                {(selectedTicket.status === 'OPEN' || selectedTicket.status === 'IN_PROGRESS') && isAdmin() && (
                  <div style={{ borderTop: '1px solid #CBD5E1', paddingTop: '10px', marginTop: '10px' }}>
                    <label style={{ fontSize: '11px', color: '#EF4444', fontWeight: '700' }}>DANGER ZONE</label>
                    <input
                      style={{ ...styles.input, marginTop: '8px' }}
                      placeholder="Rejection reason..."
                      value={actionNotes}
                      onChange={e => setActionNotes(e.target.value)}
                    />
                    <button
                      style={{ ...styles.btnPrimary, backgroundColor: '#EF4444', width: '100%', marginTop: '8px' }}
                      onClick={() => handleStatusChange('reject')}
                      disabled={actionLoading || !actionNotes.trim()}
                    >
                      {actionLoading ? 'Processing...' : 'Reject Report'}
                    </button>
                    <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0' }}>
                      ✉️ Reporter will receive an email notification
                    </p>
                  </div>
                )}

                {selectedTicket.status === 'CLOSED' && isAdmin() && (
                  <button
                    style={{ ...styles.btnPrimary, backgroundColor: '#991B1B' }}
                    onClick={handleDeleteTicket}
                    disabled={actionLoading}
                  >
                    Permanent Delete
                  </button>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #CBD5E1' }}>
                  <label style={styles.label}>Reporter</label>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', margin: '4px 0 2px' }}>
                    {selectedTicket.reporterName}
                  </p>
                  <p style={{ fontSize: '13px', color: '#2563EB', margin: 0 }}>
                    {selectedTicket.reporterContact}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Create / Edit Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); onModalClose(); }}
        title={editingTicketId ? 'Edit Incident Ticket' : 'Raise Incident Ticket'}
      >
        <form onSubmit={handleRaiseTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={styles.label}>Title *</label>
            <input
              style={{ ...styles.input, marginTop: '6px' }}
              value={formData.title}
              placeholder="e.g. Broken AC in Lab 01"
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Description *</label>
            <textarea
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical', marginTop: '6px' }}
              value={formData.description}
              placeholder="Please describe the issue in detail..."
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={styles.label}>Location *</label>
              <input
                style={{ ...styles.input, marginTop: '6px' }}
                value={formData.location}
                placeholder="Room / Block"
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Category</label>
              <select
                style={{ ...styles.input, marginTop: '6px' }}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="HVAC">HVAC</option>
                <option value="FURNITURE">Furniture</option>
                <option value="IT_EQUIPMENT">IT Equipment</option>
                <option value="CLEANING">Cleaning</option>
                <option value="SECURITY">Security</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Priority with AI suggestion */}
          <div>
            <label style={styles.label}>Priority</label>
            <select
              style={{ ...styles.input, marginTop: '6px' }}
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            {/* Innovation 1: AI Suggestion Button */}
            <AIPrioritySuggestor
              title={formData.title}
              description={formData.description}
              onSuggest={(priority) => setFormData(prev => ({ ...prev, priority }))}
            />
          </div>

          {!editingTicketId && (
            <div>
              <label style={styles.label}>Attachments (Max 3 Images)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => setFiles(Array.from(e.target.files).slice(0, 3))}
                style={{ marginTop: '6px' }}
              />
              {files.length > 0 && (
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  {files.length} file{files.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            style={{ ...styles.btnPrimary, height: '48px', fontSize: '15px' }}
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : (editingTicketId ? 'Update Ticket' : 'Raise Ticket')}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default IncidentManager;
