"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { quizService } from "@/lib/api-services/quiz-service";
import Webcam from "react-webcam";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  duration: number;
  passingScore: number;
}

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const webcamRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    fetchQuizAndStartSession();
  }, []);

  useEffect(() => {
    if (!timeRemaining || timeRemaining === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((t) => {
        if (t === 1) {
          handleSubmitQuiz();
          return 0;
        }
        return t ? t - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Watch for recording stop and aggressively kill camera
  useEffect(() => {
    if (!isRecording && streamRef.current) {
      console.log("!!! isRecording became false - NUCLEAR CAMERA SHUTDOWN !!!");

      // Stop our tracked stream
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        console.log(`Emergency stop ${track.kind}:`, track.readyState);
        track.enabled = false;
        track.stop();
      });

      // NUCLEAR OPTION: Query and stop ALL active media streams in the browser
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          console.log("Checking all media devices:", devices);

          // Get all media streams and stop them
          const allVideoElements = document.querySelectorAll("video");
          allVideoElements.forEach((video: any) => {
            if (video.srcObject) {
              console.log("Found video element with stream, stopping...");
              const videoStream = video.srcObject as MediaStream;
              videoStream.getTracks().forEach((t) => {
                console.log(`Stopping orphan ${t.kind} track`);
                t.stop();
              });
              video.srcObject = null;
            }
          });
        });
      }

      // Check again after delay
      setTimeout(() => {
        tracks.forEach((track) => {
          if (track.readyState !== "ended") {
            console.error(
              `ALERT: Track ${track.kind} STILL ACTIVE after stop! State:`,
              track.readyState
            );
            // Try one more time
            track.stop();
          } else {
            console.log(`✓ Track ${track.kind} successfully ended`);
          }
        });
      }, 100);
    }
  }, [isRecording]);

  const fetchQuizAndStartSession = async () => {
    try {
      const quizData = (await quizService.getQuizById(
        params.id as string
      )) as Quiz;
      setQuiz(quizData);
      setTimeRemaining(quizData.duration * 60);

      // Start quiz session
      const session = (await quizService.startSession(params.id as string)) as {
        id: string;
      };
      setSessionId(session.id);

      // Start webcam recording after session is created
      startRecording(session.id).catch((err: any) => {
        console.error("Failed to start recording", err);
        toast({
          title: "Camera unavailable",
          description: "Unable to access webcam. Recording will be skipped.",
          variant: "destructive",
        });
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load quiz",
        variant: "destructive",
      });
      router.push("/student");
    }
  };

  const handleAnswerChange = async (answer: string) => {
    if (!quiz || !sessionId) return;

    // optimistically update local answers so UI reflects selection immediately
    setAnswers((prev) => ({
      ...prev,
      [quiz.questions[currentQuestion].id]: answer,
    }));

    await quizService.answerQuestion({
      questionId: quiz.questions[currentQuestion].id,
      answer,
      sessionId: sessionId as string,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const startRecording = async (sessionId: string) => {
    if (typeof window === "undefined") return;

    try {
      // Get our own stream directly - don't rely on react-webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });

      // Store stream reference so we control its lifecycle
      streamRef.current = stream;

      // Attach stream to video element for preview
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
      }

      recordedChunksRef.current = [];

      const options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
        options.mimeType = "video/webm;codecs=vp9";
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
        options.mimeType = "video/webm;codecs=vp8";
      } else if (MediaRecorder.isTypeSupported("video/webm")) {
        options.mimeType = "video/webm";
      }

      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) {
          recordedChunksRef.current.push(ev.data);
        }
      };

      mr.onerror = (ev) => {
        console.error("MediaRecorder error", ev);
        // Try to recover by checking if stream is still active
        if (streamRef.current && !streamRef.current.active) {
          console.error("Stream became inactive during recording");
        }
      };

      mr.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  };

  const stopRecordingAndUpload = async (sessionId: string | null) => {
    if (!sessionId) return;
    const mr = mediaRecorderRef.current;
    const stream = streamRef.current;

    return new Promise<void>((resolve) => {
      if (!mr || mr.state === "inactive") {
        // Stop stream tracks even if recorder is not active
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setIsRecording(false);
        resolve();
        return;
      }

      mr.onstop = async () => {
        try {
          const chunks = recordedChunksRef.current;
          console.log(
            "Recording stopped. Chunks:",
            chunks.length,
            "Total size:",
            chunks.reduce((acc, c) => acc + c.size, 0)
          );

          if (chunks.length === 0) {
            console.warn("No video data recorded");
            resolve();
            return;
          }

          const blob = new Blob(chunks, { type: "video/webm" });
          console.log("Created blob:", blob.size, "bytes", blob.type);

          const form = new FormData();
          form.append("video", blob, `session-${sessionId}.webm`);

          // Log FormData contents
          console.log("FormData prepared:");
          for (let pair of form.entries()) {
            console.log(pair[0], pair[1]);
          }

          const apiBase =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : null;

          const response = await fetch(
            `${apiBase}/quizzes/session/${sessionId}/video`,
            {
              method: "POST",
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              body: form,
            }
          );

          console.log("Upload response:", response.status, response.statusText);
        } catch (err) {
          console.error("Video upload failed", err);
        } finally {
          // CRITICAL: Stop all stream tracks to turn off camera
          // Order is important: clear video first, then stop tracks

          // 1. Pause and clear video element srcObject FIRST
          if (videoElementRef.current) {
            console.log("Pausing and clearing video element");
            videoElementRef.current.pause();
            videoElementRef.current.srcObject = null;
            videoElementRef.current.load(); // Force reload to release resources
          }

          // 2. Then stop stream tracks
          if (stream) {
            stream.getTracks().forEach((track) => {
              console.log("Stopping track:", track.kind, track.label);
              track.enabled = false; // Disable track first
              track.stop(); // Then stop it
              console.log(
                `Track ${track.kind} readyState after stop:`,
                track.readyState
              );
            });
            streamRef.current = null;
          }

          mediaRecorderRef.current = null;
          recordedChunksRef.current = [];
          setIsRecording(false);
          resolve();
        }
      };

      try {
        mr.stop();
      } catch (e) {
        console.error("Error stopping recorder:", e);
        mr.onstop && mr.onstop(new Event("stop") as any);
      }
    });
  };

  const handleSubmitQuiz = async () => {
    if (!sessionId) return;

    setIsSubmitting(true);
    try {
      await quizService.submitSession(sessionId);

      // Stop recording and upload video
      await stopRecordingAndUpload(sessionId);

      // Force stop camera immediately - AGGRESSIVE approach
      console.log("=== FORCING CAMERA STOP ===");

      // 1. Hide video immediately
      setIsRecording(false);

      // 2. Stop all tracks MULTIPLE times if needed
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        console.log("Stopping tracks:", tracks);
        tracks.forEach((track) => {
          console.log(
            `Force stopping ${track.kind}:`,
            track.label,
            track.readyState
          );
          track.enabled = false;
          track.stop();
          // Double stop to be sure
          setTimeout(() => track.stop(), 0);
        });

        // Null out the stream
        streamRef.current = null;
      }

      // 3. Clear video element
      if (videoElementRef.current) {
        videoElementRef.current.pause();
        videoElementRef.current.srcObject = null;
        videoElementRef.current.remove(); // Remove from DOM
      }

      console.log("=== CAMERA STOP COMPLETE ===");

      toast({
        title: "Success",
        description: "Quiz submitted successfully",
      });

      // Use window.location instead of router.push to force full page reload
      // This ensures camera is released on Linux/Ubuntu systems
      window.location.href = "/student/results";
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });

      // Stop camera even on error - AGGRESSIVE
      console.log("=== ERROR: FORCING CAMERA STOP ===");

      setIsRecording(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          console.log(`Error path - stopping ${track.kind}`);
          track.enabled = false;
          track.stop();
          setTimeout(() => track.stop(), 0);
        });
        streamRef.current = null;
      }

      if (videoElementRef.current) {
        videoElementRef.current.pause();
        videoElementRef.current.srcObject = null;
        videoElementRef.current.remove();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup: stop webcam when leaving the page
  useEffect(() => {
    return () => {
      console.log("Component unmounting - stopping camera");
      try {
        const mr = mediaRecorderRef.current;
        if (mr && mr.state !== "inactive") {
          console.log("Stopping MediaRecorder");
          mr.stop();
        }

        // Clear video element FIRST
        if (videoElementRef.current) {
          console.log("Clearing video element on unmount");
          videoElementRef.current.pause();
          videoElementRef.current.srcObject = null;
          videoElementRef.current.load();
        }

        // Then stop our managed stream
        if (streamRef.current) {
          console.log(
            "Stopping stream tracks:",
            streamRef.current.getTracks().length
          );
          streamRef.current.getTracks().forEach((track) => {
            console.log(
              `Stopping ${track.kind} track:`,
              track.label,
              "enabled:",
              track.enabled,
              "readyState:",
              track.readyState
            );
            track.enabled = false;
            track.stop();
            console.log(
              `Track ${track.kind} after stop - readyState:`,
              track.readyState
            );
          });
          streamRef.current = null;
        }
        setIsRecording(false);
      } catch (e) {
        console.error("Cleanup error", e);
      }
    };
  }, []);

  if (!quiz) {
    return (
      <main className="min-h-screen bg-linear-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </main>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <main className="min-h-screen bg-linear-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{quiz.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>
          <div className="text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg">
            <p className="text-sm font-medium">Time Remaining</p>
            <p className="text-2xl font-bold">
              {Math.floor(timeRemaining! / 60)}:
              {(timeRemaining! % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-foreground">Progress</p>
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 border-2 border-border mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options?.map((option: string, index: number) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[question.id] === option
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswerChange(option)}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <span className="ml-3 text-foreground font-medium flex-1">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Webcam preview - using native video element with our managed stream */}
        {isMounted && isRecording && (
          <div className="fixed bottom-4 right-4 w-48 h-36 overflow-hidden rounded-lg border-2 border-primary bg-black shadow-lg z-50">
            <video
              ref={(el) => {
                videoElementRef.current = el;
                if (el && streamRef.current) {
                  el.srcObject = streamRef.current;
                }
              }}
              autoPlay
              playsInline
              muted
              style={{ transform: "scaleX(-1)" }}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Recording
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
            className="border-2 border-border bg-transparent"
          >
            Previous
          </Button>

          <div className="flex gap-2 flex-wrap justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  index === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : answers[quiz.questions[index].id] !== undefined
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-border text-foreground hover:bg-border/70"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
