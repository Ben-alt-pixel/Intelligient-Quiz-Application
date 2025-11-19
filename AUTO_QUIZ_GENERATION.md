# 🚀 Auto-Generate Quiz Feature

## Overview

This feature allows lecturers to automatically generate complete quizzes with AI-powered questions from uploaded materials **with a single click** - no manual quiz creation needed!

## How It Works

### 1. Upload Material (Lecturer Materials Page)

1. Navigate to **Materials** page
2. Click "Add Material" button
3. Select a file (PDF, DOCX, or TXT)
4. Enter title and optional description
5. Click "Upload Material"
6. ✅ Text is automatically extracted and stored

### 2. Auto-Generate Quiz (One Click!)

1. On the Materials page, find your uploaded material
2. Click **"🚀 Auto-Generate Quiz"** button
3. AI will:
   - Create a quiz automatically with title: "Quiz: [Material Name]"
   - Generate 10 MCQ questions using Ollama AI
   - Set default duration: 30 minutes
   - Set default passing score: 70%
   - Save everything to database
4. You'll be redirected to the quiz edit page automatically

### 3. Review & Edit (Optional)

- The quiz edit page opens automatically
- Review all generated questions
- Edit question text, options, or correct answers
- Update quiz title, description, duration, or passing score
- Click "Save Changes" when done

### 4. Publish Quiz

- Quiz is ready for students to take
- No additional steps needed!

## Advanced Options

If you want more control over the generation:

1. Click **"⚙️ Advanced Options"** instead of Auto-Generate
2. Manually set:
   - Number of questions (1-20)
   - Difficulty level (Easy/Medium/Hard)
   - Custom quiz title and description
   - Duration and passing score
3. Generate questions with custom settings

## Technical Details

### Backend Endpoints

**Auto-Generate Quiz**

```
POST /api/ai/questions/auto-generate
Body: {
  materialId: string,
  lecturerId: string,
  numberOfQuestions: number (default: 10),
  difficulty: "EASY" | "MEDIUM" | "HARD" (default: "MEDIUM"),
  duration: number (default: 30 minutes),
  passingScore: number (default: 70%)
}

Response: {
  quiz: {...},
  questions: [...],
  summary: {
    totalQuestions: number,
    difficulty: string,
    duration: number,
    passingScore: number
  }
}
```

### Flow Diagram

```
┌─────────────────┐
│ Upload Material │
└────────┬────────┘
         │ (Text extracted automatically)
         ▼
┌─────────────────────────┐
│ Click "Auto-Generate"   │
└────────┬────────────────┘
         │
         ├─► Create Quiz
         │   (Auto-title, defaults)
         │
         ├─► Generate Questions
         │   (Ollama AI processes content)
         │
         └─► Save to Database
                 │
                 ▼
         ┌───────────────┐
         │ Edit Page     │
         │ (Review/Edit) │
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │ Publish Quiz  │
         └───────────────┘
```

## Benefits

✅ **One-Click Solution**: No manual quiz creation needed
✅ **Fully Automated**: Quiz + Questions generated together
✅ **Intelligent Defaults**: 10 questions, 30 minutes, 70% passing
✅ **Edit Anytime**: Review and modify generated content
✅ **Offline-Capable**: Works with local Ollama installation
✅ **Fast**: Complete quiz ready in under a minute

## Requirements

- Ollama must be running (`ollama serve`)
- Model must be available (`ollama pull llama3.2:1b`)
- Material must have extractable text content
- Backend must be running on port 5000

## Fallback

If Ollama is offline, the system will:

- Show a warning: "AI Offline - Questions will use fallback"
- Generate basic questions from content keywords
- Still create a working quiz (though less intelligent)

## Example

**Before**: Upload → Create Quiz → Set Details → Generate Questions → Add to Quiz → Save
**Now**: Upload → Click "Auto-Generate" → Done! ✨

Time saved: ~5 minutes per quiz
