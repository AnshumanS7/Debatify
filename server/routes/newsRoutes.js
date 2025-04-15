const express = require('express');
const { addNews, getAllNews } = require('../controllers/newsController');

const router = express.Router();

router.post('/add', addNews);
router.get('/', getAllNews);

module.exports = router;