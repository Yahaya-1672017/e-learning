"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Plus, MessageSquare, Reply, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface ForumPost {
  id: string
  course_id: string
  user_id: string
  user_name: string
  user_role: "tutor" | "student"
  title: string
  content: string
  parent_id: string | null
  created_at: string
  updated_at: string
  replies?: ForumPost[]
}

// Demo forum posts
const DEMO_POSTS: ForumPost[] = [
  {
    id: "post-1",
    course_id: "course-1",
    user_id: "00000000-0000-0000-0000-000000000002",
    user_name: "Dr. John Smith",
    user_role: "tutor",
    title: "Welcome to the Course Discussion Forum",
    content:
      "Hello everyone! This is our course discussion forum where you can ask questions, share insights, and collaborate with your classmates. Please feel free to start new discussions or reply to existing ones.",
    parent_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "post-2",
    course_id: "course-1",
    user_id: "00000000-0000-0000-0000-000000000004",
    user_name: "Alice Brown",
    user_role: "student",
    title: "Question about Data Structures Assignment",
    content:
      "Hi everyone, I'm having trouble understanding the difference between arrays and linked lists. Can someone explain when to use each one?",
    parent_id: null,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "post-3",
    course_id: "course-1",
    user_id: "00000000-0000-0000-0000-000000000005",
    user_name: "Bob Wilson",
    user_role: "student",
    title: "",
    content:
      "Great question Alice! Arrays are better when you need fast random access to elements, while linked lists are more efficient for frequent insertions and deletions.",
    parent_id: "post-2",
    created_at: "2024-01-02T10:00:00Z",
    updated_at: "2024-01-02T10:00:00Z",
  },
  {
    id: "post-4",
    course_id: "course-1",
    user_id: "00000000-0000-0000-0000-000000000002",
    user_name: "Dr. John Smith",
    user_role: "tutor",
    title: "",
    content:
      "Excellent explanation Bob! To add to that, arrays have O(1) access time but O(n) insertion/deletion, while linked lists have O(n) access but O(1) insertion/deletion at known positions.",
    parent_id: "post-2",
    created_at: "2024-01-02T14:00:00Z",
    updated_at: "2024-01-02T14:00:00Z",
  },
]

export default function StudentForumPage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isNewPostOpen, setIsNewPostOpen] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    // Filter posts for current course and organize replies
    const coursePosts = DEMO_POSTS.filter((post) => post.course_id === courseId)
    const organizedPosts = organizePosts(coursePosts)
    setPosts(organizedPosts)
  }, [courseId])

  const organizePosts = (allPosts: ForumPost[]): ForumPost[] => {
    const topLevelPosts = allPosts.filter((post) => !post.parent_id)

    return topLevelPosts.map((post) => ({
      ...post,
      replies: allPosts.filter((reply) => reply.parent_id === post.id),
    }))
  }

  const handleCreatePost = () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return

    const post: ForumPost = {
      id: `post-${Date.now()}`,
      course_id: courseId,
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role as "tutor" | "student",
      title: newPost.title,
      content: newPost.content,
      parent_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setPosts([post, ...posts])
    setNewPost({ title: "", content: "" })
    setIsNewPostOpen(false)
  }

  const handleReply = (postId: string) => {
    if (!user || !replyContent.trim()) return

    const reply: ForumPost = {
      id: `reply-${Date.now()}`,
      course_id: courseId,
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role as "tutor" | "student",
      title: "",
      content: replyContent,
      parent_id: postId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add reply to the specific post
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...(post.replies || []), reply],
        }
      }
      return post
    })

    setPosts(updatedPosts)
    setReplyContent("")
    setReplyingTo(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadge = (role: "tutor" | "student") => {
    return role === "tutor" ? (
      <Badge className="bg-blue-100 text-blue-800">Instructor</Badge>
    ) : (
      <Badge variant="outline">Student</Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Discussion Forum</h1>
              <p className="text-gray-600">Ask questions and discuss course topics</p>
            </div>
            <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Discussion</DialogTitle>
                  <DialogDescription>Create a new discussion topic for the class</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Enter discussion title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Write your question or discussion topic..."
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost}>Post Discussion</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{getUserInitials(post.user_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{post.user_name}</span>
                        {getRoleBadge(post.user_role)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
                {post.title && <CardTitle className="mt-3">{post.title}</CardTitle>}
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

                {/* Replies */}
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
                      </span>
                    </div>

                    {post.replies.map((reply) => (
                      <div key={reply.id} className="ml-6 pl-4 border-l-2 border-gray-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{getUserInitials(reply.user_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{reply.user_name}</span>
                              {getRoleBadge(reply.user_role)}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(reply.created_at)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="mt-4 pt-4 border-t">
                  {replyingTo === post.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleReply(post.id)}>
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setReplyingTo(post.id)}>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
              <p className="text-gray-600 mb-4">Be the first to start a discussion!</p>
              <Button onClick={() => setIsNewPostOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
