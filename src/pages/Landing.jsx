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

  const toggleFlyout = () => setIsFlyoutOpen(!isFlyoutOpen);

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };


  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    setIsLoggedIn(true);
    setUsername(userData.username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');

    window.location.reload();
  }

  //input and output

   const [messages, setMessages] = useState([]);

   const handleSend = async (prompt) => {
  // user message
     setMessages(prev => [
       ...prev,
       { role: "user", content: prompt }
     ]);
     try {
       const res = await fetch("http://localhost:3001/api/chat", {
         method: "POST",
         headers: {
        "Content-Type": "application/json",
         },
         body: JSON.stringify({ prompt }),
        });
        const data = await res.json();

    //ai response
    setMessages(prev => [
      ...prev,
      { role: "ai", content: data.response }
    ]);
  } catch (err) {
    setMessages(prev => [
      ...prev,
      { role: "ai", content: "Error getting response" }
    ]);
  }
};

//


  return (
    <div className="landing-container">
      <FlyoutPanel 
        isOpen={isFlyoutOpen} 
        onClose={() => setIsFlyoutOpen(false)} 
        isLoggedIn={isLoggedIn}
        onLoginClick={openAuthModal}
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
