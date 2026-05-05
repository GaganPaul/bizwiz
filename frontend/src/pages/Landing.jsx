import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '📄',
    title: 'Document Analysis',
    desc: 'Upload contracts, policies, and financial documents. Get instant AI-powered summaries and risk breakdowns.',
  },
  {
    icon: '⚖️',
    title: 'India-Specific Compliance',
    desc: 'Identify GST, Companies Act, Labour Law, and MSME compliance gaps with recommended corrective actions.',
  },
  {
    icon: '🤖',
    title: 'AI Business Consultant',
    desc: 'Chat with Bizwiz 24/7. From business registration to tax filings — get end-to-end expert guidance.',
  },
  {
    icon: '🧠',
    title: 'Persistent Memory',
    desc: 'Your AI remembers every conversation. Reload past chats and continue right where you left off.',
  },
  {
    icon: '🚨',
    title: 'Risk Detection',
    desc: 'Automatically flags legal risks, penalties for non-compliance, and key action steps to protect your business.',
  },
  {
    icon: '📊',
    title: 'Document Dashboard',
    desc: 'View all past analyses in one place. Delete, revisit, or export your compliance reports anytime.',
  },
];

const steps = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up in seconds using your email address.' },
  { step: '02', title: 'Upload a Document', desc: 'Upload any PDF, DOCX, or TXT business document.' },
  { step: '03', title: 'Get Instant Analysis', desc: 'Receive a structured report: risks, compliance gaps, and action steps.' },
  { step: '04', title: 'Chat for Guidance', desc: 'Ask Bizwiz anything about Indian business law. It remembers your context.' },
];

function Landing() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1e293b', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0066ff 0%, #0044cc 60%, #002fa3 100%)',
        color: 'white',
        padding: '5rem 2rem 6rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            padding: '0.4rem 1.2rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            letterSpacing: '0.05em',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            🇮🇳 Built for Indian Businesses
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-1px' }}>
            Your AI Business Consultant<br />for India
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.88, maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Analyze contracts, detect compliance risks, and get expert legal guidance — all powered by AI, tailored to Indian law.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{
              background: 'white',
              color: '#0066ff',
              padding: '0.85rem 2rem',
              borderRadius: '0.6rem',
              fontWeight: '700',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
            }}>
              Get Started Free →
            </Link>
            <Link to="/login" style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              padding: '0.85rem 2rem',
              borderRadius: '0.6rem',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(4px)',
            }}>
              Login
            </Link>
          </div>
        </div>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Everything your business needs</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>From document review to chatbot guidance — Bizwiz has it all.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,102,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.65, fontSize: '0.95rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem' }}>How it works</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Up and running in under 2 minutes.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0066ff, #0044cc)',
                  color: 'white', fontWeight: '800', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  {s.step}
                </div>
                <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{s.title}</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0066ff, #002fa3)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to protect your business?</h2>
        <p style={{ opacity: 0.88, marginBottom: '2rem', fontSize: '1.1rem' }}>Join hundreds of Indian entrepreneurs using Bizwiz.</p>
        <Link to="/login" style={{
          background: 'white',
          color: '#0066ff',
          padding: '0.85rem 2.5rem',
          borderRadius: '0.6rem',
          fontWeight: '700',
          fontSize: '1rem',
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          display: 'inline-block',
        }}>
          Start for Free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <span style={{ color: '#0066ff', fontWeight: '700', fontSize: '1.1rem' }}>Bizwiz.</span>
        <span style={{ marginLeft: '1rem' }}>© 2025 · AI Business Consultant for India</span>
      </footer>
    </div>
  );
}

export default Landing;
