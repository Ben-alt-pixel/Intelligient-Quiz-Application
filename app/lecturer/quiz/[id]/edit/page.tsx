"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { quizService } from "@/lib/api-services";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  description?: string; // added optional description field
}

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("15");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${BACKEND_URL}/quizzes/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        const response = await res.json();
        const quiz = response.data;

        setTitle(quiz.title);
        setDescription(quiz.description || "");
        setTimeLimit(quiz.duration?.toString() || "30");

        // Format questions from backend
        const formattedQuestions =
          quiz.questions?.map((q: any) => ({
            id: q.id,
            text: q.text,
            options:
              typeof q.options === "string" ? JSON.parse(q.options) : q.options,
            correctAnswer: q.correctAnswer,
            description: q.explanation || "",
          })) || [];

        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    setIsSubmitting(true);

    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Update quiz details
      const quizRes = await fetch(`${BACKEND_URL}/quizzes/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          description,
          duration: Number.parseInt(timeLimit),
        }),
      });

      if (!quizRes.ok) {
        throw new Error("Failed to update quiz");
      }

      // Update questions
      for (const question of questions) {
        await fetch(`${BACKEND_URL}/quizzes/questions/${question.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            text: question.text,
            options: JSON.stringify(question.options),
            correctAnswer: question.correctAnswer,
            explanation: question.description,
          }),
        });
      }

      alert("Quiz updated successfully!");
      router.push("/lecturer");
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold">Edit Quiz</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Update your quiz questions and settings
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Details */}
          <Card className="p-8 border-2 border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Quiz Details
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Quiz Title
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="border-border"
                />
              </div>
            </div>
          </Card>

          {/* Questions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Questions
            </h2>

            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <Card key={question.id} className="p-6 border-2 border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Question {questionIndex + 1}
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Question Text
                      </label>
                      <textarea
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(question.id, "text", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        Answer Options
                      </p>
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() =>
                              updateQuestion(
                                question.id,
                                "correctAnswer",
                                optionIndex
                              )
                            }
                            className="w-4 h-4 text-primary accent-primary"
                          />
                          <Input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                question.id,
                                optionIndex,
                                e.target.value
                              )
                            }
                            className="flex-1 border-border"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border">
                      <label className="text-sm font-medium text-foreground">
                        Explanation (Optional)
                      </label>
                      <p className="text-xs text-muted-foreground">
                        This explanation will be shown to students after they
                        complete the quiz
                      </p>
                      <textarea
                        value={question.description || ""}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Explain why this is the correct answer..."
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
            <Link href="/lecturer" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-border bg-transparent"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
