import React, { useState } from 'react';

const PromptInput = ({ onSend }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    onSend(prompt);   //onSend
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="prompt-form">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask me anything..."
        className="prompt-input"
      />
      <button type="submit" className="prompt-submit">
        Send
      </button>
    </form>
  );
};

export default PromptInput;