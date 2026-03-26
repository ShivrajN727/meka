import React, { useState } from 'react';
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
  const [refreshHistory, setRefreshHistory] = useState(0);


  const toggleFlyout = () => setIsFlyoutOpen(!isFlyoutOpen);

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };


const handleLoginSuccess = async (userData) => {
  console.log('Login successful:', userData);
  setIsLoggedIn(true);
  setUsername(userData.username);
  if (!messages.length || conversationId) {
    setRefreshHistory(prev => prev + 1)
    return;}
  try {
    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: messages[messages.length - 1].content,
        username: userData.username, 
        conversationId: null,
        messages,
      }),
    });
    const data = await res.json();
    if (data.conversationId) {
      setConversationId(data.conversationId);
      setRefreshHistory(prev => prev + 1);
    }

  } catch (err) {
    console.error("Auto save failed:", err);
  }
};

const handleLogout = () => {
  setIsLoggedIn(false);
  setUsername('');
  setConversationId(null);
  setMessages([]);
    window.location.reload();
  }

const [messages, setMessages] = useState([]);
const [conversationId, setConversationId] = useState(null);

const handleSend = async (prompt) => {
  const newMessages = [
    ...messages,
    { role: "user", content: prompt }
  ];

  setMessages(newMessages);

  try {
    const body = {
      prompt,
      username: isLoggedIn ? username : null,
      conversationId: isLoggedIn ? conversationId : null,
      ...(isLoggedIn && !conversationId && { messages: newMessages }),
    };

    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { role: "ai", content: data.response || "Error: no response" }
    ]);

    if (isLoggedIn && data.conversationId && !conversationId) {
      setConversationId(data.conversationId);
      setRefreshHistory(prev => prev + 1);
    }

  } catch (err) {
    console.error("Auto save failed:", err);
    setMessages(prev => [
      ...prev,
      { role: "ai", content: "Error getting response" }
    ]);
  }
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
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        onLoginSuccess={handleLoginSuccess}
      />

      <header className="top-bar">
        <div className="top-left">
          <HamburgerMenu onClick={toggleFlyout} />
        </div>

        <div className="top-center">
          <Greeting username={username}/>
          <PromptInput onSend={handleSend} />
        </div>

        <div className="top-right">
          <AccountIcon 
            onLoginClick={openAuthModal}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn} 
          />
        </div>
      </header>



      <main className="ai-output-area">
        <AIOutput messages={messages} />
      <img 
        src="/meka-logo-reveal-prototype.gif"
        className="logo-bottom"
      />
      </main>
    </div>
  );
};

export default Landing;
