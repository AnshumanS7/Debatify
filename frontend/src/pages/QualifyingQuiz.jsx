import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_QUESTIONS = [
    {
        id: 1,
        question: "What is the primary goal of the proposed policy modification?",
        options: [
            "To increase tax revenue",
            "To improve public infrastructure",
            "To reduce carbon emissions",
            "To regulate digital assets"
        ],
        correctAnswer: 3
    },
    {
        id: 2,
        question: "Which major entity recently announced their support for this initiative?",
        options: [
            "The European Union",
            "SpaceX",
            "The Federal Reserve",
            "OpenAI"
        ],
        correctAnswer: 0
    },
    {
        id: 3,
        question: "What is a key argument often cited by critics?",
        options: [
            "It lacks long-term sustainability",
            "It promotes unfair competition",
            "It violates privacy rights",
            "It is too expensive to implement"
        ],
        correctAnswer: 2
    },
    {
        id: 4,
        question: "How does this topic impact the global market?",
        options: [
            "Stabilizes currency exchange rates",
            "Creates new trade barriers",
            "Accelerates technological adoption",
            "Disrupts traditional supply chains"
        ],
        correctAnswer: 2
    },
    {
        id: 5,
        question: "When is the next major vote or decision expected?",
        options: [
            "Next month",
            "End of the year",
            "In 2027",
            "No date set"
        ],
        correctAnswer: 1
    }
];

const QualifyingQuiz = () => {
    const { newsId, userId, team } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState({});

    const handleAnswer = (optionIndex) => {
        const isCorrect = optionIndex === MOCK_QUESTIONS[currentQuestion].correctAnswer;

        setAnswers({ ...answers, [currentQuestion]: optionIndex });

        if (isCorrect) {
            setScore(score + 1);
        }

        if (currentQuestion < MOCK_QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
        } else {
            setTimeout(() => setShowResult(true), 300);
        }
    };

    const hasPassed = score >= 3; // Pass threshold: 3/5

    const handleContinue = () => {
        if (hasPassed) {
            // Navigate to Lobby
            navigate(`/debate-lobby/${newsId}/${userId}/${team}`);
        } else {
            // Retry
            setCurrentQuestion(0);
            setScore(0);
            setShowResult(false);
            setAnswers({});
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                        Qualifying Quiz
                    </h1>
                    <p className="text-slate-400">
                        Prove your knowledge to join <span className={`font-bold ${team === 'For' ? 'text-primary-400' : 'text-red-400'}`}>Team {team}</span>
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!showResult ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="card-glass p-8 rounded-2xl border border-slate-700 relative overflow-hidden"
                        >
                            {/* Progress Bar */}
                            <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
                                <div
                                    className="h-full bg-primary-500 transition-all duration-500"
                                    style={{ width: `${((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100}%` }}
                                ></div>
                            </div>

                            <div className="mt-4 mb-8">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}
                                </span>
                                <h2 className="text-xl md:text-2xl font-bold text-white mt-2 leading-relaxed">
                                    {MOCK_QUESTIONS[currentQuestion].question}
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {MOCK_QUESTIONS[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(index)}
                                        className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-left text-slate-200 hover:bg-slate-700 hover:border-slate-600 hover:text-white transition-all group flex items-center justify-between"
                                    >
                                        <span>{option}</span>
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-primary-500 group-hover:bg-primary-500/20 transition-colors"></div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card-glass p-8 md:p-12 rounded-2xl border border-slate-700 text-center"
                        >
                            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-2xl
                ${hasPassed ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}
              `}>
                                {hasPassed ? '🏆' : '⚠️'}
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-2">
                                {hasPassed ? 'Qualification Successful!' : 'Qualification Failed'}
                            </h2>

                            <p className="text-slate-300 mb-8 max-w-md mx-auto">
                                {hasPassed
                                    ? `You scored ${score}/5. You have proven your expertise and are ready to enter the lobby.`
                                    : `You scored ${score}/5. You need at least 3 correct answers to qualify for this debate.`}
                            </p>

                            <button
                                onClick={handleContinue}
                                className={`px-8 py-3 rounded-xl font-bold uppercase tracking-wide transition-all shadow-lg
                  ${hasPassed
                                        ? 'bg-primary-600 text-white hover:bg-primary-500 hover:shadow-primary-500/25'
                                        : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}
                `}
                            >
                                {hasPassed ? 'Enter Debate Lobby' : 'Try Again'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default QualifyingQuiz;
