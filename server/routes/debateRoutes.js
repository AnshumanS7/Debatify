const express = require('express');
const { registerForDebate, getDebateByNewsId } = require('../controllers/debateController');

const router = express.Router();

router.post('/register/:newsId', registerForDebate);
router.get('/:newsId', getDebateByNewsId);

module.exports = router;