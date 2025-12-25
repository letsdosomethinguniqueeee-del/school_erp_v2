# School ERP System

A comprehensive School Management System with role-based authentication and beautiful UI.

## Features

### 🔐 Authentication System
- **Multi-role Login**: Admin, Super Admin, Teacher, Student, Parent, Staff
- **Secure JWT Authentication**: Token-based authentication with HTTP-only cookies
- **Role-based Access Control**: Different dashboards for different user types
- **Beautiful Login UI**: Modern, responsive design with role selection

### 🎨 User Interfaces
- **Admin Dashboard**: School management, student/teacher management, fee management
- **Super Admin Dashboard**: System management, user management, security settings
- **Teacher Dashboard**: Class management, attendance, assignments, student progress
- **Student Dashboard**: Course access, attendance, assignments, exam results
- **Parent Dashboard**: Children overview, academic progress, fee management
- **Staff Dashboard**: Student records, fee collection, library management

### 🛠 Technical Stack
- **Frontend**: React.js with modern CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt (ready for implementation)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=1d
   PORT=5000
   ```

4. **Create Test Users**:
   ```bash
   node createTestUsers.js
   ```

5. **Start the server**:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## Test Users

After running the test user creation script, you can use these credentials:

**Note**: User ID validation rules:
- **Students & Super Admin**: Can use alphanumeric usernames (e.g., `STU001`, `superadmin123`)
- **Admin, Teacher, Parent, Staff**: Must use mobile number format (10-15 digits)

| Role | User ID | Password |
|------|---------|----------|
| Admin | 9876543211 | admin123 |
| Super Admin | superadmin123 | superadmin123 |
| Teacher | 9876543212 | teacher123 |
| Student | STU001 | student123 |
| Parent | 9876543210 | parent123 |
| Staff | 9876543213 | staff123 |

## Project Structure

```
school_erp/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   └── createTestUsers.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login/
    │   │   │   ├── Login.js
    │   │   │   └── Login.css
    │   │   └── Dashboards/
    │   │       ├── BaseDashboard.js
    │   │       ├── AdminDashboard.js
    │   │       ├── SuperAdminDashboard.js
    │   │       ├── TeacherDashboard.js
    │   │       ├── StudentDashboard.js
    │   │       ├── ParentDashboard.js
    │   │       └── StaffDashboard.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api1/auth/login` - User login
- `POST /api1/auth/logout` - User logout
- `GET /api1/auth/check` - Check authentication status

### User Management (Admin only)
- `POST /api/createUser` - Create new user
- `PATCH /api/update-isactive` - Update user active status

## Security Features

### Current Implementation
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ Role-based route protection
- ✅ CORS configuration
- ✅ Input validation

### TODO (Security Improvements)
- 🔄 Password hashing with bcrypt
- 🔄 Password strength validation
- 🔄 Rate limiting
- 🔄 Session management
- 🔄 Audit logging

## Development

### Adding New Features
1. Create new routes in `backend/routes/`
2. Add controllers in `backend/controllers/`
3. Create models in `backend/models/`
4. Add frontend components in `frontend/src/components/`
5. Update authentication middleware if needed

### Styling
- Main styles: `frontend/src/App.css`
- Component-specific styles: Individual CSS files
- Responsive design with CSS Grid and Flexbox
- Modern gradient backgrounds and smooth animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
