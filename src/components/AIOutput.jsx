import React from 'react';

const AIOutput = ({ response }) => {
    return (
      <div className="ai-output">
        {response ? <p>{response}</p> : <p>Your AI response will appear here...</p>}
      </div>
    );
  };

export default AIOutput;