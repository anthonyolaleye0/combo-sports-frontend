import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmailToken } from '../services/apiService';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState({ loading: true, message: '', error: false });

  useEffect(() => {
    if (!token) {
      setStatus({ loading: false, message: 'Invalid verification link.', error: true });
      return;
    }
    verifyEmailToken(token)
      .then((res) => setStatus({ loading: false, message: res.message, error: false }))
      .catch((err) => setStatus({ loading: false, message: err.response?.data?.message || 'Verification failed.', error: true }));
  }, [token]);

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      {status.loading ? (
        <p>Verifying your email address...</p>
      ) : (
        <div>
          {status.error ? <XCircle size={48} color="#e53e3e" style={{ marginBottom: '1rem' }} /> : <CheckCircle size={48} color="#16a34a" style={{ marginBottom: '1rem' }} />}
          <h2 style={{ color: '#0a192f' }}>{status.error ? 'Verification Error' : 'Email Verified!'}</h2>
          <p style={{ color: '#4a5568', margin: '1rem 0 2rem 0' }}>{status.message}</p>
          <Link to="/member-login" style={{ backgroundColor: '#0a192f', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
            Proceed to Member Login
          </Link>
        </div>
      )}
    </div>
  );
}