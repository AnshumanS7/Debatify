import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import JoinDebate from './pages/JoinDebate'; // adjust path as needed
import DebateRoom from './pages/DebateRoom';

import './index.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/joindebate" element={<JoinDebate />} />
        <Route path="/debate-room/:newsId/:userId/:team" element={<DebateRoom />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
