import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Success from './components/Success';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Маршрут для главной страницы */}
          <Route path="/" element={<HomePage />} />

          {/* Маршрут для страницы регистрации */}
          <Route path="/signup" element={<Signup />} />

          {/* Маршрут для страницы успеха */}
          <Route path="/success" element={<Success />} />

          {/* Маршрут для страницы входа */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
