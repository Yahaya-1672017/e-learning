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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Plus, FileText, Download, Trash2, Upload } from "lucide-react"
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
]

export default function CourseMaterialsPage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const [materials, setMaterials] = useState<LearningMaterial[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })

  useEffect(() => {
    // Filter materials for current course
    const courseMaterials = DEMO_MATERIALS.filter((material) => material.course_id === courseId)
    setMaterials(courseMaterials)
  }, [courseId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, file })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newMaterial: LearningMaterial = {
        id: `material-${Date.now()}`,
        course_id: courseId,
        title: formData.title,
        description: formData.description,
        file_url: formData.file ? `/uploads/${formData.file.name}` : null,
        file_type: formData.file?.type || null,
        file_size: formData.file?.size || null,
        created_at: new Date().toISOString(),
      }

      setMaterials([newMaterial, ...materials])
      setIsDialogOpen(false)
      setFormData({ title: "", description: "", file: null })
    } catch (error) {
      console.error("Error uploading material:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (materialId: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return
    setMaterials(materials.filter((material) => material.id !== materialId))
  }

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
              <h1 className="text-3xl font-bold">Learning Materials</h1>
              <p className="text-gray-600">Manage course materials and resources</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Learning Material</DialogTitle>
                  <DialogDescription>Upload a new learning resource for your students</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Enter material title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter material description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.mp3,.wav"
                    />
                    <p className="text-xs text-gray-500">Supported formats: PDF, PPT, DOC, MP4, MP3, WAV</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Materials</CardTitle>
            <CardDescription>All learning materials for this course</CardDescription>
          </CardHeader>
          <CardContent>
            {materials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getFileTypeIcon(material.file_type)}
                          <span>{material.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{material.description}</TableCell>
                      <TableCell>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {material.file_type?.split("/")[1]?.toUpperCase() || "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell>{formatFileSize(material.file_size)}</TableCell>
                      <TableCell>{new Date(material.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(material.id)}>
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
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h3>
                <p className="text-gray-600 mb-4">Upload your first learning material to get started</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
