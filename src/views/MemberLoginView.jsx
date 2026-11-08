import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginMember } from '../services/apiService';

export default function MemberLoginView() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginMember(credentials);
      if (res.success) {
        localStorage.setItem('combo_member', JSON.stringify(res.data));
        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/member-portal');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#0a192f', textAlign: 'center', marginBottom: '1.5rem' }}>Member Login</h2>
      
      {error && <p style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '0.6rem', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568' }}>Email Address</label>
          <input type="email" name="email" value={credentials.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568' }}>Password</label>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ backgroundColor: '#0a192f', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
          Login to Account
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.85rem' }}>
        <Link to="/forgot-password" style={{ color: '#3182ce', textDecoration: 'none' }}>Forgot Password?</Link>
        <Link to="/register" style={{ color: '#3182ce', textDecoration: 'none', fontWeight: 'bold' }}>Create New Account</Link>
      </div>
    </div>
  );
}