-- Insert sample admin user
INSERT INTO users (email, full_name, role) VALUES 
('admin@lms.com', 'System Administrator', 'admin'),
('tutor1@lms.com', 'Dr. John Smith', 'tutor'),
('tutor2@lms.com', 'Prof. Sarah Johnson', 'tutor'),
('student1@lms.com', 'Alice Brown', 'student'),
('student2@lms.com', 'Bob Wilson', 'student'),
('student3@lms.com', 'Carol Davis', 'student')
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (title, description, tutor_id) 
SELECT 
  'Introduction to Computer Science',
  'Learn the fundamentals of computer science including programming, algorithms, and data structures.',
  u.id
FROM users u WHERE u.email = 'tutor1@lms.com'
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, tutor_id) 
SELECT 
  'Advanced Mathematics',
  'Explore advanced mathematical concepts including calculus, linear algebra, and statistics.',
  u.id
FROM users u WHERE u.email = 'tutor2@lms.com'
ON CONFLICT DO NOTHING;

-- Enroll students in courses
INSERT INTO course_enrollments (course_id, student_id)
SELECT c.id, u.id
FROM courses c
CROSS JOIN users u
WHERE u.role = 'student'
ON CONFLICT (course_id, student_id) DO NOTHING;
