# Quick Reference: Ollama AI Integration

## 🎯 What Was Implemented

### 1. **Document Processing** (`document-processing-service.ts`)

- Extracts text from PDF, DOCX, and TXT files
- Automatically chunks long documents for better AI processing
- Provides content statistics (word count, reading time, etc.)

### 2. **Ollama Question Generator** (`ollama-question-service.ts`)

- Connects to local Ollama service (llama3.2:1b)
- Generates multiple-choice questions with explanations
- Supports EASY, MEDIUM, and HARD difficulty levels
- Falls back gracefully if Ollama is unavailable

### 3. **Updated AI Helper** (`ai-helper.ts`)

- Uses Ollama for question generation
- Falls back to mock questions if Ollama fails
- Seamless integration with existing code

### 4. **Updated Material Service** (`material-service.ts`)

- Automatically extracts text when files are uploaded
- Works with PDF, DOCX, and TXT formats
- Stores extracted content in database

## 🧪 Testing the Setup

### Test Ollama Connection

```bash
# Option 1: Using curl
curl http://localhost:11434/api/tags

# Option 2: Using the API endpoint (after starting backend)
curl http://localhost:5000/api/ai/questions/test-ollama
```

**Expected Response:**

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

### Test Question Generation

1. Start backend: `cd backend && npm run dev`
2. Upload a material file
3. Go to AI Questions page
4. Click "Generate Questions"

**What to expect:**

- Generation takes 30-90 seconds (normal for local AI)
- Questions are related to the uploaded content
- Each question has 4 options and an explanation

## 📁 Files Modified/Created

### New Files:

- `backend/src/services/document-processing-service.ts` - Text extraction
- `backend/src/services/ollama-question-service.ts` - Ollama integration
- `OLLAMA_SETUP.md` - Setup guide for your friend

### Modified Files:

- `backend/src/services/material-service.ts` - Added document processing
- `backend/src/utils/ai-helper.ts` - Uses Ollama instead of mocks
- `backend/src/controllers/ai-question-controller.ts` - Added test endpoint
- `backend/src/routes/ai-question-routes.ts` - Added test route

## 🔧 Configuration

### Change Ollama Model

Edit `backend/src/services/ollama-question-service.ts`:

```typescript
private model: string = "llama3.2:1b"; // Change to your preferred model
```

Available models:

- `llama3.2:1b` - Fast, good quality (recommended)
- `tinyllama` - Very fast, lower quality
- `llama3.2:3b` - Slower, better quality

### Change Ollama URL

If Ollama runs on a different port/host:

```typescript
private baseUrl: string = "http://localhost:11434"; // Change this
```

### Adjust Question Quality

In `ollama-question-service.ts`, modify temperature:

```typescript
options: {
  temperature: 0.7, // Lower = more focused, Higher = more creative
  top_p: 0.9,
}
```

## 🐛 Common Issues & Solutions

### Issue: "Ollama service is not available"

**Solution:** Run `ollama serve` in a terminal

### Issue: "Model llama3.2 not found"

**Solution:** Run `ollama pull llama3.2:1b`

### Issue: Questions are not relevant to content

**Reasons:**

- Document is too long (>3000 chars gets truncated)
- Content is poorly structured
- Model needs better prompt

**Solutions:**

- Break document into smaller sections
- Ensure clear headings and structure
- Adjust prompt in `createPrompt()` method

### Issue: Generation is very slow

**Normal:** 30-90 seconds per batch is expected
**To speed up:**

- Generate fewer questions (3-5 instead of 10)
- Use shorter documents
- Consider upgrading to tinyllama for speed

## 📊 How It Works

1. **Upload:** Lecturer uploads PDF/DOCX/TXT

   ```
   File → DocumentProcessingService → Extract Text → Save to DB
   ```

2. **Generate:** Click "Generate Questions"

   ```
   Material Content → Chunk Text (if long)
   → Create Prompt → Send to Ollama
   → Parse Response → Save Questions to DB
   ```

3. **Fallback:** If Ollama fails
   ```
   Error → Generate simple mock questions
   → Questions still work, but less intelligent
   ```

## 🎓 For Your Friend

**Step 1:** Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:1b
```

**Step 2:** Start Ollama

```bash
ollama serve
```

**Step 3:** Start backend

```bash
cd backend
npm install
npm run dev
```

**Step 4:** Test it works

```bash
curl http://localhost:5000/api/ai/questions/test-ollama
```

**Step 5:** Use the application!

## 📦 Dependencies Added

```json
{
  "langchain": "^latest",
  "@langchain/community": "^latest",
  "@langchain/ollama": "^latest",
  "@langchain/core": "^latest",
  "pdf-parse": "^latest",
  "mammoth": "^latest",
  "axios": "^latest"
}
```

## 💡 Tips for Best Results

1. **Material Quality:**

   - Use well-structured documents
   - Include clear explanations
   - Avoid very technical jargon

2. **Question Generation:**

   - Start with 3-5 questions first
   - Review and edit generated questions
   - Use appropriate difficulty levels

3. **Performance:**
   - Keep Ollama running in background
   - Close heavy applications during generation
   - Be patient - local AI takes time!

---

**Everything is ready to go! Just need Ollama installed and running. Good luck! 🚀**
