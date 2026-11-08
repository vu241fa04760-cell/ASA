# EduPulse AI – 3D Futuristic AI Study Assistance Platform (MERN Stack)

> A premium, interactive, and intelligent 3D AI Study Assistance Web Application built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) featuring Three.js, React Three Fiber (R3F), Drei, Framer Motion, GSAP, Recharts, and Google Gemini AI integration.

---

## 🌟 Key Features & 3D Interactive Capabilities

### 1. 🌐 3D Cybernetic Design & Aesthetics
- **Animated 3D AI Brain:** Pulsating distorted wireframe neural sphere with orbiting planetary rings and glowing particle constellations on the Landing Page.
- **Floating 3D Educational Artifacts:** Interactive 3D knowledge crystal, floating cyber book, neural atomic gyroscope, and rotating crystal cube.
- **3D Hologram Avatar:** Interactive torus knot avatar that pulses with an intelligent thinking frequency during AI queries.
- **3D Interactive Card Tilt (`CardTilt3D`):** Realistic physics-based card tilt with mouse-following glare spotlights.
- **Dynamic 60FPS Constellation Particle Field (`ParticleBackground`):** Interactive canvas background with node interconnectivity and subtle mouse repulsion.
- **Cyber SaaS Glassmorphism:** Deep navy (`#080B1A`), Dark purple (`#17112D`), Electric blue (`#6366F1`), Neon purple (`#A855F7`), and Cyan (`#22D3EE`).

### 2. 🔐 User Authentication & Security
- JWT-based authentication with bcrypt.js password hashing.
- Student registration, login, logout, and self-service password reset.
- Demo student auto-fill pill (`alex@studyai.edu` / `password123`) for 1-click evaluation.
- Full student profile customization (grade level, major, institution, bio, study preferences).

### 3. 📊 Futuristic Student Dashboard
- Real-time statistics: Total Study Hours, Completed Topics, Quiz Performance, Learning Progress.
- 3D Holographic Assistant status widget with live system state.
- Interactive **Recharts Area Chart** for weekly learning progress and **Doughnut Chart** for subject distribution.
- Live study planner checklist with 1-click completion toggle.
- Recent study activity feed and AI recommended next topics.
- Pomodoro Focus Timer directly integrated in the navigation bar.

### 4. 🤖 AI Study Assistant (Tutor Copilot)
- Ask complex academic questions across STEM, Humanities, and Engineering.
- Step-by-step academic breakdowns with formatted code blocks and mathematical notation.
- Concept breakdowns and real-world practical examples.
- **"Explain Simply (ELI5)"** mode switch for intuition-first explanations.
- Persistent conversation session history with subject categorization.
- Copy to clipboard and regenerate response buttons.

### 5. 📝 AI Notes Generator
- Generate structured study notes, executive summaries, and key takeaways for any topic.
- 3D Floating knowledge preview card.
- 1-click Markdown (`.md`) download and direct save to MongoDB.
- Full CRUD operations: Pin to top, edit notes in a glassmorphic modal, search, and delete.

### 6. 🎯 AI Quiz Generator & Practice Test Engine
- Topic-based quiz creation with customized difficulty (Easy, Medium, Hard) and question counts.
- Strictly 4 multiple-choice options per question (A, B, C, D).
- Interactive 3D test-taking interface with countdown timer and visual progress bar.
- Instant score calculation, percentage grading, and celebratory confetti burst.
- Detailed question review displaying chosen answers, correct answers, and pedagogical rationales.
- Historical log of previous quiz attempts.

### 7. 📅 Study Planner
- Interactive weekly calendar strip with active day selection.
- Color-coded subjects and priority badges (High, Medium, Low).
- Filter tasks by status (All, Pending, In Progress, Completed).
- 1-click completion toggle with automatic dashboard progress synchronization.
- Modal to create and edit custom study tasks.

### 8. 📄 Document Upload & AI Summarization
- Drag & drop file upload for PDF and TXT study materials.
- Automatic text extraction via `pdf-parse`.
- AI executive summary, 5 essential key takeaways, and flashcard Q&A pairs.
- Interactive "Ask Document" chat tab to interrogate uploaded papers directly.

### 9. 📈 Progress Analytics & Milestone Badges
- Weekly learning minutes bar chart and task completion trend line.
- Subject mastery breakdown with visual completion progress bars.
- Unlocked milestone badges: 5-Day Flame, Quiz Prodigy, Note Scholar, AI Power User.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Three.js, @react-three/fiber, @react-three/drei, Framer Motion, GSAP, Recharts, Tailwind CSS, React Router DOM v6, Axios, Lucide React, Canvas-Confetti |
| **Backend** | Node.js, Express.js, RESTful API, Multer, pdf-parse, CORS, Dotenv |
| **Database** | MongoDB, Mongoose ODM (with automatic resilient memory adapter) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) with intelligent educational engine fallback |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance on `127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Backend Setup
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Verify `backend/.env`:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/ai_study_db
   JWT_SECRET=ai_study_assistant_super_secret_jwt_key_2026_production_ready
   JWT_EXPIRE=30d
   GEMINI_API_KEY=your_gemini_api_key_here
   CLIENT_URL=http://localhost:5173
   ```
3. Seed sample data:
   ```bash
   npm run seed
   ```

**Demo Student Credentials:**
- **Email:** `alex@studyai.edu`
- **Password:** `password123`
*(Or use the 1-click "Auto Fill" button on the Sign-In page).*

### 3. Frontend Setup
1. Navigate to `frontend`:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🏃 Running the Application

### Option A: From the Root Directory
```bash
# Terminal 1: Start Backend Server (runs on http://localhost:5001)
npm run server

# Terminal 2: Start Frontend Vite Server (runs on http://localhost:5173)
npm run client
```

