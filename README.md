# IOGENIUS ⚡

> AI-powered IoT hardware architect — from a simple prompt to deployable firmware in seconds.

## What is IOGENIUS?

IOGENIUS is a full-stack AI platform that lets you describe an IoT project in plain English and instantly receive:
- **Hardware recommendations** (microcontrollers, sensors, outputs)
- **Auto-generated circuit wiring maps**
- **Production-ready C++ / Python firmware code**
- **Step-by-step IDE & cloud setup guides**

All powered by Google Gemini AI and backed by MongoDB Atlas for persistent user accounts and project history.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Framer Motion |
| Backend | FastAPI (Python) + Motor (async MongoDB) |
| Database | MongoDB Atlas (cloud) |
| AI | Google Gemini 2.5 Flash |
| Auth | JWT + bcrypt password hashing |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/hariharkadhe/iogenius.git
cd iogenius
```

### 2. Setup the backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/iogenius
```

Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Setup the frontend

```bash
cd ..
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Features

- 🧠 **AI Requirement Engine** — extracts hardware & software requirements from a plain text prompt
- 🔌 **Smart Circuit Mapper** — auto-generates pin-by-pin wiring instructions
- 💾 **Cloud Project History** — projects are saved per-user to MongoDB
- 🌗 **Dark / Light Mode** — fully theme-aware UI
- 🛠 **Debug Mode** — paste your hardware errors for AI-assisted diagnosis
- 📡 **WebSerial Flasher** — flash firmware directly from the browser

---

## Project Structure

```
iogenius/
├── backend/           # FastAPI Python backend
│   ├── main.py        # All API routes
│   └── .env           # Environment variables (not committed)
├── src/
│   ├── pages/         # React page components
│   ├── components/    # Reusable UI components
│   ├── AuthContext.jsx
│   └── index.css      # Global design system
├── public/
└── index.html
```

---

## License

MIT — built by Harihar Manohar Kadhe
