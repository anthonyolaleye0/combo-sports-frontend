import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0a192f', color: '#cbd5e0', padding: '2rem 1rem', marginTop: '3rem', textAlign: 'center' }}>
      <p style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>The Combo Sports Limited</p>
      <p style={{ fontSize: '0.9rem', color: '#f5a623', margin: '0.5rem 0' }}>DEVELOPING MORE THAN ATHLETES — Building Talent. Shaping Minds. Creating Futures.</p>
      <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        NO 11 B.O STREET SHAGARI ESTATE, AKINOGUN BUS STOP IPAJA ROAD LAGOS
      </p>
      <p style={{ fontSize: '0.85rem' }}>
        Email: combosportltd@gmail.com | WhatsApp: +234 810 600 9345
      </p>
      <p style={{ fontSize: '0.75rem', marginTop: '1.5rem', color: '#718096' }}>
        &copy; {new Date().getFullYear()} The Combo Sports Limited. All Rights Reserved.
      </p>
    </footer>
  );
}