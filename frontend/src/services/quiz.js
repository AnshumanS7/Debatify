// src/services/quiz.js

export const getQuiz = async () => {
    // fetch from your backend
    const res = await fetch('/api/quiz');
    const data = await res.json();
    return data;
  };
  