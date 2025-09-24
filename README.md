# 🎵 Moodify

> *"Tell me how you want to feel, and I'll find the perfect soundtrack for your mood."*

Moodify bridges the gap between how you feel and what you want to hear. Instead of guessing what music matches your mood, simply describe your emotional state in natural language, and our AI will curate a personalized playlist that truly resonates with you.

## The Problem We Solve

Ever struggled to find music that matches your exact mood? Traditional music discovery relies on genres, artists, or vague keywords. But what if you could just say "I want to feel like I'm driving through the mountains at sunset" and get exactly that vibe?

## Live Demo

**[Try Moodify →](https://moodify-search.vercel.app/)**

Sign in with Spotify to test the application.

## Built With

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, NextAuth.js  
**Backend:** FastAPI, Hugging Face Transformers, PyTorch, Uvicorn  
**External:** Spotify Web API, Hugging Face Hub

## Getting Started

### What You'll Need
- **Node.js 18+** - For the frontend React application
- **Python 3.8+** - For the AI backend processing
- **Spotify Developer Account** - [Get one here](https://developer.spotify.com/)
- **Hugging Face Account** - [Sign up here](https://huggingface.co/)

### 1. Set Up the AI Backend
```bash
cd backend
python -m venv hf_model_env
source hf_model_env/bin/activate  # On Windows: hf_model_env\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start downloading the AI model on first run (this might take a few minutes).

### 2. Set Up the Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend will start on your default port (usually 3000).

### 3. Configure Environment Variables
Create `.env.local` in the frontend directory with your credentials:
```env
NEXTAUTH_URL=your-frontend-url
NEXTAUTH_SECRET=your-nextauth-secret-here
SPOTIFY_CLIENT_ID=your-spotify-client-id-here
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret-here
BACKEND_URL=your-backend-url
```

### 4. Set Up Spotify Integration
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App" and fill in the details
3. Add this redirect URI: `your-frontend-url/api/auth/callback/spotify`
4. Copy your Client ID and Client Secret to `.env.local`

> ⚠️ **Important**: Make sure the redirect URI matches exactly, including the protocol (http/https).

## Development

### Backend
```bash
cd backend
source hf_model_env/bin/activate  # On Windows: hf_model_env\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

## Testing It Out
1. Start both servers
2. Visit your frontend URL
3. Sign in with Spotify
4. Try searching: "I want to feel like I'm driving through the mountains"
5. Watch as the AI finds the perfect soundtrack for your mood!

## Common Issues & Solutions

**Backend won't start?**
- Make sure you're using Python 3.8+ and have activated the virtual environment
- Check that all dependencies installed correctly with `pip install -r requirements.txt`

**Spotify authentication issues?**
- Double-check your redirect URI matches exactly (including http/https)
- Verify your Client ID and Secret are correct in `.env.local`
- Try logging out and logging back in - Spotify sessions can sometimes break

**No search results appearing?**
- Ensure the backend is running and accessible
- Check the browser console for any error messages
- Verify your BACKEND_URL in .env.local is correct
- Try refreshing the page

**Frontend build errors?**
- Run `npm install` to ensure all dependencies are installed
- Check that your Node.js version is 18 or higher

---

The application will be available at your frontend URL once both servers are running.
