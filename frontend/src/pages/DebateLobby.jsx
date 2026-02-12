import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DebateLobby = () => {
    const { newsId, userId, team } = useParams();
    const navigate = useNavigate();

    // Simulation state
    const [timeLeft, setTimeLeft] = useState(15); // Start with short timer for testing (15s)
    const [participants, setParticipants] = useState([
        { name: userId, rank: 'You', team: team, status: 'Ready' }
    ]);

    useEffect(() => {
        // Timer Logic
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Redirect to Debate Room when timer ends
                    navigate(`/debate-room/${newsId}/${userId}/${team}`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Simulate arriving participants
        const arrivalTimer = setInterval(() => {
            if (participants.length < 8) {
                const randomTeam = Math.random() > 0.5 ? 'For' : 'Against';
                const newParticipant = {
                    name: `User_${Math.floor(Math.random() * 9000) + 1000}`,
                    rank: `#${Math.floor(Math.random() * 50) + 1}`,
                    team: randomTeam,
                    status: 'Ready'
                };
                setParticipants(prev => [...prev, newParticipant]);
            }
        }, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(arrivalTimer);
        };
    }, [navigate, newsId, userId, team, participants.length]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">

            {/* Lobby Header */}
            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                    Debate Lobby
                </h1>
                <p className="text-slate-400">Waiting for opponents...</p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Timer Card */}
                <div className="card-glass p-8 flex flex-col items-center justify-center text-center border-slate-700 md:col-span-3 lg:col-span-1">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Starting In</div>
                    <div className={`text-6xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="mt-4 text-xs text-slate-400">
                        You are qualified!
                    </div>
                </div>

                {/* Participants List */}
                <div className="card-glass p-6 border-slate-700 md:col-span-3 lg:col-span-2 overflow-hidden flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                        <h2 className="text-lg font-bold text-white">Lobby Participants</h2>
                        <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-400">
                            {participants.length} / 20
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                        {participants.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${p.team === 'For' ? 'bg-primary-500' : 'bg-red-500'}`}></div>
                                    <span className={p.name === userId ? "font-bold text-white" : "text-slate-300"}>
                                        {p.name} {p.name === userId && "(You)"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-500 font-mono">{p.rank}</span>
                                    <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/50">
                                        {p.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {/* Empty slots placeholders */}
                        {Array.from({ length: Math.max(0, 10 - participants.length) }).map((_, i) => (
                            <div key={`empty_${i}`} className="p-3 rounded-lg border border-dashed border-slate-800 flex items-center gap-3 opacity-50">
                                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                                <span className="text-slate-600 text-sm italic">Searching...</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="mt-8 text-center max-w-lg mx-auto">
                <p className="text-xs text-slate-500 leading-relaxed">
                    <span className="font-bold text-slate-400">NOTE:</span> The debate will begin automatically when the timer reaches zero or when the lobby is full.
                    Top 10 candidates from the leaderboard are selected for today's session.
                </p>
            </div>

        </div>
    );
};

export default DebateLobby;
