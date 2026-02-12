// import React from 'react';
// // import './NewsCard.css'; // Optional: create separate styles if needed
// import { Link } from 'react-router-dom';
// import './NewsCard.css';

// const NewsCard = ({ news }) => {
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <div className="news-card">
//       <div className="news-inner">
//         <div className="news-front">
//           <img
//             src={news.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}
//             alt="news"
//             className="news-image"
//           />
//           <h3 className="news-title">{news.title}</h3>
//           <p className="news-summary">
//             {news.content ? `${news.content.slice(0, 120)}...` : 'No summary available.'}
//           </p>
//           <div className="news-meta">
//             <span>
//               <strong>Source:</strong> {news.source?.name || 'Unknown'}
//             </span>
//             <br />
//             <span>
//               <strong>Published:</strong> {formatDate(news.publishedAt)}
//             </span>
//           </div>
//         </div>
//         <div className="news-back">
//           <a
//             href={news.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="explore-btn"
//           >
//             📖 Read More
//           </a>

//           {/* Debate button (link to debate room) */}
//           <Link
//             to={`/debateroom?title=${encodeURIComponent(news.title)}`}
//             className="debate-btn"
//           >
//             💬 Start Debate
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsCard;
