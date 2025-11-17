import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors,
      statusCode: 400,
    })
  }

  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      error: "Database error",
      statusCode: 400,
    })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
    statusCode: err.statusCode || 500,
  })
}
