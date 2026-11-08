import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check login state and role whenever route changes
  useEffect(() => {
    const saved = localStorage.getItem('combo_member');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#0a192f', color: '#fff' }}>
      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f5a623' }}>
        COMBO SPORTS LTD
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
        <Link to="/events" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Events & Activities</Link>
        <Link to="/contact" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Contact Us</Link>

        {user ? (
          <>
            <Link to="/member-portal" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Member Portal</Link>
            
            {/* Render Admin Control link ONLY if user role is admin */}
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: '#f5a623', textDecoration: 'none', fontWeight: 'bold' }}>
                Admin Control
              </Link>
            )}
          </>
        ) : (
          <Link to="/member-login" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Member Portal</Link>
        )}
      </div>
    </nav>
  );
}