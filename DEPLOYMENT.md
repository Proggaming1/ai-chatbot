# DEPLOYMENT.md - Panduan Lengkap Deploy ke Internet 🚀

## Local Development

### Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Buka http://localhost:3000

---

## Production Deployment (GRATIS!)

### Step 1: Get Together AI API Key

1. Buka https://www.together.ai/
2. Sign up (gratis, tanpa kartu kredit)
3. Go to dashboard → API Keys
4. Copy your API key
5. Dapatkan **1,000,000 tokens/month GRATIS** 🎉

### Step 2: Deploy Backend ke Render (GRATIS)

**Persiapan:**
- Push code ke GitHub
- Pastikan `backend/requirements.txt` ada

**Deploy:**
1. Buka https://render.com
2. Sign up dengan GitHub
3. Click "New +" → "Web Service"
4. Pilih repository Anda
5. Isi setting:
   - **Name**: `ai-chatbot-backend`
   - **Environment**: `Python 3.10`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

6. Click "Environment" → Add variables:
   - **Key**: `TOGETHER_AI_API_KEY`
   - **Value**: [Paste your Together AI key]

7. Click "Create Web Service"
8. Tunggu 2-3 menit sampai deploy selesai
9. Copy URL Anda (contoh: `https://ai-chatbot-backend.onrender.com`)

### Step 3: Deploy Frontend ke Vercel (GRATIS)

1. Buka https://vercel.com
2. Sign up dengan GitHub
3. Click "New Project"
4. Import repository Anda
5. Settings:
   - **Framework**: Next.js
   - **Root Directory**: `frontend`

6. Add environment variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: [Your Render URL dari Step 2]
   
7. Click "Deploy"
8. Tunggu deploy selesai (~2 menit)
9. Dapatkan URL Vercel Anda!

---

## Test Deployment

### Test Backend
```bash
curl https://ai-chatbot-backend.onrender.com
```

Output yang diharapkan:
```json
{
  "status": "ok",
  "message": "AI Chatbot API is running",
  "models": ["llama-70b", "llama-8b", "mistral", "qwen"]
}
```

### Test Frontend
Buka URL Vercel Anda di browser → should work!

---

## Troubleshooting

### Backend Error: "Service Unavailable"
- Normal untuk free tier Render (auto-sleep setelah 15 min inactivity)
- Tunggu 20-30 detik untuk cold start
- Solusi: Upgrade ke paid tier ($7/month) untuk always-on

### Frontend Error: "Cannot connect to API"
- Pastikan `NEXT_PUBLIC_API_URL` sudah diset di Vercel
- Cek CORS di backend (sudah configured)
- Clear browser cache (Ctrl+Shift+Del)

### "Invalid API key" error
- Double-check key Anda di Together AI dashboard
- Pastikan key benar di Render environment variables

---

## Free Tier Limits

### Together AI
- **1,000,000 tokens/month** gratis
- = ~100K chat messages
- = ~100K users/month (moderate usage)

### Render
- **750 compute hours/month** gratis
- Auto-sleep setelah 15 min inactivity (cold start 20-30s)
- Cukup untuk 100-1K DAU

### Vercel
- **Unlimited deployments**
- **100GB bandwidth/month**
- **Always fast** (no cold starts)

---

## Scale ke 1M Users (Paid)

Jika mau scale:

1. **Together AI**: $0.50-2 per 1M tokens
   - 1M users = ~$500/month

2. **Render**: $7-12/month untuk production (always-on)

3. **Vercel**: Usually free atau $20/month pro

---

## Next Steps

1. ✅ Deploy backend ke Render
2. ✅ Deploy frontend ke Vercel
3. ✅ Get Together AI key
4. ✅ Update environment variables
5. ✅ Test both URLs
6. ✅ Share dengan dunia! 🌍

Done! Website Anda sekarang live! 🚀
