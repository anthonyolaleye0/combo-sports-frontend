import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchInquiries, 
  deleteInquiry, 
  fetchEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  fetchMembers,
  updateMemberStatus,
  deleteMember,
  toggleUserActive,
  updateUserRole,
  fetchLoginLogs
} from '../services/apiService';
import { ShieldAlert, Lock } from 'lucide-react';

const CATEGORIES = [
  'Talent Development',
  'Mentorship & Leadership',
  'Sports Analysis & Coaching',
  'Commentary & Journalism',
  'Sports Management & Administration',
  'Fitness, Discipline & Life Skills'
];

export default function AdminView() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  
  // Data States
  const [inquiries, setInquiries] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);

  // Event Form State
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', rawDate: '', rawTime: '', location: '', description: '' });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and has admin role
    const savedUser = localStorage.getItem('combo_member');
    if (!savedUser) {
      navigate('/member-login');
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      if (user.role !== 'admin') {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
        loadInquiries();
        loadEvents();
        loadMembers();
        loadLogs();
      }
    } catch (err) {
      navigate('/member-login');
    } finally {
      setCheckingAuth(false);
    }
  }, [navigate]);

  const loadInquiries = () => fetchInquiries().then((res) => res.success && setInquiries(res.data));
  const loadEvents = () => fetchEvents().then((res) => res.success && setEvents(res.data));
  const loadMembers = () => fetchMembers().then((res) => res.success && setMembers(res.data));
  const loadLogs = () => fetchLoginLogs().then((res) => res.success && setLoginLogs(res.data));

  // --- Admin User Controls ---
  const handleToggleActive = async (id, currentState) => {
    const newState = currentState === 1 ? 0 : 1;
    await toggleUserActive(id, newState);
    loadMembers();
  };

  const handleRoleChange = async (id, newRole) => {
    if (window.confirm(`Are you sure you want to change this user role to ${newRole}?`)) {
      await updateUserRole(id, newRole);
      loadMembers();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    let reason = '';
    if (newStatus === 'Rejected') {
      reason = window.prompt('Please enter the reason for rejection:');
      if (reason === null) return;
    }
    await updateMemberStatus(id, newStatus, reason);
    loadMembers();
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member record?')) {
      await deleteMember(id);
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  // --- Inquiry Controls ---
  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      await deleteInquiry(id);
      setInquiries(inquiries.filter((item) => item.id !== id));
    }
  };

  // --- Event Form & CRUD Controls ---
  const handleEventFormChange = (e) => setEventForm({ ...eventForm, [e.target.name]: e.target.value });

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const timeObj = new Date();
    timeObj.setHours(parseInt(hours, 10));
    timeObj.setMinutes(parseInt(minutes, 10));
    return timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleStartEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventForm({ title: ev.title, rawDate: '', rawTime: '', location: ev.location, description: ev.description });
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const formattedDate = eventForm.rawDate ? formatDateForDisplay(eventForm.rawDate) : (editingEvent ? editingEvent.date : '');
    const formattedTime = eventForm.rawTime ? formatTimeForDisplay(eventForm.rawTime) : (editingEvent ? editingEvent.time : '');

    const payload = {
      title: eventForm.title,
      date: formattedDate,
      time: formattedTime,
      location: eventForm.location,
      description: eventForm.description
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        alert('Event updated successfully!');
      } else {
        await createEvent(payload);
        alert('Event created successfully!');
      }
      setEditingEvent(null);
      setEventForm({ title: '', rawDate: '', rawTime: '', location: '', description: '' });
      loadEvents();
    } catch (err) {
      alert('Failed to save event.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
      setEvents(events.filter((ev) => ev.id !== id));
    }
  };

  if (checkingAuth) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#718096' }}>Verifying administrator credentials...</div>;
  }

  // Restrict Access if Not Admin
  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '500px', margin: '5rem auto', padding: '2.5rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <ShieldAlert size={48} color="#e53e3e" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#0a192f', marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
          You must be logged in with an <strong>Administrator</strong> account to access the Admin Control Center.
        </p>
        <button 
          onClick={() => navigate('/member-login')} 
          style={{ backgroundColor: '#0a192f', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Login with Admin Account
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#0a192f', margin: 0 }}>Admin Control Center</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#16a34a', backgroundColor: '#dcfce7', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: 'bold' }}>
          <Lock size={14} /> Administrator Session Active
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('members')} style={{ padding: '0.75rem 1.2rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', borderBottom: activeTab === 'members' ? '3px solid #f5a623' : 'none', color: activeTab === 'members' ? '#0a192f' : '#718096' }}>
          User & Membership Control ({members.length})
        </button>
        <button onClick={() => setActiveTab('logs')} style={{ padding: '0.75rem 1.2rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', borderBottom: activeTab === 'logs' ? '3px solid #f5a623' : 'none', color: activeTab === 'logs' ? '#0a192f' : '#718096' }}>
          Login Records & Audit Logs ({loginLogs.length})
        </button>
        <button onClick={() => setActiveTab('inquiries')} style={{ padding: '0.75rem 1.2rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', borderBottom: activeTab === 'inquiries' ? '3px solid #f5a623' : 'none', color: activeTab === 'inquiries' ? '#0a192f' : '#718096' }}>
          Contact Inquiries ({inquiries.length})
        </button>
        <button onClick={() => setActiveTab('events')} style={{ padding: '0.75rem 1.2rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', borderBottom: activeTab === 'events' ? '3px solid #f5a623' : 'none', color: activeTab === 'events' ? '#0a192f' : '#718096' }}>
          Upcoming Events ({events.length})
        </button>
      </div>

      {/* TAB 1: MEMBERS & USERS */}
      {activeTab === 'members' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a192f', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>User</th>
                <th style={{ padding: '0.75rem' }}>Email & Verified</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Account Status</th>
                <th style={{ padding: '0.75rem' }}>Approval Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Admin Controls</th>
              </tr>
            </thead>
            <tbody>
              {members.map((mem) => (
                <tr key={mem.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <strong>{mem.full_name}</strong><br />
                    <span style={{ fontSize: '0.8rem', color: '#718096' }}>{mem.phone}</span>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#3182ce' }}>{mem.email}</span><br />
                    <span style={{ color: mem.is_verified ? 'green' : 'orange', fontWeight: 'bold' }}>
                      {mem.is_verified ? '✓ Verified' : '⚠ Unverified'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <select value={mem.role} onChange={(e) => handleRoleChange(mem.id, e.target.value)} style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button onClick={() => handleToggleActive(mem.id, mem.is_active)} style={{ backgroundColor: mem.is_active ? '#16a34a' : '#dc2626', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {mem.is_active ? 'Active (Disable)' : 'Disabled (Enable)'}
                    </button>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: mem.status === 'Confirmed' ? '#dcfce7' : mem.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: mem.status === 'Confirmed' ? '#15803d' : mem.status === 'Rejected' ? '#b91c1c' : '#b45309' }}>
                      {mem.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleStatusChange(mem.id, 'Confirmed')} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.3rem', fontSize: '0.75rem' }}>Confirm</button>
                    <button onClick={() => handleStatusChange(mem.id, 'Rejected')} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.3rem', fontSize: '0.75rem' }}>Reject</button>
                    <button onClick={() => handleDeleteMember(mem.id)} style={{ backgroundColor: '#4a5568', color: '#fff', border: 'none', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: LOGIN AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a192f', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Login Time</th>
                <th style={{ padding: '0.75rem' }}>Email Attempted</th>
                <th style={{ padding: '0.75rem' }}>User Role</th>
                <th style={{ padding: '0.75rem' }}>Attempt Status</th>
              </tr>
            </thead>
            <tbody>
              {loginLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#718096' }}>{new Date(log.login_time).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{log.email}</td>
                  <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{log.role}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: log.status === 'SUCCESS' ? '#dcfce7' : '#fee2e2', color: log.status === 'SUCCESS' ? '#15803d' : '#b91c1c' }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div style={{ overflowX: 'auto' }}>
          {inquiries.length === 0 ? <p>No contact inquiries received yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <thead>
                <tr style={{ backgroundColor: '#0a192f', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem' }}>Message</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#718096' }}>{new Date(item.created_at).toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ padding: '0.75rem', color: '#3182ce' }}>{item.email}</td>
                    <td style={{ padding: '0.75rem' }}>{item.phone || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', color: '#4a5568' }}>{item.message}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button onClick={() => handleDeleteInquiry(item.id)} style={{ backgroundColor: '#e53e3e', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 4: UPCOMING EVENTS */}
      {activeTab === 'events' && (
        <div>
          {/* Create / Edit Event Form */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#0a192f', marginBottom: '1rem', marginTop: 0 }}>
              {editingEvent ? 'Edit Upcoming Event' : 'Add New Upcoming Event'}
            </h3>
            <form onSubmit={handleSaveEvent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                name="title" 
                placeholder="Event Title" 
                value={eventForm.title} 
                onChange={handleEventFormChange} 
                required 
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', gridColumn: 'span 2' }} 
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568' }}>Select Date</label>
                <input 
                  type="date" 
                  name="rawDate" 
                  value={eventForm.rawDate} 
                  onChange={handleEventFormChange} 
                  required={!editingEvent}
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568' }}>Select Time</label>
                <input 
                  type="time" 
                  name="rawTime" 
                  value={eventForm.rawTime} 
                  onChange={handleEventFormChange} 
                  required={!editingEvent}
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
              </div>

              <input 
                type="text" 
                name="location" 
                placeholder="Location Address" 
                value={eventForm.location} 
                onChange={handleEventFormChange} 
                required 
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', gridColumn: 'span 2' }} 
              />
              <textarea 
                name="description" 
                rows="3" 
                placeholder="Event Description" 
                value={eventForm.description} 
                onChange={handleEventFormChange} 
                required 
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', gridColumn: 'span 2' }}
              ></textarea>
              
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ backgroundColor: '#0a192f', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                {editingEvent && (
                  <button type="button" onClick={() => setEditingEvent(null)} style={{ backgroundColor: '#718096', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Events Table */}
          <h3 style={{ color: '#0a192f', marginBottom: '1rem' }}>Current Listed Events</h3>
          {events.length === 0 ? <p>No events found.</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0a192f', color: '#fff', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Title</th>
                    <th style={{ padding: '0.75rem' }}>Date & Time</th>
                    <th style={{ padding: '0.75rem' }}>Location</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{ev.title}</td>
                      <td style={{ padding: '0.75rem', color: '#718096', whiteSpace: 'nowrap' }}>{ev.date} at {ev.time}</td>
                      <td style={{ padding: '0.75rem' }}>{ev.location}</td>
                      <td style={{ padding: '0.75rem', color: '#4a5568' }}>{ev.description}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button onClick={() => handleStartEditEvent(ev)} style={{ backgroundColor: '#d69e2e', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.4rem' }}>Edit</button>
                        <button onClick={() => handleDeleteEvent(ev.id)} style={{ backgroundColor: '#e53e3e', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}