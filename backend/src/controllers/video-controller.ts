import { Request, Response, NextFunction } from "express"
import { formatResponse, formatError } from "@/utils/response-formatter"
import { prisma } from "@/config/database"
import { AuthRequest } from "@/middlewares/auth"

export class VideoController {
  static async uploadVideo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json(formatError("No video file provided", 400))
      }

      const { sessionId } = req.body

      const videoSubmission = await prisma.videoSubmission.create({
        data: {
          sessionId,
          studentId: req.user!.id,
          videoUrl: `/uploads/videos/${req.file.filename}`,
          duration: 0, // Can be calculated from video metadata
          fileSize: req.file.size,
        },
      })

      res.status(201).json(formatResponse(true, videoSubmission, "Video uploaded successfully", 201))
    } catch (error: any) {
      next(error)
    }
  }

  static async getVideoSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const video = await prisma.videoSubmission.findUnique({
        where: { id: req.params.id },
      })

      if (!video) {
        return res.status(404).json(formatError("Video not found", 404))
      }

      res.status(200).json(formatResponse(true, video))
    } catch (error: any) {
      next(error)
    }
  }
}
