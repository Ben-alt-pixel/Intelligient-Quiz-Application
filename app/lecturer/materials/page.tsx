"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  content: string;
  uploadedAt: string;
}

export default function MaterialsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "LECTURER") {
      router.push("/");
      return;
    }

    fetchMaterials();
  }, [router]);

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/lecturer/materials");
      const data = await res.json();
      setMaterials(data.materials || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this material?")) {
      try {
        await fetch(`/api/lecturer/materials/${id}`, { method: "DELETE" });
        setMaterials(materials.filter((m) => m.id !== id));
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  const handleAddMaterialClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF, Word document, or TXT file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFileName(file.name);
    setIsUploading(true);

    try {
      let content = "";

      if (file.type === "application/pdf") {
        content = `[PDF Content from ${file.name}]\n\nPlease ensure the PDF content is properly extracted.`;
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        content = `[DOCX Content from ${file.name}]\n\nPlease ensure the DOCX content is properly extracted.`;
      } else if (file.type === "text/plain") {
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = (e) => {
            content = e.target?.result as string;
            resolve(null);
          };
          reader.readAsText(file);
        });
      }

      const title = file.name.replace(/\.[^/.]+$/, "");
      setFormData({
        title,
        description: "",
        content,
      });
      setShowForm(true);
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Error processing file. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleSubmitMaterial = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch("/api/lecturer/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newMaterial = await res.json();
        setMaterials([newMaterial, ...materials]);
        setShowForm(false);
        setFormData({ title: "", description: "", content: "" });
        setSelectedFileName("");
        toast({
          title: "Success",
          description: "Material uploaded successfully",
        });
      } else {
        throw new Error("Failed to upload material");
      }
    } catch (error) {
      console.error("Error uploading material:", error);
      toast({
        title: "Error",
        description: "Failed to upload material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-muted-foreground">Loading materials...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-primary/5 to-secondary/5">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Materials</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Upload and manage course materials
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleAddMaterialClick}
              disabled={isUploading}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
            >
              {isUploading ? "Uploading..." : "Add Material"}
            </Button>
            <Link href="/lecturer">
              <Button
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {showForm && (
          <Card className="mb-8 p-6 border-2 border-primary/50 bg-primary/5">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Upload Material
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  File Name: {selectedFileName}
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter material title"
                  disabled={isUploading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter material description"
                  disabled={isUploading}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitMaterial}
                  disabled={isUploading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {isUploading ? "Uploading..." : "Upload Material"}
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: "", description: "", content: "" });
                    setSelectedFileName("");
                  }}
                  disabled={isUploading}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {materials.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Materials Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Upload study materials to generate AI questions.
            </p>
            <Button
              onClick={handleAddMaterialClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add Material
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materials.map((material) => (
              <Card
                key={material.id}
                className="border-2 border-border hover:border-primary/50 transition-all"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                    {material.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {material.description}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Uploaded:{" "}
                    {new Date(material.uploadedAt).toLocaleDateString()}
                  </p>

                  <div className="space-y-2">
                    <Link
                      href={`/lecturer/ai-questions/generate?materialId=${material.id}`}
                      className="w-full block"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      >
                        Generate Questions
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={() => handleDelete(material.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
