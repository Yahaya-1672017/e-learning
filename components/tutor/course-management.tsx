"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { Plus, BookOpen, Users, FileText, PuzzleIcon as Quiz } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string | null
  tutor_id: string
  created_at: string
  updated_at: string
}

// Demo courses data
const DEMO_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science including programming, algorithms, and data structures.",
    tutor_id: "00000000-0000-0000-0000-000000000002",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "course-2",
    title: "Advanced Mathematics",
    description: "Explore advanced mathematical concepts including calculus, linear algebra, and statistics.",
    tutor_id: "00000000-0000-0000-0000-000000000003",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export function CourseManagement() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  useEffect(() => {
    if (user) {
      // Filter courses for current tutor
      const tutorCourses = DEMO_COURSES.filter((course) => course.tutor_id === user.id)
      setCourses(tutorCourses)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        tutor_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setCourses([newCourse, ...courses])
      setIsDialogOpen(false)
      setFormData({ title: "", description: "" })
    } catch (error) {
      console.error("Error creating course:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-gray-600">Manage your courses and content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to your teaching portfolio</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{course.title}</span>
              </CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href={`/tutor/courses/${course.id}/materials`}>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Learning Materials
                  </Button>
                </Link>
                <Link href={`/tutor/courses/${course.id}/quizzes`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Quiz className="h-4 w-4 mr-2" />
                    Quizzes & Tests
                  </Button>
                </Link>
                <Link href={`/tutor/courses/${course.id}/students`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Students & Grades
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">Create your first course to get started</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
