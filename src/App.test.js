import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from './App';

test('renders learn react link', async () => {
  // Mock matchMedia before rendering the component
  global.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  // Act is generally used for asynchronous updates
  await act(async () => {
    render(<App />);
  });

  // Example assertion to check if the link is present
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
