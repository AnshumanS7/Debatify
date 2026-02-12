import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import API_BASE_URL from '../config/api';

const socket = io(API_BASE_URL);

const DebateRoom = () => {
  const { newsId, userId, team } = useParams();
  const normalizedTeam = team.trim();
  const navigate = useNavigate();

  const [timer, setTimer] = useState(30);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [turnCounts, setTurnCounts] = useState({ for: {}, against: {} });
  const [error, setError] = useState('');

  // Conclusion & Feedback state
  const [debateEnded, setDebateEnded] = useState(false);
  const [debateSummary, setDebateSummary] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const messagesEndRef = useRef(null);
  const countdownRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("newsId:", newsId, "userId:", userId, "team:", normalizedTeam);

    socket.emit('joinDebate', { newsId, userId, team: normalizedTeam }, (response) => {
      if (!response.success) {
        setError('Failed to join debate');
      }
    });

    socket.on('turn-change', (data) => {
      // Handle both object (new) and string (fallback) formats
      const newTurn = typeof data === 'object' ? data.currentTurn : data;
      const forCounts = typeof data === 'object' ? data.forCounts : {};
      const againstCounts = typeof data === 'object' ? data.againstCounts : {};

      console.log("Turn changed to:", newTurn);
      setCurrentTurn(newTurn);
      setTimer(30);

      // Update local state or ref to track turns if needed, but we can just use the counts directly in render
      // For now, let's store them in state if we want to trigger re-renders
      setTurnCounts({ for: forCounts, against: againstCounts });

      // Clear previous timer if any
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('errorMessage', (errMsg) => {
      setError(errMsg);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('debate-ended', (summary) => {
      console.log('Debate ended!', summary);
      setDebateEnded(true);
      setDebateSummary(summary);
      if (countdownRef.current) clearInterval(countdownRef.current);
    });

    return () => {
      socket.disconnect();
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [newsId, userId, normalizedTeam]);

  const handleSendMessage = () => {
    const isMyTurn = normalizedTeam.toLowerCase() === currentTurn?.toLowerCase();

    if (!isMyTurn) {
      setError("Not your team's turn to speak");
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (message.trim()) {
      socket.emit('sendMessage', {
        newsId,
        userId,
        team: normalizedTeam,
        message,
      });
      setMessage('');
    }
  };

  const myTurnCount = normalizedTeam.toLowerCase() === 'for'
    ? (turnCounts.for[userId] || 0)
    : (turnCounts.against[userId] || 0);
  const hasChancesLeft = myTurnCount < 2;

  const isMyTurnNow = normalizedTeam.toLowerCase() === currentTurn?.toLowerCase();

  const handleSubmitFeedback = () => {
    // In a real app, this would POST to an API
    console.log('Feedback submitted:', { newsId, userId, team: normalizedTeam, rating });
    setFeedbackSubmitted(true);
    setTimeout(() => navigate('/home'), 3000);
  };

  const handleEndDebate = () => {
    socket.emit('endDebate', { newsId });
  };

  // Calculate summary stats
  const forMessageCount = debateSummary ? debateSummary.messages.filter(m => m.team === 'for').length : 0;
  const againstMessageCount = debateSummary ? debateSummary.messages.filter(m => m.team === 'against').length : 0;
  const forParticipants = debateSummary ? Object.keys(debateSummary.forCounts).length : 0;
  const againstParticipants = debateSummary ? Object.keys(debateSummary.againstCounts).length : 0;

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center p-4 relative">

      {/* ===== DEBATE CONCLUSION OVERLAY ===== */}
      <AnimatePresence>
        {debateEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-full max-w-xl card-glass p-8 md:p-10 rounded-2xl border border-slate-700 text-center"
            >
              {/* Trophy Icon */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3h14c.6 0 1 .4 1 1v2c0 2.8-2 5.1-4.6 5.8-.4 1.3-1.3 2.3-2.4 2.9V18h3c.6 0 1 .4 1 1v2H7v-2c0-.6.4-1 1-1h3v-3.3c-1.1-.6-2-1.6-2.4-2.9C6 11.1 4 8.8 4 6V4c0-.6.4-1 1-1zm0 2v1c0 1.9 1.3 3.5 3 3.9V6H5zm14 0h-3v3.9c1.7-.4 3-2 3-3.9V5z" />
                </svg>
              </div>

              <h2 className="text-3xl font-display font-bold text-white mb-2">Debate Concluded</h2>
              <p className="text-slate-400 text-sm mb-6">All participants have presented their arguments.</p>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-primary-900/30 border border-primary-500/30 rounded-xl p-4">
                  <div className="text-2xl font-mono font-bold text-primary-400">{forMessageCount}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">FOR Arguments</div>
                  <div className="text-xs text-slate-500 mt-1">{forParticipants} participant{forParticipants !== 1 ? 's' : ''}</div>
                </div>
                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
                  <div className="text-2xl font-mono font-bold text-red-400">{againstMessageCount}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">AGAINST Arguments</div>
                  <div className="text-xs text-slate-500 mt-1">{againstParticipants} participant{againstParticipants !== 1 ? 's' : ''}</div>
                </div>
              </div>

              {/* Feedback / Rating Section */}
              {!feedbackSubmitted ? (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Rate This Debate</h3>
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-all duration-200 hover:scale-125"
                      >
                        <svg
                          className={`w-10 h-10 transition-colors ${star <= (hoverRating || rating)
                            ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                            : 'text-slate-700'
                            }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={rating === 0}
                    className={`px-8 py-3 rounded-xl font-bold uppercase tracking-wide transition-all shadow-lg ${rating > 0
                      ? 'bg-primary-600 text-white hover:bg-primary-500 hover:shadow-primary-500/25'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                  >
                    Submit Rating
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-green-400 text-lg font-bold mb-2">Thank you for your feedback!</div>
                  <p className="text-slate-400 text-sm">Redirecting to home...</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / HUD */}
      <div className="w-full max-w-5xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4 card-glass p-4 rounded-xl border-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/joindebate')} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white font-display">Debate Arena</h1>
            <p className="text-xs text-slate-400 font-mono">ROOM: {newsId} • USER: {userId}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Turns Left HUD */}
          <div className="flex flex-col items-end mr-4">
            <span className={`text-2xl font-mono font-bold leading-none ${hasChancesLeft ? 'text-white' : 'text-red-500'}`}>
              {2 - myTurnCount}/2
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Turns Left</span>
          </div>

          {/* Team Status */}
          <div className={`px-5 py-2 rounded-full border flex items-center gap-3 shadow-lg backdrop-blur-md transition-all duration-300
                    ${normalizedTeam === 'For'
              ? 'bg-primary-900/40 border-primary-500/50 text-white shadow-primary-500/20'
              : 'bg-red-900/40 border-red-500/50 text-white shadow-red-500/20'
            }
                 `}>
            <div className={`p-1.5 rounded-full ${normalizedTeam === 'For' ? 'bg-primary-500 text-white' : 'bg-red-500 text-white'}`}>
              {normalizedTeam === 'For' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-70 leading-none mb-0.5">Your Alliance</span>
              <span className="font-bold font-display leading-none tracking-wide text-sm">Team {normalizedTeam}</span>
            </div>
          </div>

          {/* Timer HUD */}
          <div className={`flex flex-col items-end ${timer < 10 ? 'animate-pulse text-red-500' : 'text-primary-400'}`}>
            <span className="text-3xl font-mono font-bold leading-none">{timer}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Seconds Left</span>
          </div>

          {/* End Debate Button (Testing) */}
          {!debateEnded && (
            <button
              onClick={handleEndDebate}
              className="px-4 py-2 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-600/40 hover:text-white transition-all"
            >
              End Debate
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="w-full max-w-5xl mb-6">
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
          {currentTurn && (
            <div className={`absolute inset-0 transition-all duration-300 ${currentTurn.toLowerCase() === 'for' ? 'bg-primary-500 origin-left' : 'bg-red-500 origin-right'}`}></div>
          )}
        </div>
        <p className="text-center mt-2 text-slate-400 font-mono text-sm tracking-widest uppercase">
          {currentTurn ? (
            <>
              Current Speaker: <span className={currentTurn.toLowerCase() === 'for' ? 'text-primary-400 font-bold' : 'text-red-400 font-bold'}>{currentTurn} TO SPEAK</span>
            </>
          ) : (
            "Waiting for session start..."
          )}
        </p>
      </div>

      {/* Chat Area */}
      <div className="w-full max-w-5xl flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative mb-4 h-[60vh]">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 scrollbar-thin">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center opacity-30">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p>No arguments presented yet.</p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            const isFor = msg.team === 'For';
            const isSelf = msg.userId === userId; // Not perfect check if untrusted, but fine for UI

            return (
              <div key={index} className={`flex flex-col ${isFor ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg backdrop-blur-sm border
                                ${isFor
                    ? 'bg-slate-800/80 border-slate-700 rounded-tl-none text-slate-200'
                    : 'bg-slate-800/80 border-slate-700 rounded-tr-none text-slate-200'
                  }
                                ${isSelf ? 'ring-1 ring-white/20' : ''}
                             `}>
                  <div className={`flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider
                                    ${isFor ? 'text-primary-400' : 'text-red-400'}
                                `}>
                    <span>{msg.team}</span>
                    <span className="opacity-50">•</span>
                    <span>{msg.userId}</span>
                  </div>
                  <p className="leading-relaxed">{msg.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 z-20">
          {error && (
            <div className="mb-2 text-center text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
              ⚠️ {error}
            </div>
          )}
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && hasChancesLeft && handleSendMessage()}
              disabled={!isMyTurnNow || !hasChancesLeft}
              placeholder={
                !hasChancesLeft
                  ? "You have used all your turns."
                  : isMyTurnNow
                    ? "Present your argument..."
                    : "Wait for your turn to speak..."
              }
              className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 transition-all
                            ${isMyTurnNow && hasChancesLeft
                  ? 'focus:ring-primary-500 opacity-100'
                  : 'opacity-50 cursor-not-allowed focus:ring-transparent'
                }
                        `}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isMyTurnNow || !hasChancesLeft}
              className={`px-6 rounded-xl font-bold uppercase tracking-wider transition-all
                            ${isMyTurnNow && hasChancesLeft
                  ? 'bg-white text-slate-900 hover:bg-primary-50 hover:scale-105 hover:shadow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }
                        `}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
