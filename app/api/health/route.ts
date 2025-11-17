import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Intelligent Quiz System is running",
    timestamp: new Date().toISOString(),
  })
}
