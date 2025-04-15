import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const JoinDebate = () => {
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();
  // const { newsId, userId } = useParams(); // Get dynamic route params
  const newsId = "123";
  const userId = "456";


  const handleJoin = () => {
    if (!team) {
      alert('Please select a team.');
      return;
    }

    // Navigate to DebateRoom with all required params
    navigate(`/debate-room/${newsId}/${userId}/${team}`);
  };

  return (
    <div style={styles.pageContainer}>
      <h2>Welcome to the Debate!</h2>
      <p>Choose your team to join the debate:</p>
      <div style={styles.teamSelection}>
        <button onClick={() => setTeam('For')} style={styles.button}>
          Join For
        </button>
        <button onClick={() => setTeam('Against')} style={styles.button}>
          Join Against
        </button>
      </div>
      <button onClick={handleJoin} style={styles.joinButton}>Join Debate</button>
    </div>
  );
};

const styles = {
  pageContainer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    width: '80%',
    margin: 'auto',
    maxWidth: '500px',
  },
  teamSelection: {
    margin: '20px 0',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  joinButton: {
    padding: '12px 25px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
};

export default JoinDebate;
