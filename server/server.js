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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const debateRooms = {}; // per-room state

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/debate', debateRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Debatify API Running');
});

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// ======== SOCKET LOGIC ========
const startTimerForRoom = (room) => {
  const debate = debateRooms[room];
  if (!debate) return;

  clearInterval(debate.timerInterval); // Clear existing if any
  debate.timer = 30;

  // Emit initial time
  io.to(room).emit('timer-update', { timer: debate.timer, currentTurn: debate.currentTurn });

  debate.timerInterval = setInterval(() => {
    debate.timer -= 1;
    io.to(room).emit('timer-update', { timer: debate.timer, currentTurn: debate.currentTurn });

    if (debate.timer <= 0) {
      // Time's up: switch turn
      debate.currentTurn = debate.currentTurn === 'for' ? 'against' : 'for';
      debate.timer = 30;
      io.to(room).emit('turn-change', debate.currentTurn);
      io.to(room).emit('timer-update', { timer: debate.timer, currentTurn: debate.currentTurn });
    }
  }, 1000);
};

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('joinDebate', ({ newsId, userId, team }, callback) => {
    const room = `debate-${newsId}`;
    socket.join(room);

    const normalizedTeam = team.toLowerCase();

    if (!debateRooms[room]) {
      debateRooms[room] = {
        currentTurn: 'for',
        forCounts: {},
        againstCounts: {},
        messages: [],
        timer: 30,
        timerInterval: null,
      };

      // Start timer for this room
      startTimerForRoom(room);
    }

    // Send current state to the user
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

    if (!debate) {
      socket.emit('errorMessage', 'Debate room not found.');
      return;
    }

    const normalizedTeam = team.toLowerCase();

    if (normalizedTeam !== debate.currentTurn) {
      console.log(`Blocked message: team=${normalizedTeam}, currentTurn=${debate.currentTurn}`);
      socket.emit('errorMessage', 'Not your team\'s turn to speak.');
      return;
    }

    const userCount = normalizedTeam === 'for'
      ? debate.forCounts[userId] || 0
      : debate.againstCounts[userId] || 0;

    if (userCount >= 2) {
      socket.emit('errorMessage', 'You have used both your chances.');
      return;
    }

    // Store message and broadcast
    if (normalizedTeam === 'for') {
      debate.forCounts[userId] = userCount + 1;
    } else {
      debate.againstCounts[userId] = userCount + 1;
    }

    debate.messages.push({ userId, team: normalizedTeam, message });
    io.to(room).emit('newMessage', { userId, team: normalizedTeam, message });

    // Switch turn
    debate.currentTurn = normalizedTeam === 'for' ? 'against' : 'for';
    io.to(room).emit('turn-change', debate.currentTurn);

    // Restart timer
    startTimerForRoom(room);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
