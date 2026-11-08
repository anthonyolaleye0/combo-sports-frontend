import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/apiService';
import { Calendar, MapPin, Clock, Search } from 'lucide-react';

export default function EventsView() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents()
      .then((res) => { if (res.success) setEvents(res.data); })
      .catch((err) => console.error('Error loading events:', err));
  }, []);

  const filteredEvents = events.filter((ev) =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header Banner */}
      <section style={{ backgroundColor: '#0a192f', color: '#fff', padding: '3.5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#f5a623', marginBottom: '0.75rem', fontWeight: '800' }}>
          Upcoming Events & Activities
        </h1>
        <p style={{ maxWidth: '650px', margin: '0 auto', color: '#ccd6f6', fontSize: '1.05rem' }}>
          Explore our complete schedule of talent scouting, sports journalism workshops, fitness bootcamps, and youth mentorship sessions.
        </p>
      </section>

      {/* Main Content & Search */}
      <section style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem' }}>
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #cbd5e0', borderRadius: '6px', padding: '0.6rem 1rem', maxWidth: '500px', margin: '0 auto 3rem auto', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <Search size={18} color="#718096" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search events by keyword or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
          />
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem' }}>No events match your query.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {filteredEvents.map((ev) => (
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
        )}
      </section>
    </div>
  );
}