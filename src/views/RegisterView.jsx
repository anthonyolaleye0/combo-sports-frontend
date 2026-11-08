import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerMember } from '../services/apiService';
import { UserPlus, CheckCircle, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Talent Development',
  'Mentorship & Leadership',
  'Sports Analysis & Coaching',
  'Commentary & Journalism',
  'Sports Management & Administration',
  'Fitness, Discipline & Life Skills'
];

export default function RegisterView() {
  const [signupForm, setSignupForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    category: CATEGORIES[0]
  });
  const [signupStatus, setSignupStatus] = useState({ message: '', error: false });

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerMember(signupForm);
      setSignupStatus({ message: res.message, error: false });
      setSignupForm({ full_name: '', email: '', phone: '', password: '', category: CATEGORIES[0] });
    } catch (err) {
      setSignupStatus({ 
        message: err.response?.data?.message || 'Registration failed. Please try again.', 
        error: true 
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto', backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        
        {/* Back Navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4a5568', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <UserPlus size={40} color="#f5a623" style={{ marginBottom: '0.5rem' }} />
          <h1 style={{ color: '#0a192f', margin: 0, fontSize: '2rem', fontWeight: '800' }}>Join Combo Sports Limited</h1>
          <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Select your preferred primary category and apply for membership below.
          </p>
        </div>

        {signupStatus.message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '6px', 
            marginBottom: '1.5rem', 
            backgroundColor: signupStatus.error ? '#fed7d7' : '#c6f6d5', 
            color: signupStatus.error ? '#9b2c2c' : '#22543d',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {!signupStatus.error && <CheckCircle size={18} />}
            <span>{signupStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleSignupSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Full Name *</label>
            <input type="text" name="full_name" placeholder="John Doe" value={signupForm.full_name} onChange={handleSignupChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Email Address *</label>
            <input type="email" name="email" placeholder="example@mail.com" value={signupForm.email} onChange={handleSignupChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Phone Number / WhatsApp *</label>
            <input type="tel" name="phone" placeholder="+234..." value={signupForm.phone} onChange={handleSignupChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Select Category Group *</label>
            <select name="category" value={signupForm.category} onChange={handleSignupChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', backgroundColor: '#fff', boxSizing: 'border-box' }}>
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Password (for Member Portal Login) *</label>
            <input type="password" name="password" placeholder="••••••••" value={signupForm.password} onChange={handleSignupChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ gridColumn: 'span 2', backgroundColor: '#0a192f', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem' }}>
            Submit Membership Application
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#718096' }}>
          Already registered? <Link to="/member-login" style={{ color: '#3182ce', fontWeight: 'bold', textDecoration: 'none' }}>Login to Member Portal</Link>
        </div>
      </div>
    </div>
  );
}