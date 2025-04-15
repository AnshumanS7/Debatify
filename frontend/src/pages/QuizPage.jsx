// src/pages/QuizPage.jsx
import React, { useEffect, useState } from "react";
import { getQuiz } from "../services/quiz";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuiz().then(setQuestions);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quiz Time</h1>
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold">{q.question}</p>
          <ul className="list-disc pl-5">
            {q.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QuizPage;
