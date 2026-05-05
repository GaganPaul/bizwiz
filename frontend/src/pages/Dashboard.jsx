import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBackendUrl } from '../config';

function Dashboard({ user }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/documents/${user.uid}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch documents');
        }
        
        // Sort by timestamp descending
        const sortedDocs = data.documents.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        setDocuments(sortedDocs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const handleDeleteDocument = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this document analysis? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const res = await fetch(`${getBackendUrl()}/document/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      } else {
        alert("Failed to delete document.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting document.");
    }
  };

  if (loading) return <div className="loader" style={{ marginTop: '4rem' }}></div>;

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem' }}>Dashboard</h1>
          <p className="page-subtitle">Manage your analyzed documents</p>
        </div>
        <Link to="/" className="btn btn-primary">Upload New</Link>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {documents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>No documents analyzed yet.</h3>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Upload your first document to get started.</p>
          <Link to="/" className="btn btn-primary">Upload Document</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {documents.map((doc) => (
            <div key={doc.id} className="card" style={{ position: 'relative' }}>
              <div style={{ paddingRight: '2rem' }}>
                <h3 className="card-title" style={{ fontSize: '1.1rem', wordBreak: 'break-all', margin: 0 }}>{doc.file_name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '0.25rem' }}>
                  {new Date(doc.timestamp).toLocaleDateString()}
                </p>
              </div>

              <button 
                onClick={() => handleDeleteDocument(doc.id)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem',
                  opacity: 0.7
                }}
                title="Delete Document"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              
              <div style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <strong>Preview:</strong>
                <p style={{ marginTop: '0.25rem' }}>{doc.extracted_text}</p>
              </div>

              <details>
                <summary style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '500', fontSize: '0.9rem' }}>
                  View Full Analysis
                </summary>
                <div className="analysis-content" style={{ marginTop: '1rem', fontSize: '0.85rem', background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  {doc.analysis_result}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
