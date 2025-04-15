import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NewsDetails from '../pages/NewsDetails';
import DebateRoom from '../pages/DebateRoom';
import JoinDebate from '../pages/JoinDebate';
import QuizPage from '../pages/QuizPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news/:id" element={<NewsDetails />} />
      <Route path="/joindebate" element={<JoinDebate/>} />
      <Route path="/debate/:roomId" element={<DebateRoom />} />
      
      <Route path="/debate-room/:newsId/:userId/:team" element={<DebateRoom />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
};

export default AppRoutes;
