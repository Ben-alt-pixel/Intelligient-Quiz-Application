import { prisma } from "@/config/database"
import { z } from "zod"

const CreateMaterialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
  fileType: z.enum(["pdf", "docx", "txt"]),
})

export class MaterialService {
  static async createMaterial(lecturerId: string, data: z.infer<typeof CreateMaterialSchema>, fileUrl?: string) {
    CreateMaterialSchema.parse(data)

    const material = await prisma.material.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        fileUrl,
        fileType: data.fileType,
        lecturerId,
      },
    })

    return material
  }

  static async getMaterials(lecturerId: string) {
    return await prisma.material.findMany({
      where: { lecturerId },
      orderBy: { createdAt: "desc" },
    })
  }

  static async getMaterialById(id: string) {
    return await prisma.material.findUnique({
      where: { id },
    })
  }

  static async deleteMaterial(id: string) {
    return await prisma.material.delete({
      where: { id },
    })
  }
}
