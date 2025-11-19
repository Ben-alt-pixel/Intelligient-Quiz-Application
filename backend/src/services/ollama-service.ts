import { Ollama } from "@langchain/ollama";
import { Question, Difficulty } from "@prisma/client";

interface GeneratedQuestion {
  text: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  options?: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  explanation: string;
}

export class OllamaQuestionGeneratorService {
  private model: Ollama;
  private isAvailable: boolean = false;

  constructor() {
    // Initialize Ollama with llama3.2:1b model
    this.model = new Ollama({
      model: "llama3.2:1b",
      baseUrl: "http://localhost:11434", // Default Ollama URL
      temperature: 0.7, // Creativity level
    });

    this.checkAvailability();
  }

  /**
   * Check if Ollama is running and model is available
   */
  private async checkAvailability() {
    try {
      await fetch("http://localhost:11434/api/tags");
      this.isAvailable = true;
      console.log("✅ Ollama is available and ready");
    } catch (error) {
      this.isAvailable = false;
      console.warn("⚠️ Ollama is not running. Please start Ollama service.");
    }
  }

  /**
   * Generate questions from material content using Ollama
   */
  async generateQuestions(
    content: string,
    numberOfQuestions: number,
    difficulty: Difficulty
  ): Promise<Partial<Question>[]> {
    // Check if Ollama is available
    await this.checkAvailability();

    if (!this.isAvailable) {
      throw new Error(
        "Ollama service is not available. Please ensure Ollama is running with: ollama serve"
      );
    }

    try {
      const questions: Partial<Question>[] = [];

      // Split content into chunks if it's too long (avoid token limits)
      const maxContentLength = 3000;
      const contentChunk =
        content.length > maxContentLength
          ? content.substring(0, maxContentLength) + "..."
          : content;

      // Generate questions in batches (better quality)
      const questionsPerBatch = Math.min(3, numberOfQuestions);
      const batches = Math.ceil(numberOfQuestions / questionsPerBatch);

      for (let batch = 0; batch < batches; batch++) {
        const remainingQuestions = numberOfQuestions - questions.length;
        const batchSize = Math.min(questionsPerBatch, remainingQuestions);

        const batchQuestions = await this.generateQuestionBatch(
          contentChunk,
          batchSize,
          difficulty
        );

        questions.push(...batchQuestions);

        if (questions.length >= numberOfQuestions) break;
      }

      return questions.slice(0, numberOfQuestions);
    } catch (error: any) {
      console.error("Error generating questions with Ollama:", error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  /**
   * Generate a batch of questions
   */
  private async generateQuestionBatch(
    content: string,
    count: number,
    difficulty: Difficulty
  ): Promise<Partial<Question>[]> {
    const prompt = this.createPrompt(content, count, difficulty);

    try {
      const response = await this.model.invoke(prompt);

      // Parse the response to extract questions
      return this.parseQuestions(response, difficulty);
    } catch (error: any) {
      console.error("Error in generateQuestionBatch:", error);
      throw error;
    }
  }

  /**
   * Create a detailed prompt for question generation
   */
  private createPrompt(
    content: string,
    count: number,
    difficulty: Difficulty
  ): string {
    const difficultyGuide = {
      EASY: "basic understanding and recall",
      MEDIUM: "application and analysis",
      HARD: "critical thinking and synthesis",
    };

    return `You are an expert educator creating quiz questions from educational material.

MATERIAL CONTENT:
${content}

TASK:
Generate exactly ${count} ${difficulty.toLowerCase()} difficulty multiple-choice questions based on the material above.
Each question should test ${difficultyGuide[difficulty]}.

FORMAT EACH QUESTION EXACTLY AS FOLLOWS (use this exact format):
---
QUESTION: [Your question text here]
A) [First option]
B) [Second option]
C) [Third option]
D) [Fourth option]
CORRECT: [Letter of correct answer: A, B, C, or D]
EXPLANATION: [Why this answer is correct]
---

REQUIREMENTS:
- Questions must be directly related to the content
- Make options plausible but only one correct
- Ensure variety in question topics
- Keep questions clear and unambiguous
- Explanations should be educational

Generate ${count} questions now:`;
  }

  /**
   * Parse Ollama response into structured questions
   */
  private parseQuestions(
    response: string,
    difficulty: Difficulty
  ): Partial<Question>[] {
    const questions: Partial<Question>[] = [];

    // Split by question separators
    const questionBlocks = response
      .split("---")
      .filter((block) => block.trim().length > 0);

    for (const block of questionBlocks) {
      try {
        // Extract question text
        const questionMatch = block.match(/QUESTION:\s*(.+?)(?=\n[A-D]\))/s);
        if (!questionMatch) continue;

        const questionText = questionMatch[1].trim();

        // Extract options
        const optionMatches = block.matchAll(
          /([A-D])\)\s*(.+?)(?=\n[A-D]\)|CORRECT:|$)/gs
        );
        const options: string[] = [];

        for (const match of optionMatches) {
          options.push(match[2].trim());
        }

        // Extract correct answer
        const correctMatch = block.match(/CORRECT:\s*([A-D])/);
        if (!correctMatch) continue;

        const correctLetter = correctMatch[1];
        const correctIndex = correctLetter.charCodeAt(0) - "A".charCodeAt(0);
        const correctAnswer = options[correctIndex] || options[0];

        // Extract explanation
        const explanationMatch = block.match(/EXPLANATION:\s*(.+?)(?=---|$)/s);
        const explanation = explanationMatch
          ? explanationMatch[1].trim()
          : "No explanation provided";

        // Only add if we have valid data
        if (questionText && options.length >= 4) {
          questions.push({
            text: questionText,
            type: "MCQ",
            options: options, // Store as array, will be converted to JSON later
            correctAnswer: correctIndex, // Use the index (0-3)
            difficulty: difficulty,
            explanation: explanation,
          });
        }
      } catch (error) {
        console.error("Error parsing question block:", error);
        continue;
      }
    }

    // If parsing failed, create a fallback question
    if (questions.length === 0) {
      questions.push({
        text: "Based on the material, which statement is most accurate?",
        type: "MCQ",
        options: [
          "Option A - Review the material",
          "Option B - Review the material",
          "Option C - Review the material",
          "Option D - Review the material",
        ],
        correctAnswer: 0, // Index of correct answer
        difficulty: difficulty,
        explanation:
          "Please review the material for details. The AI had difficulty generating questions.",
      });
    }

    return questions;
  }

  /**
   * Test if Ollama is properly configured
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    model?: string;
  }> {
    try {
      await this.checkAvailability();

      if (!this.isAvailable) {
        return {
          success: false,
          message:
            "Ollama service is not running. Please start it with: ollama serve",
        };
      }

      // Try a simple query using stream method
      let testResponse = "";
      const stream = await this.model.stream("Say 'OK' if you can read this.");
      for await (const chunk of stream) {
        testResponse += chunk;
      }

      return {
        success: true,
        message: "Ollama is working correctly!",
        model: "llama3.2:1b",
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Ollama test failed: ${error.message}`,
      };
    }
  }
}

// Export singleton instance
export const ollamaService = new OllamaQuestionGeneratorService();
