import React from 'react';

const Greeting = () => {
  const hour = new Date().getHours();
  let greeting = 'Hello';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  return <h2 className="greeting">{greeting}, User!</h2>;
};

export default Greeting;