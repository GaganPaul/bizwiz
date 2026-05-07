import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import IdeaVerification from './pages/IdeaVerification';
import Contact from './pages/Contact';
import AuthForm from './components/AuthForm';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is wrapped in try/catch in case firebase config is missing/invalid
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase Auth not initialized correctly", e);
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  if (loading) {
    return <div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center'}}><div className="loader"></div></div>;
  }

  return (
    <Router>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">Bizwiz.</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            {user ? (
              <>
                <Link to="/idea-verification">Idea Check</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/chat">Chat</Link>
                <Link to="/contact">Contact</Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.25rem 0.75rem', fontSize:'0.8rem'}}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container" style={{paddingTop: '2rem'}}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={!user ? <AuthForm /> : <Navigate to="/dashboard" />} />
          <Route path="/idea-verification" element={user ? <IdeaVerification user={user} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to="/login" />} />
          <Route path="/contact" element={user ? <Contact /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
