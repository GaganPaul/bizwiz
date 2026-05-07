import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since this is a static demo or uses simple backend, we can just show a success message
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Contact Consultant</h1>
        <p className="page-subtitle">Get in touch with an expert human business consultant for personalized advice and services.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Contact Info Card */}
        <div className="card" style={{ flex: '1 1 300px' }}>
          <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Consultant Details</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expert Admin</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '0.25rem' }}>Gagan Paul</div>
            <div style={{ color: 'var(--text-secondary)' }}>Senior Business & Legal Consultant</div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '0.25rem' }}>
              <a href="mailto:admin@bizwiz.com">admin@bizwiz.com</a>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '0.25rem' }}>+91 98765 43210</div>
          </div>

          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Working Hours</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '0.25rem' }}>Mon - Fri, 9:00 AM - 6:00 PM IST</div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="card" style={{ flex: '2 1 400px' }}>
          <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Send a Message</h2>
          
          {submitted ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0, 200, 83, 0.1)', borderRadius: 'var(--radius-md)', color: '#00c853', fontWeight: '500' }}>
              Your message has been sent successfully! Our consultant will get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="John Doe" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john@example.com" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea 
                  className="form-input" 
                  rows="5" 
                  placeholder="How can we help you with your business?" 
                  required
                  style={{ resize: 'vertical' }}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Contact;
