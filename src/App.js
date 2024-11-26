import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterLoginPage';
import LuckyDraw from './components/LuckyDraw';
const App = () => {  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/luckydraw" element={<LuckyDraw />} />
      </Routes>
    </Router>
  );
};
export default App;