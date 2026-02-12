import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import NewsFeed from './pages/NewsFeed';
import JoinDebate from './pages/JoinDebate';
import DebateRoom from './pages/DebateRoom';
import NewsDetails from './pages/NewsDetails';
import QuizPage from './pages/QuizPage';
import QualifyingQuiz from './pages/QualifyingQuiz';
import DebateLobby from './pages/DebateLobby';
import { PrivateRoute, PublicRoute } from './auth.jsx';

const App = () => {
  const location = useLocation();
  const hideNavbar = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen text-slate-200 font-sans relative">
      <AnimatedBackground />
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public routes (redirect logged-in users away from login/signup) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Semi-public routes (accessible to all, but with in-page auth checks) */}
        <Route path="/home" element={<Home />} />
        <Route path="/joindebate" element={<JoinDebate />} />

        {/* Private routes (require authentication) */}
        <Route element={<PrivateRoute />}>
          <Route path="/news-feed" element={<NewsFeed />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/qualifying-quiz/:newsId/:userId/:team" element={<QualifyingQuiz />} />
          <Route path="/debate-lobby/:newsId/:userId/:team" element={<DebateLobby />} />
          <Route path="/debate/:roomId" element={<DebateRoom />} />
          <Route path="/debate-room/:newsId/:userId/:team" element={<DebateRoom />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
};

export default App;
