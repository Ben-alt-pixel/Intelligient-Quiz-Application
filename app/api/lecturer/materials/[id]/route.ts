import { type NextRequest, NextResponse } from "next/server"

let lecturerMaterials: any[] = []

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const material = lecturerMaterials.find((m) => m.id === id)

  if (!material) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 })
  }

  return NextResponse.json({ material })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  lecturerMaterials = lecturerMaterials.filter((m) => m.id !== id)
  return NextResponse.json({ success: true })
}
