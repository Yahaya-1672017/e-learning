import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: "admin" | "tutor" | "student"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role: "admin" | "tutor" | "student"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: "admin" | "tutor" | "student"
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          tutor_id: string
          created_at: string
          updated_at: string
        }
      }
      learning_materials: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          file_url: string | null
          file_type: string | null
          file_size: number | null
          created_at: string
        }
      }
      quizzes: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          total_marks: number
          time_limit: number | null
          created_at: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          question: string
          question_type: "multiple_choice" | "true_false" | "short_answer"
          options: any
          correct_answer: string
          marks: number
          created_at: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          quiz_id: string
          student_id: string
          answers: any
          score: number
          total_marks: number
          submitted_at: string
        }
      }
      course_enrollments: {
        Row: {
          id: string
          course_id: string
          student_id: string
          enrolled_at: string
        }
      }
      content_assessments: {
        Row: {
          id: string
          material_id: string
          student_id: string
          rating: number
          feedback: string | null
          created_at: string
        }
      }
      forum_posts: {
        Row: {
          id: string
          course_id: string
          user_id: string
          title: string
          content: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
