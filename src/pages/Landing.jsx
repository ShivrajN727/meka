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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // temporary, will be replaced by auth
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 

  const toggleFlyout = () => setIsFlyoutOpen(!isFlyoutOpen);

  const openAuthModal = () => {
    console.log('openAuthModal called');
    setIsAuthModalOpen(true);
  };
  
  const closeAuthModal = () => {
    console.log('closeAuthModal called');
    setIsAuthModalOpen(false);
  };


  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    setIsLoggedIn(true);
  };

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
          <Greeting />
          <PromptInput />
        </div>
        <div className="top-right">
          <AccountIcon onLoginClick={openAuthModal} />
        </div>
      </header>
      <main className="ai-output-area">
        <AIOutput />
      </main>
    </div>
  );
};

export default Landing;
