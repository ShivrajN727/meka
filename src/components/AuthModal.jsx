import React from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose} />
      {/* Modal Box */}
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Welcome to Meka</h2>
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <div className="modal-buttons">
            <button type="button">Log In</button>
            <button type="button">Create Account</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AuthModal;