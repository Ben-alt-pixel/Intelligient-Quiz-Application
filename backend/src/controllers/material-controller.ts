import { Request, Response, NextFunction } from "express"
import { MaterialService } from "@/services/material-service"
import { formatResponse, formatError } from "@/utils/response-formatter"
import { AuthRequest } from "@/middlewares/auth"

export class MaterialController {
  static async createMaterial(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const fileUrl = req.file ? `/uploads/materials/${req.file.filename}` : undefined
      const material = await MaterialService.createMaterial(req.user!.id, req.body, fileUrl)
      res.status(201).json(formatResponse(true, material, "Material created successfully", 201))
    } catch (error: any) {
      next(error)
    }
  }

  static async getMaterials(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const materials = await MaterialService.getMaterials(req.user!.id)
      res.status(200).json(formatResponse(true, materials))
    } catch (error: any) {
      next(error)
    }
  }

  static async getMaterialById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const material = await MaterialService.getMaterialById(req.params.id)
      if (!material) {
        return res.status(404).json(formatError("Material not found", 404))
      }
      res.status(200).json(formatResponse(true, material))
    } catch (error: any) {
      next(error)
    }
  }

  static async deleteMaterial(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await MaterialService.deleteMaterial(req.params.id)
      res.status(200).json(formatResponse(true, null, "Material deleted successfully"))
    } catch (error: any) {
      next(error)
    }
  }
}
