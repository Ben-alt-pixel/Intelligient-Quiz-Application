"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface VideoUploadProps {
  sessionId: string
  onVideoUploaded: (videoUrl: string) => void
}

export function VideoUpload({ sessionId, onVideoUploaded }: VideoUploadProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks)
      }

      mediaRecorder.start()
      setIsRecording(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      toast({
        title: "Recording started",
        description: "Your webcam is now recording",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access webcam",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }

      toast({
        title: "Recording stopped",
        description: "Your video is ready to upload",
      })
    }
  }

  const uploadVideo = async () => {
    if (recordedChunks.length === 0) {
      toast({
        title: "Error",
        description: "No video recorded",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const blob = new Blob(recordedChunks, { type: "video/webm" })
      const formData = new FormData()
      formData.append("video", blob)
      formData.append("sessionId", sessionId)

      const token = localStorage.getItem("token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/videos/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Video uploaded successfully",
        })
        onVideoUploaded(data.data.videoUrl)
        setRecordedChunks([])
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="p-6 border-2 border-primary/20">
      <h3 className="text-lg font-bold text-foreground mb-4">Webcam Verification</h3>
      <p className="text-muted-foreground text-sm mb-4">
        For exam integrity, please record yourself taking this quiz
      </p>

      <div className="bg-black rounded-lg overflow-hidden mb-4 aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full"
          autoPlay
          muted
        />
      </div>

      <div className="flex gap-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Stop Recording
          </Button>
        )}

        {recordedChunks.length > 0 && (
          <Button
            onClick={uploadVideo}
            disabled={isUploading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        )}
      </div>
    </Card>
  )
}
