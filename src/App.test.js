import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';  // นำเข้า act จาก react
import App from './App';

test('renders learn react link', () => {
  act(() => {
    render(<App />);  // ใช้ act ล้อมรอบการเรนเดอร์
  });

  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
