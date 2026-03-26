import React, { useEffect, useState } from 'react';

const History = ({ username, isOpen, refreshHistory }) => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const groupHistory = (history) => {
    const groups = {
      today: [],
      yesterday: [],
      week: [],
      month: [],
      older: []
    };

    const now = new Date();

    history.forEach(item => {
      const created = new Date(item.created_at);
      const diff = (now - created) / (1000 * 60 * 60 * 24);

      if (diff < 1) groups.today.push(item);
      else if (diff < 2) groups.yesterday.push(item);
      else if (diff < 7) groups.week.push(item);
      else if (diff < 30) groups.month.push(item);
      else groups.older.push(item);
    });

    return groups;
  };

  useEffect(() => {
    if (!username || !isOpen) return;

    fetch(`http://localhost:3001/api/history?username=${username}`)
      .then(res => res.json())
      .then(data => {
        console.log("History API response:", data);

        if (Array.isArray(data)) {
          setHistory(data);
          setError(null);
        } else {
          setError(data.error || "Unknown error");
          setHistory([]);
        }
      })
      .catch(err => {
        console.error('History load error:', err);
        setError("Network error");
      });

  }, [isOpen, username, refreshHistory]);

  // Selection
  const Section = ({ title, items }) => {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {title}
        </div>

        {items.map(msg => (
          <div
            key={msg.id}
            style={{
              padding: '0.3rem 0',
              cursor: 'pointer'
            }}
          >
            {msg.title}
          </div>
        ))}
      </div>
    );
  };

  if (!username) {
    return <p>Please log in to view history.</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (history.length === 0) {
    return <p>No chat history yet.</p>;
  }

  const grouped = groupHistory(history);

  return (
    <div style={{ marginTop: '1rem', overflowY: 'auto', maxHeight: '80%' }}>
      <Section title="Today" items={grouped.today} />
      <Section title="Yesterday" items={grouped.yesterday} />
      <Section title="Week" items={grouped.week} />
      <Section title="Month" items={grouped.month} />
      <Section title="Older" items={grouped.older} />
    </div>
  );
};

export default History;
