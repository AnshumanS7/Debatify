const dotenv = require('dotenv');
dotenv.config(); // Load env vars immediately

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const Debate = require('./models/Debate');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const quizRoutes = require('./routes/quizRoutes');
const debateRoutes = require('./routes/debateRoutes');

// Check for essential env variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.NEWS_API_KEY) {
  console.error('❌ Missing required environment variables in .env file.');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

// CORS origins — allows localhost for dev and deployed frontend for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL, // Set this in your Render env vars to your Vercel URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

const debateRooms = {}; // Keeps per-room state

// Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/debate', debateRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('🚀 Debatify API Running');
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

// Timer logic per debate room
const startTimerForRoom = (room) => {
  const debate = debateRooms[room];
  if (!debate) return;

  clearInterval(debate.timerInterval);
  debate.timer = 30;

  // Initial timer emit
  io.to(room).emit('timer-update', {
    timer: debate.timer,
    currentTurn: debate.currentTurn,
  });

  debate.timerInterval = setInterval(() => {
    debate.timer -= 1;
    io.to(room).emit('timer-update', {
      timer: debate.timer,
      currentTurn: debate.currentTurn,
    });

    if (debate.timer <= 0) {
      debate.currentTurn = debate.currentTurn === 'for' ? 'against' : 'for';
      debate.timer = 30;

      io.to(room).emit('turn-change', {
        currentTurn: debate.currentTurn,
        forCounts: debate.forCounts,
        againstCounts: debate.againstCounts
      });
      io.to(room).emit('timer-update', {
        timer: debate.timer,
        currentTurn: debate.currentTurn,
      });
    }
  }, 1000);
};

// Helper: check if all users in a debate have used their turns
const checkDebateComplete = (debate) => {
  const forUsers = Object.keys(debate.forCounts);
  const againstUsers = Object.keys(debate.againstCounts);

  // Need at least 1 user on each side to consider completion
  if (forUsers.length === 0 || againstUsers.length === 0) return false;

  const allForDone = forUsers.every(u => debate.forCounts[u] >= 2);
  const allAgainstDone = againstUsers.every(u => debate.againstCounts[u] >= 2);

  return allForDone && allAgainstDone;
};

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('joinDebate', ({ newsId, userId, team }, callback) => {
    const room = `debate-${newsId}`;
    const normalizedTeam = team?.toLowerCase();

    socket.join(room);

    if (!debateRooms[room]) {
      debateRooms[room] = {
        currentTurn: 'for',
        forCounts: {},
        againstCounts: {},
        messages: [],
        timer: 30,
        timerInterval: null,
        ended: false,
      };
      startTimerForRoom(room);
    }

    // If debate already ended, tell the joining user immediately
    if (debateRooms[room].ended) {
      socket.emit('debate-ended', {
        messages: debateRooms[room].messages,
        forCounts: debateRooms[room].forCounts,
        againstCounts: debateRooms[room].againstCounts,
      });
      if (callback) return callback({ success: true, room, ended: true });
    }

    // Register user in their team's count tracker (initialize to 0 if new)
    if (normalizedTeam === 'for' && !(userId in debateRooms[room].forCounts)) {
      debateRooms[room].forCounts[userId] = 0;
    } else if (normalizedTeam === 'against' && !(userId in debateRooms[room].againstCounts)) {
      debateRooms[room].againstCounts[userId] = 0;
    }

    // Emit current debate state
    socket.emit('turn-change', {
      currentTurn: debateRooms[room].currentTurn,
      forCounts: debateRooms[room].forCounts,
      againstCounts: debateRooms[room].againstCounts
    });

    socket.emit('timer-update', {
      timer: debateRooms[room].timer,
      currentTurn: debateRooms[room].currentTurn,
    });

    if (callback) callback({ success: true, room });
  });

  socket.on('sendMessage', ({ newsId, userId, team, message }) => {
    const room = `debate-${newsId}`;
    const debate = debateRooms[room];
    const normalizedTeam = team?.toLowerCase();

    if (!debate) {
      return socket.emit('errorMessage', 'Debate room not found.');
    }

    if (debate.ended) {
      return socket.emit('errorMessage', 'This debate has already concluded.');
    }

    if (normalizedTeam !== debate.currentTurn) {
      return socket.emit('errorMessage', 'Not your team\'s turn to speak.');
    }

    const userCount =
      normalizedTeam === 'for'
        ? debate.forCounts[userId] || 0
        : debate.againstCounts[userId] || 0;

    if (userCount >= 2) {
      return socket.emit('errorMessage', 'You have used both your chances.');
    }

    if (normalizedTeam === 'for') {
      debate.forCounts[userId] = userCount + 1;
    } else {
      debate.againstCounts[userId] = userCount + 1;
    }

    const newMsg = { userId, team: normalizedTeam, message };
    debate.messages.push(newMsg);
    io.to(room).emit('newMessage', newMsg);

    // Check if debate is now complete
    if (checkDebateComplete(debate)) {
      debate.ended = true;
      clearInterval(debate.timerInterval);
      io.to(room).emit('debate-ended', {
        messages: debate.messages,
        forCounts: debate.forCounts,
        againstCounts: debate.againstCounts,
      });
      return; // Don't switch turn or restart timer
    }

    // Switch turn
    debate.currentTurn = normalizedTeam === 'for' ? 'against' : 'for';

    // Broadcast new turn AND counts
    io.to(room).emit('turn-change', {
      currentTurn: debate.currentTurn,
      forCounts: debate.forCounts,
      againstCounts: debate.againstCounts
    });

    // Restart timer
    startTimerForRoom(room);
  });

  // Manual end debate (for testing / admin use)
  socket.on('endDebate', ({ newsId }) => {
    const room = `debate-${newsId}`;
    const debate = debateRooms[room];
    if (!debate || debate.ended) return;

    debate.ended = true;
    clearInterval(debate.timerInterval);
    io.to(room).emit('debate-ended', {
      messages: debate.messages,
      forCounts: debate.forCounts,
      againstCounts: debate.againstCounts,
    });
    console.log(`⏹️ Debate manually ended for room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
    // Optional: Clean up empty rooms or stop timers
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
