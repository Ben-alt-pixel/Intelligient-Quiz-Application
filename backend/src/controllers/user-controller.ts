import { Request, Response, NextFunction } from "express"
import { formatResponse, formatError } from "@/utils/response-formatter"
import { prisma } from "@/config/database"
import { AuthRequest } from "@/middlewares/auth"

export class UserController {
  static async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          regNo: true,
          createdAt: true,
        },
      })

      if (!user) {
        return res.status(404).json(formatError("User not found", 404))
      }

      res.status(200).json(formatResponse(true, user))
    } catch (error: any) {
      next(error)
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      })

      res.status(200).json(formatResponse(true, users))
    } catch (error: any) {
      next(error)
    }
  }

  static async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      })

      res.status(200).json(formatResponse(true, user, "User updated successfully"))
    } catch (error: any) {
      next(error)
    }
  }
}
