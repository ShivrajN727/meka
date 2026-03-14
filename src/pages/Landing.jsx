import React, { useState } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import AccountIcon from '../components/AccountIcon';
import Greeting from '../components/Greeting';
import PromptInput from '../components/PromptInput';
import AIOutput from '../components/AIOutput';
import './Landing.css';

const Landing = () => {

  return (
    <div className="landing-container">
      <header className="top-bar">
        <div className="top-left">
          <HamburgerMenu />
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