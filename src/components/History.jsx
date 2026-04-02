import React, { useEffect, useState } from 'react';
// lint
const Section = ({
  title,
  items,
  sectionKey,
  isOpen,
  toggle,
  onSelectConversation
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ marginBottom: '1rem' }}>
      
      {/* title,able to fold */}
      <div
        onClick={() => toggle(sectionKey)}
        style={{
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {title}
        <span>{isOpen ? '▼' : '▶'}</span>
      </div>

      {/* content */}
      {isOpen && items.map(msg => (
        <div
          key={msg.id}
          onClick={() => onSelectConversation && onSelectConversation(msg.id)}
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


const History = ({ username, isOpen, refreshHistory, onSelectConversation }) => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const [openSections, setOpenSections] = useState({
    today: true,
    yesterday: true,
    week: true,
    month: true,
    older: true
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
        if (Array.isArray(data)) {
          setHistory(data);
          setError(null);
        } else {
          setError(data.error || "Unknown error");
          setHistory([]);
        }
      })
      .catch(() => {
        setError("Network error");
      });

  }, [isOpen, username, refreshHistory]);

  if (!username) return <p>Please log in to view history.</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (history.length === 0) return <p>No chat history yet.</p>;

  const grouped = groupHistory(history);

  return (
    <div style={{ marginTop: '1rem', overflowY: 'auto', maxHeight: '80%' }}>
      
      <Section
        title="Today"
        items={grouped.today}
        sectionKey="today"
        isOpen={openSections.today}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

      <Section
        title="Yesterday"
        items={grouped.yesterday}
        sectionKey="yesterday"
        isOpen={openSections.yesterday}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

      <Section
        title="Week"
        items={grouped.week}
        sectionKey="week"
        isOpen={openSections.week}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

      <Section
        title="Month"
        items={grouped.month}
        sectionKey="month"
        isOpen={openSections.month}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

      <Section
        title="Older"
        items={grouped.older}
        sectionKey="older"
        isOpen={openSections.older}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

    </div>
  );
};

export default History;
