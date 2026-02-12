import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const technologySubcategories = ['Tesla', 'Elon Musk', 'DOGE', 'Apple', 'AI', 'Crypto'];
const businessCountries = [
    { code: 'us', name: 'United States' },
    { code: 'in', name: 'India' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'jp', name: 'Japan' }
];

const NewsFeed = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Technology');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState('Tesla');
    const [selectedCountry, setSelectedCountry] = useState('us');

    const fetchNews = async () => {
        try {
            setLoading(true);

            if (selectedCategory === 'Technology') {
                let query = selectedSubcategory.toLowerCase();
                const params = { q: query };

                if (selectedSubcategory === 'Apple') {
                    const today = new Date();
                    const toDate = today.toISOString().split('T')[0];
                    const fromDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
                    params.from = fromDate;
                    params.to = toDate;
                    params.sortBy = 'popularity';
                }

                const response = await axios.get(`${API_BASE_URL}/api/news/proxy/everything`, { params });
                setNewsList(response.data.articles);

            } else if (selectedCategory === 'Business') {
                const response = await axios.get(`${API_BASE_URL}/api/news/proxy/top-headlines`, {
                    params: { country: selectedCountry, category: 'business' }
                });
                setNewsList(response.data.articles);
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
            setNewsList([
                { title: "Example News Title", description: "This is a placeholder description because the API might be rate limited.", urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000", url: "#", source: { name: "Debatify News" }, publishedAt: new Date().toISOString() },
                { title: "Another Big Tech Story", description: "Elaborating on the latest in technology and debate topics.", urlToImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000", url: "#", source: { name: "Tech Daily" }, publishedAt: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const refreshNews = async () => {
        try {
            setRefreshing(true);
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
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    useEffect(() => {
        fetchNews();
    }, [selectedCategory, selectedSubcategory, selectedCountry]);

    const filteredNews = newsList.filter(
        (news) => {
            if (!news || !news.title) return false;
            const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (news.description && news.description.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesSearch;
        }
    );

    return (
        <div className="min-h-screen text-slate-100 pt-24 pb-12">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-display font-bold mb-4"
                >
                    <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                        Global News Feed
                    </span>
                </motion.h1>
                <p className="text-slate-400">Stay informed with the latest updates from Technology and Business.</p>
            </div>

            {/* Control Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sticky top-24 z-40">
                <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-50 pointer-events-none"></div>

                    <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/5 transition-colors duration-500 ${selectedCategory === 'Technology' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {selectedCategory === 'Technology' ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-primary-500/50 hover:bg-slate-800 transition-all min-w-[180px] justify-between group"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Feed</span>
                                    <span className="font-display font-bold text-lg text-slate-200 group-hover:text-white transition-colors">
                                        {selectedCategory}
                                    </span>
                                </div>
                                <svg className={`w-5 h-5 text-slate-500 group-hover:text-primary-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 mt-2 w-full bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                                    >
                                        {['Technology', 'Business'].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setIsDropdownOpen(false);
                                                    setSearchTerm('');
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-primary-500/10 text-primary-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
                                            >
                                                {cat}
                                                {selectedCategory === cat && <motion.div layoutId="active-check" className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-8 w-px bg-slate-700/50 mx-2 hidden md:block"></div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto z-10">
                        <div className="relative flex-1 md:w-72 group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors group-hover:text-primary-400 text-slate-400">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 block pl-10 p-3 transition-all placeholder-slate-500 hover:border-slate-600"
                                placeholder="Search topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={refreshNews}
                            disabled={refreshing}
                            className="group relative p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary-500/50 hover:bg-slate-750 text-slate-400 hover:text-primary-400 transition-all overflow-hidden"
                            title="Refresh News"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/0 via-primary-500/0 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <svg className={`w-5 h-5 relative z-10 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700 ease-out'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex flex-wrap gap-2">
                    {selectedCategory === 'Technology' && technologySubcategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedSubcategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedSubcategory === cat
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                    {selectedCategory === 'Business' && businessCountries.map((country) => (
                        <button
                            key={country.code}
                            onClick={() => setSelectedCountry(country.code)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCountry === country.code
                                ? 'bg-secondary-600 text-white shadow-lg shadow-secondary-500/25'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {country.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* News Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 animate-pulse">Fetching global updates...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNews.length > 0 ? (
                            filteredNews.map((news, index) => (
                                <div key={index} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="aspect-video w-full overflow-hidden relative">
                                        <img
                                            src={news.urlToImage || 'https://via.placeholder.com/400x200?text=Debatify+News'}
                                            alt={news.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=No+Image' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                                        <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-primary-400 border border-slate-700">
                                            {news.source?.name}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <p className="text-xs text-slate-500 mb-2 font-mono flex items-center gap-2">
                                            <span>📅 {formatDate(news.publishedAt)}</span>
                                        </p>
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary-400 transition-colors">
                                            {news.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                            {news.description || news.content || "Click to read more about this topic..."}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                                            <a
                                                href={news.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                                            >
                                                Read Story <span className="text-xs">↗</span>
                                            </a>
                                            <Link
                                                to="/joindebate"
                                                className="text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-secondary-300 border border-secondary-500/30 px-3 py-1.5 rounded-lg hover:bg-secondary-500/10 transition-all"
                                            >
                                                Discuss This
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                <p className="text-xl">No articles found matching your criteria.</p>
                                <button onClick={() => { setSearchTerm(''); setSelectedCategory('Technology'); }} className="mt-4 text-primary-500 hover:underline">
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsFeed;
