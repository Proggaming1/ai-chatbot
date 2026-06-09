# 🤖 Multi-Model AI Chatbot

Website AI chatbot dengan multiple model LLM, powered by Together AI (gratis!)

## Features
- 🎯 Chat dengan LLaMA 3.1 70B
- 💻 Code generation & explanation
- 🎮 Fun conversations & games
- 📝 Markdown rendering
- 💾 Chat history (localStorage)
- ⚡ Real-time streaming responses
- 🌐 Deploy gratis (Vercel + Render)

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Python FastAPI
- **AI Model**: LLaMA 3.1 70B via Together AI
- **Hosting**: Vercel (frontend), Render (backend)

## Quick Start

1. **Clone & Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Setup Frontend**
```bash
cd frontend
npm install
```

3. **Create .env files** (see .env.example)

4. **Run locally**
```bash
# Terminal 1 - Backend
cd backend && uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open http://localhost:3000

## Deploy (FREE!)

See DEPLOYMENT.md for complete guide:
- **Render** (Backend)
- **Vercel** (Frontend)
- **Together AI** (1M tokens/month free)

## License
MIT
