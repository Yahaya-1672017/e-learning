"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, FileText, Download, Star, Eye, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface LearningMaterial {
  id: string
  course_id: string
  title: string
  description: string | null
  file_url: string | null
  file_type: string | null
  file_size: number | null
  created_at: string
}

interface ContentAssessment {
  id: string
  material_id: string
  student_id: string
  rating: number
  feedback: string | null
  created_at: string
}

// Demo materials data
const DEMO_MATERIALS: LearningMaterial[] = [
  {
    id: "material-1",
    course_id: "course-1",
    title: "Introduction to Programming",
    description: "Basic concepts of programming and computer science fundamentals",
    file_url: "/placeholder.pdf",
    file_type: "application/pdf",
    file_size: 2048000,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "material-2",
    course_id: "course-1",
    title: "Data Structures Overview",
    description: "Understanding arrays, linked lists, stacks, and queues",
    file_url: "/placeholder.pptx",
    file_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    file_size: 5120000,
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "material-3",
    course_id: "course-1",
    title: "Algorithm Basics Video",
    description: "Video lecture on basic algorithms and complexity analysis",
    file_url: "/placeholder.mp4",
    file_type: "video/mp4",
    file_size: 104857600,
    created_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "material-4",
    course_id: "course-2",
    title: "Calculus Fundamentals",
    description: "Introduction to differential and integral calculus",
    file_url: "/placeholder.pdf",
    file_type: "application/pdf",
    file_size: 3072000,
    created_at: "2024-01-01T00:00:00Z",
  },
]

export default function StudentMaterialsPage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const [materials, setMaterials] = useState<LearningMaterial[]>([])
  const [assessments, setAssessments] = useState<ContentAssessment[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null)
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    // Filter materials for current course
    const courseMaterials = DEMO_MATERIALS.filter((material) => material.course_id === courseId)
    setMaterials(courseMaterials)
  }, [courseId])

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileTypeIcon = (fileType: string | null) => {
    if (!fileType) return <FileText className="h-4 w-4" />

    if (fileType.includes("pdf")) return <FileText className="h-4 w-4 text-red-500" />
    if (fileType.includes("presentation")) return <FileText className="h-4 w-4 text-orange-500" />
    if (fileType.includes("video")) return <FileText className="h-4 w-4 text-blue-500" />
    if (fileType.includes("audio")) return <FileText className="h-4 w-4 text-green-500" />
    return <FileText className="h-4 w-4" />
  }

  const getFileTypeBadge = (fileType: string | null) => {
    if (!fileType) return <Badge variant="secondary">Unknown</Badge>

    if (fileType.includes("pdf")) return <Badge className="bg-red-100 text-red-800">PDF</Badge>
    if (fileType.includes("presentation")) return <Badge className="bg-orange-100 text-orange-800">PPT</Badge>
    if (fileType.includes("video")) return <Badge className="bg-blue-100 text-blue-800">Video</Badge>
    if (fileType.includes("audio")) return <Badge className="bg-green-100 text-green-800">Audio</Badge>
    return <Badge variant="secondary">{fileType.split("/")[1]?.toUpperCase()}</Badge>
  }

  const handleViewMaterial = (material: LearningMaterial) => {
    // In a real app, this would open the file viewer or download
    alert(`Opening: ${material.title}\nFile: ${material.file_url}`)
  }

  const handleAssessMaterial = (material: LearningMaterial) => {
    setSelectedMaterial(material)
    setIsAssessmentOpen(true)
    setRating(0)
    setFeedback("")
  }

  const handleSubmitAssessment = () => {
    if (!selectedMaterial || !user) return

    const newAssessment: ContentAssessment = {
      id: `assessment-${Date.now()}`,
      material_id: selectedMaterial.id,
      student_id: user.id,
      rating,
      feedback,
      created_at: new Date().toISOString(),
    }

    setAssessments([...assessments, newAssessment])
    setIsAssessmentOpen(false)
    setSelectedMaterial(null)
    alert("Thank you for your feedback!")
  }

  const getExistingAssessment = (materialId: string) => {
    return assessments.find((a) => a.material_id === materialId && a.student_id === user?.id)
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
            <h1 className="text-3xl font-bold">Learning Materials</h1>
            <p className="text-gray-600">Access course materials and resources</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => {
            const existingAssessment = getExistingAssessment(material.id)

            return (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getFileTypeIcon(material.file_type)}
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                    </div>
                    {getFileTypeBadge(material.file_type)}
                  </div>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Size: {formatFileSize(material.file_size)}</span>
                      <span>Added: {new Date(material.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" onClick={() => handleViewMaterial(material)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Material
                      </Button>

                      <Button variant="outline" className="w-full" onClick={() => handleViewMaterial(material)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>

                      {existingAssessment ? (
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="flex items-center justify-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < existingAssessment.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-green-700 mt-1">You rated this material</p>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full" onClick={() => handleAssessMaterial(material)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Rate & Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {materials.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials available</h3>
              <p className="text-gray-600">Your instructor hasn't uploaded any materials yet</p>
            </CardContent>
          </Card>
        )}

        {/* Assessment Dialog */}
        <Dialog open={isAssessmentOpen} onOpenChange={setIsAssessmentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate Learning Material</DialogTitle>
              <DialogDescription>Share your feedback about: {selectedMaterial?.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Feedback (Optional)</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about this material..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAssessmentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitAssessment} disabled={rating === 0}>
                  Submit Rating
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
