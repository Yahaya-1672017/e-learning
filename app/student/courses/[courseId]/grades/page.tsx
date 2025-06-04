"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Trophy, TrendingUp, Clock, CheckCircle, XCircle, Star } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Grade {
  id: string
  student_id: string
  quiz_id: string
  quiz_title: string
  score: number
  total_marks: number
  percentage: number
  submitted_at: string
  grade_letter: string
}

interface CourseStats {
  total_quizzes: number
  completed_quizzes: number
  average_score: number
  highest_score: number
  course_grade: string
  course_percentage: number
}

// Demo grades data
const DEMO_GRADES: Grade[] = [
  {
    id: "grade-1",
    student_id: "00000000-0000-0000-0000-000000000004",
    quiz_id: "quiz-1",
    quiz_title: "Programming Fundamentals Quiz",
    score: 18,
    total_marks: 20,
    percentage: 90,
    submitted_at: "2024-01-15T10:30:00Z",
    grade_letter: "A",
  },
  {
    id: "grade-2",
    student_id: "00000000-0000-0000-0000-000000000004",
    quiz_id: "quiz-2",
    quiz_title: "Data Structures Assessment",
    score: 20,
    total_marks: 25,
    percentage: 80,
    submitted_at: "2024-01-20T14:15:00Z",
    grade_letter: "B+",
  },
]

export default function StudentGradesPage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const [grades, setGrades] = useState<Grade[]>([])
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null)

  useEffect(() => {
    if (user) {
      // Filter grades for current student
      const studentGrades = DEMO_GRADES.filter((grade) => grade.student_id === user.id)
      setGrades(studentGrades)

      // Calculate course statistics
      if (studentGrades.length > 0) {
        const averagePercentage = studentGrades.reduce((sum, grade) => sum + grade.percentage, 0) / studentGrades.length
        const highestScore = Math.max(...studentGrades.map((grade) => grade.percentage))

        const stats: CourseStats = {
          total_quizzes: 5, // Total quizzes in course
          completed_quizzes: studentGrades.length,
          average_score: Math.round(averagePercentage),
          highest_score: highestScore,
          course_grade: getLetterGrade(averagePercentage),
          course_percentage: Math.round(averagePercentage),
        }
        setCourseStats(stats)
      }
    }
  }, [user])

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getGradeBadgeColor = (grade: string): string => {
    if (grade === "A") return "bg-green-100 text-green-800"
    if (grade === "B" || grade === "B+") return "bg-blue-100 text-blue-800"
    if (grade === "C" || grade === "C+") return "bg-yellow-100 text-yellow-800"
    if (grade === "D" || grade === "D+") return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Grades</h1>
            <p className="text-gray-600">View your quiz results and course progress</p>
          </div>
        </div>

        {/* Course Overview */}
        {courseStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Course Grade</p>
                    <p className={`text-2xl font-bold ${getGradeColor(courseStats.course_percentage)}`}>
                      {courseStats.course_grade}
                    </p>
                    <p className="text-sm text-gray-500">{courseStats.course_percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-blue-600">{courseStats.average_score}%</p>
                    <p className="text-sm text-gray-500">Across all quizzes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Highest Score</p>
                    <p className="text-2xl font-bold text-green-600">{courseStats.highest_score}%</p>
                    <p className="text-sm text-gray-500">Best performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {courseStats.completed_quizzes}/{courseStats.total_quizzes}
                    </p>
                    <p className="text-sm text-gray-500">Quizzes completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Bar */}
        {courseStats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Your overall progress in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed Quizzes</span>
                  <span>
                    {courseStats.completed_quizzes} of {courseStats.total_quizzes}
                  </span>
                </div>
                <Progress value={(courseStats.completed_quizzes / courseStats.total_quizzes) * 100} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Individual Quiz Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>Detailed results for each quiz you have completed</CardDescription>
          </CardHeader>
          <CardContent>
            {grades.length > 0 ? (
              <div className="space-y-4">
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{grade.quiz_title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDate(grade.submitted_at)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Score: {grade.score}/{grade.total_marks}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getGradeColor(grade.percentage)}`}>
                          {grade.percentage}%
                        </div>
                        <Progress value={grade.percentage} className="w-20 h-2" />
                      </div>
                      <Badge className={getGradeBadgeColor(grade.grade_letter)}>{grade.grade_letter}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No grades yet</h3>
                <p className="text-gray-600">Complete some quizzes to see your grades here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
