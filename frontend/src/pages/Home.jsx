import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBackendUrl } from '../config';

function Home({ user }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user.uid);

    try {
      const response = await fetch(`${getBackendUrl()}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data.document);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown renderer for the analysis result
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>;
      if (line.startsWith('* ')) return <li key={i}>{line.replace('* ', '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i}>{line}</p>;
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bizwiz.</h1>
        <p className="page-subtitle">An AI-powered business consultant platform that helps you analyze documents like contracts and policies to identify risks, compliance gaps, and legal issues under Indian law, while providing actionable insights and guidance.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="card-title">Upload a Document</h2>

        <div className="upload-area" onClick={() => document.getElementById('file-upload').click()}>
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
          />
          {file ? (
            <p style={{ fontWeight: '500', color: 'var(--primary-color)' }}>Selected: {file.name}</p>
          ) : (
            <p>Click or drag to upload (PDF, DOCX, TXT)</p>
          )}
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Document'}
        </button>
      </div>

      {result && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 className="card-title">Analysis Result</h2>
          <div className="analysis-content" style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
            {renderMarkdown(result.analysis_result)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
