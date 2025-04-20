const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const Debate = require('./models/Debate');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const quizRoutes = require('./routes/quizRoutes');
const debateRoutes = require('./routes/debateRoutes');

dotenv.config();

// Check for essential env variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.NEWS_API_KEY) {
  console.error('❌ Missing required environment variables in .env file.');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const debateRooms = {}; // Keeps per-room state

// Middlewares
app.use(cors());
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

      io.to(room).emit('turn-change', debate.currentTurn);
      io.to(room).emit('timer-update', {
        timer: debate.timer,
        currentTurn: debate.currentTurn,
      });
    }
  }, 1000);
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
      };
      startTimerForRoom(room);
    }

    // Emit current debate state
    socket.emit('turn-change', debateRooms[room].currentTurn);
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

    // Switch turn
    debate.currentTurn = normalizedTeam === 'for' ? 'against' : 'for';
    io.to(room).emit('turn-change', debate.currentTurn);

    // Restart timer
    startTimerForRoom(room);
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
