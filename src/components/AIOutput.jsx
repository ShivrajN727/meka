import React from 'react';

const AIOutput = ({ messages, onKeepResponse }) => {
  // Ensure messages is always an array
  const messageList = Array.isArray(messages) ? messages : [];

  if (messageList.length === 0) {
    return <div className="ai-output"><p>Your AI response will appear here...</p></div>;
  }

  return (
    <div className="ai-output">
      {messageList.map((msg, idx) => (
        <div
          key={idx}
          className={`chat-message${msg.error ? ' chat-message--error' : ''} ${msg.role === 'ai' ? 'clickable-ai' : ''}`}
          onClick={msg.role === 'ai' ? () => onKeepResponse(idx) : undefined}
          style={msg.role === 'ai' ? { cursor: 'pointer' } : {}}
        >
          <strong>
            {msg.role === 'user'
              ? 'You: '
              : `AI${msg.model ? ` (${msg.model})` : ''}: `}
          </strong>
          {msg.error ? (
            <span className="chat-message-error-body">{msg.error}</span>
          ) : (
            msg.content
          )}
        </div>
      ))}
    </div>
  );
};

export default AIOutput;