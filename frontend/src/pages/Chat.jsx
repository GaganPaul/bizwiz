import React, { useState, useRef, useEffect } from 'react';
import { getBackendUrl } from '../config';

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  
  const [chatSessions, setChatSessions] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat sessions
  const loadChatSessions = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/chats/${user.uid}`);
      const data = await res.json();
      if (res.ok) setChatSessions(data.chats || []);
    } catch (e) {
      console.error("Error loading sessions", e);
    } finally {
      setSidebarLoading(false);
    }
  };

  useEffect(() => {
    loadChatSessions();
  }, [user]);

  // Start new chat
  const handleNewChat = () => {
    setChatId(null);
    setMessages([{ role: 'assistant', content: 'Hello! I am Bizwiz, your AI business consultant. How can I help you today?' }]);
  };

  // Initially set a greeting if no chat is selected
  useEffect(() => {
    if (!chatId && messages.length === 0) handleNewChat();
  }, [chatId]);

  // Load specific chat
  const loadChat = async (id) => {
    setChatId(id);
    setLoading(true);
    try {
      const res = await fetch(`${getBackendUrl()}/chat/${id}`);
      const data = await res.json();
      if (res.ok && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        setMessages([{ role: 'assistant', content: 'Hello! I am Bizwiz, your AI business consultant. How can I help you today?' }]);
      }
    } catch (e) {
      console.error("Error loading chat", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${getBackendUrl()}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          user_id: user.uid,
          chat_id: chatId
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // If this was a new chat, update ID and refresh sidebar
      if (!chatId && data.chat_id) {
        setChatId(data.chat_id);
        loadChatSessions();
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation(); // prevent clicking the chat session
    const confirmed = window.confirm("Are you sure you want to delete this chat session? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const res = await fetch(`${getBackendUrl()}/chat/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setChatSessions(prev => prev.filter(c => c.id !== id));
        if (chatId === id) {
          handleNewChat();
        }
      } else {
        alert("Failed to delete chat session.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting chat session.");
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.trim() === '') return <br key={i} />;
      return <span key={i}>{line}<br/></span>;
    });
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '260px', 
        backgroundColor: 'var(--surface-color)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleNewChat}>
            + New Chat
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {sidebarLoading ? (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}><div className="loader" style={{width:'20px', height:'20px', borderWidth:'2px'}}></div></div>
          ) : chatSessions.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No past chats</div>
          ) : (
            chatSessions.map(session => (
              <div 
                key={session.id}
                onClick={() => loadChat(session.id)}
                style={{
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  marginBottom: '0.25rem',
                  fontSize: '0.85rem',
                  backgroundColor: chatId === session.id ? 'var(--bg-color)' : 'transparent',
                  fontWeight: chatId === session.id ? '500' : '400',
                  color: chatId === session.id ? 'var(--primary-color)' : 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                  {session.title || 'Chat Session'}
                </div>
                <button 
                  onClick={(e) => handleDeleteChat(e, session.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '0.25rem',
                    opacity: 0.7
                  }}
                  title="Delete Chat"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-container" style={{ flex: 1, height: '100%', margin: 0, maxWidth: 'none' }}>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.8rem', opacity: 0.8 }}>
                {msg.role === 'user' ? 'You' : 'Bizwiz'}
              </div>
              <div>{renderMarkdown(msg.content)}</div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px', margin: 0 }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about GST, Labour Laws, Company Registration..."
            disabled={loading}
          />
          <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
