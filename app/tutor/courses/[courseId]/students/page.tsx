"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Users, Search, Mail, Calendar, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Student {
  id: string
  full_name: string
  email: string
  enrolled_at: string
  quiz_attempts: number
  average_score: number
  last_activity: string
  status: "active" | "inactive"
}

interface StudentGrade {
  quiz_title: string
  score: number
  total_marks: number
  percentage: number
  submitted_at: string
}

// Demo students data
const DEMO_STUDENTS: Student[] = [
  {
    id: "00000000-0000-0000-0000-000000000004",
    full_name: "Alice Brown",
    email: "student1@lms.com",
    enrolled_at: "2024-01-01T00:00:00Z",
    quiz_attempts: 2,
    average_score: 85,
    last_activity: "2024-01-20T14:30:00Z",
    status: "active",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    full_name: "Bob Wilson",
    email: "student2@lms.com",
    enrolled_at: "2024-01-01T00:00:00Z",
    quiz_attempts: 1,
    average_score: 78,
    last_activity: "2024-01-18T10:15:00Z",
    status: "active",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    full_name: "Carol Davis",
    email: "student3@lms.com",
    enrolled_at: "2024-01-02T00:00:00Z",
    quiz_attempts: 2,
    average_score: 92,
    last_activity: "2024-01-21T16:45:00Z",
    status: "active",
  },
]

// Demo grades data
const DEMO_STUDENT_GRADES: Record<string, StudentGrade[]> = {
  "00000000-0000-0000-0000-000000000004": [
    {
      quiz_title: "Programming Fundamentals Quiz",
      score: 18,
      total_marks: 20,
      percentage: 90,
      submitted_at: "2024-01-15T10:30:00Z",
    },
    {
      quiz_title: "Data Structures Assessment",
      score: 20,
      total_marks: 25,
      percentage: 80,
      submitted_at: "2024-01-20T14:15:00Z",
    },
  ],
  "00000000-0000-0000-0000-000000000005": [
    {
      quiz_title: "Programming Fundamentals Quiz",
      score: 15,
      total_marks: 20,
      percentage: 75,
      submitted_at: "2024-01-16T11:20:00Z",
    },
  ],
  "00000000-0000-0000-0000-000000000006": [
    {
      quiz_title: "Programming Fundamentals Quiz",
      score: 19,
      total_marks: 20,
      percentage: 95,
      submitted_at: "2024-01-15T09:45:00Z",
    },
    {
      quiz_title: "Data Structures Assessment",
      score: 22,
      total_marks: 25,
      percentage: 88,
      submitted_at: "2024-01-21T16:30:00Z",
    },
  ],
}

export default function TutorStudentsPage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([])
  const [isGradesOpen, setIsGradesOpen] = useState(false)

  useEffect(() => {
    // In a real app, fetch students enrolled in this course
    setStudents(DEMO_STUDENTS)
    setFilteredStudents(DEMO_STUDENTS)
  }, [courseId])

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(
      (student) =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStudents(filtered)
  }, [searchTerm, students])

  const handleViewGrades = (student: Student) => {
    setSelectedStudent(student)
    setStudentGrades(DEMO_STUDENT_GRADES[student.id] || [])
    setIsGradesOpen(true)
  }

  const getStatusBadge = (status: "active" | "inactive") => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    )
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
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
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Students & Grades</h1>
            <p className="text-gray-600">Manage enrolled students and view their performance</p>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-green-600">
                    {students.length > 0
                      ? Math.round(students.reduce((sum, s) => sum + s.average_score, 0) / students.length)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {students.filter((s) => s.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {students.reduce((sum, s) => sum + s.quiz_attempts, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>View and manage student performance</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quiz Attempts</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.full_name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.email}
                        </div>
                        <div className="text-xs text-gray-400">Enrolled: {formatDate(student.enrolled_at)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.quiz_attempts}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{student.average_score}%</span>
                    </TableCell>
                    <TableCell>{getPerformanceBadge(student.average_score)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDateTime(student.last_activity)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewGrades(student)}>
                        View Grades
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No students found" : "No students enrolled"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search terms" : "Students will appear here once they enroll"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Grades Dialog */}
        <Dialog open={isGradesOpen} onOpenChange={setIsGradesOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Grades for {selectedStudent?.full_name}</DialogTitle>
              <DialogDescription>Detailed quiz results and performance analysis</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Student Overview */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Attempts</p>
                      <p className="text-2xl font-bold">{selectedStudent?.quiz_attempts}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold">{selectedStudent?.average_score}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Performance</p>
                      <div className="mt-1">
                        {selectedStudent && getPerformanceBadge(selectedStudent.average_score)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Grades */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quiz Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {studentGrades.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quiz</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentGrades.map((grade, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{grade.quiz_title}</TableCell>
                            <TableCell>
                              {grade.score}/{grade.total_marks}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`font-semibold ${
                                  grade.percentage >= 90
                                    ? "text-green-600"
                                    : grade.percentage >= 80
                                      ? "text-blue-600"
                                      : grade.percentage >= 70
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                }`}
                              >
                                {grade.percentage}%
                              </span>
                            </TableCell>
                            <TableCell>{formatDateTime(grade.submitted_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No quiz attempts yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
