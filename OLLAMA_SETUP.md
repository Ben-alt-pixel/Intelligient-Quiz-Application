# 🚀 Ollama AI Question Generator Setup Guide

This application uses **Ollama** with **llama3.2:1b** to automatically generate quiz questions from uploaded materials (PDF, DOCX, TXT files).

## 📋 Prerequisites

- Ubuntu/Linux system (recommended)
- At least 4GB RAM
- At least 5GB free disk space

## 🔧 Installation Steps

### 1. Install Ollama

```bash
# Download and install Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull the llama3.2:1b Model

```bash
# Download the model (this will take a few minutes)
ollama pull llama3.2:1b
```

### 3. Start Ollama Service

```bash
# Start Ollama server
ollama serve
```

**Important:** Keep this terminal open! Ollama must be running for question generation to work.

### 4. Verify Installation

Open a new terminal and run:

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Test the model
ollama run llama3.2:1b "Hello, can you help me?"
```

If you see a response, Ollama is working! 🎉

## 🎯 How to Use

### Automatic Startup (Recommended)

To make Ollama start automatically on system boot:

```bash
# Create systemd service
sudo nano /etc/systemd/system/ollama.service
```

Paste this content:

```ini
[Unit]
Description=Ollama AI Service
After=network.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=YOUR_USERNAME
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Replace `YOUR_USERNAME` with your actual username, then:

```bash
# Enable and start the service
sudo systemctl enable ollama
sudo systemctl start ollama

# Check status
sudo systemctl status ollama
```

### Manual Startup

If you prefer to start Ollama manually:

```bash
# Start Ollama (run this every time you restart your computer)
ollama serve &
```

## 📚 Using the Application

1. **Start Backend Server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Upload Material:**

   - Log in as a lecturer
   - Go to Materials page
   - Upload a PDF, DOCX, or TXT file
   - The system will automatically extract text from the file

3. **Generate Questions:**
   - Go to AI Questions page
   - Select your uploaded material
   - Choose number of questions and difficulty
   - Click "Generate"
   - Ollama will create intelligent questions based on your material!

## 🔍 Troubleshooting

### Ollama Not Running

**Error:** `Ollama service is not available`

**Solution:**

```bash
# Check if Ollama is running
ps aux | grep ollama

# If not running, start it
ollama serve
```

### Model Not Found

**Error:** `llama3.2 model not found`

**Solution:**

```bash
# Re-download the model
ollama pull llama3.2:1b

# Verify it's installed
ollama list
```

### Connection Refused

**Error:** `Cannot connect to Ollama`

**Solution:**

```bash
# Check if Ollama is listening on port 11434
netstat -tulpn | grep 11434

# Restart Ollama
killall ollama
ollama serve
```

### Slow Generation

Llama3.2:1b is a small model, so generation takes 30-60 seconds per batch of questions. This is normal!

**Tips for faster generation:**

- Generate fewer questions at a time (3-5 instead of 10+)
- Use shorter documents (< 3000 characters work best)
- Close other heavy applications

## 🌐 Network Requirements

**Good News:** Once Ollama and the model are installed, **no internet connection is required**! Everything runs locally on your machine.

**Initial Setup:** Internet is only needed for:

- Installing Ollama
- Downloading the llama3.2:1b model (one-time, ~1.3GB)

After setup, you can work completely offline! ✈️

## 📊 Performance Tips

### For Better Question Quality:

- Upload materials with clear, structured content
- Use materials between 500-3000 words
- Choose appropriate difficulty level
- Review and edit generated questions before using in quizzes

### For Faster Processing:

- Start with fewer questions (3-5)
- Break large documents into smaller sections
- Use TXT or DOCX instead of complex PDFs

## 🆘 Getting Help

1. **Check Logs:**

   ```bash
   # Backend logs show Ollama status
   cd backend
   npm run dev
   # Look for "✅ Ollama is available" message
   ```

2. **Test Ollama Directly:**

   ```bash
   ollama run llama3.2:1b "Generate a simple quiz question"
   ```

3. **Restart Everything:**

   ```bash
   # Kill Ollama
   killall ollama

   # Restart Ollama
   ollama serve &

   # Restart backend
   cd backend
   npm run dev
   ```

## 📝 Alternative Models

If llama3.2:1b is too slow or you want better quality:

```bash
# Faster but less accurate (600MB)
ollama pull tinyllama

# Better quality but slower (4.7GB, needs 8GB RAM)
ollama pull llama3.2:3b
```

Then update `backend/src/services/ollama-question-service.ts`:

```typescript
private model: string = "tinyllama"; // or "llama3.2:3b"
```

## ✅ Success Indicators

You'll know everything is working when you see:

✅ Backend console: `✅ Ollama is available with llama3.2 model`
✅ Questions are generated with relevant content
✅ Explanations make sense
✅ Options are plausible and varied

---

**Happy Teaching! 🎓**
