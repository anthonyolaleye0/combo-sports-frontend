import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', error: false });

    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setStatus({ message: res.data.message, error: false });
      setEmail('');
    } catch (err) {
      setStatus({ 
        message: err.response?.data?.message || 'Failed to process request. Please check the email address.', 
        error: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: '450px', width: '100%', backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/member-login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4a5568', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <KeyRound size={40} color="#f5a623" style={{ marginBottom: '0.5rem' }} />
          <h2 style={{ color: '#0a192f', margin: 0, fontSize: '1.8rem' }}>Reset Password</h2>
          <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Enter your registered email address to receive a secure password reset link.
          </p>
        </div>

        {status.message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '6px', 
            marginBottom: '1.5rem', 
            backgroundColor: status.error ? '#fed7d7' : '#dcfce7', 
            color: status.error ? '#9b2c2c' : '#14532d',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '500'
          }}>
            {!status.error && <CheckCircle size={20} color="#16a34a" />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Email Address *</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: '#0a192f', 
              color: '#fff', 
              border: 'none', 
              padding: '0.85rem', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading && <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}