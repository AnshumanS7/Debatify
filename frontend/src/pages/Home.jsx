import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const technologySubcategories = ['Tesla', 'Elon Musk', 'DOGE', 'Apple'];
const businessCountries = [
  { code: 'us', name: 'United States' },
  // You can add more countries later like: { code: 'in', name: 'India' }
];

const NEWS_API_KEY = '704e7f2351214e08a42bdd37e3f27d60';

const Home = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Technology');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Tesla');
  const [selectedCountry, setSelectedCountry] = useState('us');

  const fetchNews = async () => {
    try {
      setLoading(true);

      if (selectedCategory === 'Technology') {
        if (selectedSubcategory === 'Apple') {
          // Get today's date (toDate)
          const today = new Date();
          const toDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

          // Get 7 days ago (fromDate)
          const fromDate = new Date(today.setDate(today.getDate() - 7)) // 7 days ago
            .toISOString()
            .split('T')[0]; // Format as YYYY-MM-DD

          // Fetch Apple news for the past 7 days
          const response = await axios.get(
            `https://newsapi.org/v2/everything?q=apple&from=${fromDate}&to=${toDate}&sortBy=popularity&apiKey=${NEWS_API_KEY}`
          );
          setNewsList(response.data.articles);
        } else {
          // Fetch other technology news (Tesla, Elon Musk, DOGE, etc.)
          const response = await axios.get('http://localhost:5000/api/news');
          setNewsList(response.data);
        }
      } else if (selectedCategory === 'Business') {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=${selectedCountry}&category=business&apiKey=${NEWS_API_KEY}`
        );
        setNewsList(response.data.articles);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    try {
      setRefreshing(true);

      if (selectedCategory === 'Technology' && selectedSubcategory !== 'Apple') {
        await axios.post('http://localhost:5000/api/news/refresh');
      }

      await fetchNews();
    } catch (error) {
      console.error('Failed to refresh news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, selectedSubcategory, selectedCountry]);

  const filteredNews = newsList.filter(
    (news) =>
      (selectedCategory === 'Technology'
        ? news.title?.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
          news.content?.toLowerCase().includes(selectedSubcategory.toLowerCase())
        : true) &&
      (news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.content?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="home-container">
      <div className="welcome-card">
        <h1 className="welcome-title">
          🎙️ Welcome to <span className="brand">Debatify</span>
        </h1>
        <p className="welcome-text">
          Explore debates, quizzes, and real-world news. Dive into discussions that matter!
        </p>
      </div>

      <div className="news-header-bar">
        <h2 className="news-header">📰 {selectedCategory} News</h2>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchTerm('');
            }}
          >
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
          </select>

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="refresh-btn" onClick={refreshNews} disabled={refreshing}>
            {refreshing ? '⏳ Refreshing...' : '🔄 Refresh News'}
          </button>
        </div>
      </div>

      {/* Subcategory Tabs */}
      {selectedCategory === 'Technology' && (
        <div className="subcategory-tabs">
          {technologySubcategories.map((cat) => (
            <button
              key={cat}
              className={`subcategory-btn ${selectedSubcategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedSubcategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Business Country Filter */}
      {selectedCategory === 'Business' && (
        <div className="subcategory-tabs">
          {businessCountries.map((country) => (
            <button
              key={country.code}
              className={`subcategory-btn ${selectedCountry === country.code ? 'active' : ''}`}
              onClick={() => setSelectedCountry(country.code)}
            >
              {country.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="loading-news">⏳ Loading news...</p>
      ) : (
        <div className="news-list">
          {filteredNews.length > 0 ? (
            filteredNews.map((news, index) => (
              <div className="news-card" key={index}>
                <div className="news-inner">
                  <div className="news-front">
                    <img
                      src={news.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}
                      alt="news"
                      className="news-image"
                    />
                    <h3 className="news-title">{news.title}</h3>
                    <p className="news-summary">
                      {news.content ? `${news.content.slice(0, 120)}...` : 'No summary available.'}
                    </p>
                    <div className="news-meta">
                      <span>
                        <strong>Source:</strong> {news.source?.name || 'Unknown'}
                      </span>
                      <br />
                      <span>
                        <strong>Published:</strong> {formatDate(news.publishedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="news-back">
                    <a href={news.url} target="_blank" rel="noopener noreferrer" className="explore-btn">
                      📖 Read More
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-news">🚫 No news articles found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
