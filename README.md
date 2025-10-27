# 🚀 Internship Portal - Full Stack Application

A modern Y Combinator-inspired internship portal connecting students with startup opportunities. Built with React, Node.js, Express, and PostgreSQL.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

The Internship Portal is a comprehensive platform designed to bridge the gap between students seeking internships and startups looking for talented interns. The application provides a seamless experience for both parties with features like profile management, internship posting, application tracking, and status management.

**Key Objectives:**
- Connect 200+ students with innovative startups
- Streamline the internship application process
- Provide transparent application tracking
- Enable efficient candidate management for startups

## ✨ Features

### For Students
- ✅ User registration and authentication (student accounts)
- ✅ Complete student profile creation with resume and portfolio links
- ✅ Browse and search active internship opportunities
- ✅ Filter internships by skills, location, and other criteria
- ✅ Apply to internships with custom application notes
- ✅ Track application status in real-time
- ✅ View application history

### For Startups
- ✅ User registration and authentication (startup accounts)
- ✅ Create and manage startup profiles
- ✅ Post and manage internship opportunities
- ✅ Receive and review student applications
- ✅ Update application statuses (Applied, Reviewing, Interviewing, Offer, Rejected)
- ✅ View detailed student profiles with resumes and portfolios
- ✅ Add internal notes to applications

### General Features
- ✅ Role-based authentication (Student/Startup)
- ✅ Responsive design for mobile and desktop
- ✅ Real-time form validation
- ✅ Professional UI with Tailwind CSS
- ✅ Protected routes and authorization
- ✅ Comprehensive error handling

## 🛠 Tech Stack

### Frontend
- **React** 18+ - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** v6 - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Context API** - State management

### Backend
- **Node.js** v18+ - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

## 🗄️ Database Schema

The application uses a PostgreSQL relational database with the following entity relationship model:

![Database Schema](./frontend/public/DatabaseModels.png)

### Key Relationships:
- **Users** can be either Students or Startups (one-to-one with profiles)
- **Startups** can post multiple **Internships** (one-to-many)
- **Students** can apply to multiple **Internships** through **Applications** (many-to-many)
- **Applications** track the relationship between Students, Internships, and Startups

## 📁 Project Structure

```
internship-portal/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentProfileSetup.jsx
│   │   │   ├── StartupProfileSetup.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   ├── InternshipsList.jsx
│   │   │   ├── InternshipDetail.jsx
│   │   │   ├── ApplicationsList.jsx
│   │   │   ├── ApplicationDetail.jsx
│   │   │   └── MyApplications.jsx
│   │   ├── services/          # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                     # Express backend API
│   ├── db/
│   │   └── dbconnect.js       # PostgreSQL connection
│   ├── routes/
│   │   ├── userRoutes.js      # User authentication routes
│   │   ├── studentRoutes.js   # Student profile routes
│   │   ├── startupRoutes.js   # Startup profile routes
│   │   ├── internshipRoutes.js # Internship CRUD routes
│   │   └── Application.js     # Application management routes
│   ├── index.js               # Server entry point
│   ├── package.json
│   └── .env
│
├── images/                      # Project images and diagrams
│   └── database-model.png      # Database ER diagram
│
└── README.md                   # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **PostgreSQL** (v14.0 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- A code editor like [VS Code](https://code.visualstudio.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/internship-portal.git
cd internship-portal
```

### 2. Database Setup

Create a PostgreSQL database and run the following schema:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('student', 'startup')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  startup_id INTEGER,
  student_profile_id INTEGER
);

-- Student profiles table
CREATE TABLE student_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  school VARCHAR(255),
  major VARCHAR(255),
  graduation_date DATE,
  resume_url TEXT,
  portfolio_link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Startups table
CREATE TABLE startups (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internships table
CREATE TABLE internships (
  id SERIAL PRIMARY KEY,
  startup_id INTEGER NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  location VARCHAR(255),
  stipend VARCHAR(255),
  description TEXT,
  required_skills TEXT[],
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Closed', 'Draft')),
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  internship_id INTEGER NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  startup_id INTEGER NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'Applied' CHECK (status IN ('Applied', 'Reviewing', 'Interviewing', 'Offer', 'Rejected')),
  notes TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_internships_startup ON internships(startup_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_startup ON applications(startup_id);
CREATE INDEX idx_applications_internship ON applications(internship_id);
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/internship_portal
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/signup` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Student Profile Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students` | Create student profile |
| GET | `/api/students` | Get all student profiles |
| GET | `/api/students/:id` | Get student profile by ID |
| GET | `/api/students/user/:user_id` | Get profile by user ID |
| PATCH | `/api/students/:id` | Update student profile |
| DELETE | `/api/students/:id` | Delete student profile |

### Startup Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/startups` | Create startup |
| GET | `/api/startups` | Get all startups |
| GET | `/api/startups/:id` | Get startup by ID |
| GET | `/api/startups/user/:user_id` | Get startups by user ID |
| PATCH | `/api/startups/:id` | Update startup |
| DELETE | `/api/startups/:id` | Delete startup |

### Internship Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/internships` | Create internship |
| GET | `/api/internships` | Get all internships (with filters) |
| GET | `/api/internships/:id` | Get internship by ID |
| GET | `/api/internships/startup/:startup_id` | Get internships by startup |
| PATCH | `/api/internships/:id` | Update internship |
| DELETE | `/api/internships/:id` | Delete internship |

### Application Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Create application |
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/:id` | Get application by ID |
| GET | `/api/applications/startup/:startup_id` | Get applications by startup |
| PATCH | `/api/applications/:id` | Update application status |
| DELETE | `/api/applications/:id` | Delete application |

## 📸 Screenshots

*(Add screenshots of your application here)*

### Student Dashboard
![Student Dashboard](./frontend/public/StudentDashboard.png)

### Internship Listings
![Internship Listings](./frontend/public/InternhipListing.png)

### Application Tracking
![Application Tracking](./frontend/public/ApplicationTracking.png)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Manne Rithvik** [rithvik-2006](https://github.com/rithvik-2006)

## 🙏 Acknowledgments

- Inspired by Y Combinator's startup ecosystem
- Built as a learning project for IIT Hyderabad students
- Icons by [Lucide Icons](https://lucide.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

For questions or support, please contact:
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

**Made with ❤️ for connecting students with amazing startup opportunities**