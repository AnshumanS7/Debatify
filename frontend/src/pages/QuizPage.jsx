// src/pages/QuizPage.jsx
import React, { useEffect, useState } from "react";
import { getQuiz } from "../services/quiz";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    getQuiz()
      .then((data) => {
        // Ensure data is array, if not wrap or default
        const qArray = Array.isArray(data) ? data : [];
        setQuestions(qArray);
      })
      .catch((err) => {
        console.error(err);
        // Fallback mock data if fetch fails
        setQuestions([
          { question: "What is the capital of France?", options: ["Berlin", "London", "Paris", "Madrid"], answer: "Paris" },
          { question: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: "Mars" },
          { question: "Who wrote 'Hamlet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: "William Shakespeare" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    // Check if correct (assuming simple string match for now)
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.answer && selectedAnswer === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }

    // Move to next
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Preparing your challenge...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center text-white">
        <h1 className="text-2xl font-bold">No questions available right now.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 flex flex-col items-center">
      <div className="max-w-2xl w-full">

        {/* Header / Progress */}
        {!isFinished && (
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <h1 className="text-2xl font-display font-bold text-white">Daily Trivia</h1>
              <span className="text-sm font-mono text-primary-400">Question {currentQuestionIndex + 1} / {questions.length}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* content */}
        {isFinished ? (
          <div className="card-glass p-12 text-center animate-slide-up">
            <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
              <span className="text-5xl">🏆</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-2">Quiz Completed!</h2>
            <p className="text-slate-300 mb-8 text-lg">
              You scored <span className="text-primary-400 font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span>
            </p>

            <div className="flex gap-4 justify-center">
              <button onClick={restartQuiz} className="btn-secondary">
                Try Again
              </button>
              <button className="btn-primary">
                View Leaderboard
              </button>
            </div>
          </div>
        ) : (
          <div className="card-glass p-6 md:p-10 animate-fade-in key-{currentQuestionIndex}">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
              {questions[currentQuestionIndex].question}
            </h3>

            <div className="space-y-3 mb-8">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 group
                                ${selectedAnswer === option
                      ? 'bg-primary-500/20 border-primary-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 hover:text-white'
                    }
                            `}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors
                                ${selectedAnswer === option
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-slate-800 border-slate-600 text-slate-500 group-hover:border-slate-500'
                    }
                            `}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className={`btn-primary flex items-center gap-2 ${!selectedAnswer ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}`}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizPage;
