"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Plus, Edit, Trash2, Clock, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Quiz {
  id: string
  course_id: string
  title: string
  description: string | null
  total_marks: number
  time_limit: number | null
  created_at: string
  question_count: number
  attempts_count: number
}

interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  question_type: "multiple_choice" | "true_false" | "short_answer"
  options: string[]
  correct_answer: string
  marks: number
}

// Demo quizzes data
const DEMO_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    course_id: "course-1",
    title: "Programming Fundamentals Quiz",
    description: "Test your understanding of basic programming concepts",
    total_marks: 20,
    time_limit: 30,
    created_at: "2024-01-01T00:00:00Z",
    question_count: 3,
    attempts_count: 5,
  },
  {
    id: "quiz-2",
    course_id: "course-1",
    title: "Data Structures Assessment",
    description: "Evaluate your knowledge of arrays, lists, and basic algorithms",
    total_marks: 25,
    time_limit: 45,
    created_at: "2024-01-05T00:00:00Z",
    question_count: 4,
    attempts_count: 3,
  },
]

export default function TutorQuizzesPage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isQuestionOpen, setIsQuestionOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)

  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    time_limit: "",
  })

  const [questionForm, setQuestionForm] = useState({
    question: "",
    question_type: "multiple_choice" as "multiple_choice" | "true_false" | "short_answer",
    options: ["", "", "", ""],
    correct_answer: "",
    marks: "1",
  })

  useEffect(() => {
    // Filter quizzes for current course
    const courseQuizzes = DEMO_QUIZZES.filter((quiz) => quiz.course_id === courseId)
    setQuizzes(courseQuizzes)
  }, [courseId])

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        course_id: courseId,
        title: quizForm.title,
        description: quizForm.description,
        total_marks: 0,
        time_limit: quizForm.time_limit ? Number.parseInt(quizForm.time_limit) : null,
        created_at: new Date().toISOString(),
        question_count: 0,
        attempts_count: 0,
      }

      setQuizzes([newQuiz, ...quizzes])
      setIsCreateOpen(false)
      setQuizForm({ title: "", description: "", time_limit: "" })
    } catch (error) {
      console.error("Error creating quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuiz) return

    setLoading(true)

    try {
      const newQuestion: QuizQuestion = {
        id: `question-${Date.now()}`,
        quiz_id: selectedQuiz.id,
        question: questionForm.question,
        question_type: questionForm.question_type,
        options:
          questionForm.question_type === "multiple_choice"
            ? questionForm.options.filter((opt) => opt.trim())
            : questionForm.question_type === "true_false"
              ? ["True", "False"]
              : [],
        correct_answer: questionForm.correct_answer,
        marks: Number.parseInt(questionForm.marks),
      }

      setQuestions([...questions, newQuestion])

      // Update quiz total marks and question count
      const updatedQuizzes = quizzes.map((quiz) =>
        quiz.id === selectedQuiz.id
          ? {
              ...quiz,
              total_marks: quiz.total_marks + Number.parseInt(questionForm.marks),
              question_count: quiz.question_count + 1,
            }
          : quiz,
      )
      setQuizzes(updatedQuizzes)

      setQuestionForm({
        question: "",
        question_type: "multiple_choice",
        options: ["", "", "", ""],
        correct_answer: "",
        marks: "1",
      })
    } catch (error) {
      console.error("Error adding question:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageQuestions = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    // In a real app, fetch questions for this quiz
    setQuestions([])
    setIsQuestionOpen(true)
  }

  const handleDeleteQuiz = (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return
    setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId))
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return
    const questionToDelete = questions.find((q) => q.id === questionId)
    if (questionToDelete && selectedQuiz) {
      setQuestions(questions.filter((q) => q.id !== questionId))

      // Update quiz total marks and question count
      const updatedQuizzes = quizzes.map((quiz) =>
        quiz.id === selectedQuiz.id
          ? {
              ...quiz,
              total_marks: quiz.total_marks - questionToDelete.marks,
              question_count: quiz.question_count - 1,
            }
          : quiz,
      )
      setQuizzes(updatedQuizzes)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Quizzes & Tests</h1>
              <p className="text-gray-600">Create and manage course assessments</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Quiz</DialogTitle>
                  <DialogDescription>Set up a new quiz for your students</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateQuiz} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quiz Title</Label>
                    <Input
                      id="title"
                      value={quizForm.title}
                      onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                      required
                      placeholder="Enter quiz title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={quizForm.description}
                      onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                      placeholder="Enter quiz description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                    <Input
                      id="time_limit"
                      type="number"
                      value={quizForm.time_limit}
                      onChange={(e) => setQuizForm({ ...quizForm, time_limit: e.target.value })}
                      placeholder="Leave empty for no time limit"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Quiz"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quizzes List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Quizzes</CardTitle>
            <CardDescription>Manage all quizzes for this course</CardDescription>
          </CardHeader>
          <CardContent>
            {quizzes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Time Limit</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quiz.title}</div>
                          <div className="text-sm text-gray-500">{quiz.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{quiz.question_count}</TableCell>
                      <TableCell>{quiz.total_marks}</TableCell>
                      <TableCell>
                        {quiz.time_limit ? (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {quiz.time_limit} min
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No limit</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          <Users className="h-3 w-3 mr-1" />
                          {quiz.attempts_count}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(quiz.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleManageQuestions(quiz)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
                <p className="text-gray-600 mb-4">Create your first quiz to get started</p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question Management Dialog */}
        <Dialog open={isQuestionOpen} onOpenChange={setIsQuestionOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Questions: {selectedQuiz?.title}</DialogTitle>
              <DialogDescription>Add and manage questions for this quiz</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Add Question Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddQuestion} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Textarea
                        id="question"
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                        required
                        placeholder="Enter your question"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="question_type">Question Type</Label>
                        <Select
                          value={questionForm.question_type}
                          onValueChange={(value: "multiple_choice" | "true_false" | "short_answer") =>
                            setQuestionForm({
                              ...questionForm,
                              question_type: value,
                              options: value === "multiple_choice" ? ["", "", "", ""] : [],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="true_false">True/False</SelectItem>
                            <SelectItem value="short_answer">Short Answer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="marks">Marks</Label>
                        <Input
                          id="marks"
                          type="number"
                          value={questionForm.marks}
                          onChange={(e) => setQuestionForm({ ...questionForm, marks: e.target.value })}
                          required
                          min="1"
                        />
                      </div>
                    </div>

                    {questionForm.question_type === "multiple_choice" && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {questionForm.options.map((option, index) => (
                          <Input
                            key={index}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options]
                              newOptions[index] = e.target.value
                              setQuestionForm({ ...questionForm, options: newOptions })
                            }}
                            placeholder={`Option ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="correct_answer">Correct Answer</Label>
                      {questionForm.question_type === "multiple_choice" ? (
                        <Select
                          value={questionForm.correct_answer}
                          onValueChange={(value) => setQuestionForm({ ...questionForm, correct_answer: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct option" />
                          </SelectTrigger>
                          <SelectContent>
                            {questionForm.options
                              .filter((opt) => opt.trim())
                              .map((option, index) => (
                                <SelectItem key={index} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : questionForm.question_type === "true_false" ? (
                        <Select
                          value={questionForm.correct_answer}
                          onValueChange={(value) => setQuestionForm({ ...questionForm, correct_answer: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="True">True</SelectItem>
                            <SelectItem value="False">False</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Textarea
                          value={questionForm.correct_answer}
                          onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                          placeholder="Enter the correct answer"
                          rows={2}
                        />
                      )}
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? "Adding..." : "Add Question"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Questions ({questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {questions.length > 0 ? (
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">
                              Question {index + 1} ({question.marks} marks)
                            </h4>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-gray-700 mb-2">{question.question}</p>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Type:</span> {question.question_type.replace("_", " ")}
                            {question.options.length > 0 && (
                              <>
                                <br />
                                <span className="font-medium">Options:</span> {question.options.join(", ")}
                              </>
                            )}
                            <br />
                            <span className="font-medium">Correct Answer:</span> {question.correct_answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No questions added yet</p>
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
