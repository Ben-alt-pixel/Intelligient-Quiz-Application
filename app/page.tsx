"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import { IQLogo } from "@/components/iq-logo"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <IQLogo size="md" showText={true} />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-6 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <span className="text-sm font-medium text-primary">Welcome to Intelligent Quiz</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
              Master Your Knowledge with <span className="text-primary">AI-Powered</span> Assessments
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto leading-relaxed">
              Create, share, and master academic assessments. Leverage AI to generate intelligent questions, track student progress, and transform education.
            </p>

            <div className="flex gap-4 justify-center mb-12 flex-wrap">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-2 border-primary px-8 font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 bg-secondary/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
              <p className="text-lg text-muted-foreground">Everything you need for modern academic assessment</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="p-8 border-primary/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI Question Generator</h3>
                <p className="text-muted-foreground">Upload study materials and let our AI create intelligent, difficulty-flagged questions automatically.</p>
              </Card>

              {/* Feature 2 */}
              <Card className="p-8 border-primary/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Analytics & Insights</h3>
                <p className="text-muted-foreground">Track student performance with detailed analytics, progress reports, and comprehensive result visualization.</p>
              </Card>

              {/* Feature 3 */}
              <Card className="p-8 border-primary/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl">⏱️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Timed Assessments</h3>
                <p className="text-muted-foreground">Create time-limited quizzes with automatic scoring and real-time progress tracking for authentic assessment.</p>
              </Card>

              {/* Feature 4 */}
              <Card className="p-8 border-primary/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Role-Based Access</h3>
                <p className="text-muted-foreground">Separate student and lecturer dashboards with tailored workflows for educators and learners.</p>
              </Card>

              {/* Feature 5 */}
              <Card className="p-8 border-primary/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl">🌙</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Dark Mode Support</h3>
                <p className="text-muted-foreground">Comfortable learning environment with full dark mode support and theme customization.</p>
              </Card>

              {/* Feature 6 */}
              <Card className="p-8 border-primary/10 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Secure Authentication</h3>
                <p className="text-muted-foreground">Login with email or registration number. Role-based access control for secure data management.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Three simple steps to transform your assessment workflow</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Upload Materials</h3>
                <p className="text-muted-foreground">Lecturers upload study materials or course content to the platform.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Generate Questions</h3>
                <p className="text-muted-foreground">AI automatically creates intelligent questions with difficulty levels flagged.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/50 flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Assess & Improve</h3>
                <p className="text-muted-foreground">Students take quizzes and get detailed feedback. Track progress over time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Transform Your Assessments?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join educators and students revolutionizing academic assessment with intelligent, AI-powered quizzes.</p>
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <IQLogo size="sm" showText={true} />
              </div>
              <p className="text-sm text-muted-foreground">Intelligent Quiz © 2025. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
