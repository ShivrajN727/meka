import React from 'react';

const AIOutput = ({ messages }) => {
  return (
    <div className="ai-output">

      {messages.length === 0 && (
        <p>Your AI response will appear here...</p>
      )}

      {messages.map((msg, index) => (
        <p key={index}>
          <strong>
            {msg.role === "user" ? "You: " : "AI: "}
          </strong>
          {msg.content}
        </p>
      ))}

    </div>
  );
};

export default AIOutput;