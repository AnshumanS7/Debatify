// src/socket/index.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // or your actual backend port

export const joinDebateRoom = ({ newsId, userId, team }) => {
  return new Promise((resolve, reject) => {
    socket.emit('joinDebate', { newsId, userId, team }, (response) => {
      if (response && response.success) {
        resolve(response); // Resolve the promise on success
      } else {
        reject(new Error('Failed to join the room')); // Reject the promise on failure
      }
    });
  });
};

export const sendMessage = ({ newsId, userId, team, message }) => {
  socket.emit('sendMessage', { newsId, userId, team, message });
};

export const listenForMessages = (callback) => {
  socket.on('newMessage', callback);
};

export const listenForTurnChange = (callback) => {
  socket.on('turnChanged', callback);
};

export const listenForErrors = (callback) => {
  socket.on('errorMessage', callback);
};

export default socket;
