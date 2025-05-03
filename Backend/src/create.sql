
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('jobseeker', 'employer', 'admin'),
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  phone VARCHAR(20),
  address TEXT,
  education TEXT,
  experience TEXT,
  skills TEXT,
  certifications TEXT,
  languages TEXT,
  linkedin VARCHAR(255),
  github VARCHAR(255),
  bio TEXT,
  profile_picture VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  file_path VARCHAR(255),
  original_filename VARCHAR(255),
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employer_id INT,
  title VARCHAR(150),
  description TEXT,
  location VARCHAR(100),
  type ENUM('full-time', 'part-time', 'internship', 'contract'),
  salary_min INT,
  salary_max INT,
  experience_required VARCHAR(100),
  education_required VARCHAR(100),
  industry VARCHAR(100),
  remote BOOLEAN DEFAULT FALSE,
  posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deadline DATE,
  FOREIGN KEY (employer_id) REFERENCES Users(id)
);

CREATE TABLE Applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  user_id INT,
  status ENUM('applied', 'shortlisted', 'interviewed', 'offered', 'rejected'),
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resume_id INT,
  cover_letter TEXT,
  FOREIGN KEY (job_id) REFERENCES Jobs(id),
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (resume_id) REFERENCES Resumes(id)
);

CREATE TABLE Courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150),
  description TEXT,
  link VARCHAR(255),
  provider VARCHAR(100),
  category VARCHAR(100),
  difficulty_level ENUM('beginner', 'intermediate', 'advanced')
);

CREATE TABLE CourseRecommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  recommended_by VARCHAR(100),
  recommended_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (course_id) REFERENCES Courses(id)
);

CREATE TABLE JobRecommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  job_id INT,
  reason TEXT,
  recommended_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (job_id) REFERENCES Jobs(id)
);

CREATE TABLE InterviewReminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT,
  interview_date DATETIME,
  reminder_time DATETIME,
  platform VARCHAR(100),
  meeting_link VARCHAR(255),
  sent BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (application_id) REFERENCES Applications(id)
);

CREATE TABLE MarketInsights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150),
  content TEXT,
  tags TEXT,
  source VARCHAR(255),
  image_url VARCHAR(255),
  published_at DATETIME
);

CREATE TABLE CandidateScreenings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT,
  score DECIMAL(5,2),
  remarks TEXT,
  evaluation_criteria TEXT,
  screened_by INT,
  screened_at DATETIME,
  FOREIGN KEY (application_id) REFERENCES Applications(id),
  FOREIGN KEY (screened_by) REFERENCES Users(id)
);

CREATE TABLE JobTracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  job_id INT,
  status_update VARCHAR(100),
  notes TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (job_id) REFERENCES Jobs(id)
);


