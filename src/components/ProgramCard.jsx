import React from 'react';

export default function ProgramCard({ icon, title, description }) {
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ color: '#0a192f', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.5' }}>{description}</p>
    </div>
  );
}