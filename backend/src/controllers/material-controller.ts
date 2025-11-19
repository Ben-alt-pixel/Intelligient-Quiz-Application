import { Request, Response, NextFunction } from "express";
import { MaterialService } from "@/services/material-service";
import { formatResponse, formatError } from "@/utils/response-formatter";
import { AuthRequest } from "@/middlewares/auth";
import path from "path";

export class MaterialController {
  static async createMaterial(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        return res.status(400).json(formatError("No file uploaded", 400));
      }

      const fileUrl = `/uploads/materials/${req.file.filename}`;
      const filePath = req.file.path;

      // Determine file type from extension
      const ext = path.extname(req.file.originalname).toLowerCase();
      const fileTypeMap: { [key: string]: "pdf" | "docx" | "txt" } = {
        ".pdf": "pdf",
        ".docx": "docx",
        ".txt": "txt",
      };
      const fileType = fileTypeMap[ext] || "txt";

      // Prepare material data with extracted title and file type
      const materialData = {
        title: req.body.title || req.file.originalname.replace(/\.[^/.]+$/, ""),
        description: req.body.description || "",
        content: req.body.content || "", // Will be extracted from file if empty
        fileType,
      };

      const material = await MaterialService.createMaterial(
        req.user!.id,
        materialData,
        fileUrl,
        filePath
      );

      res
        .status(201)
        .json(
          formatResponse(
            true,
            material,
            "Material created and text extracted successfully! 🎉",
            201
          )
        );
    } catch (error: any) {
      next(error);
    }
  }

  static async getMaterials(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const materials = await MaterialService.getMaterials(req.user!.id);
      res.status(200).json(formatResponse(true, materials));
    } catch (error: any) {
      next(error);
    }
  }

  static async getMaterialById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const material = await MaterialService.getMaterialById(req.params.id);
      if (!material) {
        return res.status(404).json(formatError("Material not found", 404));
      }
      res.status(200).json(formatResponse(true, material));
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteMaterial(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await MaterialService.deleteMaterial(req.params.id);
      res
        .status(200)
        .json(formatResponse(true, null, "Material deleted successfully"));
    } catch (error: any) {
      next(error);
    }
  }
}
