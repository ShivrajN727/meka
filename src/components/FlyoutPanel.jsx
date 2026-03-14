import React from 'react';

const FlyoutPanel = ({ isOpen, onClose, isLoggedIn }) => {
  if (!isOpen) return null; // Don't render anything if panel is closed

  return (
    <>
      {/* Overlay - covers the whole screen */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent dark
          zIndex: 1000, // behind the panel
        }}
        onClick={onClose} // click overlay to close
      />

      {/* Flyout Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100%',
          backgroundColor: '#333',
          color: 'white',
          zIndex: 1001, // above overlay
          padding: '1.5rem',
          boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
        }}
      >
        {/* Optional close button inside panel */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {!isLoggedIn ? (
          <>
            <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
              Logged in users can save chats
            </p>
            <button
              style={{
                backgroundColor: '#cba6f7',
                color: '#11111b',
                border: 'none',
                padding: '0.75rem',
                width: '100%',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={() => alert('Go to login page')}
            >
              Log in
            </button>
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                right: '1.5rem',
              }}
            >
              <button
                style={{
                  backgroundColor: '#313244',
                  color: '#cdd6f4',
                  border: '1px solid #45475a',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
                onClick={() => alert('Help clicked')}
              >
                ?
              </button>
            </div>
          </>
        ) : (
          <p>Your chat history will appear here.</p>
        )}
      </div>
    </>
  );
};

export default FlyoutPanel;