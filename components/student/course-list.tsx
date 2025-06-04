"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { BookOpen, FileText, PuzzleIcon as Quiz, MessageSquare, Star } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string | null
  tutor_name: string
  material_count: number
  quiz_count: number
}

// Demo courses that students are enrolled in
const DEMO_STUDENT_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science including programming, algorithms, and data structures.",
    tutor_name: "Dr. John Smith",
    material_count: 12,
    quiz_count: 5,
  },
  {
    id: "course-2",
    title: "Advanced Mathematics",
    description: "Explore advanced mathematical concepts including calculus, linear algebra, and statistics.",
    tutor_name: "Prof. Sarah Johnson",
    material_count: 8,
    quiz_count: 3,
  },
]

export function CourseList() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && user.role === "student") {
      setCourses(DEMO_STUDENT_COURSES)
    }
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-gray-600">Access your enrolled courses and materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{course.title}</span>
              </CardTitle>
              <CardDescription>
                <div>{course.description}</div>
                <div className="mt-2 text-sm font-medium">Instructor: {course.tutor_name}</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{course.material_count} Materials</span>
                  <span>{course.quiz_count} Quizzes</span>
                </div>

                <div className="space-y-2">
                  <Link href={`/student/courses/${course.id}/materials`}>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Learning Materials
                    </Button>
                  </Link>
                  <Link href={`/student/courses/${course.id}/quizzes`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Quiz className="h-4 w-4 mr-2" />
                      Quizzes & Tests
                    </Button>
                  </Link>
                  <Link href={`/student/courses/${course.id}/forum`}>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discussion Forum
                    </Button>
                  </Link>
                  <Link href={`/student/courses/${course.id}/grades`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-2" />
                      My Grades
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
            <p className="text-gray-600">Contact your administrator to enroll in courses</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
