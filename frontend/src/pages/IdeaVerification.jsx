import React, { useState } from 'react';
import { getBackendUrl } from '../config';

function IdeaVerification({ user }) {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${getBackendUrl()}/verify-idea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea,
          user_id: user?.uid || 'anonymous'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setResult(data.document);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} style={{ marginTop: '1.5rem', color: 'var(--primary-color)' }}>{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} style={{ marginTop: '1.5rem', color: 'var(--primary-color)' }}>{line.replace('# ', '')}</h1>;
      if (line.startsWith('**') && line.endsWith('**')) return <strong key={i}>{line.replace(/\*\*/g, '')}</strong>;
      if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1.5rem' }}>{line.replace(/^(\*|-)\s/, '')}</li>;
      if (line.match(/^\d+\.\s/)) return <li key={i} style={{ marginLeft: '1.5rem', listStyleType: 'decimal' }}>{line.replace(/^\d+\.\s/, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} style={{ marginBottom: '1rem' }}>{line.replace(/\*\*/g, '')}</p>;
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Idea Verification</h1>
        <p className="page-subtitle">Describe your business idea and get instant feedback on market viability, legal requirements, and risks under Indian law.</p>
      </div>

      <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 className="card-title">Describe Your Idea</h2>
        
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <textarea
            className="form-input"
            rows="6"
            placeholder="E.g., I want to start a cloud kitchen in Bangalore serving organic vegan food, operating only through Swiggy and Zomato."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem' }}
          onClick={handleVerify}
          disabled={!idea.trim() || loading}
        >
          {loading ? 'Analyzing your idea...' : 'Verify Business Idea'}
        </button>
      </div>

      {result && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="card-title" style={{ marginBottom: 0 }}>Analysis Result</h2>
          </div>
          <div className="analysis-content" style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            {renderMarkdown(result.analysis_result)}
          </div>
        </div>
      )}
    </div>
  );
}

export default IdeaVerification;
