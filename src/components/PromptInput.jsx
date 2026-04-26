import React, { useState } from 'react';

const MODELS = [
{ value: 'ollama', label: 'gemma3:4b (Local)' },
  { value: 'gemini', label: 'Gemini 2.0 Flash (Public)' },
];

const PromptInput = ({ onSend, loading = false, error = '', selectedModel, onModelChange }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(prompt);
    setPrompt('');
  };

  return (
    <div>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="model-selector"
        disabled={loading}
      >
        {MODELS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <form onSubmit={handleSubmit} className="prompt-form">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything..."
          className="prompt-input"
          disabled={loading}
        />
        <button type="submit" className="prompt-submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PromptInput;
