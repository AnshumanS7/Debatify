import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinDebate.css'; // import the CSS file
import leftImage from '../assets/left-img.png';
import rightImage from '../assets/right-img.png';

const JoinDebate = () => {
  const [team, setTeam] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const navigate = useNavigate();

  const newsId = "123";
  const userId = "456";

  const handleJoin = () => {
    if (!team) {
      alert('Please select a team.');
      return;
    }

    // Navigate to the Debate Room with all the parameters without showing a success message
    navigate(`/debate-room/${newsId}/${userId}/${team}`);
  };

  return (
    <div className="background-container">
      {/* LEFT IMAGE */}
      <img src={leftImage} alt="Left" className={`bg-image left ${team === 'For'|| hoveredTeam === 'For' ? 'enlarged' : ''}`} />

      {/* RIGHT IMAGE */}
      <img src={rightImage} alt="Right" className={`bg-image right ${team === 'Against'|| hoveredTeam === 'Against' ? 'enlarged' : ''}`} />

      {/* MAIN CONTENT */}
      <div className="debate-container">
        <h2 className="debate-heading">🧠 Welcome to the Debate Room</h2>
        <p className="debate-subtext">Choose your team to join the debate:</p>

        <div className="team-selection">
          <button
            className={`team-button ${team === 'For' ? 'selected-for' : ''}`}
            onClick={() => {
              setTeam('For');
              alert('Joined For-team successfully');
            }}
            onMouseEnter={() => setHoveredTeam('For')}
            onMouseLeave={() => setHoveredTeam(null)}
          >
            ✅ Join For
          </button>
          <button
            className={`team-button ${team === 'Against' ? 'selected-against' : ''}`}
            onClick={() => {
              setTeam('Against');
              alert('Joined Against-team successfully');
            }}
            onMouseEnter={() => setHoveredTeam('Against')}
            onMouseLeave={() => setHoveredTeam(null)}
          >
            ❌ Join Against
          </button>
        </div>

        <button className="join-button" onClick={handleJoin}>
          Join Debate
        </button>
      </div>
    </div>
  );
};

export default JoinDebate;
