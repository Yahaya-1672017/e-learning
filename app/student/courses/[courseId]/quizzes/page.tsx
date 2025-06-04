"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Clock, CheckCircle, Play, Trophy } from "lucide-react"
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
}

interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  question_type: "multiple_choice" | "true_false" | "short_answer"
  options: string[] | null
  correct_answer: string
  marks: number
}

interface QuizAttempt {
  id: string
  quiz_id: string
  student_id: string
  answers: Record<string, string>
  score: number
  total_marks: number
  submitted_at: string
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
  },
  {
    id: "quiz-2",
    course_id: "course-1",
    title: "Data Structures Assessment",
    description: "Evaluate your knowledge of arrays, lists, and basic algorithms",
    total_marks: 25,
    time_limit: 45,
    created_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "quiz-3",
    course_id: "course-2",
    title: "Calculus Basics Test",
    description: "Assessment on differential and integral calculus",
    total_marks: 30,
    time_limit: 60,
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Demo quiz questions
const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    quiz_id: "quiz-1",
    question: "What is a variable in programming?",
    question_type: "multiple_choice",
    options: [
      "A container for storing data values",
      "A type of loop",
      "A function parameter",
      "A programming language",
    ],
    correct_answer: "A container for storing data values",
    marks: 5,
  },
  {
    id: "q2",
    quiz_id: "quiz-1",
    question: "Python is a compiled language.",
    question_type: "true_false",
    options: ["True", "False"],
    correct_answer: "False",
    marks: 5,
  },
  {
    id: "q3",
    quiz_id: "quiz-1",
    question: "Explain the difference between a list and an array.",
    question_type: "short_answer",
    options: null,
    correct_answer:
      "Lists are dynamic and can hold different data types, while arrays are fixed-size and typically hold the same data type.",
    marks: 10,
  },
]

export default function StudentQuizzesPage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  useEffect(() => {
    // Filter quizzes for current course
    const courseQuizzes = DEMO_QUIZZES.filter((quiz) => quiz.course_id === courseId)
    setQuizzes(courseQuizzes)
  }, [courseId])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timeLeft !== null && timeLeft > 0 && !quizSubmitted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      handleSubmitQuiz()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, quizSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getAttemptForQuiz = (quizId: string) => {
    return attempts.find((attempt) => attempt.quiz_id === quizId && attempt.student_id === user?.id)
  }

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    const questions = DEMO_QUESTIONS.filter((q) => q.quiz_id === quiz.id)
    setQuizQuestions(questions)
    setAnswers({})
    setQuizSubmitted(false)
    if (quiz.time_limit) {
      setTimeLeft(quiz.time_limit * 60) // Convert minutes to seconds
    }
    setIsQuizOpen(true)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmitQuiz = () => {
    if (!selectedQuiz || !user) return

    // Calculate score
    let score = 0
    quizQuestions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (userAnswer === question.correct_answer) {
        score += question.marks
      }
    })

    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quiz_id: selectedQuiz.id,
      student_id: user.id,
      answers,
      score,
      total_marks: selectedQuiz.total_marks,
      submitted_at: new Date().toISOString(),
    }

    setAttempts([...attempts, newAttempt])
    setQuizSubmitted(true)
    setTimeLeft(null)
  }

  const closeQuiz = () => {
    setIsQuizOpen(false)
    setSelectedQuiz(null)
    setQuizQuestions([])
    setAnswers({})
    setTimeLeft(null)
    setQuizSubmitted(false)
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
            <h1 className="text-3xl font-bold">Quizzes & Tests</h1>
            <p className="text-gray-600">Take quizzes and view your results</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const attempt = getAttemptForQuiz(quiz.id)
            const isCompleted = !!attempt

            return (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {isCompleted ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Total Marks: {quiz.total_marks}</span>
                      <span>Time: {quiz.time_limit ? `${quiz.time_limit} min` : "No limit"}</span>
                    </div>

                    {isCompleted ? (
                      <div className="space-y-2">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Trophy className="h-8 w-8 mx-auto text-green-600 mb-2" />
                          <div className="text-lg font-semibold text-green-800">
                            {attempt.score}/{attempt.total_marks}
                          </div>
                          <div className="text-sm text-green-600">
                            {Math.round((attempt.score / attempt.total_marks) * 100)}% Score
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Completed: {new Date(attempt.submitted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button className="w-full" onClick={() => handleStartQuiz(quiz)}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {quizzes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
              <p className="text-gray-600">Your instructor has not created any quizzes yet</p>
            </CardContent>
          </Card>
        )}

        {/* Quiz Taking Dialog */}
        <Dialog open={isQuizOpen} onOpenChange={() => {}}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{selectedQuiz?.title}</DialogTitle>
                  <DialogDescription>{selectedQuiz?.description}</DialogDescription>
                </div>
                {timeLeft !== null && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Time Remaining</div>
                    <div className={`text-lg font-mono ${timeLeft < 300 ? "text-red-600" : "text-blue-600"}`}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                )}
              </div>
            </DialogHeader>

            {!quizSubmitted ? (
              <div className="space-y-6">
                {quizQuestions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Question {index + 1} ({question.marks} marks)
                      </CardTitle>
                      <CardDescription>{question.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {question.question_type === "multiple_choice" && question.options && (
                        <RadioGroup
                          value={answers[question.id] || ""}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                              <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {question.question_type === "true_false" && (
                        <RadioGroup
                          value={answers[question.id] || ""}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="True" id={`${question.id}-true`} />
                            <Label htmlFor={`${question.id}-true`}>True</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="False" id={`${question.id}-false`} />
                            <Label htmlFor={`${question.id}-false`}>False</Label>
                          </div>
                        </RadioGroup>
                      )}

                      {question.question_type === "short_answer" && (
                        <Textarea
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Enter your answer..."
                          rows={4}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeQuiz}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Quiz Submitted!</h3>
                <p className="text-gray-600 mb-4">Your answers have been recorded successfully.</p>
                <Button onClick={closeQuiz}>Close</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
