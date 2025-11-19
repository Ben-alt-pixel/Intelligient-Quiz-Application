# 🤖 AI-Powered Question Generation - Transfer Checklist

## ✅ What's Ready to Transfer

Your friend will receive a **complete AI-powered quiz system** that:

- ✅ Extracts text from PDF, DOCX, and TXT files automatically
- ✅ Generates intelligent quiz questions using local Ollama AI (llama3.2:1b)
- ✅ Works **100% offline** after initial setup (no internet needed!)
- ✅ Falls back gracefully if Ollama isn't available
- ✅ Includes comprehensive setup guides

## 📦 What to Transfer

Transfer the entire project folder to your friend. Everything is ready!

## 🚀 Setup Instructions for Your Friend

### Step 1: Install System Dependencies (One-time)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download the AI model (1.3GB, needs internet)
ollama pull llama3.2:1b

# Verify installation
ollama list
# Should show: llama3.2:1b
```

### Step 2: Install Project Dependencies

```bash
# In the root folder
npm install --legacy-peer-deps

# In the backend folder
cd backend
npm install
```

### Step 3: Setup Database

```bash
cd backend

# Create .env file with database credentials
# (Copy from existing .env or create new)

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Step 4: Start Services

**Terminal 1 - Start Ollama:**

```bash
ollama serve
```

Keep this running!

**Terminal 2 - Start Backend:**

```bash
cd backend
npm run dev
```

**Terminal 3 - Start Frontend:**

```bash
# From root directory
npm run dev
```

### Step 5: Test Everything

```bash
# Test Ollama connection
curl http://localhost:11434/api/tags

# Test AI endpoint
curl http://localhost:5000/api/ai/questions/test-ollama
```

Expected response:

```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Ollama is working correctly! 🎉",
    "model": "llama3.2:1b"
  }
}
```

## 🎯 How to Use

### For Lecturers:

1. **Upload Material:**

   - Go to "Materials" page
   - Click "Upload Material"
   - Select PDF, DOCX, or TXT file
   - System automatically extracts text ✨

2. **Generate AI Questions:**

   - Go to "AI Questions" page
   - Select uploaded material
   - Choose:
     - Number of questions (3-10 recommended)
     - Difficulty (EASY/MEDIUM/HARD)
     - Quiz to add questions to
   - Click "Generate Questions"
   - Wait 30-90 seconds (AI is thinking! 🧠)
   - Review and edit generated questions

3. **Use in Quiz:**
   - Generated questions automatically added to quiz
   - Can edit/delete questions as needed
   - Assign quiz to students as normal

## 📖 Documentation Files

Your friend should read these in order:

1. **`OLLAMA_SETUP.md`** - Complete Ollama installation guide
2. **`OLLAMA_INTEGRATION_GUIDE.md`** - Technical details and troubleshooting
3. **`backend/SETUP_INSTRUCTIONS.md`** - Backend setup (if exists)

## 🔍 How to Verify It's Working

### ✅ Checklist:

- [ ] Ollama installed: `ollama --version`
- [ ] Model downloaded: `ollama list` shows llama3.2:1b
- [ ] Ollama running: `curl http://localhost:11434/api/tags` works
- [ ] Backend logs show: `✅ Ollama is available with llama3.2 model`
- [ ] Can upload materials (PDF/DOCX/TXT)
- [ ] Text is extracted from uploaded files
- [ ] Can generate questions from materials
- [ ] Questions are relevant to content
- [ ] Questions have 4 options and explanations

## 🐛 Common Issues

### "Command 'ollama' not found"

**Solution:** Ollama not installed. Run installation script again:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### "Ollama service is not available"

**Solution:** Ollama not running. Start it:

```bash
ollama serve
```

### "Model llama3.2 not found"

**Solution:** Model not downloaded:

```bash
ollama pull llama3.2:1b
```

### Questions taking too long (>2 minutes)

**Normal:** First generation can be slow
**Solutions:**

- Reduce number of questions to 3-5
- Use shorter documents
- Make sure no other heavy apps are running

### Questions not related to content

**Solutions:**

- Ensure document has clear structure
- Try MEDIUM difficulty instead of HARD
- Break very long documents into sections
- Check that text extraction worked (view material in database)

## 💻 System Requirements

**Minimum:**

- 4GB RAM
- 5GB free disk space
- Linux/Ubuntu (recommended) or macOS
- Internet (only for initial setup)

**Recommended:**

- 8GB RAM
- 10GB free disk space
- SSD for faster generation

**Note:** Windows users may need WSL2

## 📁 Important Files (Don't Delete!)

```
backend/src/services/
├── document-processing-service.ts  ← Extracts text from files
├── ollama-question-service.ts      ← Generates questions with AI
├── ai-question-service.ts          ← Orchestrates generation
└── material-service.ts             ← Handles file uploads

backend/src/utils/
└── ai-helper.ts                    ← AI integration logic

OLLAMA_SETUP.md                     ← Setup guide
OLLAMA_INTEGRATION_GUIDE.md         ← Technical reference
```

## 🎓 Usage Tips

### For Best Questions:

1. Upload well-structured content (clear headings, paragraphs)
2. Start with 3-5 questions per generation
3. Use MEDIUM difficulty first, adjust as needed
4. Review and edit AI-generated questions
5. Provide feedback by editing questions

### For Best Performance:

1. Keep Ollama running in background
2. Generate during low-system-usage times
3. Use shorter documents (<3000 words)
4. Close heavy applications during generation

## 🔒 Privacy & Security

✅ **All AI processing happens locally** on your machine
✅ **No data is sent to external servers**
✅ **Works completely offline** after setup
✅ **Your materials stay private**

## 🆘 Getting Help

If something doesn't work:

1. **Check Ollama Status:**

   ```bash
   systemctl status ollama  # If using systemd service
   # OR
   ps aux | grep ollama     # Check if running
   ```

2. **Check Backend Logs:**
   Look for error messages or Ollama connection status

3. **Test Ollama Directly:**

   ```bash
   ollama run llama3.2:1b "Generate a quiz question about photosynthesis"
   ```

4. **Restart Everything:**

   ```bash
   # Kill Ollama
   killall ollama

   # Restart
   ollama serve &

   # Restart backend
   cd backend && npm run dev
   ```

## 🎉 Success Indicators

Your friend will know it's working when they see:

✅ Backend console: `✅ Ollama is available with llama3.2 model`
✅ Can upload PDF/DOCX files
✅ Text appears in materials after upload
✅ "Generate Questions" button works
✅ Questions are generated (30-90 seconds)
✅ Questions make sense and relate to content
✅ Each question has 4 options and explanation

## 📞 Quick Commands Reference

```bash
# Start Ollama
ollama serve

# Check Ollama status
curl http://localhost:11434/api/tags

# Test a model
ollama run llama3.2:1b "Hello"

# List installed models
ollama list

# Download a model
ollama pull llama3.2:1b

# Remove a model (if needed)
ollama rm llama3.2:1b

# Check Ollama version
ollama --version
```

---

## 🚀 You're All Set!

Everything is configured and ready to transfer. Your friend just needs to:

1. Install Ollama
2. Pull the model
3. Start Ollama service
4. Run npm install
5. Start the servers

**The AI will automatically handle document processing and question generation!**

Good luck! 🎓✨
