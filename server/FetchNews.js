require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const cron = require('node-cron');
const News = require('./models/News');

// Connect to your existing MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/debatify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to fetch news from NewsAPI
const fetchAndStoreNews = async () => {
  try {
    const res = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        language: 'en',
        pageSize: 5,
        country: 'in',
      },
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY,
      },
    });

    const articles = res.data.articles;

    const formattedArticles = articles.map((a) => ({
      title: a.title,
      content: a.description || a.content,
      source: a.source.name,
      url: a.url,
      publishedAt: new Date(a.publishedAt),
    }));

    await News.insertMany(formattedArticles, { ordered: false });
    console.log('✅ News fetched and stored successfully');
  } catch (err) {
    console.error('❌ Error fetching news:', err.message);
  }
};

// Run immediately once on script start
fetchAndStoreNews();

// Schedule to run daily at 8 AM
cron.schedule('0 8 * * *', () => {
  console.log('⏰ Running scheduled news fetch...');
  fetchAndStoreNews();
});
