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

    // Calculate date for "yesterday" or "today" to get recent news
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const fromDate = yesterday.toISOString().split('T')[0];

    // Fetch news from the external API
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=technology&from=${fromDate}&sortBy=publishedAt&apiKey=${apiKey}`
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

// ===== NEWS API PROXY ENDPOINTS =====
// These proxy NewsAPI calls through the server to avoid browser CORS restrictions

// Proxy for /v2/everything (Technology category searches)
router.get('/proxy/everything', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const { q, from, to, sortBy } = req.query;

    let url = `https://newsapi.org/v2/everything?q=${q || 'technology'}&apiKey=${apiKey}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    if (sortBy) url += `&sortBy=${sortBy}`;

    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('[✗] News proxy (everything) failed:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch news',
      articles: [],
    });
  }
});

// Proxy for /v2/top-headlines (Business category by country)
router.get('/proxy/top-headlines', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const { country, category } = req.query;

    const url = `https://newsapi.org/v2/top-headlines?country=${country || 'us'}&category=${category || 'business'}&apiKey=${apiKey}`;

    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('[✗] News proxy (top-headlines) failed:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch news',
      articles: [],
    });
  }
});

module.exports = router;
