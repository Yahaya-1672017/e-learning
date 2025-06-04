"use client"

import { useAuth } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"
import { Navbar } from "@/components/layout/navbar"
import { UserManagement } from "@/components/admin/user-management"
import { CourseManagement } from "@/components/tutor/course-management"
import { CourseList } from "@/components/student/course-list"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {user.role === "admin" && <UserManagement />}
        {user.role === "tutor" && <CourseManagement />}
        {user.role === "student" && <CourseList />}
      </main>
    </div>
  )
}
