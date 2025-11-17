import { Request, Response, NextFunction } from "express"
import { AuthService } from "@/services/auth-service"
import { formatResponse, formatError } from "@/utils/response-formatter"

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body)
      res.status(201).json(formatResponse(true, result, "User registered successfully", 201))
    } catch (error: any) {
      next(error)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body)
      res.status(200).json(formatResponse(true, result, "Login successful"))
    } catch (error: any) {
      next(error)
    }
  }
}
