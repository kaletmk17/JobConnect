# JobConnect

A full-stack job portal application that connects job seekers with recruiters through a secure and user-friendly platform.

## 🚀 Project Overview

JobConnect is a full-stack web application built using **Java Spring Boot, React.js and MySQL**.

The platform allows:

- Job Seekers to create profiles, search for jobs and apply with resumes.
- Recruiters to post jobs, manage their job listings and review applications.
- Secure authentication using **JWT**.
- Role-based access control for Job Seekers and Recruiters.

---

## ✨ Features

### 👨‍💻 Job Seeker

- User registration and login
- JWT-based authentication
- Browse available jobs
- Search jobs by title/company
- Filter jobs by location and skills
- View detailed job information
- Apply for jobs
- Upload resume while applying
- View submitted applications
- Track application status
- Manage personal profile
- Update education, skills and contact information
- Upload/replace profile resume

### 🏢 Recruiter

- Recruiter registration and login
- JWT-based authentication
- Post new jobs
- View posted jobs
- Update job details
- Delete jobs
- View applications for posted jobs
- View candidate details
- Download the resume submitted for a specific application
- Accept or reject applications
- Recruiter dashboard

---

## 🔐 Security

JobConnect implements:

- JWT authentication
- BCrypt password hashing
- Role-based authorization
- Protected API endpoints
- CORS configuration
- Secure resume access
- Recruiter-only candidate resume downloads
- Job Seeker-only job applications

### User Roles

