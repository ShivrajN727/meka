import React, { useState } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import AccountIcon from '../components/AccountIcon';
import Greeting from '../components/Greeting';
import PromptInput from '../components/PromptInput';
import AIOutput from '../components/AIOutput';
import FlyoutPanel from '../components/FlyoutPanel';
import './Landing.css';

const Landing = () => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // temporary, will be replaced by auth


  const toggleFlyout = () => {
    setIsFlyoutOpen(!isFlyoutOpen);
  };

  return (
    <div className="landing-container">
      <FlyoutPanel 
        isOpen={isFlyoutOpen} 
        onClose={() => setIsFlyoutOpen(false)} 
        isLoggedIn={isLoggedIn}
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
          <AccountIcon />
        </div>
      </header>
      <main className="ai-output-area">
        <AIOutput />
      </main>
    </div>
  );
};

export default Landing;
