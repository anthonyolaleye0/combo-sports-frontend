import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateMemberProfile } from '../services/apiService';
import { Camera, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const CATEGORIES = [
  'Talent Development',
  'Mentorship & Leadership',
  'Sports Analysis & Coaching',
  'Commentary & Journalism',
  'Sports Management & Administration',
  'Fitness, Discipline & Life Skills'
];

export default function MemberPortalView() {
  const [member, setMember] = useState(null);
  const [profileForm, setProfileForm] = useState({ 
    full_name: '', 
    phone: '', 
    category: '', 
    bio: '', 
    passport_photo: '' 
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('combo_member');
    if (!saved) {
      navigate('/member-login');
      return;
    }
    const data = JSON.parse(saved);
    setMember(data);
    setProfileForm({
      full_name: data.full_name || '',
      phone: data.phone || '',
      category: data.category || CATEGORIES[0],
      bio: data.bio || '',
      passport_photo: data.passport_photo || ''
    });
  }, [navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm((prev) => ({ ...prev, passport_photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');
    try {
      await updateMemberProfile(member.id, profileForm);
      const updatedMember = { ...member, ...profileForm };
      localStorage.setItem('combo_member', JSON.stringify(updatedMember));
      setMember(updatedMember);
      setStatusMsg('Your profile has been updated successfully!');
    } catch (err) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('combo_member');
    navigate('/member-login');
  };

  if (!member) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem' }}>
      {/* Header Card */}
      <div style={{ 
        backgroundColor: '#0a192f', 
        color: '#fff', 
        borderRadius: '8px', 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#ccd6f6', 
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '2px solid #f5a623'
          }}>
            {profileForm.passport_photo ? (
              <img src={profileForm.passport_photo} alt="Passport" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={32} color="#0a192f" />
            )}
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#f5a623' }}>{member.full_name}</h2>
            <p style={{ margin: '0.2rem 0', color: '#a0aec0', fontSize: '0.9rem' }}>{member.email}</p>
            <div style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '4px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold', 
              marginTop: '0.4rem', 
              backgroundColor: member.status === 'Confirmed' ? '#22c55e' : member.status === 'Rejected' ? '#ef4444' : '#eab308', 
              color: '#fff' 
            }}>
              Status: {member.status}
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          style={{ 
            backgroundColor: '#e53e3e', 
            color: '#fff', 
            border: 'none', 
            padding: '0.6rem 1.2rem', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          Logout
        </button>
      </div>

      {/* Application Review Banners */}
      {member.status === 'Pending' && (
        <div style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={22} color="#f59e0b" />
          <div>
            <strong>Application Under Review</strong>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Your membership registration is undergoing due diligence by the admin team.</p>
          </div>
        </div>
      )}

      {member.status === 'Confirmed' && (
        <div style={{ backgroundColor: '#dcfce7', borderLeft: '4px solid #16a34a', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', color: '#14532d', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={22} color="#16a34a" />
          <div>
            <strong>Membership Approved!</strong>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Welcome to Combo Sports Limited! You are a fully verified member.</p>
          </div>
        </div>
      )}

      {member.status === 'Rejected' && (
        <div style={{ backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', color: '#7f1d1d', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <XCircle size={22} color="#ef4444" />
          <div>
            <strong>Application Rejected</strong>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}><strong>Reason provided by Admin:</strong> {member.rejection_reason || 'Information submitted did not meet requirements.'}</p>
          </div>
        </div>
      )}

      {/* Profile Edit Form */}
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#0a192f', marginBottom: '1.5rem', margin: 0 }}>My Membership Profile</h3>
        <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' }}>You can update your personal information and upload your passport photo below.</p>

        {statusMsg && (
          <p style={{ color: '#15803d', backgroundColor: '#dcfce7', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {statusMsg}
          </p>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Passport Photograph Upload</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Full Name</label>
            <input 
              type="text" 
              value={profileForm.full_name} 
              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Phone / WhatsApp Number</label>
            <input 
              type="text" 
              value={profileForm.phone} 
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} 
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Selected Category Group</label>
            <select 
              value={profileForm.category} 
              onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', backgroundColor: '#fff', boxSizing: 'border-box' }}
            >
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Bio & Athletic Details</label>
            <textarea 
              rows="3" 
              value={profileForm.bio} 
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} 
              placeholder="Provide background information about your sports history..." 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            style={{ 
              gridColumn: 'span 2', 
              backgroundColor: '#0a192f', 
              color: '#fff', 
              border: 'none', 
              padding: '0.85rem', 
              borderRadius: '4px', 
              cursor: saving ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              fontSize: '0.95rem' 
            }}
          >
            {saving ? 'Saving...' : 'Update My Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}