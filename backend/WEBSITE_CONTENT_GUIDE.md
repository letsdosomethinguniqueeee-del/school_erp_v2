# Website Content Management System - Implementation Guide

## Overview
A complete backend system has been added to manage dynamic website content from the Super Admin panel, including contact forms, news/events, gallery, faculty information, notices, testimonials, and achievements.

## Database Models Created

### 1. **ContactSubmission**
- Stores contact form submissions from the website
- Fields: name, email, phone, subject, message, status, response
- Status: new, read, responded, archived

### 2. **NewsEvent**
- Manages news articles, events, announcements, and achievements
- Fields: title, category, description, content, image, eventDate, location, time
- Categories: news, event, announcement, achievement
- Can be featured and published/unpublished

### 3. **Gallery**
- Manages photo galleries with categories
- Fields: title, description, category, images array
- Categories: campus, events, sports, academic, cultural, achievements

### 4. **DirectorMessage**
- Principal/Director's message for website
- Fields: name, designation, image, message, qualifications, experience, contact
- Only one active message at a time

### 5. **Faculty**
- Teacher and staff information
- Fields: name, designation, department, qualification, experience, subjects, email, phone, image, bio, achievements
- Display order for sorting

### 6. **Notice**
- Notice board/announcements
- Fields: title, content, type, priority, attachment, publishDate, expiryDate, targetAudience
- Types: general, urgent, exam, holiday, event, admission
- Priority: low, medium, high, urgent
- Target: all, students, parents, staff

### 7. **Testimonial**
- Student/parent/alumni testimonials
- Fields: name, role, batch, message, image, rating
- Approval system (isApproved, isPublished)

### 8. **Achievement**
- Student and school achievements
- Fields: title, description, category, achievers array, date, image
- Categories: academic, sports, cultural, competition, other

## API Endpoints

### Public Endpoints (No Authentication Required)

```
POST   /api/website/contact/submit                    - Submit contact form
GET    /api/website/news-events/published             - Get published news/events
GET    /api/website/gallery/published                 - Get published galleries
GET    /api/website/director/message                  - Get active director message
GET    /api/website/faculty                           - Get all active faculty
GET    /api/website/notices/active                    - Get active notices
GET    /api/website/testimonials/published            - Get published testimonials
POST   /api/website/testimonials/submit               - Submit testimonial
GET    /api/website/achievements/published            - Get published achievements
```

### Admin Endpoints (Super Admin / Admin Only)

#### Contact Management
```
GET    /api/website/contact/submissions               - Get all contact submissions
PUT    /api/website/contact/submissions/:id           - Update submission status/response
```

#### News & Events Management
```
POST   /api/website/news-events                       - Create news/event
GET    /api/website/news-events                       - Get all news/events
PUT    /api/website/news-events/:id                   - Update news/event
DELETE /api/website/news-events/:id                   - Delete news/event
```

#### Gallery Management
```
POST   /api/website/gallery                           - Create gallery
GET    /api/website/gallery                           - Get all galleries
PUT    /api/website/gallery/:id                       - Update gallery
DELETE /api/website/gallery/:id                       - Delete gallery
```

#### Director Message Management
```
POST   /api/website/director/message                  - Create director message
PUT    /api/website/director/message/:id              - Update director message
```

#### Faculty Management
```
POST   /api/website/faculty                           - Create faculty
PUT    /api/website/faculty/:id                       - Update faculty
DELETE /api/website/faculty/:id                       - Delete faculty
```

#### Notice Management
```
POST   /api/website/notices                           - Create notice
GET    /api/website/notices                           - Get all notices
PUT    /api/website/notices/:id                       - Update notice
DELETE /api/website/notices/:id                       - Delete notice
```

#### Testimonial Management
```
GET    /api/website/testimonials                      - Get all testimonials
PUT    /api/website/testimonials/:id                  - Update/approve testimonial
DELETE /api/website/testimonials/:id                  - Delete testimonial
```

