const {
  ContactSubmission,
  NewsEvent,
  Gallery,
  DirectorMessage,
  Faculty,
  Notice,
  Testimonial,
  Achievement
} = require('../models/websiteContent');

// ============ Contact Submissions ============
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const submission = new ContactSubmission({
      name,
      email,
      phone,
      subject,
      message
    });
    
    await submission.save();
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you soon.',
      data: submission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllContactSubmissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    
    const submissions = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await ContactSubmission.countDocuments(query);
    
    res.json({
      success: true,
      data: submissions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = Date.now();
    
    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ News & Events ============
exports.createNewsEvent = async (req, res) => {
  try {
    const newsEvent = new NewsEvent({
      ...req.body,
      createdBy: req.user._id
    });
    
    await newsEvent.save();
    res.status(201).json({ success: true, data: newsEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllNewsEvents = async (req, res) => {
  try {
    const { category, isPublished, isFeatured } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    
    const newsEvents = await NewsEvent.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.json({ success: true, data: newsEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublishedNewsEvents = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    const query = { isPublished: true };
    
    if (category) query.category = category;
    
    const newsEvents = await NewsEvent.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: newsEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNewsEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };
    
    const newsEvent = await NewsEvent.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: newsEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNewsEvent = async (req, res) => {
  try {
    await NewsEvent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News/Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ Gallery ============
exports.createGallery = async (req, res) => {
  try {
    const gallery = new Gallery({
      ...req.body,
      createdBy: req.user._id
    });
    
    await gallery.save();
    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllGalleries = async (req, res) => {
  try {
    const { category, isPublished } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    
    const galleries = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    
    res.json({ success: true, data: galleries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };
    
    const gallery = await Gallery.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ Director's Message ============
exports.createDirectorMessage = async (req, res) => {
  try {
    // Deactivate all previous messages
    await DirectorMessage.updateMany({}, { isActive: false });
    
    const directorMessage = new DirectorMessage(req.body);
    await directorMessage.save();
    
    res.status(201).json({ success: true, data: directorMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveDirectorMessage = async (req, res) => {
  try {
    const message = await DirectorMessage.findOne({ isActive: true });
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDirectorMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };
    
    const message = await DirectorMessage.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ Faculty ============
exports.createFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    
    res.status(201).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllFaculty = async (req, res) => {
  try {
    const { department, isActive } = req.query;
    const query = {};
    
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const faculty = await Faculty.find(query).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };
    
    const faculty = await Faculty.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ Notices ============
exports.createNotice = async (req, res) => {
  try {
    const notice = new Notice({
      ...req.body,
      createdBy: req.user._id
    });
    
    await notice.save();
    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const { type, isActive, targetAudience } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (targetAudience) query.targetAudience = { $in: [targetAudience, 'all'] };
    
    const notices = await Notice.find(query)
      .sort({ isPinned: -1, publishDate: -1 })
      .populate('createdBy', 'name');
    
    res.json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveNotices = async (req, res) => {
  try {
    const now = new Date();
    const notices = await Notice.find({
      isActive: true,
      publishDate: { $lte: now },
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: now } }
      ]
    }).sort({ isPinned: -1, publishDate: -1 });
    
    res.json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };
    
    const notice = await Notice.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ Testimonials ============
exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const { isApproved, isPublished } = req.query;
    const query = {};
    
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    
    const testimonials = await Testimonial.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };
    
    const testimonial = await Testimonial.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ Achievements ============
exports.createAchievement = async (req, res) => {
  try {
    const achievement = new Achievement({
      ...req.body,
      createdBy: req.user._id
    });
    
    await achievement.save();
    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAchievements = async (req, res) => {
  try {
    const { category, isPublished } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    
    const achievements = await Achievement.find(query)
      .sort({ date: -1 })
      .populate('createdBy', 'name');
    
    res.json({ success: true, data: achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };
    
    const achievement = await Achievement.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
