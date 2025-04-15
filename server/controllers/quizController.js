const Quiz = require('../models/Quiz');
const News = require('../models/News');
const { generateQuizQuestions } = require('../utils/quizGenerator');

exports.generateQuizFromNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await News.findById(newsId);
    if (!news) return res.status(404).json({ message: 'News not found' });

    const questions = await generateQuizQuestions(news.content);

    const quiz = new Quiz({ newsId, questions });
    await quiz.save();

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate quiz', error });
  }
};

exports.getQuizByNewsId = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ newsId: req.params.newsId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quiz', error });
  }
};
