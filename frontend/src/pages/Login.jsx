import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect to /home if already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

      {/* Back to Home link */}
      <button
        onClick={() => navigate('/home')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-10"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="card-glass w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20 mb-3">
            D
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Sign in to continue your debate journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="in-put"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="in-put"
            />
          </div>
          <button type="submit" className="btn-primary w-full shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <span
            className="text-primary-400 hover:text-primary-300 font-medium cursor-pointer transition-colors"
            onClick={() => navigate('/signup')}
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
