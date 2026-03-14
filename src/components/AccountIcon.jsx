import React from 'react';

const AccountIcon = ({ onLoginClick }) => {
  return (
    <div className="account-icon">
      <button onClick={onLoginClick}>👤 Login</button>
    </div>
  );
};

export default AccountIcon;