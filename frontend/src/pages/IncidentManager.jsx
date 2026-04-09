import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import useRole from '../hooks/useRole';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

const IncidentManager = ({ forceOpenCreate = false, onModalClose = () => {} }) => {
  const { getUserInfo, isAdmin, isModerator } = useRole();
  const userInfo = getUserInfo();
  const isStaff = isAdmin() || isModerator();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Creation & Action States
  const [commentText, setCommentText] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(forceOpenCreate);
  const [formData, setFormData] = useState({ 
    title: '', description: '', category: 'OTHER', priority: 'MEDIUM', location: '', reporterContact: userInfo?.email || '' 
  });
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [files, setFiles] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Sync modal state with external trigger (e.g., from Home tab)
  useEffect(() => { if (forceOpenCreate) setShowCreateModal(true); }, [forceOpenCreate]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
      // Refresh current selected ticket data to update comments/status
      if (selectedTicket) {
        const updated = res.data.find(t => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err) {
      showToast("Failed to load tickets", "error");
    } finally { setLoading(false); }
  }, [selectedTicket]);

  useEffect(() => { fetchTickets(); }, []);

  // --- HANDLERS ---

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    if (editingTicketId) {
      try {
        await api.put(`/tickets/${editingTicketId}`, formData);
        showToast("Ticket updated successfully", "success");
        setShowCreateModal(false);
        setEditingTicketId(null);
        fetchTickets();
      } catch (err) {
        showToast("Error updating ticket", "error");
      } finally {
        setActionLoading(false);
      }
      return;
    }

    const data = new FormData();
    // Ensure email is set as reporterContact
    const payload = { ...formData, reporterContact: userInfo.email };
    data.append('ticket', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    files.forEach(file => data.append('files', file));

    try {
      await api.post('/tickets', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast("Incident raised successfully", "success");
      setShowCreateModal(false);
      onModalClose();
      fetchTickets();
    } catch (err) {
      showToast("Error raising ticket", "error");
    } finally { setActionLoading(false); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/tickets/${selectedTicket.id}/comments`, { content: commentText });
      setCommentText('');
      fetchTickets();
    } catch (err) { showToast("Comment failed", "error"); }
  };

  const handleStatusChange = async (action) => {
    setActionLoading(true);
    try {
      let url = `/tickets/${selectedTicket.id}/${action}`;
      if (action === 'resolve') url += `?notes=${encodeURIComponent(actionNotes)}`;
      if (action === 'reject') url += `?reason=${encodeURIComponent(actionNotes)}`;
      
      await api.patch(url);
      showToast(`Ticket ${action} successful`, "success");
      setActionNotes('');
      fetchTickets();
    } catch (err) { showToast("Action failed", "error"); }
    finally { setActionLoading(false); }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm("Permanently delete this ticket from the Database?")) return;
    setActionLoading(true);
    try {
      await api.delete(`/tickets/${selectedTicket.id}`);
      showToast("Ticket deleted successfully", "success");
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) { showToast("Delete failed", "error"); }
    finally { setActionLoading(false); }
  };

  const handleEditTicket = (t) => {
    setFormData({
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      location: t.location,
      reporterContact: t.reporterContact
    });
    setEditingTicketId(t.id);
    setShowCreateModal(true);
  };

  const filteredTickets = tickets.filter(t => 
    (filterStatus === '' || t.status === filterStatus) &&
    (t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.location?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const styles = {
    container: { fontFamily: "'Inter', sans-serif" },
    input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%' },
    card: { backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', cursor: 'pointer', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    btnPrimary: { backgroundColor: '#2563EB', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' },
    commentBox: { background: '#F8FAFC', padding: '12px', borderRadius: '10px', marginBottom: '8px', border: '1px solid #E2E8F0' },
    managementPanel: { backgroundColor: '#F1F5F9', padding: '20px', borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column', gap: '15px' },
    label: { fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }
  };

  return (
    <div style={styles.container}>
      {/* 1. Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard title="Total Tickets" value={tickets.length} icon="settings" color="#2563EB" />
        <StatCard title="Open" value={tickets.filter(t => t.status === 'OPEN').length} icon="clock" color="#F59E0B" />
        <StatCard title="In Progress" value={tickets.filter(t => t.status === 'IN_PROGRESS').length} icon="activity" color="#8B5CF6" />
        <StatCard title="Resolved" value={tickets.filter(t => t.status === 'RESOLVED').length} icon="check" color="#10B981" />
      </div>

      {/* 2. Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input style={{ ...styles.input, flex: 1 }} placeholder="Search by title or location..." onChange={e => setSearchTerm(e.target.value)} />
        <select style={{ ...styles.input, width: '160px' }} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        {!isStaff && (
          <button style={styles.btnPrimary} onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: '8px' }}>+</span> Raise Ticket
          </button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredTickets.map(t => (
            <div key={t.id} style={styles.card} onClick={() => setSelectedTicket(t)} onMouseOver={e => e.currentTarget.style.transform='translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <StatusBadge status={t.status} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  {t.status === 'OPEN' && t.reporterId === userInfo?.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditTicket(t); }} 
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563EB', fontSize: '12px', fontWeight: '600' }}
                    >
                      Edit
                    </button>
                  )}
                  <StatusBadge status={t.priority} size="sm" />
                </div>
              </div>
              <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{t.title}</h4>
              <p style={{ fontSize: '13px', color: '#64748B' }}>{t.location} • {new Date(t.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL VIEW MODAL */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Ticket Management" size="xl">
        {selectedTicket && (
          <div style={{ display: 'grid', gridTemplateColumns: isStaff ? '1fr 320px' : '1fr', gap: '28px' }}>
            
            {/* LEFT: Info & Activity Thread */}
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label style={styles.label}>Issue Description</label>
                <p style={{ marginTop: '6px', lineHeight: '1.6', color: '#334155' }}>{selectedTicket.description}</p>
              </div>

              {selectedTicket.attachments?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={styles.label}>Attachments</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    {selectedTicket.attachments.map((path, idx) => (
                      <img key={idx} src={`http://localhost:8081/uploads/${path.split('/').pop()}`} alt="fault" 
                           style={{ width: '100px', height: '100px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #E2E8F0', cursor: 'pointer' }} 
                           onClick={() => window.open(`http://localhost:8081/uploads/${path.split('/').pop()}`)} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                <label style={styles.label}>Activity & Comments</label>
                <div style={{ maxHeight: '280px', overflowY: 'auto', marginTop: '10px', paddingRight: '10px' }}>
                  {selectedTicket.comments?.length === 0 ? <p style={{fontSize:'13px', color:'#94A3B8'}}>No comments yet.</p> : 
                    selectedTicket.comments?.map(c => (
                    <div key={c.id} style={styles.commentBox}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>{c.authorName} <StatusBadge status={c.authorRole} size="sm" /></span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(c.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p style={{ fontSize: '14px', marginTop: '4px', color: '#1E293B' }}>{c.content}</p>
                    </div>
                  ))}
                </div>
                {['RESOLVED', 'CLOSED', 'REJECTED'].includes(selectedTicket.status) ? (
                  <div style={{ marginTop: '15px', padding: '12px', background: '#FEE2E2', borderRadius: '10px', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#DC2626', fontSize: '13px', fontWeight: '600' }}>
                      Ticket is {selectedTicket.status}. Further replies are disabled.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <input style={styles.input} placeholder="Post a comment or update..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                    <button type="submit" style={{ ...styles.btnPrimary, whiteSpace: 'nowrap' }}>Post</button>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT: Management & Workflow (Staff/Admin) */}
            {isStaff && (
              <div style={styles.managementPanel}>
                <label style={styles.label}>Workflow Controls</label>
                
                {selectedTicket.status === 'OPEN' && (
                  <button style={styles.btnPrimary} onClick={() => handleStatusChange('assign')}>Assign to Me</button>
                )}

                {selectedTicket.status === 'IN_PROGRESS' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <textarea style={{ ...styles.input, minHeight: '80px' }} placeholder="Resolution notes..." onChange={e => setActionNotes(e.target.value)} />
                    <button style={{ ...styles.btnPrimary, backgroundColor: '#10B981' }} onClick={() => handleStatusChange('resolve')}>Mark as Resolved</button>
                  </div>
                )}

                {/* RESOLVED -> CLOSED (Admin only) */}
                {selectedTicket.status === 'RESOLVED' && isAdmin() && (
                  <div style={{ backgroundColor: '#DBEAFE', padding: '12px', borderRadius: '10px' }}>
                    <p style={{ fontSize: '12px', color: '#1E40AF', marginBottom: '8px' }}>Technician has resolved this. Proceed to close?</p>
                    <button style={{ ...styles.btnPrimary, width: '100%', background: '#1E293B' }} onClick={() => handleStatusChange('close')}>Close Ticket</button>
                  </div>
                )}

                {/* REJECT Logic (Admin only) */}
                {(selectedTicket.status === 'OPEN' || selectedTicket.status === 'IN_PROGRESS') && isAdmin() && (
                  <div style={{ borderTop: '1px solid #CBD5E1', pt: '10px', mt: '10px' }}>
                    <label style={{ fontSize: '11px', color: '#EF4444', fontWeight: '700' }}>DANGER ZONE</label>
                    <input style={{ ...styles.input, marginTop: '5px' }} placeholder="Rejection reason..." onChange={e => setActionNotes(e.target.value)} />
                    <button style={{ ...styles.btnPrimary, backgroundColor: '#EF4444', width: '100%', marginTop: '8px' }} onClick={() => handleStatusChange('reject')}>Reject Report</button>
                  </div>
                )}

                {/* DELETE Logic (Admin only, only if CLOSED) */}
                {selectedTicket.status === 'CLOSED' && isAdmin() && (
                  <button style={{ ...styles.btnPrimary, backgroundColor: '#991B1B' }} onClick={handleDeleteTicket}>Permanent Delete (DB)</button>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #CBD5E1' }}>
                  <label style={styles.label}>Reporter Email</label>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>{selectedTicket.reporterName}</p>
                  <p style={{ fontSize: '13px', color: '#2563EB' }}>{selectedTicket.reporterContact}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* RAISE TICKET MODAL */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => { 
          setShowCreateModal(false); 
          setEditingTicketId(null);
          setFormData({ 
            title: '', description: '', category: 'OTHER', priority: 'MEDIUM', location: '', reporterContact: userInfo?.email || '' 
          });
          onModalClose(); 
        }} 
        title={editingTicketId ? "Edit Incident Ticket" : "Raise Incident Ticket"}
      >
         <form onSubmit={handleRaiseTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={styles.label}>Title</label>
              <input 
                style={styles.input} 
                value={formData.title}
                placeholder="e.g. Broken AC in Lab 01" 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label style={styles.label}>Description</label>
              <textarea 
                style={{ ...styles.input, minHeight: '100px' }} 
                value={formData.description}
                placeholder="Please describe the issue..." 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                required 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={styles.label}>Location</label>
                <input 
                  style={styles.input} 
                  value={formData.location}
                  placeholder="Room / Block" 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label style={styles.label}>Priority</label>
                <select 
                  style={styles.input} 
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
            {!editingTicketId && (
              <div>
                <label style={styles.label}>Attachments (Max 3 Images)</label>
                <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files).slice(0,3))} style={{marginTop:'5px'}} />
              </div>
            )}
            <button type="submit" style={{ ...styles.btnPrimary, height: '48px', fontSize: '16px' }} disabled={actionLoading}>
              {actionLoading ? "Processing..." : (editingTicketId ? "Update Ticket" : "Raise Ticket")}
            </button>
         </form>
      </Modal>
    </div>
  );
};

export default IncidentManager;