const mongoose = require('mongoose');

// Contact Form Submission Schema
const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new'
  },
  response: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// News/Events Schema
const newsEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['news', 'event', 'announcement', 'achievement'],
    required: true 
  },
  description: { type: String, required: true },
  content: { type: String },
  image: { type: String }, // URL or path to image
  eventDate: { type: Date }, // For events
  location: { type: String }, // For events
  time: { type: String }, // For events
  author: { type: String },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: ['campus', 'events', 'sports', 'academic', 'cultural', 'achievements'],
    required: true 
  },
  images: [{
    url: { type: String, required: true },
    caption: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Director's Message Schema
const directorMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, default: 'Principal' },
  image: { type: String },
  message: { type: String, required: true },
  qualifications: [{ type: String }],
  experience: { type: String },
  email: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Faculty Schema
const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  qualification: { type: String },
  experience: { type: String },
  subjects: [{ type: String }],
  email: { type: String },
  phone: { type: String },
  image: { type: String },
  bio: { type: String },
  achievements: [{ type: String }],
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Notice Board Schema
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['general', 'urgent', 'exam', 'holiday', 'event', 'admission'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  attachment: { type: String }, // PDF or document link
  publishDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'parents', 'staff'],
    default: 'all'
  },
  isActive: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // Student, Parent, Alumni
  batch: { type: String },
  message: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  isApproved: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'competition', 'other'],
    required: true
  },
  achievers: [{
    name: { type: String },
    class: { type: String },
    rollNumber: { type: String }
  }],
  date: { type: Date, required: true },
  image: { type: String },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);
const NewsEvent = mongoose.model('NewsEvent', newsEventSchema);
const Gallery = mongoose.model('Gallery', gallerySchema);
const DirectorMessage = mongoose.model('DirectorMessage', directorMessageSchema);
const Faculty = mongoose.model('Faculty', facultySchema);
const Notice = mongoose.model('Notice', noticeSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = {
  ContactSubmission,
  NewsEvent,
  Gallery,
  DirectorMessage,
  Faculty,
  Notice,
  Testimonial,
  Achievement
};
