import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinDebate = () => {
  const [team, setTeam] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  // Mock IDs for demo purposes - in a real app these typically come from route params or context
  const newsId = "123";
  const userId = "456";

  const isLoggedIn = () => !!localStorage.getItem('user');

  const handleTeamSelect = (selectedTeam) => {
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
      return;
    }
    setTeam(selectedTeam);
  };

  const handleJoin = () => {
    if (!team) return;
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
      return;
    }
    // Navigate to Qualifying Quiz first
    navigate(`/qualifying-quiz/${newsId}/${userId}/${team}`);
  };

  if (showLoginPrompt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
        <div className="card-glass max-w-sm w-full p-8 text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-3xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 mb-6">Please sign in or create an account to enter the debate arena.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-secondary w-full"
            >
              Create Account
            </button>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="text-slate-400 hover:text-white text-sm mt-2 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-12 px-4">
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* Header Content */}
        <div className="absolute top-8 left-0 right-0 z-20 text-center pointer-events-none">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg tracking-tight">
            Choose Your Stance
          </h1>
          <p className="text-slate-300 mt-2 text-lg opacity-90">The floor is yours. Make your voice heard.</p>
        </div>

        {/* Split Screen Container */}
        <div className="flex-1 flex flex-col md:flex-row relative">

          {/* VS Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center shadow-2xl shadow-black/50">
              <span className="font-display font-black text-2xl md:text-3xl italic bg-gradient-to-br from-slate-200 to-slate-500 bg-clip-text text-transparent">VS</span>
            </div>
          </div>

          {/* Team FOR */}
          <div
            className={`flex-1 relative transition-all duration-500 cursor-pointer group overflow-hidden
                    ${team === 'For' ? 'flex-[1.5] brightness-110' : 'hover:flex-[1.2] opacity-80 hover:opacity-100'}
                `}
            onClick={() => handleTeamSelect('For')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900"></div>
            {/* Texture/Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
              <div className="mb-8 relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-primary-500/30 blur-2xl rounded-full"></div>
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-2xl shadow-primary-500/40 border-t border-white/20">
                  <svg className="w-12 h-12 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-4xl font-bold text-white mb-2 tracking-wider uppercase font-display">Team For</h2>
              <p className="text-primary-200 max-w-sm font-medium leading-relaxed">Support the motion. Advocate for change. Lead the way.</p>

              {team === 'For' && (
                <div className="mt-8 animate-fade-in">
                  <span className="px-6 py-2 bg-primary-500 text-white font-bold rounded-full shadow-lg shadow-primary-500/40 tracking-wide uppercase text-sm border border-primary-400">
                    Selected
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Team AGAINST */}
          <div
            className={`flex-1 relative transition-all duration-500 cursor-pointer group overflow-hidden
                    ${team === 'Against' ? 'flex-[1.5] brightness-110' : 'hover:flex-[1.2] opacity-80 hover:opacity-100'}
                `}
            onClick={() => handleTeamSelect('Against')}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-accent via-red-900 to-slate-900"></div>
            {/* Texture/Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
              <div className="mb-8 relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full"></div>
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-2xl shadow-red-500/40 border-t border-white/20">
                  <svg className="w-12 h-12 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-4xl font-bold text-white mb-2 tracking-wider uppercase font-display">Team Against</h2>
              <p className="text-red-200 max-w-sm font-medium leading-relaxed">Challenge the motion. Defend the status quo. Scrutinize.</p>

              {team === 'Against' && (
                <div className="mt-8 animate-fade-in">
                  <span className="px-6 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg shadow-red-600/40 tracking-wide uppercase text-sm border border-red-500">
                    Selected
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-8 glass-effect z-40 bg-gradient-to-t from-slate-950 to-transparent flex justify-center pb-12">
          <button
            onClick={handleJoin}
            disabled={!team}
            className={`
                    px-12 py-4 rounded-full font-bold text-lg tracking-wide uppercase transition-all duration-300 shadow-xl
                    ${team
                ? 'bg-white text-slate-900 hover:scale-105 hover:bg-gray-100 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed grayscale'
              }
                `}
          >
            {team ? `Take Qualifying Quiz for ${team}` : 'Select a Team'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default JoinDebate;
