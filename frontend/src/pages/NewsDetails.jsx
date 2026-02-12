import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsDetails, setNewsDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        // Attempt to fetch from backend
        // Note: If backend is not running or returns 404, we might want to show a graceful error or mock
        const response = await axios.get(`${API_BASE_URL}/api/news/${id}`);
        setNewsDetails(response.data);
      } catch (error) {
        console.error('Error fetching news details:', error);
        // Fallback for demo purposes if backend fails
        setNewsDetails({
          title: "News API Rate Limit or Connection Error",
          content: "We couldn't fetch the full story details at this moment. This might be due to API rate limits or server connection issues. Please try again later.",
          urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000",
          source: { name: "System Message" },
          publishedAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!newsDetails) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center p-4">
        <div className="card-glass p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Story Not Found</h2>
          <p className="text-slate-400 mb-6">The article you are looking for could not be found.</p>
          <button onClick={() => navigate('/home')} className="btn-primary">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary-500/30">
      {/* Navigation Bar Placeholder/Back Button */}
      <div className="fixed top-0 w-full z-50 p-4 transition-all duration-300 pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="pointer-events-auto w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <div className="absolute inset-0 bg-slate-900">
          <img
            src={newsDetails.urlToImage || 'https://via.placeholder.com/1200x600?text=News+Story'}
            alt={newsDetails.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 max-w-5xl mx-auto">
          <div className="animate-slide-up">
            {newsDetails.source?.name && (
              <span className="inline-block px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/30 backdrop-blur-sm">
                {newsDetails.source.name}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-4 drop-shadow-xl">
              {newsDetails.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-400 text-sm font-mono">
              <span>{new Date(newsDetails.publishedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {newsDetails.author && (
                <>
                  <span>•</span>
                  <span>By {newsDetails.author}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg prose-invert mx-auto">
          <p className="text-xl text-slate-300 leading-relaxed mb-8 font-serif border-l-4 border-primary-500 pl-4 italic">
            {newsDetails.description}
          </p>

          <div className="text-slate-300 space-y-6 leading-8">
            {/* Render content - basic split by newlines if simple text, or just display */}
            {newsDetails.content ? (
              newsDetails.content.split('[').map((text, i) => (
                <p key={i}>{text.replace(/\+\d+ chars\]/, '')}</p>
              ))
            ) : (
              <p>Read the full story at the source.</p>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex justify-center">
            {newsDetails.url && (
              <a
                href={newsDetails.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                Read Full Article at Source
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
