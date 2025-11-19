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
  fileUrl?: string;
  fileType?: string;
  uploadedAt: string;
  createdAt?: string;
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
  const [ollamaStatus, setOllamaStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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
    checkOllamaStatus();
  }, [router]);

  const checkOllamaStatus = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/ai/questions/test-ollama`
      );
      const data = await res.json();
      setOllamaStatus(data.data);
    } catch (error) {
      setOllamaStatus({
        success: false,
        message: "Could not connect to AI service",
      });
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/materials`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setMaterials(data.data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this material?")) {
      try {
        await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
          }/materials/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMaterials(materials.filter((m) => m.id !== id));
        toast({
          title: "Success",
          description: "Material deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting material:", error);
        toast({
          title: "Error",
          description: "Failed to delete material",
          variant: "destructive",
        });
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
    const title = file.name.replace(/\.[^/.]+$/, "");
    setFormData({
      title,
      description: "",
      content: "",
    });
    setShowForm(true);

    // Store the file for later upload
    if (fileInputRef.current) {
      // Don't clear it yet, we need it for upload
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

    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "Error",
        description: "Please select a file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("file", fileInputRef.current.files[0]);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);

      toast({
        title: "Processing...",
        description:
          "Uploading and extracting text from your document. This may take a moment...",
      });

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/materials/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataToSend,
        }
      );

      if (res.ok) {
        const response = await res.json();
        const newMaterial = response.data;
        setMaterials([newMaterial, ...materials]);
        setShowForm(false);
        setFormData({ title: "", description: "", content: "" });
        setSelectedFileName("");

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast({
          title: "Success! 🎉",
          description:
            response.message ||
            "Material uploaded and text extracted successfully. Ready for AI question generation!",
        });

        // Refresh materials list
        fetchMaterials();
      } else {
        const errorData = await res.json();
        throw new Error(
          errorData.error || errorData.message || "Failed to upload material"
        );
      }
    } catch (error: any) {
      console.error("Error uploading material:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to upload material. Please try again.",
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
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-3">
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

          {/* Ollama Status Indicator */}
          {ollamaStatus && (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                ollamaStatus.success
                  ? "bg-green-500/20 text-green-100 border border-green-400"
                  : "bg-yellow-500/20 text-yellow-100 border border-yellow-400"
              }`}
            >
              <span className="mr-2">{ollamaStatus.success ? "🤖" : "⚠️"}</span>
              {ollamaStatus.success
                ? "AI Ready - Ollama Connected"
                : "AI Offline - Questions will use fallback"}
            </div>
          )}
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
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2 flex-1">
                      {material.title}
                    </h3>
                    {material.fileType && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded">
                        {material.fileType.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                    {material.description || "No description provided"}
                  </p>

                  {material.content && (
                    <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300 flex items-center">
                        <span className="mr-1">✓</span>
                        Text extracted ({material.content.length} characters) -
                        Ready for AI!
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mb-4">
                    Uploaded:{" "}
                    {new Date(
                      material.uploadedAt || material.createdAt || ""
                    ).toLocaleDateString()}
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
                        🤖 Generate AI Questions
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
