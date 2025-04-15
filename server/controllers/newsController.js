const News = require('../models/News');

exports.addNews = async (req, res) => {
  const { title, content, source, url, publishedAt } = req.body;
  try {
    const newNews = new News({ title, content, source, url, publishedAt });
    await newNews.save();
    res.status(201).json(newNews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add news' });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const newsList = await News.find().sort({ publishedAt: -1 });
    res.status(200).json(newsList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news' });
  }
};