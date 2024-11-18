import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';  // นำเข้า act จาก react
import App from './App';

test('renders learn react link', () => {
  // Mock matchMedia before rendering the component
  global.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  act(() => {
    render(<App />); // Wrap render in act
  });
});