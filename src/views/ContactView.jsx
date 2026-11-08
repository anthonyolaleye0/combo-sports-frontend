import React, { useState } from 'react';
import { sendInquiry } from '../services/apiService';

export default function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendInquiry(formData);
      setStatus('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('Failed to submit message. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <h2 style={{ color: '#0a192f', textAlign: 'center', marginBottom: '2rem' }}>Get in Touch</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#0a192f', marginBottom: '1rem' }}>Contact Details</h3>
          <p style={{ color: '#4a5568', fontSize: '0.95rem', marginBottom: '1rem' }}>
            <strong>Address:</strong><br />
            NO 11 B.O STREET SHAGARI ESTATE, AKINOGUN BUS STOP IPAJA ROAD LAGOS
          </p>
          <p style={{ color: '#4a5568', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            <strong>Email:</strong> combosportltd@gmail.com
          </p>
          <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>
            <strong>WhatsApp:</strong>{' '}
            <a href="https://wa.me/2348106009345" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 'bold' }}>
              +234 810 600 9345
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" name="name" placeholder="Your Full Name" value={formData.name} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="email" name="email" placeholder="Your Email Address" value={formData.email} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" name="phone" placeholder="Phone Number / WhatsApp" value={formData.phone} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <textarea name="message" rows="4" placeholder="How can we help you?" value={formData.message} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
          <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#0a192f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Send Inquiry
          </button>
          {status && <p style={{ color: status.includes('Thank') ? 'green' : 'red', fontSize: '0.9rem' }}>{status}</p>}
        </form>
      </div>
    </div>
  );
}