const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const feeRoutes = require('./routes/feeRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const parentRoutes = require('./routes/parentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const academicYearRoutes = require('./routes/systemConfiguration/academicYearRoutes');
const subjectRoutes = require('./routes/systemConfiguration/subjectRoutes');
const streamRoutes = require('./routes/systemConfiguration/streamRoutes');
const mediumRoutes = require('./routes/systemConfiguration/mediumRoutes');
const classRoutes = require('./routes/systemConfiguration/classRoutes');
const sectionRoutes = require('./routes/systemConfiguration/sectionRoutes');
const classMappingRoutes = require('./routes/systemConfiguration/classMappingRoutes');
const examinationRoutes = require('./routes/systemConfiguration/examinationRoutes');
const examinationDataAccessRoutes = require('./routes/examinationDataAccessRoutes');
const examinationMarksRoutes = require('./routes/examinationMarksRoutes');
const studentExamResultRoutes = require('./routes/studentExamResultRoutes');
const websiteContentRoutes = require('./routes/websiteContentRoutes');
const { authenticate , adminAuthentication } = require('./middleware/authMiddleware');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// CORS configuration - Security: Only allow explicitly listed frontend URLs
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    const origins = [];
    
    // Primary frontend URL from environment variable
    if (process.env.FRONTEND_URL) {
      origins.push(process.env.FRONTEND_URL);
    }
    
    // Additional frontend URLs from environment (comma-separated)
    if (process.env.FRONTEND_URLS) {
      const additionalUrls = process.env.FRONTEND_URLS.split(',').map(url => url.trim());
      origins.push(...additionalUrls);
    }
    
    // Fallback to default if no environment variable is set (for initial setup)
    if (origins.length === 0) {
      origins.push('https://school-erp-v2.vercel.app');
    }
    
    return origins;
  }
  return ['http://localhost:3000', 'http://localhost:3001'];
};

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) only in development
    if (!origin) {
      return callback(null, process.env.NODE_ENV !== 'production');
    }
    
    const allowedOrigins = getAllowedOrigins();
    
    // Strict check: origin must exactly match one of the allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());


// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('MongoDB Atlas connection error:', err);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/admin', adminRoutes);

// System Configuration Routes
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/mediums', mediumRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/class-mappings', classMappingRoutes);
app.use('/api/examinations', examinationRoutes);
app.use('/api/examination-data-access', examinationDataAccessRoutes);
app.use('/api/examination-marks', examinationMarksRoutes);
app.use('/api/student-exam-results', studentExamResultRoutes);
app.use('/api/website', websiteContentRoutes);
// System Configuration Routes End

app.get('/', (req, res) => {
  res.json({ message: 'School ERP API is running' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});