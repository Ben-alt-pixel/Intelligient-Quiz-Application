# Intelligent Quiz System

A professional academic quiz platform built with Next.js, designed for educators and students to create, administer, and track quiz performance.

## Features

### For Students
- Browse available quizzes
- Take quizzes with real-time countdown timer
- Answer multiple-choice questions
- View quiz results and performance analytics
- Track score history and improvements

### For Lecturers
- Create and manage quizzes with multiple questions
- Set time limits and question content
- Edit existing quizzes
- View detailed student results and statistics
- Track student performance across quizzes
- Delete quizzes when no longer needed

## Technology Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn UI

## Color Scheme

- **Primary**: Deep Burgundy (#5C0E14)
- **Secondary**: Golden Sand (#F0E193)
- **Neutral**: White, grays, and dark variants

## Getting Started

### Installation

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   ├── auth/
│   │   ├── quizzes/
│   │   ├── lecturer/
│   │   └── results/
│   ├── student/
│   │   ├── quiz/
│   │   └── results/
│   ├── lecturer/
│   │   ├── create/
│   │   └── quiz/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── quiz-timer.tsx
│   ├── quiz-progress-indicator.tsx
│   └── result-badge.tsx
├── lib/
│   ├── constants.ts
│   ├── quiz-utils.ts
│   ├── types.ts
│   └── utils.ts
└── public/
\`\`\`

## Authentication

Users can register as either:
- **Student**: Access to take quizzes and view results
- **Lecturer**: Access to create quizzes and view student analytics

### Test Credentials

\`\`\`
Student:
Email: student@test.com
Password: password

Lecturer:
Email: lecturer@test.com
Password: password
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Quizzes
- `GET /api/quizzes` - Get all available quizzes
- `GET /api/quizzes/[id]` - Get quiz details
- `POST /api/lecturer/quizzes` - Create new quiz
- `PUT /api/lecturer/quizzes/[id]` - Update quiz
- `DELETE /api/lecturer/quizzes/[id]` - Delete quiz

### Results
- `GET /api/results` - Get user's quiz results
- `POST /api/results` - Submit quiz answers
- `GET /api/lecturer/quiz/[id]/results` - Get quiz results for lecturer

## Features Overview

### Quiz Creation
- Rich question creation with multiple-choice options
- Set correct answers with radio buttons
- Define time limits for quizzes
- Add descriptions and metadata

### Quiz Taking
- Real-time countdown timer with visual warnings
- Progress tracking with percentage display
- Question navigation with visual indicators
- Automatic submission when time expires

### Results & Analytics
- Instant score calculation
- Percentage-based grading
- Historical result tracking
- Student performance analytics for lecturers
- Average score calculations

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/intelligent-quiz-system)

Or manually:

\`\`\`bash
npm run build
npm run start
\`\`\`

## Future Enhancements

- Database integration (Supabase/PostgreSQL)
- Student roster management
- Question bank and categories
- Different question types (short answer, essay, etc.)
- Quiz scheduling
- Automated grading rules
- Email notifications
- Export results to CSV/PDF
- Mobile app

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.
