const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteContentController');
const { authenticate, adminAuthentication, authorizeRoles } = require('../middleware/authMiddleware');

// ============ Contact Submissions ============
// Public route - Submit contact form
router.post('/contact/submit', websiteController.submitContactForm);

// Admin routes - Manage contact submissions
router.get('/contact/submissions', 
  adminAuthentication,
  websiteController.getAllContactSubmissions
);

router.put('/contact/submissions/:id', 
  adminAuthentication,
  websiteController.updateContactSubmission
);

// ============ News & Events ============
// Public routes
router.get('/news-events/published', websiteController.getPublishedNewsEvents);

// Admin routes
router.post('/news-events', 
  adminAuthentication,
  websiteController.createNewsEvent
);

router.get('/news-events', 
  adminAuthentication,
  websiteController.getAllNewsEvents
);

router.put('/news-events/:id', 
  adminAuthentication,
  websiteController.updateNewsEvent
);

router.delete('/news-events/:id', 
  adminAuthentication,
  websiteController.deleteNewsEvent
);

// ============ Gallery ============
// Public routes
router.get('/gallery/published', websiteController.getAllGalleries);

// Admin routes
router.post('/gallery', 
  adminAuthentication,
  websiteController.createGallery
);

router.get('/gallery', 
  adminAuthentication,
  websiteController.getAllGalleries
);

router.put('/gallery/:id', 
  adminAuthentication,
  websiteController.updateGallery
);

router.delete('/gallery/:id', 
  adminAuthentication,
  websiteController.deleteGallery
);

// ============ Director's Message ============
// Public route
router.get('/director/message', websiteController.getActiveDirectorMessage);

// Admin routes
router.post('/director/message', 
  adminAuthentication,
  websiteController.createDirectorMessage
);

router.put('/director/message/:id', 
  adminAuthentication,
  websiteController.updateDirectorMessage
);

// ============ Faculty ============
// Public routes
router.get('/faculty', websiteController.getAllFaculty);

// Admin routes
router.post('/faculty', 
  adminAuthentication,
  websiteController.createFaculty
);

router.put('/faculty/:id', 
  adminAuthentication,
  websiteController.updateFaculty
);

router.delete('/faculty/:id', 
  adminAuthentication,
  websiteController.deleteFaculty
);

// ============ Notices ============
// Public route
router.get('/notices/active', websiteController.getActiveNotices);

// Admin routes
router.post('/notices', 
  adminAuthentication,
  websiteController.createNotice
);

router.get('/notices', 
  adminAuthentication,
  websiteController.getAllNotices
);

router.put('/notices/:id', 
  adminAuthentication,
  websiteController.updateNotice
);

router.delete('/notices/:id', 
  adminAuthentication,
  websiteController.deleteNotice
);

// ============ Testimonials ============
// Public route
router.get('/testimonials/published', websiteController.getAllTestimonials);

// Public route - Submit testimonial
router.post('/testimonials/submit', websiteController.createTestimonial);

// Admin routes
router.get('/testimonials', 
  adminAuthentication,
  websiteController.getAllTestimonials
);

router.put('/testimonials/:id', 
  adminAuthentication,
  websiteController.updateTestimonial
);

router.delete('/testimonials/:id', 
  adminAuthentication,
  websiteController.deleteTestimonial
);

// ============ Achievements ============
// Public route
router.get('/achievements/published', websiteController.getAllAchievements);

// Admin routes
router.post('/achievements', 
  adminAuthentication,
  websiteController.createAchievement
);

router.get('/achievements', 
  adminAuthentication,
  websiteController.getAllAchievements
);

router.put('/achievements/:id', 
  adminAuthentication,
  websiteController.updateAchievement
);

router.delete('/achievements/:id', 
  adminAuthentication,
  websiteController.deleteAchievement
);

module.exports = router;
