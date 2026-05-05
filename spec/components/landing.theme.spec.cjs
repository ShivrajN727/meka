import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react';

function Landing() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.className =
      newTheme === 'light' ? 'theme-light' : '';
  };

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

describe('Theme Toggle (Jasmine)', () => {

  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
    container = null;
    document.documentElement.className = '';
  });

  it('should toggle from dark to light', () => {
    act(() => {
      root.render(<Landing />);
    });

    const button = container.querySelector('button');
    expect(button).not.toBeNull(); 

    expect(button.textContent).toContain('Light');

    act(() => {
      button.click();
    });

    const updatedButton = container.querySelector('button');
    expect(updatedButton.textContent).toContain('Dark');

    expect(document.documentElement.className).toBe('theme-light');
  });

  it('should toggle back to dark', () => {
    act(() => {
      root.render(<Landing />);
    });

    const button = container.querySelector('button');

    act(() => {
      button.click();
    });
    act(() => {
      button.click();
    });
    const updatedButton = container.querySelector('button');

    expect(updatedButton.textContent).toContain('Light');
    expect(document.documentElement.className).toBe('');
  });

});