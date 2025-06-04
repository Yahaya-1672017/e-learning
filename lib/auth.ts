"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Database } from "./supabase"

type User = Database["public"]["Tables"]["users"]["Row"]

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users with complete profile data
const DEMO_USERS: User[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@lms.com",
    full_name: "System Administrator",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "tutor1@lms.com",
    full_name: "Dr. John Smith",
    role: "tutor",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "tutor2@lms.com",
    full_name: "Prof. Sarah Johnson",
    role: "tutor",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    email: "student1@lms.com",
    full_name: "Alice Brown",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    email: "student2@lms.com",
    full_name: "Bob Wilson",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    email: "student3@lms.com",
    full_name: "Carol Davis",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Demo password for all accounts
const DEMO_PASSWORD = "password123"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("lms_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        // Verify the stored user still exists in our demo users
        const validUser = DEMO_USERS.find((u) => u.id === userData.id)
        if (validUser) {
          setUser(validUser)
        } else {
          localStorage.removeItem("lms_user")
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("lms_user")
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check credentials
    if (password !== DEMO_PASSWORD) {
      throw new Error("Invalid password. Use 'password123' for all demo accounts.")
    }

    // Find user by email
    const foundUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!foundUser) {
      throw new Error("User not found. Please use one of the demo accounts.")
    }

    // Set user and store in localStorage
    setUser(foundUser)
    localStorage.setItem("lms_user", JSON.stringify(foundUser))
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("lms_user")
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export demo users for use in other components
export { DEMO_USERS }
