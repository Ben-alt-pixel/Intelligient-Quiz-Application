import { type NextRequest, NextResponse } from "next/server"

// Mock user database - replace with real database
const users: Record<
  string,
  { id: string; name: string; email: string; password: string; role: "student" | "lecturer"; registrationNumber?: string }
> = {
  "student@test.com": {
    id: "1",
    name: "Test Student",
    email: "student@test.com",
    password: "password",
    role: "student",
    registrationNumber: "STU001",
  },
  "lecturer@test.com": {
    id: "2",
    name: "Test Lecturer",
    email: "lecturer@test.com",
    password: "password",
    role: "lecturer",
  },
}

const registrationNumbers: Record<string, string> = {
  STU001: "student@test.com",
}

export async function POST(request: NextRequest) {
  try {
    const { emailOrRegNo, password } = await request.json()

    let userEmail = emailOrRegNo
    if (registrationNumbers[emailOrRegNo]) {
      userEmail = registrationNumbers[emailOrRegNo]
    }

    const user = users[userEmail]
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        registrationNumber: user.registrationNumber
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
