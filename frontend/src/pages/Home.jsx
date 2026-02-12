import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AboutSection from '../components/AboutSection';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('user');
  return (
    <div className="min-h-screen text-slate-100 pt-20 pb-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl shadow-primary-900/20 p-8 md:p-16 text-center isolate"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-600/20 blur-[120px] rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                x: [0, 100, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary-600/20 blur-[120px] rounded-full"
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm text-sm font-medium text-slate-300 shadow-sm"
            >
              The Future of Digital Discourse
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-6 tracking-tight leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
                Welcome to
              </span>
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent bg-clip-text text-transparent drop-shadow-lg ml-3 animate-pulse-slow">
                Debatify
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Dive into real-world debates, challenge your knowledge with quizzes, and stay ahead with the latest news.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {isLoggedIn ? (
                <>
                  <Link to="/joindebate" className="btn-primary group relative overflow-hidden flex items-center gap-3 px-8 py-4 text-lg">
                    <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                      Start Debating
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </Link>

                  <Link to="/quiz" className="btn-secondary group flex items-center gap-3 px-8 py-4 text-lg backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20">
                    <span className="font-bold tracking-wide text-slate-200 group-hover:text-white transition-colors">
                      Take a Quiz
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary group relative overflow-hidden flex items-center gap-3 px-8 py-4 text-lg">
                    <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                      Get Started
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </Link>

                  <Link to="/login" className="btn-secondary group flex items-center gap-3 px-8 py-4 text-lg backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20">
                    <span className="font-bold tracking-wide text-slate-200 group-hover:text-white transition-colors">
                      Sign In
                    </span>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      <AboutSection />
    </div>
  );
};

export default Home;
