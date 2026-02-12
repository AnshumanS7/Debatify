import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: (
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
        ),
        title: "Real-time Debates",
        description: "Join live debate rooms, pick a side, and engage in meaningful discourse on trending topics with users worldwide.",
        gradient: "from-blue-500/20 to-cyan-500/20",
        border: "group-hover:border-blue-500/50",
        textGradient: "group-hover:text-blue-400",
        link: "/joindebate",
        buttonStyle: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white border-blue-500/20"
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
        title: "Curated News",
        description: "Stay ahead with real-time, verified news updates from Technology and Business sectors to inform your arguments.",
        gradient: "from-purple-500/20 to-pink-500/20",
        border: "group-hover:border-purple-500/50",
        textGradient: "group-hover:text-purple-400",
        link: "/news-feed",
        buttonStyle: "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white border-purple-500/20"
    },
    {
        icon: (
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        title: "Interactive Quizzes",
        description: "Test your knowledge and analytical skills with daily quizzes designed to sharpen your critical thinking.",
        gradient: "from-amber-500/20 to-orange-500/20",
        border: "group-hover:border-amber-500/50",
        textGradient: "group-hover:text-amber-400",
        link: "/quiz",
        buttonStyle: "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white border-amber-500/20"
    }
];

const AboutSection = () => {
    return (
        <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-primary-900/10 blur-3xl rounded-[100%] pointer-events-none -z-10"></div>

            {/* Section Header */}
            <div className="text-center mb-20 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-block mb-4 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-primary-400 shadow-sm"
                >
                    Why Debatify?
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
                >
                    <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        More Than Just a Platform
                    </span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
                >
                    Debatify is where information meets conversation. We're building the future of digital discourse by combining real-time news with structured, intelligent debate.
                </motion.p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className={`group relative p-1 rounded-[2rem] bg-slate-800/30 transition-all duration-500`}
                    >
                        {/* Gradient Border Effect */}
                        <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br from-slate-700/50 to-slate-800/50 group-hover:from-primary-500/50 group-hover:to-secondary-500/50 transition-colors duration-500 opacity-100`}></div>

                        {/* Card Content */}
                        <div className="relative h-full bg-slate-900/90 backdrop-blur-xl rounded-[1.9rem] p-8 overflow-hidden z-10 transition-colors group-hover:bg-slate-900/80 flex flex-col">

                            {/* Hover Inner Gradient */}
                            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${feature.gradient} blur-[80px] opacity-0 group-hover:opacity-50 transition-opacity duration-700`}></div>

                            <div className={`relative w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-8 text-slate-400 ${feature.textGradient} transition-colors duration-300 shadow-lg group-hover:scale-110 transform`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 font-display tracking-tight group-hover:text-primary-200 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors mb-8">
                                {feature.description}
                            </p>

                            {/* Action Button */}
                            <Link
                                to={feature.link}
                                className={`mt-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${feature.buttonStyle}`}
                            >
                                <span>Explore Feature</span>
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default AboutSection;
