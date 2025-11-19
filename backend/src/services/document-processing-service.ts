import fs from "fs";
import path from "path";
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";

interface ExtractedContent {
  text: string;
  fileType: string;
  pageCount?: number;
}

export class DocumentProcessingService {
  /**
   * Extract text content from uploaded documents
   * Supports: PDF, DOCX, TXT
   */
  static async extractTextFromDocument(
    filePath: string
  ): Promise<ExtractedContent> {
    const ext = path.extname(filePath).toLowerCase();

    try {
      switch (ext) {
        case ".pdf":
          return await this.extractFromPDF(filePath);
        case ".docx":
          return await this.extractFromDOCX(filePath);
        case ".txt":
          return await this.extractFromTXT(filePath);
        default:
          throw new Error(`Unsupported file type: ${ext}`);
      }
    } catch (error) {
      console.error("Error extracting text from document:", error);
      throw new Error(`Failed to extract text from ${ext} file`);
    }
  }

  /**
   * Extract text from PDF files
   */
  private static async extractFromPDF(
    filePath: string
  ): Promise<ExtractedContent> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    return {
      text: data.text,
      fileType: "pdf",
      pageCount: data.numpages,
    };
  }

  /**
   * Extract text from DOCX files
   */
  private static async extractFromDOCX(
    filePath: string
  ): Promise<ExtractedContent> {
    const result = await mammoth.extractRawText({ path: filePath });

    return {
      text: result.value,
      fileType: "docx",
    };
  }

  /**
   * Extract text from TXT files
   */
  private static async extractFromTXT(
    filePath: string
  ): Promise<ExtractedContent> {
    const text = fs.readFileSync(filePath, "utf-8");

    return {
      text,
      fileType: "txt",
    };
  }

  /**
   * Chunk text into smaller pieces for better AI processing
   * This helps avoid token limits and improves question generation quality
   */
  static chunkText(
    text: string,
    chunkSize: number = 2000,
    overlap: number = 200
  ): string[] {
    const chunks: string[] = [];
    let start = 0;

    // Clean up text
    const cleanText = text.replace(/\s+/g, " ").trim();

    while (start < cleanText.length) {
      const end = Math.min(start + chunkSize, cleanText.length);
      let chunk = cleanText.substring(start, end);

      // Try to break at sentence boundary
      if (end < cleanText.length) {
        const lastPeriod = chunk.lastIndexOf(".");
        const lastQuestion = chunk.lastIndexOf("?");
        const lastExclamation = chunk.lastIndexOf("!");
        const lastBreak = Math.max(lastPeriod, lastQuestion, lastExclamation);

        if (lastBreak > chunk.length * 0.5) {
          chunk = chunk.substring(0, lastBreak + 1);
          start += lastBreak + 1;
        } else {
          start = end;
        }
      } else {
        start = end;
      }

      chunks.push(chunk.trim());

      // Apply overlap for context continuity
      start = Math.max(0, start - overlap);
    }

    return chunks;
  }

  /**
   * Get summary statistics about extracted content
   */
  static getContentStats(text: string) {
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);

    return {
      characterCount: text.length,
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      estimatedReadingTime: Math.ceil(words.length / 200), // minutes
    };
  }
}
