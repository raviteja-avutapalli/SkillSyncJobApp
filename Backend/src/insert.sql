INSERT INTO Users (name, email, password, role) VALUES 
('Alice Smith', 'alice@example.com', 'hashedpass1', 'jobseeker'),
('Bob Jones', 'bob@example.com', 'hashedpass2', 'employer'),
('Admin User', 'admin@example.com', 'adminpass', 'admin');

INSERT INTO Profiles (user_id, phone, address, education, experience, skills, certifications, languages, linkedin, github, bio, profile_picture) VALUES 
(1, '1234567890', '123 Main St', 'BSc Computer Science', '2 years at TechCorp', 'JavaScript, SQL', 'AWS Certified', 'English', 'linkedin.com/in/alice', 'github.com/alice', 'Motivated dev', NULL),
(2, '0987654321', '456 Elm St', 'MBA HR', '5 years recruiting', 'Hiring, HRMS', '', 'English', '', '', 'Passionate about talent', NULL),
(1, '1122334455', '789 Pine St', 'MS AI', 'Intern at AI Labs', 'Python, ML', 'Coursera ML', 'English, Spanish', '', '', '', NULL);

INSERT INTO Resumes (user_id, file_path, original_filename) VALUES 
(1, 'uploads/resume1.pdf', 'Alice_Resume.pdf'),
(1, 'uploads/resume2.pdf', 'Alice_Updated.pdf'),
(2, 'uploads/resume_bob.pdf', 'Bob_CV.pdf');

INSERT INTO Jobs (employer_id, title, description, location, type, salary_min, salary_max, experience_required, education_required, industry, remote, deadline) VALUES 
(2, 'Frontend Developer', 'Work on React apps', 'New York', 'full-time', 60000, 80000, '2 years', 'BSc CS', 'Tech', FALSE, '2025-06-01'),
(2, 'Backend Developer', 'APIs and DBs', 'Remote', 'contract', 70000, 90000, '3 years', 'BSc CS', 'Tech', TRUE, '2025-05-20'),
(2, 'HR Intern', 'Assist in hiring', 'San Francisco', 'internship', 15000, 20000, '0-1 year', 'MBA', 'HR', FALSE, '2025-05-30');


INSERT INTO Applications (job_id, user_id, status, resume_id, cover_letter) VALUES 
(1, 1, 'applied', 1, 'Looking forward to this opportunity'),
(2, 1, 'applied', 2, 'Excited to contribute backend skills'),
(3, 1, 'applied', 1, 'HR role aligns with my interests');


INSERT INTO Courses (title, description, link, provider, category, difficulty_level) VALUES 
('Intro to React', 'Learn React basics', 'https://example.com/react', 'Coursera', 'Frontend', 'beginner'),
('Node.js Mastery', 'Advanced backend with Node', 'https://example.com/node', 'Udemy', 'Backend', 'advanced'),
('HR Fundamentals', 'Basics of hiring', 'https://example.com/hr', 'edX', 'HR', 'beginner');


INSERT INTO CourseRecommendations (user_id, course_id, recommended_by) VALUES 
(1, 1, 'System'),
(1, 2, 'Admin'),
(1, 3, 'System');


INSERT INTO JobRecommendations (user_id, job_id, reason) VALUES 
(1, 1, 'Matches frontend skills'),
(1, 2, 'Strong backend experience'),
(1, 3, 'HR interest');


INSERT INTO InterviewReminders (application_id, interview_date, reminder_time, platform, meeting_link) VALUES 
(1, '2025-04-15 10:00:00', '2025-04-15 09:00:00', 'Zoom', 'https://zoom.us/j/123'),
(2, '2025-04-16 14:00:00', '2025-04-16 13:30:00', 'Google Meet', 'https://meet.google.com/abc'),
(3, '2025-04-17 11:00:00', '2025-04-17 10:30:00', 'Teams', 'https://teams.microsoft.com/xyz');


INSERT INTO MarketInsights (title, content, tags, source, image_url, published_at) VALUES 
('Tech Hiring Trends 2025', 'Lots of frontend jobs...', 'tech,hiring,2025', 'LinkedIn News', NULL, '2025-04-01'),
('AI Market Growth', 'AI jobs are booming...', 'AI,jobs', 'TechCrunch', NULL, '2025-04-02'),
('Remote Work Shift', 'Remote is now norm...', 'remote,work', 'Forbes', NULL, '2025-04-03');


INSERT INTO CandidateScreenings (application_id, score, remarks, evaluation_criteria, screened_by) VALUES 
(1, 85.0, 'Good coding skills', 'Frontend JS test', 2),
(2, 92.5, 'Strong DB knowledge', 'Backend SQL test', 2),
(3, 75.0, 'Decent HR basics', 'HR screening', 2);


INSERT INTO JobTracking (user_id, job_id, status_update, notes) VALUES 
(1, 1, 'Resume Submitted', 'Waiting for response'),
(1, 2, 'Interview Scheduled', 'Zoom at 2pm'),
(1, 3, 'Shortlisted', 'Will get call soon');

