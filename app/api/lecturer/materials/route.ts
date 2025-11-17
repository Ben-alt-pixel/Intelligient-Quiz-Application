import { type NextRequest, NextResponse } from "next/server"

const lecturerMaterials: any[] = []

export async function GET() {
  return NextResponse.json({ materials: lecturerMaterials })
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, content } = await request.json()

    const newMaterial = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      content,
      uploadedAt: new Date().toISOString(),
    }

    lecturerMaterials.push(newMaterial)

    return NextResponse.json({ material: newMaterial })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 })
  }
}
