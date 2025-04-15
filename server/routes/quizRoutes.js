const express = require('express');
const { generateQuizFromNews, getQuizByNewsId } = require('../controllers/quizController');

const router = express.Router();

router.post('/generate/:newsId', generateQuizFromNews);
router.get('/:newsId', getQuizByNewsId);

module.exports = router;