### Option B: From Individual Folders

**Backend:**
```bash
cd backend
npm run dev
# Server running at: http://localhost:5001
# Health Check:      http://localhost:5001/api/health
```

**Frontend:**
```bash
cd frontend
npm run dev
# Vite UI running at: http://localhost:5173
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new student account
- `POST /api/auth/login` - Authenticate user & return JWT
- `POST /api/auth/forgot-password` - Request password reset code
- `POST /api/auth/reset-password` - Set new password with reset code
- `GET  /api/auth/me` - Get authenticated profile
- `PUT  /api/auth/profile` - Update student profile details
- `PUT  /api/auth/update-password` - Change account password

### AI Study Chat (`/api/chat`)
- `POST   /api/chat/message` - Send question to AI tutor (supports simplify mode)
- `GET    /api/chat/sessions` - List user study chat sessions
- `GET    /api/chat/sessions/:id` - Get messages for a session
- `DELETE /api/chat/sessions/:id` - Delete conversation

### Notes Generator (`/api/notes`)
- `POST   /api/notes/generate` - AI generate revision notes
- `GET    /api/notes` - Get all saved notes (filter by subject, search)
- `POST   /api/notes` - Save custom or AI note to MongoDB
- `GET    /api/notes/:id` - Get single note
- `PUT    /api/notes/:id` - Update note content
- `DELETE /api/notes/:id` - Delete note
- `PATCH  /api/notes/:id/pin` - Toggle note pin status

### Quizzes (`/api/quizzes`)
- `POST   /api/quizzes/generate` - AI create 4-option practice quiz
- `GET    /api/quizzes` - List available quizzes
- `GET    /api/quizzes/:id` - Get quiz questions for test-taking
- `POST   /api/quizzes/:id/submit` - Submit answers, calculate score & percentage
- `GET    /api/quizzes/attempts/history` - Get user previous test scores
- `DELETE /api/quizzes/:id` - Remove quiz

### Study Planner (`/api/planner`)
- `GET    /api/planner/tasks` - List tasks (filter by status/priority)
- `POST   /api/planner/tasks` - Create study goal
- `PUT    /api/planner/tasks/:id` - Update task details
- `PATCH  /api/planner/tasks/:id/toggle` - Toggle status (pending/completed)
- `DELETE /api/planner/tasks/:id` - Delete task

### Documents (`/api/documents`)
- `POST   /api/documents/upload` - Upload PDF/TXT & extract AI summary
- `GET    /api/documents` - List uploaded study documents
- `GET    /api/documents/:id` - Get document summary & key takeaways
- `POST   /api/documents/:id/ask` - Ask questions about the uploaded document
- `DELETE /api/documents/:id` - Delete document

### Progress & Dashboard (`/api/progress`)
- `GET  /api/progress/dashboard` - Complete dashboard metrics, charts, & streak
- `POST /api/progress/log-study-time` - Log focus timer minutes

---

## 📁 Project Directory Structure

```
ASA/
├── backend/
│   ├── config/             # Database connection & MongoDB config
│   ├── controllers/        # Express route handler controllers
│   ├── middleware/         # Auth, file upload, error handling
│   ├── models/             # Mongoose schemas (User, Note, Quiz, Task, etc.)
│   ├── routes/             # Express API routes
│   ├── services/           # Gemini AI service & fallback educational engine
│   ├── utils/              # Memory store adapter & seed data scripts
│   ├── uploads/            # Document uploads directory
│   ├── server.js           # Express app entrypoint (Port 5001)
│   └── package.json
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/         # Three.js / R3F Canvas components & particle effects
│   │   │   │   ├── AIBrainScene.jsx
│   │   │   │   ├── FloatingStudyObjectsScene.jsx
│   │   │   │   ├── HologramAvatarScene.jsx
│   │   │   │   ├── CardTilt3D.jsx
│   │   │   │   └── ParticleBackground.jsx
│   │   │   ├── common/     # Badges, modals, cards, loaders
│   │   │   └── navigation/ # Glassmorphic Sidebar & Navbar
│   │   ├── context/        # Auth, Theme (Dark/Light), Toast contexts
│   │   ├── layouts/        # MainLayout (with 3D particles), AuthLayout
│   │   ├── pages/          # 12 Full-featured interactive pages
│   │   ├── services/       # Axios API client services
│   │   ├── App.jsx         # App router configuration
│   │   ├── main.jsx        # React root mounting
│   │   └── index.css       # Tailwind & custom 3D glassmorphic styling
│   ├── tailwind.config.js  # Cyber color palette & glowing drop-shadows
│   ├── vite.config.js      # Vite build & chunk splitting configuration
│   └── package.json
├── package.json            # Root workspace scripts
└── README.md
```

---

## 🎨 UI/UX Features Checklist

- [x] Animated 3D AI Brain with orbiting rings and particles on Landing Page
- [x] Floating 3D educational models (Knowledge Crystal, Cyber Book, Neural Torus)
- [x] 3D Hologram interactive assistant with thinking pulse
- [x] Physics-based mouse tilt with glare reflection (`CardTilt3D`)
- [x] 60FPS particle constellation background
- [x] Dual Dark / Light mode toggle with persistent state
- [x] Recharts Area and Doughnut charts
- [x] Live Pomodoro Focus Timer in Navbar with study session logging
- [x] Confetti celebration effects on quiz completion
- [x] Drag & drop PDF/TXT upload with AI summarization and interactive document Q&A
- [x] 1-Click demo student credentials auto-fill
- [x] Clean chunk splitting for Three.js, R3F, Framer Motion, and Recharts

---

## 📄 License
MIT License. Built for students, developers, and educators.
