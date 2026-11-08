import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import EventsView from './views/EventsView';
import ContactView from './views/ContactView';
import AdminView from './views/AdminView';
import RegisterView from './views/RegisterView';
import MemberLoginView from './views/MemberLoginView';
import MemberPortalView from './views/MemberPortalView';
import VerifyEmailView from './views/VerifyEmailView';
import ForgotPasswordView from './views/ForgotPasswordView';
import ResetPasswordView from './views/ResetPasswordView';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/events" element={<EventsView />} />
            <Route path="/contact" element={<ContactView />} />
            <Route path="/member-login" element={<MemberLoginView />} />
            <Route path="/member-portal" element={<MemberPortalView />} />
            <Route path="/verify-email" element={<VerifyEmailView />} />
            <Route path="/forgot-password" element={<ForgotPasswordView />} />
            <Route path="/reset-password" element={<ResetPasswordView />} />
            <Route path="/admin" element={<AdminView />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}