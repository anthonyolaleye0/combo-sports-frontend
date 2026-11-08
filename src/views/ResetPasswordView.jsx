import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/apiService';

export default function ResetPasswordView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword(token, newPassword);
      setMsg({ text: res.message, isError: false });
      setTimeout(() => navigate('/member-login'), 2000);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Password reset failed.', isError: true });
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#0a192f', textAlign: 'center', marginBottom: '1.5rem' }}>Set New Password</h2>

      {msg.text && (
        <div style={{ padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', backgroundColor: msg.isError ? '#fed7d7' : '#dcfce7', color: msg.isError ? '#9b2c2c' : '#14532d', fontSize: '0.85rem' }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ backgroundColor: '#0a192f', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Update Password
        </button>
      </form>
    </div>
  );
}