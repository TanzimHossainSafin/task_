# CourseMaster - Full-Featured EdTech Platform

A comprehensive E-learning platform built with the MERN stack (MongoDB, Express.js, React.js/Next.js, Node.js) that supports course management, student enrollment, assignments, quizzes, and progress tracking.

## 🚀 Features

### Student Features
- **Course Browsing**: Search, filter, and sort courses by category, price, and tags
- **Course Enrollment**: Enroll in courses with instant access
- **Course Consumption**: Watch video lectures and track progress
- **Assignments**: Submit assignments (text or file links)
- **Quizzes**: Take multiple-choice quizzes with instant scoring
- **Progress Tracking**: Visual progress bars showing course completion percentage
- **Dashboard**: View all enrolled courses and learning statistics

### Admin Features
- **Course Management**: Full CRUD operations for courses
- **Batch Management**: Create and manage course batches with start/end dates
- **Student Management**: View all enrolled students per course
- **Assignment Review**: Review and grade student assignments
- **Analytics**: Track enrollments and student performance

### Authentication & Security
- JWT-based authentication
- Bcrypt password hashing
- Protected routes for students and admins
- Role-based access control (RBAC)

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Security**: Bcrypt for password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/coursemaster
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@coursemaster.com
ADMIN_PASSWORD=Admin@123456
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔑 Default Credentials

After running the seeder, you can login with:

**Admin Account:**
- Email: `admin@coursemaster.com`
- Password: `Admin@123456`

**Student Account:**
- Email: `student@test.com`
- Password: `Student@123`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Course Endpoints

#### Get All Courses (with filtering)
```http
GET /api/courses?page=1&limit=10&search=web&category=Programming&sort=price&order=asc
```

#### Get Single Course
```http
GET /api/courses/:id
```

#### Create Course (Admin Only)
```http
POST /api/courses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Course Title",
  "description": "Course Description",
  "instructor": "Instructor Name",
  "price": 4999,
  "category": "Programming",
  "tags": ["javascript", "web"],
  "syllabus": [...],
  "batch": {
    "batchNumber": 1,
    "startDate": "2024-01-01"
  }
}
```

#### Update Course (Admin Only)
```http
PUT /api/courses/:id
Authorization: Bearer <admin_token>
```

#### Delete Course (Admin Only)
```http
DELETE /api/courses/:id
Authorization: Bearer <admin_token>
```

### Enrollment Endpoints

#### Enroll in Course
```http
POST /api/enrollments/:courseId
Authorization: Bearer <student_token>
```

#### Get My Enrollments
```http
GET /api/enrollments/my
Authorization: Bearer <student_token>
```

#### Mark Lesson as Complete
```http
PUT /api/enrollments/:courseId/progress
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "moduleIndex": 0,
  "lessonIndex": 0
}
```

### Assignment Endpoints

#### Submit Assignment
```http
POST /api/assignments/:courseId
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "moduleIndex": 0,
  "submissionType": "text",
  "submissionContent": "My assignment answer..."
}
```

#### Get My Submissions
```http
GET /api/assignments/:courseId/my
Authorization: Bearer <student_token>
```

#### Get All Submissions (Admin)
```http
GET /api/assignments/:courseId/all
Authorization: Bearer <admin_token>
```

#### Review Assignment (Admin)
```http
PUT /api/assignments/:id/review
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "grade": 85,
  "feedback": "Good work!"
}
```

### Quiz Endpoints

#### Submit Quiz
```http
POST /api/quizzes/:courseId
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "moduleIndex": 0,
  "answers": [
    {
      "questionIndex": 0,
      "selectedAnswer": 1
    }
  ]
}
```

#### Get My Quiz Results
```http
GET /api/quizzes/:courseId/my
Authorization: Bearer <student_token>
```

## 🏗️ Project Structure

```
coursemaster/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── enrollmentController.js
│   │   │   ├── assignmentController.js
│   │   │   └── quizController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   ├── Enrollment.js
│   │   │   ├── AssignmentSubmission.js
│   │   │   └── QuizResult.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── enrollmentRoutes.js
│   │   │   ├── assignmentRoutes.js
│   │   │   └── quizRoutes.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── seeder.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── components/
│   ├── pages/
│   │   └── _app.js
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   └── courseSlice.js
│   │   └── index.js
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── api.js
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

## 🔒 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/coursemaster
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@coursemaster.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment (Vercel/Render/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## 📝 Key Features Implementation

### Database Indexing
- Text indexes on `Course.title` and `Course.instructor` for search
- Single field indexes on `Course.category`, `Course.price`, `Course.tags`
- Compound unique index on `Enrollment.student` and `Enrollment.course`

### Error Handling
- Global error handling middleware
- Async handler for route controllers
- Custom error responses with proper HTTP status codes

### Input Validation
- Joi schemas for all input validation
- Validation middleware applied to routes
- Detailed error messages for invalid inputs

### Security
- Bcrypt password hashing (salt rounds: 10)
- JWT token-based authentication
- Protected routes with role-based access control
- Environment variables for sensitive data

## 🧪 Testing

To test the API endpoints, you can use:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

Sample cURL command:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@coursemaster.com","password":"Admin@123456"}'
```

## 📄 License

This project is created as part of a technical assessment for MISUN Academy.

## 👨‍💻 Developer

Built with ❤️ as a technical assessment project.

---

For any questions or issues, please create an issue in the GitHub repository.
