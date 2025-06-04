-- Update user IDs to be consistent UUIDs for demo purposes
-- This ensures the demo authentication works properly

-- First, let's create consistent UUIDs for our demo users
UPDATE users SET id = '00000000-0000-0000-0000-000000000001' WHERE email = 'admin@lms.com';
UPDATE users SET id = '00000000-0000-0000-0000-000000000002' WHERE email = 'tutor1@lms.com';
UPDATE users SET id = '00000000-0000-0000-0000-000000000003' WHERE email = 'tutor2@lms.com';
UPDATE users SET id = '00000000-0000-0000-0000-000000000004' WHERE email = 'student1@lms.com';
UPDATE users SET id = '00000000-0000-0000-0000-000000000005' WHERE email = 'student2@lms.com';
UPDATE users SET id = '00000000-0000-0000-0000-000000000006' WHERE email = 'student3@lms.com';

-- Update course tutor references
UPDATE courses SET tutor_id = '00000000-0000-0000-0000-000000000002' 
WHERE tutor_id IN (SELECT id FROM users WHERE email = 'tutor1@lms.com');

UPDATE courses SET tutor_id = '00000000-0000-0000-0000-000000000003' 
WHERE tutor_id IN (SELECT id FROM users WHERE email = 'tutor2@lms.com');

-- Update enrollments to use consistent student IDs
DELETE FROM course_enrollments;
INSERT INTO course_enrollments (course_id, student_id)
SELECT c.id, '00000000-0000-0000-0000-000000000004'
FROM courses c
UNION ALL
SELECT c.id, '00000000-0000-0000-0000-000000000005'
FROM courses c
UNION ALL
SELECT c.id, '00000000-0000-0000-0000-000000000006'
FROM courses c;
