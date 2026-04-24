import React, { useState, useEffect } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import AccountIcon from '../components/AccountIcon';
import Greeting from '../components/Greeting';
import PromptInput from '../components/PromptInput';
import AIOutput from '../components/AIOutput';
import FlyoutPanel from '../components/FlyoutPanel';
import AuthModal from '../components/AuthModal';
import './Landing.css';



const Landing = () => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  

  // Restore session on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setIsLoggedIn(true);
      setUsername(storedUser);
      setRefreshHistory(prev => prev + 1); 
    }
  }, []);

  // Load conversation history when logged in or refreshHistory changes
  useEffect(() => {
    console.log('Loading history, isLoggedIn:', isLoggedIn, 'username:', username);
    if (!isLoggedIn || !username) return;
    //avoid bug overlay
    if (messages.length > 0) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/history?username=${username}`);
        const conversations = await res.json();
        if (conversations.length > 0) {
          const last = conversations[0];
          setConversationId(last.id);
          const msgRes = await fetch(`http://localhost:3001/api/conversation/${last.id}`);
          const msgs = await msgRes.json();
          setMessages(msgs);
        } else {
          setMessages([]);
          setConversationId(null);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      }
    };
    loadHistory();
  }, [isLoggedIn, username, refreshHistory]);

  const toggleFlyout = () => setIsFlyoutOpen(!isFlyoutOpen);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.username);
    localStorage.setItem('username', userData.username);
    // Force history reload
    setRefreshHistory(prev => prev + 1);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setMessages([]);
    setConversationId(null);
    localStorage.removeItem('username');
    window.location.reload();
  };

  const handleSend = async (prompt, selectedModels = []) => {
    if (!prompt.trim()) {
      setError('Please enter a message');
      return;
    }
    setError('');
    setLoading(true);

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);

    try {
      const body = {
        prompt,
        username: isLoggedIn ? username : null,
        conversationId: isLoggedIn ? conversationId : null,
        selectedModels,
      };
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'LLM failed');

      const rawResponses = Array.isArray(data.responses) ? data.responses : [];

      if (rawResponses.length > 0) {
        setMessages((prev) => [
          ...prev,
          ...rawResponses.flatMap((item) => {
            if (item.error) {
              return [{ role: 'ai', model: item.model, content: '', error: item.error }];
            }
            if (item.response) {
              return [{ role: 'ai', model: item.model, content: item.response }];
            }
            return [];
          })
        ]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      }
      if (isLoggedIn && data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      // Refresh history to update the side panel
      setRefreshHistory(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Optionally remove the optimistically added user message
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const openChat = ({ messages, conversationId }) => {
    setMessages(messages);
    setConversationId(conversationId);
  };

  const keepResponse = (clickedIndex) => {
    setMessages(prev => {
      // Find the nearest user message before the clicked AI
      let userMsgIndex = -1;
      for (let i = clickedIndex - 1; i >= 0; i--) {
        if (prev[i].role === 'user') {
          userMsgIndex = i;
          break;
        }
      }
      if (userMsgIndex === -1) return prev; // safety, shouldn't happen
  
      // Keep:
      // - All messages before and including that user message (previous turns intact)
      // - The clicked AI response
      // - Any user messages after that user message (future turns – their AI responses will be managed separately)
      // - Any AI responses that are from previous turns (indices < userMsgIndex) are already kept
      const newMessages = prev.filter((msg, idx) => {
        // Keep all messages up to and including the user message that prompted this AI
        if (idx <= userMsgIndex) return true;
        // Keep the clicked AI response
        if (idx === clickedIndex) return true;
        // Keep any future user messages (they start new turns)
        if (msg.role === 'user') return true;
        // Remove all other AI messages that come after the user message
        return false;
      });
  
      return newMessages;
    });
  };

  return (
    <div className="landing-container">
      <FlyoutPanel
        isOpen={isFlyoutOpen}
        onClose={() => setIsFlyoutOpen(false)}
        isLoggedIn={isLoggedIn}
        onLoginClick={openAuthModal}
        username={username}
        refreshHistory={refreshHistory}
        onOpenChat={openChat}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} onLoginSuccess={handleLoginSuccess} />
      <header className="top-bar">
        <div className="top-left">
          <HamburgerMenu onClick={toggleFlyout} />
        </div>
        <div className="top-center">
          <Greeting username={username} />
          <PromptInput onSend={handleSend} loading={loading} error={error} />
        </div>
        <div className="top-right">
          <AccountIcon onLoginClick={openAuthModal} onLogout={handleLogout} isLoggedIn={isLoggedIn} />
        </div>
      </header>
      <main className="ai-output-area">
        <AIOutput messages={messages} onKeepResponse={keepResponse} />
      </main>
    </div>
  );
};

export default Landing;
