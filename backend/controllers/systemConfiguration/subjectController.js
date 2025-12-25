const Subject = require('../../models/systemConfiguration/Subject');
const { sendSuccess, sendError } = require('../../utils/response');

// Create a new subject
const createSubject = async (req, res) => {
  try {
    const { subject_code, subject_name, is_active } = req.body;
    
    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ subject_code: subject_code.toUpperCase() });
    if (existingSubject) {
      return sendError(res, 409, 'Subject code already exists');
    }

    // Create new subject
    const subject = new Subject({
      subject_code: subject_code.toUpperCase(),
      subject_name: subject_name.trim(),
      is_active: is_active !== undefined ? is_active : true
    });

    await subject.save();

    return sendSuccess(res, 201, 'Subject created successfully', subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const { is_active, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Apply is_active filter if provided
    if (is_active !== undefined) {
      filter.is_active = is_active === 'true';
    }
    
    // Apply search filter if provided
    if (search) {
      filter.$or = [
        { subject_code: { $regex: search, $options: 'i' } },
        { subject_name: { $regex: search, $options: 'i' } }
      ];
    }

    const subjects = await Subject.find(filter).sort({ subject_code: 1 });

    return sendSuccess(res, 200, 'Subjects retrieved successfully', subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get subject by ID
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
      return sendError(res, 404, 'Subject not found');
    }

    return sendSuccess(res, 200, 'Subject retrieved successfully', subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Update subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_code, subject_name, is_active } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return sendError(res, 404, 'Subject not found');
    }

    // Check if subject code is being changed and if it already exists
    if (subject_code && subject_code.toUpperCase() !== subject.subject_code) {
      const existingSubject = await Subject.findOne({ 
        subject_code: subject_code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingSubject) {
        return sendError(res, 409, 'Subject code already exists');
      }
    }

    // Update fields
    if (subject_code) subject.subject_code = subject_code.toUpperCase();
    if (subject_name) subject.subject_name = subject_name.trim();
    if (is_active !== undefined) subject.is_active = is_active;

    await subject.save();

    return sendSuccess(res, 200, 'Subject updated successfully', subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Delete subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    const subject = await Subject.findById(id);
    if (!subject) {
      return sendError(res, 404, 'Subject not found');
    }

    if (permanent === 'true') {
      // Hard delete
      await Subject.findByIdAndDelete(id);
      return sendSuccess(res, 200, 'Subject deleted permanently');
    } else {
      // Soft delete
      subject.is_active = false;
      await subject.save();
      return sendSuccess(res, 200, 'Subject deactivated successfully');
    }
  } catch (error) {
    console.error('Error deleting subject:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get active subjects
const getActiveSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ is_active: true }).sort({ subject_code: 1 });

    return sendSuccess(res, 200, 'Active subjects retrieved successfully', subjects);
  } catch (error) {
    console.error('Error fetching active subjects:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getActiveSubjects
};
