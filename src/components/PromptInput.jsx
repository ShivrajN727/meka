import React, { useState, useEffect } from 'react';

const CURATED_MODELS = ['gemma3:270m'];

function modelRiskHint(name) {
  if (/gemma/i.test(name)) return undefined;
  if (/(llama|phi|mistral|qwen|deepseek|codellama|tinyllama)/i.test(name)) {
    return 'Uses Ollama’s Llama-class runner; needs a working HIP/ROCm stack or CPU-only Ollama on many AMD laptops.';
  }
  return undefined;
}

function orderInstalledModels(installed, curated) {
  const set = new Set(installed);
  const ordered = [];
  for (const id of curated) {
    if (set.has(id)) ordered.push(id);
  }
  const rest = installed.filter((m) => !curated.includes(m)).sort();
  return [...ordered, ...rest];
}

const PromptInput = ({ onSend, loading = false, error = '' }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState(['gemma3:270m']);
  const [availableModels, setAvailableModels] = useState(CURATED_MODELS);
  const [missingModels, setMissingModels] = useState([]);
  const [modelsNote, setModelsNote] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadModels = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/ollama/models');
        let data = {};
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        const installed = Array.isArray(data.models) ? data.models : [];

        if (cancelled) return;

        if (!res.ok) {
          setAvailableModels(['gemma3:270m']);
          setMissingModels([]);
          setModelsNote(
            data.error ||
              `Could not load the model list (HTTP ${res.status}). Is the backend running and Ollama on 127.0.0.1:11434?`
          );
          return;
        }

        if (installed.length === 0) {
          setAvailableModels(['gemma3:270m']);
          setMissingModels(CURATED_MODELS);
          setModelsNote('Ollama reported no installed models yet.');
          return;
        }

        const ordered = orderInstalledModels(installed, CURATED_MODELS);
        setAvailableModels(ordered);
        setMissingModels(CURATED_MODELS.filter((m) => !installed.includes(m)));

        const parts = [];
        if (Array.isArray(data.hostWarnings) && data.hostWarnings.length) {
          parts.push(`Some Ollama hosts: ${data.hostWarnings.join(' · ')}`);
        }
        if (Array.isArray(data.routedModels) && data.routedModels.length) {
          parts.push(
            `Some models use another Ollama URL (OLLAMA_MODEL_BASES): ${data.routedModels.join(', ')}`
          );
        }
        setModelsNote(parts.join(' — ') || '');

        setSelectedModels((prev) => {
          const next = prev.filter((m) => ordered.includes(m));
          if (next.length > 0) return next;
          const preferred = ordered.find((m) => CURATED_MODELS.includes(m));
          return [preferred || ordered[0]];
        });
      } catch {
        if (!cancelled) {
          setAvailableModels(['gemma3:270m']);
          setMissingModels([]);
          setModelsNote('Could not load models from the server.');
        }
      }
    };

    loadModels();

    const onVisible = () => {
      if (document.visibilityState === 'visible') loadModels();
    };
    window.addEventListener('focus', loadModels);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadModels);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const toggleModel = (model) => {
    setSelectedModels((prev) => {
      if (prev.includes(model)) {
        // Keep at least one model selected.
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== model);
      }
      return [...prev, model];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(prompt, selectedModels);
    setPrompt('');
  };

  return (
    <div className="prompt-input-stack">
      <div className="model-selector" aria-label="Models">
        <span className="model-selector-heading">Models</span>
  
        <div className="model-chips">
          {availableModels.map((model) => (
            <label
              key={model}
              className={`model-option ${selectedModels.includes(model) ? 'model-option--selected' : ''}`}
              title={modelRiskHint(model)}
            >
              <input
                type="checkbox"
                className="model-option-input"
                checked={selectedModels.includes(model)}
                onChange={() => toggleModel(model)}
                disabled={loading}
              />
              <span className="model-option-label">{model}</span>
            </label>
          ))}
        </div>
      </div>
      {modelsNote && (
        <p className="model-note" role="status">
          {modelsNote}
        </p>
      )}
      {missingModels.length > 0 && (
        <div className="model-install-hint">
          <span className="model-install-hint-title">Pull missing models (terminal):</span>
          <div className="model-install-commands">
            {missingModels.map((m) => (
              <code key={m} className="model-install-cmd">
                ollama pull {m}
              </code>
            ))}
          </div>
        </div>
      )}
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