#### Achievement Management
```
POST   /api/website/achievements                      - Create achievement
GET    /api/website/achievements                      - Get all achievements
PUT    /api/website/achievements/:id                  - Update achievement
DELETE /api/website/achievements/:id                  - Delete achievement
```

## Setup Instructions

### 1. Run the Seeder
Populate the database with sample website content:

```bash
cd backend
node seeders/websiteContentSeeder.js
```

This will create:
- 4 News/Events
- 4 Gallery albums
- 1 Director message
- 4 Faculty members
- 3 Notices
- 3 Testimonials
- 3 Achievements

### 2. Server Configuration
The routes are already added to `server.js`. Restart your backend server:

```bash
npm start
```

### 3. Test the APIs

**Example: Get Published News**
```bash
curl http://localhost:5000/api/website/news-events/published
```

**Example: Submit Contact Form**
```bash
curl -X POST http://localhost:5000/api/website/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "subject": "Admission Inquiry",
    "message": "I would like to know about the admission process for Grade 1."
  }'
```

**Example: Create News (Admin)**
```bash
curl -X POST http://localhost:5000/api/website/news-events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "New Event",
    "category": "event",
    "description": "Event description",
    "content": "Full event details...",
    "image": "https://example.com/image.jpg",
    "eventDate": "2024-12-25",
    "location": "School Auditorium",
    "time": "10:00 AM",
    "isPublished": true,
    "isFeatured": false
  }'
```

## Integration with School Website

### Update School Website Config
Modify `school-website/src/config.js` to fetch from API instead of hardcoded data:

```javascript
// Add API base URL
const API_BASE_URL = 'http://localhost:5000/api/website';

// Fetch functions
export const fetchNews = async () => {
  const response = await fetch(`${API_BASE_URL}/news-events/published`);
  const data = await response.json();
  return data.data;
};

export const fetchGallery = async () => {
  const response = await fetch(`${API_BASE_URL}/gallery/published`);
  const data = await response.json();
  return data.data;
};

export const submitContact = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/contact/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return response.json();
};
```

## Features Implemented

### ✅ Contact Form Management
- Website visitors can submit inquiries
- Admin can view, respond, and manage submissions
- Status tracking (new, read, responded, archived)

### ✅ News & Events
- Create and publish news articles
- Schedule events with date, time, location
- Feature important news on homepage
- Category-based filtering

### ✅ Gallery Management
- Upload and organize photos by category
- Multiple images per gallery
- Image captions and descriptions

### ✅ Director's Message
- Display principal/director message on website
- Include photo, qualifications, and contact info
- Easy to update from admin panel

### ✅ Faculty Information
- Complete faculty directory
- Department-wise organization
- Teacher profiles with photos and qualifications
- Display order control

### ✅ Notice Board
- Post important notices and announcements
- Priority levels and expiry dates
- Target specific audiences (students/parents/staff)
- Pin important notices

### ✅ Testimonials
- Collect testimonials from students, parents, alumni
- Approval workflow before publishing
- Rating system

### ✅ Achievements
- Showcase school and student achievements
- Category-based (academic, sports, cultural)
- Individual achiever details
- Image support

## Next Steps

1. **Update School Website Pages**:
   - Modify ContactPage to submit to API
   - Update NewsPage to fetch from API
   - Update GalleryPage to fetch from API
   - Add Faculty page with API integration
   - Add Notice Board section
   - Add Testimonials section
   - Add Achievements section

2. **Create Admin UI**:
   - Add Website Management section in ERP admin panel
   - Create forms for managing all content types
   - Add image upload functionality
   - Add rich text editor for content

3. **File Upload**:
   - Configure multer for image uploads
   - Set up cloud storage (Cloudinary/AWS S3)
   - Add file size and type validation

## Sample Data Included

The seeder creates realistic sample data with:
- News about science exhibition, sports victories, cultural events
- Photo galleries of campus, events, sports, academics
- Director message from Dr. Rajesh Kumar
- 4 faculty members across different departments
- Holiday notices, exam schedules
- Testimonials from alumni, parents, students
- Achievement records for olympiads, sports, debates

All data includes real Unsplash images and is ready to display!
