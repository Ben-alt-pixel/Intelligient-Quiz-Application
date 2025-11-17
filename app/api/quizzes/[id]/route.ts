import { type NextRequest, NextResponse } from "next/server"

// Mock quiz questions database
const quizzes: Record<string, any> = {
  "1": {
    id: "1",
    title: "Introduction to Biology",
    timeLimit: 15,
    questions: [
      {
        id: "q1",
        text: "What is the smallest unit of life?",
        options: ["Atom", "Cell", "Molecule", "Organism"],
      },
      {
        id: "q2",
        text: "Which organelle is responsible for energy production?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Vacuole"],
      },
      {
        id: "q3",
        text: "What is the process by which plants make food?",
        options: ["Respiration", "Photosynthesis", "Fermentation", "Decomposition"],
      },
      {
        id: "q4",
        text: "Which of the following is NOT a kingdom of life?",
        options: ["Animalia", "Plantae", "Bacteria", "Mineralia"],
      },
      {
        id: "q5",
        text: "What do we call the study of organisms and their environment?",
        options: ["Biology", "Ecology", "Botany", "Zoology"],
      },
      {
        id: "q6",
        text: "Which protein is responsible for carrying oxygen in blood?",
        options: ["Hemoglobin", "Collagen", "Keratin", "Elastin"],
      },
      {
        id: "q7",
        text: "How many chromosomes do humans have?",
        options: ["23", "46", "92", "32"],
      },
      {
        id: "q8",
        text: "What is the basic unit of heredity?",
        options: ["Chromosome", "Gene", "DNA", "Protein"],
      },
      {
        id: "q9",
        text: "Which type of blood cell fights infections?",
        options: ["Red blood cells", "White blood cells", "Platelets", "Plasma cells"],
      },
      {
        id: "q10",
        text: "What is the pH of a neutral solution?",
        options: ["0", "7", "14", "1"],
      },
    ],
  },
  "2": {
    id: "2",
    title: "World History - 20th Century",
    timeLimit: 20,
    questions: [
      {
        id: "q1",
        text: "In which year did World War I begin?",
        options: ["1912", "1914", "1916", "1918"],
      },
      {
        id: "q2",
        text: "Who was the first President of the United States?",
        options: ["John Adams", "George Washington", "Thomas Jefferson", "Benjamin Franklin"],
      },
    ],
  },
  "3": {
    id: "3",
    title: "Mathematics - Calculus Basics",
    timeLimit: 18,
    questions: [
      {
        id: "q1",
        text: "What is the derivative of x²?",
        options: ["x", "2x", "x³", "2"],
      },
      {
        id: "q2",
        text: "What is the limit of 1/x as x approaches infinity?",
        options: ["1", "0", "Infinity", "Undefined"],
      },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quiz = quizzes[id]

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
  }

  return NextResponse.json({ quiz })
}
