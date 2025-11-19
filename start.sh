#!/bin/bash

# 🚀 Intelligent Quiz Application - Quick Start Script
# This script helps verify and start all services

echo "================================================"
echo "🎓 Intelligent Quiz Application - Quick Start"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Ollama is installed
echo "1️⃣  Checking Ollama installation..."
if command -v ollama &> /dev/null; then
    echo -e "${GREEN}✅ Ollama is installed${NC}"
    ollama --version
else
    echo -e "${RED}❌ Ollama is NOT installed${NC}"
    echo ""
    echo "Install Ollama with:"
    echo "curl -fsSL https://ollama.com/install.sh | sh"
    echo ""
    exit 1
fi

echo ""

# Check if model is downloaded
echo "2️⃣  Checking llama3.2:1b model..."
if ollama list | grep -q "llama3.2"; then
    echo -e "${GREEN}✅ llama3.2 model is downloaded${NC}"
else
    echo -e "${YELLOW}⚠️  llama3.2 model not found${NC}"
    echo ""
    read -p "Download llama3.2:1b now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ollama pull llama3.2:1b
    else
        echo "Please download the model manually: ollama pull llama3.2:1b"
        exit 1
    fi
fi

echo ""

# Check if Ollama is running
echo "3️⃣  Checking if Ollama service is running..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama service is running${NC}"
else
    echo -e "${YELLOW}⚠️  Ollama service is not running${NC}"
    echo ""
    read -p "Start Ollama now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting Ollama in background..."
        ollama serve > /dev/null 2>&1 &
        sleep 3
        if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Ollama started successfully${NC}"
        else
            echo -e "${RED}❌ Failed to start Ollama${NC}"
            exit 1
        fi
    else
        echo "Please start Ollama manually: ollama serve"
        exit 1
    fi
fi

echo ""

# Check Node.js dependencies
echo "4️⃣  Checking Node.js dependencies..."
if [ -d "node_modules" ] && [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies are installed${NC}"
else
    echo -e "${YELLOW}⚠️  Dependencies not fully installed${NC}"
    echo ""
    read -p "Install dependencies now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing root dependencies..."
        npm install --legacy-peer-deps
        echo "Installing backend dependencies..."
        cd backend && npm install && cd ..
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        echo "Please install dependencies manually:"
        echo "  npm install --legacy-peer-deps"
        echo "  cd backend && npm install"
        exit 1
    fi
fi

echo ""
echo "================================================"
echo -e "${GREEN}✅ All checks passed!${NC}"
echo "================================================"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "3. Test Ollama integration:"
echo "   curl http://localhost:5000/api/ai/questions/test-ollama"
echo ""
echo "📚 For more help, see:"
echo "   - OLLAMA_SETUP.md (Ollama installation guide)"
echo "   - TRANSFER_README.md (Complete setup guide)"
echo "   - OLLAMA_INTEGRATION_GUIDE.md (Technical details)"
echo ""
echo "Happy teaching! 🎓✨"
