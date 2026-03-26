import React, { useEffect, useState } from 'react';

const History = ({ username }) => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:3001/api/history?username=${username}`)
      .then(res => res.json())
      .then(data => {
        console.log("History API response:", data);

        // 
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setError(data.error || "Unknown error");
          setHistory([]);
        }
      })
      .catch(err => {
        console.error('History load error:', err);
        setError("Network error");
      });
  }, [username]);

  if (!username) {
    return <p>Please log in to view history.</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (history.length === 0) {
    return <p>No chat history yet.</p>;
  }

  return (
    <div style={{ marginTop: '1rem', overflowY: 'auto', maxHeight: '80%' }}>
      {history.map((msg) => (
        <div
          key={msg.id}
          style={{
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #555',
          }}
        >
          <div><strong>You:</strong> {msg.prompt}</div>
          <div style={{ color: '#cdd6f4' }}>
            <strong>AI:</strong> {msg.response}
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;