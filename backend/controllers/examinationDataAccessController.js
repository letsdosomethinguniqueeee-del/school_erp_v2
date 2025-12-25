const ExaminationDataAccess = require('../models/ExaminationDataAccess');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Create a new examination data access record
 */
exports.createExaminationDataAccess = async (req, res) => {
  try {
    const {
      academic_year_id,
      class_ids,
      section_ids,
      medium_ids,
      subject_ids,
      user_ids,
      permissions
    } = req.body;

    // Validation
    if (!academic_year_id) {
      return sendError(res, 400, 'Academic year is required');
    }

    if (!user_ids || user_ids.length === 0) {
      return sendError(res, 400, 'At least one user must be selected');
    }

    if (!permissions || (!permissions.view && !permissions.edit)) {
      return sendError(res, 400, 'At least one permission must be granted');
    }

    const accessRecord = new ExaminationDataAccess({
      academic_year_id,
      class_ids: class_ids || [],
      section_ids: section_ids || [],
      medium_ids: medium_ids || [],
      subject_ids: subject_ids || [],
      user_ids,
      permissions,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    await accessRecord.save();

    const populatedRecord = await ExaminationDataAccess.findById(accessRecord._id)
      .populate('academic_year_id', 'year_code start_date end_date status')
      .populate('class_ids', 'class_name')
      .populate('section_ids', 'section_name')
      .populate('medium_ids', 'medium_name')
      .populate('subject_ids', 'subject_name')
      .populate('user_ids', 'userId name role isActive')
      .populate('created_by', 'userId name')
      .populate('updated_by', 'userId name');

    return sendSuccess(
      res,
      201,
      'Examination data access created successfully',
      populatedRecord
    );
  } catch (error) {
    console.error('Error creating examination data access:', error);
    return sendError(res, 500, error.message || 'Failed to create examination data access');
  }
};

/**
 * Get all examination data access records
 */
exports.getAllExaminationDataAccess = async (req, res) => {
  try {
    const { academic_year_id, user_id } = req.query;

    const query = {};
    if (academic_year_id) query.academic_year_id = academic_year_id;
    if (user_id) query.user_ids = user_id;

    const accessRecords = await ExaminationDataAccess.find(query)
      .populate('academic_year_id', 'year_code start_date end_date status')
      .populate('class_ids', 'class_name')
      .populate('section_ids', 'section_name')
      .populate('medium_ids', 'medium_name')
      .populate('subject_ids', 'subject_name')
      .populate('user_ids', 'userId name role isActive')
      .populate('created_by', 'userId name')
      .populate('updated_by', 'userId name')
      .sort({ createdAt: -1 });

    return sendSuccess(
      res,
      200,
      'Examination data access records retrieved successfully',
      accessRecords
    );
  } catch (error) {
    console.error('Error fetching examination data access records:', error);
    return sendError(res, 500, error.message || 'Failed to fetch examination data access records');
  }
};

/**
 * Get examination data access record by ID
 */
exports.getExaminationDataAccessById = async (req, res) => {
  try {
    const { id } = req.params;

    const accessRecord = await ExaminationDataAccess.findById(id)
      .populate('academic_year_id', 'year_code start_date end_date status')
      .populate('class_ids', 'class_name')
      .populate('section_ids', 'section_name')
      .populate('medium_ids', 'medium_name')
      .populate('subject_ids', 'subject_name')
      .populate('user_ids', 'userId name role isActive')
      .populate('created_by', 'userId name')
      .populate('updated_by', 'userId name');

    if (!accessRecord) {
      return sendError(res, 404, 'Examination data access record not found');
    }

    return sendSuccess(
      res,
      200,
      'Examination data access record retrieved successfully',
      accessRecord
    );
  } catch (error) {
    console.error('Error fetching examination data access record:', error);
    return sendError(res, 500, error.message || 'Failed to fetch examination data access record');
  }
};

/**
 * Update examination data access record
 */
exports.updateExaminationDataAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      academic_year_id,
      class_ids,
      section_ids,
      medium_ids,
      subject_ids,
      user_ids,
      permissions
    } = req.body;

    const accessRecord = await ExaminationDataAccess.findById(id);
    if (!accessRecord) {
      return sendError(res, 404, 'Examination data access record not found');
    }

    // Validation
    if (user_ids && user_ids.length === 0) {
      return sendError(res, 400, 'At least one user must be selected');
    }

    if (permissions && !permissions.view && !permissions.edit) {
      return sendError(res, 400, 'At least one permission must be granted');
    }

    // Update fields
    if (academic_year_id) accessRecord.academic_year_id = academic_year_id;
    if (class_ids !== undefined) accessRecord.class_ids = class_ids;
    if (section_ids !== undefined) accessRecord.section_ids = section_ids;
    if (medium_ids !== undefined) accessRecord.medium_ids = medium_ids;
    if (subject_ids !== undefined) accessRecord.subject_ids = subject_ids;
    if (user_ids) accessRecord.user_ids = user_ids;
    if (permissions) accessRecord.permissions = permissions;
    accessRecord.updated_by = req.user.id;

    await accessRecord.save();

    const updatedRecord = await ExaminationDataAccess.findById(id)
      .populate('academic_year_id', 'year_code start_date end_date status')
      .populate('class_ids', 'class_name')
      .populate('section_ids', 'section_name')
      .populate('medium_ids', 'medium_name')
      .populate('subject_ids', 'subject_name')
      .populate('user_ids', 'userId name role isActive')
      .populate('created_by', 'userId name')
      .populate('updated_by', 'userId name');

    return sendSuccess(
      res,
      200,
      'Examination data access updated successfully',
      updatedRecord
    );
  } catch (error) {
    console.error('Error updating examination data access:', error);
    return sendError(res, 500, error.message || 'Failed to update examination data access');
  }
};

/**
 * Delete examination data access record
 */
exports.deleteExaminationDataAccess = async (req, res) => {
  try {
    const { id } = req.params;

    const accessRecord = await ExaminationDataAccess.findById(id);
    if (!accessRecord) {
      return sendError(res, 404, 'Examination data access record not found');
    }

    await ExaminationDataAccess.findByIdAndDelete(id);

    return sendSuccess(
      res,
      200,
      'Examination data access deleted successfully',
      null
    );
  } catch (error) {
    console.error('Error deleting examination data access:', error);
    return sendError(res, 500, error.message || 'Failed to delete examination data access');
  }
};

/**
 * Check if a user has access to examination data
 */
exports.checkUserAccess = async (req, res) => {
  try {
    // Support both GET (user_id in params) and POST (user_id in body or from req.user)
    const user_id = req.params.user_id || req.body.user_id || req.user?.id;
    
    if (!user_id) {
      return sendError(res, 400, 'User ID is required');
    }

    // Get filters from query params or body
    const filters = {
      academic_year_id: req.query.academic_year_id || req.body.academic_year_id,
      class_id: req.query.class_id || req.body.class_id,
      section_id: req.query.section_id || req.body.section_id,
      medium_id: req.query.medium_id || req.body.medium_id,
      subject_id: req.query.subject_id || req.body.subject_id
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const accessResult = await ExaminationDataAccess.checkUserAccess(user_id, filters);

    return sendSuccess(
      res,
      200,
      'Access check completed successfully',
      accessResult
    );
  } catch (error) {
    console.error('Error checking user access:', error);
    return sendError(res, 500, error.message || 'Failed to check user access');
  }
};
