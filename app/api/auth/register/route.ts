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
    const { name, email, password, role, registrationNumber } = await request.json()

    if (users[email]) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    if (role === "student") {
      if (!registrationNumber || registrationNumber.trim() === "") {
        return NextResponse.json({ error: "Registration number is required for students" }, { status: 400 })
      }
      if (registrationNumbers[registrationNumber]) {
        return NextResponse.json({ error: "Registration number already exists" }, { status: 400 })
      }
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role: role as "student" | "lecturer",
      ...(role === "student" && { registrationNumber }),
    }

    users[email] = newUser
    if (role === "student" && registrationNumber) {
      registrationNumbers[registrationNumber] = email
    }

    return NextResponse.json({
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role,
        registrationNumber: newUser.registrationNumber
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
