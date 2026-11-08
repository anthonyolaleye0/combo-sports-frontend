import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';
import { fetchPrograms, fetchEvents } from '../services/apiService';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function HomeView() {
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchPrograms()
      .then((res) => { if (res.success) setPrograms(res.data); })
      .catch((err) => console.error('Error loading programs:', err));

    fetchEvents()
      .then((res) => { if (res.success) setEvents(res.data); })
      .catch((err) => console.error('Error loading events:', err));
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)', 
        color: '#fff', 
        padding: '5.5rem 2rem', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '3rem', color: '#f5a623', marginBottom: '1rem', fontWeight: '800' }}>
          DEVELOPING MORE THAN ATHLETES
        </h1>
        <p style={{ fontSize: '1.4rem', fontWeight: '300', marginBottom: '1.5rem', color: '#ccd6f6' }}>
          Building Talent. Shaping Minds. Creating Futures.
        </p>
        <p style={{ maxWidth: '750px', margin: '0 auto 2rem auto', lineHeight: '1.7', color: '#8892b0', fontSize: '1.05rem' }}>
          At Combo Sports Ltd, we develop well-rounded young people. We go beyond the field to develop confidence, leadership, teamwork, resilience, and professionalism.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/register" 
            style={{
              backgroundColor: '#f5a623',
              color: '#0a192f',
              padding: '0.8rem 2rem',
              borderRadius: '4px',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(245, 166, 35, 0.4)'
            }}
          >
            Become a Member
          </Link>
          <Link 
            to="/member-login" 
            style={{
              border: '2px solid #f5a623',
              color: '#f5a623',
              padding: '0.8rem 2rem',
              borderRadius: '4px',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            Member Login
          </Link>
        </div>
      </section>

      {/* Core Offerings Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#0a192f', marginBottom: '0.5rem', fontSize: '2.2rem' }}>
          Core Pillars & Offerings
        </h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: '3rem' }}>Comprehensive training programs designed for holistic excellence</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {programs.map((prog) => (
            <ProgramCard key={prog.id} icon={prog.icon} title={prog.title} description={prog.description} />
          ))}
        </div>
      </section>

      {/* Closest 3 Upcoming Events Section */}
      <section style={{ backgroundColor: '#f8fafc', padding: '4rem 2rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#0a192f', marginBottom: '0.5rem', fontSize: '2.2rem' }}>
            Upcoming Events & Activities
          </h2>
          <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2.5rem' }}>Next scheduled sessions and activities</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {events.slice(0, 3).map((ev) => (
              <div key={ev.id} style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '8px', 
                padding: '2rem', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                borderLeft: '4px solid #f5a623',
                borderTop: '1px solid #e2e8f0',
                borderRight: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ color: '#0a192f', marginBottom: '0.75rem', fontSize: '1.25rem' }}>{ev.title}</h3>
                  <p style={{ color: '#4a5568', fontSize: '0.95rem', marginBottom: '1.2rem', lineHeight: '1.5' }}>{ev.description}</p>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#718096', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid #edf2f7', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="#f5a623" /> <span>{ev.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="#f5a623" /> <span>{ev.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="#f5a623" /> <span>{ev.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link 
              to="/events" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#0a192f',
                color: '#fff',
                padding: '0.75rem 1.8rem',
                borderRadius: '4px',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}
            >
              View All Events & Activities <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ backgroundColor: '#0a192f', color: '#fff', textAlign: 'center', padding: '4rem 2rem' }}>
        <h3 style={{ fontSize: '1.8rem', color: '#f5a623', marginBottom: '1rem' }}>
          Discover Your Talent. Develop Your Potential. Build Your Future Through Sport.
        </h3>
        <p style={{ color: '#a0aec0', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Get in touch with us today at Shagari Estate, Ipaja Road, Lagos, or send us a message via WhatsApp.
        </p>
        <a 
          href="https://wa.me/2348106009345" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            backgroundColor: '#25D366',
            color: '#fff',
            padding: '0.75rem 1.8rem',
            borderRadius: '4px',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Chat on WhatsApp (+234 810 600 9345)
        </a>
      </section>
    </div>
  );
}