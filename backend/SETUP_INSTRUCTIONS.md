# Backend Setup Instructions

## Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Setup Environment Variables
Create a `.env` file in the root directory:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your configuration:
\`\`\`
DATABASE_URL="mysql://user:password@localhost:3306/intelligent_quiz"
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"
FRONTEND_URL="http://localhost:3000"
OPENAI_API_KEY="your_openai_api_key"
\`\`\`

### 3. Create Database
\`\`\`bash
mysql -u root -p
CREATE DATABASE intelligent_quiz;
\`\`\`

### 4. Setup Prisma
Generate Prisma client:
\`\`\`bash
npm run prisma:generate
\`\`\`

Run migrations:
\`\`\`bash
npm run prisma:migrate
\`\`\`

### 5. Run the Server
\`\`\`bash
npm run dev
\`\`\`

Server will be available at `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register
\`\`\`
POST /api/auth/register
Body: {
  "email": "student@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "regNo": "STU001"
}
\`\`\`

#### Login
\`\`\`
POST /api/auth/login
Body: {
  "emailOrRegNo": "student@example.com",
  "password": "password123"
}
\`\`\`

### Material Endpoints

#### Upload Material
\`\`\`
POST /api/materials/upload (requires LECTURER role)
Headers: Authorization: Bearer <token>
Form Data:
  - file: <file>
  - title: "Chapter 1"
  - description: "Introduction"
  - content: "Material content text"
  - fileType: "pdf|docx|txt"
\`\`\`

#### Get Materials
\`\`\`
GET /api/materials (requires auth, LECTURER only)
Headers: Authorization: Bearer <token>
\`\`\`

### Quiz Endpoints

#### Create Quiz
\`\`\`
POST /api/quizzes (requires LECTURER role)
Headers: Authorization: Bearer <token>
Body: {
  "title": "Quiz 1",
  "description": "First Quiz",
  "duration": 60,
  "passingScore": 60
}
\`\`\`

#### Get My Quizzes
\`\`\`
GET /api/quizzes/my-quizzes (requires LECTURER role)
Headers: Authorization: Bearer <token>
\`\`\`

#### Publish Quiz
\`\`\`
PATCH /api/quizzes/:id/publish (requires LECTURER role)
Headers: Authorization: Bearer <token>
\`\`\`

#### Get Published Quizzes
\`\`\`
GET /api/quizzes/published
\`\`\`

#### Start Quiz Session
\`\`\`
POST /api/quizzes/session/start (requires STUDENT role)
Headers: Authorization: Bearer <token>
Body: {
  "quizId": "quiz_id"
}
\`\`\`

#### Submit Quiz Session
\`\`\`
POST /api/quizzes/session/:id/submit
Body: {
  "studentAnswers": [
    {
      "questionId": "q1",
      "selectedAnswer": "Option A",
      "isCorrect": true
    }
  ]
}
\`\`\`

### AI Question Generation

#### Generate Questions
\`\`\`
POST /api/ai/questions/generate (requires LECTURER role)
Headers: Authorization: Bearer <token>
Body: {
  "materialId": "material_id",
  "numberOfQuestions": 5,
  "difficulty": "MEDIUM",
  "quizId": "quiz_id"
}
\`\`\`

### Results Endpoints

#### Get My Results
\`\`\`
GET /api/results/my-results
Headers: Authorization: Bearer <token>
\`\`\`

#### Get Quiz Results
\`\`\`
GET /api/results/quiz/:quizId
\`\`\`

#### Get Result Details
\`\`\`
GET /api/results/:quizId/:studentId
\`\`\`

### Video Upload

#### Upload Video
\`\`\`
POST /api/videos/upload (requires STUDENT role)
Headers: Authorization: Bearer <token>
Form Data:
  - video: <video_file>
  - sessionId: "session_id"
\`\`\`

## Folder Structure

\`\`\`
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── auth-controller.ts
│   │   ├── user-controller.ts
│   │   ├── material-controller.ts
│   │   ├── quiz-controller.ts
│   │   ├── ai-question-controller.ts
│   │   ├── result-controller.ts
│   │   └── video-controller.ts
│   ├── services/
│   │   ├── auth-service.ts
│   │   ├── material-service.ts
│   │   ├── quiz-service.ts
│   │   ├── ai-question-service.ts
│   │   ├── result-service.ts
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── error-handler.ts
│   │   └── multer.ts
│   ├── routes/
│   │   ├── auth-routes.ts
│   │   ├── user-routes.ts
│   │   ├── material-routes.ts
│   │   ├── quiz-routes.ts
│   │   ├── ai-question-routes.ts
│   │   ├── result-routes.ts
│   │   ├── video-routes.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── response-formatter.ts
│   │   ├── ai-helper.ts
│   │   └── randomization.ts
│   ├── types/
│   │   └── express.d.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── uploads/
│   ├── materials/
│   └── videos/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── SETUP_INSTRUCTIONS.md
\`\`\`

## Notes

- All timestamps are in UTC
- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire based on JWT_EXPIRES_IN
- File uploads are stored in the uploads directory
- All responses follow the standard format with success, data, and error fields
