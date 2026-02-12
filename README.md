<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge&logo=mongodb" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/Socket.IO-Real--Time-black?style=for-the-badge&logo=socket.io" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
</p>

# ⚔️ Debatify

**A real-time structured debate platform** where users join teams, qualify through quizzes, and engage in organized debates with turn-based argumentation.

> Dive into real-world debates, challenge your knowledge with quizzes, and stay ahead with the latest news.

---

## ✨ Key Features

### 🏟️ Structured Debate System
- **Team Selection** — Choose to argue **FOR** or **AGAINST** a topic
- **Qualifying Quiz** — Pass a topic-specific quiz (3/5 score) to enter the debate
- **Waiting Lobby** — Real-time lobby with countdown timer before the debate begins
- **Live Debate Room** — Real-time messaging with Socket.IO, turn-based argumentation

### 🎯 Turn Management
- Each participant gets **2 turns** to present their arguments
- Visual **"Turns Left: X/2"** indicator in the HUD
- Input automatically **disables** when turns are exhausted
- Debate **auto-concludes** when all participants have spoken

### ⭐ Post-Debate Experience
- **Conclusion Overlay** — Animated summary with argument counts per team
- **Star Rating System** — 5-star feedback with hover glow effects
- Auto-redirect to home after feedback submission

### 📰 News Feed
- Live news powered by **NewsAPI** with Technology & Business categories
- Sub-filters: Tesla, AI, Crypto, Apple, Elon Musk, DOGE
- Business news by country (US, India, UK, Japan)
- Search, refresh, and "Discuss This" links to debate topics

### 🔐 Authentication
- JWT-based signup/login with **bcrypt** password hashing
- Auth-aware UI — buttons, navbar, and routes adapt to login state
- Protected routes for debate flow (Quiz → Lobby → Debate Room)

### 🎨 Premium UI/UX
- **Glassmorphic design** with animated backgrounds
- **Framer Motion** animations throughout
- Responsive layout (mobile + desktop)
- Dark theme with gradient accents

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion |
| **Backend** | Node.js, Express 5, Socket.IO |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT + bcryptjs |
| **Real-Time** | Socket.IO (WebSockets) |
| **News** | NewsAPI.org |

---

## 📁 Project Structure

```
Debatify/
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Navbar, AboutSection, AnimatedBackground
│   │   ├── config/
│   │   │   └── api.js          # Centralized API URL config
│   │   ├── pages/              # All page components
│   │   │   ├── Home.jsx        # Landing page with hero + about
│   │   │   ├── NewsFeed.jsx    # News browsing with filters
│   │   │   ├── JoinDebate.jsx  # Team selection (FOR/AGAINST)
│   │   │   ├── QualifyingQuiz.jsx  # Pre-debate quiz
│   │   │   ├── DebateLobby.jsx # Waiting room with countdown
│   │   │   ├── DebateRoom.jsx  # Live debate with Socket.IO
│   │   │   ├── Login.jsx       # Authentication
│   │   │   └── Signup.jsx      # Registration
│   │   └── auth.jsx            # Route guards (PrivateRoute/PublicRoute)
│   ├── .env.example            # Frontend env template
│   └── vercel.json             # Vercel SPA routing config
│
├── server/                     # Express + Socket.IO backend
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes (auth, news, quiz, debate)
│   ├── server.js               # Main server + Socket.IO handlers
│   └── .env.example            # Backend env template
│
├── render.yaml                 # Render deployment config
└── package.json                # Root scripts (concurrently)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))
- **NewsAPI Key** (free at [newsapi.org](https://newsapi.org))

### 1. Clone the repository
```bash
git clone https://github.com/AnshumanS7/Debatify.git
cd Debatify
```

### 2. Install dependencies
```bash
# Root (concurrently)
npm install

# Frontend
cd frontend && npm install

# Backend
cd ../server && npm install
```

### 3. Configure environment variables

**Backend** — Create `server/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>
JWT_SECRET=your_jwt_secret_here
NEWS_API_KEY=your_news_api_key_here
PORT=5000
```

**Frontend** — Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_NEWS_API_KEY=your_news_api_key_here
```

### 4. Run the application
```bash
# From root directory — starts both server and frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 🌐 Deployment

### Frontend → Vercel
1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add env variable: `VITE_API_URL` = your backend URL
4. Deploy

### Backend → Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add env variables: `MONGO_URI`, `JWT_SECRET`, `NEWS_API_KEY`, `FRONTEND_URL`

> A `render.yaml` is included for one-click deployment via Render Blueprints.

---

## 🔄 Debate Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────┐     ┌──────────────┐
│  Select a Team  │ ──▶ │ Qualifying Quiz  │ ──▶ │ Debate Lobby  │ ──▶ │ Debate Room  │
│  (FOR/AGAINST)  │     │ (Score ≥ 3/5)    │     │ (Countdown)   │     │ (2 Turns)    │
└─────────────────┘     └──────────────────┘     └───────────────┘     └──────┬───────┘
                                                                              │
                                                                              ▼
                                                                    ┌──────────────────┐
                                                                    │ Debate Concluded  │
                                                                    │ + Star Rating     │
                                                                    └──────────────────┘
```

---

## 📜 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/news` | Fetch news articles |
| `GET` | `/api/news/:id` | Get specific article |
| `GET` | `/api/quiz` | Get quiz questions |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinDebate` | Client → Server | Join a debate room |
| `sendMessage` | Client → Server | Send an argument |
| `endDebate` | Client → Server | Manually end debate |
| `turn-change` | Server → Client | Turn switched + counts |
| `timer-update` | Server → Client | Countdown tick |
| `newMessage` | Server → Client | New argument broadcast |
| `debate-ended` | Server → Client | Debate concluded |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/AnshumanS7">Anshuman</a>
</p>