const Class = require('../../models/systemConfiguration/Class');
const { sendSuccess, sendError } = require('../../utils/response');

// Create a new class
const createClass = async (req, res) => {
  try {
    const { class_code, class_name, class_order, is_active } = req.body;

    // NOTE: Field validation (required, format, type) is handled by validateClass middleware
    // Only business logic validations are done here

    // Check if class code already exists
    const existingClass = await Class.findOne({ class_code: class_code.toUpperCase() });
    if (existingClass) {
      return sendError(res, 409, 'Class code already exists');
    }

    // Create new class
    const classObj = new Class({
      class_code: class_code.toUpperCase(),
      class_name: class_name.trim(),
      class_order: class_order || 0,
      is_active: is_active !== undefined ? is_active : true
    });

    await classObj.save();

    return sendSuccess(res, 201, 'Class created successfully', classObj);
  } catch (error) {
    console.error('Error creating class:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
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
        { class_code: { $regex: search, $options: 'i' } },
        { class_name: { $regex: search, $options: 'i' } }
      ];
    }

    const classes = await Class.find(filter).sort({ class_order: 1, class_code: 1 });

    return sendSuccess(res, 200, 'Classes retrieved successfully', classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get class by ID
const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classObj = await Class.findById(id);

    if (!classObj) {
      return sendError(res, 404, 'Class not found');
    }

    return sendSuccess(res, 200, 'Class retrieved successfully', classObj);
  } catch (error) {
    console.error('Error fetching class:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Update class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_code, class_name, class_order, is_active } = req.body;

    const classObj = await Class.findById(id);
    if (!classObj) {
      return sendError(res, 404, 'Class not found');
    }

    // Check if new class code conflicts with existing classes (excluding current class)
    if (class_code && class_code !== classObj.class_code) {
      const existingClass = await Class.findOne({ 
        class_code: class_code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingClass) {
        return sendError(res, 409, 'Class code already exists');
      }
    }

    // Update fields
    if (class_code) classObj.class_code = class_code.toUpperCase();
    if (class_name) classObj.class_name = class_name.trim();
    if (class_order !== undefined) classObj.class_order = class_order;
    if (is_active !== undefined) classObj.is_active = is_active;

    await classObj.save();

    return sendSuccess(res, 200, 'Class updated successfully', classObj);
  } catch (error) {
    console.error('Error updating class:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Delete class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classObj = await Class.findById(id);

    if (!classObj) {
      return sendError(res, 404, 'Class not found');
    }

    await Class.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Class deleted successfully');
  } catch (error) {
    console.error('Error deleting class:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

// Get active classes
const getActiveClasses = async (req, res) => {
  try {
    const classes = await Class.find({ is_active: true }).sort({ class_order: 1, class_code: 1 });
    return sendSuccess(res, 200, 'Active classes retrieved successfully', classes);
  } catch (error) {
    console.error('Error fetching active classes:', error);
    return sendError(res, 500, 'Internal server error', error.message);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  getActiveClasses
};
