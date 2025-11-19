import { prisma } from "@/config/database";
import { z } from "zod";
import { DocumentProcessingService } from "./document-processing-service";

const CreateMaterialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(), // Make optional since we can extract from file
  fileType: z.enum(["pdf", "docx", "txt"]),
});

export class MaterialService {
  static async createMaterial(
    lecturerId: string,
    data: z.infer<typeof CreateMaterialSchema>,
    fileUrl?: string,
    filePath?: string
  ) {
    CreateMaterialSchema.parse(data);

    let content = data.content || "";

    // If a file was uploaded and no content provided, extract text from the file
    if (filePath && !data.content) {
      try {
        const extractedData =
          await DocumentProcessingService.extractTextFromDocument(filePath);
        content = extractedData.text;

        // Log extraction success
        console.log(
          `✅ Extracted ${extractedData.text.length} characters from ${extractedData.fileType} file`
        );
      } catch (error: any) {
        console.error("Error extracting text from document:", error);
        // Continue with empty content rather than failing
        content = "Content extraction failed. Please provide text manually.";
      }
    }

    const material = await prisma.material.create({
      data: {
        title: data.title,
        description: data.description,
        content: content,
        fileUrl,
        fileType: data.fileType,
        lecturerId,
      },
    });

    return material;
  }

  static async getMaterials(lecturerId: string) {
    return await prisma.material.findMany({
      where: { lecturerId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getMaterialById(id: string) {
    return await prisma.material.findUnique({
      where: { id },
    });
  }

  static async deleteMaterial(id: string) {
    return await prisma.material.delete({
      where: { id },
    });
  }
}
