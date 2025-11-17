"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { materialService } from "@/lib/api-services"

export default function CreateMaterialPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "LECTURER") {
      router.push("/")
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title);
      formData.append("description", description)
      formData.append("content", content)
      
      const res = await materialService.uploadMaterial(formData)

      if (res.ok) {
        router.push("/lecturer/materials")
      }
    } catch (error) {
      console.error("Error creating material:", error)
      alert("Failed to create material")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold">Add Study Material</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">Upload course content for AI question generation</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-8 border-2 border-border">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Material Title *</label>
                <Input
                  type="text"
                  placeholder="e.g., Chapter 5: Photosynthesis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Input
                  type="text"
                  placeholder="Brief description of this material"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content *</label>
                <textarea
                  placeholder="Paste or type your study material here. The AI will use this to generate questions."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-80"
                />
              </div>

              <p className="text-xs text-muted-foreground">Tip: Include key concepts, definitions, and important points for better question generation.</p>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Uploading..." : "Upload Material"}
            </Button>
            <Link href="/lecturer/materials" className="flex-1">
              <Button type="button" variant="outline" className="w-full border-2 border-border bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
