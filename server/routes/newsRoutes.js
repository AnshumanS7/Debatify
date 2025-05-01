const express = require('express');
const router = express.Router();
const News = require('../models/News');
const axios = require('axios');
const cron = require('node-cron');

// Define the category or query
const CATEGORY = 'technology'; // you can change this to 'science', 'sports', etc.
// OR use a query like:
// const QUERY = 'AI';

const fetchAndStoreNews = async () => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    // Fetch news from the external API
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=tesla&from=2025-03-25&sortBy=publishedAt&apiKey=${apiKey}`
      // If you're using query instead of category, use this:
      // `https://newsapi.org/v2/everything?q=${QUERY}&pageSize=10&apiKey=${apiKey}`
    );

    const articles = response.data.articles;

    // Prepare the news documents for insertion into MongoDB
    const newsDocs = articles.map(article => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source.name,
    }));

    // Delete old articles before inserting new ones (optional step)
    await News.deleteMany({});

    // Insert new articles into the database
    await News.insertMany(newsDocs);
    console.log(`[✓] ${newsDocs.length} news articles saved at ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error('[✗] Failed to fetch/store news:', error.message);
  }
};

// Fetch news once on server start
fetchAndStoreNews();

// Schedule to fetch news every 3 hours
cron.schedule('0 */3 * * *', () => {
  console.log('[⏰] Running scheduled news update (every 3 hours)...');
  fetchAndStoreNews();
}, {
  timezone: 'Asia/Kolkata'
});

// GET all news articles
router.get('/', async (req, res) => {
  try {
    const newsList = await News.find().sort({ publishedAt: -1 });
    res.status(200).json(newsList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// POST to manually refresh the news articles
router.post('/refresh', async (req, res) => {
  try {
    // Clear the existing news and fetch the latest
    await News.deleteMany({});
    await fetchAndStoreNews(); // Re-fetch and store the news
    res.status(200).json({ message: 'News refreshed successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh news' });
  }
});

module.exports = router;