```text
JOB_SEEKER
RECRUITER

Resume & Application Flow
Each job application can contain its own submitted resume.
Job Seeker
    ↓
Browse Jobs
    ↓
Click Apply Now
    ↓
Select PDF Resume
    ↓
Resume Validation
    ↓
Submit Application
    ↓
Application + Resume Saved
    ↓
Recruiter Views Application
    ↓
Recruiter Downloads Submitted Resume

Resume validation includes:
- PDF files only
- Maximum file size of 5 MB
- Secure application-specific resume storage
- Duplicate application prevention
🏗️ Project Architecture
                         JOB CONNECT
                              │
                ┌─────────────┴─────────────┐
                │                           │
        React Frontend              Spring Boot Backend
                │                           │
                │                     REST Controllers
                │                           │
                │                         Services
                │                           │
                │                       Repositories
                │                           │
                │                           ▼
                │                      MySQL Database
                │
                └──────────── REST API ─────┘

Backend Request Flow
React Frontend
      ↓
REST API
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
MySQL Database

🏛️ Backend Structure
src/main/java/com/jobconnect
│
├── controller
│   ├── AuthController
│   ├── JobController
│   ├── ApplicationController
│   ├── UserController
│   └── ResumeController
│
├── service
│   ├── AuthService
│   ├── JobService
│   └── ApplicationService
│
├── repository
│   ├── UserRepository
│   ├── JobRepository
│   └── ApplicationRepository
│
├── model
│   ├── User
│   ├── Job
│   └── Application
│
├── dto
│   ├── UserResponse
│   ├── LoginRequest
│   └── LoginResponse
│
├── security
│   ├── JwtService
│   └── JwtAuthenticationFilter
│
├── config
│   └── SecurityConfig
│
└── exception
    ├── DuplicateApplicationException
    └── GlobalExceptionHandler

💻 Frontend Structure
frontend/src
│
├── components
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
│
├── pages
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Jobs.jsx
│   ├── JobDetails.jsx
│   ├── MyApplications.jsx
│   ├── Profile.jsx
│   ├── Resume.jsx
│   ├── PostJob.jsx
│   ├── MyJobs.jsx
│   ├── RecruiterApplications.jsx
│   └── RecruiterDashboard.jsx
│
├── services
│   ├── authService.js
│   ├── jobService.js
│   ├── applicationService.js
│   └── userService.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx

🛠️ Technology Stack
Backend
- Java 25
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Hibernate
- Maven
- MySQL
Frontend
- React.js
- Vite
- JavaScript
- CSS
- React Router
Tools
- IntelliJ IDEA
- MySQL Workbench
- Postman
- Git
- GitHub
🗄️ Database
JobConnect uses MySQL as the relational database.
Main Entities
User
Job
Application

User
Stores:
- ID
- Name
- Email
- Password
- Role
- Phone
- Education
- Skills
- Resume information
Job
Stores:
- Job ID
- Job Title
- Company
- Location
- Description
- Skills
- Salary
- Recruiter ID
Application
Stores:
- Application ID
- Job ID
- User ID
- Application Status
- Application Date
- Resume File Name
- Resume File Path
Application Status
PENDING
ACCEPTED
REJECTED

🔑 Authentication Flow
JobConnect uses JWT-based authentication.
Registration
     ↓
Password encrypted using BCrypt
     ↓
User saved in MySQL
     ↓
Login
     ↓
Credentials verified
     ↓
JWT token generated
     ↓
Token stored by frontend
     ↓
Token sent with protected requests
     ↓
JWT Filter validates token
     ↓
Role-based authorization

👥 Role-Based Access Control
Job Seeker
Browse Jobs
View Job Details
Apply for Jobs
View Own Applications
Manage Own Profile
Upload Resume

Recruiter
Post Jobs
View Own Jobs
Update Jobs
Delete Jobs
View Applications
Download Candidate Resumes
Update Application Status

🌐 REST API Structure
Authentication
POST /api/auth/register
POST /api/auth/login

Jobs
GET    /api/jobs
GET    /api/jobs/{id}
POST   /api/jobs
PUT    /api/jobs/{id}
DELETE /api/jobs/{id}
GET    /api/jobs/recruiter/my-jobs

Applications
POST /api/applications/apply
GET  /api/applications/user/{userId}
GET  /api/applications/job/{jobId}
PUT  /api/applications/{applicationId}/status

Profile
GET /api/users/profile
PUT /api/users/profile

Resume
POST /api/resume/upload
GET  /api/resume/download/application/{applicationId}

🧪 API Testing
REST APIs were tested using Postman.
Example:
POST /api/auth/login

Protected APIs use:
Authorization: Bearer <JWT_TOKEN>

▶️ How to Run
1. Clone Repository
git clone https://github.com/kaletmk17/JobConnect.git
cd JobConnect

2. Create MySQL Database
CREATE DATABASE jobconnect_db;

3. Configure Environment Variables
Required environment variables:
DB_PASSWORD
JWT_SECRET

Configure them in your local environment or IntelliJ IDEA Run Configuration.
Do not commit real passwords or JWT secrets to GitHub.
4. Start Backend
On Windows:
mvnw.cmd spring-boot:run

Backend:
http://localhost:8080

5. Start Frontend
cd frontend
npm install
npm run dev

Frontend:
http://localhost:5173

📁 Project Structure
JobConnect/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/jobconnect/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── model/
│   │   │       ├── dto/
│   │   │       ├── security/
│   │   │       ├── config/
│   │   │       └── exception/
│   │   │
│   │   └── resources/
│   │       └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── pom.xml
├── .gitignore
└── README.md

🔒 Security & Configuration
Sensitive information must not be committed to GitHub.
The project uses environment variables:
spring.datasource.password=${DB_PASSWORD:}
jwt.secret=${JWT_SECRET}

Ignored files and folders include:
.env
.env.*
uploads/
target/
node_modules/
.idea/
*.log

🚧 Future Improvements
- Email notifications
- Forgot password functionality
- Password reset
- Advanced job search
- Pagination
- Job recommendations
- Recruiter analytics
- Admin dashboard
- Candidate search
- Cloud-based resume storage
- Docker deployment
- AWS deployment
- Google Cloud deployment
- Automated testing
- CI/CD pipeline
- Microservices architecture
📸 Screenshots
Screenshots can be added here to showcase the application.
Suggested screenshots:
- Login Page
- Registration Page
- Job Listing Page
- Job Details Page
- Job Seeker Profile
- My Applications
- Recruiter Dashboard
- Recruiter Applications
📊 Project Highlights
- Full-stack application using Spring Boot + React.js
- Secure JWT authentication
- BCrypt password hashing
- Role-based authorization
- RESTful API architecture
- MySQL database integration
- Job search and filtering
- Job management
- Application management
- Application-specific resume submission
- Secure recruiter resume downloads
- Profile management
- Application status management
- Postman API testing
- Git and GitHub version control
👨‍💻 Author
Tushar Kale
MCA Graduate | Java Developer | Spring Boot | React.js | MySQL
Technical Skills
Java
Spring Boot
Spring Security
REST APIs
JWT
React.js
MySQL
Git & GitHub

GitHub
https://github.com/kaletmk17/JobConnect
📌 Project Status
Completed – Core Features Implemented
✓ User Registration & Login
✓ JWT Authentication
✓ Role-Based Authorization
✓ Job Management
✓ Job Search & Filtering
✓ Job Applications
✓ Resume Upload
✓ Application-Specific Resume Handling
✓ Profile Management
✓ Application Status Management
✓ Recruiter Dashboard
✓ Candidate Resume Download
✓ MySQL Database Integration
✓ React Frontend
✓ Spring Boot REST APIs

⭐ Conclusion
JobConnect demonstrates a complete full-stack job portal built using modern backend and frontend technologies.
The project focuses on:
- Secure authentication
- Role-based access control
- REST API development
- Database management
- Job management
- Job application workflows
- Resume handling
Java + Spring Boot + Spring Security + JWT
                    +
              React.js + Vite
                    +
                  MySQL
                    =
               JobConnect