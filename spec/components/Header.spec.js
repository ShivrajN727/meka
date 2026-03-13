import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; 
import Header from '../../src/components/Header';

describe('Header component', () => {
  it('renders the site name', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(getByText(/meka/i)).toBeTruthy(); 
  });

  it('contains login and signup links', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const loginLink = getByRole('link', { name: /login/i });
    const signupLink = getByRole('link', { name: /signup/i });

    expect(loginLink).toBeTruthy();
    expect(signupLink).toBeTruthy();
    expect(loginLink.getAttribute('href')).toBe('/login');
    expect(signupLink.getAttribute('href')).toBe('/signup');
  });
});