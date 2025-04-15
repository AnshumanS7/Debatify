import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './DebateRoom.css'; // Importing the CSS file

const socket = io('http://localhost:5000'); // Update if hosted elsewhere

const DebateRoom = () => {
  const { newsId, userId, team } = useParams();
  const normalizedTeam = team.toLowerCase(); // Ensure team is always in lowercase

  const [timer, setTimer] = useState(30);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [error, setError] = useState('');

  const countdownRef = useRef(null);

  useEffect(() => {
    console.log("newsId:", newsId, "userId:", userId, "team:", normalizedTeam);

    socket.emit('joinDebate', { newsId, userId, team: normalizedTeam }, (response) => {
      if (!response.success) {
        setError('Failed to join debate');
      }
    });

    socket.on('turn-change', (newTurn) => {
      console.log("Turn changed to:", newTurn);
      setCurrentTurn(newTurn);
      setTimer(30);

      // Clear previous timer if any
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('errorMessage', (errMsg) => {
      setError(errMsg);
      setTimeout(() => setError(''), 3000);
    });

    return () => {
      socket.disconnect();
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [newsId, userId, normalizedTeam]);

  const handleSendMessage = () => {
    const isMyTurn = normalizedTeam === currentTurn?.toLowerCase();

    if (!isMyTurn) {
      setError("Not your team's turn to speak");
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (message.trim()) {
      socket.emit('sendMessage', {
        newsId,
        userId,
        team: normalizedTeam,
        message,
      });
      setMessage('');
    }
  };

  const isMyTurnNow = normalizedTeam === currentTurn?.toLowerCase();

  return (
    <div className="debate-room-container">
      <div className="debate-room-box">
        {/* Room Header */}
        <h2 className="header">
          🧠 Debate Room
        </h2>

        {/* Team: For at Left Corner */}
        <span className="team-info absolute top-4 left-4 text-lg font-medium text-indigo-400">
          Team: <span className="capitalize">{normalizedTeam}</span>
        </span>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Turn & Timer */}
        <div className="turn-timer">
          <h3>{currentTurn ? `${currentTurn} Team's Turn` : "⏳ Waiting for turn..."}</h3>
          <p>
            ⏱️ Time left: <span className="timer">{timer}s</span>
          </p>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-box ${msg.team === normalizedTeam ? 'my-message' : 'other-message'}`}
            >
              <p className="message-header">{msg.team} - {msg.userId}</p>
              <p className="message-body">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isMyTurnNow ? "Type your argument..." : "⛔ Wait for your turn..."}
            disabled={!isMyTurnNow}
            className="message-input"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isMyTurnNow}
            className={`send-button ${!isMyTurnNow ? 'disabled' : ''}`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
